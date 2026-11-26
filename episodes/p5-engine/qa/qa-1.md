# P5 QA pass 1 (2026-11-25, independent reviewer, alpha cut 9:46.0, studio release render-2026-12-p5-engine)

Verdict: NOT READY for Michael. 1 blocker, 6 should-fix, 5 nits. Times are on the final video timeline (narration times plus 3.2 s after the sting at 0:41.07).
Method: frame grabs of all 90 scenes (3 per scene) plus full-size grabs of S38, S52, S58; ffmpeg loudness per 15 s, narration-gap loudness (81 gaps), silencedetect, spectrogram around the loop, 5 fps frame-diff static scan, blank-card scan, caption parse, clock read at every scene.

## Automated
| Check | Result |
| --- | --- |
| Loudness -14.1 LUFS, true peak -1.83 dBTP, no clipping (checks.json, re-measured: every 15 s window -13.8 to -14.5) | PASS |
| Sync, no narration gap over 2.5 s | PASS |
| Captions: 254, all one line, max 42 chars, no overlaps | PASS |
| Nothing static over 8 s (frame-diff scan: no run of 6 s or more) | PASS |
| Sting at the end of the cold open, 0:41.07 (3.2 s) | PASS |
| Hook first, no photo opener, 1 s beat after first line (0.8 s clean gap at 3.9 s plus margins) | PASS |
| Every named person has a who-they-were line (Otto "German gas-engine builder", Langen "Otto's partner", Beau de Rochas "French engineer", 1862) | PASS |
| Colours: orange only heat/flame/bill; violet charge; no cold blue; arrowheads only on heat (S69, S75) | PASS |
| Lime only for the spark | FAIL (nit-level, see #5) |

## Editor's open items
| Item | Result | Evidence |
| --- | --- | --- |
| Blueprint loop seam | FAIL (blocker) | 267.06 to 267.61: 0.55 s of digital silence (-77 to -97 dB) in the narration gap, then a hard transient at 267.6 and the track restarts from its intro for 6 s until Mechanism takes over at 273.6. Audible dropout then a restart. |
| Music gain_db not applied | PASS with note | Per-gap bed level is -17 to -20 LUFS in every section; no cue stands out as too loud. Station Wagon Sunday (+2 intended) and Kitchen Table Hymn (-1 intended) sit level with the rest. Mechanism (273.6 to 341.4) is the quietest, gaps -22 to -25, about 3 to 5 dB under its neighbours: acceptable for tension, but listen once. Stems are not separable, so the bed-to-voice ratio under speech is an estimate: listen at 298.7, 504.2, 540.9 where the bed in the gap is loudest. |
| S38 hero overlay labels | PASS with notes | Readable (about 30 px, plates). Leader lines "flame front" and "wrinkled by swirling air" keep pointing at the chamber edges after the front has filled the chamber (292 to 296 s). The spark plug electrode is a large permanent lime bar before and after the spark. |
| S52 hero overlay labels | FAIL (should-fix) | 379 to 390.6: "one pushing" sits at the right piston while the lit piston is the third; "each on a different stroke" and "in . squeeze . out" lie over the crank bar, the grey one is low contrast; piston 4 post touches the dial text. |
| Clock/dial holding between heroes | PASS with one nit | Never runs backwards. Reads 0.043 (180 deg) from S07 end through S16, 0.086 (360) from S17 end through S44, 0.128 (540) S45 to S67, 0.171 (720) from S68 end. The spoken times land on held values (161.4 "four hundredths", 268.4 "nine hundredths", 404.3 "thirteen hundredths", 552.9 "seventeen hundredths"). Nit: it shows 0.128 at 540 deg, the board and brief say 0.129 (540 x 0.2381 = 0.1286), and S68 starts at 0.129 at 541 deg, so the displayed values are inconsistent. S82 shows CRANK 0 then S83 CRANK 720 for the same instant. |
| Spark zoom chapter (S34 to S38, 273.6 to 299.5) | PASS | Labelled "ZOOM", clock held at 0.086, no backwards motion; spark graph, kernel, front all in order. |
| Otto portrait S58/S59/S62 with credit | PASS | Real 1860s studio portrait, matches the caption and credits.json; credit line "portrait: unknown, c. 1868 (public domain)" on S58 only (about 26 px), thumbnails on S59/S62 carry no line (covered by the S58 credit and credits.json). |

## Must-fix
1. 267.06 to 273.6 (end of Blueprint slot): loop dropout and restart. Extend or crossfade the bed, or end the Blueprint cue in a clean fade by 266.5 and start Mechanism early.
2. 407.5 to 412.0 (S56, S57 "Let's stop the clock ... called the Otto cycle"): 4.5 s of near-empty slate with only the stopped clock; the title card "THE OTTO CYCLE" arrives at the end. Put the title or a stopped-clock graphic on "stop the clock".
3. 449.0 to 452.5 (S63, "In 1862, a French engineer, Alphonse Beau de Rochas"): blank 3.5 s, name card arrives on the name. Show "1862" on the first words.
4. 379.0 to 390.6 (S52): re-anchor "one pushing" to the lit piston, move the other labels off the crank and raise the grey label's contrast.
5. 288.6 to 299.5 (S38): lime electrode bar is on screen the whole hero; limit lime to the arc and glow at the spark, or shrink the electrode tip. Move or fade the front/wrinkle leader lines once the chamber is full.
6. 26.1 to 29.5 (S00f, "So today, we're going to follow one cycle..."): 3.5 s of a dim empty ring; draw the cylinder or the ring on "So today".
7. Clock value: show 0.129 at 540 deg (S45 end to S67), so it matches the script and S68.

## Nits
- Sub-labels under about 34 px (S00c "idle differs by engine", S00f "real time", S30 and similar captions); P4 flagged the same.
- S82/S83 dial label flips 0 to 720.
- 1 s blank at the start of S60 (427.0 to 428.5) and S82 (578.0 to 580.5, before the wordmark).
- Studio ops: heroes release still holds four leftover test clips t-*.mp4; no thumbnails yet.
- Hero 3D is a flat grey look versus the 2D chalk; accepted by showrunner ruling.

## Listen at (unusual words, whisper mismatches)
451 to 453 "Alphonse Beau de Rochas" (heard "alponse", "rocher"); 415.9 "Langen" (heard "Lange"); 400.5 "thirteen" (very low confidence); 548.4 "Clock 17 hundredths" (script says seventeen); 185 "ten"; 217.5 "fourteen"; "isooctane" near 240 to 250.
