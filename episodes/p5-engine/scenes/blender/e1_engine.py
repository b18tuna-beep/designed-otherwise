"""P5 hero shots: one cylinder cutaway (H1, four stroke clips), the flame front (H2) and the four-throw crank (H3).

    blender -b --factory-startup -P e1_engine.py -- <out_dir> [first last] [--mode intake|compression|power|exhaust|flame|crank]
        [--frames N] [--res PCT] [--samples S] [--test 1,60,120]

Same contract as the P4 hero scripts (render-blender.yml): frames land in <out_dir>/f_%04d.png, `--frames N` is the slot length.
Rig and materials come from the P4 lock_common.py (Cycles CPU, Standard view transform, colours from style/tokens.json).

Crank angle: 0 = start of intake (piston at the top), 720 = one cycle. Piston pin height z = r cos(a) + sqrt(l^2 - (r sin a)^2).
Every stroke clip turns the crank at constant speed over SWEEP = (0.04, 0.94) of the slot and holds at both ends; the 2D overlays
(tools/anim/motion-canvas/src/p5/shared.tsx) use the same constants so the clock and dial agree with the picture.
View: side section, camera on -Y, X right, Z up, near-orthographic (lens 100), 90 px per unit at 1080p (same as the 2D Engine drawing).
"""
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "p4-lock", "scenes", "blender"))
import bpy  # noqa: E402
import bmesh  # noqa: E402
from mathutils import Matrix, Vector  # noqa: E402
from lock_common import (Args, Mat, T, box, camera, cam_side, lights, mixhex, place_camera, render_loop, seg, set_cam,  # noqa: E402
                         setup_scene, smoothstep, ease, rgb)

MODES = {"intake": 150, "compression": 150, "power": 150, "exhaust": 150, "flame": 180, "crank": 210}
START = {"intake": 0.0, "compression": 180.0, "power": 360.0, "exhaust": 540.0}
SWEEP = (0.04, 0.94)
R, L = 1.0, 3.0
BORE = 0.9
args = Args(MODES, "intake")
sc = setup_scene(args)
lights()
cam = camera(100)
N = 110
rs = np.random.RandomState(7)
SLOT = rs.rand(N, 3)
ORDER = rs.permutation(N)  # exit order


def zp(a):
    a = math.radians(a)
    return R * math.cos(a) + math.sqrt(L * L - (R * math.sin(a)) ** 2)


def bump(u, p=1.2):
    return float(max(0.0, math.sin(math.pi * min(max(u, 0), 1))) ** p) if 0 < u < 1 else 0.0


def lift_in(th):
    th = th % 720
    th = th - 720 if th > 705 else th
    return 0.32 * bump((th + 15) / 230)


def lift_ex(th):
    th = th % 720
    th = th + 720 if th < 15 else th
    return 0.32 * bump((th - 515) / 220)


# ------------------------------------------------------------------ materials
CHALK = Mat("chalk", T["chalk"])
BLOCK = Mat("block", mixhex(T["panel"], T["chalk"], 0.5))
PANEL = Mat("panel", T["panel"], rough=1.0, spec=0.0)
MUTED = Mat("muted", T["muted"])
GRID = Mat("grid", mixhex(T["grid"], T["muted"], 0.3))
LIME = Mat("lime", T["electric"], emit_color=T["electric"])
CHARGE = Mat("charge", T["refrigerant"])
BURNT = Mat("burnt", T["heat_soft"], emit_color=T["heat"])
FRONT = Mat("front", T["heat"], emit_color=T["heat"], alpha=0.1, rim=2.2)
FRONT.set(emit=1.8)
BURNT.set(emit=0.08)
GAS = Mat("gas", T["heat_soft"], emit_color=T["heat"], alpha=0.4)
GAS.set(emit=0.12)


def put(ob, mat, parent=None):
    ob.data.materials.clear()
    ob.data.materials.append(mat.m if isinstance(mat, Mat) else mat)
    if parent is not None:
        ob.parent = parent
    return ob


def slab(name, mat, x0, x1, z0, z1, y0=0.0, y1=0.5, parent=None):
    return put(box(name, x0, x1, y0, y1, z0, z1), mat, parent)


def disc(name, mat, r, y0, y1, segs=72, parent=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r, radius2=r, depth=y1 - y0,
                          matrix=Matrix.Translation((0, (y0 + y1) / 2, 0)) @ Matrix.Rotation(math.pi / 2, 4, "X"))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return put(ob, mat, parent)


def empty(name, loc=(0, 0, 0)):
    e = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(e)
    e.location = loc
    return e


def sphere(name, r, mat, sub=1):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=r)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return put(ob, mat)


def backplate(x0=-15, x1=15, z0=-7, z1=12):
    slab("back", PANEL, x0, x1, z0, z1, 0.95, 1.05)


# ------------------------------------------------------------------ the cylinder
class Engine:
    def __init__(self, clear=0.28):
        self.head = R + L + 0.5 + clear
        h = self.head
        backplate()
        for s in (-1, 1):
            xa, xb = sorted((s * BORE, s * 1.45))
            slab("wall%d" % s, BLOCK, xa, xb, 1.25, h)
            # head: outer wall pieces around the duct, duct walls, valve channel cap
            slab("hw_lo%d" % s, BLOCK, xa, xb, h, h + 0.27)
            slab("hw_hi%d" % s, BLOCK, xa, xb, h + 0.97, h + 1.42)
            xd0, xd1 = sorted((s * 1.45, s * 3.4))
            slab("duct_lo%d" % s, BLOCK, xd0, xd1, h + 0.17, h + 0.27)
            slab("duct_hi%d" % s, BLOCK, xd0, xd1, h + 0.97, h + 1.07)
            xc0, xc1 = sorted((s * 0.18, s * 0.86))
            slab("cap%d" % s, BLOCK, xc0, xc1, h + 1.42, h + 1.57)
            # the head ring between valve channel and outer wall
            slab("hw_mid%d" % s, BLOCK, *sorted((s * 0.86, s * BORE)), h, h + 1.42)
        slab("boss", BLOCK, -0.18, 0.18, h, h + 1.57)
        put(box("plug", -0.11, 0.11, -0.04, 0.5, h + 0.45, h + 1.75), CHALK)
        put(box("tip", -0.04, 0.04, -0.04, 0.3, h - 0.09, h + 0.45), LIME)
        LIME.set(emit=0.15)
        # piston, rings, pin
        self.piston = empty("piston")
        slab("pst", CHALK, -BORE + 0.03, BORE - 0.03, -0.5, 0.55, 0.0, 0.5, self.piston)
        for dz in (0.30, 0.18):
            slab("ring", PANEL, -BORE + 0.03, BORE - 0.03, dz, dz + 0.035, -0.012, 0.0, self.piston)
        disc("wristpin", PANEL, 0.12, -0.03, 0.01, 24, self.piston).location = (0, 0, 0)
        self.rod = empty("rod")
        slab("rodb", CHALK, -0.1, 0.1, -L / 2, L / 2, 0.14, 0.36, self.rod)
        # crank: rotating group at the origin, flywheel behind
        self.crank = empty("crank")
        disc("web", BLOCK, 1.18, 0.0, 0.32, 64, self.crank)
        slab("notch", PANEL, -0.08, 0.08, 0.7, 1.15, -0.012, 0.0, self.crank)
        disc("pin", CHALK, 0.2, 0.0, 0.5, 24, self.crank).location = (0, 0, R)
        self.fly = empty("fly")
        disc("flyd", BLOCK, 1.95, 0.55, 0.8, 96, self.fly)
        for k in range(12):
            a = k * math.pi / 6
            t = slab("tick", MUTED, -0.05, 0.05, 1.5, 1.88, 0.5, 0.55, self.fly)
            t.rotation_euler = (0, a, 0)
        # valves
        self.valves = {}
        for name, s in (("in", -1), ("ex", 1)):
            e = empty("v" + name, (s * 0.52, 0, h))
            slab("vh", CHALK, -0.34, 0.34, -0.09, 0.0, 0.12, 0.38, e)
            slab("vs", CHALK, -0.045, 0.045, 0.0, 1.95, 0.2, 0.3, e)
            self.valves[name] = e
        # charge particles
        self.pts = []
        for i in range(N):
            ob = sphere("p%d" % i, 0.055, CHARGE)
            self.pts.append(ob)

    def pose(self, th, lock_flame=None):
        th = float(th)
        z = zp(th)
        self.piston.location = (0, 0, z)
        a = math.radians(th)
        px, pz = R * math.sin(a), R * math.cos(a)
        self.crank.rotation_euler = (0, a, 0)
        self.fly.rotation_euler = (0, a, 0)
        self.rod.location = ((px) / 2, 0, (pz + z) / 2)
        self.rod.rotation_euler = (0, math.atan2(-px, z - pz), 0)
        self.valves["in"].location = (-0.52, 0, self.head - lift_in(th))
        self.valves["ex"].location = (0.52, 0, self.head - lift_ex(th))
        return z

    def particles(self, th, flame_r=None, tip=None, show=True):
        h = self.head
        crown = zp(th) + 0.55
        th = th % 720
        for i, ob in enumerate(self.pts):
            u, v, w = SLOT[i]
            sx, sz, sy = (u - 0.5) * 1.55, crown + 0.06 + v * max(h - crown - 0.12, 0.02), 0.06 + 0.38 * w
            pos, mat, vis = (sx, sy, sz), CHARGE, True
            if not show:
                vis = False
            elif flame_r is not None:
                d = math.dist((sx, sz), tip)
                if d < flame_r - 0.1:
                    mat = BURNT
                elif d < flame_r + 0.06:
                    mat = FRONT
                else:
                    mat = CHARGE
            elif th < 180:
                e = 8 + 150 * (i / N)
                if th < e:
                    vis = False
                elif th < e + 22:
                    f = float(smoothstep(0, 1, (th - e) / 22))
                    pos = (-0.52 + (sx + 0.52) * f, sy, h + 0.3 + (sz - h - 0.3) * f)
            elif 360 <= th < 540:
                R_f = 2.6 * float(smoothstep(345, 410, th))
                d = math.dist((sx, sz), (0, h - 0.1))
                mat = BURNT if d < R_f else CHARGE
                if abs(d - R_f) < 0.1 and R_f < 2.5:
                    mat = FRONT
            elif th >= 540:
                e = 545 + 130 * (np.where(ORDER == i)[0][0] / N)
                mat = BURNT
                if th >= e + 30:
                    vis = False
                elif th > e:
                    f = float(smoothstep(0, 1, (th - e) / 30))
                    if f < 0.4:
                        g = f / 0.4
                        pos = (sx + (0.52 - sx) * g, sy, sz + (h - 0.05 - sz) * g)
                    else:
                        g = (f - 0.4) / 0.6
                        pos = (0.52 + (3.0 - 0.52) * g, sy, h + 0.15 + 0.35 * g)
            ob.hide_render = not vis
            ob.hide_viewport = not vis
            if vis:
                ob.location = (pos[0], pos[1], pos[2])
                ob.data.materials[0] = mat.m if isinstance(mat, Mat) else mat


def sweep(p):
    return seg(p, SWEEP[0], SWEEP[1], lambda x: np.clip(x, 0, 1))


def frame_cam(width=1920 / 90.0, target=(200 / 90.0, 0.0, 2.3 - 20 / 90.0)):
    # the engine sits at screen x = -200 px, y = +20 px (90 px per unit), the same place the 2D cutaway is drawn
    set_cam(cam, cam_side(target=target, width=width, lens=100.0, el=0.0))


# ------------------------------------------------------------------ cutaway clips
def build_cutaway(mode):
    eng = Engine()
    th0 = START[mode]
    frame_cam()

    def update(vf, f):
        p = (vf - 1) / (MODES[mode] - 1)
        th = th0 + 180.0 * sweep(p)
        eng.pose(th)
        eng.particles(th)
    return update


# ------------------------------------------------------------------ flame front (H2): zoomed section of the chamber
def build_flame():
    eng = Engine(clear=1.25)  # chamber drawn taller than life so the front can be seen (the overlay says ZOOM)
    h = eng.head
    tip = (0.0, h - 0.1)
    frame_cam(width=6.2, target=(0.0, 0.0, h - 0.55))
    # wrinkled front: icosphere, vertices moved every frame
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=5, radius=1.0)
    D = np.array([v.co[:] for v in bm.verts])
    me1 = bpy.data.meshes.new("front")
    bm.to_mesh(me1)
    bm.free()
    me1.shade_smooth()
    front = bpy.data.objects.new("front", me1)
    bpy.context.scene.collection.objects.link(front)
    put(front, FRONT)
    me2 = me1.copy()
    gas = bpy.data.objects.new("gas", me2)
    bpy.context.scene.collection.objects.link(gas)
    put(gas, GAS)
    n = len(D)

    def update(vf, f):
        p = (vf - 1) / (MODES["flame"] - 1)
        th = 352.0 + 30.0 * p
        eng.pose(th)
        crown = zp(th) + 0.55
        flash = float(seg(p, 0.07, 0.10) * (1 - seg(p, 0.10, 0.15)))
        LIME.set(emit=0.15 + 14.0 * flash)
        r = 0.02 + 1.65 * float(seg(p, 0.12, 0.97, lambda x: np.clip(x, 0, 1)))
        t = p * 9.0
        nz = (0.5 * np.sin(5 * D[:, 0] + 2.1 * t) + 0.5 * np.sin(6 * D[:, 2] - 1.7 * t + 1.3)
              + 0.5 * np.sin(7 * D[:, 0] * D[:, 2] + 1.1 * t) + 0.35 * np.sin(11 * D[:, 1] + 3 * t)) / 1.85
        for ob, k, shrink in ((front, 1.0, 1.0), (gas, 1.0, 0.965)):
            rr = r * (1 + (0.07 + 0.05 * min(r, 1.5)) * nz) * shrink
            P = np.stack([tip[0] + rr * D[:, 0], rr * D[:, 1], tip[1] + rr * D[:, 2]], axis=1)
            P[:, 0] = np.clip(P[:, 0], -BORE + 0.05, BORE - 0.05)
            P[:, 2] = np.clip(P[:, 2], crown + 0.04, h - 0.04)
            P[:, 1] = np.clip(P[:, 1], 0.0, 0.5)
            ob.data.vertices.foreach_set("co", P.reshape(-1))
            ob.data.update()
            ob.hide_render = r < 0.08
        eng.particles(th, flame_r=r if r >= 0.08 else -1, tip=tip)
    return update


# ------------------------------------------------------------------ four-throw crank (H3)
def build_crank():
    backplate(-14, 14, -5, 10)
    XK = [-4.5, -1.5, 1.5, 4.5]
    PHI = [0, 180, 180, 0]      # throw angle of cylinders 1..4
    OFF = [360, 540, 180, 0]    # cycle angle = beta + OFF (mod 720): firing 1-3-4-2 every 180 degrees
    axis = empty("shaft", (0, 0.25, 0))
    put(box("main", -6.3, 6.3, -0.2, 0.2, -0.2, 0.2), MUTED, axis)
    mats = []
    parts = []
    for k in range(4):
        m = Mat("throw%d" % k, T["chalk"], alt=T["muted"])
        mats.append(m)
        zl = R * math.cos(math.radians(PHI[k]))
        for dx in (-0.55, 0.55):
            w0, w1 = (-0.3, zl + 0.3) if zl > 0 else (zl - 0.3, 0.3)
            put(box("web", XK[k] + dx - 0.09, XK[k] + dx + 0.09, -0.3, 0.3, w0, w1), m, axis)
            # counterweight on the far side of the shaft
            cw0, cw1 = (-1.0, -0.3) if zl > 0 else (0.3, 1.0)
            put(box("cw", XK[k] + dx - 0.09, XK[k] + dx + 0.09, -0.3, 0.3, cw0, cw1), m, axis)
        put(box("pin", XK[k] - 0.55, XK[k] + 0.55, -0.16, 0.16, zl - 0.16, zl + 0.16), m, axis)
    pist, rods, pmat = [], [], []
    for k in range(4):
        m2 = Mat("pist%d" % k, T["chalk"], alt=T["muted"])
        pmat.append(m2)
        pe = empty("pist%d" % k)
        slab("p", m2, XK[k] - BORE + 0.03, XK[k] + BORE - 0.03, -0.5, 0.55, 0.0, 0.5, pe)
        for dz in (0.30, 0.18):
            slab("ring", PANEL, XK[k] - BORE + 0.03, XK[k] + BORE - 0.03, dz, dz + 0.035, -0.012, 0.0, pe)
        pist.append(pe)
        rod = put(box("rod", -0.1, 0.1, -0.08, 0.08, -0.5, 0.5), m2)
        rods.append(rod)
        # thin sleeve guides (no block in this shot)
        for s in (-1, 1):
            slab("g", GRID, XK[k] + s * BORE, XK[k] + s * BORE + 0.03, 1.3, 5.3, 0.0, 0.5)
    place_camera(cam, (0, 0.3, 2.6), 24.0, 14.0, -20.0, 60.0)

    def update(vf, f):
        p = (vf - 1) / (MODES["crank"] - 1)
        beta = 30.0 + 660.0 * sweep(p)
        axis.rotation_euler = (math.radians(beta), 0, 0)
        for k in range(4):
            a = math.radians(beta + PHI[k])
            z = R * math.cos(a) + math.sqrt(L * L - (R * math.sin(a)) ** 2)
            pist[k].location = (0, 0.0, z)
            P0 = Vector((XK[k], 0.25 - R * math.sin(a), R * math.cos(a)))
            P1 = Vector((XK[k], 0.25, z))
            rods[k].location = (P0 + P1) / 2
            rods[k].scale = (1, 1, (P1 - P0).length)
            rods[k].rotation_euler = (P1 - P0).to_track_quat("Z", "Y").to_euler()
            cyc = (beta + OFF[k]) % 720
            lit = float(smoothstep(358, 372, cyc) * (1 - smoothstep(528, 542, cyc)))
            mats[k].set(mix=1 - lit)
            pmat[k].set(mix=1 - lit)
    return update


builders = {"flame": build_flame, "crank": build_crank}
update = builders.get(args.mode, lambda: build_cutaway(args.mode))()
render_loop(args, update, "p5 " + args.mode)
