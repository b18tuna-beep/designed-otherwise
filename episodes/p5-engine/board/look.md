# P5 look: one cycle in slow motion

Binding on the storyboard director. Base rules: `style/style-bible.md`, values from `style/tokens.json`, never hard-coded. Script: `episodes/p5-engine/script/script.md` (v1, approved). No P4 `look.md` exists in the repo; the bible and the quality bar were the reference.

## 1. Visual thesis
A dark whiteboard, one cylinder, and a clock that never lies. Mood: patient and slightly accusing. The cylinder is drawn in chalk and stays almost empty of colour for most of the video, so the one stroke that carries orange and lime is felt as rare. Pacing is slow and mechanical: constant crank speed within a stroke, no cutting away from the cylinder during a stroke except for the labelled 2D asides. Texture: none beyond chalk linework and flat fills; a faint `grid` crank-angle scale behind the cutaway. The clock and dial sit in the corner the whole time, so the viewer can always see how much of the cycle is idle.

## 2. Colour meanings (episode; all tokens already exist)
| Meaning | Token | Rule |
| --- | --- | --- |
| Structure: block, piston, rod, crank, valves, cam, plug body | `chalk` | outlines `structure` 4 px; cutaway interior `panel` |
| Heat, flame, hot exhaust, lost energy | `heat` (`heat_peak` at flame core, `heat_soft` for burnt-gas fill) | the only colour for combustion and the bill. Heat arrows are the only arrowheads |
| The spark | `electric` (lime) | the spark only: the arc and a 6 frame glow. Nothing else in the video is lime |
| Moving air-fuel charge | `refrigerant` token, called "charge" here | violet dots/texture inside the cylinder and ports; density shows compression, never brightness |
| Coasting strokes, stored momentum, inactive parts | `muted` | dial arcs for intake, compression, exhaust; flywheel momentum trail (dashes, no arrowheads); other cylinders not currently pushing |
Burnt gas is never violet: the charge turns to `heat_soft` behind the flame front, then drifts out as orange-edged particles. Fresh charge ahead of the front stays violet.

## 3. Persistent overlay: clock and crank-angle dial (2D, Motion Canvas `overlays`)
- Top right inside the 96 px safe margin. Plex Mono 52 px time `0.043 s`, 34 px `CRANK 180°`. Dial about 200 px diameter: `grid` ring split into four 180° arcs, a chalk hand sweeping at constant speed. Active stroke arc is `chalk` at `emphasis` 6 px; the other three arcs are `muted` at `structure` 4 px. The power arc stays chalk, not orange: the dial reports position, not energy.
- Convention: 0° is the start of intake (script says 0 to 180 intake). Label it once in the opening: `0° = START OF INTAKE`.
- Clock values at stroke ends: 0.043 (intake), 0.086 (compression), 0.129 (power), 0.171 (exhaust). Script gives 700 rpm; run the clock at 0.238 ms per degree, so intermediate frames show true interpolated values. The cold open starts it at `0.000 s`.
- Chapter 6 (history): clock and hand freeze at 0.129 s and dim to `muted`; a 34 px `CLOCK STOPPED` tag. It resumes at full chalk when the script says "Back to the clock". The cylinder hero is hidden during chapter 6 (name card and patent drawing take the screen), so no shot shows a moving crank beside a frozen clock.
- The dial never changes size or position. It is the one constant that carries the video; do not animate it in or out except at the cold open (enter) and the close (hold at 0.171, hand back to 0).

## 4. Shot vocabulary
1. **Cutaway hero (3D, fixed camera).** Side section of one cylinder. Locked camera with a max 8 percent push per stroke. One stroke per clip, reused on each chapter. Motion: crank turns at constant speed.
2. **Charge fill (2D inside the cutaway frame).** Violet dots enter through the intake valve, density rises on compression. Used when the 3D clip is dimmed to a still for the explanation.
3. **Flame front (3D hero).** Spark flash, kernel, a wrinkled orange front spreading through violet. Camera tighter on the combustion chamber.
4. **Firing-order crank (3D hero).** Four-cylinder crank seen from above/side; one throw lit at a time (chalk full, the others `muted`).
5. **Pressure trace (2D).** One-cycle pressure line, chalk, with the power stroke segment thickened. Cursor synced to the dial hand.
6. **Part isolation (2D over frozen 3D still).** Flywheel, valve and cam each dimmed in/out per bible rule 8 (one subject at a time). Label outside the shape.
7. **Energy bill bar (2D).** Horizontal bar, chalk segment for work, `heat` segments for exhaust and cooling, qualifiers beside the numbers ("at best", "12 to 30 percent, depending on driving").
8. **Name card (2D).** Chalk title on `bg`: name, role, year. Used for Beau de Rochas. Otto card may carry the public-domain patent drawing if verified.
9. **Knock vs smooth burn (2D).** Two side-by-side chamber sections: front spreads cleanly versus a second orange pocket igniting ahead of it.
10. **Locator inset.** 240 px cylinder thumbnail with the active part highlighted, used whenever a 2D aside takes the screen, so the cylinder stays findable.

## 5. Hero moments
**H1. The cutaway at the spark (power stroke start).** Whole cylinder in chalk, still and nearly colourless; the lime arc fires and the first orange kernel appears. Lands because everything before it was empty of colour, and the dial hand is at the start of the chalk-thick arc.
**H2. Flame front sweeping the chamber.** Orange front with wrinkled edge pushes through violet charge, burnt gas goes `heat_soft`, the piston drops and the flywheel gets a muted momentum trail. Lands on "a flame, not an explosion".
**H3. Four crank throws, one lit.** Firing order 1-3-4-2: one throw chalk-bright and pushing, three `muted`, rotating the lit one every 180°. The viewer sees that the engine is always carried by somebody. Lands on "one pushing, while the others breathe in, squeeze and breathe out".
Supporting: the clock hitting `0.171 s` against the dial's full revolution in the close.

## 6. Blender budget (render cost: about 12 s per frame at 960x540, 12 samples)
| Shot | Length | Frames @30 | Notes |
| --- | --- | --- | --- |
| Cutaway, intake | 5 s | 150 | reused: compression 5 s, power 5 s, exhaust 5 s (new frames each, 600 total) |
| Flame front close-up | 6 s | 180 | emission shader only; no volumetrics |
| Four-cylinder crank | 7 s | 210 | simplified: crank and pistons, no block |
Total about 33 s, 990 frames, about 3.3 runner hours; split across a 30 runner matrix (about 7 min each). Each stroke clip is an independent matrix job so a failed clip re-renders alone. View transform Standard. The slow-motion illusion comes from the clock, so cut clips at constant crank speed and trim; do not render longer takes than listed. If Actions are down, use the local bpy fallback at 50 percent.

## 7. Specific looks
- **Cutaway parts:** piston and rod chalk outlines on `panel`; crank and flywheel chalk; flywheel rim with 12 `muted` tick marks so rotation is readable; cam is a chalk lobed disc turning at half crank speed with a visible 2:1 label ("HALF SPEED") once; two valves chalk, lift shown by gap. Spark plug body chalk, electrode tip the only lime.
- **Valve timing:** intake opens slightly before top and closes after bottom (script 2.3): mark with a 34 px mono `OPEN` / `CLOSED` tag beside each valve, not by colour.
- **Compression:** violet dot count stays constant while volume shrinks, so density visibly rises. No colour change.
- **Exhaust:** orange-edged particles leave through the exhaust valve; a small heat arrow (the only arrowhead) at the exhaust port marks heat leaving, matching the bill beat. No arrows anywhere else, including intake direction and piston travel (use motion, dashes and a ghost trail).
- **Valve overlap:** both valves highlighted chalk emphasis for about 2 s, rest dimmed.
- **Beau de Rochas:** name card only. No portrait, no engraving of him (licence unverifiable). Text: `ALPHONSE BEAU DE ROCHAS`, `French engineer`, `1862: set out the cycle on paper`. Otto and Langen: patent drawing only if public-domain status is verified by the research agent; otherwise name card.

## 8. No-go
- Orange for anything but heat, flame, exhaust or lost energy; lime for anything but the spark (no highlights, no clock).
- Arrowheads other than heat. No arrows for piston motion or gas flow.
- Repeated slow zooms, spins, exploded views, shaking cameras or "blow-up" explosions: combustion is a spreading front, never a bang.
- A new colour for the power stroke; the dial and flywheel tell it, not a hue.
- Flat diagram as the thumbnail base; thumbnail uses the flame front on `bg`, four words max (packaging agent).
- A frame static longer than 8 s; a stroke on screen that does not match the dial and clock.
- Showing the clock moving during chapter 6, or hiding it for more than one 2D aside.
- Any portrait of Beau de Rochas.
- More than 7 words of on-screen text at once (clock and dial labels count; keep each under the limit).

## 9. Conflicts and decisions for the showrunner
1. Bible section 8 says 3D for one or two shots only. This brief asks for three Blender heroes; they are short and the 2D version of each can carry the video if 3D is cut. Needs a bible exception for P5.
2. Bible reserves violet for the refrigerant. P5 reuses the `refrigerant` token as the air-fuel charge. Recommend adding a `charge` alias in `tokens.json` (same hex) so code reads a name that matches the meaning; do not recolour.
3. The bible says "exactly three meaningful colors: heat, cold, refrigerant". P5 uses heat, violet and lime and never cold; blue is unused.
4. Clock is "real time" but the video runs 9 min for a 0.171 s cycle; the freeze in chapter 6 is the only stoppage and the dial still shows true angle.
