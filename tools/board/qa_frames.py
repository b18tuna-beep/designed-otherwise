"""Frame grabs for visual QA: per scene, one frame just after the cut, one after each cue lands,
and one just before the next cut, laid out as one strip per scene.

    python tools/board/qa_frames.py <video.mp4> <scenes.json> <out_dir> [S01,S02,...] [--checks checks.json]

scenes.json times are narration time. The finished video has THE HINGE (STING_S, 3.2 s) spliced in at the scene boundary
after the cold open (the first beat-2 scene, same rule as assemble.yml), so every scene from that boundary on is grabbed
STING_S later. The cut is read from scenes.json; the length from `sting.sting_s` in checks.json when --checks is given,
else STING_S. Pass --no-sting for a silent episode.mp4 or any video without the sting.
"""
import json
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
F = ImageFont.truetype(os.path.join(ROOT, "style", "fonts", "IBMPlexMono-Medium.ttf"), 20)
W, H = 640, 360
STING_S = 3.2  # tools/intro/hinge.py: 96 frames at 30 fps


def sting_offsets(scenes, checks_path):
    """(cut_s, length_s) of the sting in narration time, or (None, 0) when the episode has no beat 2."""
    cut = next((s["start"] for s in scenes if s["beat"] == 2), None)
    length = STING_S
    if checks_path:
        length = json.load(open(checks_path)).get("sting", {}).get("sting_s", STING_S)
    return cut, length


def grab(video, t, path):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", video, "-frames:v", "1",
                    "-vf", f"scale={W}:{H}", path], check=True)


def main():
    args = sys.argv[1:]
    no_sting = "--no-sting" in args
    args = [a for a in args if a != "--no-sting"]
    checks = None
    if "--checks" in args:
        i = args.index("--checks")
        checks = args[i + 1]
        del args[i:i + 2]
    video, scenes_path, out = args[0], args[1], args[2]
    only = set(args[3].split(",")) if len(args) > 3 else None
    os.makedirs(out, exist_ok=True)
    scenes = json.load(open(scenes_path))["scenes"]
    cut, slen = (None, 0.0) if no_sting else sting_offsets(scenes, checks)
    for s0 in scenes:
        if only and s0["id"] not in only:
            continue
        # video time = narration time, plus the sting for everything from the cut on
        sh = slen if cut is not None and s0["start"] >= cut - 1e-6 else 0.0
        s = {**s0, "start": s0["start"] + sh, "end": s0["end"] + sh}
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
