# Visual QA, pass 5: P1 "Why Your Refrigerator Has to Heat Up to Keep Food Cold"

This pass judges the four pass-4 FAILs (S20, S26, S27, S29) and confirms S02, using the final composited picture `/tmp/claude-0/ep4/episode_comp.mp4`. S29 was re-judged after the re-composite of 2026-10-28 10:37 that moved its glass-tube label. I used the same rubric and the same strictness. Every margin, gap and colour call was measured on full-resolution 1080p frames pulled with ffmpeg. Pass 4 is kept as `visual-qa-pass4.*`.

**Episode: 39 PASS, 1 FAIL (S26).**

## Re-judged scenes

| Scene | Pass 4 | Pass 5 | Status | Notes |
| --- | --- | --- | --- | --- |
| S02 | PASS | PASS | confirmed | Unchanged on the regenerated strip |
| S20 | FAIL | PASS | fixed | EVAPORATOR is centred above the coil, inside the safe area and clear of the zone wall |
| S26 | FAIL | FAIL | not fixed | Margin fixed (x=96), but 'condenser' and 'room air' are now only about 8 px apart and read as one phrase |
| S27 | FAIL | PASS | fixed | Leftmost content is at x=118; 'door open' is clear of the outlines |
| S29 | FAIL | PASS | fixed | See below |

### S29 detail

What now passes:
- The frost is a chalk-white deposit with a cold-blue rim, as in S27 and S28 at the cut.
- There is no pink or violet cast.
- The lime lead is correct, and the glow ramps in on 'electric heater'.
- The frost melts bottom-up and exposes the blue fins, and meltwater drops fall.
- There is no refrigerant flow or airflow while the heater glows.
- The camera holds on the rod until about 9.4 s.
- 'glass-tube heater' now sits centred below the tube: about 120 px clear of it and 190 px from the bottom.

Non-blocking notes:
- The label starts fading in (~9.2 s) while the rod and falling drops are still on screen.
- The variant settles only about 1 frame before the cut.
- The unlit rod renders copper-brown before the heater is on.
- The background is neutral grey rather than slate.

## FAIL list with one-line fix

1. **S26:** the thermometer labels are about 8 px apart and read as 'condenser room air'. **Fix:** put at least 24 px between them. Either place the thermometers at -720 and -545 and narrow the oven to 170 px (left edge -465), or stack each label under its own bulb.

## Episode table

| Scenes | Verdict |
| --- | --- |
| S01 to S25, S27 to S40 | PASS |
| S26 | FAIL |
