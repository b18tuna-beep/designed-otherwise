"""FPI P1 scene S02, hero shot 1: an ordinary, intact fridge in a dark kitchen. Its
side panel reads warm (hot-wall condenser hidden inside it) and the grille at the
bottom glows; the door is shut. The camera pushes in on the side panel, where a 2D
chalk hand is composited in Motion Canvas.

    blender -b --factory-startup -P hero1_fridge.py -- <out_dir> [first last] [--frames N] [--res PCT]
--frames sets the shot length (frames at 30 fps), defaults to 150.
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
        i = ARGS.index(name); v = ARGS[i + 1]; del ARGS[i:i + 2]; return int(v)
    return default
N_FRAMES = _opt("--frames", 150)
RES_PCT = _opt("--res", 100)
SAMPLES = _opt("--samples", 0)
OUT = ARGS[0] if ARGS else "/tmp/hero1"
# optional frame chunk so several runners can split the render: -- out 1 50
FIRST, LAST = (int(ARGS[1]), int(ARGS[2])) if len(ARGS) >= 3 else (1, N_FRAMES)


def rgb(hexstr, a=1.0):
    h = hexstr.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


def mat(name, color, rough=0.5, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = rgb(color)
    b.inputs["Roughness"].default_value = rough
    if emit:
        b.inputs["Emission Color"].default_value = rgb(emit)
        b.inputs["Emission Strength"].default_value = strength
    return m


bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = 12
sc.cycles.use_adaptive_sampling = True
sc.cycles.max_bounces = 4
sc.cycles.diffuse_bounces = 2
sc.cycles.glossy_bounces = 2
sc.cycles.transmission_bounces = 0
sc.render.use_persistent_data = True
sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
sc.render.resolution_percentage = RES_PCT
sc.render.fps = 30
sc.frame_start, sc.frame_end = 1, N_FRAMES
sc.render.image_settings.file_format = "PNG"
sc.render.filepath = os.path.join(OUT, "f_")
sc.view_settings.view_transform = "AgX" if "AgX" in [v.identifier for v in
                                                     bpy.types.ColorManagedViewSettings.bl_rna.properties["view_transform"].enum_items] else "Filmic"

world = bpy.data.worlds.new("w")
sc.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = rgb(T["bg"])
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.6

# floor and back wall
bpy.ops.mesh.primitive_plane_add(size=30)
bpy.context.object.data.materials.append(mat("floor", T["panel"], 0.8))
bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 6.0, 0), rotation=(math.pi / 2, 0, 0))
bpy.context.object.data.materials.append(mat("wall", T["grid"], 0.9))

# fridge body: beveled box, open-front shell
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.05))
body = bpy.context.object
body.scale = (0.85, 0.75, 2.1)
bev = body.modifiers.new("bevel", "BEVEL")
bev.width, bev.segments = 0.04, 4
body.data.materials.append(mat("body", T["chalk"], 0.35))

# doors (closed): freezer on top, fresh food below, with handles
for (z, hgt) in ((1.75, 0.66), (0.72, 1.34)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.4, z))
    d = bpy.context.object
    d.scale = (0.85, 0.05, hgt - 0.03)
    d.modifiers.new("bevel", "BEVEL").width = 0.02
    d.data.materials.append(mat("door", T["chalk"], 0.3))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=hgt * 0.5, location=(0.33, -0.46, z))
    bpy.context.object.data.materials.append(mat("handle", T["muted"], 0.3))

# side panel: the hot-wall condenser is inside it, so the panel itself reads warm
bpy.ops.mesh.primitive_plane_add(size=1, location=(0.428, 0, 1.05), rotation=(0, math.pi / 2, 0))
side = bpy.context.object
side.scale = (2.0, 0.7, 1)
sm = mat("side_warm", T["chalk"], 0.4, emit=T["heat"], strength=0.0)
side.data.materials.append(sm)
es = sm.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
for f, s_ in ((1, 0.0), (int(N_FRAMES * 0.45), 0.0), (int(N_FRAMES * 0.75), 0.0), (N_FRAMES, 0.0)):
    es.default_value = s_
    es.keyframe_insert("default_value", frame=f)

# bottom grille with a warm glow behind it (fan-cooled machine compartment)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.38, 0.06))
gb = bpy.context.object
gb.scale = (0.8, 0.02, 0.1)
gb.data.materials.append(mat("grille_back", T["panel"], 0.6))
for k in range(10):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.36 + k * 0.08, -0.41, 0.06))
    sl = bpy.context.object
    sl.scale = (0.03, 0.02, 0.1)
    sl.data.materials.append(mat("slat", T["panel"], 0.5))
bpy.ops.object.light_add(type="AREA", location=(0, -0.6, 0.05), rotation=(math.radians(-90), 0, 0))
gl = bpy.context.object.data
gl.color = rgb(T["heat"])[:3]
gl.energy = 0
gl.size = 0.8

# key light
bpy.ops.object.light_add(type="AREA", location=(-3, -3, 4))
key = bpy.context.object
key.data.energy = 600
key.data.size = 3
key.rotation_euler = (math.radians(50), 0, math.radians(-45))

# soft neutral fill on the side panel so the 2D warm overlay reads on a lit surface
bpy.ops.object.light_add(type="AREA", location=(2.6, -0.6, 1.6))
fill = bpy.context.object
fill.data.energy = 260
fill.data.size = 2.5
fill.rotation_euler = (0, math.radians(75), math.radians(15))

# camera: front three-quarter, slow push toward the side panel
bpy.ops.object.camera_add(location=(3.3, -4.4, 1.55))
cam = bpy.context.object
cam.data.lens = 35
target = bpy.data.objects.new("target", None)
sc.collection.objects.link(target)
target.location = (0.2, 0, 0.92)
trk = cam.constraints.new("TRACK_TO")
trk.target = target
sc.camera = cam
cam.keyframe_insert("location", frame=1)
cam.location = (3.0, -3.95, 1.45)
cam.keyframe_insert("location", frame=N_FRAMES)

sc.frame_start, sc.frame_end = FIRST, LAST
os.makedirs(OUT, exist_ok=True)
if SAMPLES:
    sc.cycles.samples = SAMPLES
bpy.ops.render.render(animation=True)
print("blender: rendered to", OUT)
