# Designed Otherwise: Style Bible

Every scene, thumbnail and hero shot follows this file. Values live in `style/tokens.json`; code reads them from there and never hard-codes a color, size or font.

## 1. The look in one paragraph

Dark slate board, chalk-white linework, and exactly three meaningful colors: heat, cold, refrigerant. It should feel like a very good engineer sketching on a dark whiteboard, then the sketch coming alive. Clean, flat, diagrammatic. No gradients for decoration, no stock textures, no glossy 3D logos. The mechanism is the star; nothing on screen is there just to look busy.

## 2. Palette

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#11151B` | Background of every 2D scene |
| `panel` | `#1A2029` | Cards, cutaway interiors, floor in 3D |
| `grid` | `#262E39` | Faint guides, wall in 3D, inactive parts |
| `chalk` | `#ECE7DC` | Default linework, labels, the fridge body |
| `muted` | `#8B95A3` | Axes, secondary labels, units, timecodes |
| `heat` | `#FF7A33` | **Heat energy** (see section 3) |
| `heat_peak` | `#FF4A2B` | Hottest point in a heat scale |
| `heat_soft` | `#7A3A1C` | Fill for a warm region or warm component |
| `cold` | `#3DA8F5` | **Cold regions and cold surfaces** |
| `cold_deep` | `#2A6FD6` | Coldest point in a cold scale |
| `cold_soft` | `#173E5E` | Fill for a cold region or cold component |
| `refrigerant` | `#B38CFF` | **The refrigerant itself**, in any state |
| `refrigerant_soft` | `#4A3A6E` | Pipe fill behind moving refrigerant |
| `electric` | `#D6F25C` | Electrical energy only: power into the compressor, current into the defrost heater, the meter in the bill beat |

Contrast check: every color above reads against `bg` at TV viewing distance. Heat and electric are kept far apart in hue (orange vs. lime) so the defrost heater scene stays readable.

## 3. Fixed color meanings (never broken)

These are the rules the visual QA pass checks frame by frame.

1. **Heat is orange, always, and only.** Any arrow, particle stream or glow that represents heat moving is `heat`. Heat-flow arrows are always orange, including heat flowing *into* the evaporator from the food. This is the whole thesis of the video: cold is not a thing that flows; heat is.
2. **Cold is blue, and it never moves.** `cold` marks places and surfaces that are cold (the evaporator, the freezer compartment, frost). It is a property of a region, never an arrow. There is no such thing as a "cold flow" arrow in this channel.
3. **Refrigerant is violet in every state.** Liquid, vapor, high pressure or low: the refrigerant keeps its color. State is shown by form, not color:
   - liquid: solid violet fill in the pipe
   - vapor: spaced violet particles or bubbles
   - boiling: violet bubbles forming in violet liquid
   - Temperature of the refrigerant is shown with a thin halo in `heat` or `cold` around the pipe, never by recoloring the refrigerant.
4. **Electric is lime and only means electricity.** Never used for highlights or emphasis.
5. **Chalk is neutral.** Labels, the fridge cabinet, the kitchen, food, water and meltwater are chalk outlines. Meltwater is chalk droplets. Frost is a separate chalk-white deposit with a thin `cold` edge, so it never looks like the blue metal coil it sits on; it grows over fixed coil geometry and retreats when melted.
6. **No other hues.** No green for "good", no red for "bad", no yellow for highlights. Emphasis is done with weight, scale, a chalk underline or isolating the subject.
7. **Arrowheads mean heat, and only heat.** Every other kind of motion or relation has its own mark:
   - heat transfer: orange arrows (the only arrows in the video)
   - refrigerant movement: violet particles or moving violet texture inside a tube, never loose in space
   - air and moisture movement: neutral chalk dashes or dots drifting, no arrowheads
   - dimensions, comparisons, axes, ranges: plain lines, brackets and labels, no arrowheads
   - text never uses "→"; write "to" or lay the words out in order
8. **Show the action, then label it.** Each component demonstrates what it does (bubbles boiling, vapor squeezed into a smaller space, vapor merging into liquid, flow forced through a narrow bore) before or as its label appears. A label never does the explaining alone.
9. **One machine, always findable.** Close-ups grow out of a component's place in the fixed loop or the cabinet and keep a small locator on screen. The fridge cutaway (freezer at the top with the evaporator on its back wall and the defrost heater just below it, machine compartment at the bottom with compressor, condenser and drain pan) is the same drawing every time it appears.
10. **Qualifiers are first-class text.** Words that limit a claim ("some models", "in a hot room", "at ordinary air pressure", "power while on", "up to") sit right beside the number at label size, never in small print.
11. **Never show both modes at once.** While the defrost heater runs, refrigerant flow is not shown.
12. A temperature scale, when one is needed, runs `cold_deep` > `cold` > `chalk` > `heat` > `heat_peak`, with chalk as "room temperature."

## 4. Type

| Role | Font | Weight | Size at 1080p |
| --- | --- | --- | --- |
| Title cards, the opening question | Archivo SemiCondensed | SemiBold 600 | 88 px |
| Component labels | Archivo SemiCondensed | SemiBold 600, letter-spacing +4 | 44 px |
| Small labels | Archivo | Medium 500 | 34 px |
| Numbers, units, temperatures, watts, timecodes | IBM Plex Mono | Medium 500 | 52 px (34 px secondary) |
| Burned-in captions (Shorts only) | Archivo SemiCondensed | SemiBold 600 | 46 px |

Both fonts are SIL Open Font License, vendored in `style/fonts/` with their license files.

Rules:
- Component labels are uppercase (EVAPORATOR, CONDENSER). Sentences are sentence case.
- Never more than 7 words of on-screen text at once, except the opening question.
- Numbers always carry a unit and always come from a passed fact.
- Minimum size anywhere is 34 px at 1080p (readable on a phone and a TV).

## 5. Line weights (1080p)

| Token | px | Use |
| --- | --- | --- |
| `hairline` | 2 | Guides, dimension lines, axis ticks |
| `structure` | 4 | Outlines of components and the cabinet |
| `emphasis` | 6 | The refrigerant loop pipe, the subject of the current beat |
| `flow` | 8 | Heat-flow arrows |

Rounded caps and joins everywhere. Arrowheads are filled triangles sized about 2.75x the line weight. Corners on components use a 16 to 18 px radius; the loop pipe uses large radii (60 to 70 px) so the refrigerant reads as flowing.

## 6. Motion rules

- **30 fps, 1920x1080** for everything, including Manim and Blender.
- **A visual change every 4 to 6 seconds; no frame static for more than 8 seconds.** A "change" is something that teaches: a new part appears, refrigerant moves to the next stage, a label lands. Not a slow zoom on nothing.
- **Visuals land on the word.** Each entrance is keyed to the word timestamp from the narration (scenes.json), arriving 2 to 4 frames *before* the word is spoken.
- Entrances 0.6 s, exits 0.4 s, `easeInOutCubic`. Draw-on (stroke reveal) for lines and pipes; scale-from-zero only for small components.
- **Continuous processes loop continuously.** While the loop is on screen, the refrigerant never stops moving. Its speed is constant within a scene so viewers can track it.
- **Build, don't replace.** Diagrams accumulate. The loop is assembled one component at a time across beat 3, and later beats return to the same drawing (same positions, same colors) instead of a new one.
- **One subject at a time.** When a component is being explained, everything else drops to `grid`/`muted` (dim, not hidden) so the eye has one place to go.
- Camera moves in 2D are slow pushes (max 15% scale over a beat) toward the subject being explained. No spinning, no shake, no whip pans.
- Transitions between beats: a straight cut or a 0.4 s crossfade. No wipes, no glitch effects.

## 7. Layout

- Safe area: 96 px margin on all sides. Nothing important within 120 px of the bottom (YouTube's progress bar and captions).
- The loop diagram lives centered; evaporator always on the **left** (the cold side, inside the fridge), condenser always on the **right** (the hot side, the kitchen). Compressor on the bottom, expansion device on the top. This never flips.
- Labels sit outside the shape they name, never on top of a moving element.

## 8. 3D hero shots (Blender)

Used for one or two shots only (e.g. the reveal of the condenser coil behind a real-looking fridge). The 2D animation must carry the video if 3D is cut.

- Same palette: chalk cabinet, `panel` floor, `grid` wall, `heat` emission on hot parts, `cold` light from the interior.
- Cycles, CPU, denoised; slow camera orbits only.
- A 3D shot must cut cleanly to its 2D diagram counterpart (same colors in the same places).

## 9. Audio pairing

- Narration always on top: music ducked under voice with a sidechain compressor, master at -14 LUFS integrated, -1.5 dBTP.
- SFX are sparse and literal (compressor hum, a hiss at the expansion device), Freesound CC0 only.

## 10. Thumbnails

- `bg` background, one object, one color story (an orange-glowing fridge, or a fridge with a visible heater), max 4 words.
- Tease the question, don't answer it.
