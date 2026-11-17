"""P3 hero H3 (S26), the signature shot: where the pull starts.

A leaf cross-section in chalk on slate (claim 9.2): waxy cuticle top and bottom,
upper epidermis, tightly packed palisade columns, loosely packed spongy mesophyll
with dark air spaces, lower epidermis with a stoma (two guard cells) over an air
cavity. Chalk vapour wisps drift out of the stoma from 'stomata' (7.75 s). On 'cell
walls' (9.73 s) the camera pushes into the wet wall of a spongy cell beside the
cavity, down to its pores: a mesh of wall fibres with a tiny curved water surface
(meniscus, translucent chalk) in every pore, faint vapour leaving them. On
'enormous force' (19.19 s) the menisci glow violet and curve deeper (the pull).
The wall patch sits on the cell at true placement but is magnified (stylised zoom).

    python h3_leaf.py -- <out_dir> [first last] [--res PCT] [--samples S] [--test 1,300]
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from tree_common import (T, Args, DynMesh, Mat, bars, box_mesh, camera, lathe_template, lerp,  # noqa: E402
                         look_rot, render_loop, seg, setup_scene, smoothstep, static, sun, tri_quads, uv_sphere)

args = Args(637, "h3")
DUR = args.frames / 30.0
sc = setup_scene(args)
sc.cycles.transparent_max_bounces = 8
rng = np.random.default_rng(5)

m_cell = Mat("cell", T["chalk"], rough=0.8, spec=0.25)
m_epi = Mat("epi", T["chalk"], rough=0.85)
m_cut = Mat("cuticle", T["chalk"], rough=0.35, spec=0.6)
m_guard = Mat("guard", T["chalk"], rough=0.7)
m_vap = Mat("vapour", T["chalk"], alpha=0.6, rough=1.0, alpha_attr="a")
m_fib = Mat("fibre", T["chalk"], rough=0.75)
m_back = Mat("wallback", T["chalk"], rough=0.9, alt=T["grid"])
m_men = Mat("meniscus", T["chalk"], alpha=0.3, rim=0.95, rough=0.3, spec=0.5, alt=T["refrigerant"],
            emit_color=T["refrigerant"], emit=0.0)

XW = 9.0                       # half width of the section
DEPTH = 3.6                    # slab depth (y from 0 at the cut face)
XS = -2.0                      # stoma x
Z_TOP, Z_BOT = 3.0, -3.0


def bevel(ob, w=0.08, seg_=2):
    m = ob.modifiers.new("bevel", "BEVEL")
    m.width = w
    m.segments = seg_
    m.limit_method = "NONE"


def add_boxes(name, boxes, mat, w):
    V, F = box_mesh(boxes)
    o = static(name, V, F, mat.m)
    bevel(o.ob, w)
    return o


# cuticles (lower one has a slot at the stoma pore)
add_boxes("cut_top", [(0, DEPTH / 2, Z_TOP + 0.06, 2 * XW, DEPTH, 0.12)], m_cut, 0.03)
PY0, PY1 = 0.0, 1.7            # stoma pore runs y 0..1.7 (open at the cut)
add_boxes("cut_bot", [((-XW + XS - 0.3) / 2, DEPTH / 2, Z_BOT - 0.06, XS - 0.3 + XW, DEPTH, 0.12),
                      ((XW + XS + 0.3) / 2, DEPTH / 2, Z_BOT - 0.06, XW - XS - 0.3, DEPTH, 0.12),
                      (XS, (PY1 + DEPTH) / 2, Z_BOT - 0.06, 0.6, DEPTH - PY1, 0.12)], m_cut, 0.03)

# epidermis: flat rounded cells in a grid
def epidermis(z, skip_stoma):
    bx = []
    for y in np.arange(0.48, DEPTH, 0.95):
        x = -XW + 0.45 + rng.uniform(0, 0.3)
        while x < XW - 0.4:
            w = rng.uniform(0.75, 1.05)
            if not (skip_stoma and abs(x - XS) < 1.5 + w / 2 and y < PY1 + 0.5):
                bx.append((x, y, z, w - 0.06, 0.88, 0.5))
            x += w
    return bx


add_boxes("epi_top", epidermis(Z_TOP - 0.27, False), m_epi, 0.12)
add_boxes("epi_bot", epidermis(Z_BOT + 0.27, True), m_epi, 0.12)

# guard cells: two sausages along y either side of the pore, plus subsidiary cells
gv, gf, off = [], [], 0
for sx in (-1, 1):
    zs = np.linspace(-0.85, 0.85, 12)
    prof = [(0.34 * math.sqrt(max(1 - (z / 0.95) ** 2, 0.02)), z) for z in zs]
    v, f = lathe_template(prof, 16)
    v = v[:, [0, 2, 1]] * np.array([1.0, 1.0, 1.0])        # axis along y
    v[:, 0] *= 0.95
    v[:, 2] *= 1.1
    v += np.array([XS + sx * 0.5, PY1 / 2 + 0.05, Z_BOT + 0.25])
    gv.append(v); gf.append(f + off); off += len(v)
static("guard", np.concatenate(gv), np.concatenate(gf), m_guard.m, smooth=True)
add_boxes("subsid", [(XS - 1.2, PY1 / 2, Z_BOT + 0.27, 0.62, PY1 + 0.3, 0.46), (XS + 1.2, PY1 / 2, Z_BOT + 0.27, 0.62, PY1 + 0.3, 0.46)],
          m_epi, 0.12)

# palisade: tightly packed columns (capsules), two layers deep in y, staggered
CAPV, CAPF = lathe_template([(0.27 * math.sqrt(max(0.0, 1 - ((abs(z) - 0.62) / 0.27) ** 2)) if abs(z) > 0.62 else 0.27, z)
                             for z in np.concatenate([np.linspace(-0.88, -0.62, 5), np.linspace(-0.5, 0.5, 4), np.linspace(0.62, 0.88, 5)])
                             if True] , 12)
CAPV[:, 2] = np.clip(CAPV[:, 2], -0.89, 0.89)
pv, pf, off = [], [], 0
for y in np.arange(0.32, DEPTH, 0.6):
    for x in np.arange(-XW + 0.3 + (0.3 if int(y / 0.6) % 2 else 0), XW - 0.2, 0.6):
        h = rng.uniform(0.92, 1.02)
        v = CAPV * np.array([1.0, 1.0, h]) + np.array([x + rng.uniform(-0.03, 0.03), y, 1.55 + rng.uniform(-0.06, 0.06)])
        pv.append(v); pf.append(CAPF + off); off += len(v)
static("palisade", np.concatenate(pv), np.concatenate(pf), m_cell.m, smooth=True)

# spongy mesophyll: loose blobs with air spaces; a cavity above the stoma kept open
TGT_C = np.array([XS + 1.55, 0.62, -1.05])     # the cell whose wall we enter
TGT_R = 0.62
cells = [(TGT_C, np.array([TGT_R, TGT_R, TGT_R]))]
for _ in range(5000):
    c = np.array([rng.uniform(-XW + 0.3, XW - 0.3), rng.uniform(0.35, DEPTH - 0.3), rng.uniform(-2.15, 0.15)])
    r = rng.uniform(0.38, 0.6) * np.array([rng.uniform(0.9, 1.35), rng.uniform(0.85, 1.1), rng.uniform(0.7, 1.0)])
    if math.hypot((c[0] - XS) / 1.75, (c[2] + 2.4) / 1.45) < 1.0:
        continue                                   # substomatal cavity
    ok = True
    for c2, r2 in cells:
        if np.linalg.norm((c - c2) / ((r + r2) / 2)) < 2.3:
            ok = False
            break
    if ok:
        cells.append((c, r))
SV, SF = uv_sphere(10, 16)
sv_, sf_, off = [], [], 0
for k, (c, r) in enumerate(cells):
    v = SV.copy()
    v *= r
    if k:
        v *= 1 + 0.07 * np.sin(3 * v[:, 0:1] / r[0] + k) * np.cos(2 * v[:, 1:2] / r[1])
    sv_.append(v + c); sf_.append(SF + off); off += len(v)
static("spongy", np.concatenate(sv_), np.concatenate(sf_), m_cell.m, smooth=True)
print("spongy cells %d" % len(cells))

# ------------------------------------------------------------------ the wall patch (micro scale)
N = np.array([-0.62, -0.72, -0.31])
N /= np.linalg.norm(N)
P0 = TGT_C + TGT_R * N
E1 = np.cross(N, np.array([0, 0, 1.0]))
E1 /= np.linalg.norm(E1)
E2 = np.cross(N, E1)
RP = 0.22
A = 0.024                       # fibre pitch
RF = 0.0032
H0 = 0.014                      # the wall layer sits on top of the cell's (hidden) surface
# backing (the wet wall body) as a slightly curved disc
nr, na = 10, 48
rr = np.linspace(0, RP * 1.15, nr)
aa = np.linspace(0, 2 * np.pi, na, endpoint=False)
D = np.stack([rr[:, None] * np.cos(aa)[None], rr[:, None] * np.sin(aa)[None]], -1).reshape(-1, 2)
sag = (TGT_R - np.sqrt(TGT_R ** 2 - np.sum(D ** 2, 1)))
BV = P0 + D[:, :1] * E1 + D[:, 1:2] * E2 - (sag[:, None] - 0.003) * N          # sits just outside the cell surface
wallback = static("wallback", BV, tri_quads(nr, na, closed_cols=True), m_back.m, smooth=True)


def onwall(u, v, h):
    """local (u, v, height above the wall surface) -> world, following the cell's curvature."""
    s = TGT_R - np.sqrt(np.maximum(TGT_R ** 2 - u ** 2 - v ** 2, 0))
    return P0 + np.asarray(u)[..., None] * E1 + np.asarray(v)[..., None] * E2 + (np.asarray(h) + H0 - s)[..., None] * N


# fibres: two crossing layers of rods (polylines on the curved wall)
fv, ff, off = [], [], 0
K = int(RP / A)
for layer, (du, dv) in enumerate(((1, 0), (0, 1))):
    for k in range(-K, K + 1):
        c = k * A
        L = math.sqrt(max(RP ** 2 - c ** 2, 0))
        if L < A:
            continue
        s = np.linspace(-L, L, 24)
        u, v = (s, np.full_like(s, c)) if du else (np.full_like(s, c), s)
        h = RF * (1.0 if layer else -0.2) + 0.0012 * np.sin(s / A * np.pi + k)
        P = onwall(u, v, h)
        from tree_common import tube_along
        tv, tf, _ = tube_along(P, RF, 6)
        fv.append(tv); ff.append(tf + off); off += len(tv)
fibres = static("fibres", np.concatenate(fv), np.concatenate(ff), m_fib.m, smooth=True)

# menisci: a concave water surface in every pore
G = 7
gu = np.linspace(-0.5, 0.5, G)
GU, GV = np.meshgrid(gu, gu, indexing="ij")
pores = []
for i in range(-K, K):
    for j in range(-K, K):
        cu, cv = (i + 0.5) * A, (j + 0.5) * A
        if cu ** 2 + cv ** 2 < (RP - A * 0.6) ** 2:
            pores.append((cu, cv))
pores = np.array(pores)
NP_ = len(pores)
SIDE = A - 2 * RF * 0.9
MF = (tri_quads(G, G)[None] + G * G * np.arange(NP_)[:, None, None]).reshape(-1, 4)


def menisci_verts(depth):
    u = pores[:, None, None, 0] + GU[None] * SIDE
    v = pores[:, None, None, 1] + GV[None] * SIDE
    bowl = (1 - (2 * GU) ** 2) * (1 - (2 * GV) ** 2)        # 0 on the pore rim, 1 at the centre
    h = RF * 0.6 - depth * SIDE * bowl[None]
    return onwall(u, v, h).reshape(-1, 3)


men = DynMesh("menisci", menisci_verts(0.4), MF, m_men.m, smooth=True)
print("wall pores %d" % NP_)

# micro vapour: tiny chalk specks leaving the menisci
NMV = 40
mvp = pores[rng.integers(0, NP_, NMV)]
mvt = rng.uniform(0, 2.0, NMV)
MSV, MSF = uv_sphere(4, 8)
mvap = DynMesh("microvap", np.zeros((NMV * len(MSV), 3)), (MSF[None] + len(MSV) * np.arange(NMV)[:, None, None]).reshape(-1, 4),
               m_vap.m, attrs=("a",))

# leaf-scale vapour wisps out of the stoma
NW = 44
w_birth = np.sort(rng.uniform(6.9, DUR + 2.0, NW))
w_birth[:6] = np.linspace(6.9, 7.6, 6)
w_dx = rng.normal(0, 1, NW)
w_y = rng.uniform(0.15, PY1 - 0.15, NW)
w_size = rng.uniform(0.75, 1.25, NW)
WSV, WSF = uv_sphere(6, 10)
wisps = DynMesh("wisps", np.zeros((NW * len(WSV), 3)), (WSF[None] + len(WSV) * np.arange(NW)[:, None, None]).reshape(-1, 4),
                m_vap.m, attrs=("a",))
for o in (wisps, mvap, men):
    o.ob.visible_shadow = False


def wisp_state(t):
    age = t - w_birth
    P = np.zeros((NW, 3))
    R = np.full(NW, 1e-4)
    Al = np.zeros(NW)
    for k in range(NW):
        a = age[k]
        if a < 0 or a > 5.0:
            continue
        # 0..1.0 s rise down through the cavity to the pore, then out and spreading below the leaf
        if a < 1.0:
            q = a / 1.0
            P[k] = (XS + 0.5 * w_dx[k] * (1 - q) * 0.6, w_y[k], lerp(-1.6, Z_BOT - 0.1, q))
            R[k] = lerp(0.1, 0.18, q)
        else:
            q = a - 1.0
            P[k] = (XS + w_dx[k] * 0.55 * q + 0.2 * math.sin(q * 2 + k), w_y[k] - 0.15 * q, Z_BOT - 0.1 - 0.62 * q - 0.05 * q * q)
            R[k] = 0.18 + 0.15 * q
        Al[k] = min(1.0, a / 0.4) * (1 - smoothstep(2.4, 4.0, a))
    return P, R * w_size, Al


sun((30, -105), 3.9)
sun((-25, -70), 1.2, color=(0.92, 0.95, 1.0), angle_deg=8)      # from below-front: lights the underside and vapour
sun((25, 65), 1.4, color=(0.92, 0.95, 1.0), angle_deg=6)
cam = camera(35)
cam.data.clip_start = 0.002
cam.data.clip_end = 200

V_OVER = np.array([0.08, 1.0, 0.2])
V_OVER /= np.linalg.norm(V_OVER)          # overview: looking from front, slightly below


def update(t, f):
    # vapour
    P, R, Al = wisp_state(t)
    wisps.set_verts((P[:, None, :] + R[:, None, None] * WSV[None]).reshape(-1, 3))
    wisps.set_attr("a", np.repeat(Al * 0.95, len(WSV)))
    wisps.ob.hide_render = not np.any(Al > 0)
    # micro vapour specks: cycle every 2 s from random pores, along the normal
    ph = ((t - mvt) % 2.0) / 2.0
    on = t > 13.0
    mp = onwall(mvp[:, 0], mvp[:, 1], np.zeros(NMV)) + (0.002 + 0.03 * ph)[:, None] * N
    mr = 0.0012 * (1 + 0.5 * ph)
    mvap.set_verts((mp[:, None, :] + mr[:, None, None] * MSV[None]).reshape(-1, 3))
    mvap.set_attr("a", np.repeat(np.sin(np.pi * ph) * 0.7 * on, len(MSV)))
    mvap.ob.hide_render = not on
    # menisci: 19.19 'enormous force' -> violet, curving deeper as they pull
    g = seg(t, 19.0, 19.7)
    men.set_verts(menisci_verts(lerp(0.4, 0.62, g)))
    m_men.set(mix=0.85 * g, emit=1.0 * g, alpha=lerp(0.3, 0.8, g))
    # the wall patch only exists for the push-in (no decal on the cell in the overview)
    for o in (wallback, fibres, men):
        o.ob.hide_render = t < 9.6
    m_back.set(mix=seg(t, 10.0, 12.5))
    # camera: overview slow push (0-9.73), then the push into the wall (9.73 -> ~15), slow drift after
    u = seg(t, 9.6, 15.2)
    d_over = lerp(18.5, 16.0, seg(t, 0, 9.6))
    d_end = lerp(0.24, 0.205, seg(t, 15.2, DUR))
    dist = math.exp(lerp(math.log(d_over), math.log(d_end), u))
    tgt_over = np.array([-0.4, 1.0, -0.9])
    w = float(smoothstep(0.0, 0.55, u))
    tgt = lerp(tgt_over, P0, w)
    END_DIR = -N + 0.5 * E2                     # oblique at the end so the dished menisci read
    direc = lerp(V_OVER, END_DIR / np.linalg.norm(END_DIR), float(smoothstep(0.15, 0.85, u)))
    direc /= np.linalg.norm(direc)
    # a slow drift across the pores at the end so nothing is static
    drift = (seg(t, 14.0, DUR) - 0.5) * 0.03 * E1
    cam_p = tgt + drift - direc * dist
    cam.location = tuple(cam_p)
    look_rot(cam, direc)


render_loop(args, update, "H3")
