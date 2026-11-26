"""Audio assembly helpers (adapted from the sister channel's renderer).

- music_bed(): loop a track to length, level it to -30 LUFS, fade in and out
- mix(): duck music under narration with a sidechain compressor, then normalize
  the master to YouTube's -14 LUFS integrated, -1.5 dBTP true peak
- loudness(): measure integrated loudness and true peak of a finished file
"""
import json
import os
import re
import subprocess


def sh(*cmd):
    r = subprocess.run(list(map(str, cmd)), capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"command failed: {' '.join(map(str, cmd))[:400]}\n{r.stderr[-2000:]}")
    return r.stdout + r.stderr


def duration(path):
    return float(sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path).strip().split()[0])


LOOPS = []  # one entry per bed that had to loop, read by assemble.py for the report


def music_bed(track, length, out):
    """Bed of `length` s from one track. A track shorter than the slot is not hard-looped (that left a dead tail and a
    restart from the intro): its tail silence is trimmed and it is crossfaded (4 s) into a mid-track loop point."""
    src = track
    tdur = duration(track)
    if tdur < length:
        fade, lp = 4.0, 0.45 * tdur
        trimmed = out + ".trim.wav"
        sh("ffmpeg", "-y", "-loglevel", "error", "-i", track, "-af",
           "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse", "-ar", "48000", "-ac", "2", trimmed)
        cur, n = trimmed, 0
        while duration(cur) < length + 2:
            n += 1
            nxt = f"{out}.loop{n}.wav"
            sh("ffmpeg", "-y", "-loglevel", "error", "-i", cur, "-ss", f"{lp:.3f}", "-i", trimmed,
               "-filter_complex", f"[0:a][1:a]acrossfade=d={fade}:c1=tri:c2=tri", "-ar", "48000", nxt)
            cur = nxt
        src = cur
        LOOPS.append({"track": os.path.basename(track), "bed_s": round(length, 1), "loops": n, "crossfade_s": fade})
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", src, "-t", f"{length:.3f}",
       "-af", f"loudnorm=I=-30:TP=-6:LRA=11,afade=t=in:d=1.5,afade=t=out:st={max(length - 2, 0):.3f}:d=2",
       "-ar", "48000", "-ac", "2", out)
    return out


def mix(narration, music, total, out):
    fc = ("[0:a]aformat=channel_layouts=stereo,asplit=2[nv][sc];"
          "[1:a][sc]sidechaincompress=threshold=0.03:ratio=6:attack=30:release=600[mus];"
          "[nv][mus]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-2.0:LRA=11[out]")
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", narration, "-i", music, "-filter_complex", fc,
       "-map", "[out]", "-t", f"{total:.3f}", "-ar", "48000", out)
    return out


def loudness(path):
    txt = sh("ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "loudnorm=print_format=json", "-f", "null", "-")
    js = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", txt, re.S).group(0))
    return {"lufs": float(js["input_i"]), "true_peak": float(js["input_tp"])}
