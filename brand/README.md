# Designed Otherwise brand kit

Channel name (trial): **Designed Otherwise**, chosen by Michael 2026-10-28 after "The Hidden Mechanism" turned out to be one letter away from an existing AI-video channel (@TheHiddenMechanisms) in the same niche.

## Mark (locked 2026-10-28)
ChatGPT concept board, bottom-right concept, refined in ChatGPT (`reference/approved-refinement.png`), rebuilt as clean geometry in `mark.py`. An open door: chalk frame (also a D in perspective), blue door leaning the opposite way, orange panel behind. The violet strip across the threshold is deliberate (Michael: keep it); do not move it to the orange/blue overlap.

## Palette (same tokens as the videos)
Slate #11151B (ground), Chalk #ECE7DC (structure and type), Cold Blue #3DA8F5, Heat Orange #FF7A33, Violet #B38CFF, Muted #8B95A3 (tagline). Light version swaps Slate and Chalk.

## Type
Archivo SemiCondensed (SIL OFL, `style/fonts/`): DESIGNED in Medium, OTHERWISE in SemiBold, tracked +8%. Tagline in Medium, Muted.

## Visual system (v2, 2026-10-28)
Michael: the v1 kit was all mark and the rest looked flat. v2 adds:
- **3D hero**: `hero3d.py` extrudes the mark into beveled slabs (orange back, chalk frame, blue door in front) lit by a warm light behind the doorway and a cool rim, on a matte floor that catches the spill. Renders are kept in `render/`.
- **Drafting layer**: `compose.py` lays a faint drafting grid, blueprint schematics of upcoming episode machines (refrigerator, traffic signal, induction coil, microwave) with dimension lines and FIG. labels, registration crosses on the YouTube safe-area corners, and a drawing title block. A FIG. 00 dimension and a FRAME leader annotate the mark itself.
- **Finish**: film grain and a vignette on everything; avatars keep the flat mark (it reads at 32-48 px) on a glowing, grained ground.

## Build
`python brand/build.py` writes everything to `brand/export/`: SVG + 2048 px marks (dark, light, transparent), horizontal and stacked wordmarks, YouTube profile/banner/watermark, Google avatar, Instagram, TikTok, Facebook profile/cover, app icon, favicons, share image, end screen, and preview sheets. Avatars use a larger fill because platforms crop to a circle. Animated intro: `tools/intro/` (THE HINGE, 3.2 s, same in every video).
