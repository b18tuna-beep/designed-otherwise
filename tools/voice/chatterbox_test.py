"""Backup TTS check: render one paragraph with Chatterbox (CPU).

    python tools/voice/chatterbox_test.py tools/voice/audition_text.txt out/voices/chatterbox.wav
"""
import sys

import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

text = open(sys.argv[1], encoding="utf-8").read().strip()
model = ChatterboxTTS.from_pretrained(device="cpu")
wav = model.generate(text, exaggeration=0.4, cfg_weight=0.5)
ta.save(sys.argv[2], wav, model.sr)
print(f"chatterbox: {wav.shape[-1] / model.sr:.1f}s -> {sys.argv[2]}")
