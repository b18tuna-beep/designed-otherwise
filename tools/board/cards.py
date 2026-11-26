"""Storyboard cards for the checkpoint-3 animatic, made BEFORE the 2D animation exists.

    python tools/board/cards.py <ep> <out_dir>

Writes out_dir/stills/<id>.png (one 1920x1080 card per 2D/archival scene), out_dir/heroes/<id>.mp4 (a placeholder clip per 3D scene)
and out_dir/overlays/%06d.png (transparent frames, one per hero frame, so tools/board/animatic.py runs unchanged).
A card shows the scene's on-screen text, its planned changes with their times, and the corner clock and crank-angle dial at the scene's
key time, drawn from style/tokens.json and the OFL fonts. It is a layout and timing board, not the final look.
"""
import json
import os
import subprocess
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TOK = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]
FONTS = os.path.join(ROOT, "style", "fonts")
W, H = 1920, 1080


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def mono(size):
    return font("IBMPlexMono-Medium.ttf", size)


def disp(size):
    f = ImageFont.truetype(os.path.join(FONTS, "Archivo-Variable.ttf"), size)
    try:
        f.set_variation_by_axes([600, 100])  # weight, width
    except Exception:
        pass
    return f


def clock_dial(d, deg, mode, show):
    """Top-right clock and dial (look.md section 3). mode: run | stopped."""
    if not show:
        return
    col = TOK["chalk"] if mode == "run" else TOK["muted"]
    t = deg * 0.238e-3
    d.text((W - 130, 120), f"{t:0.3f} s", font=mono(52), fill=col, anchor="rt")
    d.text((W - 130, 184), f"CRANK {deg:.0f}\N{DEGREE SIGN}", font=mono(34), fill=col, anchor="rt")
    if mode != "run":
        d.text((W - 130, 230), "CLOCK STOPPED", font=mono(34), fill=TOK["muted"], anchor="rt")
    cx, cy, r = W - 130 - 100, 440, 100
    active = min(int(deg // 180), 3) if deg < 720 else 3
    for k in range(4):
        a0, a1 = -90 + 90 * k, -90 + 90 * (k + 1)
        on = k == active and mode == "run"
        d.arc([cx - r, cy - r, cx + r, cy + r], a0 + 1, a1 - 1, fill=TOK["chalk"] if on else TOK["muted"], width=6 if on else 4)
    import math
    ang = math.radians(-90 + deg / 2)  # 720 degrees of crank = one dial revolution
    d.line([cx, cy, cx + (r - 6) * math.cos(ang), cy + (r - 6) * math.sin(ang)], fill=col, width=5)


def card(s, path, deg, mode, show_clock):
    img = Image.new("RGB", (W, H), TOK["bg"])
    d = ImageDraw.Draw(img)
    d.rectangle([96, 96, W - 96, H - 96], outline=TOK["grid"], width=2)
    hero = s["tool"] == "blender"
    head = f"{s['id']}   {s['tool'].upper()}" + (f"   HERO CLIP: {s.get('clip')}" if hero else "") + f"   {s['start']:.1f}–{s['end']:.1f} s"
    d.text((120, 120), head, font=mono(30), fill=TOK["muted"])
    d.text((120, 160), s.get("chapter", ""), font=mono(26), fill=TOK["grid"] if False else TOK["muted"])
    y = 330
    for line in (s["text"] or ["(no on-screen text)"])[:4]:
        d.text((120, y), line, font=disp(72), fill=TOK["chalk"] if s["text"] else TOK["muted"])
        y += 96
    if hero:
        d.rectangle([120, 560, 1250, 760], outline=TOK["grid"], width=3)
        d.text((140, 580), "3D hero plays underneath; overlay frames on top", font=mono(28), fill=TOK["muted"])
    vis = "\n".join(textwrap.wrap(s["visual"], 118)[:6])
    d.multiline_text((120, 770), vis, font=font("Archivo-Regular.ttf", 24), fill=TOK["muted"], spacing=6)
    cues = "   ".join(f"{c:.1f}s {ch.split(' on ')[0][:34]}" for c, ch in zip(s["cues"], s["changes"]))
    d.multiline_text((120, 960), "\n".join(textwrap.wrap("changes: " + cues, 150)[:2]), font=mono(20), fill=TOK["chalk"], spacing=4)
    clock_dial(d, deg, mode, show_clock)
    img.save(path)


def main():
    ep, out = sys.argv[1:3]
    sc = json.load(open(os.path.join(ROOT, "episodes", ep, "scenes", "scenes.json")))["scenes"]
    for sub in ("stills", "heroes", "overlays"):
        os.makedirs(os.path.join(out, sub), exist_ok=True)
    clock_in = next(i for i, s in enumerate(sc) if s["id"] == "S00g")
    n_ov = 0
    for i, s in enumerate(sc):
        show = i >= clock_in
        deg = (s["clock_start"] + s["clock_end"]) / 2 if s.get("clock_start") is not None else 0
        mode = "stopped" if s.get("chapter") == "clock stopped" and s["id"] not in ("S67",) else "run"
        png = os.path.join(out, "stills", f"{s['id']}.png")
        card(s, png, deg, mode, show)
        if s["tool"] == "blender":
            mp4 = os.path.join(out, "heroes", f"{s['id']}.mp4")
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-framerate", "30", "-i", png, "-t", "6",
                            "-c:v", "libx264", "-pix_fmt", "yuv420p", mp4], check=True)
            n_ov += round(s["end"] * 30) - round(s["start"] * 30)
    blank = os.path.join(out, "blank.png")
    Image.new("RGBA", (W, H), (0, 0, 0, 0)).save(blank)
    for k in range(n_ov):
        dst = os.path.join(out, "overlays", f"{k:06d}.png")
        if not os.path.exists(dst):
            os.link(blank, dst)
    print(f"{len(sc)} cards, {n_ov} blank overlay frames")


if __name__ == "__main__":
    main()
