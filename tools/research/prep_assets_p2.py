"""Turn P2's downloaded public-domain originals into the exact-aspect stills the Motion Canvas scenes load.

    python tools/research/prep_assets_p2.py <dir with fetch_assets.py output>

Writes episodes/p2-ear/scenes/assets/*.png (git-ignored: originals come from the studio release `assets-p2-ear`)
and episodes/p2-ear/scenes/assets/credits.json. The <Still> node stretches to its w x h, so every output
matches the aspect of the Still that loads it (see src/p2/anim.tsx).

  newborn-screen-1.png  S01  U.S. Navy photo, Naples newborn hearing check: wide crop on gloved hands, probe, baby
  newborn-screen-2.png  S33  same photo, tight crop on the probe at the ear
  grays-1918-ossicles   S07  Gray's fig. 919, inverted to chalk line art on slate
  stereocilia-sem.png   S21  NIDCD cochlear stereocilia SEM (Kawashima), centred on a slate panel
The USAF "New Born Hearing Test" photo shows ear-coupler (ABR, nerve) screening, not OAE, so it is not used.
The faces stay out of frame except the newborn's; no name badge, wristband or label text is in any crop.
"""
import json
import os
import sys

from PIL import Image, ImageOps

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
OUT = os.path.join(ROOT, "episodes", "p2-ear", "scenes", "assets")
BG = (0x1A, 0x20, 0x29)      # panel token
CHALK = (0xEC, 0xE7, 0xDC)


def crop_frac(im, box, size):
    """box = (left, top, right, bottom) as fractions of the image; resized (lanczos) to size."""
    w, h = im.size
    l, t, r, b = box
    return im.crop((round(l * w), round(t * h), round(r * w), round(b * h))).resize(size, Image.LANCZOS)


def on_panel(im, size, fill=0.86):
    """Scale im (aspect kept) to fill `fill` of size and centre it on the panel colour."""
    W, H = size
    k = min(W * fill / im.width, H * fill / im.height)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    canvas = Image.new("RGB", size, BG)
    canvas.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
    return canvas


def chalk_on_slate(im):
    """Black-on-white plate -> chalk lines on the panel colour, trimmed to the drawing."""
    g = ImageOps.grayscale(im.convert("RGB"))
    g = g.crop(ImageOps.invert(g).point(lambda v: 255 if v > 40 else 0).getbbox())
    return ImageOps.colorize(g, black=CHALK, white=BG)


def main():
    src = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    lic = {x["name"]: x for x in json.load(open(os.path.join(src, "licenses.json")))}
    navy = Image.open(os.path.join(src, "n1_navy_newborn_hearing.jpg")).convert("RGB")

    jobs = {
        # Still sizes (w x h) from anim.tsx, rendered at 2x for the 1080p frame
        "newborn-screen-1.png": (crop_frac(navy, (0.0, 0.535, 1.0, 0.923), (2360, 1380)), "n1_navy_newborn_hearing", "S01"),
        "newborn-screen-2.png": (crop_frac(navy, (0.20, 0.655, 0.72, 0.905), (1720, 1240)), "n1_navy_newborn_hearing", "S33"),
        "grays-1918-ossicles.png": (on_panel(chalk_on_slate(Image.open(os.path.join(src, "gray919_ossicles.png"))), (1840, 1160), 0.97),
                                    "gray919_ossicles", "S07"),
        "stereocilia-sem.png": (on_panel(Image.open(os.path.join(src, "s1_stereocilia_cochlea_kawashima.jpg")).convert("RGB"), (2120, 1120), 0.94),
                                "s1_stereocilia_cochlea_kawashima", "S21"),
    }
    credits = []
    for out_name, (im, key, scene) in jobs.items():
        im.save(os.path.join(OUT, out_name), optimize=True)
        L = lic[key]
        credits.append({"file": out_name, "scene": scene, "source": L.get("source"), "file_url": L.get("file_url"),
                        "license": L.get("LicenseShortName"), "artist": L.get("Artist"), "credit": L.get("Credit")})
        print(out_name, im.size, L.get("LicenseShortName"))
    json.dump(credits, open(os.path.join(OUT, "credits.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
