"""Storyboard contact sheet: one still per scene with id, time, tool and the line it lands on.

    python tools/board/contact_sheet.py <scenes.json> <stills_dir> <out.png> [first last]
"""
import json
import os
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FONTS = os.path.join(ROOT, "style", "fonts")
TOK = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]

COLS, TW, TH, PAD, CAP = 4, 720, 405, 28, 118


def main():
    scenes = json.load(open(sys.argv[1]))["scenes"]
    stills, out = sys.argv[2], sys.argv[3]
    if len(sys.argv) > 5:
        a, b = int(sys.argv[4]), int(sys.argv[5])
        scenes = scenes[a - 1:b]
    rows = (len(scenes) + COLS - 1) // COLS
    W = COLS * TW + (COLS + 1) * PAD
    H = rows * (TH + CAP) + (rows + 1) * PAD
    sheet = Image.new("RGB", (W, H), "#0B0E12")
    d = ImageDraw.Draw(sheet)
    f_id = ImageFont.truetype(os.path.join(FONTS, "Archivo-SemiCondensed-SemiBold.ttf"), 30)
    f_mono = ImageFont.truetype(os.path.join(FONTS, "IBMPlexMono-Medium.ttf"), 22)
    f_txt = ImageFont.truetype(os.path.join(FONTS, "Archivo-Regular.ttf"), 21)
    for k, s in enumerate(scenes):
        x = PAD + (k % COLS) * (TW + PAD)
        y = PAD + (k // COLS) * (TH + CAP + PAD)
        p = os.path.join(stills, f"{s['id']}.png")
        im = Image.open(p).convert("RGB").resize((TW, TH), Image.LANCZOS) if os.path.exists(p) else Image.new("RGB", (TW, TH), "#300")
        sheet.paste(im, (x, y))
        m, sec = divmod(s["start"], 60)
        tool = "3D" if s["tool"] == "blender" else "2D"
        d.text((x, y + TH + 10), s["id"], font=f_id, fill=TOK["chalk"])
        d.text((x + 80, y + TH + 16), f"{int(m)}:{sec:04.1f}  ·  {s['duration']:.0f}s  ·  {tool}", font=f_mono,
               fill=TOK["heat"] if tool == "3D" else TOK["muted"])
        line = textwrap.shorten(s["words"], 150, placeholder=" …")
        for j, ln in enumerate(textwrap.wrap("“" + line + "”", 70)[:3]):
            d.text((x, y + TH + 50 + j * 24), ln, font=f_txt, fill=TOK["muted"])
    sheet.save(out)
    print("wrote", out, sheet.size)


if __name__ == "__main__":
    main()
