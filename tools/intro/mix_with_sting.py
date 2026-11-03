"""Insert THE HINGE into an episode with a designed transition (v2 of insert_sting.py).

Michael 2026-11-03: splicing the sting into a finished mix hard-cut the music in and out of it
("an e-brake in the middle of a dry-fire exercise"). This builds the transition into the mix instead:

  picture  cold open eases to the slate ground over 0.3 s -> sting (unchanged) -> next scene eases in from slate (0.3 s)
  music    fades out over FADE_OUT s, ending at the cut (after the last cold-open word); silent under the sting;
           comes back with a slow FADE_IN under the narration that follows
  sting    sits in the voice stem, so the master loudness pass treats it as foreground

    python tools/intro/mix_with_sting.py <silent_episode.mp4> <narration.wav> <music.wav> <captions.srt>
                                         <cut_s> <sting.mp4> <logo.wav> <out_dir>
narration.wav / music.wav are assemble.py's stems for the episode WITHOUT the sting (narration padded to the video).
Writes out_dir/final.mp4, captions.srt, mix.wav, sting-checks.json.
"""
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "audio"))
sys.path.insert(0, HERE)
from mix import duration, loudness, mix, sh  # noqa: E402
from insert_sting import shift_srt  # noqa: E402

FPS = 30
BG = "0x11151B"
FADE_OUT = 1.2      # music out, ending at the cut
FADE_IN = 2.5       # music back in after the sting
PIC = 0.3           # picture ease to/from slate
STING_BELOW_VOICE_DB = 3  # the sting's notes sit this far under the narration's speech level (RMS)


def main():
    video, narr, music, srt, cut_s, sting, logo, out = sys.argv[1:9]
    os.makedirs(out, exist_ok=True)
    cf = round(float(cut_s) * FPS)
    cut = cf / FPS
    sd = duration(sting)
    enc = ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), "-g", "60", "-an"]

    # picture: three pieces with slate eases at the joins, joined without re-encoding
    a, b, c = (os.path.join(out, f"v{i}.mp4") for i in "abc")
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", video, "-vf",
       f"trim=end_frame={cf},setpts=PTS-STARTPTS,fade=t=out:st={cut - PIC:.3f}:d={PIC}:color={BG}", *enc, a)
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", sting, "-vf", f"fps={FPS},format=yuv420p", *enc, b)
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", video, "-vf",
       f"trim=start_frame={cf},setpts=PTS-STARTPTS,fade=t=in:st=0:d={PIC}:color={BG}", *enc, c)
    lst = os.path.join(out, "parts.txt")
    open(lst, "w").write("".join(f"file '{os.path.abspath(x)}'\n" for x in (a, b, c)))
    silent = os.path.join(out, "silent.mp4")
    sh("ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", silent)
    vdur = duration(silent)

    # level the sting against the narration: speech RMS (frames above -45 dBFS) vs the notes (1.5-2.6 s)
    import numpy as np

    def pcm(p, ss=None, t=None):
        cmd = ["ffmpeg", "-v", "error"] + (["-ss", str(ss)] if ss is not None else []) + (["-t", str(t)] if t else []) \
            + ["-i", p, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"]
        return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)

    def rms_db(x):
        return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
    n = pcm(narr, 0, 120)
    fr = n[: len(n) // 4800 * 4800].reshape(-1, 4800)
    speech = fr[20 * np.log10(np.sqrt((fr ** 2).mean(axis=1)) + 1e-12) > -45]
    gain_db = rms_db(speech) - STING_BELOW_VOICE_DB - rms_db(pcm(logo, 1.5, 1.1))
    print(f"sting gain {gain_db:.1f} dB")

    # voice stem: narration with the sting dropped into a gap of exactly the sting's length
    voice = os.path.join(out, "voice.wav")
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", narr, "-i", logo, "-filter_complex",
       f"[0:a]aformat=sample_rates=48000:channel_layouts=mono,asplit[n1][n2];"
       f"[n1]atrim=end={cut:.6f},asetpts=PTS-STARTPTS[p0];"
       f"[n2]atrim=start={cut:.6f},asetpts=PTS-STARTPTS[p2];"
       f"[1:a]aformat=sample_rates=48000:channel_layouts=mono,volume={gain_db:.2f}dB,apad=whole_dur={sd:.6f},atrim=end={sd:.6f}[s];"
       f"[p0][s][p2]concat=n=3:v=0:a=1[o]", "-map", "[o]", "-t", f"{vdur:.3f}", voice)

    # music stem: fade out into the cut, silence for the sting, slow fade back in
    bed = os.path.join(out, "music.wav")
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", music, "-filter_complex",
       f"[0:a]aformat=sample_rates=48000:channel_layouts=stereo,asplit[m1][m2];"
       f"[m1]atrim=end={cut:.6f},asetpts=PTS-STARTPTS,afade=t=out:st={cut - FADE_OUT:.6f}:d={FADE_OUT}:curve=qsin[q0];"
       f"anullsrc=r=48000:cl=stereo,atrim=end={sd:.6f}[q1];"
       f"[m2]atrim=start={cut:.6f},asetpts=PTS-STARTPTS,afade=t=in:st=0:d={FADE_IN}:curve=qsin[q2];"
       f"[q0][q1][q2]concat=n=3:v=0:a=1[o]", "-map", "[o]", "-t", f"{vdur:.3f}", bed)

    mixed = mix(voice, bed, vdur, os.path.join(out, "mix.wav"))
    final = os.path.join(out, "final.mp4")
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", silent, "-i", mixed, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
       "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", final)
    shift_srt(srt, os.path.join(out, "captions.srt"), cut, sd)
    for x in (a, b, c, lst, silent):
        os.remove(x)

    ld = loudness(final)
    checks = {"cut_frame": cf, "cut_s": cut, "sting_s": sd, "video_s": vdur, "final_s": duration(final),
              "length_ok": abs(duration(final) - vdur) < 0.1, "loudness_lufs": ld["lufs"],
              "loudness_ok": abs(ld["lufs"] + 14) <= 1.0, "true_peak_dbtp": ld["true_peak"],
              "true_peak_ok": ld["true_peak"] <= -1.5}
    json.dump(checks, open(os.path.join(out, "sting-checks.json"), "w"), indent=1)
    print(json.dumps(checks, indent=1))


if __name__ == "__main__":
    main()
