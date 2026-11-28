"""P5 thumbnails (2026-11-28), built on real frames of the finished video (hero shots with their overlays).

    python tools/board/thumbs_p5.py <frame_348.png> <frame_380.png> <frame_91.png> <out_dir>

Title: "Your Car Engine Is Being Carried Right Now". Thumbnails never repeat its words; max 3 words, readable at 160 px.
1 "ONLY NOW?"        t=348 s  the one power stroke (orange charge)
2 "THE OTHER 3?"     t=380 s  four-cylinder crank, one piston lit
3 "NOTHING MADE YET" t=91 s   intake with the clock at 0.043 s
Frame fills the canvas; the left is darkened to slate so the words read; words left, chalk with the last line in heat orange.
"""
import os
import sys

from PIL import Image, ImageEnhance

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from thumbs_p2 import H, T, W, rgb, text, vignette  # noqa: E402


def base(path):
    src = Image.open(path).convert("RGB").resize((W, H), Image.LANCZOS)
    src = ImageEnhance.Contrast(src).enhance(1.12)
    grad = Image.linear_gradient("L").rotate(90).resize((W, H))  # 255 left -> 0 right after rotate? normalise below
    grad = grad.transpose(Image.FLIP_LEFT_RIGHT) if grad.getpixel((0, 0)) < grad.getpixel((W - 1, 0)) else grad
    a = grad.point(lambda v: int(min(1.0, v / 255 * 1.35) * 0.93 * 255))
    return vignette(Image.composite(Image.new("RGB", (W, H), rgb(T["bg"])), src, a), 0.35)


def main():
    f1, f2, f3, out = sys.argv[1:5]
    os.makedirs(out, exist_ok=True)
    c, h = T["chalk"], T["heat"]
    ims = [text(base(f1), ["ONLY", "NOW?"], 190, 40, 170, [c, h]),
           text(base(f2), ["THE OTHER", "3?"], 170, 40, 170, [c, h]),
           text(base(f3), ["NOTHING", "MADE", "YET"], 150, 40, 100, [c, c, h])]
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
