"""P4 thumbnails (2026-11-25), built on full-quality renders of the 3D lock (l1_lock.py at --res 100 --samples 48).

    python tools/board/thumbs_p4.py <hook_frame.png> <master_frame.png> <out_dir>

Title: "Look at Your Front Door Key. The Lock Never Does." Thumbnails never repeat its words; one idea each, max 3 words:
1  "IT'S BLIND"   hook frame: key in, all five gaps glowing on the shear line. Pairs with the title (the lock never looks).
2  "WHO ELSE?"    master frame: a round-bow key opening the same lock. The second-key idea (Test & Compare partner of 1).
3  "JUST HEIGHTS" hook frame, alternate wording of idea 1.
The lock sits right, the words left on slate.
"""
import os
import sys

from PIL import Image, ImageEnhance, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from thumbs_p2 import H, T, W, rgb, text, vignette  # noqa: E402


def lock_right(path, height=660, right_pad=30):
    src = Image.open(path).convert("RGB")
    g = src.convert("L").point(lambda v: 255 if v > 45 else 0)
    l, t, r, b = g.getbbox()
    pad = 20
    crop = src.crop((max(0, l - pad), max(0, t - pad), min(src.width, r + pad), min(src.height, b + pad)))
    k = height / crop.height
    if crop.width * k > W * 0.58:
        k = W * 0.58 / crop.width
    crop = ImageEnhance.Contrast(crop.resize((round(crop.width * k), round(crop.height * k)), Image.LANCZOS)).enhance(1.08)
    img = Image.new("RGB", (W, H), rgb(T["bg"]))
    # feather: keep the lock (bright pixels, grown) and fade the render's own background into the slate
    m = crop.convert("L").point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(14))
    img.paste(crop, (W - crop.width - right_pad, (H - crop.height) // 2), m)
    return vignette(img, 0.35)


def main():
    hook, master, out = sys.argv[1:4]
    os.makedirs(out, exist_ok=True)
    a = text(lock_right(hook), ["IT'S", "BLIND"], 165, 40, 190, [T["chalk"], T["refrigerant"]])
    a.save(os.path.join(out, "thumb-1.jpg"), quality=92)
    b = text(lock_right(master), ["WHO", "ELSE?"], 165, 40, 190, [T["chalk"], T["refrigerant"]])
    b.save(os.path.join(out, "thumb-2.jpg"), quality=92)
    c = text(lock_right(hook), ["JUST", "HEIGHTS"], 118, 36, 230, [T["chalk"], T["refrigerant"]])
    c.save(os.path.join(out, "thumb-3.jpg"), quality=92)
    sheet = Image.new("RGB", (3 * 336 + 40, 189 + 20), (255, 255, 255))
    for i, im in enumerate((a, b, c)):
        sheet.paste(im.resize((336, 189), Image.LANCZOS), (10 + i * 346, 10))
    sheet.save(os.path.join(out, "mobile-check.png"))
    print("written", out)


if __name__ == "__main__":
    main()
