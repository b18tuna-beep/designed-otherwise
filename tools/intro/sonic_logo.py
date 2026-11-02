"""Sonic logo for THE HINGE (3.2 s). Original synthesis, no samples, so no license line is needed.

Events (seconds, frame):
  0.000 F0   graphite contact: soft band-passed noise stroke as the box traces in
  0.300 F9   dry contact tick
  0.900 F27  quiet mechanical alignment click
  1.500 F45  E4 (329.6 Hz) felt-mallet tone + faint hinge movement under it
  2.100 F63  A3 (220 Hz) warmer mallet tone + the latch (the recognition sound)
  2.1-3.2    natural decay; nothing new enters
Dry, intimate, a small room reflection. No sub drop, whoosh or sparkle.

    python tools/intro/sonic_logo.py out.wav [--short]
"""
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 3.2
rng = np.random.default_rng(7)


def t_axis(n):
    return np.arange(n) / SR


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lowpass(x, fc, order=2):
    return sosfilt(butter(order, fc, btype="low", fs=SR, output="sos"), x)


def place(buf, sig, at, gain=1.0):
    i = int(round(at * SR))
    n = min(len(sig), len(buf) - i)
    buf[i:i + n] += sig[:n] * gain


def graphite(length=0.28):
    n = int(length * SR)
    t = t_axis(n)
    env = np.minimum(1, t / 0.02) * np.exp(-t / 0.12) * (1 + 0.25 * np.sin(2 * np.pi * 23 * t))
    return bandpass(rng.standard_normal(n), 2200, 6500) * env


def tick(freq=3200, length=0.04, decay=0.004):
    n = int(length * SR)
    t = t_axis(n)
    body = np.sin(2 * np.pi * freq * t) * np.exp(-t / decay)
    noise = bandpass(rng.standard_normal(n), 1500, 9000) * np.exp(-t / 0.0015)
    return body * 0.6 + noise * 0.5


def mallet(f0, length=1.7, decay=0.55, bright=0.35):
    """Felt mallet on wood/ceramic: soft attack, a few inharmonic partials, little metallic shine."""
    n = int(length * SR)
    t = t_axis(n)
    partials = [(1.0, 1.0, decay), (2.01, 0.28 * bright / 0.35, decay * 0.5), (3.9, 0.10 * bright / 0.35, decay * 0.25),
                (0.5, 0.06, decay * 1.2)]
    s = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t / d) for r, a, d in partials)
    attack = np.minimum(1, t / 0.006)
    thump = lowpass(rng.standard_normal(n), 900) * np.exp(-t / 0.008) * 0.25
    return lowpass(s * attack + thump, 4500)


def hinge(length=0.6):
    n = int(length * SR)
    t = t_axis(n)
    env = np.sin(np.pi * np.clip(t / length, 0, 1)) ** 2
    grain = bandpass(rng.standard_normal(n), 600, 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * 38 * t) ** 8)
    return grain * env


def latch():
    """Close, firm latch: a low body knock plus two quick metallic transients 9 ms apart."""
    n = int(0.12 * SR)
    t = t_axis(n)
    knock = np.sin(2 * np.pi * 140 * t) * np.exp(-t / 0.018) * np.minimum(1, t / 0.001)
    out = knock * 0.8
    c1 = tick(2600, 0.05, 0.003)
    c2 = tick(3400, 0.05, 0.0025)
    out[:len(c1)] += c1 * 0.9
    i = int(0.009 * SR)
    out[i:i + len(c2)] += c2[: n - i] * 0.6
    return out


def room(x):
    """Small room: a handful of early reflections and a short damped tail."""
    y = x.copy()
    for ms, g in ((7, 0.22), (13, 0.15), (21, 0.10), (34, 0.06)):
        i = int(ms * SR / 1000)
        y[i:] += x[:-i] * g
    tail_n = int(0.35 * SR)
    ir = rng.standard_normal(tail_n) * np.exp(-np.arange(tail_n) / (0.08 * SR)) * 0.02
    return y + lowpass(np.convolve(x, ir)[: len(x)], 5000)


def build():
    buf = np.zeros(int(DUR * SR))
    place(buf, graphite(), 0.0, 0.20)
    place(buf, tick(3200), 0.300, 0.32)
    place(buf, tick(1900, 0.05, 0.005), 0.900, 0.34)
    place(buf, tick(2400, 0.05, 0.003), 0.915, 0.17)
    place(buf, hinge(0.62), 1.47, 0.035)
    place(buf, mallet(329.63, decay=0.5), 1.500, 0.55)
    place(buf, mallet(220.0, length=1.2, decay=0.7, bright=0.25), 2.100, 0.70)
    place(buf, latch(), 2.100, 0.45)
    out = room(buf)
    # end the cue before F96: fade the last 80 ms to silence
    fade = int(0.08 * SR)
    out[-fade:] *= np.linspace(1, 0, fade)
    out[:int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    return out


def build_short():
    """2 s Shorts end-card version: the door completes F12-23, so the two notes land at 0.40 s and 0.77 s."""
    global DUR
    DUR = 2.0
    buf = np.zeros(int(DUR * SR))
    place(buf, mallet(329.63, length=1.2, decay=0.4), 0.40, 0.55)
    place(buf, mallet(220.0, length=1.2, decay=0.6, bright=0.25), 0.77, 0.70)
    place(buf, latch(), 0.77, 0.45)
    out = room(buf)
    fade = int(0.15 * SR)
    out[-fade:] *= np.linspace(1, 0, fade)
    return out


if __name__ == "__main__":
    y = build_short() if "--short" in sys.argv else build()
    y = y / np.max(np.abs(y)) * 10 ** (-3 / 20)   # -3 dBFS sample peak; level set in the mix
    stereo = np.stack([y, y], axis=1).astype(np.float32)
    wavfile.write(sys.argv[1], SR, stereo)
    print("wrote", sys.argv[1])
