"""Assemble FPI P1: silent animation + narration + ducked music + captions, then run checks.

    python tools/audio/assemble.py <video.mp4> <narration.flac> <out_dir>

Writes out_dir/final.mp4, captions.srt, mix.wav, checks.json. Exit 1 if any check fails.
Music plan: Dreamscape under beats 1-4, Frame-Dragging under beats 5-7, 2 s crossfade,
bed at -30 LUFS, sidechain-ducked under the voice, master -14 LUFS / -1.5 dBTP (limiter set to -2.0 for AAC overshoot).
"""
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
EP = os.path.join(ROOT, "episodes", "p1-refrigerator")
sys.path.insert(0, HERE)
from mix import duration, loudness, mix, music_bed, sh  # noqa: E402

MUSIC = [("Dreamscape - Density & Time.mp3", 1), ("Frame-Dragging - The Grey Room & Density & Time.mp3", 5)]


def norm(s):
    return re.findall(r"[a-z0-9']+", s.lower().replace("’", "'"))


def word_times():
    """Script words (with punctuation, for captions) mapped to narration times."""
    import difflib
    words = json.load(open(os.path.join(EP, "audio", "final.words.json")))["words"]
    raw = open(os.path.join(EP, "script", "narration.txt"), encoding="utf-8").read().split()
    toks, owner = [], []
    for i, w in enumerate(raw):
        for t in norm(w):
            toks.append(t)
            owner.append(i)
    heard, hidx = [], []
    for i, w in enumerate(words):
        for t in norm(w["w"]):
            heard.append(t)
            hidx.append(i)
    sm = difflib.SequenceMatcher(a=toks, b=heard, autojunk=False)
    st = [None] * len(toks)
    en = [None] * len(toks)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            st[a + k] = words[hidx[b + k]]["start"]
            en[a + k] = words[hidx[b + k]]["end"]
    known = [i for i, t in enumerate(st) if t is not None]
    for i in range(len(toks)):
        if st[i] is None:
            p = max((k for k in known if k < i), default=known[0])
            q = min((k for k in known if k > i), default=known[-1])
            f = 0 if q == p else (i - p) / (q - p)
            st[i] = st[p] + f * (st[q] - st[p])
            en[i] = st[i] + 0.25
    out = {}
    for t_i, w_i in enumerate(owner):
        s0, e0 = out.get(w_i, (st[t_i], en[t_i]))
        out[w_i] = (min(s0, st[t_i]), max(e0, en[t_i]))
    return [(raw[i], out[i][0], out[i][1]) for i in range(len(raw))]


def captions(path, max_chars=42):
    wt = word_times()
    lines, cur = [], []
    for w, s, e in wt:
        if cur and (len(" ".join(x[0] for x in cur + [(w,)])) > max_chars):
            lines.append(cur)
            cur = []
        cur.append((w, s, e))
        if re.search(r"[.?!]$", w):
            lines.append(cur)
            cur = []
    if cur:
        lines.append(cur)

    def ts(x):
        h, r = divmod(max(x, 0), 3600)
        m, s = divmod(r, 60)
        return f"{int(h):02d}:{int(m):02d}:{s:06.3f}".replace(".", ",")
    with open(path, "w", encoding="utf-8") as fh:
        prev_end = 0.0
        for i, ln in enumerate(lines, 1):
            start = ln[0][1]
            end = ln[-1][2] + 0.25
            if i < len(lines):
                nxt = lines[i][0][1]
                # the aligner sometimes gives a short line the same start as the next one; keep >= 0.5 s on screen
                start = max(prev_end + 0.02, min(start, nxt - 0.5))
                end = min(end, nxt - 0.02)
            end = max(end, start + 0.3)
            prev_end = end
            fh.write(f"{i}\n{ts(start)} --> {ts(end)}\n{' '.join(w for w, _, _ in ln)}\n\n")
    return len(lines)


def main():
    video, narration, out = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(out, exist_ok=True)
    scenes = json.load(open(os.path.join(EP, "scenes", "scenes.json")))
    total = scenes["total_s"]
    vdur = duration(video)

    # narration padded to the video length
    narr = os.path.join(out, "narration.wav")
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", narration, "-af", f"apad=whole_dur={vdur:.3f}", "-t", f"{vdur:.3f}",
       "-ar", "48000", "-ac", "1", narr)

    # music: one bed per half, crossfaded at the start of beat 5
    split = next(s["start"] for s in scenes["scenes"] if s["beat"] == 5)
    a = music_bed(os.path.join(ROOT, "assets", "music", MUSIC[0][0]), split + 1.0, os.path.join(out, "music-a.wav"))
    b = music_bed(os.path.join(ROOT, "assets", "music", MUSIC[1][0]), vdur - split + 1.0, os.path.join(out, "music-b.wav"))
    bed = os.path.join(out, "music.wav")
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", a, "-i", b, "-filter_complex",
       "[0:a][1:a]acrossfade=d=2:c1=tri:c2=tri[m]", "-map", "[m]", "-t", f"{vdur:.3f}", bed)
    mixed = mix(narr, bed, vdur, os.path.join(out, "mix.wav"))

    srt = os.path.join(out, "captions.srt")
    n_caps = captions(srt)

    final = os.path.join(out, "final.mp4")
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", mixed, "-map", "0:v", "-map", "1:a",
       "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", final)

    # ---------------------------------------------------------------- checks
    ld = loudness(final)
    fdur = duration(final)
    sil = sh("ffmpeg", "-hide_banner", "-nostats", "-i", narr, "-af", "silencedetect=noise=-40dB:d=2.5", "-f", "null", "-")
    gaps = [float(x) for x in re.findall(r"silence_duration: ([0-9.]+)", sil)]
    speech_end = json.load(open(os.path.join(EP, "audio", "final.words.json")))["words"][-1]["end"]
    starts = re.findall(r"silence_start: ([0-9.]+)", sil)
    inner_gaps = [(float(s), g) for s, g in zip(starts, gaps) if float(s) < speech_end - 0.5]
    vol = sh("ffmpeg", "-hide_banner", "-nostats", "-i", final, "-af", "volumedetect", "-f", "null", "-")
    peak = float(re.search(r"max_volume: (-?[0-9.]+) dB", vol).group(1))
    checks = {
        "loudness_lufs": ld["lufs"], "loudness_ok": abs(ld["lufs"] + 14) <= 1.0,
        "true_peak_dbtp": ld["true_peak"], "true_peak_ok": ld["true_peak"] <= -1.5,
        "sample_peak_db": peak, "no_clipping": peak < -0.1,
        "video_s": vdur, "final_s": fdur, "timeline_s": total,
        "sync_ok": abs(vdur - total) < 0.1 and abs(fdur - vdur) < 0.1,
        "narration_gaps_over_2_5s": inner_gaps, "gaps_ok": not inner_gaps,
        "captions": n_caps,
    }
    json.dump(checks, open(os.path.join(out, "checks.json"), "w"), indent=1)
    print(json.dumps(checks, indent=1))
    ok = all(v for k, v in checks.items() if k.endswith("_ok") or k == "no_clipping")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
