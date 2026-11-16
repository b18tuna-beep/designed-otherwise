"""P3 (trees): turn the downloaded public-domain originals into the stills and footage clips the scenes use.

    python tools/research/prep_assets_p3.py <dir with fetch_assets.py output> <footage_out_dir>

Stills -> episodes/p3-trees/scenes/assets/ (committed: public domain, small) + credits.json
  magdeburg-1672.png       S06   Guericke 1672 Magdeburg hemispheres plate, 16:9 crop (hemispheres + horse teams), 1920x1080
  maple-sap-lines.png      S16   USFS maple sap tubing on a trunk, 16:9, 1920x1080
  sequoia-dieback-2014.png S38b  USGS (N. Stephenson) giant sequoia foliage dieback, 2014 drought; portrait 3:4, 900x1200,
                                 shown framed on slate (the original is only 720x960)
Footage -> <footage_out_dir>/<scene id>.mp4 (NOT committed: video stays out of the public repo), 1920x1080, 30 fps,
exact frame counts from scenes.json, a light grade so it sits with the slate palette (slightly less saturation, soft vignette):
  S41  NPS "Redwood Trunk" B-roll (Redwood National and State Parks, G Litten), the tilt up the trunk
  S44  NPS "Sun In Redwood Canopy" B-roll
  S45  NPS "Fog in Redwood Trees" B-roll
Licence: the park's B-roll page: "You can download and freely use this HD footage for any media project."
"""
import json
import os
import subprocess
import sys

from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EP = os.path.join(ROOT, "episodes", "p3-trees")
OUT = os.path.join(EP, "scenes", "assets")
FPS = 30
# scene -> (source file, start second in the source)
FOOTAGE = {"S41": ("v1_redwood_trunk.mp4", 10.0), "S44": ("v4_sun_in_redwood_canopy.mp4", 4.0),
           "S45": ("v2_fog_in_redwood_trees.mp4", 1.0)}
GRADE = "eq=saturation=0.85:contrast=1.03:brightness=-0.02,vignette=angle=PI/5"


def cover(im, size, fy=0.5):
    """Scale to cover `size`, crop centred horizontally, at fraction fy vertically."""
    W, H = size
    k = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    x = (im.width - W) // 2
    y = round((im.height - H) * fy)
    return im.crop((x, y, x + W, y + H))


def main():
    src, fout = sys.argv[1:3]
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(fout, exist_ok=True)
    lic = {x["name"]: x for x in json.load(open(os.path.join(src, "licenses.json"))) if "error" not in x}
    stills = {
        "magdeburg-1672.png": (cover(Image.open(os.path.join(src, "h1_magdeburg_hemispheres_1672.jpg")).convert("RGB"), (1920, 1080), 0.12),
                               "h1_magdeburg_hemispheres_1672", "S06"),
        "maple-sap-lines.png": (cover(Image.open(os.path.join(src, "w6_usfs_maple_sap_lines_b.jpg")).convert("RGB"), (1920, 1080), 0.55),
                                "w6_usfs_maple_sap_lines_b", "S16"),
        "sequoia-dieback-2014.png": (Image.open(os.path.join(src, "w2_usgs_sequoia_drought_dieback.png")).convert("RGB").resize((900, 1200), Image.LANCZOS),
                                     "w2_usgs_sequoia_drought_dieback", "S38b"),
    }
    credits = []
    for name, (im, key, scene) in stills.items():
        im.save(os.path.join(OUT, name), optimize=True)
        L = lic.get(key, {})
        credits.append({"file": name, "scene": scene, "source": L.get("source"), "file_url": L.get("file_url"),
                        "license": L.get("LicenseShortName") or L.get("license"), "artist": L.get("Artist") or L.get("credit")})
        print(name, im.size)

    scenes = {s["id"]: s for s in json.load(open(os.path.join(EP, "scenes", "scenes.json")))["scenes"]}
    for sid, (f, ss) in FOOTAGE.items():
        s = scenes[sid]
        n = round(s["end"] * FPS) - round(s["start"] * FPS)
        dst = os.path.join(fout, f"{sid}.mp4")
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(ss), "-i", os.path.join(src, f), "-vf",
                        f"fps={FPS},scale=1920:1080:flags=lanczos,{GRADE},format=yuv420p,tpad=stop_mode=clone:stop=-1",
                        "-frames:v", str(n), "-an", "-c:v", "libx264", "-crf", "17", "-preset", "medium", dst], check=True)
        L = lic.get(f.rsplit(".", 1)[0], {})
        credits.append({"file": f"footage/{sid}.mp4", "scene": sid, "source": L.get("source"), "file_url": L.get("file_url"),
                        "license": L.get("license"), "artist": L.get("credit")})
        print(sid, n, "frames")
    json.dump(credits, open(os.path.join(OUT, "credits.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
