# P5 QA pass 2 (2026-11-26, independent reviewer, studio release render-2026-12-p5-engine, assets updated 2026-11-26 04:03 UTC, 9:46.0)

Verdict: FAIL (1 should-fix, 5 nits). All 7 pass-1 must-fix items are fixed. One empty-panel run (S65) breaks the 1.5 s rule. Times are video-timeline seconds (narration time plus 3.2 s after the sting at 41.07).
Method: checks.json, independent ebur128 and 0.1 s RMS scan, spectrogram of the loop seam, strips for all 90 scenes (qa_frames.py run on a copy of scenes.json shifted +3.2 s after the sting, because the tool does not know about the sting), 4 fps content-density and 5/20 fps frame-diff scans, faster-whisper small word times (median offset to words.json -0.02 s), SRT parse against narration.txt, tesseract read of the clock every 2 s (every 0.25 to 1 s through 343 to 493), lime pixel scan at 10 fps.
Pass-1 render was overwritten in the release, so a frame-by-frame diff against it was not possible; every pass-1 PASS was re-measured instead (below).

## Pass-1 items
| Item | Result | Evidence |
| --- | --- | --- |
| Blueprint loop seam (270.3 to 276.8) | PASS | checks.json music_gaps [], one loop, 4.0 s crossfade. Own scan: no 0.1 s window below -60 dB anywhere except inside the sting (41.6 to 42.4, intended). Narration gap at 270 to 272 holds the bed at -22 to -24 dB, spectrogram continuous, no restart transient. Listen once. |
| S00f empty ring (26.1 to 29.5) | PASS | Ring only until about 27.0, cylinder draws in by 27.2 on "today" (26.8) and "one cycle" lands at 29.3. Ring-only stretch under 1 s. |
| S56/S57 stop the clock (407.5 to 412.0) | PASS | CLOCK STOPPED at 407.5 (word 407.4), "the four-stroke cycle" at 409.7 (word 409.8), THE OTTO CYCLE at 412.1 (word 412.2). Only a 0.6 s bare patch at 409.1. |
| S63 Beau de Rochas (449.0 to 452.5) | PASS | "1862 / a French engineer" fades in 449.0 (word "1862" 449.4), name card on the name 452.2 (word 452.5). 0.4 s crossfade shows both layers overlapping, brief. |
| S52 firing order (382.2 to 393.8) | PASS | "one pushing" follows the lit piston (4th at 386 to 387, 2nd from 388.0); "squeeze / in / out" sit above their pistons, off the crank bar; no piston over the dial. |
| S38 spark hero (291.8 to 302.7) | PASS | No lime electrode in the hero. Lime pixels exist only at 41.5 to 42.2 (sting), 278.4 to 282.0 (S35 spark), 289.6 to 290.0 (S38 flash), 315 to 316 and 322 to 323 (S41/S42 spark marker), 333.9 to 341.4 (S44 spark marker). All are the spark. Leader lines no longer cross the filled chamber. |
| Clock reads 0.129 | PASS | Reads 0.129 from 348.75 through 490 (S45 end to S67), then S68 starts at 0.129 and runs to 0.171. No 0.128 anywhere. S82 now runs CRANK 720 to 80 to 0 and S83 shows 0, no flip. Never runs backwards. |

## Automated checklist
| Check | Result |
| --- | --- |
| Loudness -14.1 LUFS, true peak -1.7 dBTP (checks.json -1.71), no clipping, LRA 1.7 | PASS |
| Sync, narration gaps over 2.5 s: none | PASS |
| Captions: 254, all one line, max 42 chars, no overlaps, every script word present (1364 of 1364, 0 diffs), start median 0.02 s from the spoken word | PASS |
| Nothing static over 8 s (longest quiet runs 6.0 s at 473 to 479 and 5.6 s at 56.2 to 61.8, both with live content) | PASS |
| Cue timing vs independent whisper times: 199 visible cue changes, 172 land -0.1 to +0.3 s early, 24 land 0.3 to 0.5 s early, 0 late beyond 0.1 s. The 3 above 0.5 s are measurement artefacts (S12 c1 is on "flywheel", S41 c0 is the scene cut, S60 c0 is on "1876"). 20 cues showed no measurable pixel change (tiny label or fade) | PASS (nit) |
| Sting at 41.07, 3.2 s, loudness in range | PASS |
| Colours: orange only heat, flame, exhaust; violet charge; no blue; lime only the spark | PASS (see nit 5) |
| Who-they-were lines (Otto, Langen, Beau de Rochas), credit on S58, S61 | PASS |
| Empty panel or blank card over 1.5 s | FAIL (S65) |
| Thumbnails | NOT PRESENT in the release (3 assets only), cannot check |

## Must-fix
1. 467.5 to 469.8 (S65, "His patent was really about a layered charge of fuel"): 2.25 s of bare slate, only the 12 px caption "Otto, 1877 patent" and the clock; the layered-charge box does not appear until the first cue at 469.4 and the quote card at about 473. Fix: start the "a layered charge" chamber box (or a "1877" title card) at the scene cut, 467.45, on "His patent", and move the first cue from +1.97 s to +0.2 s.

## Nits
1. 73.4 to 74.9 (S06 start, "At this speed"): 1.5 s of clock only before the magnifier. Draw the magnifier on "speed" (73.7).
2. 285.5 to 286.7 (S37 start): 1.2 s bare before BANG; acceptable, could pre-draw the burst.
3. S38 from 295.6: the "flame front" and "wrinkled by swirling air" labels stay with no leader line after the chamber is full, so they float. Fade them with the front at about 295.
4. S52 387.5: "one pushing" sits 3 px from "CRANK 540°" text; S63 "CLOCK STOPPED" touches the right edge of the Beau de Rochas card. Move the label and card 20 px.
5. The cutaway spark-plug electrode is a thin lime line in the 2D cutaway before the spark (S01 to S03, S12 to S16, S32, S55 to S56, S67, S71, S77). look.md line 52 allows it ("electrode tip the only lime"); the pass-1 ask was "lime only at the spark". Michael to decide; to enforce it, draw the tip chalk and flash lime only on the spark cues (S35, S38).
6. Sub-labels under about 34 px (S00c "idle differs by engine", S09, S12 "the flywheel", S75/S76 small captions); carried from P4. Hero 3D is flat grey by showrunner ruling.

## Listen at (video time, whisper low confidence or odd names)
452.5 to 454 "Alphonse Beau de Rochas" (heard "Alponse Beaude Rochard"); 418.8 "Eugen Langen" (p 0.41); 403.7 "thirteen hundredths"; 552.1 "seventeen hundredths" (heard "1700ths"); 220.7 "fourteen" (p 0.03) and 219.4 "Skyactiv"; 188.1 "ten"; 246 to 249 "isooctane / heptane"; 305.6 "twenty-five degrees" (p 0.07); 254.3 "eighty" (p 0.03). Music: 270 to 277 (Blueprint crossfade into Mechanism), and the Mechanism bed under speech 277 to 345 is the quietest section (-22 to -25 dB in gaps).
