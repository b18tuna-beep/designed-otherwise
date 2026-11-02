# Visual QA, pass 7 (narration v2 regression): P1 "Why Your Refrigerator Has to Heat Up to Keep Food Cold"

This pass re-checks all 40 scenes on the final assembled video, `/tmp/claude-0/final/final.mp4` (465.5 s, with audio), after the 3:47 line changed to "So here's the missing context to the title." I used the same rubric as before. Pass 6 is kept as `visual-qa-pass6.*`.

**Episode: 37 PASS, 3 FAIL (S23, S30, S37).**

None of the three FAILs is caused by the new line. They are cue-timing misses from a parser bug in `board/build_scenes.py` that has been in every pass. My earlier passes sampled frames only at the planned cues and never checked the cues against the audio, so I missed them.

## How it was checked

- **Cuts:** I detected the actual cut frame in the video for all 39 cuts and compared each with `round(start*30)`. Every cut is within 1 frame of plan.
- **Words:** I transcribed the clean narration stem (`/tmp/claude-0/final/narration.wav`) independently with local faster-whisper (small.en), then measured each cut's lead before its anchor word and checked every cue against its quoted phrase.
- **Regressions:** I compared every scene frame-by-frame with the pass-6 composite (`ep5/episode_comp.mp4`) at matched scene-relative times (cut, each cue + 0.9 s, mid, end).
  - All 38 2D scenes are pixel-identical to pass 6 (mean difference 1.2/255 or less).
  - The only real picture change is S29, from the 4-frame head skip.
- **Opening:** the question is spoken 0.0 to 2.9 s and fully on screen at 3.0 s. The 10 s rule holds.

## Root cause behind all three FAILs

In `build_scenes.py`, a change's phrase is found with `r"on '([^']+)'"`. That regex stops at the first apostrophe, so `'room temperature couldn't'` becomes "room temperature couldn" and `'won't cool'` becomes "won". Separately, the S30 phrases `'450'` and `'470'` are digits, but the script spells the numbers out. In every one of these cases the builder silently falls back to spreading cues evenly through the scene.

**Fix:** change the regex to `r"on '(.+)'$"`, write the S30 phrases as spoken (or match digits to number words), and make the builder print a warning on any fallback. Then rebuild `scenes.json` and the 2D layer.

## FAIL list with one-line fixes

1. **S23:** "bars equal and arrows stop" lands at 238.20 s, 4.8 s before "room temperature couldn't" (242.98 s). The condenser cools and the arrows stop while George says "Push it well above room temperature", so the picture contradicts the line. **Fix:** with the regex fix, the cue lands at about 242.88 s.
2. **S30:** "≈ 470 W" appears 1.1 s after "470" is spoken, and after "watts". **Fix:** use spoken-form phrases (or digit matching); the cue lands at about 325.48 s.
3. **S37:** the heat arrow into the fridge lands 2.2 s after "won't cool", on "heat it pulls out". **Fix:** with the regex fix, the cue lands at about 426.86 s. Alternatively, change the board phrase to "heat it pulls out" if that beat reads better.

## Verified, non-blocking

| Scene | Finding |
| --- | --- |
| S22 | Cut is 0.20 s before "On"; cues land 0.10 to 0.22 s before their words. PASS |
| S23 (new line) | Cut is 0.10 s before "So". Cues 1, 2 and 4 land 0.1 s before their words. Only cue 3 fails (above). |
| S29 | Glow is ~70% up by "electric heater". Melt starts on "mounted". The slide starts on "glass" and settles at frame 304 of 306, so it holds for 2 frames. The scene got 4 frames shorter, which used up most of the head skip. PASS |
| S19 | Regression: the cut now leads "In many fridges" by 0.54 s (16 frames), up from 0.24 s in pass 6. The cause is a low-confidence "In" (p = 0.41) in the re-timed words.json. The cut falls in silence after "boil again". This is similar to the existing leads in S11 (0.52 s) and S09 (0.46 s). Optional fix: pin the start to about 192.55 s, or guard low-confidence first words in the builder. PASS |
| S24, S40 | The first cue is clamped to 0.3 s, so it lands about 0.15 s after the first word. This is unchanged since pass 1. PASS |

## Outside the visual rubric

`/tmp/claude-0/final/checks.json` reports a true peak of -1.34 dBTP and marks it ok. The style target is -1.5 dBTP, so it is 0.16 dB over.

## Episode table

| Scenes | Verdict |
| --- | --- |
| S01 to S22, S24 to S29, S31 to S36, S38 to S40 | PASS |
| S23, S30, S37 | FAIL |
