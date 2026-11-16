"""Storyboard source for P3, how trees lift water (v1, 2026-11-16).
build_scenes.py turns this into scenes.json, timing every scene from the narration's word timestamps.
Anchors are the first words of the scene's narration, lowercase, as spoken (no digits: the word timestamps spell numbers
the way Whisper hears them, so anchors avoid numbers).

Fields as in P2, plus tool "footage": public-domain video (research/assets.json id in `asset`), trimmed into
scenes/footage/<id>.mp4 and composited under the 2D overlay exactly like a Blender hero (Motion Canvas Video nodes
freeze headlessly).

Colour meanings for this episode (style bible: meanings never change):
  chalk   structure: wood, pipes, leaves, the tree, the building; water is chalk too (translucent fill), NEVER blue
  violet  the pull: tension in the water column, the curved menisci that pull, the "rope"
  orange  heat only: the sun's energy driving evaporation (S33, S44); nowhere else
  muted   failed attempts, air-filled (embolised) pipes, dead leaves
  no arrowheads (they mean heat); direction by motion, dashes and travelling dots.
Locator: a small chalk tree in the corner with the current zoom boxed (trunk / wood / leaf / pipe).
Michael's standing notes: hook first (no photo/footage before the sting), 1 s beat after the first line, sting after S04,
named people get a who-were-they line (Torricelli, Dixon, Joly are named; nobody else).
"""

SCENES = [
    # ---------------------------------------------------------------- 1. cold open: the brief
    dict(id="S01", beat=1, anchor="here's an engineering challenge", tool="motion-canvas",
         visual="Dark slate, a chalk blueprint sheet slides in: 'THE BRIEF'. During the 1 s beat only the title sits there. Then three spec lines write themselves; beside them a 30-storey building silhouette grows from the baseline, a dashed '10 m' line marks its lower floors.",
         changes=["building grows and spec 1 on 'thirty-storey building'", "spec 2 on 'no pump'", "spec 3 and 10 m line on 'suck it up'"],
         text=["THE BRIEF", "1. Lift water above 30 storeys", "2. No pump, no motor, no moving parts", "3. No suction", "10 m"], facts=["1.5", "1.6", "2.1"], asset=None),
    dict(id="S02", beat=1, anchor="sounds impossible", tool="motion-canvas",
         visual="A chalk window frame; outside it a chalk tree in leaf, a chalk sun outline above. Inside the trunk, faint violet dashes rise steadily: the job being done, quietly.",
         changes=["window and tree on 'tree outside your window'", "violet dashes rise in the trunk on 'right now'"],
         text=["right now"], facts=["1.6", "1.7"], asset=None),
    dict(id="S03", beat=1, anchor="the tallest tree on earth", tool="blender",
         visual="HERO 1 (3D). A stylised chalk coast redwood beside the 30-storey building and a glowing 10 m line; the camera starts at the base and rises up the trunk past the building's roof to the crown. 2D overlay: 'Hyperion · coast redwood · ≈ 116 m'.",
         changes=["camera rises on 'hyperion'", "height label on 'metres up'"],
         text=["Hyperion", "coast redwood", "≈ 116 m"], facts=["1.1"], asset=None),
    dict(id="S04", beat=1, anchor="so let's try to solve it", tool="motion-canvas",
         visual="The brief sheet returns with three empty boxes: 'Attempt 1', 'Attempt 2', 'Attempt 3'. Ends on the slate ground for the intro sting.",
         changes=["three boxes on 'every obvious answer'"], text=["Attempt 1", "Attempt 2", "Attempt 3"], facts=[], asset=None),

    # ---------------------------------------------------------------- 2. attempt one: suck it up
    dict(id="S05", beat=2, anchor="first idea put a pump", tool="motion-canvas",
         visual="Attempt 1 box fills: 'SUCK IT UP'. A chalk well: a long pipe down into water, a hand pump at the top. The handle works; water (chalk fill) rises in the pipe.",
         changes=["water starts rising on 'like a straw'"], text=["Attempt 1: suck it up"], facts=[], asset=None),
    dict(id="S06", beat=2, anchor="people tried this for centuries", tool="archival",
         visual="Guericke's Magdeburg hemispheres plate (1672), slow push-in; chalk frame and credit. Sets the 1600s and the vacuum.",
         changes=["push-in on 'pump makers'"], text=["Otto von Guericke, 1672 (public domain)"], facts=["2.3"], asset="H1 Magdeburg hemispheres plate, Guericke 1672, Commons File:Magdeburg.jpg"),
    dict(id="S07", beat=2, anchor="their suction pumps would not raise", tool="motion-canvas",
         visual="Back to the well pump: the water column rises and stops dead at a line, however hard the handle works. Line labelled '18 braccia ≈ 10-11 m'.",
         changes=["water stops at the line on 'eighteen braccia'"], text=["≈ 18 braccia", "≈ 10-11 m"], facts=["2.3"], asset=None),
    dict(id="S08", beat=2, anchor="galileo puzzled over the problem", tool="motion-canvas",
         visual="A chalk note card: 'Galileo, 1630' with a question mark; on 'couldn't explain it' the card dims to muted.",
         changes=["card dims on 'couldn't explain it'"], text=["Galileo, 1630", "no explanation"], facts=["2.3"], asset=None),
    dict(id="S09", beat=2, anchor="the answer came in the sixteen-forties", tool="motion-canvas",
         visual="Torricelli's tube: a glass tube upside-down in a dish of mercury, the column stops; the space above it empty. Label 'Torricelli, 1643-44 · Galileo's successor in Florence'.",
         changes=["tube draws on 'torricelli'"], text=["Evangelista Torricelli, 1643-44", "Galileo's successor in Florence"], facts=["2.3", "A1"], asset=None),
    dict(id="S10", beat=2, anchor="a suction pump doesn't really pull", tool="motion-canvas",
         visual="The well again, now with the air drawn as a stippled chalk blanket pressing on the open water. As the pressure above the column drops, the blanket's push drives the water up the pipe (dots travel down outside, water rises inside).",
         changes=["pressure above drops on 'lowers the pressure'", "stipple presses on 'weight of the air'"], text=["the air pushes", "low pressure"], facts=["2.2", "2.3"], asset=None),
    dict(id="S11", beat=2, anchor="and air can only push so hard", tool="motion-canvas",
         visual="A balance: a tall stippled air column on one pan vs a water column on the other, level at ≈ 10 m. On 'perfect vacuum' the space above the water clears to nothing; the column doesn't move.",
         changes=["balance settles on 'ten metres tall'", "vacuum clears on 'perfect vacuum'"], text=["≈ 10 m at sea level", "perfect vacuum"], facts=["2.1", "2.2"], asset=None),
    dict(id="S12", beat=2, anchor="so suction has a hard ceiling", tool="motion-canvas",
         visual="The scale view: the 10 m line, then the chalk redwood outline towering past it to 116 m; a '×10+' bracket. Attempt 1 box gets a muted 'failed' stamp.",
         changes=["tree towers on 'ten times higher'", "failed stamp on 'isn't sucking'"], text=["10 m", "≈ 116 m", "×10+", "failed"], facts=["2.1", "2.4"], asset=None),

    # ---------------------------------------------------------------- 3. attempt two: push from below
    dict(id="S13", beat=3, anchor="next idea forget the top", tool="motion-canvas",
         visual="Attempt 2 box: 'PUSH FROM BELOW'. A chalk root system in section; tiny chalk dots (minerals) packed into the central pipe, water follows (inflow lines), a small pressure gauge at the stem base rises. A moon icon: mostly at night.",
         changes=["minerals pack in on 'pack minerals'", "water follows on 'osmosis'", "moon on 'mostly at night'"], text=["Attempt 2: push from below", "minerals in, water follows"], facts=["3.1"], asset=None),
    dict(id="S14", beat=3, anchor="you can see it on a still", tool="motion-canvas",
         visual="A grass blade at night, close: droplets bead and grow at the tip and edges. Label 'guttation' and, small, 'not dew'.",
         changes=["droplets form on 'push droplets'", "label on 'guttation'"], text=["guttation", "not dew"], facts=["3.2"], asset=None),
    dict(id="S15", beat=3, anchor="and in spring a cut birch", tool="motion-canvas",
         visual="A cut birch branch (chalk, birch-bark dashes) dripping sap; a vine cane beside it dripping.",
         changes=["drips on 'drip sap'"], text=["birch", "grapevine", "spring"], facts=["3.3"], asset=None),
    dict(id="S16", beat=3, anchor="maple syrup by the way", tool="archival",
         visual="USFS maple sap tubing lines in a sugarbush, slow drift; overlay 'maple: freeze-thaw inside the trunk, not the roots'.",
         changes=["overlay on 'freezing and thawing'"], text=["maple sap: freeze-thaw in the trunk", "USDA Forest Service (public domain)"], facts=["3.4"], asset="W5/W6 USFS maple sap lines (DVIDS)"),
    dict(id="S17", beat=3, anchor="but root pressure is weak", tool="motion-canvas",
         visual="The scale view: the root push reaches a few storeys up the chalk redwood and stops; the rest of the tree towers above it.",
         changes=["push stops low on 'worth of push'", "tree towers above on 'tall tree'"], text=["root push: a few storeys"], facts=["3.5"], asset=None),
    dict(id="S18", beat=3, anchor="and when scientists measure the water", tool="motion-canvas",
         visual="A pressure gauge clipped to a trunk on a sunny day: the needle swings through zero into a violet negative zone. Attempt 2 box: muted 'failed' stamp on 'pulled'.",
         changes=["needle below zero on 'pushed at all'", "violet zone and failed stamp on 'being pulled'"], text=["0", "pulled"], facts=["3.7"], asset=None),

    # ---------------------------------------------------------------- 4. attempt three: thin pipes
    dict(id="S19", beat=4, anchor="third idea capillary action", tool="motion-canvas",
         visual="Attempt 3 box: 'THIN PIPES'. Glass tubes of decreasing width standing in a dish; water climbs higher in narrower tubes.",
         changes=["water climbs on 'climbs up it'", "narrowest tube highest on 'the higher it goes'"], text=["Attempt 3: thin pipes", "narrower = higher"], facts=["4.1"], asset=None),
    dict(id="S20", beat=4, anchor="and a tree is full of thin tubes", tool="blender",
         visual="HERO 2 (3D). Camera pushes into a chalk trunk cross-section: growth rings, then a bundle of long thin pipes (tracheids) with pits along their sides, running up out of frame. Overlay labels 'xylem'.",
         changes=["push into the wood on 'xylem'"], text=["xylem", "microscopic pipes"], facts=["4.2", "9.1"], asset=None),
    dict(id="S21", beat=4, anchor="but they're not thin enough", tool="motion-canvas",
         visual="Two scale bars beside a millimetre ruler: 'narrowest ≈ a few hundredths of a mm', 'widest ≈ 0.5 mm'.",
         changes=["narrow bar on 'few hundredths'", "wide bar on 'half a millimetre'"], text=["≈ 0.01-0.06 mm", "up to ≈ 0.5 mm", "1 mm"], facts=["4.2"], asset=None),
    dict(id="S22", beat=4, anchor="in tubes that size", tool="motion-canvas",
         visual="Back to the scale view: capillary rise reaches centimetres to a few metres at the redwood's base; a 'needed: 100 m' bracket, and a tube shrinking 100+ times narrower.",
         changes=["rise bars on 'few metres at most'", "tube shrinks on 'times narrower'"], text=["cm to a few m", "needed: 100 m", "≈ 30× narrower"], facts=["4.3"], asset=None),
    dict(id="S23", beat=4, anchor="so three good ideas", tool="motion-canvas",
         visual="The brief: all three attempt boxes stamped 'failed' (muted). Then a single violet thread rises the full height of the chalk redwood outline.",
         changes=["third stamp on 'three failures'", "violet thread rises on 'gets there'"], text=["failed", "failed", "failed"], facts=["1.1"], asset=None),

    # ---------------------------------------------------------------- 5. nature's answer: pull from the top
    dict(id="S24", beat=5, anchor="the explanation most scientists accept", tool="motion-canvas",
         visual="Two name cards, no portraits: 'Henry Dixon · botanist' and 'John Joly · physicist', under 'Trinity College Dublin · 1890s'.",
         changes=["Dixon card on 'henry dixon'", "Joly card on 'john joly'"], text=["Henry Dixon · botanist", "John Joly · physicist", "Trinity College Dublin · 1890s"], facts=["5.1"], asset=None),
    dict(id="S25", beat=5, anchor="a key clue came from experiments", tool="motion-canvas",
         visual="A tall cut stem standing in a beaker labelled 'poison'; a chalk level line in the stem keeps rising. On 'leaves were killed' the leaves go muted and the level stops.",
         changes=["level keeps rising on 'drawing water up'", "leaves mute and flow stops on 'leaves were killed'", "'engine: the leaves' on 'in the leaves'"], text=["poison", "the engine is in the leaves"], facts=["5.2", "5.3"], asset=None),
    dict(id="S26", beat=5, anchor="inside every leaf water evaporates", tool="blender",
         visual="HERO 3 (3D), the signature shot. A leaf cross-section: cuticle, palisade columns, spongy cells with air spaces, a stoma with two guard cells on the underside; chalk vapour wisps drift out of the stoma. The camera pushes into a wet cell wall: tiny curved water surfaces in its pores glow violet and pull.",
         changes=["vapour leaves the stoma on 'stomata'", "push into the wall on 'cell walls'", "menisci glow violet on 'enormous force'"], text=["stoma", "cell wall pores ≈ 1/100,000 mm"], facts=["5.3", "4.4", "9.2"], asset=None),
    dict(id="S27", beat=5, anchor="as water evaporates it tugs", tool="blender",
         visual="HERO 4 (3D). Inside one pipe: the water column as a chain of linked molecule beads (chalk), the top bead lifted away by evaporation; the whole chain shifts up together, a violet tension glow along it, all the way down to the roots.",
         changes=["top bead lifts on 'tugs'", "chain glows violet on 'cling to each other'", "whole column rises on 'like a rope'"], text=["cohesion", "a rope of water"], facts=["5.3", "5.4", "5.5"], asset=None),
    dict(id="S28", beat=5, anchor="it's called the cohesion-tension theory", tool="motion-canvas",
         visual="Title card 'COHESION-TENSION' with two lines: 'cohesion: water clings to water' and 'tension: pulled from the top' (violet).",
         changes=["title on 'cohesion-tension'"], text=["COHESION-TENSION", "cohesion: water clings to water", "tension: pulled from the top"], facts=["5.1", "5.4"], asset=None),
    dict(id="S29", beat=5, anchor="and it means the water inside", tool="motion-canvas",
         visual="A vertical pressure scale: 'air around you' at the top, 'zero' (vacuum), then below zero a violet 'negative: stretched' zone. A chalk droplet slides down the scale to ≈ 20 atmospheres of pull.",
         changes=["droplet passes zero on 'below zero'", "settles on 'twenty times harder'"], text=["air ≈ 1 atm", "0", "negative", "≈ 20 atm of pull"], facts=["5.5", "5.6"], asset=None),
    dict(id="S30", beat=5, anchor="pure water can take it", tool="motion-canvas",
         visual="The scale extends far down: a muted 'lab: water snaps' band many times deeper than the tree's pull.",
         changes=["lab band on 'stretched much harder'"], text=["lab limit", "tree"], facts=["5.7"], asset=None),
    dict(id="S31", beat=5, anchor="scientists found a way to measure", tool="motion-canvas",
         visual="Pressure chamber diagram: a leafy twig sealed in a steel chamber, cut end poking out of the lid; gas pressure gauge climbs until a chalk sap bead appears at the cut.",
         changes=["chamber seals on 'cut twig'", "gauge climbs on 'raise the pressure'", "bead appears on 'sap appears'"], text=["the pressure bomb, 1965", "balancing pressure = the pull"], facts=["5.8"], asset=None),
    dict(id="S32", beat=5, anchor="you can even watch it work", tool="motion-canvas",
         visual="A trunk cross-section with a dendrometer band; a 24-hour trace: diameter dips by day (sun), recovers at night (moon). Exaggerated, labelled 'tenths of a millimetre'.",
         changes=["trace dips on 'shrinks'", "recovers on 'swells back'"], text=["day", "night", "a fraction of a millimetre"], facts=["5.9"], asset=None),
    dict(id="S33", beat=5, anchor="and the energy", tool="motion-canvas",
         visual="The sun (orange: heat) over the leaf; orange warmth drives chalk vapour off; label 'the sun and dry air do the work'; a small meter 'tree's own energy on the lift: 0'.",
         changes=["sun warms on 'the sun'", "meter on 'none of its own energy'"], text=["the sun and dry air do the work", "tree's own energy: 0"], facts=["5.10", "1.6"], asset=None),
    dict(id="S34", beat=5, anchor="it took the best part of a century", tool="motion-canvas",
         visual="A short timeline: 1890s (Dixon & Joly) → 1965 (pressure chamber) → today; small muted 'doubters' tick marks fading along it.",
         changes=["timeline on 'century'"], text=["1890s", "1965", "today"], facts=["5.11"], asset=None),

    # ---------------------------------------------------------------- 6. when the rope snaps
    dict(id="S35", beat=6, anchor="but stretched water is risky water", tool="blender",
         visual="HERO 5 (3D). Two neighbouring pipes under violet tension; in one, a bubble pops into existence and expands, the pipe fills with air (muted grey). In the pit between them, the plug (torus) slams shut against the opening, so the neighbour stays full.",
         changes=["bubble on 'snap'", "pipe greys on 'blocked'", "pit plug slams on (overlay timing, S37)"], text=["air bubble", "blocked"], facts=["6.1", "6.4"], asset=None),
    dict(id="S36", beat=6, anchor="scientists first picked up the sound", tool="motion-canvas",
         visual="A sensor clipped to a thin stem; a trace beside it showing sharp single pulses, each with a tiny bubble icon.",
         changes=["clicks on 'tiny clicks'", "pulses on 'ultrasonic sensors'"], text=["1960s: clicks", "lab tests: one pulse, one bubble"], facts=["6.3"], asset=None),
    dict(id="S37", beat=6, anchor="so trees are built to contain", tool="motion-canvas",
         visual="Close diagram of a pit: water dots pass through the porous membrane; an air front stops at it. Then a conifer pit: rim (margo) and central plug (torus) shutting. Then a slider 'safety ↔ flow'.",
         changes=["water passes on 'water gets through'", "air stops on 'air doesn't'", "plug shuts on 'slams shut'", "slider on 'safety has a price'"], text=["pit membrane", "torus", "safer = harder to push through"], facts=["6.4"], asset=None),
    dict(id="S38", beat=6, anchor="and in a drought", tool="motion-canvas",
         visual="A bundle of chalk pipes under violet tension; as the pull strengthens, air pushes through one pit, then the next: pipe after pipe turns grey (muted) until the bundle is mostly grey.",
         changes=["first pipe greys on 'forcing its way'", "greying spreads on 'pipe after pipe'", "bundle mostly grey on 'shuts down'"],
         text=["drought"], facts=["6.1", "6.2"], asset=None),
    dict(id="S38b", beat=6, anchor="that's one of the main ways", tool="archival",
         visual="USGS photo of giant sequoia foliage dieback in the 2014 drought, slow push-in (W1 USFS photo refused the download, 403).",
         changes=["push-in on 'water lines break'"], text=["Giant sequoia dieback, 2014 drought", "N. Stephenson, USGS (public domain)"], facts=["6.6"], asset="W2 USGS sequoia dieback 2014"),
    dict(id="S39", beat=6, anchor="whether a tree can ever clear", tool="motion-canvas",
         visual="A trunk cross-section: older rings grey (air-filled) stay grey; a new chalk ring grows at the outside and its pipes fill with water.",
         changes=["new ring grows on 'grow new wood'"], text=["new wood"], facts=["6.7"], asset=None),

    # ---------------------------------------------------------------- 7. the ceiling
    dict(id="S40", beat=7, anchor="this design has one more consequence", tool="motion-canvas",
         visual="The redwood scale view with a tension ladder up the trunk: one violet tick per 10 m, '+1 atm per 10 m'; the crown glows driest.",
         changes=["consequence card on 'limit on how tall'", "ticks climb on 'every metre'", "crown highlights on 'thirstiest'"], text=["+1 atmosphere every 10 m"], facts=["7.2", "7.3"], asset=None),
    dict(id="S41", beat=7, anchor="a team of scientists climbed", tool="footage",
         visual="NPS 'Redwood Trunk' B-roll: the slow tilt up a 300 ft redwood. Overlay: 'Koch et al., 2004'.",
         changes=["overlay on 'climbed'"], text=["Redwood National and State Parks (NPS)"], facts=["7.1"], asset="V1 NPS Redwood Trunk B-roll (G Litten)"),
    dict(id="S42", beat=7, anchor="near the top the leaves were", tool="motion-canvas",
         visual="Two chalk shoot drawings: low in the tree, broad flat leaves; at the top, small, thick, tightly packed leaves. Label 'water-starved'.",
         changes=["top shoot on 'small thick'", "label on 'water-starved'"], text=["low: broad and flat", "top: small, thick, packed"], facts=["7.3"], asset=None),
    dict(id="S43", beat=7, anchor="following that trend upward", tool="blender",
         visual="HERO 6 (3D). The chalk redwood grows upward toward a translucent ceiling band (122-130 m); the trend line extends dashed; Hyperion's height marker at 116 m just under the band.",
         changes=["band on 'no taller than'", "dashed trend on 'prediction'", "Hyperion marker on 'just under it'"], text=["≈ 122-130 m (predicted)", "Hyperion ≈ 116 m"], facts=["7.1", "7.4", "7.5", "1.1"], asset=None),

    # ---------------------------------------------------------------- 8. close
    dict(id="S44", beat=8, anchor="a big tree can move hundreds", tool="footage",
         visual="NPS 'Sun in Redwood Canopy' B-roll. Overlay: 'hundreds of litres on a summer day' then 'almost all of it evaporates'.",
         changes=["second line on 'simply evaporates'"], text=["hundreds of litres a day", "almost all of it evaporates", "NPS (public domain)"], facts=["8.1", "8.2"], asset="V4 NPS Sun In Redwood Canopy B-roll"),
    dict(id="S45", beat=8, anchor="so the next time you walk", tool="footage",
         visual="NPS 'Fog in Redwood Trees' B-roll, quiet.", changes=[], text=["NPS (public domain)"], facts=[], asset="V2 NPS Fog in Redwood Trees B-roll"),
    dict(id="S46", beat=8, anchor="columns of water stretched tight", tool="blender",
         visual="HERO 7 (3D, reuses HERO 1). The chalk redwood from the cold open, now with violet threads glowing up the trunk from roots to crown; the 10 m line faint at its base.",
         changes=["threads glow on 'stretched tight'", "10 m line on 'no pump can beat'"], text=[], facts=["5.5", "2.4"], asset=None),
    dict(id="S47", beat=8, anchor="the tallest pump on earth", tool="motion-canvas",
         visual="The wordmark settles (as P1/P2's closing); 'Next time' card.",
         changes=["wordmark on 'designed otherwise'"], text=["DESIGNED OTHERWISE"], facts=["1.6"], asset=None),
]
