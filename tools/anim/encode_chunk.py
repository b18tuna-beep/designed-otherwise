"""Encode one rendered chunk of PNG frames to an exact number of frames.

    python tools/anim/encode_chunk.py <frames_dir> <expected_frames> <out.mp4>

Motion Canvas renders a RANGE of the project; depending on rounding it can emit one frame
more than the range holds. This keeps exactly the first <expected_frames> frames (sorted by
name) and fails if fewer were rendered, so chunks concatenate frame-exactly.
"""
import os
import subprocess
import sys
import tempfile


def main():
    frames_dir, expected, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    frames = sorted(f for f in os.listdir(frames_dir) if f.endswith(".png"))
    print(f"chunk: {len(frames)} frames rendered, {expected} expected")
    if len(frames) < expected:
        raise SystemExit(f"chunk is short: {len(frames)} < {expected}")
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as fh:
        for f in frames[:expected]:
            fh.write(f"file '{os.path.abspath(os.path.join(frames_dir, f))}'\nduration {1 / 30:.10f}\n")
        listing = fh.name
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listing,
                    "-r", "30", "-frames:v", str(expected), "-c:v", "libx264", "-preset", "medium", "-crf", "14",
                    "-pix_fmt", "yuv420p", out], check=True)
    print("wrote", out)


if __name__ == "__main__":
    main()
