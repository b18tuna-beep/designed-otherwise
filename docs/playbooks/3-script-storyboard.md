# 3. Script, storyboard and scenes

Reference: `episodes/p1-refrigerator/script/`, `board/`, `scenes/`.

## Script (checkpoint 2)
- `script/script.md`: one line per sentence with its claim id as a source note; `script/narration.txt`: the plain text Kokoro reads.
- Length: bm_george reads about 174 words per minute. P1: ~1,450 words for ~9 minutes with beat pauses.
- Hook in the first 10 s: the question spoken and on screen. Pay off the title early.
- Unusual words: add a phoneme entry to `style/pronunciations.json` and listen after narration.
- Michael reviews the narrated script (narrate.yml), not the text. Log his minutes in the studio time log.

## Storyboard (checkpoint 3)
- `board/scenes_src.py` is the source of truth: per scene its beat, the anchor phrase it starts on, tool (motion-canvas or blender hero), the changes that land on cue words, on-screen text and fact ids.
- `board/build_scenes.py <words.json>` times scenes against the narration and writes `scenes/scenes.json`.
- Every scene follows the style bible; heat, cold and refrigerant colors never change meaning; arrowheads are reserved for heat.
- Nothing on screen for more than 8 s without a change.
- External review passes are recorded in `board/review-*.md` with what was applied and what was kept, with reasons.

## Packaging
- Titles and thumbnails: `style/packaging.md`. Three thumbnails (`tools/board/thumbs.py`), Michael picks; the title is approved by him.
