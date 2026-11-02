# 2. Research and fact check

Nothing unverified reaches the script. Reference: `episodes/p1-refrigerator/research/`.

## Steps
1. `claims.json`: every claim the episode might make, with its id, wording and at least 2 independent sources (same publisher family counts once: GE/Hotpoint/Haier, Whirlpool/Maytag/KitchenAid, Frigidaire/Electrolux, OpenStax, EIA, ENERGY STAR, HyperPhysics).
2. `dossier.md`: the readable companion, grouped by beat.
3. Independent fact check by a separate subagent that does NOT read the dossier and opens every cited URL: `factcheck.json` (per-claim verdict PASS / PASS_WITH_EDIT / FAIL, `safe_wording`, allowed numbers) and `factcheck.md`.
4. `decisions.md`: what was dropped or reworded and why, dated.
5. Any later script change that adds a claim gets its own check (`factcheck-addendum.json`).

## Rules
- The script may use only each claim's `safe_wording` and allowed numbers.
- Conflicting numbers between sources: say it without the number.
- Downloads and page fetches run in Actions or through the fact-check subagent's web access, never pasted from memory.
