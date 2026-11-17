"""P3 hero H5 (S35): the rope snaps, and the pit valve saves the neighbour.

Two neighbouring tracheids (H2's pipes, shown as a section: the front half cut away
so the lumens and the shared wall read), both full of water (translucent chalk)
under tension (violet bands travelling upward). On 'snap' (5.62 s) an air bubble
appears in the left pipe and expands until the pipe is air-filled (muted, by 8.99 s
'blocked'). The bordered pit in the shared wall is shown in section (claim 6.4,
conifer torus-margo pit): two arched borders with apertures, a porous rim (margo
strands) holding a solid central plug (torus). At 10.5 s the torus slides toward the
water-filled neighbour and seals its aperture; the neighbour stays full and violet.
The pit is drawn ~5x larger relative to the pipe than life so the valve reads.

    python h5_pit.py -- <out_dir> [first last] [--res PCT] [--samples S] [--test 1,200]
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from tree_common import (T, Args, DynMesh, Mat, bars, box_mesh, camera, lerp, place_camera,  # noqa: E402
                         render_loop, seg, setup_scene, smoothstep, static, sun, tri_quads, uv_sphere)

args = Args(360, "h5")
DUR = args.frames / 30.0
sc = setup_scene(args)
sc.cycles.transparent_max_bounces = 12

m_wall = Mat("wall", T["chalk"], rough=0.9)
m_wallL = Mat("wallL", T["chalk"], rough=0.9, alt=T["muted"])
m_cut = Mat("cut", T["chalk"], rough=0.95)
m_waterL = Mat("waterL", T["chalk"], alpha=0.3, emit_color=T["refrigerant"], emit=0.75, pulse=("h", 2.2, 1.0))
m_waterR = Mat("waterR", T["chalk"], alpha=0.3, emit_color=T["refrigerant"], emit=0.75, pulse=("h", 2.2, 1.0))
m_air = Mat("air", T["muted"], alpha=0.0, rough=0.6, spec=0.4)
m_torus = Mat("torus", T["chalk"], rough=0.8)

ZL = 10.0       # pipes run out of frame
W = 0.1         # half thickness of each wall
X_OUT = 2.2
Y_BACK = 1.2
R_HOLE = 0.55

# ------------------------------------------------------------------ walls (section: cut at y=0, front removed)
left = [(-X_OUT + W, 0.6, 0, 2 * W, 1.2, 2 * ZL), (-1.1, Y_BACK - W, 0, 2.2, 2 * W, 2 * ZL)]
right = [(X_OUT - W, 0.6, 0, 2 * W, 1.2, 2 * ZL), (1.1, Y_BACK - W, 0, 2.2, 2 * W, 2 * ZL)]
mid = [(0, 0.6, (ZL + R_HOLE) / 2, 2 * W, 1.2, ZL - R_HOLE), (0, 0.6, -(ZL + R_HOLE) / 2, 2 * W, 1.2, ZL - R_HOLE),
       (0, (R_HOLE + 1.2) / 2, 0, 2 * W, 1.2 - R_HOLE, 2 * R_HOLE)]
for name, bx, mt in (("wallL", left, m_wallL), ("wallR", right, m_wall), ("wallM", mid, m_wall)):
    V, F = box_mesh(bx)
    static(name, V, F, mt.m)


def revolve_closed(outer, inner, nphi=24, phi0=0.0, phi1=math.pi):
    """revolve a closed (x, r) section (outer and inner rails, same length) about the
    x axis over phi in [phi0, phi1] (y = r sin phi >= 0: the half behind the cut);
    caps the two cut faces."""
    outer, inner = np.asarray(outer, float), np.asarray(inner, float)
    N = len(outer)
    loop = np.concatenate([outer, inner[::-1]])
    ph = np.linspace(phi0, phi1, nphi)
    V = np.stack([np.broadcast_to(loop[None, :, 0], (nphi, 2 * N)),
                  loop[None, :, 1] * np.sin(ph)[:, None],
                  loop[None, :, 1] * np.cos(ph)[:, None]], -1).reshape(-1, 3)
    F = list(tri_quads(nphi, 2 * N, closed_cols=True))
    for row in (0, nphi - 1):
        o = row * 2 * N
        for i in range(N - 1):
            F.append([o + i, o + i + 1, o + 2 * N - 2 - i, o + 2 * N - 1 - i])
    return V, np.asarray(F)


# pit borders: arched shells from the hole rim (x=+-W) to the aperture (r 0.17)
u = np.linspace(0, 1, 14)
cx = W + 0.30 * np.sin(u * np.pi / 2)
cr = R_HOLE + 0.05 - 0.40 * u ** 1.15
dx, dr = np.gradient(cx), np.gradient(cr)
nrm = np.stack([-dr, dx], -1)
nrm /= np.linalg.norm(nrm, axis=1, keepdims=True)
c = np.stack([cx, cr], -1)
for s_ in (-1, 1):
    o = c + 0.045 * nrm
    i_ = c - 0.045 * nrm
    o[:, 0] *= s_
    i_[:, 0] *= s_
    V, F = revolve_closed(o, i_, 28)
    static("border%d" % s_, V, F, m_cut.m, smooth=True)
APERTURE_X = W + 0.30 - 0.06       # inner surface of the right border near the aperture

# torus: lens-shaped plug at the membrane centre
RT = 0.24
rr = np.linspace(1e-3, RT, 10)
th = 0.055 * np.sqrt(1 - (rr / RT) ** 2) + 0.012
TV0, TF = revolve_closed(np.stack([th, rr], -1), np.stack([-th, rr], -1), 24)
torus = DynMesh("torus", TV0, TF, m_torus.m, smooth=True)
# margo strands: 7 radial threads in the half disc, rim anchored at x=0
NS = 7
PHI = np.linspace(0.12, math.pi - 0.12, NS)


def strands(tx):
    r0, r1 = RT * 0.9, R_HOLE + 0.02
    P0 = np.stack([np.full(NS, tx), r0 * np.sin(PHI), r0 * np.cos(PHI)], -1)
    P1 = np.stack([np.zeros(NS), r1 * np.sin(PHI), r1 * np.cos(PHI)], -1)
    return bars(P0, P1, np.full(NS, 0.012), 6)


sv, sf = strands(0.0)
margo = DynMesh("margo", sv, sf, m_torus.m, smooth=True)

# ------------------------------------------------------------------ water and air
def water_box(x0, x1):
    V, F = box_mesh([((x0 + x1) / 2, (0.01 + Y_BACK - 2 * W) / 2, 0, x1 - x0, Y_BACK - 2 * W - 0.02, 2 * ZL - 0.2)])
    return V, F


V, F = water_box(-X_OUT + 2 * W + 0.01, -W - 0.01)
wL = static("waterL", V, F, m_waterL.m, attrs={"h": V[:, 2]})
V, F = water_box(W + 0.01, X_OUT - 2 * W - 0.01)
wR = static("waterR", V, F, m_waterR.m, attrs={"h": V[:, 2]})

BV, BF = uv_sphere(14, 24)
BC = np.array([-1.05, 0.48, 1.6])
bubble = DynMesh("bubble", BV, BF, m_air.m, smooth=True)
for o in (wL, wR, bubble):          # translucent volumes cast no shadows (they darkened the walls, and cost time)
    o.ob.visible_shadow = False


def bubble_verts(rad, half_len, ry):
    V = BV.copy()
    V[:, 0] *= rad
    V[:, 1] *= min(rad, ry)
    V[:, 2] *= rad
    V[:, 2] += np.sign(V[:, 2]) * half_len
    return V + BC


sun((35, -125), 3.0)
sun((20, 55), 1.4, color=(0.92, 0.95, 1.0), angle_deg=6)
sun((70, -90), 0.4)
cam = camera(35)
cam.data.clip_start = 0.01


def update(t, f):
    # tension bands travel upward in both pipes while they hold water
    ph = t * 2.6
    # 5.62 'snap': bubble pops in and grows; by 8.99 'blocked' the left pipe is air
    pop = seg(t, 5.55, 5.95)
    grow = seg(t, 5.95, 8.85)
    rad = lerp(0.0, 0.42, pop) + lerp(0.0, 0.42, grow)
    half_len = lerp(0.0, ZL + 1.0, grow ** 1.6)
    bubble.set_verts(bubble_verts(max(rad, 1e-3), half_len, 0.47))
    bubble.ob.hide_render = t < 5.55
    air = seg(t, 6.6, 8.95)
    m_air.set(alpha=lerp(0.85, 0.7, air))
    m_waterL.set(alpha=0.3 * (1 - air), emit=0.75 * (1 - air), phase=ph)
    wL.ob.hide_render = air >= 0.999
    m_waterR.set(phase=ph, emit=lerp(0.75, 1.1, seg(t, 9.0, 10.6)))
    m_wallL.set(mix=0.55 * seg(t, 8.4, 9.2))
    # 10.5: torus slams onto the water-side aperture
    s = smoothstep(10.32, 10.52, t)
    s = float(s) * (1 + 0.06 * math.sin(max(0.0, t - 10.52) * 30) * math.exp(-max(0.0, t - 10.52) * 8))
    tx = (APERTURE_X - 0.07) * s
    torus.set_verts(TV0 + np.array([tx, 0, 0]))
    margo.set_verts(strands(tx)[0])
    # camera: both pipes, slow push; then in to the pit for the slam
    hold = seg(t, 0.0, 9.0)
    push = seg(t, 9.0, 10.35)
    tgt = lerp(np.array([0.0, 0.3, lerp(0.6, 0.3, hold)]), np.array([0.08, 0.25, 0.0]), push)
    dist = lerp(lerp(12.5, 11.0, hold), 3.6, push)
    dist = lerp(dist, 3.3, seg(t, 10.35, DUR))
    place_camera(cam, tgt, dist, lerp(7.0, 4.0, push), lerp(-8.0, -4.0, push))


render_loop(args, update, "H5")
