"""Shared helpers for the P3 (how trees lift water) hero shots H1-H7.

Same pipeline as P2's heroes (episodes/p2-ear/scenes/blender/ear_common.py, copied
and extended): numpy-built meshes with fixed topology, a per-frame update() that
moves objects / rewrites vertices / sets material Value nodes, then a still render.
Standard view transform (never AgX); colours come from style/tokens.json.

Colour meanings (board/scenes_src.py): chalk = structure AND water (translucent
chalk, never blue); refrigerant violet = the pull / tension; muted = air-filled,
failed; heat orange is not used in 3D. No arrows.

Args:
    python h1_redwood.py -- <out_dir> [first last] [--frames N] [--res PCT]
        [--samples S] [--mode NAME] [--test 1,120,300]
"""
import json
import math
import os
import sys
import time

import numpy as np
import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
T = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]
FPS = 30


# ------------------------------------------------------------------ args
class Args:
    def __init__(self, default_frames, default_mode):
        a = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []

        def opt(name, default, cast=int):
            if name in a:
                i = a.index(name)
                v = a[i + 1]
                del a[i:i + 2]
                return cast(v)
            return default

        self.frames = opt("--frames", default_frames)
        self.res = opt("--res", 100)
        self.samples = opt("--samples", 8)
        self.mode = opt("--mode", default_mode, str)
        test = opt("--test", None, str)
        self.out = a[0] if a else "/tmp/hero_out"
        first, last = (int(a[1]), int(a[2])) if len(a) >= 3 else (1, self.frames)
        if test:
            self.frame_list = [int(x) for x in test.split(",")]
        else:
            self.frame_list = list(range(first, last + 1))


# ------------------------------------------------------------------ colour
def rgb(hexstr, a=1.0):
    h = hexstr.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


# ------------------------------------------------------------------ easing
def clamp01(x):
    return np.clip(x, 0.0, 1.0)


def smoothstep(e0, e1, x):
    t = clamp01((np.asarray(x, dtype=float) - e0) / (e1 - e0))
    return t * t * (3 - 2 * t)


def ease(x):
    """easeInOutCubic on [0,1] (scalar or array)."""
    x = clamp01(np.asarray(x, dtype=float))
    return np.where(x < 0.5, 4 * x ** 3, 1 - (-2 * x + 2) ** 3 / 2)


def seg(t, t0, t1):
    """eased 0..1 progress of t through [t0, t1]."""
    return float(ease((t - t0) / (t1 - t0)))


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
    # OIDN HIGH costs ~3x FAST on 2 cores with no visible gain at this res
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
    # Standard, never AgX/Filmic: tokens must come out as their hex values
    sc.display_settings.display_device = "sRGB"
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    sc.view_settings.exposure = 0.0
    sc.view_settings.gamma = 1.0

    world = bpy.data.worlds.new("w")
    sc.world = world
    world.use_nodes = True
    bgn = world.node_tree.nodes["Background"]
    bgn.inputs["Color"].default_value = rgb(T["bg"])
    bgn.inputs["Strength"].default_value = 1.0
    return sc


def sun(direction_deg, strength, color=(1, 1, 1), angle_deg=12):
    """direction_deg = (elevation, azimuth): where the light comes FROM."""
    el, az = (math.radians(d) for d in direction_deg)
    ld = bpy.data.lights.new("sun", "SUN")
    ld.energy = strength
    ld.color = color
    ld.angle = math.radians(angle_deg)
    ob = bpy.data.objects.new("sun", ld)
    bpy.context.scene.collection.objects.link(ob)
    # sun shines along -Z of the object; point -Z from the source direction to origin
    src = np.array([math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el)])
    look_rot(ob, -src)
    return ob


def look_rot(ob, forward):
    """rotate ob so its -Z axis points along forward (Y up-ish)."""
    from mathutils import Vector
    ob.rotation_euler = Vector(tuple(forward)).to_track_quat("-Z", "Y").to_euler()


def camera(lens=50):
    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    ob = bpy.data.objects.new("cam", cd)
    bpy.context.scene.collection.objects.link(ob)
    bpy.context.scene.camera = ob
    return ob


def place_camera(cam, target, dist, el_deg, az_deg, roll=0.0):
    """camera on a sphere around target; az 0 = on -Y looking +Y."""
    el, az = math.radians(el_deg), math.radians(az_deg)
    off = np.array([math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)]) * dist
    cam.location = tuple(np.asarray(target) + off)
    look_rot(cam, -off)


# ------------------------------------------------------------------ materials
def _bsdf(m):
    return m.node_tree.nodes["Principled BSDF"]


def _sock(nt, v):
    """float -> Value node output; socket passes through."""
    if isinstance(v, (int, float)):
        n = nt.nodes.new("ShaderNodeValue")
        n.outputs[0].default_value = float(v)
        return n.outputs[0]
    return v


def math_node(nt, op, a, b=None, clamp=False):
    n = nt.nodes.new("ShaderNodeMath")
    n.operation = op
    n.use_clamp = clamp
    for i, v in enumerate((a, b)):
        if v is None:
            continue
        if isinstance(v, (int, float)):
            n.inputs[i].default_value = float(v)
        else:
            nt.links.new(v, n.inputs[i])
    return n.outputs[0]


def mix_rgb(nt, fac_src, a, b):
    n = nt.nodes.new("ShaderNodeMix")
    n.data_type = "RGBA"
    ins = {s.identifier: s for s in n.inputs}
    if isinstance(fac_src, float):
        ins["Factor_Float"].default_value = fac_src
    else:
        nt.links.new(fac_src, ins["Factor_Float"])
    for key, v in (("A_Color", a), ("B_Color", b)):
        if isinstance(v, tuple):
            ins[key].default_value = v
        else:
            nt.links.new(v, ins[key])
    return [s for s in n.outputs if s.identifier == "Result_Color"][0]


def attr(nt, name):
    an = nt.nodes.new("ShaderNodeAttribute")
    an.attribute_name = name
    return an.outputs["Fac"]


def satin(name, color, rough=0.85, spec=0.2):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = _bsdf(m)
    b.inputs["Base Color"].default_value = rgb(color)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Specular IOR Level"].default_value = spec
    return m


class Mat:
    """Matte token material with live controls (Value nodes, set per frame):
        h.alpha  opacity 0..1 (translucent chalk water = ~0.4)
        h.mix    0 = base colour .. 1 = alt colour (e.g. chalk -> muted)
        h.emit   emission strength of emit colour
        h.reveal with reveal_attr: emission and alpha only where attr < reveal
        h.phase  with pulse: travelling band phase
    Optional per-vertex float attributes: glow_attr multiplies emission,
    mix_attr multiplies the colour mix, reveal_attr gates emission/alpha."""

    def __init__(self, name, color, rough=0.85, spec=0.2, alpha=1.0, alt=None, mix=0.0,
                 emit_color=None, emit=0.0, glow_attr=None, mix_attr=None, reveal_attr=None,
                 pulse=None, rim=None, alpha_attr=None):
        m = satin(name, color, rough, spec)
        nt = m.node_tree
        b = _bsdf(m)
        self.m = m
        V = {}

        def val(k, v):
            n = nt.nodes.new("ShaderNodeValue")
            n.outputs[0].default_value = v
            V[k] = n.outputs[0]
            return n.outputs[0]

        col = rgb(color)
        if alt is not None:
            f = val("mix", mix)
            if mix_attr:
                f = math_node(nt, "MULTIPLY", f, attr(nt, mix_attr))
            col = mix_rgb(nt, f, col, rgb(alt))
            nt.links.new(col, b.inputs["Base Color"])
        gate = None
        if reveal_attr:
            r = val("reveal", 0.0)
            d = math_node(nt, "SUBTRACT", r, attr(nt, reveal_attr))
            gate = math_node(nt, "MULTIPLY", d, 25.0, clamp=True)
        a = val("alpha", alpha)
        if alpha_attr:
            a = math_node(nt, "MULTIPLY", a, attr(nt, alpha_attr))
        if rim is not None:
            # rim-weighted opacity: alpha in the middle, rim at grazing angles
            lw = nt.nodes.new("ShaderNodeLayerWeight")
            lw.inputs["Blend"].default_value = 0.35
            p3 = math_node(nt, "POWER", lw.outputs["Facing"], 2.5)
            a = math_node(nt, "ADD", a, math_node(nt, "MULTIPLY", p3, rim), clamp=True)
        if gate is not None:
            a = math_node(nt, "MULTIPLY", a, gate)
        nt.links.new(a, b.inputs["Alpha"])
        if emit_color is not None:
            b.inputs["Emission Color"].default_value = rgb(emit_color)
            e = val("emit", emit)
            if glow_attr:
                e = math_node(nt, "MULTIPLY", e, attr(nt, glow_attr))
            if gate is not None:
                e = math_node(nt, "MULTIPLY", e, gate)
            if pulse is not None:
                # pulse = (coord_attr, wavenumber, depth): 1-depth .. 1 bands moving with phase
                pa, k, depth = pulse
                ph = val("phase", 0.0)
                s = math_node(nt, "SINE", math_node(nt, "SUBTRACT", math_node(nt, "MULTIPLY", attr(nt, pa), k), ph))
                p = math_node(nt, "ADD", 1.0 - depth / 2, math_node(nt, "MULTIPLY", s, depth / 2))
                e = math_node(nt, "MULTIPLY", e, p)
            nt.links.new(e, b.inputs["Emission Strength"])
        self.h = V

    def set(self, **kw):
        for k, v in kw.items():
            self.h[k].default_value = float(v)


# ------------------------------------------------------------------ meshes
class DynMesh:
    """Mesh with fixed topology whose vertices/attributes are rewritten per frame."""

    def __init__(self, name, verts, faces, material, smooth=True, attrs=()):
        me = bpy.data.meshes.new(name)
        verts = np.asarray(verts, dtype=np.float32)
        faces = np.asarray(faces)
        me.vertices.add(len(verts))
        me.vertices.foreach_set("co", verts.ravel())
        # quads whose last two indices repeat are triangles (validate() would delete them)
        tri = faces[:, -1] == faces[:, -2] if faces.shape[1] == 4 else np.zeros(len(faces), bool)
        sizes = np.where(tri, 3, faces.shape[1]).astype(np.int32)
        flat = np.concatenate([faces[~tri].ravel(), faces[tri][:, :3].ravel()]).astype(np.int32)
        sizes = np.concatenate([sizes[~tri], sizes[tri]])
        nf = len(faces)
        me.loops.add(int(sizes.sum()))
        me.loops.foreach_set("vertex_index", flat)
        me.polygons.add(nf)
        me.polygons.foreach_set("loop_start", np.concatenate([[0], np.cumsum(sizes)[:-1]]).astype(np.int32))
        me.update(calc_edges=True)
        me.validate()
        if smooth:
            me.shade_smooth()
        me.materials.append(material)
        for a in attrs:
            me.attributes.new(a, "FLOAT", "POINT")
        self.me = me
        self.ob = bpy.data.objects.new(name, me)
        bpy.context.scene.collection.objects.link(self.ob)
        self.nv = len(verts)

    def set_verts(self, V):
        self.me.vertices.foreach_set("co", np.asarray(V, dtype=np.float32).ravel())
        self.me.update()

    def set_attr(self, name, vals):
        self.me.attributes[name].data.foreach_set("value", np.asarray(vals, dtype=np.float32))


def tri_quads(rows, cols, closed_cols=False):
    """quad faces for a rows x cols vertex grid (row-major)."""
    r = np.arange(rows - 1)[:, None]
    c = np.arange(cols if closed_cols else cols - 1)[None, :]
    c1 = (c + 1) % cols
    a = r * cols + c
    b = r * cols + c1
    d = (r + 1) * cols + c1
    e = (r + 1) * cols + c
    return np.stack([a, b, d, e], -1).reshape(-1, 4)


def lathe_template(profile, sides):
    """profile: [(radius, z)] bottom to top, radius>0 everywhere; ends closed
    with pole vertices at z of first/last entry. Returns (verts (V,3), faces (F,4))
    with triangles stored as quads with a repeated vertex."""
    prof = np.asarray(profile, dtype=float)
    ang = np.linspace(0, 2 * np.pi, sides, endpoint=False)
    rings = []
    for r, z in prof:
        rings.append(np.stack([r * np.cos(ang), r * np.sin(ang), np.full(sides, z)], -1))
    V = np.concatenate(rings + [np.array([[0, 0, prof[0, 1]]]), np.array([[0, 0, prof[-1, 1]]])])
    F = list(tri_quads(len(prof), sides, closed_cols=True))
    bot = len(prof) * sides
    top = bot + 1
    for j in range(sides):
        j1 = (j + 1) % sides
        F.append([bot, j1, j, j])          # bottom cap (degenerate quad = tri)
        o = (len(prof) - 1) * sides
        F.append([o + j, o + j1, top, top])
    return V, np.asarray(F)


def _frames_from_axis(D):
    D = D / np.linalg.norm(D, axis=1, keepdims=True)
    ref = np.where(np.abs(D[:, :1]) > 0.9, np.array([[0.0, 1.0, 0.0]]), np.array([[1.0, 0.0, 0.0]]))
    e1 = np.cross(D, ref)
    e1 /= np.linalg.norm(e1, axis=1, keepdims=True)
    e2 = np.cross(D, e1)
    return D, e1, e2


def instance_verts(tv, P, D, R, L):
    """place template verts tv (V,3, axis +Z, unit radius/length) at bases P (N,3)
    along axes D (N,3), radius scale R (N,), length scale L (N,). -> (N*V,3)"""
    D, e1, e2 = _frames_from_axis(np.asarray(D, dtype=float))
    x = tv[None, :, 0:1] * R[:, None, None]
    y = tv[None, :, 1:2] * R[:, None, None]
    z = tv[None, :, 2:3] * L[:, None, None]
    V = P[:, None, :] + x * e1[:, None, :] + y * e2[:, None, :] + z * D[:, None, :]
    return V.reshape(-1, 3)


def instance_faces(tf, nv_t, n):
    off = (np.arange(n) * nv_t)[:, None, None]
    return (tf[None] + off).reshape(-1, tf.shape[1])


# ------------------------------------------------------------------ render loop
def render_loop(args, update, label):
    sc = bpy.context.scene
    os.makedirs(args.out, exist_ok=True)
    t_all = time.time()
    for f in args.frame_list:
        t = (f - 1) / FPS
        update(t, f)
        sc.frame_current = f
        sc.render.filepath = os.path.join(args.out, "f_%04d.png" % f)
        t0 = time.time()
        bpy.ops.render.render(write_still=True)
        print("%s frame %d (t=%.2f) %.1fs" % (label, f, t, time.time() - t0), flush=True)
    print("%s done: %d frames in %.1fs" % (label, len(args.frame_list), time.time() - t_all), flush=True)


def static(name, V, F, material, smooth=False, attrs=None):
    """one-shot mesh; attrs = {name: per-vertex float array}."""
    dm = DynMesh(name, V, F, material, smooth=smooth, attrs=tuple((attrs or {}).keys()))
    for k, v in (attrs or {}).items():
        dm.set_attr(k, v)
    return dm


def box_mesh(boxes):
    """boxes (N,6): centre xyz, size xyz -> verts, quads."""
    c = np.array([[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], dtype=float) * 0.5
    Fb = np.array([[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]])
    B = np.asarray(boxes, dtype=float)
    V = B[:, None, :3] + c[None] * B[:, None, 3:]
    return V.reshape(-1, 3), (Fb[None] + 8 * np.arange(len(B))[:, None, None]).reshape(-1, 4)


_CYL = {}


def bars(P0, P1, R, sides=12):
    """cylinders from P0 (N,3) to P1 (N,3), radius R (N,) -> verts, faces."""
    if sides not in _CYL:
        _CYL[sides] = lathe_template([(1.0, 0.0), (1.0, 1.0)], sides)
    tv, tf = _CYL[sides]
    P0 = np.asarray(P0, float)
    D = np.asarray(P1, float) - P0
    L = np.linalg.norm(D, axis=1)
    R = np.broadcast_to(np.asarray(R, float), L.shape).copy()
    return instance_verts(tv, P0, D, R, L), instance_faces(tf, len(tv), len(P0))


def uv_sphere(rings=8, sides=12):
    prof = [(math.sin(math.pi * k / rings) + 1e-4, -math.cos(math.pi * k / rings)) for k in range(1, rings)]
    return lathe_template(prof, sides)       # unit sphere, poles at z=-1/+1


def empty(name):
    ob = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(ob)
    return ob


# ------------------------------------------------------------------ redwood, building, 10 m line (metres)
TREE_H = 116.0      # Hyperion, claim 1.1 (116.07 m in 2019)
BUILDING_H = 100.0  # 30 storeys at ~3.3 m, claim 1.5
LINE_Z = 10.0       # suction limit at sea level, claim 2.1


def trunk_radius(z):
    z = np.asarray(z, float)
    return 2.3 * np.clip(1 - z / 124.0, 0, 1) ** 1.15 + 0.22 + 2.0 * np.exp(-z / 2.2)


def redwood_parts(seed=3):
    """stylised coast redwood: a long straight clear trunk (root flare, slow taper) for
    the lower ~55%, then a narrow, irregular, columnar crown of short branches carrying
    uneven, ragged foliage clumps, with a modestly tapered, slightly rounded top.
    Returns ((Vt,Ft),(Vc,Fc)): trunk, crown (branches + clumps)."""
    zs = np.concatenate([np.linspace(0, 6, 7), np.linspace(8, TREE_H - 0.5, 40)])
    prof = [(float(trunk_radius(z)), float(z)) for z in zs]
    Vt, Ft = lathe_template(prof, 14)
    rng = np.random.default_rng(seed)
    Z0 = 63.0                                         # crown base: ~54% clear trunk

    def envelope(z):
        """crown radius: columnar, a little ragged, tapering over the top ~18 m."""
        u = np.clip((z - Z0) / (TREE_H - Z0), 0, 1)
        r = 7.4 + 1.0 * np.sin(z * 0.37) - 1.2 * smoothstep(0.0, 0.12, 0.12 - u) * 1.0
        top = np.clip((TREE_H - z) / 27.0, 0, 1)
        return r * (0.18 + 0.82 * top ** 0.8)

    BV, BF = uv_sphere(5, 9)
    Vs, Fs, off = [], [], 0
    bp0, bp1, br = [], [], []
    n = 0
    z = Z0
    while z < TREE_H - 1.5:
        # clumps come in uneven whorl-ish groups with gaps between them
        group = rng.integers(2, 5)
        for _ in range(group):
            zc = z + rng.uniform(-0.8, 0.8)
            env = float(envelope(zc))
            ang = rng.uniform(0, 2 * np.pi)
            reach = env * rng.uniform(0.4, 1.0)
            size = rng.uniform(2.3, 3.9) * (0.45 + 0.55 * min(1.0, env / 7.0))
            c = np.array([reach * math.cos(ang), reach * math.sin(ang), zc - 0.15 * reach + rng.uniform(0.0, 1.0)])
            v = BV.copy()
            v *= np.array([size * rng.uniform(1.3, 1.9), size * rng.uniform(0.8, 1.2), size * rng.uniform(0.5, 0.75)])
            v += rng.normal(0, 0.16 * size, v.shape)       # ragged facets
            ca, sa = math.cos(ang), math.sin(ang)
            v = v @ np.array([[ca, -sa, 0], [sa, ca, 0], [0, 0, 1]]).T
            Vs.append(v + c)
            Fs.append(BF + off)
            off += len(v)
            r0 = float(trunk_radius(zc)) * 0.6
            bp0.append([r0 * math.cos(ang), r0 * math.sin(ang), zc - 0.6])
            bp1.append(c - np.array([0, 0, 0.3]))
            br.append(0.32 if zc < 95 else 0.22)
            n += 1
        z += rng.uniform(1.0, 2.6) * (1.5 if z < Z0 + 8 else 1.0)
    # leader: a few small clumps hugging the top of the trunk
    for zc in (TREE_H - 3.2, TREE_H - 1.4):
        v = BV * np.array([1.3, 1.2, 1.6]) * (1.0 if zc < TREE_H - 2 else 0.7)
        v = v + rng.normal(0, 0.15, v.shape)
        Vs.append(v + np.array([0.2, 0, zc])); Fs.append(BF + off); off += len(v)
    bv, bf = bars(np.array(bp0), np.array(bp1), np.array(br), 6)
    Vs.append(bv); Fs.append(bf + off)
    return (Vt, Ft), (np.concatenate(Vs), np.concatenate(Fs))


def building_boxes(cx, cy, w=28.0, d=24.0, h=BUILDING_H, storeys=30):
    """(body, frame) box lists: a flat block plus chalk floor bands, corner posts, mullions."""
    body = [(cx, cy, h / 2, w, d, h)]
    fr = []
    t, p = 0.45, 0.35
    for k in range(storeys + 1):
        z = k * h / storeys
        tt = 0.9 if k in (0, storeys) else t
        fr += [(cx, cy - d / 2, z, w + 2 * p, 2 * p, tt), (cx, cy + d / 2, z, w + 2 * p, 2 * p, tt),
               (cx - w / 2, cy, z, 2 * p, d + 2 * p, tt), (cx + w / 2, cy, z, 2 * p, d + 2 * p, tt)]
    for sx in (-1, 1):
        for sy in (-1, 1):
            fr.append((cx + sx * w / 2, cy + sy * d / 2, h / 2, 0.9, 0.9, h))
    for k in (1, 2, 3):
        x = cx - w / 2 + k * w / 4
        fr.append((x, cy - d / 2, h / 2, 0.3, 0.5, h))
    for k in (1, 2):
        y = cy - d / 2 + k * d / 3
        fr.append((cx - w / 2, y, h / 2, 0.5, 0.3, h))
        fr.append((cx + w / 2, y, h / 2, 0.5, 0.3, h))
    return body, fr


def scenery_lights():
    sun((38, -130), 3.1)                                   # key from front-left
    sun((25, 70), 1.4, color=(0.92, 0.95, 1.0), angle_deg=6)   # cool rim from behind-right
    sun((70, -90), 0.35)                                   # top fill


def tube_along(P, r, sides=8):
    """tube mesh along polyline P (M,3), radius r (scalar or (M,)), open ends.
    Returns verts (M*sides,3), quads, per-vertex arclength fraction (0..1)."""
    P = np.asarray(P, float)
    M = len(P)
    r = np.broadcast_to(np.asarray(r, float), (M,))
    t = np.gradient(P, axis=0)
    t /= np.linalg.norm(t, axis=1, keepdims=True)
    ref = np.where(np.abs(t[:, 2:3]) > 0.9, np.array([[1.0, 0, 0]]), np.array([[0, 0, 1.0]]))
    n = np.cross(t, ref)
    n /= np.linalg.norm(n, axis=1, keepdims=True)
    b = np.cross(t, n)
    a = np.linspace(0, 2 * np.pi, sides, endpoint=False)
    V = P[:, None, :] + r[:, None, None] * (np.cos(a)[None, :, None] * n[:, None, :] + np.sin(a)[None, :, None] * b[:, None, :])
    s = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))])
    return V.reshape(-1, 3), tri_quads(M, sides, closed_cols=True), np.repeat(s / s[-1], sides)


def ground_disc(radius=420.0, fade0=0.45, rings=24, sides=64):
    """ground disc with a 'fade' attribute (1 inside, 0 at the rim) so no horizon line shows."""
    rr = np.linspace(0, radius, rings)
    a = np.linspace(0, 2 * np.pi, sides, endpoint=False)
    V = np.stack([rr[:, None] * np.cos(a)[None], rr[:, None] * np.sin(a)[None], np.zeros((rings, sides))], -1).reshape(-1, 3)
    fade = np.repeat(1 - smoothstep(fade0 * radius, radius, rr), sides)
    return V, tri_quads(rings, sides, closed_cols=True), fade


# ------------------------------------------------------------------ tracheid (H2, H5)
def tracheid_template(r, L, sides=14, rows=24, tip=6.0):
    """closed tube along +Z, radius r, length L, base rounded, top tapering to a
    point over tip*r (conifer tracheids are spindle-ended single cells, claim 9.1)."""
    zt = L - tip * r
    prof = [(r * 0.55, 0.0), (r * 0.9, 0.12 * r)]
    prof += [(r, z) for z in np.linspace(0.35 * r, zt, rows)]
    prof += [(r * (1 - u) ** 1.3 + 1e-3, zt + u * tip * r) for u in np.linspace(0.2, 0.97, 5)]
    return lathe_template(prof, sides)
