"""P3 thumbnails (2026-11-20), built on the 3D hero frames per style/packaging.md.

    python tools/board/thumbs_p3.py <h7_frame.png> <hook_frame.png> <out_dir>

Title: "The Water Inside Trees Is Being Stretched". Thumbnails never repeat it; two ideas for Test & Compare:
A  "BELOW ZERO"  H7: the tree gone ghostly with violet water columns glowing up it (violet = pull/tension): the strange fact
B  "NO PUMP"     the hook shot, inside the trunk, violet columns under tension: the engineering challenge
One idea each, max 3 words, readable at 160 px. The picture sits right, the words left on a darkened side.
"""
import json
import os
import sys

from PIL import Image, ImageEnhance

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from thumbs_p2 import H, T, W, rgb, text, vignette  # noqa: E402


def frame_right(path, fx=0.5, zoom=1.0):
    """Cover 1280x720 with the frame (zoomed), centred at fraction fx, then darken the left 45% for the words."""
    src = Image.open(path).convert("RGB")
    k = max(W / src.width, H / src.height) * zoom
    im = src.resize((round(src.width * k), round(src.height * k)), Image.LANCZOS)
    x = max(0, min(im.width - W, round(im.width * fx - W * 0.74)))
    y = (im.height - H) // 2
    img = ImageEnhance.Contrast(im.crop((x, y, x + W, y + H))).enhance(1.12)
    grad = Image.linear_gradient("L").rotate(90).resize((W, H)).point(lambda v: int(max(0, 255 - v * 1.8) * 0.85))
    img = Image.composite(Image.new("RGB", (W, H), rgb(T["bg"])), img, grad)
    return vignette(img, 0.45)


def main():
    h7, hook, out = sys.argv[1:4]
    os.makedirs(out, exist_ok=True)
    a = text(frame_right(h7, 0.47, 1.55), ["BELOW", "ZERO"], 200, 60, 150, [T["chalk"], T["refrigerant"]])
    a.save(os.path.join(out, "thumb-1.jpg"), quality=92)
    b = text(frame_right(hook, 0.5, 1.0), ["NO", "PUMP"], 220, 70, 140, [T["chalk"], T["refrigerant"]])
    b.save(os.path.join(out, "thumb-2.jpg"), quality=92)
    sheet = Image.new("RGB", (2 * 336 + 30, 189 + 20), (255, 255, 255))
    for i, im in enumerate((a, b)):
        sheet.paste(im.resize((336, 189), Image.LANCZOS), (10 + i * 346, 10))
    sheet.save(os.path.join(out, "mobile-check.png"))
    print("written", out)


if __name__ == "__main__":
    main()
