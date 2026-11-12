"""P2 hero H1 (scene S13) and H7 (scene S40): the cochlea.

H1: a matte bone-white snail shell (2.5 turns, ~9 mm base, ~5 mm tall) rotates
slowly under a cool rim light, then uncoils into a straight ~3 cm tube; the tube
fades to a rim-only ghost to reveal the basilar membrane strip inside, narrow at
the base (left) and ~4.4x wider at the apex (right).
H7 (--mode h7): starts close on the revealed straight membrane, pulls back, gentle
travelling-wave ripples run along it, then it re-coils into the shell, which ends
small in frame (2D adds the ear section and violet rings).

Geometry (research/assets.md, 3D reference): logarithmic spiral, 2.5 turns,
centreline radius 3.35 mm to 0.85 mm, duct radius 1.05 mm (base) to 0.62 mm
(apex), so outer base diameter ~8.8 mm and height ~5.4 mm; centreline length ~30 mm.
Membrane width 0.25 mm to 1.1 mm: the real 0.1-0.5 mm, scaled ~2.3x so it reads at
1080p, keeping the base-to-apex ratio (~4.4x). Units: 1 BU = 1 mm.

    python h1_cochlea.py -- <out_dir> [first last] [--frames N] [--res PCT] [--samples S] [--mode h1|h7] [--test 1,200]
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from ear_common import (T, Args, DynMesh, camera, ease, ghost_material, lerp, place_camera,  # noqa: E402
                        render_loop, satin, seg, setup_scene, smoothstep, sun, tri_quads)
from ear_wave import Pass, total  # noqa: E402

DEFAULT_FRAMES = {"h1": 594, "h7": 605}
args = Args(594, "h1")
MODE = args.mode
if "--frames" not in sys.argv:
    args.frames = DEFAULT_FRAMES[MODE]
    if len(args.frame_list) == 594 and MODE == "h7":
        args.frame_list = list(range(1, args.frames + 1))
DUR = args.frames / 30.0

# ------------------------------------------------------------------ coiled centreline
TURNS = 2.5
R0, R1 = 3.35, 0.85
HC = 3.4
M = 320
th_f = np.linspace(0, TURNS * 2 * np.pi, 6000)
kk = math.log(R0 / R1) / th_f[-1]
rr = R0 * np.exp(-kk * th_f)
zz = HC * (1 - (1 - th_f / th_f[-1]) ** 1.6)    # rise flattens: apex tucked under a dome
Pf = np.stack([rr * np.cos(th_f), rr * np.sin(th_f), zz], -1)
sl = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(Pf, axis=0), axis=1))])
LENGTH = sl[-1]
s_u = np.linspace(0, LENGTH, M)
C0 = np.stack([np.interp(s_u, sl, Pf[:, i]) for i in range(3)], -1)
X = s_u / LENGTH                                   # 0 base .. 1 apex
RT = lerp(1.05, 0.62, X)                            # duct radius
WM = lerp(0.25, 1.10, X)                            # membrane width
AXIS_PT = np.array([0.0, 0.0, HC / 2])
print("cochlea centreline length %.1f mm, base outer diameter %.1f mm, height %.1f mm"
      % (LENGTH, 2 * (R0 + RT[0]), HC + RT[0] + RT[-1]))

dseg = np.diff(C0, axis=0)
Lseg = np.linalg.norm(dseg, axis=1)
psi = np.unwrap(np.arctan2(dseg[:, 1], dseg[:, 0]))
alpha = np.arcsin(dseg[:, 2] / Lseg)
PSI0 = psi[0]


def centreline(u):
    """u=0 coiled, u=1 straight (all turning and rise scaled by 1-u, base fixed)."""
    p = PSI0 + (1 - u) * (psi - PSI0)
    a = (1 - u) * alpha
    steps = Lseg[:, None] * np.stack([np.cos(a) * np.cos(p), np.cos(a) * np.sin(p), np.sin(a)], -1)
    C = np.concatenate([np.zeros((1, 3)), np.cumsum(steps, axis=0)])
    C = C + C0[0]
    w = float(smoothstep(0, 0.3, u))
    pivot = (1 - w) * AXIS_PT + w * 0.5 * (C.min(0) + C.max(0))
    return C - pivot


def frames_of(C):
    t = np.gradient(C, axis=0)
    t /= np.linalg.norm(t, axis=1, keepdims=True)
    n = np.cross(np.array([0.0, 0.0, 1.0]), t)
    n /= np.linalg.norm(n, axis=1, keepdims=True)
    b = np.cross(t, n)
    return t, n, b


# ------------------------------------------------------------------ topology
K = 28
CAP = 4
ang = np.linspace(0, 2 * np.pi, K, endpoint=False)
ROWS = CAP + M + CAP


def tube_faces():
    F = list(tri_quads(ROWS, K, closed_cols=True))
    p0, p1 = ROWS * K, ROWS * K + 1
    last = (ROWS - 1) * K
    for j in range(K):
        j1 = (j + 1) % K
        F.append([p0, j1, j, j])
        F.append([last + j, last + j1, p1, p1])
    return np.asarray(F)


def tube_verts(C, t, n, b):
    ca, sa = np.cos(ang)[None, :, None], np.sin(ang)[None, :, None]
    main = C[:, None, :] + RT[:, None, None] * (ca * n[:, None, :] + sa * b[:, None, :])
    caps = []
    for end, sign in ((0, -1), (M - 1, 1)):
        phis = np.linspace(0, np.pi / 2, CAP + 2)[1:-1]
        order = phis[::-1] if sign < 0 else phis
        rings = []
        for ph in order:
            r = RT[end] * math.cos(ph)
            c = C[end] + sign * t[end] * RT[end] * math.sin(ph) * 0.8
            rings.append(c[None, :] + r * (ca[0] * n[end][None, :] + sa[0] * b[end][None, :]))
        caps.append(np.stack(rings))
    poles = np.stack([C[0] - t[0] * RT[0] * 0.8, C[-1] + t[-1] * RT[-1] * 0.8])
    return np.concatenate([caps[0].reshape(-1, 3), main.reshape(-1, 3), caps[1].reshape(-1, 3), poles])


NV = 9
VV = np.linspace(-0.5, 0.5, NV)


def ribbon_verts(C, n, b, lift):
    across = np.sin(np.pi * (VV + 0.5))[None, :, None]
    V = (C[:, None, :] + (WM[:, None, None] * VV[None, :, None]) * n[:, None, :]
         + lift[:, None, None] * across * b[:, None, :])
    return V.reshape(-1, 3)


# ------------------------------------------------------------------ scene
sc = setup_scene(args)
tube_mat, tube_op = ghost_material("bone", T["chalk"], rough=0.8)
mem_mat = satin("membrane", T["chalk"], rough=0.45, spec=0.45, sheen=0.3)

C = centreline(0.0)
t_, n_, b_ = frames_of(C)
tube = DynMesh("cochlea", tube_verts(C, t_, n_, b_), tube_faces(), tube_mat)
mem = DynMesh("membrane", ribbon_verts(C, n_, b_, np.zeros(M)), tri_quads(M, NV), mem_mat)
sol = mem.ob.modifiers.new("thick", "SOLIDIFY")
sol.thickness = 0.05
sol.offset = 0.0

sun((30, -150), 2.8)                               # key: left, raking so the turns read
sun((32, 58), 3.2, color=(0.90, 0.95, 1.0), angle_deg=6)   # cool rim from behind-right
sun((10, -40), 0.25)                                # faint front fill
cam = camera(50)
cam.data.clip_start = 0.1
cam.data.clip_end = 1000

# ------------------------------------------------------------------ timelines
DT = 1 / 300.0
TG = np.arange(0, DUR + 1, DT)
DEG = math.pi / 180


def integrate(speed):
    return np.concatenate([[0], np.cumsum(0.5 * (speed[1:] + speed[:-1]) * DT)])


R_FINAL = -PSI0        # straight tube ends along +X: base left, apex right

if MODE == "h1":
    # cues: 4.87 'snail shell', 8.45 'unrolled', 15.19 'basilar membrane'
    U0, U1 = 8.25, 14.2
    speed = (10 + 8 * smoothstep(4.0, 5.2, TG)) * DEG * (1 - smoothstep(U0 - 0.3, U1, TG))
    ang_t = integrate(speed)
    ang_t += R_FINAL - ang_t[-1]
    WAVES = []

    def state(t):
        u = seg(t, U0, U1)
        op = 1 - 0.93 * seg(t, 14.8, 16.4)
        d = lerp(lerp(30.0, 27.0, seg(t, 0, 5.5)), 57.0, u)
        d = lerp(d, 53.5, seg(t, 16.0, DUR))
        el = lerp(44.0, 50.0, seg(t, U0, U1 + 0.6))
        tx = lerp(1.9, 0.0, seg(t, U0, U1))
        az = lerp(0.0, -4.0, seg(t, 15.0, DUR))
        return u, op, (tx, 0.0, 0.0), d, el, az
else:
    # cues: 4.31 'inside your head', 7.01 'tiny motors', 15.41 'sharpening', 18.27 'singing back'
    Q0, Q1 = 15.0, 18.0
    speed = 16 * DEG * smoothstep(Q0 + 0.5, DUR, TG) + 10 * DEG * smoothstep(Q0, Q1, TG) * 0
    ang_t = integrate(speed)
    ang_t += R_FINAL - ang_t[0]
    WAVES = [Pass(6.9, 0.62, 1.4, 0.32, t_front=1.7, hold=1.0, t_fade=1.0, lam0=0.2),
             Pass(10.3, 0.30, 2.0, 0.26, t_front=1.2, hold=1.0, t_fade=1.0, lam0=0.14)]

    def state(t):
        u = 1 - seg(t, Q0, Q1)
        op = 0.07 + 0.93 * seg(t, 16.4, 18.1)
        pb = seg(t, 4.1, 11.5)
        d = lerp(19.0, 56.0, pb)
        d = lerp(d, 34.0, seg(t, Q0, Q1 + 0.4))
        d = lerp(d, 40.0, seg(t, Q1 + 0.2, DUR))
        el = lerp(lerp(34.0, 48.0, pb), 44.0, seg(t, Q0, Q1 + 0.4))
        tx = lerp(lerp(7.0, 5.5, seg(t, 0, 4.1)), 0.0, pb)
        az = lerp(-12.0, 0.0, pb)
        return u, op, (tx, 0.0, 0.0), d, el, az


def update(t, f):
    u, op, target, d, el, az = state(t)
    a = float(np.interp(t, TG, ang_t))
    C = centreline(u)
    ca, sa = math.cos(a), math.sin(a)
    Rz = np.array([[ca, -sa, 0], [sa, ca, 0], [0, 0, 1]])
    C = C @ Rz.T
    tt, nn, bb = frames_of(C)
    tube.set_verts(tube_verts(C, tt, nn, bb))
    lift = total(WAVES, X, t) if WAVES else np.zeros(M)
    mem.set_verts(ribbon_verts(C, nn, bb, lift))
    tube_op.outputs[0].default_value = op
    mem.ob.hide_render = op > 0.995
    place_camera(cam, target, d, el, az)


render_loop(args, update, MODE.upper())
