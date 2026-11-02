# Visual QA, pass 2: P1 "Why Your Refrigerator Has to Heat Up to Keep Food Cold"

This is the second review, after the re-render. I used the same rubric and the same strictness as pass 1, against the updated `scenes/scenes.json`. Per-scene detail and fixes are in `visual-qa.json`, and the first pass is kept in `visual-qa-pass1.*`. S02 and S29 were judged in full this time, using the real Blender renders.

**Result: 22 PASS, 18 FAIL** (pass 1 was 10 PASS, 30 FAIL).

- **Opening:** the question is spoken and on screen by about 3.0 s.
- **Debug stamp:** no "S01 · board" stamp appears anywhere.
- **Sync:** every "end" frame now shows its own scene, so the drift is fixed.

## What the re-render fixed

The scene-clock and frame-length fixes worked:
- Gauge needles move.
- Bubbles and vapor particles move.
- Refrigerant flows inside the pipes, and no loose drops remain.
- Cuts land on time.

Most specific fixes landed. All 10 pass-1 PASS scenes still pass.

## What remains (cross-cutting)

| Issue | Scenes |
| --- | --- |
| **Hero renders are held stills.** S02 has no push-in. S29 has no heater glow, no melt, no drops and no glass-tube slide. The S29 power lead renders cream, not lime. The S02 overlays are still offset from the panel and grille. | S02, S29 |
| **The new door primitive.** Heat arrows still cross the door panel. The 'door open' label is about 22 px at 1080, under the 34 px minimum. | S05, S27, S37 |
| **Label collisions with outlines or other labels** | S15, S20, S23, S25, S26, S33, S36, S38 |
| **Bottom safe zone,** a few px inside 120 at 1080 | S01, S32, S33 |
| **Loop labels on screen that aren't in the scene's text list** (rubric 1; missed in pass 1) | S23, S39 |

## Pass-1 FAILs: fixed or not fixed

| Scene | Pass 1 | Pass 2 | Status | What's left |
| --- | --- | --- | --- | --- |
| S01 | FAIL | FAIL | not fixed | Wall glow now lands on cue. 'warm outside' is still about 114 px from the bottom. The question text runs about 30 px from the right edge (missed in pass 1). |
| S02 | FAIL | FAIL | not fixed | Real render is a still with no push-in; overlays still misregistered. |
| S05 | FAIL | FAIL | not fixed | Door is drawn now, but the arrows cross the door panel; 'door open' is under 34 px. |
| S09 | FAIL | PASS | fixed | |
| S12 | FAIL | PASS | fixed | Minor: the bubbles are small. |
| S13 | FAIL | PASS | fixed | |
| S14 | FAIL | PASS | fixed | Minor: the leftovers source sits outside the cold zone. |
| S15 | FAIL | FAIL | not fixed | Mechanism fixed; the label still overlaps the chamber border. |
| S17 | FAIL | PASS | fixed | |
| S18 | FAIL | PASS | fixed | |
| S19 | FAIL | PASS | fixed | Minor: arrows are still thinner than flow weight. |
| S20 | FAIL | FAIL | not fixed | Flow and stations fixed; 'EVAPORATOR' is still cut by the zone wall. |
| S21 | FAIL | PASS | fixed | |
| S22 | FAIL | PASS | fixed | |
| S23 | FAIL | FAIL | not fixed | The callback cabinet cuts the 'KITCHEN' label; unlisted dimmed loop labels. |
| S24 | FAIL | PASS | fixed | |
| S25 | FAIL | FAIL | not fixed | Caption fixed; the new gap labels collide with the outlines. |
| S26 | FAIL | FAIL | not fixed | Vent arrow fixed; the thermometer label now overlaps the oven. |
| S27 | FAIL | FAIL | not fixed | Label order and door fixed; 'door open' is under 34 px; FROST and 'below freezing' are crowded; the 0 to 8.3 s stretch can't be verified from the strip. |
| S28 | FAIL | FAIL | not fixed | Arrows are still hairline, end at the frost surface, and have no before state. |
| S29 | FAIL | FAIL | not fixed | Real render is a still; none of the planned changes happen; the lead is not lime. |
| S30 | FAIL | FAIL | not fixed | Clock beat and label height fixed; still about 8.2 s with no change between 2.2 s and 10.45 s. |
| S32 | FAIL | FAIL | not fixed | Moisture now goes into the kitchen; 'condenser' is still about 90 px from the bottom. |
| S33 | FAIL | FAIL | not fixed | Section and beads fixed; the switch label crosses the heater line; bottom labels at about 114 px. |
| S35 | FAIL | PASS | fixed | |
| S36 | FAIL | FAIL | not fixed | Labels and opening fixed; the 'holds more' icons are jammed against the 1,800 label. |
| S37 | FAIL | FAIL | not fixed | Puff, thermometer and door fixed; arrows cross the door panel; 'door open' is under 34 px. |
| S38 | FAIL | FAIL | not fixed | Flow, highlight and extra arrow fixed; the extra-heat label runs into 'KITCHEN'. |
| S39 | FAIL | FAIL | not fixed | Loose dot gone and the condenser-to-wall link works; unlisted, illegible loop labels. |
| S40 | FAIL | PASS | fixed | |

Summary of the 30 pass-1 FAILs: 12 fixed and 18 not fixed. No scene that passed in pass 1 regressed.

## Summary table

| Scene | Verdict | Main reason |
| --- | --- | --- |
| S01 | FAIL | Question text about 30 px from the right edge; 'warm outside' at about 114 px from the bottom |
| S02 | FAIL | Held still with no push-in; overlays offset from panel and grille |
| S03 | PASS | |
| S04 | PASS | |
| S05 | FAIL | Heat arrows cross the door panel; 'door open' under 34 px |
| S06 | PASS | |
| S07 | PASS | |
| S08 | PASS | |
| S09 | PASS | |
| S10 | PASS | |
| S11 | PASS | |
| S12 | PASS | |
| S13 | PASS | |
| S14 | PASS | |
| S15 | FAIL | Label overlaps the chamber border |
| S16 | PASS | |
| S17 | PASS | |
| S18 | PASS | |
| S19 | PASS | |
| S20 | FAIL | 'EVAPORATOR' cut by the zone wall |
| S21 | PASS | |
| S22 | PASS | |
| S23 | FAIL | Callback cabinet cuts 'KITCHEN'; unlisted loop labels |
| S24 | PASS | |
| S25 | FAIL | Gap labels collide with the wall and fridge outlines |
| S26 | FAIL | Thermometer pair and label overlap the oven |
| S27 | FAIL | 'door open' under 34 px; crowded FROST label |
| S28 | FAIL | Hairline arrows stop at the frost surface; no before state |
| S29 | FAIL | Held still: no heater glow, melt, drops or slide; lead not lime |
| S30 | FAIL | About 8.2 s static between heater bars and compressor bar |
| S31 | PASS | |
| S32 | FAIL | 'condenser' label inside the bottom 120 px; weak heat arrow and moisture |
| S33 | FAIL | Switch label crosses the heater line; bottom labels inside 120 px |
| S34 | PASS | |
| S35 | PASS | |
| S36 | FAIL | 'holds more' icons jammed against the 1,800 label |
| S37 | FAIL | Arrows cross the door panel; 'door open' under 34 px |
| S38 | FAIL | Extra-heat label runs into 'KITCHEN' |
| S39 | FAIL | Unlisted, illegible loop labels |
| S40 | PASS | |

## FAIL list in priority order

**P0: a mechanism that isn't shown, or misleading physics**
1. S29: the hero shot is a still. The defrost demonstration (glow, melt, drops, glass tube) never happens, and the lead isn't lime.
2. S02: the hero shot is a still (no push-in), and the warm overlays are misregistered.
3. S28: frost appears to stop heat (thin arrows end at the frost); no before/after.
4. S05: heat appears to pass through the door panel.
5. S37: heat appears to pass through the door panel.

**P1: pacing or rubric 1**
6. S30: about 8.2 s static.
7. S39: unlisted, illegible labels.
8. S23: unlisted labels, and the callback cabinet collides with the loop.

**P2: legibility and layout (mostly one-line moves)**
9. S01: question text near the right edge.
10. S27: 'door open' too small; FROST crowding.
11. S25: gap labels collide with outlines.
12. S26: thermometers overlap the oven.
13. S36: 'holds more' icons jammed against the 1,800 label.
14. S38: label collision with 'KITCHEN'.
15. S33: switch label crosses the heater line; bottom labels low.
16. S15: label overlaps the chamber border.
17. S20: 'EVAPORATOR' cut by the zone wall.
18. S32: 'condenser' label low; weak heat arrow.

For S27 and S30, the strips have no frame between 0.3 s and the first planned cue. If a beat was added that isn't in `changes`/`cues`, add it there so the next strip samples it.
