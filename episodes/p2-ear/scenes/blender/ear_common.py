"""Shared helpers for the P2 inner-ear hero shots (H1-H7).

Every hero script builds its geometry with numpy, then renders frame by frame in
its own loop: for each frame it recomputes vertex positions (and per-vertex
attributes) on meshes whose topology never changes, and renders a still. That
keeps uncoiling, travelling waves and per-cell damage exact and deterministic.

Args (same convention as P1 hero scripts and brun3.py):
    python h1_cochlea.py -- <out_dir> [first last] [--frames N] [--res PCT]
        [--samples S] [--mode NAME] [--test 1,120,300]
--test renders only the listed frames (key-pose check).
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


def satin(name, color, rough=0.6, spec=0.35, sheen=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = _bsdf(m)
    b.inputs["Base Color"].default_value = rgb(color)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Specular IOR Level"].default_value = spec
    if sheen:
        b.inputs["Sheen Weight"].default_value = sheen
        b.inputs["Sheen Tint"].default_value = (1, 1, 1, 1)
    return m


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


def attr_material(name, base, layers, rough=0.6, spec=0.35, sheen=0.0):
    """Base colour mixed toward other token colours by float vertex attributes.
    layers: [(attr_name, hex_target, max_mix)] applied in order."""
    m = satin(name, base, rough, spec, sheen)
    nt = m.node_tree
    col = rgb(base)
    out = None
    for attr, target, mx in layers:
        an = nt.nodes.new("ShaderNodeAttribute")
        an.attribute_name = attr
        mul = nt.nodes.new("ShaderNodeMath")
        mul.operation = "MULTIPLY"
        mul.inputs[1].default_value = mx
        nt.links.new(an.outputs["Fac"], mul.inputs[0])
        out = mix_rgb(nt, mul.outputs[0], out if out is not None else col, rgb(target))
    nt.links.new(out, _bsdf(m).inputs["Base Color"])
    return m


def ghost_material(name, color, rough=0.7):
    """Opaque satin that can fade to a rim-only ghost. Returns (mat, value_node);
    set value_node.outputs[0].default_value = opacity (1 opaque .. 0 ghost)."""
    m = satin(name, color, rough, 0.3)
    nt = m.node_tree
    outn = nt.nodes["Material Output"]
    b = _bsdf(m)
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    lw = nt.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.35
    val = nt.nodes.new("ShaderNodeValue")
    val.outputs[0].default_value = 1.0
    # opacity = op + (1-op) * 0.8 * facing^3 (rim stays visible as an outline)
    p2 = nt.nodes.new("ShaderNodeMath"); p2.operation = "POWER"; p2.inputs[1].default_value = 3.0
    nt.links.new(lw.outputs["Facing"], p2.inputs[0])
    rim = nt.nodes.new("ShaderNodeMath"); rim.operation = "MULTIPLY"; rim.inputs[1].default_value = 0.8
    nt.links.new(p2.outputs[0], rim.inputs[0])
    inv = nt.nodes.new("ShaderNodeMath"); inv.operation = "SUBTRACT"; inv.inputs[0].default_value = 1.0
    nt.links.new(val.outputs[0], inv.inputs[1])
    r2 = nt.nodes.new("ShaderNodeMath"); r2.operation = "MULTIPLY"
    nt.links.new(rim.outputs[0], r2.inputs[0]); nt.links.new(inv.outputs[0], r2.inputs[1])
    op = nt.nodes.new("ShaderNodeMath"); op.operation = "ADD"; op.use_clamp = True
    nt.links.new(val.outputs[0], op.inputs[0]); nt.links.new(r2.outputs[0], op.inputs[1])
    mx = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(op.outputs[0], mx.inputs[0])
    nt.links.new(tr.outputs[0], mx.inputs[1])
    nt.links.new(b.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], outn.inputs["Surface"])
    return m, val


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
