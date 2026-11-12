# Fact check: P2 inner ear claims

This is an independent check of `claims.json` (40 claims). I did not read `dossier.md`. I opened every cited URL. Journal DOIs were read through Europe PMC (abstracts, and full text where it is open access). Pages that blocked direct fetch (ASHA, Britannica, StatPearls, NIOSH, Purves) were read with WebFetch. Each claim's safe wording, allowed numbers and confirmed sources are in `factcheck.json`, and the script may use only each claim's `safe_wording` and `allowed_numbers`.

Totals: 13 PASS, 27 PASS_WITH_EDIT, 0 FAIL.

## Rules applied

- **Same-source rule.** Each of these counts as one source: NIDCD pages; cochlea.eu pages; HyperPhysics pages; the Northwestern release and the Zheng et al. paper (same group). The Daily Northwestern counts as an independent second source for the prestin name.
- **Sources that could not be fully re-opened.**
  - Robles & Ruggero 2001 (PMC page blocked by reCAPTCHA). Only the abstract was read, through NCBI E-utilities. Body quotes (gain of 78/81 dB, "disappearing after death", Gold 1948, "Kemp revived Gold", exponential stiffness) were not re-verified. Every claim that used them now rests on other sources.
  - StatPearls "Otoacoustic Emissions" (NCBI Bookshelf blocked). Its summary was read through the Europe PMC record MED 35593808. Body lines (over 30 dB HL, 1-9% tinnitus, middle-ear effusion, newborn techniques) were not re-verified and are not relied on.
- **New sources added** to cover single-source gaps: Anthwal 2013, Animal Diversity Web, cochlea.eu middle-ear and regeneration pages, Kemp 2002 review, Physics World, Purdue, Hearing Health Matters, Royal Society, the Kemp interview in ENT & Audiology News, NIDCD auditory neuropathy page, EPA 1974, Deiters 2019, Okoruwa 2008, Tan 2012, Daily Northwestern and Cleveland Clinic.

## Researcher's memory flags

| flag | result |
| --- | --- |
| (a) Only malleus and incus come from the jaw joint | VERIFIED. Anthwal et al. 2013: malleus and incus "are homologous to the quadrate and articular"; reptiles and birds have only the stapes/columella. Animal Diversity Web agrees. The UQ phrase "three bones of the ... jaw joint" is wrong; don't paraphrase it. |
| (b) Thomas Gold, physicist, 1948 | VERIFIED. "Thomas Gold": Dallos 2008, Purdue, HHM ("Tommy" in Physics World). Physicist, later an astrophysicist: Purdue, HHM, Physics World. Cambridge, 1948. Part of the 1948 work was with R.J. Pumphrey. |
| (c) David Kemp British, trained as a physicist | Physicist VERIFIED: his own interview (PhD in radio-physics, geophysics research) and the Royal Society profile (Professor of Auditory Biophysics). "British" only PARTLY verified: Wikipedia states it, and his London education and career and his CBE are consistent with it. Prefer "a physicist working in London". |
| (d) Békésy used cadaver ears; sharp tuning disappears after death | VERIFIED. Cadavers: cochlea.eu, Physics World, Purdue. Loss after death: Physics World ("When the power supply of the ear is interrupted, this amplification ceases"), Robles abstract ("highly labile"), Dallos (post-mortem comparison). The live evidence is from animals. |

## Summary table

| id | verdict | reason |
| --- | --- | --- |
| 1.1 | PASS_WITH_EDIT | 98.2% (CDC) and "about 98%" (NIDCD) agree; NIDCD's "before 1 month" overstates (about 95% of births by 1 month); "before discharge" is a guideline, not a rate |
| 1.3 | PASS | NIDCD, ASHA, StatPearls summary; keep "echo" as an analogy |
| 1.4 | PASS_WITH_EDIT | "shows ... working" becomes "is a sign that"; middle-ear path confirmed (Kemp 2002, ASHA) |
| 1.5 | PASS_WITH_EDIT | Neuropathy blind spot confirmed (JCIH + NIDCD auditory neuropathy page); NICU rule is JCIH only, so say "some babies" |
| 1.6 | PASS_WITH_EDIT | CDC 1.8 vs NIDCD 2-3 per 1,000; say "about two in every thousand" |
| 2.1 | PASS | NIDCD, HyperPhysics, Purves, Cleveland Clinic |
| 2.2 | PASS | 99.9% now two sources (Purves, cochlea.eu) |
| 2.3 | PASS_WITH_EDIT | Area ratio 15 (HyperPhysics) vs 20 (Puria, cochlea.eu); lever ratio conflicts (1.3 / about 2 / about 3), so give no lever number |
| 2.4 | PASS_WITH_EDIT | 24-29 dB (Kim & Koo), 27 dB (Goode), 28 dB (cochlea.eu) agree on about twentyfold; Purves "200-fold" dropped; no peak-frequency number |
| 2.5 | PASS | Smallest bone (StatPearls, Cleveland Clinic); about 3 mm (Guinness, CC "a few millimeters") |
| 2.6 | PASS_WITH_EDIT | 20 ms is Puria only, dropped; "can't be relied on for sudden bangs" backed by Puria + Deiters 2019 |
| 2.7 | PASS_WITH_EDIT | "Two of three bones from the jaw joint" verified; 320 million years (UQ only) dropped |
| 3.1 | PASS | Britannica, Heliyon, NIDCD |
| 3.2 | PASS_WITH_EDIT | "About three centimetres" (Britannica, Alexiades); outer wall about 4 cm |
| 3.3 | PASS_WITH_EDIT | Qualitative gradient OK; width numbers (Britannica only) and 100-fold stiffness (Kim & Koo only) dropped |
| 3.4 | PASS | Robles abstract, NIDCD, cochlea.eu; 20-20,000 Hz (cochlea.eu + Northwestern) |
| 3.5 | PASS | Robles abstract, NIDCD, cochlea.eu |
| 3.6 | PASS | Nobel, cochlea.eu, Physics World, Purdue |
| 3.7 | PASS_WITH_EDIT | Say "living animals"; "fades when the animal dies"; no dates for the live measurements (Physics World and cochlea.eu conflict) |
| 3.8 | PASS_WITH_EDIT | Gold verified; "confirmed three decades later" becomes "largely forgotten for about thirty years" |
| 4.1 | PASS_WITH_EDIT | Outer-hair-cell count 11,000 vs 12,000; rows "3 or 4"; use "about three times as many" and "usually three rows" |
| 4.2 | PASS | 95% / 5%: cochlea.eu + two PMC reviews |
| 4.3 | PASS | NIDCD, Robles abstract, Physics World |
| 4.4 | PASS | Brownell 1985 abstract, Dallos |
| 4.5 | PASS | Nature 2000; "presto" name: Northwestern release + Daily Northwestern |
| 4.6 | PASS_WITH_EDIT | 79 kHz and 60,000/s are different things; say "tens of thousands of times a second, in lab tests" |
| 4.7 | PASS_WITH_EDIT | "Roughly a hundredfold" (40-50 dB: Liberman, cochlea.eu, Dallos); Robles 35-81 dB not re-opened |
| 4.8 | PASS_WITH_EDIT | Mouse only; "is the amplifier" becomes "is central to the amplifier" (Dallos notes debate) |
| 4.9 | PASS_WITH_EDIT | Prestin as a mammal-lineage motor now backed by Okoruwa 2008, Tan 2012 and Dallos; link to high-frequency hearing stays hedged |
| 5.1 | PASS_WITH_EDIT | "British physicist" becomes "a physicist working in London"; 1978 confirmed (Physics World's 1979 is an outlier) |
| 5.2 | PASS_WITH_EDIT | "Is a by-product" becomes "is now understood as a side effect" |
| 5.3 | PASS_WITH_EDIT | Threshold 25-30 dB (ASHA) vs 20-30 dB HL (Kemp 2002); say "around 20 to 30 decibels" |
| 5.4 | PASS_WITH_EDIT | "60-80% of ears" conflates people and ears (Kemp 2002: 30-40% of ears); say "more than half of people" |
| 5.5 | PASS_WITH_EDIT | "Below threshold" is inference (Kemp gives up to 30 dB SPL); the 1-9% figure is of tinnitus sufferers in one study |
| 6.1 | PASS | 85 dBA (NIDCD, NIOSH); 70 dB (NIDCD, EPA) |
| 6.2 | PASS_WITH_EDIT | "Among the first"; first-row pattern is from animals; human data are autopsy associations, high-frequency half only |
| 6.3 | PASS_WITH_EDIT | Mouse experiment vs human association; no "hidden hearing loss" diagnosis |
| 6.4 | PASS_WITH_EDIT | "Mammals" now confirmed (cochlea.eu); 1988 as "two teams showed"; no cure framing |
| 6.5 | PASS_WITH_EDIT | Base fragility is lab/guinea-pig data, so hedge; 4 kHz notch is a single source (Samara), not used |
| 6.6 | PASS_WITH_EDIT | About 50 dB in animal studies (Dallos, Liberman); explanatory only |

## FAILs

None. Every claim has at least two independent sources for its core statement. Where a part of a claim was single-source or conflicting, that part was cut, not the whole claim. See the edits below.

## Notes on edits

**1.1.** Use "about 98 out of every 100 babies born were screened". Do not attach "before one month" to that 98%. Say "before leaving hospital" only as the guideline.

**1.4.** A pass is "a sign that" the outer hair cells and middle ear work, not proof of normal hearing. OAEs can be present with mild loss and with nerve disorders.

**1.5.** The NICU-specific ABR rule is JCIH only, so it is not stated. The neuropathy point is now two-source.

**1.6.** "About two in every thousand". Do not say "two or three".

**2.3.** Say "fifteen to twenty times". Give no lever ratio: cochlea.eu 1.3, Puria about 2, HyperPhysics about 3 "under optimum conditions".

**2.4.** No "200-fold". Say "many times over", or at most "roughly twentyfold at its best". "Best in the middle of the range, weaker for high pitches", with no peak number.

**2.6.** Drop "20 milliseconds". Keep "not instant, can't be relied on for a sudden bang".

**2.7.** Use "the hammer and anvil began as jaw-joint bones; the stirrup was already there". Drop "320 million years". Say "reptile-like ancestors", not "reptiles". No intent verbs.

**3.2.** Say "about three centimetres".

**3.3.** Give no width or stiffness numbers.

**3.7.** The evidence is from living animals. Give no dates for the live measurements: Physics World says Rhode 1971, and cochlea.eu's "end of the 1990s" for Johnstone & Boyle looks wrong. Do not call Békésy wrong.

**3.8.** "Largely forgotten for about thirty years", not "confirmed three decades later". Optional: he was later famous as an astrophysicist.

**4.1.** Give ranges and "roughly three times as many". Say "usually three rows".

**4.6.** Say "tens of thousands of times a second, in lab tests on isolated cells". Attribute "faster than anything else in the body" to Dallos if used.

**4.7.** Say "roughly a hundredfold" (or 40-50 dB). Never "a thousandfold". Measurements are in animals.

**4.8.** The evidence is from mice. Say "central to the amplifier". Do not turn 40-60 dB into an "x times" figure.

**4.9.** Keep the hedges ("seem to", "seems to have gone hand in hand"). Don't say only mammals have an active ear.

**5.1.** Say "a physicist working in London". 1978 is confirmed. The 1978 work was evoked emissions only.

**5.2.** Say "now understood as a side effect". The mechanism is not fully settled.

**5.3.** Say "around 20 to 30 decibels, a mild loss". Never say "pass means hearing is fine".

**5.4.** Use "more than half of people with normal hearing", not a percentage of ears. Keep "more common in women".

**5.5.** Say "usually far too faint to notice". For tinnitus, say "a small minority" or "roughly 1 to 9 percent in one study of people with tinnitus". Never "of people".

**6.2.** "Among the first cells noise destroys". Animal first-row pattern. Human autopsy link limited to the high-pitch half.

**6.3.** Mouse experiment plus human association. No diagnosis label, no treatment claims.

**6.4.** "In humans, and in mammals generally, they don't grow back on their own." Trials exist, but there is no cure.

**6.5.** "Lab studies suggest the base is more fragile, possibly ..." No "4 kHz notch" and no survival percentages.

**6.6.** "In animal studies, about 50 decibels". Explanatory only.

## Discrepancies found in sources

- **UQ release.** It says three jaw-joint bones became ear bones; the correct number is two.
- **NIDCD.** "98% before 1 month" is higher than CDC's own data (about 95% of births by 1 month).
- **StatPearls.** As quoted by the researcher, it gives "1-9% of people" for tinnitus from SOAEs; Penner's figure is 1-9% of tinnitus sufferers.
- **Kim & Koo.** Says the partition is "ten times wider at the base", which contradicts the basilar membrane width.
- **Purves.** "Almost 200-fold" middle-ear gain disagrees with three sources at about 20-26-fold.
- **Physics World.** Dates Kemp's discovery to 1979; the JASA paper is 1978.
- **cochlea.eu.** Dates Johnstone & Boyle's live measurements to "the end of the 1990s", which looks wrong. Not used.
