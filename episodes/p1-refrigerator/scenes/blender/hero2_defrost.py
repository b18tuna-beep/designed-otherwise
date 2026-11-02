"""FPI P1 scene S29, hero shot 2: behind the freezer's back panel. A frosted
evaporator coil (cold) with a defrost heater rod mounted just below it that
warms up to an orange glow; the camera slides along the coil.

    blender -b --factory-startup -P hero2_defrost.py -- <out_dir> [first last] [--frames N] [--res PCT]

Facts shown (research/factcheck.json): 5.3 heater mounted on or just below the
evaporator, often a calrod-type rod or a glass-tube radiant heater. Frost (5.1)
is cold, so it uses the cold palette.
"""
import json
import math
import os
import sys

import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
T = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]
ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def _opt(name, default):
    if name in ARGS:
        i = ARGS.index(name)
        v = ARGS[i + 1]
        del ARGS[i:i + 2]
        return int(v)
    return default


N_FRAMES = _opt("--frames", 300)
RES_PCT = _opt("--res", 100)
SAMPLES = _opt("--samples", 0)
OUT = ARGS[0] if ARGS else "/tmp/hero2"
FIRST, LAST = (int(ARGS[1]), int(ARGS[2])) if len(ARGS) >= 3 else (1, N_FRAMES)


def rgb(hexstr, a=1.0):
    h = hexstr.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


def mat(name, color, rough=0.5, emit=None, strength=0.0, metal=0.0, transmission=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = rgb(color)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if transmission:
        b.inputs["Transmission Weight"].default_value = transmission
    if emit:
        b.inputs["Emission Color"].default_value = rgb(emit)
        b.inputs["Emission Strength"].default_value = strength
    return m


def tube(name, pts, radius, material):
    crv = bpy.data.curves.new(name, "CURVE")
    crv.dimensions = "3D"
    crv.bevel_depth = radius
    crv.bevel_resolution = 6
    sp = crv.splines.new("POLY")
    sp.points.add(len(pts) - 1)
    for p, co in zip(sp.points, pts):
        p.co = (*co, 1)
    ob = bpy.data.objects.new(name, crv)
    bpy.context.scene.collection.objects.link(ob)
    ob.data.materials.append(material)
    return ob


bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = 16
sc.cycles.use_adaptive_sampling = True
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 4
sc.render.use_persistent_data = True
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
sc.render.resolution_percentage = RES_PCT
sc.render.fps = 30
sc.frame_start, sc.frame_end = FIRST, LAST
sc.render.image_settings.file_format = "PNG"
sc.render.filepath = os.path.join(OUT, "f_")
vt = [v.identifier for v in bpy.types.ColorManagedViewSettings.bl_rna.properties["view_transform"].enum_items]
sc.view_settings.view_transform = "Standard"  # keeps lime and orange saturated (AgX washed the lime lead to cream)

world = bpy.data.worlds.new("w")
sc.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = rgb(T["bg"])
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.3

# back wall of the freezer compartment (panel removed)
bpy.ops.mesh.primitive_plane_add(size=14, location=(1.5, 0.35, 0), rotation=(math.pi / 2, 0, 0))
bpy.context.object.data.materials.append(mat("liner", T["panel"], 0.7))

# evaporator: serpentine refrigerant tube through a stack of thin fins
tube_mat = mat("tube", T["cold_deep"], 0.35, metal=0.6)
frost_mat = mat("frost", T["chalk"], 0.95)
# chalk deposit with a thin cold-blue rim (fresnel-mixed emission), low specular so lights don't tint it
_fb = frost_mat.node_tree.nodes["Principled BSDF"]
_fb.inputs["Specular IOR Level"].default_value = 0.1
_fr = frost_mat.node_tree.nodes.new("ShaderNodeLayerWeight")
_fr.inputs["Blend"].default_value = 0.15
_fb.inputs["Emission Color"].default_value = rgb(T["cold"])
frost_mat.node_tree.links.new(_fr.outputs["Facing"], _fb.inputs["Emission Strength"])
rows = [0.15 + i * 0.16 for i in range(5)]
pts = []
for i, z in enumerate(rows):
    xs = (-0.9, 0.9) if i % 2 == 0 else (0.9, -0.9)
    pts += [(xs[0], 0.15, z), (xs[1], 0.15, z)]
tube("evaporator_tube", pts, 0.035, tube_mat)
for k in range(28):
    x = -0.85 + k * (1.7 / 27)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0.15, 0.47))
    fin = bpy.context.object
    fin.scale = (0.008, 0.16, 0.74)
    fin.data.materials.append(tube_mat)
# frost: a white crust on every fin and a thicker frost sleeve on the tube.
# Once the heater is hot, the crust melts back from the bottom up (it thins and shrinks).
MELT0, MELT1 = int(N_FRAMES * 0.25), int(N_FRAMES * 0.6)
crusts = []
for k in range(28):
    x = -0.85 + k * (1.7 / 27)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0.13, 0.47))
    crust = bpy.context.object
    crust.scale = (0.026, 0.19, 0.76)
    crust.modifiers.new("bevel", "BEVEL").width = 0.01
    crust.data.materials.append(frost_mat)
    crusts.append(crust)
sleeve = tube("frost_sleeve", pts, 0.06, frost_mat)
for ob in crusts:
    ob.keyframe_insert("scale", frame=MELT0)
    ob.keyframe_insert("location", frame=MELT0)
    ob.scale = (0.009, 0.165, 0.42)
    ob.location.z = 0.47 + (0.76 - 0.42) / 2
    ob.keyframe_insert("scale", frame=MELT1)
    ob.keyframe_insert("location", frame=MELT1)
sleeve.data.bevel_depth = 0.06
sleeve.data.keyframe_insert("bevel_depth", frame=MELT0)
sleeve.data.bevel_depth = 0.04
sleeve.data.keyframe_insert("bevel_depth", frame=MELT1)

# meltwater drops falling past the heater (chalk = water)
water = mat("water", T["chalk"], 0.1)
for k, (x, ph) in enumerate(((-0.6, 0.0), (-0.2, 0.33), (0.25, 0.66), (0.65, 0.15), (0.0, 0.5))):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.018, location=(x, 0.1, 0.1))
    drop = bpy.context.object
    drop.data.materials.append(water)
    period = 36
    start = MELT0 + int(ph * period)
    for f0 in range(start, N_FRAMES, period):
        drop.location.z = 0.12
        drop.keyframe_insert("location", frame=f0)
        drop.location.z = -0.5
        drop.keyframe_insert("location", frame=min(f0 + 24, N_FRAMES))

# defrost heater: calrod-type metal sheath rod, U-shaped, just below the coil
heater_mat = mat("heater", T["heat_soft"], 0.3, emit=T["heat"], strength=0.0, metal=0.4)
tube("heater_rod", [(-0.95, 0.05, -0.05), (0.95, 0.05, -0.05), (0.95, 0.2, -0.05), (-0.95, 0.2, -0.05)], 0.025, heater_mat)
es = heater_mat.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
for f, s in ((1, 0.0), (int(N_FRAMES * 0.08), 0.0), (int(N_FRAMES * 0.25), 2.2), (N_FRAMES, 2.6)):
    es.default_value = s
    es.keyframe_insert("default_value", frame=f)

# power lead into the heater (lime = electricity)
lime = mat("power", T["electric"], 0.4, emit=T["electric"], strength=0.9)
tube("power_lead", [(-0.95, 0.12, -0.05), (-1.3, 0.12, -0.05), (-1.3, 0.12, -0.8)], 0.012, lime)

# glass-tube radiant heater variant, off to the right for the camera slide
glass = mat("glass", T["chalk"], 0.05, transmission=1.0)
bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=1.6, location=(3.0, 0.1, 0.0), rotation=(0, math.pi / 2, 0))
bpy.context.object.data.materials.append(glass)
coil_mat = mat("element", T["heat_soft"], 0.4, emit=T["heat"], strength=2.5)
cp = [(3.0 - 0.75 + i * 0.03, 0.1 + 0.035 * math.cos(i * 1.2), 0.035 * math.sin(i * 1.2)) for i in range(51)]
tube("glass_element", cp, 0.008, coil_mat)
for k in range(20):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(2.25 + k * 0.08, 0.13, 0.47))
    c2 = bpy.context.object
    c2.scale = (0.026, 0.19, 0.76)
    c2.data.materials.append(frost_mat)

# lights: cold fill from the front, warm light from the heater
bpy.ops.object.light_add(type="AREA", location=(0.3, -2.5, 1.4), rotation=(math.radians(65), 0, 0))
fill = bpy.context.object.data
fill.color = (1.0, 1.0, 1.0)
fill.energy = 200
fill.size = 3
bpy.ops.object.light_add(type="POINT", location=(0, -0.15, -0.1))
hot = bpy.context.object.data
hot.color = rgb(T["heat"])[:3]
for f, e in ((1, 0.0), (int(N_FRAMES * 0.08), 0.0), (int(N_FRAMES * 0.25), 40.0), (N_FRAMES, 50.0)):
    hot.energy = e
    hot.keyframe_insert("energy", frame=f)

# camera slides from the rod heater to the glass-tube variant
bpy.ops.object.camera_add(location=(-0.4, -3.0, 0.6), rotation=(math.radians(84), 0, math.radians(-4)))
cam = bpy.context.object
cam.data.lens = 35
sc.camera = cam
cam.keyframe_insert("location", frame=1)
cam.location = (0.1, -2.8, 0.55)
cam.keyframe_insert("location", frame=int(N_FRAMES * 0.6))
# hold on the rod heater until "glass tube" (scene cue ~9.2 s); the slide then runs ~0.9 s
cam.keyframe_insert("location", frame=282)
cam.location = (3.0, -2.6, 0.5)
cam.keyframe_insert("location", frame=309)

os.makedirs(OUT, exist_ok=True)
if SAMPLES:
    sc.cycles.samples = SAMPLES
bpy.ops.render.render(animation=True)
print("blender: rendered to", OUT)
