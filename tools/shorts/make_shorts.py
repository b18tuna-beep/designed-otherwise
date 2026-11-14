"""Cut vertical Shorts (1080x1920) from a finished episode.

    python tools/shorts/make_shorts.py <final.mp4> <captions.srt> <shorts.json> <out_dir> [endcard.mp4]

shorts.json: {"s1": {"start": 0.0, "end": 26.1, "title": "...", "description": "..."}, ...,
              "_style": {"glow": [r, g, b]}}   (optional; default warm orange, P1. P2 uses violet: orange means heat)
endcard.mp4: the 2 s vertical brand end card (tools/intro/hinge.py --format vertical-end), appended to every Short.
Layout: branded slate background with drafting grid and grain, hook title on top, the 16:9 episode
in the middle, big burned-in captions under it, mark + wordmark at the bottom. Loudness -14 LUFS.
"""
import json
import os
import re
import subprocess
import sys
import textwrap

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FONTS = os.path.join(ROOT, "style", "fonts")
SEMI = os.path.join(FONTS, "Archivo-SemiCondensed-SemiBold.ttf")
MED = os.path.join(FONTS, "Archivo-SemiCondensed-Medium.ttf")
MARK = os.path.join(ROOT, "brand", "export", "mark-dark-2048.png")
W, H = 1080, 1920
VID_Y = 620            # top of the 1080x608 video
CAP_Y = 1330           # caption baseline area


def background(title, path, glow=(70, 32, 8)):
    yy, xx = np.mgrid[0:H, 0:W] / np.array([H, W])[:, None, None]
    base = np.array([17, 21, 27], float)
    warm = np.exp(-(((xx - 0.6) / 0.45) ** 2 + ((yy - 0.95) / 0.18) ** 2))[..., None] * np.array(glow)
    cool = np.exp(-(((xx - 0.15) / 0.4) ** 2 + ((yy - 0.08) / 0.2) ** 2))[..., None] * np.array([8, 24, 44])
    a = base + warm + cool + np.random.default_rng(5).normal(0, 3, (H, W, 1))
    im = Image.fromarray(np.clip(a, 0, 255).astype("uint8")).convert("RGBA")
    d = ImageDraw.Draw(im)
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(38, 46, 57, 255), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(38, 46, 57, 255), width=1)
    # hook title
    f = ImageFont.truetype(SEMI, 78)
    lines = textwrap.wrap(title, 20)
    y = VID_Y - 70 - len(lines) * 92
    for ln in lines:
        d.text((W / 2, y), ln, font=f, fill=(236, 231, 220, 255), anchor="ma")
        y += 92
    # frame around the video
    d.rectangle([0, VID_Y - 6, W, VID_Y + 608 + 6], fill=(11, 14, 19, 255))
    # footer: mark + wordmark
    m = Image.open(MARK).resize((110, 110), Image.LANCZOS)
    fx = W / 2 - 230
    im.paste(m, (int(fx), 1650), m)
    f2 = ImageFont.truetype(MED, 40)
    f3 = ImageFont.truetype(SEMI, 40)
    d.text((fx + 130, 1668), "DESIGNED", font=f2, fill=(236, 231, 220, 255))
    d.text((fx + 130, 1712), "OTHERWISE", font=f3, fill=(236, 231, 220, 255))
    d.text((W / 2, 1800), "Full explainer on the channel", font=ImageFont.truetype(MED, 34), fill=(139, 149, 163, 255), anchor="ma")
    im.convert("RGB").save(path)


def srt_cues(path):
    t = open(path, encoding="utf-8").read()
    out = []
    for m in re.finditer(r"(\d\d):(\d\d):(\d\d),(\d+) --> (\d\d):(\d\d):(\d\d),(\d+)\n(.+?)(?:\n\n|\Z)", t, re.S):
        g = m.groups()
        s = int(g[0]) * 3600 + int(g[1]) * 60 + int(g[2]) + int(g[3]) / 1000
        e = int(g[4]) * 3600 + int(g[5]) * 60 + int(g[6]) + int(g[7]) / 1000
        out.append((s, e, g[8].replace("\n", " ")))
    return out


def ass_for(cues, start, end, path):
    def ts(x):
        x = max(x, 0)
        return f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Archivo SemiCondensed SemiBold,64,&H00DCE7EC,&H00DCE7EC,&H001B1511,&H00000000,0,0,0,0,100,100,0,0,1,4,0,8,70,70,{CAP_Y},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    for s, e, txt in cues:
        if e <= start or s >= end:
            continue
        lines.append(f"Dialogue: 0,{ts(s - start)},{ts(min(e, end) - start)},Cap,,0,0,0,,{txt}")
    open(path, "w", encoding="utf-8").write(head + "\n".join(lines) + "\n")


def main():
    video, srt, spec, out = sys.argv[1:5]
    endcard = sys.argv[5] if len(sys.argv) > 5 else None
    os.makedirs(out, exist_ok=True)
    cues = srt_cues(srt)
    shorts = json.load(open(spec))
    glow = tuple(shorts.pop("_style", {}).get("glow", (70, 32, 8)))
    for sid, s in shorts.items():
        bg = os.path.join(out, f"_{sid}_bg.png")
        ass = os.path.join(out, f"_{sid}.ass")
        background(s["title"], bg, glow)
        ass_for(cues, s["start"], s["end"], ass)
        dur = s["end"] - s["start"]
        dst = os.path.join(out, f"short-{sid}.mp4")
        fc = (f"[1:v]scale={W}:608:flags=lanczos,setsar=1[v];[0:v][v]overlay=0:{VID_Y}:shortest=1,"
              f"subtitles={ass}:fontsdir={FONTS},format=yuv420p,fade=t=in:st=0:d=0.25,fade=t=out:st={dur - 0.35:.2f}:d=0.35[o];"
              f"[1:a]afade=t=in:st=0:d=0.2,afade=t=out:st={dur - 0.4:.2f}:d=0.4,loudnorm=I=-14:TP=-2.0:LRA=11[a]")
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-framerate", "30", "-i", bg,
                        "-ss", f"{s['start']:.3f}", "-t", f"{dur:.3f}", "-i", video,
                        "-filter_complex", fc, "-map", "[o]", "-map", "[a]", "-t", f"{dur:.3f}", "-r", "30",
                        "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                        "-movflags", "+faststart", dst], check=True)
        for p in (bg, ass):
            os.remove(p)
        if endcard:
            body = dst.replace(".mp4", "_body.mp4")
            os.replace(dst, body)
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", body, "-i", endcard, "-f", "lavfi", "-t", "10",
                            "-i", "anullsrc=r=48000:cl=stereo", "-filter_complex",
                            "[1:v]scale=1080:1920,fps=30,format=yuv420p,setsar=1[e];[0:v]setsar=1[b];"
                            "[1:a]aresample=48000,aformat=channel_layouts=stereo[ea];"
                            "[b][0:a][e][ea]concat=n=2:v=1:a=1[v][a]" if has_audio(endcard) else
                            "[1:v]scale=1080:1920,fps=30,format=yuv420p,setsar=1[e];[0:v]setsar=1[b];"
                            "[2:a]atrim=end=" + f"{duration(endcard):.3f}" + "[ea];[b][0:a][e][ea]concat=n=2:v=1:a=1[v][a]",
                            "-map", "[v]", "-map", "[a]", "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "19",
                            "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", dst], check=True)
            os.remove(body)
        print("wrote", dst, f"{dur:.1f}s" + (" + end card" if endcard else ""))


def has_audio(p):
    return bool(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index",
                                "-of", "csv=p=0", p], capture_output=True, text=True).stdout.strip())


def duration(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                capture_output=True, text=True).stdout.strip())


if __name__ == "__main__":
    main()
