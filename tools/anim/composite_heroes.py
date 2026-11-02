"""Composite the Blender hero shots under their transparent 2D overlays and splice them into the episode.

    python tools/anim/composite_heroes.py <episode.mp4> <overlay_frames_dir> <out.mp4>

Overlay frames come from the `overlays` Motion Canvas project (scenes O02, O29 in order, groupByScene off),
hero clips from tools/anim/motion-canvas/src/p1/renders/<id>.mp4. Scene frame ranges are
round(start*30) .. round(end*30) from scenes.json, the same rule the scene runner uses.
"""
import json
import os
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RENDERS = os.path.join(ROOT, "tools", "anim", "motion-canvas", "src", "p1", "renders")
HEROES = ["S02", "S29"]
# frames to skip at the head of a hero clip so its end pose lands before the cut (S29: slide arrives at frame 309)
HEAD_SKIP = {"S29": 4}
FPS = 30


def run(*cmd):
    subprocess.run(list(map(str, cmd)), check=True)


def main():
    episode, ov_dir, out = sys.argv[1:4]
    scenes = {s["id"]: s for s in json.load(open(os.path.join(ROOT, "episodes", "p1-refrigerator", "scenes", "scenes.json")))["scenes"]}
    work = os.path.join(os.path.dirname(os.path.abspath(out)), "_heroes")
    os.makedirs(work, exist_ok=True)
    offset = 0
    spans = []
    for hid in HEROES:
        s = scenes[hid]
        f0, f1 = round(s["start"] * FPS), round(s["end"] * FPS)
        n = f1 - f0
        comp = os.path.join(work, f"{hid}.mp4")
        run("ffmpeg", "-loglevel", "error", "-y",
            "-i", os.path.join(RENDERS, f"{hid}.mp4"),
            "-framerate", FPS, "-start_number", offset, "-i", os.path.join(ov_dir, "%06d.png"),
            "-filter_complex",
            f"[0:v]trim=start_frame={HEAD_SKIP.get(hid, 0)}:end_frame={n + HEAD_SKIP.get(hid, 0)},setpts=PTS-STARTPTS,fps={FPS}[h];"
            f"[1:v]trim=end_frame={n},setpts=PTS-STARTPTS,format=rgba[o];[h][o]overlay=format=auto[v]",
            "-map", "[v]", "-frames:v", n, "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", comp)
        spans.append((comp, f0, f1))
        offset += n
    # splice by cutting the episode at the hero frame ranges and concatenating (frame-exact)
    inputs, fc, segs, pos = ["-i", episode], [], [], 0
    n_split = len(spans) + 1
    fc.append(f"[0:v]split={n_split}" + "".join(f"[e{i}]" for i in range(n_split)))
    for k, (comp, f0, f1) in enumerate(spans, 1):
        inputs += ["-i", comp]
        fc.append(f"[e{k - 1}]trim=start_frame={pos}:end_frame={f0},setpts=PTS-STARTPTS[s{k}]")
        fc.append(f"[{k}:v]setpts=PTS-STARTPTS,format=yuv420p[h{k}]")
        segs += [f"[s{k}]", f"[h{k}]"]
        pos = f1
    fc.append(f"[e{n_split - 1}]trim=start_frame={pos},setpts=PTS-STARTPTS[tail]")
    segs.append("[tail]")
    fc.append("".join(segs) + f"concat=n={len(segs)}:v=1:a=0[v]")
    run("ffmpeg", "-loglevel", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", "[v]", "-r", FPS,
        "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", out)
    print("wrote", out)


if __name__ == "__main__":
    main()
