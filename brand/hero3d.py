"""3D hero render of the Designed Otherwise mark (Blender, Cycles CPU).

    bvenv/bin/python brand/hero3d.py <out.png> [width height samples]
Layers from mark.py are extruded into slabs at different depths: orange panel at the back,
chalk frame in the middle, blue door in front. A warm light behind the doorway spills through it.
"""
import math
import os
import sys

import bpy
import bmesh

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mark import layers  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/hero.png"
W, H = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1920, 1080)
SAMPLES = int(sys.argv[4]) if len(sys.argv) > 4 else 64
DIST = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0     # camera distance multiplier (smaller mark)
SHIFT = float(sys.argv[6]) if len(sys.argv) > 6 else 0.0    # aim right of the mark so it sits left in frame (m)
VSHIFT = float(sys.argv[7]) if len(sys.argv) > 7 else 0.0   # aim above the mark so it sits lower in frame (m)


def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1,)


def mat(name, col, rough=0.45, emit=0.0, spec=0.3, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = lin(col)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Specular IOR Level"].default_value = spec
    if coat:
        b.inputs["Coat Weight"].default_value = coat
    if emit:
        b.inputs["Emission Color"].default_value = lin(col)
        b.inputs["Emission Strength"].default_value = emit
    return m


bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.view_settings.view_transform = "Standard"
sc.view_settings.look = "None"
sc.render.film_transparent = False

world = bpy.data.worlds.new("w")
sc.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = lin("#0B0E13")
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0

UNIT = 1 / 250.0  # 1000-unit mark box -> 4 m
DEPTH = {"#FF7A33": (-0.55, 0.16), "#ECE7DC": (0.0, 0.22), "#3DA8F5": (0.32, 0.12), "#B38CFF": (0.32, 0.12)}
MATS = {"#FF7A33": mat("heat", "#FF7A33", 0.35, coat=0.3), "#ECE7DC": mat("chalk", "#ECE7DC", 0.6, spec=0.2),
        "#3DA8F5": mat("cold", "#3DA8F5", 0.25, coat=0.6), "#B38CFF": mat("violet", "#B38CFF", 0.3, emit=0.35)}


def slab(name, geom, z0, thick, m):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    for p in getattr(geom, "geoms", [geom]):
        rings = [p.exterior, *p.interiors]
        for ring in rings:
            verts = [bm.verts.new(((x - 500) * UNIT, (500 - y) * UNIT, 0)) for x, y in list(ring.coords)[:-1]]
            for i in range(len(verts)):
                bm.edges.new((verts[i], verts[(i + 1) % len(verts)]))
    bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=bm.edges[:])
    ext = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    bmesh.ops.translate(bm, vec=(0, 0, thick), verts=[v for v in ext["geom"] if isinstance(v, bmesh.types.BMVert)])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    sc.collection.objects.link(ob)
    ob.location.z = z0
    ob.data.materials.append(m)
    bev = ob.modifiers.new("bevel", "BEVEL")
    bev.width = 0.012
    bev.segments = 3
    bev.limit_method = "ANGLE"
    return ob


for i, (c, g) in enumerate(layers(1000, 0.62, True)):
    z0, t = DEPTH[c]
    slab(f"L{i}", g, z0, t, MATS[c])

# stand the mark up: x right, y up becomes x right, z up; panels face the camera along -y
for ob in list(sc.objects):
    ob.rotation_euler = (math.radians(90), 0, 0)
    ob.location = (ob.location.x, -ob.location.z, ob.location.y)

# warm glow behind the doorway: light "on the other side" of the door
bpy.ops.mesh.primitive_plane_add(size=1, location=(-0.55, 1.4, 0.15), rotation=(math.radians(90), 0, 0))
glow = bpy.context.object
glow.scale = (1.4, 3.2, 1)
gm = bpy.data.materials.new("glow"); gm.use_nodes = True
nt = gm.node_tree; nt.nodes.clear()
em = nt.nodes.new("ShaderNodeEmission"); em.inputs["Color"].default_value = lin("#FF8A45"); em.inputs["Strength"].default_value = 7
out = nt.nodes.new("ShaderNodeOutputMaterial"); nt.links.new(em.outputs[0], out.inputs[0])
glow.data.materials.append(gm)
glow.visible_camera = False
glow.visible_glossy = True

# floor with soft reflection
bpy.ops.mesh.primitive_plane_add(size=400, location=(0, 0, -2.25))
floor = bpy.context.object
floor.data.materials.append(mat("floor", "#0E1217", 0.62, spec=0.25))

# lights: warm key behind the doorway, cool rim from the left, soft top fill
def area(name, loc, rot, col, energy, size):
    bpy.ops.object.light_add(type="AREA", location=loc, rotation=rot)
    li = bpy.context.object.data
    li.color = lin(col)[:3]
    li.energy = energy
    li.size = size
    return li

area("warm_back", (0.4, 2.2, 0.0), (math.radians(-90), 0, 0), "#FF9A5C", 900, 1.2)
area("cool_rim", (-6, 1, 2.5), (math.radians(70), 0, math.radians(-110)), "#7CC4FF", 500, 2)
area("fill", (1, -6, 5), (math.radians(45), 0, math.radians(10)), "#FFF4E6", 900, 6)

bpy.ops.object.camera_add(location=(3.2 * DIST + SHIFT, -9.5 * DIST, 2.6 * DIST + VSHIFT))
cam = bpy.context.object
cam.data.lens = 50
sc.camera = cam
tgt = bpy.data.objects.new("tgt", None)
sc.collection.objects.link(tgt)
tgt.location = (0.1 + SHIFT, 0, -0.1 + VSHIFT)
tr = cam.constraints.new("TRACK_TO")
tr.target = tgt
tr.track_axis = "TRACK_NEGATIVE_Z"
tr.up_axis = "UP_Y"

sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("rendered", OUT)
