# Research dossier: the inner ear (working title "Your Ears Make Sounds")

Episode: P2, Designed Otherwise. Companion to `claims.json` (40 claims: 22 supported, 18 corrected, 0 rejected; 3 more dropped before entry, listed below).
Researched 2026-11-12. Every claim has at least two sources from different publisher families. Every source in claims.json was opened; the locator says how.

## Notes for the fact checker

- **How pages were read.** Web pages went through the WebFetch tool, which returns extracted text. Some short quotes came back as the tool's quotation, not raw HTML, so check the exact wording on the page. Journal abstracts were read **verbatim** from the Europe PMC REST API (`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:<PMID>`), because PubMed pages returned a bot check. In claims.json these sources point to the DOI (or PubMed when there is no DOI), and the locator names the API. Open-access full texts came from Europe PMC `fullTextXML` (Kim & Koo PMC4491943, Siebrecht PMC11367034, Samara PMC11304036). The PMC pages for Robles & Ruggero (PMC3590856), Dallos 2008 (PMC2630119), Johnson 2019 (PMC6886459) and Coate 2019 (PMC6573016) were downloaded once and searched as text.
- **Blocked or failed, so not cited:**
  - Purves *Neuroscience* "The Inner Ear" (NCBI NBK10946) and the hair-cell section (NBK10915) returned reCAPTCHA. Only Purves "The Middle Ear" (NBK11076) opened.
  - PubMed pages: bot check (abstracts were read through Europe PMC instead).
  - CDC "Screening for Hearing Loss" (cdc.gov/hearing-loss-children/screening): the fetch permission timed out, and curl got 403.
  - The JCIH 2019 full statement at chfs.ky.gov failed. The same document on ldh.la.gov opened, but only the first 100,000 of 290,171 characters were read. The page numbers come from the fetch tool.
  - Europe PMC full text for Wu 2020 (PMC7424870), Wu 2021 (PMC8152611), Dallos (PMC2630119) and Frank 1999 (PMC16347) returned server errors, so I used the abstracts only.
  - Britannica "Organ of Corti" returned 403 to curl and was not used. Britannica "Cochlea" opened through WebFetch.
  - The Robles & Ruggero PMC page loaded on the second try. After that I stopped retrying NCBI/PMC pages that hit a bot check, and anything still blocked was left out. Re-open Robles yourself to confirm the quotes.
- **Source families and overlap:**
  - The two StatPearls items are one family.
  - The cochlea.eu pages (Pujol et al., Montpellier/INSERM) are one family.
  - The two HyperPhysics pages are one family.
  - NIDCD (NIH) and CDC/NIOSH are separate agencies but both sit under HHS.
  - The Northwestern/ScienceDaily release is Dallos's own lab, the same group as Zheng 2000.
  - Liberman 2002, Kujawa & Liberman 2009, Wu 2020 and Wu 2021 all come from the Liberman lab. Every claim that leans on them also has a source from outside the lab.
  - Purves and StatPearls are both hosted on NCBI Bookshelf but come from different publishers.
- **Flagged wording from my own knowledge, not from an opened source (verify or drop):**
  - "Two of the three" ear bones come from the jaw joint (2.7).
  - Thomas Gold's first name and that he was a physicist (3.8). Both reviews cite only "Gold 1948".
  - That Kemp was British or a physicist (5.1).
  - All analogies: piano keyboard, paperclip, grain of rice.
- **My arithmetic:**
  - Screening by 1 month = 97.2% of screened infants, which is about 95% of all births (1.1).
  - 24 to 29 dB is about 16- to 28-fold in pressure, and 27 dB is about 22-fold (2.4).
  - "Below the threshold of hearing" for −2.6 dB SPL (5.5).
- **Known errors in sources:**
  - StatPearls says "1% to 9% of people" perceive their spontaneous OAE as tinnitus. The primary source (Penner 1990) gives that range for people *with tinnitus* only (5.5).
  - Kim & Koo 2015 contradict themselves on basilar membrane width ("ten times wider at the base"). They are used only for stiffness (3.3).
  - NIDCD says "about 98% screened before 1 month". CDC's own data give 98.2% screened at all, and 97.2% of those by 1 month (1.1).
- **Animal vs human:** All direct measurements of the amplifier's gain, the prestin knockout, the OHC ablation results, OHC speed and the synapse loss come from animals or isolated cells. The human evidence is OAEs, autopsy studies (Wu 2020, 2021) and audiology. The claim notes say which is which.

## Beat 1, cold open: the newborn test that listens

**Solid.**
- An OAE screen puts a probe in the ear, plays sounds and records sound coming *back out*. NIDCD calls it an "echo" that occurs in ears with normal hearing (1.3).
- That sound comes from the cochlea's outer hair cells (JCIH: "OAE measures a physiologic response from the cochlear outer hair cells"). ASHA: "sounds given off by the inner ear" (1.4).
- OAEs check the ear, not the nerve. A baby with auditory neuropathy can pass, which is why JCIH recommends automated ABR alone for NICU babies (1.5, JCIH only for the NICU detail).

**Corrected.**
- **How many are screened (1.1).** 98.2% of U.S. births in 2020 (CDC EHDI), and 97.2% of screened infants by 1 month. NIDCD's "98% before 1 month" rounds this together. Safe: "almost every baby born in the U.S. gets a hearing screen, usually before going home." These are U.S. figures; no UK source was gathered.
- **Prevalence (1.6).** CDC gives 1.8 per 1,000 screened; NIDCD gives 2 to 3 per 1,000 born. Say "about two in every thousand."

**Dropped.**
- The 1-3-6 benchmark (screen by 1 month, diagnose by 3, intervene by 6). It is supported by JCIH, and NIDCD supports only the 1-month part. It's background the script doesn't need.

## Beat 2, the microphone model: outer and middle ear

**Solid.**
- Eardrum → malleus, incus, stapes (hammer, anvil, stirrup) → oval window of the fluid-filled cochlea (2.1).
- Why the bones exist: an air-to-fluid impedance mismatch. Purves: without the middle ear "more than 99.9%" of the energy is reflected. Puria and Goode support the mismatch but not the number (2.2).
- **The stapes is the smallest bone in the body:** 2.6 to 3.4 mm long, 2 to 4.3 mg (StatPearls, Guinness) (2.5).
- **The ear's own reflex:** the stapedius reflex has a latency of about 20 ms and damps sounds below a few kHz. It is too slow for sudden bangs such as gunshots (Puria; StatPearls and HyperPhysics for the protective muscles) (2.6).

**Corrected.**
- **Area ratio and lever (2.3).**
  - Area ratio: about 15× (HyperPhysics) or about 20× (Puria, "stiletto heel-like force multiplication").
  - Lever: Puria gives a malleus-to-incus length ratio "close to a factor of two" with "a relatively small benefit"; HyperPhysics says about 3× "under optimum conditions".
  - The textbook human lever ratio of about 1.3 was **not found** in any opened source. Don't use it.
  - Puria says most of the matching comes from the area ratio, not the lever.
- **Total middle-ear gain (2.4).** The sources conflict:

  | Figure | Source | Note |
  | --- | --- | --- |
  | about 27 dB (about 22×) | Goode 1994, "conventional teaching" transformer estimate | Goode says this is only partially correct; gain falls above 1 kHz |
  | 24 to 29 dB, peak at 1 to 2 kHz | Kim & Koo 2015, measured transfer function | cat and human |
  | "almost 200-fold" (about 46 dB) | Purves | out of line with the measurements |

  Rule: say it without the number ("multiplies the pressure many times over"), or say "roughly twenty-fold at best".
- **Evolution (2.7).** Puria: "the unique design of the ossicles evolved from upper and lower jaw bones in reptiles". UQ: three bones of the "ancestral reptile-like jaw joint" shrank over 320 million years. Birds and lizards have one ossicle. My correction, not in either source: only the malleus and incus came from the jaw joint, and the stapes was already there. Safe: "the middle ear bones evolved from bones of an ancient jaw."

## Beat 3, the cochlea

**Solid.**
- A snail-shaped, fluid-filled spiral of about 2.5 turns (NIDCD, Britannica, Siebrecht). Individual ears vary from about 2 to 3 turns (Erixon) (3.1).
- Tonotopy: high frequencies peak at the base and low frequencies at the apex (Robles & Ruggero, NIDCD, cochlea.eu). Hearing range is 20 Hz to 20 kHz (cochlea.eu) (3.4).
  - Wording trap: NIDCD's "wide end of the snail-shaped cochlea" is the base of the *shell*, where the *membrane* is narrow.
- The travelling wave grows to a peak at its tuned place and then dies out (3.5).
- Von Békésy won the 1961 Nobel "for his discoveries of the physical mechanism of stimulation within the cochlea". He worked mostly on cadaver ears (Nobel, Robles, cochlea.eu) (3.6).
- **The dead-ear twist (3.7).** In living cochleae the sharp, sensitive response is "labile, disappearing after death" (Robles). cochlea.eu: the differences from Békésy's results were "due to active biological mechanisms ... in living subjects." The active boost is about +50 dB. This is the bridge into beat 4.
- **Predicted, then forgotten (3.8).** Gold proposed cochlear amplification in 1948. Dallos: his paper "was forgotten and had no influence on the field during the 1970s". Kemp revived it after 1978.

**Corrected.**
- **Length (3.2).** About 30 mm "when stretched out" (Britannica). The organ of Corti is 25 to 35 mm long (Alexiades) and the outer wall 38.6 to 45.6 mm (Erixon, mean 42.0). Say "about three centimetres" or "three to four centimetres."
- **Basilar membrane gradient (3.3).** Under 0.1 mm wide at the base to 0.5 mm at the apex (Britannica only for numbers). Stiffness falls about 100-fold from base to apex (Kim & Koo) or exponentially (Robles, model assumption). Say "narrow and stiff at one end, wider and much floppier at the other."

## Beat 4, two kinds of hair cells: the sensors and the amplifiers

**Solid.**
- About 95% of auditory-nerve fibres come from inner hair cells. The remaining about 5% (type II) each contact many outer hair cells (cochlea.eu, Johnson 2019, Coate 2019). Outer hair cells make up roughly three-quarters of the hair cells but carry about 5% of the nerve fibres (4.2).
- Stereocilia bend, channels open, and the nerve carries the signal (NIDCD, Robles) (4.3).
- **Brownell 1985:** isolated outer hair cells "become shorter in response to depolarizing and longer in response to hyperpolarizing currents" (Science abstract; Dallos and Robles both credit Brownell) (4.4).
- **Prestin, 2000:** Zheng, ..., Dallos (Nature): "prestin is the motor protein of the cochlear outer hair cell." The name comes from *presto* (Northwestern release). Ashmore 2008 places prestin in the SLC26 transporter family (4.5). Zheng also made human kidney cells change shape with voltage by giving them prestin.
- **Knockout proof (4.8).** Mice without prestin lose electromotility and 40 to 60 dB of sensitivity, while transduction stays intact. Mice with one copy have half the motility and thresholds about 6 dB worse (Liberman 2002; Dallos gives about 50 dB).

**Corrected.**
- **Counts (4.1).**
  - Inner hair cells: 3,000 to 3,500, in one row.
  - Outer hair cells: about 11,000 (Ashmore via BioNumbers, "3 or 4 rows") or about 12,000 (cochlea.eu, 3 rows).
  - Say "about three and a half thousand inner hair cells and roughly three times as many outer hair cells."
- **Speed (4.6).**
  - At least 79 kHz in isolated cells (Frank 1999).
  - "Length changes at audio frequencies in vitro" (Liberman).
  - Press release: "as often as 60,000 times a second" and "faster than anything else we know in the human body". These are quotes from the release; attribute them if used.
  - Say "tens of thousands of times a second." These are lab measurements, not taken in a living ear.
- **Gain (4.7).**
  - "More than 40 dB (that is, 100-fold)" (Liberman).
  - About +50 dB (cochlea.eu).
  - Destroying OHCs raises thresholds by about 50 dB (Dallos).
  - Robles gives 35 to 81 dB in animals, depending on definition and place, with less gain at the apex.
  - Say "roughly a hundredfold for the faintest sounds." It boosts whispers more than shouts (compression).
- **Evolution (4.9).** Dallos: mammals' extended frequency range "has probably co-evolved with a novel hair cell type, the outer hair cell and its constituent membrane protein, prestin". Non-mammals amplify with their hair bundles, so mammals are not the only animals with an active ear. Keep the hedge.

## Beat 5, the ear talks back

**Solid.**
- OAEs are a by-product of the amplifier. Dallos calls spontaneous emissions "sounds of inner-ear origin that are radiated by the eardrum" and "a signature of the feedback process". StatPearls, JCIH and Robles agree (5.2).
- OAEs are absent above about 25 to 30 dB of hearing loss (ASHA) or 30 dB HL (StatPearls on Kemp), and when the canal or middle ear is blocked (5.3).

**Corrected.**
- **Kemp 1978 (5.1).** Kemp found *evoked* emissions: a slowly decaying response more than 5 ms after a click, present "in all normal ears tested" and absent with cochlear deafness. Kemp himself said only "probably located in the cochlea". Don't credit 1978 with spontaneous emissions. His nationality and field are not verified.
- **How common spontaneous emissions are (5.4).**
  - Burns 1992: 62% of adults and 64% of neonates.
  - Penner & Zhang 1997: 83% of women and 62% of men, with estimates swinging 15 to 20 points depending on the analysis.
  - More common in women and in right ears.
  - Say "more than half of people with healthy hearing."
- **How loud they are (5.5).** Adults average −2.6 dB SPL and newborns 8.5 dB SPL (Burns). Among tinnitus sufferers, 1.11% to 9.05% have tinnitus caused by SOAEs (Penner 1990). StatPearls misquotes this as a share of everyone. Say "far too quiet to hear." Don't imply tinnitus is usually caused by OAEs.

**Dropped.**
- Newborn SOAEs are higher-pitched than adults': mostly 2.5 to 5 kHz against 1 to 2 kHz (Burns 1992 only). It's lovely but has one source.

## Beat 6, the cost of an amplifier

**Solid.**
- Public-health guidance: at or below 70 dBA is unlikely to cause hearing loss, and long or repeated exposure at or above 85 dBA can (NIDCD). The NIOSH workplace limit is 85 dBA over an eight-hour shift (6.1). The NIOSH page I opened lists a 3 dB exchange rate but gives no example durations, so add none.
- Losing outer hair cells costs about 50 dB of sensitivity and the sharp tuning (Dallos, Liberman, Robles) (6.6).

**Corrected.**
- **"First casualties" (6.2).** cochlea.eu: noise damage "generally begins with the first row of the OHCs", but the synapses under the inner hair cells are hit too. In human autopsies, noise history goes with extra OHC loss at high frequencies, and IHC loss is unaffected by noise (Wu 2021). Say "among the first cells noise destroys."
- **Hidden damage (6.3).** This is new and not in the outline. Kujawa & Liberman (mice): exposures with "completely reversible" threshold shifts still cause "acute loss of afferent nerve terminals and delayed degeneration of the cochlear nerve". Human autopsies link noise to more nerve-fibre loss. It's optional and should carry caveats.
- **No regrowth (6.4).** NIDCD: "Unlike bird and amphibian hair cells, human hair cells don’t grow back." In 1988 two Science papers showed hair-cell regeneration after noise, Corwin & Cotanche in chicks and Ryals & Rubel in adult quail (quail recovered to within 5%). Regeneration therapies are in trials (Wu 2020), so say "in us they don't grow back on their own" and promise nothing.
- **High pitches first (6.5).**
  - The base is "more vulnerable to trauma than the apex" (Sha 2001, guinea-pig cells and drugs). Basal OHCs have less glutathione: in culture up to 90% of apical OHCs survived against under 30% of basal ones.
  - Human autopsies show "dramatically greater loss in high-frequency regions" with age, partly from "avoidable" noise (Wu 2020, 2021).
  - No opened source gave the 4 kHz noise notch, so don't state a frequency.

**Dropped.**
- NIDCD's estimate that 10 to 40 million U.S. adults show signs of noise-induced hearing loss. It has one publisher and a wide range. "Millions" is safe if needed.

## Planned beats the sources do not support as written

- **"Outer hair cells are the first casualties of noise."** The nerve synapses under inner hair cells are at least as vulnerable (6.2, 6.3). Say "among the first".
- **"Ossicles amplify by a lever" as the main story.** The area ratio does most of the work, and the lever is small (2.3).
- **A single middle-ear gain number.** Sources run from about 22× to "almost 200-fold" (2.4).
- **"Kemp heard ears humming" in 1978.** His 1978 emissions were evoked echoes; spontaneous emissions are a separate finding (5.1, 5.4).
- **Hair cells "regrow in other animals".** True for birds and amphibians, not mammals in general (6.4).
- Everything else in the outline is supported.

## Five surprising true details for on-screen moments

1. **The living ear behaves differently from a dead one.** Von Békésy won a Nobel for the travelling wave, measured mostly in cadaver ears. The sharp, ultra-sensitive response he couldn't see is "labile, disappearing after death". The amplifier only exists while the cells are alive (3.6, 3.7).
2. **Most of your ears are humming right now.** More than half of people with healthy hearing have ears that continuously emit faint tones, too quiet to hear, and newborns are no different (Burns: 64% of neonates). They're more common in women (5.4, 5.5).
3. **Three-quarters of your hair cells barely talk to the brain.** About 95% of nerve fibres serve the inner hair cells. The outer hair cells are muscles more than microphones: they stretch and shrink tens of thousands of times a second, driven by a protein named after *presto* (4.2, 4.5, 4.6).

Runners-up:
- A forgotten 1948 prediction: Gold argued the ear must contain an amplifier 30 years before Kemp's emissions revived the idea (3.8).
- Prestin works even in kidney cells: give them the protein and they change shape with voltage (4.5).
- The stapes is 2.6 to 3.4 mm long and weighs a few milligrams, the smallest bone in the body (2.5).
- Two of the middle-ear bones were once part of a jaw (2.7, wording caveat).
- Birds regrow hair cells and people don't, a discovery reported by two papers in 1988 (6.4).
- The stapedius reflex takes about 20 ms, too slow for a gunshot (2.6).

## Terms that may trip the TTS voice

| Term | Suggested reading |
| --- | --- |
| cochlea | KOCK-lee-uh |
| otoacoustic | OH-toe-uh-KOO-stick |
| ossicles | OSS-ih-kulls |
| malleus / incus / stapes | MAL-ee-us / ING-kus / STAY-peez |
| stapedius | stuh-PEE-dee-us |
| tympanic | tim-PAN-ick |
| basilar | BAZ-ih-ler |
| tonotopy / tonotopic | toe-NOT-oh-pee / toe-no-TOP-ick |
| stereocilia | STEH-ree-oh-SILL-ee-uh |
| organ of Corti | KOR-tee |
| prestin | PRESS-tin |
| electromotility | ee-LEK-tro-mo-TILL-ih-tee |
| von Békésy | fon BAY-kay-shee |
| Brownell | BROWN-ell |
| Dallos | DAL-ohss |
| perilymph / endolymph | PERR-ee-limf / EN-doh-limf |
| OAE | "O A E" or "otoacoustic emission" (write out) |
| ABR | "A B R" or "auditory brainstem response" (write out) |
| dBA / dB SPL | "decibels" (write out; avoid "A-weighted" in narration) |
| kHz | "kilohertz" (write out) |
| NICU | "neonatal intensive care" (write out) |
