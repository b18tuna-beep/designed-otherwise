# P5 QA pass 4 (2026-11-28, independent, studio release render-2026-12-p5-engine; video/captions/checks 13:31 UTC, shorts 13:36, thumbs 13:40)

Verdict: video PASS, shorts PASS (nits), thumbnails FAIL (thumb-1 only; thumb-2 and thumb-3 pass).
Method: checks.json, 90 qa_frames.py strips with --checks (all viewed), full-frame grabs through both nudged spans, shorts frames at 0.1/0.9 s/40%/75%/end-2.5/end-1.5/end, independent ebur128 and RMS at span edges, short spans mapped to narration time (video minus 3.2 s after the 41.07 sting) against audio/words.json, thumbs at 1280 / 320 / 160 px. The qa-3 render is no longer in the release, so a frame diff was impossible; checks.json is identical to qa-3 (same loudness, true peak, 585.966 s, 254 captions), and no scene differs visibly from qa-3 strips.

## 1. video.mp4: PASS
- checks.json: -14.1 LUFS, -1.71 dBTP, no clipping, sync_ok, no narration gap over 2.5 s, no music gaps, 1 loop 4.0 s crossfade, sting cut 41.07 / 3.2 s.
- S00f 29.2-35.2: "one cycle" now sits below the flywheel; rim and ticks no longer run through it (clear by a few px at 1080p; do not move it up).
- S35 278-282: "SPARK" (lime) and "a few tens of degrees early" are on separate rows, no overlap, letters whole.
- 1920x1080, 585.9 s. Nothing else flagged in the strips; lime only at sting, S35 spark, S38 flash.

## 2. Shorts: PASS (3 nits)
| Short | Size | Length | LUFS | Span (video s) | Start / end word | Hook in 1 s |
| --- | --- | --- | --- | --- | --- | --- |
| s1 | 1080x1920 | 37.2 | -14.1 | 0 to 35.2 | "Next" / gap before "The clock" | title card + red light |
| s2 | 1080x1920 | 43.1 | -13.9 | 273.8 to 314.86 | "Now" / after "it." | title "Why the spark fires early" |
| s3 | 1080x1920 | 50.8 | -14.1 | 341.6 to 390.4 | "Stroke" / gap after "degrees" sentence | title "The only stroke that does any work" |
| s4 | 1080x1920 | 41.4 | -14.1 | 427.4 to 466.8 | "In" / after "revoked." | title "Otto built it. Then his patent was revoked." |
| s5 | 1080x1920 | 36.9 | -13.9 | 516.1 to 551.0 | "So" / after "best." | title "Where the fuel energy actually goes" |
- All 9:16, all under 60 s including the 2.0 s endcard (logo, "DESIGNED OTHERWISE"). All start and end on word boundaries (no mid-syllable cut); the 0.2 s audio fade-in softens the first word slightly.
- Captions: one line, about 71% down the frame, above the bottom UI zone and clear of the right button column.
- Self-contained: no reference to the long video. s1 and s2 open with a setup phrase ("Next time you're stopped at a red light," / "Now, something happens before the piston top") that is a hook, not a dependency.
Nits (none block): (a) "Full explainer on the channel" line sits at about 95% down, inside the Shorts channel/title overlay, so it will be partly covered; move it up to about 80% or drop it. (b) The 16:9 diagram strip is letterboxed into a 1080x608 band, so in-diagram labels are about 15 to 20 px high on a phone (same as long video sub-labels). (c) s1 hook is the title card with a quiet diagram; fine, but its first 0.2 s is a fade from black.

## 3. Thumbnails: FAIL (thumb-1)
All three are 1280x720 and the words (ONLY NOW? / THE OTHER 3? / NOTHING MADE YET) are readable at 320 and 160 px. Text is chalk and orange on the dark gradient; orange used as the emphasis colour on text only (heat is also orange in thumb-1 particles).
- thumb-1 FAIL: two artefacts, both visible at 320 px.
  1. A pale cream vertical bar right of the cylinder, about x 1066-1103, y 200-381 (a leftover "pressure" gauge or half-removed label).
  2. A hard-edged dark rectangular patch cut out of the cylinder wall and flywheel on the right, about x 1010-1070, y 380-440 (the blanked label region; no inpaint).
  Fix: rebuild thumb-1 from a source frame without the gauge/label (S68 hero minus the pressure bar and label), or mask the bar and the patch with background and wall texture copied from the mirrored left side; then re-run the shorts-thumbs workflow for thumb-1 only.
- thumb-2 PASS: clean 3D four-cylinder hero, one lit piston, no stray marks.
- thumb-3 PASS with a nit: flat diagram hero, clean, no stray marks; packaging.md says never use the flat diagram (prefer the 3D hero). Michael's call.
- Nit: thumb-2/3 background is a lighter blue-grey gradient than tokens bg (#11151B); reads fine.

## Listen at (unchanged from qa-3)
452.5 "Alphonse Beau de Rochas", 418.8 "Eugen Langen", 403.7 "thirteen hundredths", 305.6 "twenty-five degrees", 270 to 277 music crossfade, and each Short's first word at 0 to 0.3 s.
