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
