"""P2 hero H2 (scene S16) and H5 (scene S32, --mode h5): the travelling wave.

The unrolled basilar membrane as a long chalk ribbon, base on the left (narrow,
stiff) widening ~4.5x to the apex on the right, held along both edges by thin muted
rails (the edges are attached, so displacement is zero there and largest mid-width).
H2: two forward passes; a high pitch peaks near the base, then a low pitch near
the apex. Each wave starts at the base, grows to a peak, and dies just past it.
H5: a forward wave runs in and peaks mid-membrane, then a small reverse wave runs
back out toward the base (the emission); then a quieter second cycle.
Neutral render; crest lines and violet overlays are 2D. Units: 1 BU = 1 mm,
ribbon 30 mm long, width 1.0 to 4.5 mm (width exaggerated ~9x so it reads, 4.5x ratio kept).

    python h2_wave.py -- <out_dir> [first last] [--frames N] [--res PCT] [--samples S] [--mode h2|h5] [--test ...]
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from ear_common import (T, Args, DynMesh, camera, lerp, place_camera, render_loop,  # noqa: E402
                        satin, seg, setup_scene, sun, tri_quads)
from ear_wave import Pass, total  # noqa: E402

DEFAULT_FRAMES = {"h2": 332, "h5": 375}
args = Args(332, "h2")
MODE = args.mode
if "--frames" not in sys.argv and MODE != "h2":
    args.frames = DEFAULT_FRAMES[MODE]
    if args.frame_list == list(range(1, 333)):
        args.frame_list = list(range(1, args.frames + 1))
DUR = args.frames / 30.0

LEN = 30.0
NX, NY = 640, 15
X = np.linspace(0, 1, NX)
W = lerp(1.0, 4.5, X)
V = np.linspace(-0.5, 0.5, NY)
ACROSS = np.sin(np.pi * (V + 0.5))
XX = (X - 0.5) * LEN


def ribbon(z):
    P = np.zeros((NX, NY, 3))
    P[..., 0] = XX[:, None]
    P[..., 1] = W[:, None] * V[None, :]
    P[..., 2] = z[:, None] * ACROSS[None, :]
    return P.reshape(-1, 3)


def rail(sign, r=0.07, k=10):
    a = np.linspace(0, 2 * np.pi, k, endpoint=False)
    xs = np.concatenate([[XX[0] - 0.4], XX[::4], [XX[-1] + 0.4]])
    ws = np.interp(xs, XX, W)
    c = np.stack([xs, sign * (ws / 2 + r * 0.6), np.zeros_like(xs)], -1)
    ring = np.stack([np.zeros(k), r * np.cos(a), r * np.sin(a)], -1)
    P = (c[:, None, :] + ring[None]).reshape(-1, 3)
    return P, tri_quads(len(xs), k, closed_cols=True)


sc = setup_scene(args)
mem_mat = satin("membrane", T["chalk"], rough=0.42, spec=0.45, sheen=0.3)
rail_mat = satin("rail", T["muted"], rough=0.7, spec=0.2)
mem = DynMesh("membrane", ribbon(np.zeros(NX)), tri_quads(NX, NY), mem_mat)
sol = mem.ob.modifiers.new("thick", "SOLIDIFY")
sol.thickness = 0.06
sol.offset = 0.0
for s_ in (-1, 1):
    P, F = rail(s_)
    DynMesh("rail", P, F, rail_mat)

sun((26, -155), 1.7)                                   # raking key from the left: shows wave relief
sun((30, 60), 2.0, color=(0.90, 0.95, 1.0), angle_deg=6)   # cool rim
sun((60, -90), 0.25)                                    # soft top fill so the far side is not black
cam = camera(50)
cam.data.clip_start = 0.1

if MODE == "h2":
    # cues: 3.25 'from the base', 4.43 'grows to a peak', 9.29 'travelling wave'
    PASSES = [Pass(3.1, 0.22, 1.8, 1.2, t_front=1.25, hold=0.7, t_fade=0.7, lam0=0.22, sigma=0.08),
              Pass(7.35, 0.74, 1.1, 1.3, t_front=1.95, hold=0.8, t_fade=0.8, lam0=0.36, sigma=0.08)]

    def cam_state(t):
        return (0.3, 0.0, 0.0), lerp(53.0, 50.0, seg(t, 0, DUR)), lerp(33.0, 35.0, seg(t, 0, DUR)), lerp(-4.0, -1.0, seg(t, 0, DUR))
else:
    # cues: 4.37 'sends a tiny wave back out' (then 2D takes over at 7.83)
    PASSES = [Pass(0.2, 0.55, 1.3, 1.5, t_front=1.6, hold=1.6, t_fade=1.0, lam0=0.28, sigma=0.08),
              Pass(4.05, 0.55, 1.3, 0.55, t_front=2.8, hold=0.3, t_fade=0.6, lam0=0.28, sigma=0.08, reverse=True),
              Pass(7.6, 0.55, 1.3, 1.1, t_front=1.6, hold=0.8, t_fade=0.8, lam0=0.28, sigma=0.08),
              Pass(10.4, 0.55, 1.3, 0.42, t_front=1.8, hold=0.1, t_fade=0.4, lam0=0.28, sigma=0.08, reverse=True)]

    def cam_state(t):
        # drift toward the base as the emission runs out
        return (lerp(0.8, -0.8, seg(t, 3.5, 8.0)), 0.0, 0.0), lerp(53.0, 50.5, seg(t, 0, DUR)), 34.0, lerp(-2.0, -6.0, seg(t, 0, DUR))


def update(t, f):
    mem.set_verts(ribbon(total(PASSES, X, t)))
    target, d, el, az = cam_state(t)
    place_camera(cam, target, d, el, az)


render_loop(args, update, MODE.upper())
