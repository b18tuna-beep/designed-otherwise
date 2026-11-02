"""Insert THE HINGE sting into a finished episode at the end of its cold open.

    python tools/intro/insert_sting.py <episode.mp4> <captions.srt> <cut_seconds> <sting.mp4> <out_dir>

The cut snaps to the nearest frame (30 fps); put it on the scene boundary right after the cold open's
last line (P1: 26.51 s, between "...on purpose." and "Let's start..."). Episode audio fades out over
0.25 s into the cut and back in over 0.08 s after it, so the narration resumes immediately.
Writes out_dir/final.mp4 and out_dir/captions.srt (cues after the cut shifted by the sting length),
and prints loudness and true peak. Chapters after the cut move by the same amount (3.2 s).
"""
import json
import os
import re
import subprocess
import sys

FPS = 30


def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                check=True, capture_output=True, text=True).stdout)


def shift_srt(src, dst, cut, by):
    def parse(ts):
        h, m, rest = ts.split(":")
        s, ms = rest.split(",")
        return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000

    def fmt(x):
        h, r = divmod(x, 3600)
        m, s = divmod(r, 60)
        return f"{int(h):02d}:{int(m):02d}:{s:06.3f}".replace(".", ",")
    out = []
    for block in open(src, encoding="utf-8").read().strip().split("\n\n"):
        lines = block.split("\n")
        a, b = [parse(x.strip()) for x in lines[1].split("-->")]
        if a >= cut:
            a, b = a + by, b + by
        elif b > cut:
            b = cut
        out.append("\n".join([lines[0], f"{fmt(a)} --> {fmt(b)}"] + lines[2:]))
    open(dst, "w", encoding="utf-8").write("\n\n".join(out) + "\n")


def main():
    ep, srt, cut_s, sting, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4], sys.argv[5]
    os.makedirs(out, exist_ok=True)
    cf = round(cut_s * FPS)
    cut = cf / FPS
    sd = dur(sting)
    # three pieces encoded with identical settings, then joined without re-encoding (one pass over the
    # whole episode in a single filter graph runs out of memory)
    enc = ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS),
           "-g", "60", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"]
    a = os.path.join(out, "part-a.mp4")
    b = os.path.join(out, "part-b.mp4")
    c = os.path.join(out, "part-c.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", ep, "-vf", f"trim=end_frame={cf},setpts=PTS-STARTPTS",
                    "-af", f"atrim=end={cut:.6f},asetpts=PTS-STARTPTS,afade=t=out:st={cut - 0.25:.6f}:d=0.25", *enc, a], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", sting, "-vf", f"fps={FPS},format=yuv420p",
                    "-af", "aresample=48000,aformat=channel_layouts=stereo", *enc, b], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{cut:.6f}", "-i", ep, "-af", "afade=t=in:st=0:d=0.08",
                    *enc, c], check=True)
    lst = os.path.join(out, "parts.txt")
    open(lst, "w").write("".join(f"file '{os.path.abspath(x)}'\n" for x in (a, b, c)))
    final = os.path.join(out, "final.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy",
                    "-movflags", "+faststart", final], check=True)
    for x in (a, b, c, lst):
        os.remove(x)
    shift_srt(srt, os.path.join(out, "captions.srt"), cut, sd)
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", final, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    lufs = float(re.findall(r"I:\s+(-?[0-9.]+) LUFS", r)[-1])
    tp = float(re.findall(r"Peak:\s+(-?[0-9.]+) dBFS", r)[-1])
    checks = {"cut_frame": cf, "cut_s": cut, "sting_s": sd, "episode_s": dur(ep), "final_s": dur(final),
              "length_ok": abs(dur(final) - dur(ep) - sd) < 0.1, "loudness_lufs": lufs,
              "loudness_ok": abs(lufs + 14) <= 1.0, "true_peak_dbtp": tp, "true_peak_ok": tp <= -1.5}
    json.dump(checks, open(os.path.join(out, "sting-checks.json"), "w"), indent=1)
    print(json.dumps(checks, indent=1))


if __name__ == "__main__":
    main()
