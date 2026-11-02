# Visual QA, pass 4: P1 "Why Your Refrigerator Has to Heat Up to Keep Food Cold"

This pass judges the 7 pass-3 FAILs and both hero scenes from the final composited picture, `/tmp/claude-0/ep3/episode_comp.mp4`. I used the same rubric and the same strictness. Every margin and colour call was measured on full-resolution 1080p frames pulled with ffmpeg. Pass 3 is kept as `visual-qa-pass3.*`.

**Pass 4 (9 scenes): 5 PASS, 4 FAIL.**
**Episode: 36 PASS, 4 FAIL (S20, S26, S27, S29).**

## Re-judged scenes

| Scene | Pass 3 | Pass 4 | Status | Notes |
| --- | --- | --- | --- | --- |
| S02 | FAIL | PASS | fixed | Real render with a push-in (about 11%). The hand lands on cue. The warm overlay is registered to the side panel, and the grille glow lands on cue. Minor: the hand is dark-filled. |
| S05 | FAIL | PASS | fixed | Door label is above the door and clear of all outlines; the heat arrows enter the opening |
| S20 | FAIL | FAIL | not fixed | EVAPORATOR clears the zone wall but starts at x=79 (safe margin is 96) |
| S26 | FAIL | FAIL | not fixed | Labels share one baseline and clear the oven, but 'condenser' starts at x=87 at the end of the push |
| S27 | FAIL | FAIL | not fixed | 'door open' clears the outlines but starts at x=66 |
| S29 | FAIL | FAIL | not fixed | Mechanism now shown, but the frost is cyan rather than chalk-white, picks up a violet-adjacent pink cast, and the slide comes about 2 s early |
| S32 | FAIL | PASS | fixed | 'condenser' sits outside the cabinet with a hairline leader |
| S37 | FAIL | PASS | fixed | |
| S38 | FAIL | PASS | fixed | The arrow runs below the pipe; the label is 129 px from the bottom |

## FAIL list with one-line fixes (priority order)

1. **S29: frost colour.** At the start of the shot the frost is saturated cyan (about #54DEFD), not a chalk-white deposit with a thin blue edge. It looks like bare metal and doesn't match S28's chalk frost at the cut. Under the glow it also picks up a pink/lavender cast near the refrigerant violet. The slide to the glass tube starts at about 7.2 s, roughly 2 s before 'glass tube' at 9.19 s. **Fix:** give the frost a chalk (#ECE7DC) low-specular material with a thin cold-blue fresnel rim, so the fill light can't tint it and the heater light can't turn it pink. Start the slide at about 8.9 s, and fade 'DEFROST HEATER' out before the slide begins.
2. **S27:** 'door open' starts at x=66. **Fix:** clamp the door label so it starts at x of 96 or more (here, shift it about 35 px right or centre it over the door panel). Apply the clamp in the shared door primitive.
3. **S20:** EVAPORATOR starts at x=79. **Fix:** move it about 20 px right so it starts at x of 96 or more.
4. **S26:** 'condenser' starts at x=87 at the end of the push. **Fix:** move the thermometer pair about 20 px right (to -720 and -560).

S20, S26 and S27 are each a single offset change; the cause is a missing safe-margin clamp. Adding one clamp to the label layout helper (keep every glyph at x of 96 or more and x of 1824 or less) would fix all three, and stop the same problem coming back elsewhere.

## Episode table

| Scenes | Verdict |
| --- | --- |
| S01 to S19, S21 to S25, S28, S30 to S40 | PASS |
| S20, S26, S27, S29 | FAIL |
