"""P2 heroes H3 (S20), H4 (S27, --mode h4) and H6 (S36, --mode h6): the hair-cell rows.

Set: a stretch of basilar membrane (chalk slab) carrying one row of inner hair
cells (flask-shaped, nearest the camera) and three rows of outer hair cells
(cylinders, staggered), each topped with a stereocilia tuft in three stepped rows,
tallest on the far (outer) side: a shallow line for inner cells, a V for outer cells.
Base end of the cochlea is screen-left in every mode. Units: 1 BU = 1 micrometre.

Reference (research/assets.md): outer hair cells ~25 um long at the base (we use
26-31 um, this stretch is near the base), 7 um diameter; cell spacing ~9.5 um.
Stereocilia are thickened (~2x) and slightly lengthened, and fewer per tuft
(~33 outer, ~36 inner, vs ~100 real) so they read at 1080p.

H3: slow lateral dolly at a high, SEM-like angle. Row highlights on 'inner hair
cells' / 'three rows' are left to the 2D overlay (--highlight dims rows in 3D instead).
H4: wider view; a travelling wave moves the membrane, outer cells lengthen and
shorten in phase with it; the peak grows on 'hundredfold' and narrows on 'sharpen'.
H6: from screen-left (base), outer-cell tufts in the first outer row splay and go
muted grey, spreading along the row; rows two and three follow; inner row stays.

    python h3_haircells.py -- <out_dir> [first last] [--frames N] [--res PCT] [--samples S] [--mode h3|h4|h6] [--test ...]
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from ear_common import (T, Args, DynMesh, attr_material, camera, instance_faces, instance_verts,  # noqa: E402
                        lathe_template, lerp, place_camera, render_loop, satin, seg, setup_scene,
                        smoothstep, sun, tri_quads)

DEFAULT_FRAMES = {"h3": 483, "h4": 372, "h6": 436}
args = Args(483, "h3")
MODE = args.mode
if "--frames" not in sys.argv and MODE != "h3":
    args.frames = DEFAULT_FRAMES[MODE]
    if args.frame_list == list(range(1, 484)):
        args.frame_list = list(range(1, args.frames + 1))
DUR = args.frames / 30.0
rng = np.random.default_rng(7)
HIGHLIGHT = "--highlight" in sys.argv

XMIN, XMAX = -190.0, 290.0
SP = 9.5
Y_IHC = 0.0
Y_OHC = (30.0, 40.0, 50.0)

# ------------------------------------------------------------------ cells
cells = []   # (x, y, kind, row)
for i in range(int((XMAX - XMIN) / SP)):
    cells.append((XMIN + i * SP + rng.uniform(-0.6, 0.6), Y_IHC + rng.uniform(-0.6, 0.6), 0, -1))
for r, y in enumerate(Y_OHC):
    for i in range(int((XMAX - XMIN) / SP)):
        cells.append((XMIN + i * SP + r * 3.2 + rng.uniform(-0.5, 0.5), y + rng.uniform(-0.5, 0.5), 1, r))
cells = np.array(cells)
CX, CY, KIND, ROW = cells[:, 0], cells[:, 1], cells[:, 2].astype(int), cells[:, 3].astype(int)
NC = len(cells)
IS_O = KIND == 1
# lengths: outer 26-31 um across this stretch (longer toward the apex, screen-right)
XN = (CX - XMIN) / (XMAX - XMIN)
L0 = np.where(IS_O, lerp(26.0, 31.0, XN) + rng.uniform(-0.6, 0.6, NC), 33.0 + rng.uniform(-0.8, 0.8, NC))
RAD = np.where(IS_O, 3.5, 5.2)

ohc_prof = [(0.55, 0.0), (0.9, 0.03), (1.0, 0.09), (1.0, 0.94), (0.92, 0.99), (0.75, 1.0)]
ihc_prof = [(0.45, 0.0), (0.8, 0.05), (1.0, 0.22), (1.0, 0.48), (0.82, 0.72), (0.66, 0.9), (0.62, 0.97), (0.5, 1.0)]
TO_V, TO_F = lathe_template(ohc_prof, 16)
TI_V, TI_F = lathe_template(ihc_prof, 16)
IDX_O = np.where(IS_O)[0]
IDX_I = np.where(~IS_O)[0]

# ------------------------------------------------------------------ tufts
st_cell, st_off, st_h, st_r = [], [], [], []
for c in range(NC):
    if IS_O[c]:
        heights = (5.6, 3.8, 2.3)
        for r in range(3):
            n = 4
            vy = 1.7 - r * 0.75
            for k in range(-n, n + 1):
                ax = abs(k) * 0.72
                st_cell.append(c)
                st_off.append((np.sign(k) * ax * math.sin(math.radians(62)), vy - ax * math.cos(math.radians(62))))
                st_h.append(heights[r] * (1 - 0.04 * abs(k) / n))
                st_r.append(0.26)
    else:
        heights = (7.6, 5.0, 3.0)
        for r in range(3):
            for k in range(-5, 6):
                st_cell.append(c)
                st_off.append((k * 0.8, 1.1 - r * 0.85 - 0.03 * k * k))
                st_h.append(heights[r] * (1 - 0.02 * abs(k)))
                st_r.append(0.32)
st_cell = np.array(st_cell)
st_off = np.array(st_off)
st_h = np.array(st_h)
st_r = np.array(st_r)
NS = len(st_cell)
# splay direction for damage: outward from the tuft centre plus noise, fixed per stereocilium
cen = np.zeros((NC, 2))
np.add.at(cen, st_cell, st_off)
cen /= np.bincount(st_cell, minlength=NC)[:, None]
outw = st_off - cen[st_cell]
outw /= np.linalg.norm(outw, axis=1, keepdims=True) + 1e-6
noise = rng.normal(0, 0.6, (NS, 2))
SPLAY = outw + noise
SPLAY_AMT = rng.uniform(0.5, 1.5, NS)
SHRINK = rng.uniform(0.0, 0.45, NS)
TS_V, TS_F = lathe_template([(0.55, 0.0), (1.0, 0.07), (1.0, 0.9), (0.62, 0.98)], 6)
print("cells %d (inner %d, outer %d), stereocilia %d" % (NC, len(IDX_I), len(IDX_O), NS))

# ------------------------------------------------------------------ membrane
MY0, MY1 = -22.0, 68.0
NMX, NMY = 260, 22
MXs = np.linspace(XMIN - 40, XMAX + 40, NMX)
MYs = np.linspace(MY0, MY1, NMY)


def across(y):
    return np.sin(np.pi * np.clip((y - MY0) / (MY1 - MY0), 0, 1))


def membrane_verts(zfun):
    P = np.zeros((NMX, NMY, 3))
    P[..., 0] = MXs[:, None]
    P[..., 1] = MYs[None, :]
    P[..., 2] = zfun(MXs)[:, None] * across(MYs)[None, :]
    return P.reshape(-1, 3)


# ------------------------------------------------------------------ scene
sc = setup_scene(args)
cell_mat = attr_material("cells", T["chalk"], [("dmg", T["muted"], 1.0), ("dim", T["grid"], 0.6)],
                         rough=0.55, spec=0.35, sheen=0.25)
mem_mat = satin("membrane", T["grid"], rough=0.8, spec=0.25)   # dark floor so the chalk cells read (style bible 3D: floor = dark token)
mem = DynMesh("membrane", membrane_verts(lambda x: np.zeros_like(x)), tri_quads(NMX, NMY), mem_mat)
sol = mem.ob.modifiers.new("thick", "SOLIDIFY")
sol.thickness = 3.0
sol.offset = -1.0


def build_cells(zb, L, dmg, dim):
    V_o = instance_verts(TO_V, np.stack([CX[IDX_O], CY[IDX_O], zb[IDX_O] - 0.5], -1),
                         np.tile([0.0, 0.0, 1.0], (len(IDX_O), 1)), RAD[IDX_O], L[IDX_O])
    V_i = instance_verts(TI_V, np.stack([CX[IDX_I], CY[IDX_I], zb[IDX_I] - 0.5], -1),
                         np.tile([0.0, 0.0, 1.0], (len(IDX_I), 1)), RAD[IDX_I], L[IDX_I])
    return V_o, V_i


def build_tufts(zb, L, sdmg):
    top = zb[st_cell] + L[st_cell] - 0.5
    P = np.stack([CX[st_cell] + st_off[:, 0], CY[st_cell] + st_off[:, 1], top - 0.4], -1)
    a = sdmg * SPLAY_AMT * 1.1
    D = np.stack([SPLAY[:, 0] * a, SPLAY[:, 1] * a, np.ones(NS)], -1)
    H = st_h * (1 - sdmg * SHRINK)
    return instance_verts(TS_V, P, D, st_r, H)


z0 = np.zeros(NC)
Vo, Vi = build_cells(z0, L0, z0, z0)
ohc = DynMesh("ohc", Vo, instance_faces(TO_F, len(TO_V), len(IDX_O)), cell_mat, attrs=("dmg", "dim"))
ihc = DynMesh("ihc", Vi, instance_faces(TI_F, len(TI_V), len(IDX_I)), cell_mat, attrs=("dmg", "dim"))
tuf = DynMesh("tufts", build_tufts(z0, L0, np.zeros(NS)), instance_faces(TS_F, len(TS_V), NS), cell_mat,
              attrs=("dmg", "dim"))

sun((40, -128), 2.0)                                         # key: front-left, above
sun((24, 78), 2.6, color=(0.90, 0.95, 1.0), angle_deg=5)     # cool rim from behind: tufts catch it
sun((70, -60), 0.35)                                         # soft top fill
cam = camera(65)
cam.data.clip_start = 1.0
cam.data.clip_end = 20000.0

# ------------------------------------------------------------------ per-mode behaviour
ZERO_C = np.zeros(NC)
ZERO_S = np.zeros(NS)
DMG_T = rng.uniform(-7.0, 7.0, NC)          # patchy damage front (um jitter)

if MODE == "h3":
    # cues: 2.59 dolly starts 'hair cells', 7.01 'inner hair cells', 11.25 'three rows'
    def state(t):
        dx = lerp(0.0, 95.0, seg(t, 2.45, DUR + 0.6))
        cam_ = ((dx - 5.0, 24.0, 10.0), lerp(320.0, 300.0, seg(t, 0, DUR)), 48.0, -2.0)
        if HIGHLIGHT:   # optional; by default the 2D overlay does the row highlights
            inner_focus = seg(t, 6.85, 7.45) * (1 - seg(t, 11.1, 11.7))
            outer_focus = seg(t, 11.1, 11.7)
            dim = np.where(IS_O, 0.6 * inner_focus, 0.6 * outer_focus)
        else:
            dim = ZERO_C
        return ZERO_C, L0, ZERO_C, dim, ZERO_S, (lambda x: np.zeros_like(x)), cam_

elif MODE == "h4":
    # cues: 0.3 'pushing', 5.7 'hundredfold', 6.71 'sharpen', 9.57 'whispers'
    LAM, FREQ, XC = 150.0, 0.8, 55.0
    KW = 2 * np.pi / LAM

    def amp(t):
        return 2.6 + 2.0 * seg(t, 0.3, 4.5) + 6.0 * seg(t, 5.5, 6.4)

    def sig(t):
        return lerp(150.0, 62.0, seg(t, 6.55, 7.4))

    def state(t):
        A, S = amp(t), sig(t)
        ph = 2 * np.pi * FREQ * t

        def zf(x):
            return A * np.exp(-((x - XC) / S) ** 2) * np.sin(ph - KW * (x - XMIN))
        pump = seg(t, 0.2, 1.0)
        envc = np.exp(-((CX - XC) / S) ** 2)
        zb = zf(CX) * across(CY)
        L = L0 * (1 + np.where(IS_O, 0.13 * pump * envc * np.cos(ph - KW * (CX - XMIN)), 0.0))
        cam_ = ((lerp(50.0, 58.0, seg(t, 0, DUR)), 24.0, 14.0), lerp(400.0, 380.0, seg(t, 0, DUR)), 34.0,
                lerp(-3.0, -1.0, seg(t, 0, DUR)))
        return zb, L, ZERO_C, ZERO_C, ZERO_S, zf, cam_

else:  # h6
    # cues: 2.83 first outer row 'among the first', 6.39 spreads 'high pitches'
    X_LEFT, V_FRONT = -75.0, 17.0
    ROW_START = {0: 2.7, 1: 6.25, 2: 6.9}

    def state(t):
        d = np.zeros(NC)
        for r, t0 in ROW_START.items():
            m = IS_O & (ROW == r)
            front = X_LEFT + (t - t0) * V_FRONT * (1.0 - 0.15 * r)
            passed = (front - (CX[m] + DMG_T[m])) / (V_FRONT * 1.1)   # seconds since front passed
            d[m] = smoothstep(0.0, 1.0, passed) * (t >= t0)
        sd = d[st_cell]
        cam_ = ((lerp(35.0, 50.0, seg(t, 0, DUR)), 24.0, 18.0), lerp(290.0, 268.0, seg(t, 0, DUR)), 46.0,
                lerp(-3.0, -1.0, seg(t, 0, DUR)))
        return ZERO_C, L0, d, ZERO_C, sd, (lambda x: np.zeros_like(x)), cam_


_last = {}


def _changed(key, *arrs):
    sig = tuple(float(np.sum(np.abs(a))) + float(np.sum(a * np.arange(a.size).reshape(a.shape))) for a in arrs)
    if _last.get(key) == sig:
        return False
    _last[key] = sig
    return True


def update(t, f):
    zb, L, dmg, dim, sdmg, zf, (target, dist, el, az) = state(t)
    place_camera(cam, target, dist, el, az)
    if not _changed("geo", zb, L, dmg, dim, sdmg):
        return
    Vo, Vi = build_cells(zb, L, dmg, dim)
    ohc.set_verts(Vo)
    ihc.set_verts(Vi)
    tuf.set_verts(build_tufts(zb, L, sdmg))
    ohc.set_attr("dmg", np.repeat(0.55 * dmg[IDX_O], len(TO_V)))
    ohc.set_attr("dim", np.repeat(dim[IDX_O], len(TO_V)))
    ihc.set_attr("dmg", np.repeat(dmg[IDX_I], len(TI_V)))
    ihc.set_attr("dim", np.repeat(dim[IDX_I], len(TI_V)))
    tuf.set_attr("dmg", np.repeat(sdmg, len(TS_V)))
    tuf.set_attr("dim", np.repeat(dim[st_cell], len(TS_V)))
    mem.set_verts(membrane_verts(zf))


render_loop(args, update, MODE.upper())
