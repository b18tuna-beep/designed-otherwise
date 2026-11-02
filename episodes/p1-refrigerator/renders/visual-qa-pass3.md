# Visual QA, pass 3: P1 "Why Your Refrigerator Has to Heat Up to Keep Food Cold"

This pass re-judges the 16 non-hero scenes that failed pass 2, from the new render `/tmp/claude-0/ep2/episode.mp4`. I used the same rubric and the same strictness. Each borderline call was checked on a full-resolution 1080p frame pulled from the episode with ffmpeg.

S02 and S29 are waiting on the hero re-render, so their pass-2 FAILs carry over unjudged. The other 22 scenes passed in pass 2 and carry over. Pass 2 is kept as `visual-qa-pass2.*`.

**Pass 3 (16 scenes): 9 PASS, 7 FAIL.**
**Episode now: 31 PASS, 9 FAIL** (7 from this pass, plus S02 and S29 pending).

The new "mid" samples show no stretch over 8 s without a change in any re-judged scene. The S27 opening and the S30 heater beats are confirmed.

## Pass-2 FAILs re-judged

| Scene | Pass 2 | Pass 3 | Status | Notes |
| --- | --- | --- | --- | --- |
| S01 | FAIL | PASS | fixed | Question ends 120 px from the right edge; 'warm outside' is 135 px from the bottom |
| S05 | FAIL | FAIL | not fixed | Door now hinges away from the arrows, and the arrows read as entering the opening; the 'door open' label overlaps the door's top edge |
| S15 | FAIL | PASS | fixed | |
| S20 | FAIL | FAIL | not fixed | The zone wall moved but still cuts 'EVAPORAT|OR' |
| S23 | FAIL | PASS | fixed | Loop labels hidden; callback is clear of the loop |
| S25 | FAIL | PASS | fixed | Gap labels sit inside the box with hairline leaders |
| S26 | FAIL | FAIL | not fixed | Oven overlap fixed; 'condenser' now starts 45 px from the left edge at the end of the push |
| S27 | FAIL | FAIL | not fixed | Cadence and FROST spacing fixed; the 'door open' label overlaps the door corner and starts 51 px from the edge |
| S28 | FAIL | PASS | fixed | Full arrows reach into the coil, then thin; the before/after reads |
| S30 | FAIL | PASS | fixed | New beats land at 5.5, 8.1 and 10.5 s |
| S32 | FAIL | FAIL | not fixed | The label moved out of the bottom zone but now sits on the compartment divider line |
| S33 | FAIL | PASS | fixed | Switch is above the panel; lowest label is 127 px from the bottom |
| S36 | FAIL | PASS | fixed | |
| S37 | FAIL | FAIL | not fixed | Arrows and puff are fine; the 'door open' label overlaps the door corner |
| S38 | FAIL | FAIL | not fixed | Labels are separated, but the extra-heat label ends 116 px from the bottom (4 px inside the zone) |
| S39 | FAIL | PASS | fixed | |

## FAIL list with one-line fixes (priority order)

1. **S05, S27, S37** (shared door primitive): the 'door open' label overlaps the door's top edge or hinge corner, and in S27 it starts 51 px from the frame edge. **Fix:** anchor the label above the door's free outer edge, at least 24 px from any outline and at least 96 px from the frame edge.
2. **S32:** the compartment divider line strikes through 'condenser'. **Fix:** put the label below the condenser body, at least 12 px clear of the divider and the base, or outside the cabinet.
3. **S20:** the dashed zone wall still cuts 'EVAPORATOR'. **Fix:** move the wall to about x=-130 in loop space (at least 24 px past the label), or end the label 24 px before the wall.
4. **S26:** at the end of the push, 'condenser' starts 45 px from the left edge. **Fix:** shift the thermometer pair about 60 px right (there is room before the oven) and put both labels on one baseline.
5. **S38:** the extra-heat label sits 116 px from the bottom, and the extra arrow starts on the bolt and crosses the pipe. **Fix:** raise the label at least 10 px; start the arrow 12 px right of the bolt and route it below the pipe.

**Pending:** S02 and S29 (hero 2 re-render).

## Episode table

| Scene | Verdict | Judged in |
| --- | --- | --- |
| S01 | PASS | pass 3 |
| S02 | FAIL | pass 2 (pending hero re-render) |
| S03, S04, S06 to S14, S16 to S19, S21, S22, S24, S31, S34, S35, S40 | PASS | pass 2, carried over |
| S05 | FAIL | pass 3 |
| S15 | PASS | pass 3 |
| S20 | FAIL | pass 3 |
| S23 | PASS | pass 3 |
| S25 | PASS | pass 3 |
| S26 | FAIL | pass 3 |
| S27 | FAIL | pass 3 |
| S28 | PASS | pass 3 |
| S29 | FAIL | pass 2 (pending hero re-render) |
| S30 | PASS | pass 3 |
| S32 | FAIL | pass 3 |
| S33 | PASS | pass 3 |
| S36 | PASS | pass 3 |
| S37 | FAIL | pass 3 |
| S38 | FAIL | pass 3 |
| S39 | PASS | pass 3 |
