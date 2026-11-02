# Visual QA: P1 "Why Your Refrigerator Has to Heat Up to Keep Food Cold"

Independent review of the 40 frame strips against `scenes/scenes.json`, `style/style-bible.md` (section 3) and `research/factcheck.json`. Details and fixes per scene are in `visual-qa.json`.

**Result: 10 PASS, 30 FAIL.**

Opening check: the question is spoken and fully on screen by about 3.0 s (S01). Passes the 10 s rule.
No "S01 · board" debug stamp appears in any strip.
S02 and S29 were judged on their 2D overlays only (placeholder stills).

## Cross-cutting issues (fix once, clears many scenes)

| # | Issue | Scenes |
| --- | --- | --- |
| X1 | **Sync drift.** From S14 on, every "end" frame (taken about 0.2 s before the cut) already shows the next scene, and by S30 the next scene is up at least 0.4 s early. S01 to S13 are clean. This looks like per-scene frame counts being floored (`floor(duration*30)`) and the errors adding up, about half a frame per scene, so roughly 0.6 s early by S40. Build scene boundaries from absolute times (`round(start*30)`) so visuals land 2 to 4 frames before the word, as specified. This also explains the late beats that get cut off in S30 (clock) and S36 (bigger fridge). | S14 to S40 |
| X2 | **Refrigerant drawn outside the pipe.** The loop's tracked drop sits loose in the middle of the loop or on a heat arrow, and no particles move along the pipes. The path parameter is probably unset and falling back to the centre. | S20, S38, S39 |
| X3 | **Boiling and vapor primitives.** Boiling is drawn as one dark dot and vapor as plain pipe fill. The style bible asks for violet bubbles in violet liquid, and vapor as spaced, moving violet particles. | S12, S13, S14, S15, S17, S18, S19 |
| X4 | **Gauges have no needles,** so none of the pressure changes are visible. | S12, S18 |
| X5 | **Open door is a stray diagonal line,** drawn on a different side in different scenes. It doesn't read as a door, and the heat arrows meet the wall instead of an opening. | S05, S27, S37 |
| X6 | **Bottom safe area.** Labels, captions and bar baselines sit about 45 to 115 px from the bottom edge. The shared cutaway's base also sits low. | S01, S09, S21, S25, S26, S30, S32, S36, S40 (also minor in S08, S34) |

## Summary table

| Scene | Verdict | Main reason |
| --- | --- | --- |
| S01 | FAIL | 'warm outside' 45 px from bottom; walls glow from frame 1, so the 'heat up' change never happens |
| S02 | FAIL | Warm overlay not registered to the side panel (overhangs into background); grille glow in bottom zone |
| S03 | PASS | (minor: qualifier slightly under label size) |
| S04 | PASS | |
| S05 | FAIL | Door is a stray line; heat arrows end on the closed side wall (reads as heat through the insulated wall) |
| S06 | PASS | |
| S07 | PASS | |
| S08 | PASS | (minor: cutaway base low) |
| S09 | FAIL | Clausius caption in bottom zone at under 34 px; last 6.5 s ('takes work') has no visual |
| S10 | PASS | |
| S11 | PASS | |
| S12 | FAIL | Gauges without needles; boiling is one dot |
| S13 | FAIL | Flask 'boils' is one dot hovering above the liquid |
| S14 | FAIL | No visible boiling or vapor; leftovers/walls/door heat sources not drawn as sources |
| S15 | FAIL | Piston squeezes vapor away from the outlet; no packed vapor or heat halo on the outlet; label overlaps chamber |
| S16 | PASS | |
| S17 | FAIL | Passes are not one connected path; no vapor particles; 'vapor turns to liquid' missing |
| S18 | FAIL | No low-pressure gauge; no needle; bubbles are one dot |
| S19 | FAIL | 'solder joint' 24 px from right edge; heat arrows hairline |
| S20 | FAIL | Refrigerant dot loose in the loop centre; stations pre-lit; bolt near bottom |
| S21 | FAIL | Bar labels in bottom zone |
| S22 | FAIL | 1.4 to 2 range shows before the 0 to 1.4 bar (reads as a 0.6 bar) |
| S23 | FAIL | Callback cabinet overlaps the loop and runs off the bottom |
| S24 | FAIL | Run-time bar is lime (electricity only) |
| S25 | FAIL | Caption in bottom zone; GE gap marks unreadable |
| S26 | FAIL | Vent heat arrow passes through the oven; labels in bottom zone |
| S27 | FAIL | About 8.3 s with no change; FROST label before frost; stray-line door; frost hides coil |
| S28 | FAIL | Heat arrows stop short of the coil (frost looks like a full block) |
| S29 | FAIL | 'DEFROST HEATER' overlay not in allowed text; sits on a falling drop |
| S30 | FAIL | About 8.2 s static after heater bars; 'runs for minutes, then off' clock never shown; labels in bottom zone |
| S31 | PASS | (minor: first tick at 0 h) |
| S32 | FAIL | Evaporating moisture rises inside the fridge compartment |
| S33 | FAIL | Section missing at 'warm the edges'; beads float in space instead of on the face |
| S34 | PASS | (minor: number order vs lighting order) |
| S35 | FAIL | About 7.4 s blank board with stray lime hairline; 363 label late; blank before cut |
| S36 | FAIL | Labels in bottom zone; 'hold more' icon never appears; 3.8 s blank open |
| S37 | FAIL | Blue puff never shown; stray-line door; heat arrow crosses cabinet wall; room thermometer starts orange |
| S38 | FAIL | Loose refrigerant dot; 'flow highlights' change missing; extra arrow not born at the compressor |
| S39 | FAIL | Refrigerant dot on a heat arrow; side tubing pre-lit; no link from condenser to side-wall tubing |
| S40 | FAIL | Wordmark and 'Next time' in bottom zone; 'Next time' under 34 px |

## FAIL list in priority order

**P0: misleading physics, broken color meaning, or text that isn't allowed**
1. S28: heat arrows stop short of the frosted coil, so frost reads as a complete block.
2. S32: evaporating meltwater rises into the fresh-food compartment.
3. S05: heat enters through the closed side wall, not the open door.
4. S37: inbound heat crosses the cabinet wall; the puff is missing; the room thermometer starts hot.
5. S39: refrigerant on a heat arrow; the side-wall warmth is not tied to the condenser.
6. S20: refrigerant sits loose in the loop centre (X2).
7. S38: refrigerant sits loose in the loop centre; the extra heat is not tied to the electricity.
8. S15: compressor squeezes vapor away from its outlet; no hot packed vapor leaves.
9. S22: the build order makes the COP bar read as 0.6 for about 2.5 s.
10. S24: lime used for something other than electricity.
11. S29: an on-screen label is not in the allowed text.

**P1: the mechanism is not demonstrated or a beat is missing**
12. S14: evaporator boiling, vapor and heat sources (X3).
13. S12: gauges and boiling (X3, X4).
14. S18: gauges and boiling (X3, X4).
15. S17: condenser path and phase change.
16. S13: flask boiling.
17. S19: heat handoff arrows unreadable; label at the frame edge.
18. S33: section and condensation not on the surface.
19. S30: static stretch over 8 s; clock beat missing.
20. S27: static stretch over 8 s; frost and door drawing.
21. S35: blank opening; late label.
22. S36: missing 'hold more' beat; blank opening.

**P2: legibility and layout**
23. S23: callback overlaps the loop and runs off frame.
24. S01: bottom label; the opening beat of the walls is pre-lit.
25. S09: caption placement and size; final line has no visual.
26. S26: arrow through the oven; bottom labels.
27. S02: overlay registration (redo when the real render lands).
28. S21, S25, S40: bottom safe area (X6).

Fix X1 (sync drift) before re-cutting anything, since it moves every later beat.
