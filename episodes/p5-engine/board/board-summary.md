# P5 storyboard, checkpoint 3 (v1, 2026-11-25)

Script v1 as approved, timed to the narrated take (581.3 s of speech, 582.8 s with the closing hold). 90 scenes: 82 in 2D (Motion Canvas), 2 public-domain stills, 6 Blender hero scenes (3 heroes). Source: `board/scenes_src.py`; timing: `scenes/scenes.json`. Times below are on the narration timeline; in the final cut everything after 41.05 s moves 3.2 s later (intro sting).

**Animatic:** studio repo, branch `previews`, `board/p5-engine/animatic-p5-engine-720p.mp4` (9:46 with the sting; the 1080p copy could not go to a release from the Claude session and is rebuilt by `tools/board/cards.py` + `tools/board/animatic.py`).

**What to judge:** the order of beats, the pace, and the hook-to-sting hand-off. The animatic is a card board (on-screen text, planned changes, live clock and dial), not the final look: the 2D art and the 3D heroes are built after you approve.

## Beats
| Time | Beat | What is on screen |
| --- | --- | --- |
| 0:00 | Cold open, on you (S00a-g) | Chalk traffic light, lamp holds through the 1 s beat; a crank wheel at 700 per minute; "1 in 4 pushes", "carried"; a sixth-of-a-second ring; the clock and dial enter at 0.000 s. Clock on screen only from 0:35. Soft landing, then the intro sting at 0:41 |
| 0:41 | Set-up (S01-S06) | The cylinder, parts one at a time (piston, rod, crank, flywheel, valves, plug), 720 degrees, four strokes, one degree = 0.24 ms |
| 1:17 | Stroke 1, intake (S07-S16) | Hero H1 intake clip, "pushed in, not sucked", throttling and pumping losses, flywheel turns the crank, valve timing, camshaft at half speed, clock 0.043 s with "work made: 0" |
| 2:43 | Stroke 2, compression (S17-S33) | Hero H1 compression clip, compression ratio 10 to 12:1, knock, Mazda 14:1, what octane really measures, clock 0.086 s |
| 4:30 | The spark comes early (S34-S44) | Pressure trace, lime spark, hero H2 flame front, MIT burn curve, too late / too early, knock vs smooth, knock sensor |
| 5:38 | Stroke 3, power (S45-S55) | Hero H1 power clip, "only here: work", flywheel stores and returns, hero H3 four-throw crank firing 1-3-4-2, 6 and 8 cylinders, clock 0.129 s |
| 6:43 | Clock stopped: whose cycle? (S56-S67) | Clock frozen and dimmed, no cylinder on screen. Otto portrait card, Langen card, 1876, patent sheet, Beau de Rochas name card, 1886 revocation, layered charge |
| 8:05 | Stroke 4, exhaust (S68-S77) | Hero H1 exhaust clip, heat arrow at the port, valve overlap, energy bill bars (about a fifth, 12 to 30 percent, about 60 percent lost, a third at the crank), clock 0.171 s |
| 9:12 | Close (S78-S83) | One full ring, "only one pushing", the cycle repeating about six times a second, wordmark, end-screen space |

## Checks
- Longest stretch with no change on screen: **4.6 s** (S17); nothing over 8 s. 219 planned changes, most on a cue word. Longest scene: 15.0 s (S08, four cues).
- Pattern change at least every 20 to 30 s: yes (heroes at 1:17, 2:43, 4:45, 5:38, 6:16, 8:05; asides between).
- Named people: Otto (portrait card, "German gas-engine builder"), Langen (name card, "Otto's partner"), Beau de Rochas (name card only, no portrait). MIT, Mazda and the US DOE are organisations.
- Colours: orange only for heat, flame and the bill; lime only for the spark; violet for the charge; no cold blue. Heat arrows are the only arrowheads.
- Intro sting at the end of the cold open is in the animatic (cut at 41.05 s, 3.2 s).

## Decisions for you
1. **Clock in the spark chapter.** The approved script reads "nine hundredths" (0.086 s, end of compression) before the spark, which happens a few tens of degrees earlier. I made the spark chapter a labelled close-up ("ZOOM, last 30 degrees of compression") with the clock held at 0.086 s, so it does not run backwards. Say if you would rather the script changed.
2. **Otto portrait** is the public-domain c. 1868 photo (I1); the scout read its licence but did not open the image. Fallback is a name card like Beau de Rochas.
3. **Blender:** three heroes, 33 s of clips: H1 cutaway (4 stroke clips), H2 flame front, H3 four-throw crank. Every hero keeps its 2D fallback.

## For phase C (music)
`audio/music.json` in the studio job uses `cue / track / in / out / gain_db`, but `tools/audio/assemble.py` reads `[{"file", "from_beat"}]`. Phase C must convert it. Beats here: 1 cold open, 2 intake, 3 compression, 4 spark, 5 power, 6 clock stopped, 7 exhaust, 8 close. Mapping: Slow Morning from_beat 1, Blueprint 2, Mechanism 4, Station Wagon Sunday 5, Kitchen Table Hymn 6, Good Engineering 7 (beat 3 stays on Blueprint). The provisional in/out seconds do not match these beats: cold open runs to 41.05 s, not 35; Blueprint should run 41.05 to 270.4 s; Mechanism 270.4 to 338.2; Station Wagon Sunday 338.2 to 403.3; Kitchen Table Hymn 403.3 to 485.1; Good Engineering 485.1 to the end (add 3.2 s after the sting if the cues are on the final timeline).
