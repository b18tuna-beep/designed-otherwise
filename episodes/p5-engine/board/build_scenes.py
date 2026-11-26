"""Time the storyboard against the narration.

    python episodes/<ep>/board/build_scenes.py <words.json> [out scenes.json]

Script words are aligned to the whisper transcript (numbers are spoken as words in
the script but transcribed as digits, so alignment interpolates across them).
A scene starts at its anchor's first word and ends where the next scene starts.
"""
import difflib
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from scenes_src import CHAPTERS, SCENES  # noqa: E402

LEAD_IN = 0.0     # video starts with the first word
TAIL = 1.5        # hold after the last word


def norm(s):
    return re.findall(r"[a-z0-9']+", s.lower().replace("’", "'"))


def main():
    words = json.load(open(sys.argv[1]))["words"]
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(EP, "scenes", "scenes.json")
    script = norm(open(os.path.join(EP, "script", "narration.txt"), encoding="utf-8").read())
    heard, heard_idx = [], []
    for i, w in enumerate(words):
        for t in norm(w["w"]):
            heard.append(t)
            heard_idx.append(i)

    # map each script token to a time
    sm = difflib.SequenceMatcher(a=script, b=heard, autojunk=False)
    t_of = [None] * len(script)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            t_of[a + k] = words[heard_idx[b + k]]["start"]
    known = [i for i, t in enumerate(t_of) if t is not None]
    for i in range(len(script)):
        if t_of[i] is None:
            prev = max((k for k in known if k < i), default=None)
            nxt = min((k for k in known if k > i), default=None)
            if prev is None:
                t_of[i] = t_of[nxt]
            elif nxt is None:
                t_of[i] = t_of[prev]
            else:
                f = (i - prev) / (nxt - prev)
                t_of[i] = t_of[prev] + f * (t_of[nxt] - t_of[prev])

    end_of_speech = words[-1]["end"]
    starts, pos = [], 0
    for s in SCENES:
        a = norm(s["anchor"])
        for i in range(pos, len(script) - len(a) + 1):
            if script[i:i + len(a)] == a:
                starts.append((i, t_of[i]))
                pos = i + 1
                break
        else:
            raise SystemExit(f"anchor not found in order: {s['id']} '{s['anchor']}'")

    def cue_times(changes, i0, i1, t0, dur):
        """Each change 'x on \'phrase\'' lands 0.1 s before the phrase's first word (2-4 frames early)."""
        out = []
        for j, ch in enumerate(changes):
            # phrase runs to the LAST quote, so apostrophes inside it ("couldn't", "condenser's") survive
            m = re.search(r" on '(.+)'\s*$", ch)
            t = None
            if m:
                ph = norm(m.group(1))
                lo, hi = max(0, i0 - 3), min(len(script), i1 + 3)
                for i in range(lo, hi - len(ph) + 1):
                    if script[i:i + len(ph)] == ph:
                        t = t_of[i] - t0 - 0.1
                        break
            if t is None:  # no anchor phrase: spread through the scene
                t = dur * (j + 1) / (len(changes) + 1)
                if m:
                    print(f"WARNING: cue phrase not found, spaced evenly instead: {ch!r}", file=sys.stderr)
            out.append(round(min(max(t, 0.3), max(dur - 0.6, 0.3)), 2))
        return out

    ids = [s["id"] for s in SCENES]
    result = []
    for k, s in enumerate(SCENES):
        i0, t0 = starts[k]
        t0 = 0.0 if k == 0 else t0 - 0.15  # cut lands a few frames before the word
        t1 = (starts[k + 1][1] - 0.15) if k + 1 < len(SCENES) else end_of_speech + TAIL
        i1 = starts[k + 1][0] if k + 1 < len(SCENES) else len(script)
        d = round(t1 - t0, 2)
        cues = cue_times(s["changes"], i0, i1, t0, d)
        result.append({**s, "clock_start": None, "clock_end": None, "static_s": None, "start": round(t0, 2), "end": round(t1, 2), "duration": d, "cues": cues,
                       "words": " ".join(script[i0:i1]),
                       "change_every_s": round(d / max(len(s["changes"]), 1), 1)})
    # crank degrees at each scene's start and end: linear inside a chapter, holding outside any chapter
    for name, a, z, d0, d1 in CHAPTERS:
        ra, rz = result[ids.index(a)], result[ids.index(z)]
        span = rz["end"] - ra["start"]
        for r in result[ids.index(a): ids.index(z) + 1]:
            r["clock_start"] = round(d0 + (d1 - d0) * (r["start"] - ra["start"]) / span, 1)
            r["clock_end"] = round(d0 + (d1 - d0) * (r["end"] - ra["start"]) / span, 1)
            r["chapter"] = name
    # longest stretch with no change inside each scene (start, each cue, end)
    for r in result:
        pts = [0.0] + sorted(r["cues"]) + [r["duration"]]
        r["static_s"] = round(max(b - a for a, b in zip(pts, pts[1:])), 1)
    json.dump({"source_words": os.path.relpath(sys.argv[1], EP), "fps": 30,
               "total_s": round(result[-1]["end"], 2), "scenes": result},
              open(out, "w"), indent=1, ensure_ascii=False)
    worst = max(result, key=lambda r: r["static_s"])
    over = [(r["id"], r["static_s"]) for r in result if r["static_s"] > 8]
    print(f"{len(result)} scenes, {result[-1]['end']:.1f} s; longest static stretch {worst['static_s']} s ({worst['id']}); over 8 s: {over}")


if __name__ == "__main__":
    main()
