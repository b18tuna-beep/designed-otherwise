# Visual QA, pass 8: P1 "Why Your Refrigerator Has to Heat Up to Keep Food Cold"

This pass checks the cue fixes in S23, S30, S32 and S37 on `/tmp/claude-0/final/final.mp4` (465.5 s, with audio), and confirms the other 36 scenes are unchanged. I used the same rubric as before. Pass 7 is kept as `visual-qa-pass7.*`.

**Episode: 40 PASS, 0 FAIL.**

## How it was checked

- **Regressions:** I compared every frame of the new final with every frame of the pass-7 final, at 96x54 greyscale over the full 13,965 frames.
  - 36 scenes are pixel-identical over their whole length. The largest difference is 0.04/255 (S24, encoder noise).
  - The only differences are in S23 (from 11.4 s to the end, the moved cue) and very small ones in S30, S32 and S37 (0.3/255 or less: the moved label and arrow entrances).
- **Audio:** the narration stem is byte-identical to pass 7, so the independent faster-whisper word times from pass 7 still apply.
- **Cues:** each moved cue was checked against those word times, and against the strips in `/tmp/claude-0/qa9`.

## Moved cues

| Scene | Cue | Lands | Word (independent) | Lead | Verdict |
| --- | --- | --- | --- | --- | --- |
| S23 | bars equal, arrows stop, on 'room temperature couldn't' | 242.88 s | room 242.98 s | 0.10 s | PASS |
| S30 | ≈ 450 W on 'four hundred and fifty' | 324.19 s | 450 at 324.32 s | 0.13 s | PASS |
| S30 | ≈ 470 W on 'four hundred and seventy' | 325.36 s | 470 at 325.56 s | 0.20 s | PASS |
| S32 | heat into the pan on 'condenser's warmth' | 354.62 s | condenser's 354.72 s | 0.10 s | PASS |
| S37 | heat into the fridge on 'won't cool' | 426.86 s | won't 426.94 s | 0.08 s | PASS |

More on S23:
- The condenser stays hot with the arrows flowing through "Push it well above room temperature".
- The arrows then stop and the bars settle before the warm-cabinet callback lands (243.86 s).
- The longest stretch without a change is now 6.7 s, under the 8 s limit.

S32 was a pass-7 miss on my side. The old cue (353.22 s) matched the earlier "condenser", about 1.4 s early. The same apostrophe bug broke my own phrase parsing, so pass 7 didn't flag it.

## Audio checks (outside the visual rubric)

`checks.json` now reports a true peak of -1.76 dBTP (the ceiling is -1.5) and -14.16 LUFS (the target is -14). Both are within spec.

## Carried non-blocking notes

- **S19:** the cut comes 0.54 s before "In many fridges".
- **S29:** the glass-tube heater holds for 2 frames before the cut.
- **S24 and S40:** the first cue is clamped to 0.3 s, so it lands about 0.15 s after the first word.
- **S02:** the hand has a dark fill.

## Episode table

| Scenes | Verdict |
| --- | --- |
| S01 to S40 | PASS |
