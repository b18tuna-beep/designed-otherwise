"""Narrate a script.md locally, line by line, with timed pauses (P4 onwards).

    python tools/voice/narrate_script.py <script.md> <out.wav> [voice=bm_george] [speed=1.0]

Reads the script from the first "## " section: one spoken line per text line, the trailing [claim ids] stripped.
Pauses: LINE_GAP between lines, SECTION_GAP at each new "## " section, BEAT_S where a "(1 s beat)" line sits.
Each line is synthesised on its own (Kokoro's own sentence breath still applies inside a line), so pauses are exact
and a single line can be re-voiced later without moving the rest by more than its own length change.
Writes <out.wav> plus <out>.lines.json (start/end of every line) for checks and scene anchoring.
The voice is Michael's choice: bm_george at 1.0 (style/voice.md). Never change it without his approval.
"""
import json
import os
import re
import sys

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kokoro_tts import SR, synth  # noqa: E402

LINE_GAP = 0.30
SECTION_GAP = 0.90
BEAT_S = 1.0
LEAD_IN = 0.40


def parse(path):
    """-> list of (kind, text): kind 'line' | 'section' | 'beat'."""
    out, started = [], False
    for raw in open(path, encoding="utf-8"):
        l = raw.strip()
        if l.startswith("## "):
            if started:
                out.append(("section", l[3:]))
            started = True
            continue
        if not started or not l:
            continue
        if l.startswith("("):
            if "beat" in l:
                out.append(("beat", l))
            continue
        out.append(("line", re.sub(r"\s*\[[^\]]*\]\s*$", "", l)))
    return out


def main():
    script, out = sys.argv[1], sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else "bm_george"
    speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
    parts, lines, t = [np.zeros(int(SR * LEAD_IN), "float32")], [], LEAD_IN
    pending = 0.0
    for kind, text in parse(script):
        if kind == "section":
            pending = max(pending, SECTION_GAP)
            continue
        if kind == "beat":
            pending = max(pending, BEAT_S)
            continue
        if lines:
            gap = max(pending, LINE_GAP)
            parts.append(np.zeros(int(SR * gap), "float32"))
            t += gap
        pending = 0.0
        a = synth(text, voice, speed)
        a = np.trim_zeros(a, "b")  # drop Kokoro's trailing breath: the gap above is the pause
        parts.append(a)
        lines.append({"text": text, "start": round(t, 3), "end": round(t + len(a) / SR, 3)})
        t += len(a) / SR
        print(f"{lines[-1]['start']:7.2f} {text[:70]}", flush=True)
    parts.append(np.zeros(int(SR * 1.0), "float32"))
    sf.write(out, np.concatenate(parts), SR)
    json.dump(lines, open(os.path.splitext(out)[0] + ".lines.json", "w"), indent=1)
    print(f"wrote {out} ({t + 1.0:.1f} s, {len(lines)} lines)")


if __name__ == "__main__":
    main()
