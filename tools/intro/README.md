# THE HINGE: the Designed Otherwise intro

One 3.2 s sting (96 frames, 30 fps) used unchanged in **every** long video (Michael 2026-11-02: one intro for all videos, nothing episode-specific). Concept and storyboard from the ChatGPT brand brief Michael commissioned on 2026-11-02 ("The Hinge"); the per-episode schematic in that brief was replaced by one fixed "ordinary machine" so the intro never changes.

| Frames | What happens | Sound |
| --- | --- | --- |
| F0-8 | An ordinary appliance box traces in, chalk, on a faint drafting grid | graphite contact |
| F9-26 | Inside it: power in (lime), the working loop (violet), heat out (one orange arrow). True of every machine on the channel; color meanings unchanged | dry tick at F9 |
| F27-44 | The box shrinks to 58% and fades behind the chalk door frame, which traces then fills; the blue door sits closed in the doorway | alignment click at F27 |
| F45-62 | The door swings open on its hinge (fast start, firm stop, no bounce); orange revealed by a flat mask; violet threshold in the last 6 frames | E4 felt mallet at 1.5 s, faint hinge |
| F63-71 | DESIGNED / OTHERWISE reveals through one horizontal mask | A3 mallet + latch at 2.1 s |
| F72-95 | Static hold. Hard cut to the episode at F96 | natural decay |

Placement: right after the cold open, on the scene boundary after its last line (P1: 26.51 s). Narration resumes immediately after the cut.

## Build
```
python tools/intro/hinge.py out/frames                 # 96 PNG frames + still.png (F72, for end screens)
python tools/intro/hinge.py out/endcard --format vertical-end   # 2 s Shorts end card (60 frames)
python tools/intro/sonic_logo.py out/logo.wav [--short]          # original synthesis, no samples, no license line
ffmpeg -framerate 30 -i out/frames/f%04d.png -i out/logo.wav -filter_complex "[1:a]volume=-3dB[a]" -map 0:v -map "[a]" \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest sting.mp4
python tools/intro/insert_sting.py episode.mp4 captions.srt <cut_s> sting.mp4 out/   # splices, shifts captions, checks loudness
```
Chapters after the cut move by 3.2 s. The Shorts end card goes at the END of a Short, never the start.
