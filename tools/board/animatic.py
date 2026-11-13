"""Checkpoint-3 animatic: the narration with every scene on screen for exactly its time slot.

    python tools/board/animatic.py <ep> <board_stills_dir> <heroes_dir> <overlay_frames_dir> <narration.wav> <out.mp4>

  2D and archival scenes: the board still (last frame of the scene) held for the scene's length.
  Blender scenes: the hero clip <heroes_dir>/H<n>.mp4 with its transparent overlay frames composited on top
                  (overlay project order = blender scene order; frames are consecutive, %06d.png).
Scene frame ranges are round(start*30) .. round(end*30) from episodes/<ep>/scenes/scenes.json, the same rule the
scene runner uses, so the animatic lines up with the final render frame for frame.
The intro sting is not in the animatic (it is spliced at assembly with tools/intro/mix_with_sting.py).
"""
import json
import os
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FPS = 30
ENC = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]


def run(*cmd):
    subprocess.run(list(map(str, cmd)), check=True)


def main():
    ep, stills, heroes, ov_dir, narration, out = sys.argv[1:7]
    scenes = json.load(open(os.path.join(ROOT, "episodes", ep, "scenes", "scenes.json")))["scenes"]
    work = os.path.join(os.path.dirname(os.path.abspath(out)), "_animatic")
    os.makedirs(work, exist_ok=True)
    parts, ov_offset, hero_n = [], 0, 0
    for s in scenes:
        f0, f1 = round(s["start"] * FPS), round(s["end"] * FPS)
        n = f1 - f0
        seg = os.path.join(work, f"{s['id']}.mp4")
        if s["tool"] == "blender":
            hero_n += 1
            run("ffmpeg", "-loglevel", "error", "-y",
                "-i", os.path.join(heroes, f"H{hero_n}.mp4"),
                "-framerate", FPS, "-start_number", ov_offset, "-i", os.path.join(ov_dir, "%06d.png"),
                "-filter_complex", f"[0:v]fps={FPS},scale=1920:1080,tpad=stop_mode=clone:stop=-1[h];"
                                   f"[1:v]format=rgba[o];[h][o]overlay=0:0:eof_action=pass[v]",
                "-map", "[v]", "-frames:v", n, *ENC, seg)
            ov_offset += n
        else:
            run("ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-framerate", FPS,
                "-i", os.path.join(stills, f"{s['id']}.png"), "-vf", "scale=1920:1080", "-frames:v", n, *ENC, seg)
        parts.append(seg)
    lst = os.path.join(work, "parts.txt")
    open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
    silent = os.path.join(work, "silent.mp4")
    run("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", silent)
    run("ffmpeg", "-loglevel", "error", "-y", "-i", silent, "-i", narration, "-map", "0:v", "-map", "1:a",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out)
    print(out)


if __name__ == "__main__":
    main()
