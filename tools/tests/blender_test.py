"""Blender toolchain test (5 s, headless Cycles): a stylized fridge with a cold
interior glow and a hot condenser coil behind it, camera orbiting to reveal the coil.

    blender -b --factory-startup -P tools/tests/blender_test.py -- <out_frames_dir>
"""
import json
import math
import os
import sys

import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
T = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]
ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = ARGS[0] if ARGS else "/tmp/blender-test"
# optional frame chunk so several runners can split the render: -- out 1 50
FIRST, LAST = (int(ARGS[1]), int(ARGS[2])) if len(ARGS) >= 3 else (1, 150)


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
sc.render.resolution_x, sc.render.resolution_y = 1280, 720
sc.render.resolution_percentage = 75  # 960x540 for the test
sc.render.fps = 30
sc.frame_start, sc.frame_end = 1, 150
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
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.0))
body = bpy.context.object
body.scale = (0.9, 0.8, 2.0)
bev = body.modifiers.new("bevel", "BEVEL")
bev.width, bev.segments = 0.04, 4
body.data.materials.append(mat("body", T["chalk"], 0.35))

# cold interior face, seen through the open door
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -0.402, 1.0), rotation=(math.pi / 2, 0, 0))
inner = bpy.context.object
inner.scale = (0.82, 1.9, 1)
inner.data.materials.append(mat("interior", T["cold_soft"], 0.5, emit=T["cold"], strength=1.5))

# door, swung slightly open, with a cold glow spilling out
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.43, 1.0))
door = bpy.context.object
door.scale = (0.9, 0.06, 1.98)
door.modifiers.new("bevel", "BEVEL").width = 0.03
door.data.materials.append(mat("door", T["chalk"], 0.3))
sc.cursor.location = (-0.45, -0.43, 1.0)  # hinge on the left edge
bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
door.rotation_euler.z = math.radians(-40)

bpy.ops.object.light_add(type="AREA", location=(0.1, -0.45, 1.1), rotation=(math.radians(-90), 0, 0))
cold = bpy.context.object.data
cold.color = rgb(T["cold"])[:3]
cold.energy = 120
cold.size = 0.7

# condenser coil behind the fridge: zigzag tube glowing in the heat color
pts = []
for i in range(13):
    z = 0.25 + i * 0.12
    pts += [(-0.34, 0.47, z), (0.34, 0.47, z)] if i % 2 == 0 else [(0.34, 0.47, z), (-0.34, 0.47, z)]
crv = bpy.data.curves.new("coil", "CURVE")
crv.dimensions = "3D"
crv.bevel_depth = 0.025
sp = crv.splines.new("POLY")
sp.points.add(len(pts) - 1)
for p, co in zip(sp.points, pts):
    p.co = (*co, 1)
coil = bpy.data.objects.new("coil", crv)
sc.collection.objects.link(coil)
cm = mat("coil", T["heat_soft"], 0.4, emit=T["heat"], strength=4.0)
coil.data.materials.append(cm)
es = cm.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
for f, s in ((1, 1.5), (60, 3.5), (110, 2.0), (150, 4.0)):
    es.default_value = s
    es.keyframe_insert("default_value", frame=f)

bpy.ops.object.light_add(type="POINT", location=(0, 0.9, 1.0))
hot = bpy.context.object.data
hot.color = rgb(T["heat"])[:3]
hot.energy = 300

# key light
bpy.ops.object.light_add(type="AREA", location=(-3, -3, 4))
key = bpy.context.object
key.data.energy = 600
key.data.size = 3
key.rotation_euler = (math.radians(50), 0, math.radians(-45))

# camera orbit from front three-quarter around to the rear three-quarter to reveal the coil
pivot = bpy.data.objects.new("pivot", None)
sc.collection.objects.link(pivot)
pivot.location = (0, 0, 1.0)
bpy.ops.object.camera_add(location=(0, -5.2, 1.6))
cam = bpy.context.object
cam.data.lens = 40
cam.parent = pivot
trk = cam.constraints.new("TRACK_TO")
trk.target = pivot
sc.camera = cam
pivot.rotation_euler.z = math.radians(-35)
pivot.keyframe_insert("rotation_euler", frame=1)
pivot.rotation_euler.z = math.radians(-120)
pivot.keyframe_insert("rotation_euler", frame=150)

sc.frame_start, sc.frame_end = FIRST, LAST
os.makedirs(OUT, exist_ok=True)
bpy.ops.render.render(animation=True)
print("blender: rendered to", OUT)
