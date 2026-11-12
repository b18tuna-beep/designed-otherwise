# P2 inner ear: production plan (v1, 2026-11-12)

Narration v1: 9:50 (bm_george 1.0, 1,387 words). Storyboard: `scenes_src.py`, 41 scenes = 30 Motion Canvas (2D), 7 Blender heroes, 4 archival.
Format note: P1 was a paradox explained; P2 is a detective story (the dead ears that misled science, the amplifier predicted in 1948 and found in 1985). Intro sting at the end of the cold open (~0:33).

## Blender heroes (3D)
All built from the reference numbers in `research/assets.md` (cochlea ~2.5 turns, ~9 mm base, membrane ~3 cm unrolled, narrow/stiff base to wide/floppy apex; 1 row inner + 3 rows outer hair cells). Local `bpy` at 50% res + upscale, Standard view transform, as in P1.

| Hero | Scene | Shot | Notes |
|---|---|---|---|
| H1 | S13 | Cochlea shell rotates, then uncoils into a straight 3 cm tube with the membrane strip | The episode's signature shot. Procedural spiral (logarithmic, 2.5 turns) with a shape key to straighten. |
| H2 | S16 | Travelling wave rolls along the membrane ribbon, peaks, dies; two pitches | Wave driven by a shader/geometry-nodes displacement with a moving envelope; peak position = pitch. |
| H3 | S20 | Dolly along 1 row inner + 3 rows outer hair cells with stepped stereocilia tufts | Instanced cells; outer tufts in V/W formation. |
| H4 | S27 | Outer hair cells pump in sync with the wave; peak grows taller and sharper | Reuses H2 + H3; cell length animated in phase with the wave; violet pulse overlay in 2D. |
| H5 | S32 | Reverse wave runs back out (the emission) | Reuses H2 with reversed envelope; violet overlay. |
| H6 | S36 | Noise damage: outer tufts at the base splay and grey out, spreading; inner row stays | Reuses H3 with a material/shape change front moving along the rows. |
| H7 | S40 | Close: pull back from cells, membrane re-coils into the shell (H1 reversed), violet rings | Reuses H1/H3. |

Effort: H1 and H3 are new builds; H2/H4/H5/H6/H7 are variations. Estimated render time locally ~2-3 h total.

## Archival / public domain (verified in `research/assets.md`)
| Scene | Item | License |
|---|---|---|
| S01, S33 | Newborn OAE screening photos (U.S. Air Force, Samuel King Jr., 2011) | Public domain, cleared for release. Never show the baby's name. |
| S07 | Gray's Anatomy 1918, fig. 919 chain of ossicles (archive.org scan) | Public domain (1918) |
| S21 | Stereocilia scanning electron micrograph (NIDCD, Bechara Kachar) | Federal work, public domain |
Not usable (license): NIH "Journey of Sound" animation (YouTube-only copy), dancing outer hair cell clips (UCL), Békésy portraits. So the moving hair cell is our own animation.

## Sound design
- Click stimulus for the probe: synthesised (no licence needed).
- The ear's own tone (S34): synthesised from published values (steady pure tone at ~1-5 kHz), clearly labelled SIMULATION on screen the whole time; real emissions are far too quiet to hear.
- Music: YouTube Audio Library, same bed approach as P1; the intro uses the new eased transition (music out before, back in after).

## Colour meanings for this episode
chalk = structure and its vibration; violet = the working part (outer-hair-cell motor push, sound the ear makes); lime = electricity (hair-cell signal, nerve); orange stays reserved for heat (not used); blue stays reserved for cold (not used). No arrowheads.

## Open for Michael
1. The script (listen to the narration; that's the review per the playbook).
2. Storyboard direction: the 7 heroes above and the detective-story structure.
3. Title and thumbnail come after the alpha cut (his rule). Working title: "Your Ears Are Making Sound".
