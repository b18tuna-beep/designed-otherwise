"""Render the same paragraph in several Kokoro voices.

    python tools/voice/audition.py am_michael,am_fenrir,af_heart,bm_george 1.0 tools/voice/audition_text.txt out/voices
"""
import os
import sys

import soundfile as sf

sys.path.insert(0, os.path.dirname(__file__))
from kokoro_tts import SR, synth  # noqa: E402


def main():
    voices = [v.strip() for v in sys.argv[1].split(",") if v.strip()]
    speed = float(sys.argv[2])
    text = open(sys.argv[3], encoding="utf-8").read().strip()
    out_dir = sys.argv[4]
    os.makedirs(out_dir, exist_ok=True)
    for v in voices:
        path = os.path.join(out_dir, f"{v}.wav")
        audio = synth(text, v, speed)
        sf.write(path, audio, SR)
        print(f"{v}: {len(audio) / SR:.1f}s -> {path}", flush=True)


if __name__ == "__main__":
    main()
