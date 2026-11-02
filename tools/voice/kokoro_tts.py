"""Kokoro TTS wrapper (adapted from the sister channel's renderer).

    python tools/voice/kokoro_tts.py <voice> <speed> <text-file> <out.wav>

Import `synth(text, voice, speed)` to get float32 mono audio at 24 kHz.
A short breath of silence is inserted between Kokoro's sentence chunks.
"""
import json
import os
import re
import sys

import numpy as np

SR = 24000
BREATH_S = 0.22
_PIPES = {}


def _pipe(lang):
    if lang not in _PIPES:
        from kokoro import KPipeline
        _PIPES[lang] = KPipeline(lang_code=lang)
    return _PIPES[lang]


def lang_for(voice):
    # Kokoro voice ids start with a language letter: a = American, b = British
    return voice[0]


PRON = os.path.join(os.path.dirname(__file__), "..", "..", "style", "pronunciations.json")


def apply_pronunciations(text):
    """Wrap listed words in Kokoro's inline phoneme syntax: [word](/phonemes/)."""
    if not os.path.exists(PRON):
        return text
    table = {k: v for k, v in json.load(open(PRON, encoding="utf-8")).items() if not k.startswith("_")}
    for word, ph in table.items():
        text = re.sub(rf"\b({re.escape(word)})\b", rf"[\1](/{ph}/)", text, flags=re.I)
    return text


def synth(text, voice, speed=1.0):
    text = apply_pronunciations(text)
    chunks = []
    for _g, _p, audio in _pipe(lang_for(voice))(text, voice=voice, speed=speed):
        if audio is None:
            continue
        a = audio.detach().cpu().numpy() if hasattr(audio, "detach") else np.asarray(audio)
        chunks.append(a.astype("float32"))
        chunks.append(np.zeros(int(SR * BREATH_S), dtype="float32"))
    if not chunks:
        raise RuntimeError(f"Kokoro produced no audio for voice {voice}")
    return np.concatenate(chunks)


def main():
    import soundfile as sf
    voice, speed, text_file, out = sys.argv[1], float(sys.argv[2]), sys.argv[3], sys.argv[4]
    text = open(text_file, encoding="utf-8").read().strip()
    sf.write(out, synth(text, voice, speed), SR)
    print(f"{voice}: wrote {out}")


if __name__ == "__main__":
    main()
