# P5 QA pass 3 (2026-11-26, independent reviewer, studio release render-2026-12-p5-engine, re-assembled by run 45854680835, assets 2026-11-26 16:13 UTC, 9:46.0)

Verdict: PASS for the five qa-2 fixes and every qa-2 pass. 0 must-fix. 2 new nits found in scenes the editor did not touch (S35, S00f), plus the open qa-2 nits. Times are video-timeline seconds (narration time plus 3.2 s after the sting at 41.07).
Method: checks.json, independent ebur128, SRT parse against narration.txt, qa_frames.py --checks (90 strips, all viewed), 4 fps content-density and frame-diff scans of the whole video, 20 fps diff on S06, full-res frames every 0.5 to 1 s through the five changed spans, tesseract read of the clock every 2 s, 5 fps lime and blue pixel scan, faster-whisper small word times (1346 words, median probability 0.99). The qa-2 render is gone from the release, so a frame diff against it was not possible. Instead the fix commit 76b5b95 was read: it touches only S06 (cue), S38 and S52 and S63 (anim2/anim3), S65 (cue), so no other scene's code changed.

## Requested checks
| Item | Result | Evidence |
| --- | --- | --- |
| S65 at 467.45, layered-charge box at the cut | PASS | Cut 467.45. First 0.35 s is the clock and caption only; the box fades in from 467.8 (word "patent" 467.8, "His" 467.6) and is fully on by 468.5. Bare run about 0.4 s, far under 1.5 s. Box stays to the quote card at about 473. Whole-video bare-run scan: longest run under 1.5 s is S37 285.5 to 286.75 (qa-2 nit 2, BANG pre-roll). |
| S38 leaders (291.7 to 299.5) | PASS | "kernel", "flame front" and "wrinkled by swirling air" each have a leader line on every sampled frame from 292.5 to 299.4. The flame-front line ends on the ball edge as it grows (292.5, 293.5, 294.5, 295.5) and on the chamber wall once full (297.5 to 299.4). "wrinkled" fades in at 293.4 (word "Wrinkled" 293.4). No floating labels. No lime in the hero (lime only at 41.6 to 42.0 sting, 278.4 to 279.0 S35, 289.6 to 290.0 S38 flash). |
| S52 "one pushing" vs clock (385.9 to 390.6) | PASS | "one pushing" right edge x 1331 (1080p), clock "CRANK 540" text starts x 1386: 55 px clear, different row. Follows the lit piston (4th 385.8 to 387.0, 2nd from 388.0). squeeze/in/out clear of the clock and the bar. |
| S63 card and 1862 vs clock (448.9 to 459.3) | PASS | Card right edge x 1231, "CLOCK STOPPED" starts x 1259: 28 px gap (was touching). 1862 and "a French engineer" fade in at 449.0 to 449.6 (word "1862" 449.4). Card on the name 452.5 (word 452.46). Tight but clear. |
| S06 magnifier on "at this speed" | PASS | Words: "At" 73.54, "this" 73.74, "speed" 73.94. Scene cut 73.39. Magnifier starts drawing at 73.8, fully drawn 74.3. Bare clock-only run 73.39 to 73.8 (0.4 s, was 1.5 s). |
| Nothing from qa-2 regressed | PASS | See below. |
| No new text cut off or overlapping | PASS for the changed spans; 2 older nits below | |

## qa-2 passes re-measured
| Item | Result | Evidence |
| --- | --- | --- |
| Loudness | PASS | -14.1 LUFS, LRA 1.7, true peak -1.7 dBTP (checks.json -1.71), sample peak -1.6, no clipping |
| Sync / narration gaps | PASS | checks.json sync_ok, narration_gaps_over_2_5s [], music_gaps [] |
| Captions | PASS | 254, all one line, max 42 chars, no overlaps, 1364 of 1364 script words present, 0 diffs |
| Blueprint loop seam 270 to 277 | PASS (listen once) | checks.json one loop, 4.0 s crossfade; unchanged by this fix |
| Sting | PASS | cut 41.07, 3.2 s, -14.1 LUFS, -1.71 dBTP |
| Static over 8 s | PASS | longest 473.0 to 479.0 (6.0 s, live content) |
| Empty panel over 1.5 s | PASS | none (qa-2 S65 fixed) |
| Clock | PASS | Monotonic, never backwards. 0.000, 0.005 (80 s), 0.043 (86), 0.086 (176), 0.129 from 348 to 488 (no 0.128), 0.171 from 500; S82 runs CRANK 720 to 80 to 0 |
| Colours | PASS | Lime only at sting, S35 spark, S38 flash. No blue. Orange only on flame, heat, exhaust |
| S00f ring, S56/S57 stop the clock, who-they-were lines, credit on S58/S61 | PASS | Seen in strips, same as qa-2 |
| Cue timing | PASS | scenes.json cue changes between passes are only S06 (1.23 to 0.3 narr.) and S65 (1.97 to 0.3), both checked against whisper above. Other cues unchanged from qa-2's 199-cue check. |
| Thumbnails | NOT PRESENT | release has 3 assets only (video, captions, checks) |

## Nits (none block)
1. S35 278.1 to 282.0: "SPARK" label (lime) is overlapped by the translucent box of "a few tens of degrees early"; the bottom of the letters is cut. Not in the editor's changed spans and not flagged in qa-2, so it is either missed or older. Fix: move the "a few tens of degrees early" caption down about 16 px (or "SPARK" up 16 px) in the S35 scene in anim.
2. S00f 29.0 to 35.2: "one cycle" is drawn over the flywheel rim and tick marks, so the rim line runs through the text. Fix: move the label down about 40 px, below the flywheel.
3. Carried: S37 285.5 to 286.75 is 1.25 s bare before BANG (acceptable). The thin lime spark-plug electrode in the 2D cutaway (look.md allows it) is a Michael decision. Sub-labels under about 34 px (S00c, S09, S12, S75/S76) carried from P4.
4. S63 card to clock gap is 28 px at 1080p. Passes, but any further widening of the card would touch again.

## Listen at (video time)
New beyond qa-2: 73.5 to 74.5 (S06 "At this speed" with the magnifier now drawing on "speed"); 467.4 to 470 (S65 box on "His patent", label "a layered charge" is on 1 s before the words "layered charge" at 469.5; check it does not feel early); 449.0 to 452.5 (S63 1862 then name card, unchanged timing but moved 20 px).
From qa-2 (whisper low confidence this pass too): 452.5 "Alphonse Beau de Rochas" (heard "Alponse Beaude"); 418.8 "Eugen Langen"; 403.7 "thirteen hundredths"; 220.7 "fourteen" (p 0.03) and 219.4 "Skyactiv"; 247.7 "one" and 254.3 "eighty" (p 0.03); 188.1 "ten"; 305.6 "twenty-five degrees" (p 0.07); 246 to 249 "isooctane / heptane"; 380.6 "one" in the firing order (p 0.2); 393.0 "hundred" (p 0.23). Music: 270 to 277 (Blueprint into Mechanism crossfade).
