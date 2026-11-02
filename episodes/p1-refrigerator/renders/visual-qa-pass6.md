# Visual QA, pass 6 (final): P1 "Why Your Refrigerator Has to Heat Up to Keep Food Cold"

This pass judges the last open scene, S26, on the final picture `/tmp/claude-0/ep5/episode_comp.mp4`, using the same rubric and the same strictness. Measurements come from full-resolution 1080p frames at 5.3, 8.0 and 10.8 s into the scene. Pass 5 is kept as `visual-qa-pass5.*`.

**Episode: 40 PASS, 0 FAIL.**

## S26

| Check | Result |
| --- | --- |
| Gap between 'condenser' and 'room air' | 33 px at all three times (at least 24 required); one shared baseline |
| Left margin, end of push (10.8 s) | 'condenser' starts at x=108; leftmost content (heating vent) at x=96 |
| Bottom margin | 205 px or more |
| 'room air' to oven outline | 15 px clear, no overlap (minor: 20 px or more would be more comfortable) |

Verdict: **PASS** (was FAIL in pass 5).

## History

| Pass | PASS | FAIL |
| --- | --- | --- |
| 1 | 10 | 30 |
| 2 | 22 | 18 |
| 3 | 31 | 9 |
| 4 | 36 | 4 |
| 5 | 39 | 1 |
| 6 | 40 | 0 |

Non-blocking notes on passing scenes are kept in `visual-qa.json` (for example, the S02 dark-filled hand, and in S29 the copper-brown unlit rod and the grey background).
