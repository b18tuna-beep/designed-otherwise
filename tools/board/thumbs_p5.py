"""P5 thumbnails (2026-11-28), built on real frames of the finished video (hero shots with their overlays).

    python tools/board/thumbs_p5.py <frame_348.png> <frame_380.png> <frame_91.png> <out_dir>

Title: "Your Car Engine Is Being Carried Right Now". Thumbnails never repeat its words; max 3 words, readable at 160 px.
1 "ONLY NOW?"        t=348 s  the one power stroke (orange charge)
2 "THE OTHER 3?"     t=380 s  four-cylinder crank, one piston lit
3 "NOTHING MADE YET" t=91 s   empty intake wireframe
Only the mechanism is cropped out of the frame (scene labels, header text, clock and dial are left behind: unreadable at
160 px), lifted (levels + a soft slate light behind it, screen-blended so the frame's dark shadows drop out) and placed
away from the words. Words sit in their own clear zone, chalk with the last line in heat orange. Colours keep their
token meanings: the only warm light is behind the burning charge in thumb 1.
"""
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from thumbs_p2 import H, T, W, rgb, text, vignette  # noqa: E402


def glow(cx, cy, r, col, k):
    """Soft radial light: colour col at strength k (0..1) at the centre, fading to black."""
    g = Image.new("RGB", (W, H), (0, 0, 0))
    ImageDraw.Draw(g).ellipse((cx - r, cy - r, cx + r, cy + r), fill=tuple(int(c * k) for c in col))
    return g.filter(ImageFilter.GaussianBlur(r * 0.45))


def lift(im, gain=1.9, gamma=0.72, sat=1.25):
    im = im.point(lambda v: int(255 * min(1.0, (v / 255 * gain)) ** gamma))
    im = ImageEnhance.Color(im).enhance(sat)
    return ImageEnhance.Contrast(im).enhance(1.12)


def scene(path, box, scale, pos, lights, paint=(), keep=None, gain=1.9):
    """Crop box (in the 1920x1080 frame), scale it, screen it onto a bg with lights; paint = rects to blank first."""
    src = Image.open(path).convert("RGB")
    bgc = rgb(T["bg"])
    orig = src.copy()
    d = ImageDraw.Draw(src)
    for r in paint:
        d.rectangle(r, fill=src.getpixel((5, 5)))
    if keep:  # (cx, cy, r): put the original pixels back inside this circle (the flywheel the blanking overlapped)
        m = Image.new("L", src.size, 0)
        ImageDraw.Draw(m).ellipse((keep[0] - keep[2], keep[1] - keep[2], keep[0] + keep[2], keep[1] + keep[2]), fill=255)
        src.paste(orig, (0, 0), m)
    crop = src.crop(box)
    crop = crop.resize((int(crop.width * scale), int(crop.height * scale)), Image.LANCZOS)
    # drop the frame's own background so only the mechanism is lifted
    base = Image.new("RGB", (W, H), bgc)
    for cx, cy, r, col, k in lights:
        base = ImageChops.add(base, glow(cx, cy, r, col, k))
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    layer.paste(lift(gain=gain, im=ImageChops.subtract(crop, Image.new("RGB", crop.size, src.getpixel((5, 5))))), pos)
    return vignette(ImageChops.screen(base, layer), 0.3)


def main():
    f1, f2, f3, out = sys.argv[1:5]
    os.makedirs(out, exist_ok=True)
    c, h = T["chalk"], T["heat"]
    slate = (70, 86, 108)
    # 1: cylinder + pressure bar, scaled to ~0.8, right of the words; warm light only behind the charge
    s1 = scene(f1, (430, 100, 1090, 1000), 0.76, (690, 20),
               [(940, 300, 420, slate, 0.55), (940, 250, 150, rgb(T["heat_soft"]), 0.9)],
               paint=[(850, 575, 1035, 648), (100, 80, 520, 140)], keep=(762, 757, 170))
    # 2: four pistons + crank, pushed lower/right so the words own the upper left
    s2 = scene(f2, (140, 300, 1420, 1040), 0.80, (270, 140), [(800, 450, 560, slate, 0.55)], gain=1.45)
    # 3: empty intake wireframe
    s3 = scene(f3, (430, 140, 1090, 970), 0.84, (660, 10), [(950, 380, 430, slate, 0.6)], gain=1.9)
    ims = [text(s1, ["ONLY", "NOW?"], 190, 40, 170, [c, h]),
           text(s2, ["THE OTHER", "3?"], 150, 40, 40, [c, h]),
           text(s3, ["NOTHING", "MADE", "YET"], 150, 40, 100, [c, c, h])]
    for i, im in enumerate(ims, 1):
        im.save(os.path.join(out, f"thumb-{i}.jpg"), quality=92)
        im.resize((320, 180), Image.LANCZOS).save(os.path.join(out, f"thumb-{i}-320.jpg"), quality=88)
    sheet = Image.new("RGB", (3 * 336 + 40, 189 + 20), (255, 255, 255))
    for i, im in enumerate(ims):
        sheet.paste(im.resize((160, 90), Image.LANCZOS).resize((336, 189)), (10 + i * 346, 10))
    sheet.save(os.path.join(out, "mobile-check.png"))
    print("written", out)


if __name__ == "__main__":
    main()
