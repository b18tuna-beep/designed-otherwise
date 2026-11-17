"""P3 hero H2 (S20): into the wood.

A chalk trunk cross-section (growth rings on a slate face, chalk bark rim). The
camera pushes in toward the sapwood; on 'xylem' (4.61 s) a bundle of long thin
pipes (tracheids) grows up out of the cut face and the camera tilts up along them
as they run out of frame. Tracheid aspect ~1:100 (diameter 0.2, length ~20 units;
claim 9.1: single cells under ~6 mm long, a few hundredths of a mm wide) with small
round bordered pits in rows along their sides. The bundle is magnified relative to
the log (stylised zoom), as the board's locator implies.

    python h2_xylem.py -- <out_dir> [first last] [--res PCT] [--samples S] [--test 1,140]
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from tree_common import (T, Args, DynMesh, Mat, camera, lathe_template, lerp, place_camera,  # noqa: E402
                         render_loop, seg, setup_scene, static, sun, tracheid_template, tube_along, uv_sphere)

args = Args(254, "h2")
DUR = args.frames / 30.0
sc = setup_scene(args)

m_face = Mat("face", T["grid"], rough=0.95)
m_ring = Mat("ring", T["chalk"], rough=0.9)
m_bark = Mat("bark", T["chalk"], rough=0.95)
m_pipe = Mat("pipe", T["chalk"], rough=0.85)
m_pit = Mat("pit", T["panel"], rough=0.8)

# ------------------------------------------------------------------ log
RLOG = 10.0
rng = np.random.default_rng(11)
prof = [(RLOG, -8.0), (RLOG, -0.02), (RLOG - 0.02, 0.0)]
V, F = lathe_template([(RLOG * 0.999, -8.0), (RLOG * 0.999, 0.0)], 96)
static("face_side", V, F, m_face.m, smooth=True)
# bark: a slightly lumpy chalk rim
a = np.linspace(0, 2 * np.pi, 160, endpoint=False)
for z0 in (0.0,):
    rb = RLOG + 0.35 + 0.12 * np.sin(7 * a) + 0.08 * np.sin(19 * a + 1)
    P = np.stack([rb * np.cos(a), rb * np.sin(a), np.full_like(a, 0.02)], -1)
    P = np.concatenate([P, P[:1]])
    v, f, _ = tube_along(P, 0.42, 10)
    static("bark", v, f, m_bark.m, smooth=True)
# rings: irregular widths, slightly wobbly circles
radii = np.cumsum(rng.uniform(0.45, 0.95, 30))
radii = radii[radii < RLOG - 0.4]
rv, rf, off = [], [], 0
for r in radii:
    rr = r * (1 + 0.012 * np.sin(3 * a + r) + 0.008 * np.sin(5 * a - r))
    P = np.stack([rr * np.cos(a), rr * np.sin(a), np.full_like(a, 0.02)], -1)
    P = np.concatenate([P, P[:1]])
    v, f, _ = tube_along(P, 0.05 + 0.03 * (r / RLOG), 6)
    rv.append(v); rf.append(f + off); off += len(v)
static("rings", np.concatenate(rv), np.concatenate(rf), m_ring.m, smooth=True)
sv, sf = uv_sphere(6, 12)
static("pith", sv * np.array([0.25, 0.25, 0.08]) + np.array([0, 0, 0.02]), sf, m_ring.m, smooth=True)

# ------------------------------------------------------------------ tracheid bundle
C = np.array([6.3, -1.2, 0.0])          # sapwood spot the camera pushes toward
RP, PITCH = 0.1, 0.205
cells = []
for q in range(-3, 4):
    for r_ in range(-3, 4):
        s_ = -q - r_
        if max(abs(q), abs(r_), abs(s_)) <= 3:
            x = PITCH * (q + r_ / 2)
            y = PITCH * (r_ * math.sqrt(3) / 2)
            cells.append((x, y))
cells = np.array(cells)
NPIPE = len(cells)
LENS = rng.uniform(18.5, 23.0, NPIPE)
DELAY = rng.uniform(0, 0.55, NPIPE)
tv, tf = tracheid_template(RP, 1.0, 12, 30, tip=6.0)  # unit length: scale z per pipe (tip stretches, fine)
TV = [tracheid_template(RP, L, 12, 30)[0] for L in LENS]
NVT = len(TV[0])
pipe_rest = np.concatenate([v + np.array([C[0] + x, C[1] + y, 0.0]) for v, (x, y) in zip(TV, cells)])
pipe_faces = np.concatenate([tf + i * NVT for i in range(NPIPE)])
pipes = DynMesh("tracheids", pipe_rest, pipe_faces, m_pipe.m, smooth=True)

# pits: dark flattened domes in vertical rows, on the sides facing out of the bundle and toward neighbours
pv_t, pf_t = uv_sphere(4, 8)
pits_P, pits_N, pits_pipe = [], [], []
cen = cells.mean(0)
for i, (x, y) in enumerate(cells):
    out = np.array([x, y]) - cen
    base_ang = math.atan2(out[1], out[0]) if np.linalg.norm(out) > 1e-6 else 0.0
    outer = np.linalg.norm(out) > PITCH * 2.5
    for k, da in enumerate((-0.9, 0.0, 0.9) if outer else (-0.6, 0.6)):
        ang = base_ang + da
        n = np.array([math.cos(ang), math.sin(ang), 0.0])
        zs = np.arange(0.25 + 0.09 * k, 7.5, 0.21)
        for z in zs:
            pits_P.append(np.array([C[0] + x, C[1] + y, z]) + n * RP * 0.93)
            pits_N.append(n)
            pits_pipe.append(i)
pits_P, pits_N, pits_pipe = np.array(pits_P), np.array(pits_N), np.array(pits_pipe)
NPIT = len(pits_P)


def pit_verts(zscale):
    # oriented flattened spheres: radius 0.025 in-plane, 0.012 along the normal
    n = pits_N
    up = np.array([0.0, 0.0, 1.0])
    e1 = np.cross(up, n)
    e1 /= np.linalg.norm(e1, axis=1, keepdims=True)
    P = pits_P.copy()
    P[:, 2] *= zscale[pits_pipe]
    V = (P[:, None, :] + 0.025 * pv_t[None, :, 0:1] * e1[:, None, :] + 0.025 * pv_t[None, :, 1:2] * up[None, None, :]
         + 0.012 * pv_t[None, :, 2:3] * n[:, None, :])
    return V.reshape(-1, 3)


pits = DynMesh("pits", pit_verts(np.ones(NPIPE)), (pf_t[None] + len(pv_t) * np.arange(NPIT)[:, None, None]).reshape(-1, 4),
               m_pit.m, smooth=True)
print("tracheids %d, pits %d" % (NPIPE, NPIT))

sun((42, -125), 3.0)
sun((22, 60), 1.6, color=(0.92, 0.95, 1.0), angle_deg=6)
sun((75, -90), 0.35)
cam = camera(35)
cam.data.clip_start = 0.01
cam.data.clip_end = 500


def update(t, f):
    # cue 4.61 'xylem': bundle grows up out of the face, camera pushes in and tilts up the pipes
    g = np.array([seg(t, 4.25 + d, 6.1 + d) for d in DELAY])
    g = np.maximum(g, 1e-3)
    zsc = np.repeat(g, NVT)
    V = pipe_rest.copy()
    V[:, 2] *= zsc
    pipes.set_verts(V)
    pits.set_verts(pit_verts(g))
    pipes.ob.hide_render = t < 4.2
    pits.ob.hide_render = t < 4.2
    hold = seg(t, 0.0, 3.9)
    push = seg(t, 3.7, DUR - 0.1)
    tgt = lerp(lerp(np.array([0.0, 0.0, -1.0]), np.array([1.2, -0.3, -0.6]), hold), C + np.array([0.0, 0.0, 1.9]), push)
    dist = lerp(lerp(40.0, 34.0, hold), 4.6, push ** 0.8)
    el = lerp(58.0, 9.0, push)
    az = lerp(-14.0, -24.0, push)
    place_camera(cam, tgt, dist, el, az)


render_loop(args, update, "H2")
