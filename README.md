# Designed Otherwise

Everyday machines hide clever, counterintuitive engineering. This repo holds the production source for the channel's fact-checked explainers: research dossiers, scripts, storyboards, Motion Canvas and Blender scene code, the brand kit and the render workflows.

Finished videos, narration audio and music are not stored here.

| Workflow | What it does |
| --- | --- |
| Setup check | Installs every tool, renders a 5 second test in each, publishes one frame per tool and the voice audition |
| Narrate | Kokoro narration in the channel voice, word timestamps, script-vs-audio check |
| Captions | Re-times words for an existing narration take |
| Render Blender hero | One Blender hero shot across parallel runners, stitched to 1080p |
| Render episode | The Motion Canvas episode (chunked, frame-exact) or the hero overlay frames |
| Assemble final video | Heroes composited, narration over a ducked music bed, captions, loudness and sync checks |
| Studio token check | Confirms the hand-off token works |

All workflows are manual (`workflow_dispatch`). Fonts: Archivo and IBM Plex Mono, SIL Open Font License (`style/fonts/`).
