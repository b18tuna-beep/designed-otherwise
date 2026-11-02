# Quality bar

The floor is P1 as approved at checkpoint 4 (2026-10-28): visual QA 40/40, assembly checks all pass. Each line says whether code enforces it.

## Truth
- Every line traces to a claim with 2 independent sources and an independent fact check; the script uses only `safe_wording`. (manual: research playbook)
- No number that only one source gives.

## Look
- Style bible and tokens only; heat, cold and refrigerant colors never change meaning. (manual; tokens read by code)
- Arrowheads mean heat. Frost is a chalk-white deposit over unchanged geometry.
- Nothing static for more than 8 s; each change lands on its cue word, 0 to 0.3 s early. (manual: QA)
- Blender heroes: view transform Standard. (enforced in the hero scripts)

## Sound
- Voice is Kokoro bm_george at 1.0. Never change it without Michael. (narrate.yml default)
- Master -14 LUFS, true peak -1.5 dBTP, music bed ducked under the voice. (enforced: `assemble.py` checks)
- Every script word spoken: faster-whisper word check after each narration. (enforced: narrate.yml warning)

## Packaging
- Title opens a real gap and the video pays it off early; thumbnail max 4 words, never repeats the title. (`style/packaging.md`)

## Never again (from Michael's notes)
- 2026-10-28 P1: descriptive titles rejected ("too descriptive, closes the gap"); the title must be a self-test or a concrete paradox.
