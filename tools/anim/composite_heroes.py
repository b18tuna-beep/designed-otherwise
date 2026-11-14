"""Composite the Blender hero shots under their transparent 2D overlays and splice them into the episode.

    python tools/anim/composite_heroes.py <ep> <episode.mp4> <heroes_dir> <overlay_frames_dir> <out.mp4>

Heroes are the scenes with tool == "blender" in episodes/<ep>/scenes/scenes.json, in order. Each one's clip is
<heroes_dir>/<scene id>.mp4 if present, else <heroes_dir>/H<k>.mp4 (k = 1.. in order: P2 naming).
Overlay frames come from the episode's overlays Motion Canvas project (one overlay scene per hero, in the same
order, groupByScene off, consecutive %06d.png). Scene frame ranges are round(start*30) .. round(end*30), the
same rule the scene runner uses. A clip shorter than its slot holds its last frame (P2 re-voice moved a few
slots by 1-4 frames); a longer one is cut.

The episode is cut at the hero ranges into segments, each encoded on its own, and joined with the concat
demuxer: one big filter graph over a 10-minute 1080p episode ran out of memory on P1's sting splice.
"""
import json
import os
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FPS = 30
# frames to skip at the head of a hero clip so its end pose lands before the cut
HEAD_SKIP = {("p1-refrigerator", "S29"): 4}
ENC = ["-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(FPS), "-g", "60", "-an"]


def run(*cmd):
    subprocess.run(list(map(str, cmd)), check=True)


def frames(path):
    return int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries",
                               "stream=nb_read_packets", "-of", "csv=p=0", path], capture_output=True, text=True,
                              check=True).stdout.strip())


def main():
    ep, episode, heroes_dir, ov_dir, out = sys.argv[1:6]
    scenes = json.load(open(os.path.join(ROOT, "episodes", ep, "scenes", "scenes.json")))["scenes"]
    work = os.path.join(os.path.dirname(os.path.abspath(out)), "_heroes")
    os.makedirs(work, exist_ok=True)
    total = frames(episode)
    offset, spans = 0, []
    for k, s in enumerate([s for s in scenes if s["tool"] == "blender"], 1):
        f0, f1 = round(s["start"] * FPS), round(s["end"] * FPS)
        n = f1 - f0
        clip = os.path.join(heroes_dir, f"{s['id']}.mp4")
        clip = clip if os.path.exists(clip) else os.path.join(heroes_dir, f"H{k}.mp4")
        skip = HEAD_SKIP.get((ep, s["id"]), 0)
        comp = os.path.join(work, f"{s['id']}.mp4")
        run("ffmpeg", "-loglevel", "error", "-y", "-i", clip,
            "-framerate", FPS, "-start_number", offset, "-i", os.path.join(ov_dir, "%06d.png"),
            "-filter_complex",
            f"[0:v]fps={FPS},scale=1920:1080,trim=start_frame={skip},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop=-1[h];"
            f"[1:v]trim=end_frame={n},setpts=PTS-STARTPTS,format=rgba[o];[h][o]overlay=eof_action=pass:format=auto[v]",
            "-map", "[v]", "-frames:v", n, *ENC, comp)
        spans.append((comp, f0, f1))
        offset += n
        print(s["id"], os.path.basename(clip), f"{f0}-{f1}", n)

    parts, pos = [], 0
    for i, (comp, f0, f1) in enumerate(spans):
        if f0 > pos:
            seg = os.path.join(work, f"ep-{i:02d}.mp4")
            run("ffmpeg", "-loglevel", "error", "-y", "-i", episode, "-vf",
                f"trim=start_frame={pos}:end_frame={f0},setpts=PTS-STARTPTS", *ENC, seg)
            parts.append(seg)
        parts.append(comp)
        pos = f1
    if pos < total:
        seg = os.path.join(work, "ep-tail.mp4")
        run("ffmpeg", "-loglevel", "error", "-y", "-i", episode, "-vf",
            f"trim=start_frame={pos},setpts=PTS-STARTPTS", *ENC, seg)
        parts.append(seg)
    lst = os.path.join(work, "parts.txt")
    open(lst, "w").write("".join(f"file '{os.path.abspath(p)}'\n" for p in parts))
    run("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy",
        "-movflags", "+faststart", out)
    got = frames(out)
    print("wrote", out, "frames", got, "episode", total, "OK" if got == total else "MISMATCH")
    sys.exit(0 if got == total else 1)


if __name__ == "__main__":
    main()
