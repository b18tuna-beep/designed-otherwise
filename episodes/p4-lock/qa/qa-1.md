# P4 QA pass 1 (2026-11-25, independent reviewer, first assembled cut 10:21.6)

Verdict: not ready. 1 blocker, 6 should-fix, 4 nits. Script, numbers, names, audio (-14.07 LUFS, -1.87 dBTP, no silences), captions (260, single line, <= 42 chars), colours, safety: pass.

| # | Sev | Final time | Scene | Defect | Fix |
|---|---|---|---|---|---|
| 1 | blocker | 9:17-9:26 | S63 | FBI bar empty ~7.5 s, value labels never shown | fill from scene start, labels on "more than half", hold |
| 2 | should | 1:56-2:05 | S12 | overlay labels not over the culprit stacks (3D: 2nd, 3rd, 5th), one hidden by the key bow; "locked" unreadable and late | anchor labels from measured pin positions; dark plate |
| 3 | should | 2:56-3:09 | S19 | split labels not at the master stack's gaps; key labels tiny; locator chip over the lock | leader lines at the gaps; move labels |
| 4 | should | 8:37-8:44 | S59 | spool/mushroom labels on the light key, unreadable | move to slate |
| 5 | should | 8:08-8:21 | S57 | label over the holes; 3D push-in crops outer holes at the end | move label (3D kept) |
| 6 | should | 10:14-10:21 | S69 | wordmark over the 3D | move to clean slate |
| 7 | nit | each hero end | joins | 1 frame of overlay on empty slate after the 3D ends | fix the boundary at source |
| 8 | nit | 0:39-0:42 | sting | orange/lime/arrow in the sting | brand sting, exempt (same in every video) |
| 9 | nit | various | S00a, S00d, S40, S67 | thin first 1-2.5 s | draw window + padlock together |
| 10 | nit | all | text | credits, locator, sub-labels < 34 px; titles inside the 96 px safe margin | size up |
| 11 | nit | captions | | a few orphan words | kept |
| own | should | 0:05-0:25 | S00b, S00c | hook overlay labels tiny, S00b's on the 3D key | >= 40 px, clean slate |

Planner note on #5 safety: the tolerance shot shows one pin catching before the others. That is the fact-checked safe concept ("the pins never all line up at the same instant"); no tools, hands or steps are shown. Flagged for Michael to confirm.
