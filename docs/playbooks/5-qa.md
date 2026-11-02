# 5. QA before Michael sees anything

Reference: `episodes/p1-refrigerator/renders/visual-qa*.md` (8 passes to 40/40).

## Steps
1. Pull `video.mp4` from studio release `render-<job>` (`scripts/qa_review.sh jobs/<slug>` in the studio downloads it and makes frame sheets).
2. `tools/board/qa_frames.py <video> episodes/<ep>/scenes/scenes.json <out>`: one strip per scene (after the cut, after each cue, before the next cut). Look at every strip.
3. Check cues against independent faster-whisper word times: each change lands on its word, 0 to 0.3 s early.
4. Re-render, then compare the new final with the last pass frame by frame (96x54 greyscale) so untouched scenes are proven unchanged.
5. Write `renders/visual-qa.md` + `.json` (keep the previous pass as `visual-qa-passN.*`).

## Checklist
- [ ] `checks.json`: -14 LUFS (+-1), true peak <= -1.5 dBTP, no clipping, sync within 0.1 s, no narration gap over 2.5 s.
- [ ] Every scene PASS on the rubric: style bible colors, labels readable on a phone, no text cut off.
- [ ] Nothing static for more than 8 s.
- [ ] Captions: one line per caption, at most 42 characters, every script word present.
- [ ] Thumbnails readable at phone size.
- [ ] Unusual words: tell Michael which timestamps to listen at.
Fix what you find, re-check, and only then upload for Michael (studio `6-release.md`).
