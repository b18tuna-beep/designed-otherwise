# 4. Render

All renders run in THIS public repo (free minutes) and hand results to the private studio through `tools/ci/studio.sh` with `STUDIO_TOKEN`. Dispatch from the workspace with the REST API (GraphQL is blocked):
```
gh api -X POST repos/b18tuna-beep/designed-otherwise/actions/workflows/<file>.yml/dispatches -f ref=main -f 'inputs[<name>]=<value>' ...
```

| Order | Workflow | Inputs | Lands in the studio |
|---|---|---|---|
| 1 | `narrate.yml` | text, name (`final`), voice `bm_george`, speed `1.0` | release `narration-<ep>`: name.flac/.mp3/.words.json; previews `narration/<ep>/run-<id>/` |
| 2 | commit words.json | copy the previews words.json to `episodes/<ep>/audio/final.words.json`, re-run `board/build_scenes.py` | (this repo) |
| 3 | `render-blender.yml` | script, name (scene id), frames, chunks, res, samples | release `heroes-<ep>`: `<id>.mp4`; previews `blender/<ep>/<id>-frame.png` |
| 4 | `render-episode.yml` | project `overlays` | release `episode-<ep>`: `overlays-frames.tar` |
| 5 | `render-episode.yml` | project `episode`, chunks 4 | release `episode-<ep>`: `episode.mp4` (frame count checked against scenes.json); 3 stills on previews |
| 6 | `assemble.yml` | episode, job (studio slug), narration asset | release `render-<job>`: video.mp4, captions.srt, checks.json, thumb-1..3.jpg |

| 7 | intro | `tools/intro/mix_with_sting.py silent.mp4 narration.wav music.wav captions.srt <cut_s> sting.mp4 logo.wav out/` (stems from assemble.py; never splice into a finished mix: Michael 2026-11-03, the hard music cut was jarring) | THE HINGE (3.2 s, identical in every video) after the cold open, on the scene boundary after its last line; captions shift, chapters after the cut move +3.2 s. Build the sting once with `tools/intro/hinge.py` + `sonic_logo.py` (see `tools/intro/README.md`). |

`captions.yml` re-times words for a take that was edited after narration (e.g. a spliced line).

Watch a run: `gh run list -R b18tuna-beep/designed-otherwise -L 3`, then read annotations from the run's check runs (`gh api repos/.../check-runs/<id>/annotations`).
Fetch results into the workspace: `git clone -b previews` of the studio, or `gh release download <tag> -R b18tuna-beep/designed-otherwise-studio`.

## Known failures and fixes
- Blender download stalls: mirrors with timeouts, apt fallback (already in the workflow).
- Blender colors washed out: view transform must be Standard, not AgX.
- Motion Canvas `Video` nodes freeze headlessly: heroes are composited by `composite_heroes.py`, never embedded.
- Chunk joins off by a frame: `encode_chunk.py` keeps exactly the frames the range holds; the stitch job fails if the total differs from scenes.json.
- Long exporter runs: `RENDER_TIMEOUT_MIN` in render-episode.yml (100 min per chunk).
- `composite_heroes.py` and `assemble.py` are P1-specific (hero ids, music plan). Generalise them per episode before P2.

- 2026-11-25 (P4 QA): `encode_chunk.py` used the concat demuxer with per-file durations, which repeated each chunk's first frame and put the whole episode one frame late (a stale overlay frame showed at every hero end). Fixed to an image2 frame sequence; chunk RANGE starts half a frame early. P2 and P3 shipped with the 1-frame (33 ms) delay: not worth re-uploading.
- 2026-11-25 (P5 narrate): previews push failed 6 times with "fetch first". The actions/checkout Authorization extraheader overrode the studio token, so the previews branch looked absent and each attempt pushed a new orphan. `publish_preview.sh` now clears the extraheader on every git call (`g()`); the release upload was unaffected.
- 2026-11-25 (P5 render): `assemble.yml` was still P1-shaped (heroes fetched into a P1 folder, no intro sting, thumbs required) and did not match `composite_heroes.py`. It now fetches heroes into `in/heroes`, calls `composite_heroes.py <ep> ...`, builds THE HINGE (`hinge.py`, `sonic_logo.py`), runs `mix_with_sting.py` at the first scene of beat 2 and merges the sting checks into `checks.json`; thumbs are optional. `assemble.py` needs `audio/final.words.json` (P5 keeps a copy of `words.json`) and `audio/music.json` as `[{"file", "from_beat"}]`; the studio job's cue/in/out/gain file is only the plan. A track shorter than its beats loops (P5 Blueprint, about 7 s).
- 2026-11-25 (P5 render): a hero clip is one stroke (180 degrees) spread over its whole slot, so the clock and dial follow the heroes: they sweep during S07/S17/S45/S68 (`SWEEP` 4 to 94 percent of the slot, same constants in `e1_engine.py` and `src/p5/shared.tsx`) and hold between. A clock interpolated over the whole chapter would show 14 degrees of dial against a full piston stroke. The Blender camera is offset so the engine sits where the 2D cutaway is drawn (x -200 px, y +20 px, 90 px per unit).
- 2026-11-25 (P5 render): dispatching a workflow right after `git push` ran the previous commit (the file was missing). Wait a few seconds after the push. `gh release download` needs GraphQL and is blocked in the Claude workspace: list `repos/<repo>/releases/tags/<tag>` and download each asset with `Accept: application/octet-stream` via `gh api`. The workspace cannot delete release assets (403): leftover test clips (`t-*.mp4`) stay in `heroes-<ep>`; `composite_heroes.py` ignores them.
- 2026-11-25 (P5 render): catching Motion Canvas errors before a 2-hour Actions run: sparse-checkout `episodes/p1-refrigerator/scenes` and `style`, `npm ci`, set `rendering.resolutionScale` to 0.1 in the project meta (do not commit it) and run `CHROME_PATH=/usr/bin/google-chrome node render.mjs out <project> --frames` locally: the whole 10-minute episode renders in about 5 minutes and page errors print. For a single full-size frame use `RANGE="t,t+0.04"`. Sample the frames into a contact sheet to check layout (clock corner x > 400, y < -250 is reserved).
- 2026-11-25 (P5 render): a Blender test with `--frames 4` and `--chunks 4` (res 50, samples 8) renders four frames spread over the whole clip in about 5 minutes: use it to check a new hero script before the full matrix.
- 2026-11-25 (P5 QA 1 fixes): a track shorter than its music slot was hard-looped (`-stream_loop`), which restarted from the intro after 0.5 s of digital silence (the tail of the file). `mix.music_bed` now trims tail silence and crossfades (4 s) into a mid-track loop point, and `assemble.py` fails (`music_gaps_ok`) on any digital silence (under -60 dB for 0.3 s) in the finished mix, and reports `music_loops`. Clock text: 0.238 ms per degree, so 540 degrees reads 0.129 (0.2375 gave 0.128). Overlay labels over a Blender hero: project the camera (place_camera args plus lens) to pixels before placing them, keep the hero out of the clock corner (x 1370 to 1830, y 120 to 340 px), and make labels follow the moving part (S52 tags are per cylinder, text follows the stroke). A 2D scene whose first cue is several seconds in needs T()-driven content from the first word. Lime is the spark only: the electrode material is chalk except at the flash.


## Shorts and thumbnails (after checkpoint 4)
`shorts-thumbs.yml` cuts short-s1..s5.mp4 (from `episodes/<ep>/final/shorts.json`) and thumb-1..3.jpg (frames + words from the studio job `packaging.md`) out of the approved video.mp4 in `render-<job>`, and pushes 320 px previews to the studio previews branch. Never re-render the episode for these. Added for P5 (2026-11-28).
