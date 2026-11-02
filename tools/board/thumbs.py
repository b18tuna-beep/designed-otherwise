"""Three 1280x720 thumbnails, each one object, one color story, at most 4 words, teasing the question.

    python tools/board/thumbs.py <final.mp4> <out_dir>
Frames are pulled from the finished video so the thumbnails match the episode exactly.
"""
import json
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TOK = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]
BOLD = os.path.join(ROOT, "style", "fonts", "Archivo-SemiCondensed-SemiBold.ttf")
SCENES = json.load(open(os.path.join(ROOT, "episodes", "p1-refrigerator", "scenes", "scenes.json")))["scenes"]
S = {s["id"]: s for s in SCENES}

# (name, scene, seconds into scene, crop box on the 1920x1080 frame, words, word color, text side)
PLAN = [
    ("thumb-1", "S01", 2.8, (60, 135, 1100, 918), ["WHY IS", "IT HOT?"], TOK["heat"], "right"),
    ("thumb-2", "S29", 4.6, (880, 180, 1660, 1040), ["A HEATER", "INSIDE?"], TOK["heat"], "left"),
    ("thumb-3", "S02", 5.5, (560, 60, 1500, 1000), ["TOUCH", "THE SIDE"], TOK["chalk"], "left"),
]


def grab(video, t, path):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", video, "-frames:v", "1", path], check=True)


def main():
    video, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    for name, sid, at, box, words, color, side in PLAN:
        p = os.path.join(out, f"_{name}.png")
        grab(video, S[sid]["start"] + at, p)
        src = Image.open(p).convert("RGB").crop(box)
        canvas = Image.new("RGB", (1280, 720), TOK["bg"])
        # object fills ~60% of the frame on one side, text block on the other
        oh = 720
        ow = int(src.width * oh / src.height)
        obj = src.resize((ow, oh), Image.LANCZOS)
        ox = 1280 - ow if side == "left" else 0
        canvas.paste(obj, (max(ox, -ow // 3) if side == "left" else min(0, 640 - ow), 0))
        d = ImageDraw.Draw(canvas)
        # soft dark panel behind the words for contrast at phone size
        panel = Image.new("L", (1280, 720), 0)
        pd = ImageDraw.Draw(panel)
        tx0 = 60 if side == "left" else 700
        pd.rectangle([tx0 - 40, 120, tx0 + 560, 600], fill=170)
        panel = panel.filter(ImageFilter.GaussianBlur(60))
        canvas = Image.composite(Image.new("RGB", (1280, 720), TOK["bg"]), canvas, panel)
        d = ImageDraw.Draw(canvas)
        size = 150
        f = ImageFont.truetype(BOLD, size)
        while max(d.textlength(w, font=f) for w in words) > 540:
            size -= 6
            f = ImageFont.truetype(BOLD, size)
        y = 360 - (len(words) * size * 1.05) / 2
        for w in words:
            d.text((tx0, y), w, font=f, fill=color, stroke_width=4, stroke_fill=TOK["bg"])
            y += size * 1.05
        canvas.save(os.path.join(out, f"{name}.jpg"), quality=92)
        os.remove(p)
        print("wrote", name)


if __name__ == "__main__":
    main()
