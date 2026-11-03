"""P1 thumbnails v2 (2026-11-02): built on the 3D hero frame, not the flat cutaway.

    python tools/board/thumbs_v2.py <hero_frame.png> <out_dir>

A  "120°F"          the number from the cold open (claim 1.1: some models' sides pass 50 °C in a hot room)
B  "WHY IS IT HOT?"  the question, now on the real-looking fridge
Both: fridge fills the right half, side panel pushed hotter, hand kept (it ties to the title's action),
one idea, max 3 words, readable at 160 px wide. Title and thumbnail never repeat each other.
"""
import json
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
T = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]
FONT = os.path.join(ROOT, "style", "fonts", "Archivo-SemiCondensed-SemiBold.ttf")
W, H = 1280, 720


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def base(hero):
    src = Image.open(hero).convert("RGB")
    # crop tight on the fridge (hero frame is 1920x1080; fridge sits around x 860-1010)
    crop = src.crop((780, 40, 1260, 1000))
    scale = (H * 1.02) / crop.height
    crop = crop.resize((int(crop.width * scale), int(crop.height * scale)), Image.LANCZOS)
    crop = ImageEnhance.Contrast(crop).enhance(1.12)
    img = Image.new("RGB", (W, H), hexrgb(T["bg"]))
    x0 = W - crop.width + 40
    img.paste(crop, (x0, -6))
    # blend the crop's left edge into the background
    mask = Image.linear_gradient("L").rotate(90).resize((70, H))
    bgstrip = Image.new("RGB", (70, H), hexrgb(T["bg"]))
    region = img.crop((x0, 0, x0 + 70, H))
    img.paste(Image.composite(region, bgstrip, mask), (x0, 0))

    # push the side panel hotter: orange screen over the panel's existing warm pixels
    r, g, b = img.split()
    warm = ImageChops.subtract(r, b).point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.GaussianBlur(3))
    hot = Image.new("RGB", (W, H), hexrgb(T["heat_peak"]))
    img = Image.composite(Image.blend(img, hot, 0.45), img, warm)
    glow = warm.filter(ImageFilter.GaussianBlur(40)).point(lambda v: int(v * 0.8))
    img = Image.composite(Image.new("RGB", (W, H), hexrgb(T["heat"])), img, glow.point(lambda v: v // 2))
    # vignette
    vig = Image.radial_gradient("L").resize((W * 2, H * 2)).crop((W // 2, H // 2, W * 3 // 2, H * 3 // 2))
    img = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), img, vig.point(lambda v: int(v * 0.55)))
    return img


def text(img, lines, size, x, y, colors, gap=0.95):
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT, size)
    for i, (ln, col) in enumerate(zip(lines, colors)):
        yy = y + int(i * size * gap)
        for dx, dy in ((0, 6), (4, 4)):
            d.text((x + dx, yy + dy), ln, font=f, fill=(0, 0, 0))
        d.text((x, yy), ln, font=f, fill=hexrgb(col))
    return img


def main():
    hero, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    a = text(base(hero), ["120°F"], 250, 60, 210, [T["heat"]])
    a.save(os.path.join(out, "thumb-a.jpg"), quality=92)
    b = text(base(hero), ["WHY IS", "IT HOT?"], 170, 60, 170, [T["chalk"], T["heat"]])
    b.save(os.path.join(out, "thumb-b.jpg"), quality=92)
    # mobile check: both at YouTube's small size side by side
    sheet = Image.new("RGB", (2 * 336 + 30, 189 + 20), (255, 255, 255))
    for i, im in enumerate((a, b)):
        sheet.paste(im.resize((336, 189), Image.LANCZOS), (10 + i * 346, 10))
    sheet.save(os.path.join(out, "mobile-check.png"))
    print("written", out)


if __name__ == "__main__":
    main()
