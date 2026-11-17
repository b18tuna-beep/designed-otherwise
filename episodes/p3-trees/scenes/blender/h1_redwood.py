"""P3 heroes H1 (S03), H6 (S43) and H7 (S46): the redwood at real scale.

One stylised chalk coast redwood (116 m, Hyperion, claim 1.1), a 30-storey block
(100 m, claim 1.5) and the glowing 10 m suction line (claim 2.1). Units: metres.

H1 (--mode h1, 233 f): camera starts low at the trunk base beside the 10 m line,
    rises past the building roof to the crown (cue 3.12 s), label at 6.14 s.
    Upper-left third kept empty for the 2D label.
H6 (--mode h6, 793 f): no building. The tree grows 80 -> 116 m; a translucent
    ceiling band at 122-130 m (claims 7.1/7.4) appears at 4.19 s; a height gauge
    left of the tree continues dashed up into the band at 10.65 s; a Hyperion
    marker at 116 m draws on at 24.63 s. Slow pull-back; right third kept calm.
H7 (--mode h7, 286 f): wide; trunk and crown go ghostly and violet threads glow up
    from the roots to the crown (1.21 s); the faint 10 m line brightens at 8.41 s.

    python h1_redwood.py -- <out_dir> [first last] [--mode h1|h6|h7] [--res PCT] [--samples S] [--test 1,120]
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from tree_common import (LINE_Z, T, TREE_H, Args, DynMesh, Mat, bars, box_mesh, building_boxes, camera,  # noqa: E402
                         empty, ground_disc, lerp, look_rot, redwood_parts, render_loop, scenery_lights, seg, setup_scene,
                         smoothstep, static, trunk_radius, tube_along)

DEFAULT_FRAMES = {"h1": 233, "h6": 793, "h7": 286}
args = Args(233, "h1")
MODE = args.mode
if "--frames" not in sys.argv:
    args.frames = DEFAULT_FRAMES[MODE]
    if args.frame_list == list(range(1, 234)):
        args.frame_list = list(range(1, args.frames + 1))
DUR = args.frames / 30.0

sc = setup_scene(args)
sc.cycles.transparent_max_bounces = 24 if MODE == "h7" else 10
BX, BY = 42.0, 8.0

# ------------------------------------------------------------------ materials
ghost = MODE == "h7"
m_trunk = Mat("trunk", T["chalk"], rough=0.92, alpha=1.0, rim=0.75 if ghost else None)
m_crown = Mat("crown", T["chalk"], rough=0.92, alpha=1.0, rim=0.6 if ghost else None)
m_body = Mat("body", T["grid"], rough=0.95)
m_frame = Mat("frame", T["chalk"], rough=0.9)
m_ground = Mat("ground", T["panel"], rough=1.0, spec=0.05, alpha_attr="fade")
m_line = Mat("line10", T["chalk"], emit_color=T["chalk"], emit=1.6)
m_halo = Mat("line10halo", T["chalk"], alpha=0.22, emit_color=T["chalk"], emit=0.45)

# ------------------------------------------------------------------ objects
tree = empty("tree")
(Vt, Ft), (Vc, Fc) = redwood_parts()
trunk = static("trunk", Vt, Ft, m_trunk.m, smooth=True)
crown = static("crown", Vc, Fc, m_crown.m, smooth=False)
for o in (trunk, crown):
    o.ob.parent = tree

V, F, fd = ground_disc(420.0 if MODE != "h1" else 300.0)
gr = static("ground", V, F, m_ground.m, attrs={"fade": fd})

if MODE in ("h1", "h7"):
    body, fr = building_boxes(BX, BY)
    V, F = box_mesh(body)
    static("building", V, F, m_body.m)
    V, F = box_mesh(fr)
    static("frame", V, F, m_frame.m)
    LY = BY - 12 - 2.0           # just in front of the building face and the trunk
    for mat, r in ((m_line, 0.4),):
        V, F = bars([[-46, LY, LINE_Z]], [[78, LY, LINE_Z]], [r], 16)
        static("line10", V, F, mat.m, smooth=True)

scenery_lights()
cam = camera(35)
cam.data.clip_start = 0.5
cam.data.clip_end = 5000


def aim(P, Tg):
    cam.location = tuple(P)
    look_rot(cam, np.asarray(Tg, float) - np.asarray(P, float))


# ------------------------------------------------------------------ H6 extras
if MODE == "h6":
    BAND0, BAND1 = 122.0, 130.0                       # Koch et al. 2004 predicted ceiling
    nx = 60
    xs = np.linspace(-200, 90, nx)
    fade = 1 - smoothstep(30, 85, xs)                 # soft right end: right third stays calm
    bv, bf = [], []
    zz = np.array([BAND0, BAND1])
    yy = np.array([-22.0, 22.0])
    # a thin slab: front, back, top, bottom faces as x-strips
    for (ya, za), (yb, zb) in (((yy[0], zz[0]), (yy[0], zz[1])), ((yy[1], zz[1]), (yy[1], zz[0])),
                               ((yy[0], zz[1]), (yy[1], zz[1])), ((yy[1], zz[0]), (yy[0], zz[0]))):
        P = np.zeros((nx, 2, 3))
        P[:, 0] = np.stack([xs, np.full(nx, ya), np.full(nx, za)], -1)
        P[:, 1] = np.stack([xs, np.full(nx, yb), np.full(nx, zb)], -1)
        base = sum(len(v) for v in bv)
        bv.append(P.reshape(-1, 3))
        q = np.arange(nx - 1)
        bf.append(np.stack([2 * q, 2 * q + 2, 2 * q + 3, 2 * q + 1], -1) + base)
    m_band = Mat("band", T["chalk"], alpha=0.0, emit_color=T["chalk"], emit=0.0, alpha_attr="fade", glow_attr="fade")
    band = static("band", np.concatenate(bv), np.concatenate(bf), m_band.m, attrs={"fade": np.tile(np.repeat(fade, 2), 4)})
    # band edges: two glowing hairlines on the front face, drawn on left -> right
    m_edge = Mat("bandedge", T["chalk"], alpha=1.0, emit_color=T["chalk"], emit=1.3, alpha_attr="fade", glow_attr="fade")
    ex = np.linspace(-200, 90, 80)
    ev, ef, ea, off = [], [], [], 0
    for z in (BAND0, BAND1):
        P = np.stack([ex, np.full(80, yy[0] - 0.3), np.full(80, z)], -1)
        v, f, s = tube_along(P, 0.3, 8)
        ev.append(v); ef.append(f + off); ea.append(np.repeat(1 - smoothstep(30, 85, ex), 8)); off += len(v)
    EV0 = np.concatenate(ev)
    edges = static("bandedges", EV0, np.concatenate(ef), m_edge.m, smooth=True, attrs={"fade": np.concatenate(ea)})

    GX = -15.0                                         # height gauge left of the crown
    m_gauge = Mat("gauge", T["chalk"], emit_color=T["chalk"], emit=0.9)
    V, F = bars([[0, 0, 0]], [[0, 0, 1]], [0.38], 12)
    gauge = static("gauge", V, F, m_gauge.m, smooth=True)
    gauge.ob.location = (GX, -2.0, 0)
    ND = 8                                             # dashes, period 3.4 m
    DPER, DLEN = 3.4, 2.0
    dash_tv, dash_tf = bars(np.zeros((ND, 3)), np.tile([[0, 0, 1.0]], (ND, 1)), np.full(ND, 0.38), 12)
    dashes = DynMesh("dashes", dash_tv, dash_tf, m_gauge.m)
    m_mark = Mat("marker", T["chalk"], emit_color=T["chalk"], emit=1.4)
    V, F = bars([[0, 0, 0]], [[1, 0, 0]], [0.42], 12)
    marker = static("marker", V, F, m_mark.m, smooth=True)
    marker.ob.location = (GX, -2.0, TREE_H)

    def tree_h(t):
        return lerp(80.0, TREE_H, seg(t, 0.3, 9.6))

# ------------------------------------------------------------------ H7 extras
if MODE == "h7":
    m_root = Mat("root", T["chalk"], rough=0.92)
    m_thread = Mat("thread", T["refrigerant"], alpha=1.0, emit_color=T["refrigerant"], emit=0.0,
                   reveal_attr="h", pulse=("h", 60.0, 0.55))
    m_glow = Mat("threadhalo", T["refrigerant"], alpha=0.22, emit_color=T["refrigerant"], emit=0.0,
                 reveal_attr="h", pulse=("h", 60.0, 0.55))
    NT = 6
    rng = np.random.default_rng(7)
    rv, rf, tv_, tf_, th_, hv, hf, hh = [], [], [], [], [], [], [], []
    ro = to = ho = 0
    for j in range(NT):
        a0 = 2 * np.pi * j / NT + rng.uniform(-0.25, 0.25)
        L = rng.uniform(11, 16)
        # root: a flat tapering bar along the ground
        rr = np.linspace(L, 2.0, 14)
        root = np.stack([rr * np.cos(a0), rr * np.sin(a0), 0.25 + 0.9 * (1 - rr / L) ** 2], -1)
        v, f, _ = tube_along(root, np.linspace(0.25, 1.1, 14), 8)
        rv.append(v); rf.append(f + ro); ro += len(v)
        zs = np.linspace(1.2, 113.0, 90)
        ang = a0 + 0.35 * np.sin(zs / 23.0 + j)
        rad = 0.48 * trunk_radius(zs)
        up = np.stack([rad * np.cos(ang), rad * np.sin(ang), zs], -1)
        path = np.concatenate([root[:-1], up])
        for (V_, F_, H_, rr_, o_) in ((tv_, tf_, th_, 0.34, "t"), (hv, hf, hh, 0.95, "h")):
            v, f, s = tube_along(path, rr_, 8)
            off = to if o_ == "t" else ho
            V_.append(v); F_.append(f + off); H_.append(s)
            if o_ == "t":
                to += len(v)
            else:
                ho += len(v)
    static("roots", np.concatenate(rv), np.concatenate(rf), m_root.m, smooth=True)
    static("threads", np.concatenate(tv_), np.concatenate(tf_), m_thread.m, smooth=True, attrs={"h": np.concatenate(th_)})
    static("threadhalo", np.concatenate(hv), np.concatenate(hf), m_glow.m, smooth=True, attrs={"h": np.concatenate(hh)})


# ------------------------------------------------------------------ update
def update(t, f):
    if MODE == "h1":
        # cues 3.12 'hyperion' (rise), 6.14 'metres up' (2D label)
        u = seg(t, 2.95, 7.45)
        P = np.array([lerp(-6.0, -12.0, u), lerp(lerp(-70.0, -64.0, seg(t, 0, 3.0)), -138.0, u),
                      lerp(lerp(2.0, 4.0, seg(t, 0, 3.0)), 101.0, u)])
        Tg = np.array([lerp(-6.0, -10.0, u), 0.0, lerp(15.0, 93.0, u)])
        aim(P, Tg)
    elif MODE == "h6":
        h = tree_h(t)
        s = h / TREE_H
        tree.scale = (s, s, s)
        # band: 4.19 'no taller than'
        b = seg(t, 4.05, 4.75)
        m_band.set(alpha=0.2 * b, emit=0.22 * b)
        dr = seg(t, 4.05, 5.0)                          # edges draw on from the left
        xcut = lerp(-200.0, 90.0, dr)
        V = EV0.copy()
        V[:, 0] = np.minimum(V[:, 0], xcut)
        edges.set_verts(V)
        edges.ob.hide_render = dr <= 0
        band.ob.hide_render = b <= 0
        gauge.ob.scale = (1, 1, h)
        # dashed trend: 10.65 'prediction', from the tree top up into the band, dashes march upward
        top = lerp(TREE_H, 126.5, seg(t, 10.5, 12.4))
        phase = max(0.0, t - 10.5) * 0.9
        P0 = np.zeros((ND, 3)); P1 = np.zeros((ND, 3))
        for k in range(ND):
            z0 = TREE_H + 0.9 + ((k * DPER + phase) % (ND * DPER)) - 0.0
            z1 = min(z0 + DLEN, top)
            if z0 >= top - 0.05 or z0 > 127.5:
                z1 = z0 + 1e-3
                z0 = -50.0
                z1 = -50.0 + 1e-3
            P0[k] = (GX, -2.0, z0); P1[k] = (GX, -2.0, max(z1, z0 + 1e-3))
        v, _ = bars(P0, P1, np.full(ND, 0.38), 12)
        dashes.set_verts(v)
        dashes.ob.hide_render = t < 10.5
        # Hyperion marker: 24.63 'just under it'
        mk = seg(t, 24.5, 25.1)
        marker.ob.scale = (max(1e-3, 30.0 * mk), 1, 1)
        marker.ob.hide_render = mk <= 0
        u = seg(t, 0.0, 4.0)
        v_ = seg(t, 4.0, DUR)
        dist = lerp(lerp(170.0, 210.0, u), 285.0, v_)
        tz = lerp(lerp(68.0, 76.0, u), 70.0, v_)
        tx = lerp(lerp(22.0, 26.0, u), 34.0, v_)
        aim((tx - 8.0, -dist, tz - 6.0), (tx, 0.0, tz))
    else:
        # cues 1.21 'stretched tight' (threads), 8.41 'no pump can beat' (10 m line)
        g = seg(t, 0.15, 1.15)
        m_trunk.set(alpha=lerp(1.0, 0.12, g))
        m_crown.set(alpha=lerp(1.0, 0.1, g))
        rv_ = lerp(0.0, 1.03, seg(t, 1.1, 5.6))
        m_thread.set(reveal=rv_, emit=1.7, phase=t * 9.0)
        m_glow.set(reveal=rv_, emit=0.7, phase=t * 9.0)
        ln = seg(t, 8.3, 8.9)
        m_line.set(emit=lerp(0.25, 1.8, ln))
        k = seg(t, 0, DUR)
        dist = lerp(232.0, 218.0, k)
        Tg = np.array([lerp(14.0, 12.0, k), 0.0, 60.0])
        aim(Tg + np.array([-10.0, -dist, -14.0]), Tg)


render_loop(args, update, MODE.upper())
