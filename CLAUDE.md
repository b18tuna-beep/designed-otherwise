# Working in designed-otherwise (public production repo)

Production code and source for **Designed Otherwise**, a faceless explainer channel about the clever, counterintuitive engineering inside everyday machines. Pilot: FPI P1, "Touch the Side of Your Fridge Right Now" (working title "Why Your Refrigerator Has to Heat Up to Keep Food Cold"). The channel was called The Hidden Mechanism during P1 production.

## Two repos

| Repo | Visibility | Holds | Secrets |
| --- | --- | --- | --- |
| `b18tuna-beep/designed-otherwise` (this one) | public | tools, style, brand, episode research/script/board/scene source, render workflows | `STUDIO_TOKEN` only |
| `b18tuna-beep/designed-otherwise-studio` | private | jobs, approvals, music library, rendered media (releases), previews branch, upload/release/metrics workflows, ops docs, time log | YouTube, Buffer, Meta, ntfy |

- This repo exists for the free public-repo Actions minutes. Every workflow here is `workflow_dispatch` only. Never add `push`, `pull_request`, `pull_request_target`, `schedule` or fork-triggered workflows.
- The only secret a workflow here may read is `STUDIO_TOKEN`, and only to hand results to the studio (`tools/ci/studio.sh`: releases, previews branch) or read its music library. Never add another secret here.
- Nothing finished lives here: no videos, narration audio, hero clips or music, not in commits, not on a branch, not as run artifacts. Renders go to studio releases (`narration-<ep>`, `heroes-<ep>`, `episode-<ep>`, `render-<job>`), small previews to the studio `previews` branch. Only intermediate stills may pass between jobs as 1-day artifacts.
- No secrets, account emails or personal details in files, commits, logs or chat. Assume everything here is read by strangers.
- Claude's workspace reaches GitHub, npm and PyPI only. Anything needing model downloads, Blender or outside sites runs in Actions.

## Roles

- Michael is the director. He reviews finished work at checkpoints 2 (script), 3 (storyboard) and 4 (final). He never edits code, opens Blender, adjusts timing, finds sources or troubleshoots.
- Claude orchestrates and fixes its own failures. Escalate to Michael only with a decision, never a task.
- Every minute Michael spends is logged in the studio's `log/time-log.csv`.
- Nothing goes public without Michael's approval, recorded in the studio as `jobs/<slug>/approval.json` (see the studio CLAUDE.md).

## Quality rules

- Nothing unverified reaches the script: research dossier (2 sources per claim) -> independent fact check subagent -> script with a source note per line.
- Every asset gets a license line (music: YouTube Audio Library; SFX: Freesound CC0 only; footage: public domain US government or LoC free to use). Fonts are SIL OFL (`style/fonts/`).
- All visuals follow `style/style-bible.md` and read colors from `style/tokens.json`. Heat, cold and refrigerant colors never change meaning.
- Packaging (titles, thumbnails): `style/packaging.md`.
- Narrator: Kokoro `bm_george` at speed 1.0, chosen by Michael 2026-10-27 (`style/voice.md`). Never change it without his approval.

## How to work: playbooks

Before any task open `docs/playbooks/README.md` and read only the playbook for that task. Upload, release and ops playbooks live in the studio repo. When Michael gives a note or something breaks, update the playbook in the same commit as the fix.

## Layout

| Path | Contents |
| --- | --- |
| `style/` | style bible, tokens.json, packaging rules, voice, pronunciations, OFL fonts |
| `brand/` | brand kit source and `export/` (profile pictures, banners, end screen, marks) |
| `episodes/<ep>/` | research, script, audio (words.json only), board, scenes, QA notes, final metadata/captions/thumbs |
| `tools/anim/motion-canvas/` | Motion Canvas projects (`episode`, `overlays`, `board`), `render.mjs` renders headlessly via Playwright |
| `tools/anim/revideo/` | Revideo test project; `chrome-wrapper.sh` strips `--single-process` which crashes current Chrome |
| `tools/anim/composite_heroes.py`, `encode_chunk.py` | hero compositing; frame-exact chunk encoding |
| `tools/voice/`, `tools/captions/`, `tools/audio/` | Kokoro wrapper and audition; faster-whisper word check; mix and assembly (-14 LUFS, -1.5 dBTP) |
| `tools/ci/studio.sh` | hand-off to the private studio (releases, previews, fetch) |
| `.github/workflows/` | setup-check, narrate, captions, render-blender, render-episode, assemble, studio-token-check |

## Notes learned in setup

- Motion Canvas and Revideo need different Vite majors, so they live in separate folders. Scene code is source-compatible apart from import paths and `makeScene2D(name, ...)` in Revideo.
- Revideo: a reactive `text={() => ...}` on `Txt` throws "scene is not available"; set text imperatively from a generator instead.
- Fonts load through `src/fonts.css` and are awaited in `project.ts` before the first frame.
- Blender runs headless in Actions (`blender -b -P script.py`). Cycles CPU at 960x540, 12 samples runs about 12 s per frame on a runner: split frames across a matrix of runners (`render-blender.yml`) and keep hero shots short.
- The Blender download uses mirrors with timeouts; download.blender.org alone stalled a run for 30 minutes.
- Fallback when Actions are unavailable: Blender heroes render locally with pip `bpy` (python 3.13 venv) at 50% res and 8 samples, then lanczos-upscale to 1080p.
- Motion Canvas `Video` nodes render as a frozen frame headlessly. Hero shots are therefore 2D overlay scenes (`overlays` project, transparent PNG frames) composited over the Blender mp4s by `tools/anim/composite_heroes.py`.
- Blender view transform must be Standard: AgX washes the lime and orange tokens toward cream.
- P1's approved audio and captions still say "Next time on The Hidden Mechanism" (S40). Re-voicing that line as "Designed Otherwise" is a pending P1 finishing task that needs Michael's approval of the new clip; until then scenes, script and words.json stay matched to the approved audio.
