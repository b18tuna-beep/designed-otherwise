"""P4 (lock): turn the downloaded public-domain originals into the stills the archival scenes use.

    python tools/research/prep_assets_p4.py <dir with fetch_assets.py output (release assets-p4-lock)>

Writes episodes/p4-lock/scenes/assets/<name>.jpg (committed: public domain, small) + credits.json.
Each still is cropped to its subject (crop box as fractions of the original) and fitted inside MAX (aspect kept);
the Motion Canvas archival scene frames it in chalk with its credit line.
US 48,475 (1865) is not here: the only download was an 82 px thumbnail, so S36 redraws the patent in chalk.
"""
import json
import os
import sys

from PIL import Image, ImageOps

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "episodes", "p4-lock", "scenes", "assets")
MAX = (1600, 900)
# out name: (source key, crop (l, t, r, b) fractions or None, scene, credit, licence)
STILLS = {
    "wooden-lock-met.jpg": ("m3_met_damascus_wood_lock", None, "S30",
                            "Wooden lock, Damascus. The Metropolitan Museum of Art, Open Access", "Public domain (The Met Open Access)"),
    "yale-sr.jpg": ("c7_yale_sr_portrait", None, "S34", "Linus Yale Sr. Portrait, before 1858, via Wikimedia Commons", "Public domain"),
    "patent-3630.jpg": ("p1_yale_sr_us3630_p1", None, "S34", "L. Yale, Door Lock, US patent 3,630 (1844). USPTO", "Public domain (US government work)"),
    "yale-jr.jpg": ("c6_yale_jr_portrait", None, "S35", "Linus Yale Jr. Portrait, via Wikimedia Commons", "Public domain"),
    "bramah-lock.jpg": ("c1_bramah_otto", None, "S39", "Bramah lock, Otto's Encyclopedia, via Wikimedia Commons", "Public domain"),
    "great-exhibition-nave.jpg": ("c3_great_exhibition_nave_loc", (0.0, 0.0, 1.0, 0.86), "S42",
                                  "The Great Industrial Exhibition of 1851, the British nave. Library of Congress", "Public domain"),
    "chubb-lock-engraving.jpg": ("t4_book_leaf_n69", (0.08, 0.385, 0.92, 0.705), "S44",
                                 "Chubb lock. A. C. Hobbs and C. Tomlinson, Construction of Locks (1853/1868), Internet Archive", "Public domain (pre-1929)"),
    "chubb-detector.jpg": ("c5_chubb_detector_photo", None, "S45", "Chubb detector lock, via Wikimedia Commons", "Public domain"),
    "bramah-diagram.jpg": ("t2_book_leaf_n87", (0.05, 0.14, 0.95, 0.47), "S49",
                           "Bramah lock diagram, fig. 34. A. C. Hobbs and C. Tomlinson, Construction of Locks, Internet Archive", "Public domain (pre-1929)"),
    "great-exhibition-machinery.jpg": ("c4_great_exhibition_machinery", None, "S50",
                                       "Moving Machinery, Dickinson's Comprehensive Pictures of the Great Exhibition (1854), Louis Haghe", "Public domain"),
}


def main():
    src = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    lic = {x["name"]: x for x in json.load(open(os.path.join(src, "licenses.json"))) if "error" not in x}
    files = {os.path.splitext(f)[0]: f for f in os.listdir(src)}
    credits = []
    for name, (key, crop, scene, credit, licence) in STILLS.items():
        im = ImageOps.exif_transpose(Image.open(os.path.join(src, files[key]))).convert("RGB")
        if crop:
            w, h = im.size
            im = im.crop((round(crop[0] * w), round(crop[1] * h), round(crop[2] * w), round(crop[3] * h)))
        im.thumbnail(MAX, Image.LANCZOS)
        im.save(os.path.join(OUT, name), quality=90, optimize=True)
        L = lic.get(key, {})
        credits.append({"file": name, "scene": scene, "credit": credit, "license": licence,
                        "source": L.get("source"), "file_url": L.get("file_url")})
        print(name, im.size)
    json.dump(credits, open(os.path.join(OUT, "credits.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
