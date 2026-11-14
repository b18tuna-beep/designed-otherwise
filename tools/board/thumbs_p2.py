"""P2 thumbnails (2026-11-14), built on the 3D hero frames per style/packaging.md.

    python tools/board/thumbs_p2.py <h1_cochlea_frame.png> <h3_haircells_frame.png> <out_dir>

Title: "Your Ears Are Making a Sound Right Now". Thumbnails never repeat it; two different ideas for Test & Compare:
A  "HEAR IT?"     the cochlea shell with violet rings coming off it (violet = sound the ear makes): the question
B  "TINY MOTORS"  the outer hair cells close up: the payoff tease (claim 4.4/4.7: outer hair cells are motors)
One idea each, max 3 words, readable at 160 px.
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
T = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]
FONT = os.path.join(ROOT, "style", "fonts", "Archivo-SemiCondensed-SemiBold.ttf")
W, H = 1280, 720


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def vignette(img, k=0.55):
    vig = Image.radial_gradient("L").resize((W * 2, H * 2)).crop((W // 2, H // 2, W * 3 // 2, H * 3 // 2))
    return Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), img, vig.point(lambda v: int(v * k)))


def text(img, lines, size, x, y, colors, gap=0.95):
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT, size)
    for i, (ln, col) in enumerate(zip(lines, colors)):
        yy = y + int(i * size * gap)
        for dx, dy in ((0, 6), (4, 4)):
            d.text((x + dx, yy + dy), ln, font=f, fill=(0, 0, 0))
        d.text((x, yy), ln, font=f, fill=rgb(col))
    return img


def cochlea(frame):
    src = Image.open(frame).convert("RGB")
    # find the shell (bright pixels) and crop around it
    g = src.convert("L").point(lambda v: 255 if v > 120 else 0)
    l, t, r, b = g.getbbox()
    cx, cy, side = (l + r) // 2, (t + b) // 2, int(max(r - l, b - t) * 1.25)
    crop = src.crop((cx - side // 2, cy - side // 2, cx + side // 2, cy + side // 2)).resize((640, 640), Image.LANCZOS)
    crop = ImageEnhance.Contrast(crop).enhance(1.1)
    img = Image.new("RGB", (W, H), rgb(T["bg"]))
    # violet rings behind the shell, glowing: the ear's own sound going out
    rings = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(rings)
    ox, oy = 900, 380
    for i, rad in enumerate((250, 320, 395, 475)):
        a = 1 - i * 0.2
        col = tuple(int(c * a) for c in rgb(T["refrigerant"]))
        d.ellipse((ox - rad, oy - rad, ox + rad, oy + rad), outline=col, width=9)
    glow = rings.filter(ImageFilter.GaussianBlur(14))
    img = Image.blend(img, Image.composite(glow, img, glow.convert("L").point(lambda v: min(255, v * 3))), 0.9)
    img.paste(rings, (0, 0), rings.convert("L").point(lambda v: 255 if v > 10 else 0))
    mask = crop.convert("L").point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.GaussianBlur(2))
    img.paste(crop, (ox - 320, oy - 320), mask)
    return vignette(img)


def haircells(frame):
    src = Image.open(frame).convert("RGB")
    w, h = src.size
    crop = src.crop((int(w * 0.18), 0, w, int(h * 0.82))).resize((W, int(W * 0.82 * h / (w * 0.82))), Image.LANCZOS)
    img = Image.new("RGB", (W, H), rgb(T["bg"]))
    img.paste(crop, (0, -int((crop.height - H) * 0.15)))
    img = ImageEnhance.Contrast(img).enhance(1.15)
    # darken the left so the words read, keep the cells bright on the right
    grad = Image.linear_gradient("L").rotate(90).resize((W, H)).point(lambda v: int(255 - v * 0.95))
    img = Image.composite(Image.new("RGB", (W, H), rgb(T["bg"])), img, grad.point(lambda v: int(v * 0.85)))
    return vignette(img, 0.45)


def main():
    h1, h3, out = sys.argv[1:4]
    os.makedirs(out, exist_ok=True)
    a = text(cochlea(h1), ["HEAR", "IT?"], 210, 70, 130, [T["chalk"], T["refrigerant"]])
    a.save(os.path.join(out, "thumb-1.jpg"), quality=92)
    b = text(haircells(h3), ["TINY", "MOTORS"], 190, 60, 150, [T["chalk"], T["refrigerant"]])
    b.save(os.path.join(out, "thumb-2.jpg"), quality=92)
    sheet = Image.new("RGB", (2 * 336 + 30, 189 + 20), (255, 255, 255))
    for i, im in enumerate((a, b)):
        sheet.paste(im.resize((336, 189), Image.LANCZOS), (10 + i * 346, 10))
    sheet.save(os.path.join(out, "mobile-check.png"))
    print("written", out)


if __name__ == "__main__":
    main()
