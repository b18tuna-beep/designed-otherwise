"""Frame grabs for visual QA: per scene, one frame just after the cut, one after each cue lands,
and one just before the next cut, laid out as one strip per scene.

    python tools/board/qa_frames.py <video.mp4> <scenes.json> <out_dir> [S01,S02,...]
"""
import json
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
F = ImageFont.truetype(os.path.join(ROOT, "style", "fonts", "IBMPlexMono-Medium.ttf"), 20)
W, H = 640, 360


def grab(video, t, path):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", video, "-frames:v", "1",
                    "-vf", f"scale={W}:{H}", path], check=True)


def main():
    video, scenes_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
    only = set(sys.argv[4].split(",")) if len(sys.argv) > 4 else None
    os.makedirs(out, exist_ok=True)
    for s in json.load(open(scenes_path))["scenes"]:
        if only and s["id"] not in only:
            continue
        times = [("cut", s["start"] + 0.3)]
        times += [(f"c{i + 1}", s["start"] + c + 0.9) for i, c in enumerate(s["cues"])]
        times += [("end", s["end"] - 0.2)]
        times = sorted(times, key=lambda x: x[1])
        # fill any stretch longer than 4 s with extra samples so a static stretch is visible in the strip
        filled = []
        for (la, ta), (lb, tb) in zip(times, times[1:]):
            filled.append((la, ta))
            k = int((tb - ta) // 3.0)
            if tb - ta > 4.0:
                for j in range(1, k + 1):
                    filled.append(("mid", ta + j * (tb - ta) / (k + 1)))
        times = filled + [times[-1]]
        strip = Image.new("RGB", (W * len(times), H + 30), "#000")
        d = ImageDraw.Draw(strip)
        for k, (lab, t) in enumerate(times):
            p = os.path.join(out, f"_tmp.png")
            grab(video, t, p)
            strip.paste(Image.open(p), (k * W, 30))
            d.text((k * W + 8, 4), f"{s['id']} {lab} @{t - s['start']:.1f}s", font=F, fill="#D6F25C")
        strip.save(os.path.join(out, f"{s['id']}.png"))
    tmp = os.path.join(out, "_tmp.png")
    if os.path.exists(tmp):
        os.remove(tmp)
    print("wrote strips to", out)


if __name__ == "__main__":
    main()
