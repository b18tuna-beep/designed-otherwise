"""Shared rig for the P4 (pin tumbler lock) hero shots.

Same pipeline and command-line contract as P3's tree_common.py (copied and trimmed):
    python l1_lock.py -- <out_dir> [first last] [--frames N] [--res PCT] [--samples S]
        [--mode NAME] [--test 1,120,300]
Frames are written as <out_dir>/f_%04d.png. Cycles CPU, Standard view transform
(never AgX), colours read from style/tokens.json, nothing hard-coded.

Look: dark slate world, matte chalk solids, violet working parts. Clean engineer's
cutaway: the lock is sliced along the vertical mid-plane (the near half is removed,
the cut face looks at the camera on -Y); pins, springs and the key are whole bodies
sitting in the half-bores.

Axes: X = plug axis (key enters from -X), Z = up, cut plane y = 0 (camera on -Y).
Plug radius RP = 1.0 (the unit), so the shear line is the plane z = RP, the gap
between plug and housing.

Rig API (class Lock):
    Lock(design=(3,5,2,6,4), master={2: 2}, spool=[3], misalign=[...])
    lock.add_key("A", bitting, style="square"|"round")
    lock.set_bitting(list, key="A")      cut depths in steps (1 shallow .. 6 deep, floats ok)
    lock.key_insert(p, key="A")          0 = key outside, 1 = fully inserted
    lock.plug_turn(deg)                  + = clockwise seen from the key side
    lock.shear(glow)                     0 dim/muted line .. 1 violet glow
    lock.style_stack(i, mix, emit)       mix 0 violet .. 1 muted, emit glow
    lock.apply()                         recompute every pin from the key profile under it
"""
import json
import math
import os
import sys
import time

import numpy as np
import bpy
import bmesh
from mathutils import Matrix, Vector
import mathutils.geometry as mgeo

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
T = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]
FPS = 30


# ------------------------------------------------------------------ args
class Args:
    """modes = {name: default_frames}; same options as P3 plus --mode."""

    def __init__(self, modes, default_mode):
        a = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []

        def opt(name, default, cast=int):
            if name in a:
                i = a.index(name)
                v = a[i + 1]
                del a[i:i + 2]
                return cast(v)
            return default

        self.mode = opt("--mode", default_mode, str)
        if self.mode not in modes:
            raise SystemExit("unknown --mode %r (have %s)" % (self.mode, ", ".join(modes)))
        self.default_frames = modes[self.mode]
        self.frames = opt("--frames", self.default_frames)
        self.res = opt("--res", 100)
        self.samples = opt("--samples", 8)
        test = opt("--test", None, str)
        self.out = a[0] if a else "/tmp/hero_out"
        first, last = (int(a[1]), int(a[2])) if len(a) >= 3 else (1, self.frames)
        if test:
            self.frame_list = [int(x) for x in test.split(",")]
        else:
            self.frame_list = list(range(first, last + 1))

    def vf(self, f):
        """virtual frame: the timeline is authored for default_frames; --frames stretches it."""
        return 1.0 + (f - 1) * (self.default_frames - 1) / max(self.frames - 1, 1)


# ------------------------------------------------------------------ colour
def rgb(hexstr, a=1.0):
    h = hexstr.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


def mixhex(a, b, f):
    """blend two token hexes in sRGB space (still palette colours, never a new hue)."""
    ha, hb = a.lstrip("#"), b.lstrip("#")
    c = [round(int(ha[i:i + 2], 16) * (1 - f) + int(hb[i:i + 2], 16) * f) for i in (0, 2, 4)]
    return "#%02X%02X%02X" % tuple(c)


# ------------------------------------------------------------------ easing
def clamp01(x):
    return np.clip(x, 0.0, 1.0)


def smoothstep(e0, e1, x):
    t = clamp01((np.asarray(x, dtype=float) - e0) / (e1 - e0))
    return t * t * (3 - 2 * t)


def ease(x):
    x = clamp01(np.asarray(x, dtype=float))
    return np.where(x < 0.5, 4 * x ** 3, 1 - (-2 * x + 2) ** 3 / 2)


def ease_out(x):
    x = clamp01(np.asarray(x, dtype=float))
    return 1 - (1 - x) ** 3


def seg(t, t0, t1, fn=ease):
    return float(fn((t - t0) / (t1 - t0)))


def lerp(a, b, u):
    return a + (b - a) * u


# ------------------------------------------------------------------ scene
def setup_scene(args):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = args.samples
    sc.cycles.use_adaptive_sampling = False
    sc.cycles.max_bounces = 4
    sc.cycles.diffuse_bounces = 2
    sc.cycles.glossy_bounces = 1
    sc.cycles.transmission_bounces = 0
    sc.cycles.volume_bounces = 0
    sc.cycles.transparent_max_bounces = 8
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.use_denoising = True
    sc.cycles.denoising_quality = "FAST"
    sc.cycles.denoising_prefilter = "FAST"
    sc.render.use_persistent_data = True
    sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
    sc.render.resolution_percentage = args.res
    sc.render.fps = FPS
    sc.frame_start, sc.frame_end = 1, args.frames
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGB"
    sc.render.film_transparent = False
    sc.display_settings.display_device = "sRGB"
    sc.view_settings.view_transform = "Standard"      # never AgX: tokens must come out as their hex
    sc.view_settings.look = "None"
    sc.view_settings.exposure = 0.0
    sc.view_settings.gamma = 1.0

    # world: camera rays see exactly the bg token; everything else gets a soft ambient
    # (flat-ish engineer's-model shading) so the background never changes with the lighting
    world = bpy.data.worlds.new("w")
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bgc = nt.nodes.new("ShaderNodeBackground")
    bgc.inputs["Color"].default_value = rgb(T["bg"])
    bgc.inputs["Strength"].default_value = 1.0
    amb = nt.nodes.new("ShaderNodeBackground")
    amb.inputs["Color"].default_value = rgb(mixhex(T["bg"], T["chalk"], 0.55))
    amb.inputs["Strength"].default_value = AMBIENT
    lp = nt.nodes.new("ShaderNodeLightPath")
    mx = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Camera Ray"], mx.inputs["Fac"])
    nt.links.new(amb.outputs["Background"], mx.inputs[1])
    nt.links.new(bgc.outputs["Background"], mx.inputs[2])
    nt.links.new(mx.outputs["Shader"], out.inputs["Surface"])
    return sc


AMBIENT = 0.55


def sun(direction_deg, strength, color=(1, 1, 1), angle_deg=10):
    """direction_deg = (elevation, azimuth): where the light comes FROM (az -90 = camera side)."""
    el, az = (math.radians(d) for d in direction_deg)
    ld = bpy.data.lights.new("sun", "SUN")
    ld.energy = strength
    ld.color = color
    ld.angle = math.radians(angle_deg)
    ob = bpy.data.objects.new("sun", ld)
    bpy.context.scene.collection.objects.link(ob)
    src = np.array([math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el)])
    ob.rotation_euler = Vector(tuple(-src)).to_track_quat("-Z", "Y").to_euler()
    return ob


def camera(lens=50):
    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    cd.clip_start = 0.05
    cd.clip_end = 400
    ob = bpy.data.objects.new("cam", cd)
    bpy.context.scene.collection.objects.link(ob)
    bpy.context.scene.camera = ob
    return ob


def place_camera(cam, target, dist, el_deg, az_deg, lens=None):
    """camera on a sphere around target; az 0 = on -Y looking +Y, az < 0 = toward the key side (-X)."""
    el, az = math.radians(el_deg), math.radians(az_deg)
    off = np.array([math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)]) * dist
    cam.location = tuple(np.asarray(target, float) + off)
    cam.rotation_euler = Vector(tuple(-off)).to_track_quat("-Z", "Y").to_euler()
    if lens:
        cam.data.lens = lens


def lights():
    """key from camera-left-above, soft cool rim from behind, small top fill."""
    sun((52, -118), 1.7, angle_deg=14)
    sun((28, -40), 0.5, color=(0.92, 0.95, 1.0), angle_deg=20)
    sun((20, 70), 0.9, color=(0.9, 0.93, 1.0), angle_deg=8)


# ------------------------------------------------------------------ materials
def _val(nt, v):
    n = nt.nodes.new("ShaderNodeValue")
    n.outputs[0].default_value = v
    return n.outputs[0]


class Mat:
    """Matte token material with live controls (Value nodes):
         set(mix=)   0 = base colour .. 1 = alt colour
         set(emit=)  emission strength (emit_color)
         set(alpha=) opacity"""

    def __init__(self, name, color, rough=0.9, spec=0.12, alt=None, emit_color=None, alpha=1.0, rim=None):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nt = m.node_tree
        b = nt.nodes["Principled BSDF"]
        b.inputs["Roughness"].default_value = rough
        b.inputs["Specular IOR Level"].default_value = spec
        b.inputs["Base Color"].default_value = rgb(color)
        self.m, self.h = m, {}
        if alt is not None:
            f = _val(nt, 0.0)
            self.h["mix"] = f
            n = nt.nodes.new("ShaderNodeMix")
            n.data_type = "RGBA"
            ins = {s.identifier: s for s in n.inputs}
            nt.links.new(f, ins["Factor_Float"])
            ins["A_Color"].default_value = rgb(color)
            ins["B_Color"].default_value = rgb(alt)
            res = [s for s in n.outputs if s.identifier == "Result_Color"][0]
            nt.links.new(res, b.inputs["Base Color"])
        if emit_color is not None:
            b.inputs["Emission Color"].default_value = rgb(emit_color)
            e = _val(nt, 0.0)
            self.h["emit"] = e
            nt.links.new(e, b.inputs["Emission Strength"])
        a = _val(nt, alpha)
        self.h["alpha"] = a
        if rim is not None:
            # more opaque at grazing angles: walls and edges read as outlines, faces stay faint
            lw = nt.nodes.new("ShaderNodeLayerWeight")
            lw.inputs["Blend"].default_value = 0.35
            pw = nt.nodes.new("ShaderNodeMath"); pw.operation = "POWER"
            nt.links.new(lw.outputs["Facing"], pw.inputs[0]); pw.inputs[1].default_value = 2.5
            ml = nt.nodes.new("ShaderNodeMath"); ml.operation = "MULTIPLY"
            nt.links.new(pw.outputs[0], ml.inputs[0]); ml.inputs[1].default_value = rim
            ad = nt.nodes.new("ShaderNodeMath"); ad.operation = "ADD"; ad.use_clamp = True
            nt.links.new(a, ad.inputs[0]); nt.links.new(ml.outputs[0], ad.inputs[1])
            a = ad.outputs[0]
        nt.links.new(a, b.inputs["Alpha"])

    def set(self, **kw):
        for k, v in kw.items():
            self.h[k].default_value = float(v)


def flat_mat(name, color, rough=0.9, spec=0.12):
    return Mat(name, color, rough, spec).m


# ------------------------------------------------------------------ mesh helpers
def make_obj(name, V, F, mats, smooth=False):
    me = bpy.data.meshes.new(name)
    me.from_pydata(np.asarray(V, float).tolist(), [], [[int(i) for i in f] for f in F])
    me.update()
    for m in mats:
        me.materials.append(m)
    if smooth:
        me.shade_smooth()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def revolve(segments, sides=40):
    """Surface of revolution about +Z. segments = list of polylines [(r, z), ...]; each is
    smooth-shaded inside, hard-edged against its neighbours. Traverse the outline
    bottom-axis -> out -> up -> in to the top axis so all faces share one winding."""
    ang = np.linspace(0, 2 * np.pi, sides, endpoint=False)
    ca, sa = np.cos(ang), np.sin(ang)
    V, F = [], []
    for s in segments:
        base = len(V)
        for r, z in s:
            for j in range(sides):
                V.append((r * ca[j], r * sa[j], z))
        for k in range(len(s) - 1):
            for j in range(sides):
                j1 = (j + 1) % sides
                F.append((base + k * sides + j, base + k * sides + j1,
                          base + (k + 1) * sides + j1, base + (k + 1) * sides + j))
    return np.array(V), F


def tube_along(P, r, sides=6):
    """tube along polyline P (M,3); returns verts (M*sides,3), faces."""
    P = np.asarray(P, float)
    M = len(P)
    t = np.gradient(P, axis=0)
    t /= np.linalg.norm(t, axis=1, keepdims=True)
    ref = np.where(np.abs(t[:, 2:3]) > 0.9, np.array([[1.0, 0, 0]]), np.array([[0, 0, 1.0]]))
    n = np.cross(t, ref)
    n /= np.linalg.norm(n, axis=1, keepdims=True)
    b = np.cross(t, n)
    a = np.linspace(0, 2 * np.pi, sides, endpoint=False)
    V = P[:, None, :] + r * (np.cos(a)[None, :, None] * n[:, None, :] + np.sin(a)[None, :, None] * b[:, None, :])
    return V.reshape(-1, 3)


def tube_faces(M, sides):
    F = []
    for k in range(M - 1):
        for j in range(sides):
            j1 = (j + 1) % sides
            F.append((k * sides + j, k * sides + j1, (k + 1) * sides + j1, (k + 1) * sides + j))
    return F


# ---- bmesh primitives for the booleans (static geometry, built once)
def _bm_obj(name, bm):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def cyl_x(name, r, x0, x1, segs=96):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r, radius2=r,
                          depth=x1 - x0,
                          matrix=Matrix.Translation(((x0 + x1) / 2, 0, 0)) @ Matrix.Rotation(math.pi / 2, 4, "Y"))
    return _bm_obj(name, bm)


def cyl_zs(name, specs, segs=48):
    """several vertical cylinders in one mesh; specs = [(cx, cy, r, z0, z1)] (must not overlap)."""
    bm = bmesh.new()
    for cx, cy, r, z0, z1 in specs:
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r, radius2=r,
                              depth=z1 - z0, matrix=Matrix.Translation((cx, cy, (z0 + z1) / 2)))
    return _bm_obj(name, bm)


def box(name, x0, x1, y0, y1, z0, z1):
    bm = bmesh.new()
    c = Vector(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    bmesh.ops.create_cube(bm, size=2.0, matrix=Matrix.Translation(c) @
                          Matrix.Diagonal((abs(x1 - x0) / 2, abs(y1 - y0) / 2, abs(z1 - z0) / 2, 1.0)))
    return _bm_obj(name, bm)


def boolean(target, cutter, op="DIFFERENCE", remove_cutter=True):
    md = target.modifiers.new("bool", "BOOLEAN")
    md.operation = op
    md.object = cutter
    md.solver = "EXACT"
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(target.evaluated_get(dg))
    target.modifiers.remove(md)
    old = target.data
    target.data = me
    bpy.data.meshes.remove(old)
    if remove_cutter:
        cm = cutter.data
        bpy.data.objects.remove(cutter)
        bpy.data.meshes.remove(cm)


def bevel(target, width=0.012, segs=2, angle=40):
    md = target.modifiers.new("bev", "BEVEL")
    md.width = width
    md.segments = segs
    md.limit_method = "ANGLE"
    md.angle_limit = math.radians(angle)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(target.evaluated_get(dg))
    target.modifiers.remove(md)
    old = target.data
    target.data = me
    bpy.data.meshes.remove(old)


def assign_mats(ob, mats, classify):
    """material_index per face from classify(centres (n,3), normals (n,3)) -> int array."""
    me = ob.data
    me.materials.clear()
    for m in mats:
        me.materials.append(m)
    n = len(me.polygons)
    cen = np.zeros(n * 3)
    nor = np.zeros(n * 3)
    me.polygons.foreach_get("center", cen)
    me.polygons.foreach_get("normal", nor)
    me.polygons.foreach_set("material_index", classify(cen.reshape(-1, 3), nor.reshape(-1, 3)).astype(np.int32))
    me.update()


def smooth_by_angle(ob, deg=32):
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    thr = math.radians(deg)
    for f in bm.faces:
        f.smooth = True
    for e in bm.edges:
        if len(e.link_faces) == 2 and e.calc_face_angle(0.0) > thr:
            e.smooth = False
    bm.to_mesh(ob.data)
    bm.free()
    ob.data.update()


# ------------------------------------------------------------------ lock dimensions
RP = 1.0                    # plug radius; shear line at z = RP
GAP = 0.035                 # plug / housing gap (the shear line)
RH = 1.6                    # housing outer radius
HEAD_HALF, HEAD_TOP = 0.80, 2.2   # housing head block (the classic profile)
LH = 3.3                    # housing length
PLUG_X0, PLUG_X1 = -0.16, LH + 0.08
NPIN, PITCH, X0 = 5, 0.5, 0.55
XP = [X0 + i * PITCH for i in range(NPIN)]
R_PIN, R_CH = 0.15, 0.2   # pin radius, chamber radius
Z_REST = 0.0                # key-pin bottom with no key
Z_CEIL = 2.0                # chamber ceiling
SLOT_W, SLOT_TOP, SLOT_BOT = 0.23, 0.68, -0.74
KMAX, STEP = 0.60, 0.06     # uncut key top edge, height per bitting step
KEY_BOT, KEY_T = -0.58, 0.15
HW = 0.06                   # flat half-width of a cut
XS_IN, XS_OUT = PLUG_X0 - 0.005, -4.3     # key shoulder x fully inserted / outside
UP = [x - XS_IN for x in XP]              # cut centres in key coordinates
LB = 3.22                   # blade length
LEAD_SLOPE = 1.6
U_LEAD = LB - (KMAX + 0.0) / LEAD_SLOPE
D_DRIVER, D_WAFER_STEP = 0.60, 0.06
SPRING_TURNS, SPRING_R, SPRING_WIRE = 7, 0.105, 0.03
SPRING_MIN = 0.2


def key_height(bitting, u):
    """key top edge height at key coordinate u (numpy). -9 where there is no blade."""
    u = np.asarray(u, float)
    drop = np.zeros_like(u)
    for j, d in enumerate(bitting):
        depth = d * STEP
        drop = np.maximum(drop, np.clip(depth - np.maximum(0.0, np.abs(u - UP[j]) - HW), 0, depth))
    drop = np.maximum(drop, np.clip((u - U_LEAD) * LEAD_SLOPE, 0, None))
    return np.where((u < 0) | (u > LB), -9.0, KMAX - drop)


# pin shapes
def keypin_segments(L):
    r = R_PIN
    dome = [(0.04 * math.sin(a), 0.04 * (1 - math.cos(a))) for a in np.linspace(0, math.radians(68), 6)]
    return [dome + [(r, 0.115)], [(r, 0.115), (r, L - 0.014)], [(r, L - 0.014), (r - 0.014, L)],
            [(r - 0.014, L), (0.0, L)]], dome


_dome = keypin_segments(0.5)[1]
TIP_R = np.array([p[0] for p in _dome] + [R_PIN])
TIP_Z = np.array([p[1] for p in _dome] + [0.115])


def driver_segments(D):
    r, c = R_PIN, 0.014
    return [[(0, 0), (r - c, 0)], [(r - c, 0), (r, c)], [(r, c), (r, D - c)], [(r, D - c), (r - c, D)],
            [(r - c, D), (0, D)]]


def spool_segments(D):
    r, c, w = R_PIN, 0.014, 0.085
    fl = 0.16
    return [[(0, 0), (r - c, 0)], [(r - c, 0), (r, c)], [(r, c), (r, fl - 0.03)],
            [(r, fl - 0.03), (0.105, fl + 0.01), (w, fl + 0.035)],
            [(w, fl + 0.035), (w, D - fl - 0.035)],
            [(w, D - fl - 0.035), (0.105, D - fl - 0.01), (r, D - fl + 0.03)],
            [(r, D - fl + 0.03), (r, D - c)], [(r, D - c), (r - c, D)], [(r - c, D), (0, D)]]


# ------------------------------------------------------------------ the key
def _round_corner(cx, cz, r, a0, a1, n=8):
    return [(cx + r * math.cos(math.radians(a)), cz + r * math.sin(math.radians(a))) for a in np.linspace(a0, a1, n)]


def key_outline(bitting, style):
    """closed outline (u, z) of the key, counter-clockwise, plus the hole circle."""
    uu = np.linspace(0, LB, 700)
    hh = key_height(bitting, uu)
    top = [(float(u), float(h)) for u, h in zip(uu, hh)]
    # drop collinear points
    keep = [top[0]]
    for a, b, c in zip(top[:-2], top[1:-1], top[2:]):
        if abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) > 1e-9:
            keep.append(b)
    keep.append(top[-1])
    top = keep[::-1]                           # tip -> shoulder
    blade = [(0.0, KEY_BOT), (LB - 0.3, KEY_BOT), (LB, KEY_BOT + 0.3)] + [(LB, top[0][1])]
    blade += top[1:]                           # ends at (0, KMAX)
    if style == "round":
        bw, zt, zb, cr = 1.25, 1.0, -1.0, 0.62
        hole = (-0.62, 0.0, 0.2)
    else:
        bw, zt, zb, cr = 1.15, 0.92, -0.9, 0.16
        hole = (-0.55, 0.02, 0.17)
    bow = [(0.0, zt - cr)]
    bow += _round_corner(0 - cr, zt - cr, cr, 0, 90)
    bow += _round_corner(-bw + cr, zt - cr, cr, 90, 180)
    bow += _round_corner(-bw + cr, zb + cr, cr, 180, 270)
    bow += _round_corner(0 - cr, zb + cr, cr, 270, 360)
    bow = bow[:]                               # ends at (0, zb+cr)
    return blade + bow + [(0.0, KEY_BOT)], hole


def key_mesh(bitting, style):
    outline, hole = key_outline(bitting, style)
    # remove duplicate consecutive points
    o = [outline[0]]
    for p in outline[1:]:
        if math.hypot(p[0] - o[-1][0], p[1] - o[-1][1]) > 1e-6:
            o.append(p)
    if math.hypot(o[0][0] - o[-1][0], o[0][1] - o[-1][1]) < 1e-6:
        o.pop()
    hc = [(hole[0] + hole[2] * math.cos(a), hole[1] + hole[2] * math.sin(a))
          for a in np.linspace(2 * math.pi, 0, 28, endpoint=False)]
    loops3 = [[Vector((u, 0.0, z)) for u, z in o], [Vector((u, 0.0, z)) for u, z in hc]]
    tris = mgeo.tessellate_polygon(loops3)
    pts = [p for lp in loops3 for p in lp]
    n = len(pts)
    t2 = KEY_T / 2
    V = [(p.x, -t2, p.z) for p in pts] + [(p.x, t2, p.z) for p in pts]
    F = [(a, b, c) for a, b, c in tris] + [(a + n, c + n, b + n) for a, b, c in tris]
    start = 0
    for lp in loops3:
        m = len(lp)
        for k in range(m):
            a, b = start + k, start + (k + 1) % m
            F.append((a, b, b + n, a + n))
        start += m
    return np.array(V), F


class Key:
    def __init__(self, name, bitting, style, mat):
        self.name, self.style, self.mat = name, style, mat
        self.p = 0.0
        self.show = True
        self.bitting = list(bitting)
        self.ob = None
        self.rebuild()

    def rebuild(self):
        V, F = key_mesh(self.bitting, self.style)
        if self.ob is None:
            self.ob = make_obj("key_" + self.name, V, F, [self.mat], smooth=False)
        else:
            me = self.ob.data
            me.clear_geometry()
            me.from_pydata(V.tolist(), [], [list(map(int, f)) for f in F])
            me.update()

    def xs(self):
        return lerp(XS_OUT, XS_IN, self.p)


# ------------------------------------------------------------------ the lock
class Lock:
    def __init__(self, design=(3, 5, 2, 6, 4), master=None, spool=None, misalign=None, bevels=True):
        """design: the key bitting the pins are cut for (key A). master={stack: extra_steps} adds a
        wafer of extra_steps*STEP thickness (the second key is cut that many steps deeper there).
        spool=[stack,...] makes those drivers spools. misalign=[dy per stack] shifts the housing
        holes (and drivers/springs) sideways (tolerance shot)."""
        self.design = list(design)
        self.master = dict(master or {})
        self.spool = list(spool or [])
        self.hy = list(misalign) if misalign is not None else [0.0] * NPIN
        self.plug_angle = 0.0
        self.spool_tilt = 0.0
        self.keys = {}
        self.k_chalk = mixhex(T["chalk"], T["muted"], 0.0)
        self.m_housing = flat_mat("housing", mixhex(T["chalk"], T["muted"], 0.55))
        self.m_plug = flat_mat("plug", mixhex(T["chalk"], T["muted"], 0.12))
        self.m_key = flat_mat("key", T["chalk"])
        self.m_inner = flat_mat("inner", T["panel"], rough=1.0, spec=0.0)
        self._build_housing(bevels)
        self._build_plug(bevels)
        self._build_shear()
        self._build_stacks()
        self.add_key("A", self.design, "square")

    # ---- static bodies
    def _build_housing(self, bevels):
        h = cyl_x("housing", RH, 0.0, LH)
        boolean(h, box("head", 0.0, LH, -HEAD_HALF, HEAD_HALF, 0.0, HEAD_TOP), "UNION")
        boolean(h, cyl_x("bore", RP + GAP, -1, LH + 1))
        boolean(h, cyl_zs("chambers", [(XP[i], self.hy[i], R_CH, RP, Z_CEIL) for i in range(NPIN)]))
        boolean(h, box("half", -2, LH + 2, -6, 0.0, -4, 6))
        if bevels:
            bevel(h, 0.016, 2)
        chambers = [(XP[i], self.hy[i]) for i in range(NPIN)]

        def classify(c, n):
            cut = (np.abs(c[:, 1]) < 1e-3) & (np.abs(n[:, 1]) > 0.98)
            endf = np.abs(n[:, 0]) > 0.98
            r = np.hypot(c[:, 1], c[:, 2])
            inner = r < RP + GAP + 0.03
            for xi, yi in chambers:
                inner |= (np.hypot(c[:, 0] - xi, c[:, 1] - yi) < R_CH + 0.02) & (c[:, 2] > RP) & (c[:, 2] < Z_CEIL + 0.02)
            return (inner & ~cut & ~endf)
        assign_mats(h, [self.m_housing, self.m_inner], classify)
        smooth_by_angle(h, 35)
        self.housing = h

    def _build_plug(self, bevels):
        p = cyl_x("plug", RP, PLUG_X0, PLUG_X1)
        boolean(p, cyl_x("flange", RP + 0.1, PLUG_X0, PLUG_X0 + 0.14), "UNION")
        boolean(p, box("slot", PLUG_X0 - 1, PLUG_X1 + 1, -SLOT_W / 2, SLOT_W / 2, SLOT_BOT, SLOT_TOP))
        boolean(p, cyl_zs("pch", [(XP[i], 0.0, R_CH, -0.01, RP + 0.2) for i in range(NPIN)]))
        boolean(p, box("half", -2, LH + 2, -6, 0.0, -4, 6))
        if bevels:
            bevel(p, 0.014, 2)

        def classify(c, n):
            cut = (np.abs(c[:, 1]) < 1e-3) & (np.abs(n[:, 1]) > 0.98)
            endf = np.abs(n[:, 0]) > 0.98
            slot = (np.abs(c[:, 1]) <= SLOT_W / 2 + 0.01) & (c[:, 2] > SLOT_BOT - 0.01) & (c[:, 2] < SLOT_TOP + 0.01)
            for xi in XP:
                slot |= (np.hypot(c[:, 0] - xi, c[:, 1]) < R_CH + 0.02) & (c[:, 2] > -0.03) & (c[:, 2] < RP + 0.02)
            return slot & ~cut & ~(endf & (c[:, 2] > SLOT_TOP + 0.01))
        assign_mats(p, [self.m_plug, self.m_inner], classify)
        smooth_by_angle(p, 35)
        self.plug = p

    def _build_shear(self):
        self.m_shear = Mat("shear", T["muted"], rough=1.0, spec=0.0, alt=T["refrigerant"], emit_color=T["refrigerant"])
        self.m_halo = Mat("halo", T["refrigerant"], rough=1.0, spec=0.0, emit_color=T["refrigerant"], alpha=0.0)
        self.m_shear.set(mix=0.0)
        z0, z1 = RP - 0.016, RP + GAP + 0.016
        s = box("shear_line", 0.0, LH, -0.012, 0.004, z0, z1)
        s.data.materials.append(self.m_shear.m)
        self.shear_ob = s
        hb = box("shear_halo", 0.0, LH, -0.02, -0.014, RP - 0.08, RP + GAP + 0.08)
        hb.data.materials.append(self.m_halo.m)
        hb.visible_shadow = False
        self.halo_ob = hb

    # ---- pins
    def _build_stacks(self):
        mk = mixhex(T["refrigerant"], T["chalk"], 0.0)
        mdr = mixhex(T["refrigerant"], T["refrigerant_soft"], 0.42)
        mwf = mixhex(T["refrigerant"], T["chalk"], 0.5)
        self.m_spring = flat_mat("spring", mixhex(T["muted"], T["grid"], 0.25))
        self.stacks = []
        keyA = self.design
        for i in range(NPIN):
            zb = float(self._contact(i, keyA, XS_IN))
            L = RP - zb
            W = self.master.get(i, 0) * STEP
            st = dict(i=i, L=L, W=W, spool=(i in self.spool))
            st["m_kp"] = Mat("kp%d" % i, mk, alt=T["muted"], emit_color=T["refrigerant"])
            st["m_dr"] = Mat("dr%d" % i, mdr, alt=T["muted"], emit_color=T["refrigerant"])
            V, F = revolve(keypin_segments(L)[0])
            st["kp"] = make_obj("kp%d" % i, V, F, [st["m_kp"].m], smooth=True)
            V, F = revolve(spool_segments(D_DRIVER) if st["spool"] else driver_segments(D_DRIVER))
            st["dr"] = make_obj("dr%d" % i, V, F, [st["m_dr"].m], smooth=True)
            if W > 0:
                st["m_wf"] = Mat("wf%d" % i, mwf, alt=T["muted"], emit_color=T["refrigerant"])
                V, F = revolve(driver_segments(W))
                st["wf"] = make_obj("wf%d" % i, V, F, [st["m_wf"].m], smooth=True)
            npt = SPRING_TURNS * 14 + 1
            V = np.zeros((npt * 6, 3))
            sp = make_obj("sp%d" % i, V, tube_faces(npt, 6), [self.m_spring], smooth=True)
            st["sp"], st["npt"] = sp, npt
            st["mix"], st["emit"] = 0.0, 0.0
            self.stacks.append(st)

    def style_stack(self, i, mix=0.0, emit=0.0):
        self.stacks[i]["mix"], self.stacks[i]["emit"] = mix, emit

    def shear(self, glow):
        g = float(np.clip(glow, 0, 1.5))
        self.m_shear.set(mix=min(g * 3, 1.0), emit=2.2 * g)
        self.m_halo.set(alpha=0.38 * min(g, 1.0), emit=1.2 * g)

    # ---- keys
    def add_key(self, name, bitting, style="square"):
        k = Key(name, bitting, style, self.m_key)
        self.keys[name] = k
        return k

    def set_bitting(self, bitting, key="A"):
        self.keys[key].bitting = list(bitting)
        self.keys[key].rebuild()

    def key_insert(self, p, key="A"):
        self.keys[key].p = float(p)

    def plug_turn(self, deg):
        self.plug_angle = float(deg)

    # ---- kinematics
    def _contact(self, i, bitting, xs):
        """lowest z of key pin i resting on a key (bitting, shoulder x xs); Z_REST if none."""
        dx = np.linspace(-R_PIN, R_PIN, 41)
        h = key_height(bitting, XP[i] + dx - xs)
        tip = np.interp(np.abs(dx), TIP_R, TIP_Z)
        return max(Z_REST, float(np.max(h - tip)))

    def stack_state(self, i):
        """-> dict of bottoms/tops of every piece of stack i for the current key position."""
        st = self.stacks[i]
        act = None
        for k in self.keys.values():
            if k.show and k.p > 1e-4 and (act is None or k.p > act.p):
                act = k
        zb = self._contact(i, act.bitting, act.xs()) if act else Z_REST
        e = 0.003
        kp0, kp1 = zb, zb + st["L"]
        w0 = kp1 + e
        w1 = w0 + st["W"] if st["W"] > 0 else w0
        d0 = w1 + (e if st["W"] > 0 else e)
        d1 = d0 + D_DRIVER
        return dict(kp0=kp0, kp1=kp1, w0=w0, w1=w1, d0=d0, d1=d1)

    def blocked_stacks(self, tol=0.012):
        """stacks whose split (a piece boundary) does not sit on the shear line: those block the plug.
        a stack is free when some boundary lies at RP (+-tol): the piece above is wholly in the housing
        and the piece below wholly in the plug."""
        out = []
        for i, st in enumerate(self.stacks):
            s = self.stack_state(i)
            bounds = [s["kp1"]] + ([s["w1"]] if st["W"] > 0 else [])
            if not any(abs(b - RP) < tol + 0.004 for b in bounds):
                out.append(i)
        return out

    def apply(self):
        th = math.radians(self.plug_angle)
        Rx = Matrix.Rotation(th, 4, "X")
        self.plug.matrix_world = Rx
        for k in self.keys.values():
            k.ob.hide_render = not k.show
            k.ob.matrix_world = Rx @ Matrix.Translation((k.xs(), 0, 0))
        for i, st in enumerate(self.stacks):
            s = self.stack_state(i)
            x = XP[i]
            st["kp"].matrix_world = Rx @ Matrix.Translation((x, 0, s["kp0"]))
            if "wf" in st:
                below = s["w1"] <= RP + 0.012
                M = Matrix.Translation((x, 0, s["w0"]))
                st["wf"].matrix_world = (Rx @ M) if below else M
            M = Matrix.Translation((x + 0, self.hy[i], s["d0"]))
            if st["spool"] and abs(self.spool_tilt) > 1e-6:
                piv = Vector((x, self.hy[i], s["d1"] - 0.07))
                M = Matrix.Translation(piv) @ Matrix.Rotation(math.radians(self.spool_tilt), 4, "X") @ \
                    Matrix.Translation(-piv) @ M
            st["dr"].matrix_world = M
            # spring: helix from driver top to the ceiling, same turns whatever the compression
            z0, z1 = s["d1"] + 0.004, Z_CEIL - 0.012
            z1 = max(z1, z0 + SPRING_MIN)
            n = st["npt"]
            sv = np.linspace(0, 1, n)
            a = 2 * np.pi * SPRING_TURNS * sv
            P = np.stack([x + SPRING_R * np.cos(a), self.hy[i] + SPRING_R * np.sin(a), z0 + (z1 - z0) * sv], -1)
            st["sp"].data.vertices.foreach_set("co", tube_along(P, SPRING_WIRE, 6).astype(np.float32).ravel())
            st["sp"].data.update()
            for mname in ("m_kp", "m_dr", "m_wf"):
                if mname in st:
                    st[mname].set(mix=st["mix"], emit=st["emit"])


# ------------------------------------------------------------------ tolerance slice (top view schematic)
class ToleranceSlice:
    """Conceptual top view of the housing layer (chalk slab, five holes) over the plug layer
    (slab, five holes) with the key pins between them. The holes are NOT on one line (exaggerated).
    slide(d) moves the plug under turning force; the pin whose housing hole is least off-line jams
    first. Axes: X along the lock, plug slides along +Y, camera looks down."""

    HOLE = 0.25
    SLACK = HOLE - R_PIN

    def __init__(self, offsets=(0.065, 0.11, 0.015, 0.14, 0.09)):
        self.hy = list(offsets)
        self.m_h = Mat("t_house", T["chalk"], alpha=0.14).m
        self.m_p = flat_mat("t_plug", mixhex(T["muted"], T["panel"], 0.45))
        self.m_in = flat_mat("t_in", T["panel"], rough=1.0, spec=0.0)
        zh = (0.0, 0.14)       # housing slab z range
        zp = (-0.30, -0.14)    # plug slab z range
        hs = box("t_hslab", -0.15, LH - 0.1, -0.95, 0.95, *zh)
        boolean(hs, cyl_zs("t_hh", [(XP[i], self.hy[i], self.HOLE, zh[0] - 0.1, zh[1] + 0.1) for i in range(NPIN)], 64))
        assign_mats(hs, [self.m_h], lambda c, n: np.zeros(len(c)))
        smooth_by_angle(hs, 35)
        ps = box("t_pslab", -0.15, LH - 0.1, -0.62, 0.62, *zp)
        boolean(ps, cyl_zs("t_ph", [(XP[i], 0.0, self.HOLE, zp[0] - 0.1, zp[1] + 0.1) for i in range(NPIN)], 64))
        assign_mats(ps, [self.m_p], lambda c, n: np.zeros(len(c)))
        smooth_by_angle(ps, 35)
        self.plug = ps
        self.floor = box("t_floor", -0.15, LH - 0.1, -0.62, 0.62, -0.36, -0.33)
        self.floor.data.materials.append(self.m_in)
        # outlines: chalk rings on the housing holes (fixed), muted rings on the plug holes (slide with the plug)
        self.m_ring_h = Mat("t_rh", T["chalk"], emit_color=T["chalk"]); self.m_ring_h.set(emit=0.5)
        self.m_ring_p = Mat("t_rp", T["muted"], emit_color=T["muted"]); self.m_ring_p.set(emit=0.5)
        a = np.linspace(0, 2 * np.pi, 65)
        self.rings_p = []
        for i in range(NPIN):
            for (cy, z, mm, lst) in ((self.hy[i], zh[1] + 0.004, self.m_ring_h, None), (0.0, zp[1] + 0.004, self.m_ring_p, self.rings_p)):
                P = np.stack([XP[i] + self.HOLE * np.cos(a), cy + self.HOLE * np.sin(a), np.full(65, z)], -1)
                ob = make_obj("ring", tube_along(P, 0.011, 6), tube_faces(65, 6), [mm.m], smooth=True)
                ob.visible_shadow = False
                if lst is not None:
                    lst.append(ob)
        self.pins = []
        for i in range(NPIN):
            m = Mat("tp%d" % i, T["refrigerant"], alt=T["muted"], emit_color=T["refrigerant"])
            V, F = revolve(driver_segments(0.50))
            ob = make_obj("tp%d" % i, V, F, [m.m], smooth=True)
            self.pins.append((ob, m))
        self.zpin = -0.28
        self.d = 0.0
        self.states = [(1.0, 0.0)] * NPIN    # (mix to muted, emit)

    def jam_offsets(self):
        return [self.hy[i] + 2 * self.SLACK for i in range(NPIN)]

    def apply(self):
        d = min(self.d, min(self.jam_offsets()))
        self.plug.matrix_world = Matrix.Translation((0, d, 0))
        for ob in self.rings_p:
            ob.matrix_world = Matrix.Translation((0, d, 0))
        for i, (ob, m) in enumerate(self.pins):
            ypin = float(np.clip(d, self.hy[i] - self.SLACK, self.hy[i] + self.SLACK))
            ob.matrix_world = Matrix.Translation((XP[i], ypin, self.zpin))
            m.set(mix=self.states[i][0], emit=self.states[i][1])


# ------------------------------------------------------------------ camera presets
def cam_side(t=0.0, target=(0.8, 0.0, 0.32), width=7.4, lens=100.0, az=0.0, el=2.0):
    """side cutaway (main): long lens, almost orthographic. width = scene units across the frame."""
    fov_w = 2 * math.atan(18.0 / lens)
    dist = width / (2 * math.tan(fov_w / 2))
    return dict(target=target, dist=dist, el=el, az=az, lens=lens)


def cam_hero(target=(1.0, 0.0, 0.45), dist=14.0, el=15.0, az=-30.0, lens=60.0):
    """3/4 hero: front-left of the key side, a little above."""
    return dict(target=target, dist=dist, el=el, az=az, lens=lens)


def set_cam(cam, c):
    place_camera(cam, c["target"], c["dist"], c["el"], c["az"], c["lens"])


def lerp_cam(a, b, u):
    return dict(target=tuple(lerp(np.array(a["target"]), np.array(b["target"]), u)),
                dist=lerp(a["dist"], b["dist"], u), el=lerp(a["el"], b["el"], u),
                az=lerp(a["az"], b["az"], u), lens=lerp(a["lens"], b["lens"], u))


# ------------------------------------------------------------------ render loop
def render_loop(args, update, label):
    sc = bpy.context.scene
    os.makedirs(args.out, exist_ok=True)
    t_all = time.time()
    for f in args.frame_list:
        update(args.vf(f), f)
        sc.frame_current = f
        sc.render.filepath = os.path.join(args.out, "f_%04d.png" % f)
        t0 = time.time()
        bpy.ops.render.render(write_still=True)
        print("%s frame %d (vf=%.1f) %.1fs" % (label, f, args.vf(f), time.time() - t0), flush=True)
    print("%s done: %d frames in %.1fs" % (label, len(args.frame_list), time.time() - t_all), flush=True)
