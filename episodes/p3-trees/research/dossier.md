# Research dossier: how trees lift water (working title "Trees Don't Pump Water. They Pull It.")

Episode: P3, Designed Otherwise. This is the readable companion to `claims.json`: 50 claims, 26 supported and 24 corrected, none rejected. Seven more were dropped before entry; they are listed below.
Researched 2026-11-16. Every claim has at least two sources, and in all but the cases flagged below they come from different publisher families. Every source in claims.json was opened, and the locator says how. Claim numbering follows the beat (1.x to 8.x). 9.x holds visual reference claims for the artists, not for narration.

## Notes for the fact checker

- **How pages were read.**
  - Most web pages were downloaded with curl and searched as plain text. These quotes match the page text, and an automated check confirmed every curl-read quote against the saved text.
  - Some pages only opened through the WebFetch tool, which returns its own extraction. Re-open them to confirm the exact wording:
    - Britannica "Mercury barometer"
    - Britannica "Henry Horatio Dixon"
    - Chemistry World (Torricelli)
    - Brown's arXiv paper (only the first 100,000 of 120,969 characters were read)
    - the Springer page for Milburn & Johnson 1966
    - the PROMETHEUS acoustic-emission protocol
  - Journal abstracts were read **verbatim** in two ways:
    - from the Europe PMC REST API (`search?query=DOI:<doi>&resultType=core`), or with a title search when I did not have the DOI;
    - from the Crossref REST API (`api.crossref.org/works/<doi>`) for papers with no Europe PMC abstract: Stroock 2014, Holbrook 1995, Sevanto 2002, O'Leary & Kramer 1964, and the Dixon & Joly 1895 opening paragraph.
  - Open-access full texts came from Europe PMC `fullTextXML`: Bentrup 2017, Johnson 2022, Stewart 2026 and Oberhuber 2023.
  - Two PDFs were text-extracted with pdftotext: Sperry 2006 (author copy, Utah) and USFS PNW-395. In the Sperry extraction, "lm" means µm.
  - The DOIs of title-searched papers were confirmed through Crossref.
- **Blocked or failed, so not cited:**
  - Gymnosperm Database pages (conifers.org) for *Sequoia* and *Sequoiadendron* returned 409. WebFetch permission for conifers.org was not granted. The Douglas-fir page loaded only partly and was not used. (The Ambrose PDF hosted on mail.conifers.org did open.)
  - USDA Forest Service Silvics Manual pages (srs.fs.usda.gov) failed with a proxy 502.
  - HyperPhysics: DNS failure. arXiv export API: DNS failure. arXiv PDF: WebFetch only.
  - Jensen et al. 2016 (Rev. Mod. Phys.) failed at both APS and DTU Orbit (403), so the review was not used.
  - The Annual Reviews page for Stroock 2014 returned 403; the abstract came from Crossref.
  - Taiz *Plant Physiology* essays 4.2 and 4.4 (OUP Learning Link) need a login.
  - Europe PMC `fullTextXML` returned server errors for Ponomarenko 2014, Domec 2008 and Franks & Beerling 2009, so their abstracts were used. NCBI PMC pages returned reCAPTCHA.
  - Britannica "vascular system", APS News (Torricelli), Smithsonian (Hyperion), askaboutireland.ie (Dixon, Joly) and inkl.com all returned 403.
  - The JoVE transpiration video page came back empty.
  - jvc.ac.in failed the TLS certificate check and was not used.
  - No full text was available for Koch et al. 2004, so the redwood leaf water potential values (MPa) were NOT obtained. Only the abstract was used.
  - No full text was available for Milburn & Johnson 1966. I could not confirm whether those clicks were audible or ultrasonic.
- **Source families and overlap:**
  - OpenStax Biology 2e and College Physics 2e are one family. LibreTexts "Botany (Ha, Morrow and Algiers)" reuses OpenStax wording, so it also counts as OpenStax.
  - The two CSBSJU (Saupe) pages are one family: lecture notes, a lower-grade source used only beside a stronger one.
  - The two University of Minnesota open-textbook chapters are one family.
  - The two WSL items (waldwissen release and the LWF page) are one family.
  - Stroock 2014 and Wheeler & Stroock 2008 share Stroock.
  - Johnson, Katul & Domec 2022 and Domec 2008 share Domec.
  - Koch 2004, Ishii 2008 and Ambrose c. 2006 share Koch and Sillett: one research family. Nature News (2004) reports Koch and has the same publisher as the paper; the Baltimore Sun wire story (Vindicator and LJWorld reprints, one family) is the independent press source.
  - Choat 2012, Brodribb & Cochard 2009, Choat 2008, Kaack 2021, Zhang 2024 and Ponomarenko 2014 overlap through Cochard, Brodribb and Jansen. Each claim that uses them also has an outside source, except where flagged (6.6).
  - Guinness and Treelogic are independent. Treelogic reproduces a Forestry Tasmania announcement.
  - Brown (Oxford, philosophy of physics) and Bentrup (Salzburg, a challenger of the theory) are independent of each other and of the hydraulics labs.
- **Wording from my own knowledge, NOT from an opened source (verify or drop):**
  - The name "Jurin's law" (4.1).
  - Water's vapour pressure lowering the practical suction limit to about 10.1 m (2.1).
  - Strasburger's first name, Eduard (5.2).
  - Eugen Askenasy's parallel 1895 proposal (5.1).
  - That wide earlywood vessels occur in oak (4.2).
  - That conduits are not clean glass tubes, so real capillary rise is lower (4.3).
  - That root pressure can refill embolised conduits in small plants (6.7).
  - Any 19th-century mountain ash height claims (7.6, not used).
  - My description of how the pressure chamber is operated (5.8). It is consistent with Holbrook's "balancing pressure", but no opened source describes the steps.
  - Analogies of my own: "the air pushes, the vacuum doesn't pull" (2.2) and "one atmosphere per 10 m" (7.2). The rope and chain images ARE in sources: Stroock ("rope under tension"), OpenStax ("like a chain"), Ponomarenko ("wires of water").
- **My arithmetic.** Constants: g = 9.81 m/s², ρ(water) = 998 kg/m³, γ = 0.0728 N/m, contact angle 0. The calculations:
  - 101,325 Pa ÷ ρg = 10.35 m (2.1), or about 10.1 m if vapour pressure is included.
  - 116.07 ÷ 10.35 = 11.2 times the suction limit (2.4).
  - Storeys: 116.07 m at 3.0 to 3.7 m per storey = 31 to 39 storeys (1.5).
  - Capillary rise h = 2γ/(ρgr): r = 5 µm gives 2.97 m; 10 µm gives 1.49 m; 25 µm gives 0.59 m; 50 µm gives 0.30 m; 250 µm gives 0.059 m. The radius needed for 100 m is 0.149 µm (4.3).
  - Laplace pressure 2γ/r at r = 5 nm is 29 MPa (4.4).
  - Root pressure conversions: 0.1 MPa = 10.2 m, 0.16 MPa = 16.3 m and 0.3 MPa = 30.6 m of water, all static with no friction (3.5). 60 ft = 18.3 m.
  - ρg = 0.0098 MPa/m, so 116 m needs 1.14 MPa (7.2).
  - 122 to 130 m minus 116.07 m = 6 to 14 m of headroom (7.4).
  - USGS oak: 151,000 L ÷ 365 = 414 L/day (8.1).
  - Unit conversions: Scholander's atm to MPa (×0.1013). 379.1 ft = 115.55 m; 274.9 ft = 83.8 m; 325 ft = 99.1 m; 327 ft = 99.7 m; 425 ft = 129.5 m; 50 ft = 15.2 m.
- **Known errors in sources:**
  - **OpenStax Biology 2e 30.5** gives gravity as "–0.1 MPa m⁻¹ … an extra 10 MPa". The correct figure is about 0.01 MPa per metre, about 1 MPa for 100 m (Bentrup, CSBSJU, and ρg). Don't use the OpenStax number (7.2).
  - **UMN *The Science of Plants* 11.1** says root pressure "is the force driving sap up the trunk of sugar maples in the spring". That is wrong: maple sap flow is freeze-thaw stem pressure (CSBSJU maple lab, Cornell CCE, Cirelli/Tyree 2008) (3.4).
  - **NPS General Grant Tree page** gives "268.1 feet (88.7 meters)", but 268.1 ft is 81.7 m (1.4). It is not used for numbers.
  - **OpenStax Biology** says "Up to 90 percent" of water taken up is lost by transpiration, which conflicts with UNL (<5% remains), RHS (~2% used) and LibreTexts (<1% used) (8.2).
  - **CSBSJU lecture notes** give vessel diameters as "100 - 200 mm", a typo for µm. Their bubble "redissolving… usually occurs at night" presents contested refilling as fact (6.7).
  - **TCD** dates the Strasburger visit to 1892, but Dixon & Joly's own paper says "Summer of 1893" in Bonn (5.2). TCD also says the theory was "first proposed… in 1895", while Britannica, Brown and Bentrup say 1894 (5.1).
- **Conflicts between sources (state these without a precise number):**
  - Mountain ash height: 99.82 m (Guinness 2014) vs 100 to 101 m (Treelogic/Forestry Tasmania) (1.2).
  - Doerner Fir: 325 vs 327 ft, and it is no longer the tallest Douglas-fir after the 2025 fire (1.3).
  - General Sherman: 274.9 ft (NPS) vs 272.4 ft (PBS) (1.4).
  - The historical suction limit: "18 braccia, about 11 m" vs the physics value of 10.3 m (2.3).
  - Root pressure magnitude: up to 0.16 MPa (walnut) vs 0.2 to 0.3 MPa (lecture notes) vs "about 60 ft" (3.5).
  - Conifer root pressure: none from loblolly pine or white spruce stumps (O'Leary & Kramer 1964) vs exudate collected from Douglas-fir, grand fir and noble fir seedlings (USFS 1981) (3.6).
  - Water's tensile limit: about −26 MPa (acoustic) vs about −120 to −140 MPa (quartz inclusions) (5.7).
  - Share of water transpired: up to 90% vs more than 95 to 99% (8.2).
  - Large-tree daily use: up to 900 L/day (RHS) vs 10 to 1,180 kg/day measured (Wullschleger) (8.1).
- **Species, lab vs field, and model caveats:**
  - Root pressure numbers: walnut (Juglans regia), orchard and potted trees.
  - Conifer root pressure: seedlings only.
  - Dendrometer magnitudes: Scots pine (Austria) and Swiss TreeNet species, not redwoods.
  - Acoustic one-bubble-per-click evidence: wood slices in the lab (Ponomarenko).
  - Refilling-artefact paper: sunflowers, not trees (Stewart 2026).
  - Drought-mortality thresholds: Adams 2017 is a synthesis; Brodribb & Cochard is four potted conifers.
  - Leaf-gradient data: coast redwood (Koch, Ishii) and giant sequoia (Ambrose).
  - The 122 to 130 m ceiling is a regression extrapolation. Domec's 109 m is an extrapolation of pit anatomy in Douglas-fir. Neither is a measured law.
  - Water's tensile strength is measured in pure water in the lab. Real xylem fails far earlier because of air seeding.
- **Contested science, in brief:**
  - Cohesion-tension is the mainstream explanation and is well supported: the pressure chamber was validated by centrifuge (Holbrook 1995) and the Wheeler & Stroock synthetic tree works. It has had challengers, though. Bentrup 2017 and the Zimmermann "multi-force" school argue from xylem pressure probe readings of at most 0.4 MPa (5.11). Present it as "the accepted explanation", not "proven beyond any doubt".
  - Embolism refilling is actively debated (6.7).
  - Maple sap mechanism: two competing stem-pressure models (3.4).

## Beat 1, the brief: lift water higher than a 30-storey building

**Solid.**
- **Hyperion**, a coast redwood in Redwood National Park, California, was found in 2006 (Guinness, NBC/Reuters, NPS). Guinness gives 115.55 m in 2006 (climbed and tape-dropped) and 116.07 m in 2019. NBC/Reuters, quoting Sillett, gives 379.1 ft in 2006 (1.1). OpenStax: "heights nearing 116 meters". Safe: "about 116 metres, roughly 380 feet".
- **No pump, no moving parts.** OpenStax: "a passive process, meaning that metabolic energy in the form of ATP is not required". Wheeler & Stroock: "a passive, wicking mechanism". CSBSJU: "no anatomical area in the stem or root that could serve as a pump". Tyree, quoted by Bentrup: "you can't have a heart or other contractile organs" (1.6). Wording: the LIFT is passive. Roots do spend energy loading ions.

**Corrected.**
- **Context heights (1.2 to 1.4).**
  - Mountain ash "Centurion": about 100 m (99.82 m Guinness vs 100 to 101 m Forestry Tasmania via Treelogic).
  - Douglas-fir: "approaching 100 m". The Doerner Fir was 325 to 327 ft but lost about 50 ft in an August 2025 fire, so any older "tallest Douglas-fir 99 m" line is now stale.
  - Giant sequoia: General Sherman about 84 m / 275 ft (NPS; PBS says 272.4 ft). Ambrose's tallest study tree was 90.9 m.
- **Storeys (1.5).** No source compares Hyperion to storeys. By my arithmetic it is 31 to 39 storeys, so "taller than a 30-storey building" is safe (NPS: the largest sequoias are "as tall as an average 26-story building"; Nature News: 130 m is a "35-storey skyscraper"). The README's hook ("Lift water higher than a 30-storey building") is fine.
- **"Every sunny day / right now" (1.7).** Transpiration runs mostly by day and largely stops at night when stomata shut (OpenStax, Missouri IPM; WSL: stems shrink by day and swell at night). "A tree outside your window is doing it right now" is true only in daylight and only for a tree in leaf. Consider "on any summer day".

**Dropped.**
- The names of Hyperion's discoverers (Chris Atkins, Michael Taylor) appear in Guinness only. Use them only if the fact check accepts a single source.
- A tropical comparison (yellow meranti 98.53 m, Guinness): one source, and rankings shift.

## Beat 2, attempt 1: suck it up

**Solid.**
- **About 10 m (2.1).** Sea-level air pressure balances about 10.3 m of water (KFUPM; OpenStax: "Just 10.3 m of water creates the same pressure as 120 km of air"). Britannica: pumps and siphons could raise water "a maximum height of only 10 meters (33 feet)". TCD: a suction pump manages "about 10m before the water column breaks or 'cavitates'". My arithmetic gives 10.35 m. Say "about 10 metres / about 33 feet".
- **The air pushes, the vacuum doesn't pull (2.2).** For a barometer hρg = P_atm with a near-vacuum on top (OpenStax), and the pressure at the vacuum surface is zero (KFUPM). A perfect vacuum gains nothing beyond about 10 m. Brown: "The barometric effect could in principle only account for a 10.4 meter rise."
- **Ten times (2.4).** 116 m ÷ 10.35 m = 11.2 (my arithmetic). TCD: "a suction ten or more times the maximum achieved by a suction pump".

**Corrected.**
- **The history (2.3).**
  - The historical limit was "18 braccia (around 11 metres)" (Museo Galileo, Chemistry World), not 10.3 m.
  - In 1630 Baliani asked Galileo why his siphon over a ~21 m hill failed (Museo Galileo). Galileo blamed the limited "force of the vacuum" (Museo Galileo), or "the weight of water" according to Chemistry World. Either way he got it wrong.
  - Torricelli's mercury tube is dated 1643 to 44 (Britannica) or "around 1643" (Chemistry World). Britannica also credits Gasparo Berti's water-tube experiment.
  - "Florentine pump makers / well diggers" is not in any opened source. Say "pump makers" or "well pumps".

## Beat 3, attempt 2: push from below

**Solid.**
- **How root pressure works (3.1).** Roots accumulate mineral ions and water follows by osmosis, building pressure mostly at night (Missouri IPM, UMN, CSBSJU). Ewers: high root pressures "associated with uptake of mineral nutrients from soil, especially nitrate".
- **Guttation (3.2):** droplets pushed out of hydathodes at leaf margins and tips (Missouri IPM, UMN). Visual: grass blades or small plants, not redwoods.
- **Spring sap from cut stems in birch and grapevine (and walnut, butternut) is root pressure (3.3):** CSBSJU maple lab, Cornell CCE, Ewers.
- **In a transpiring tree the xylem is under tension, not pressure (3.7).** Scholander: "sap pressures during transpiration are normally negative". OpenStax gives about −2 MPa. Dixon & Joly's own opening line: "the ascent of sap in high trees, when root pressure is not acting".

**Corrected.**
- **Maple sap is NOT root pressure (3.4).** It is freeze-thaw stem pressure (CSBSJU: "Root pressure is absent in maple trees, even when there is stem pressure"; Cornell CCE; Cirelli et al. 2008; O'Leary & Kramer: no exudation from maple stumps). The exact stem mechanism is still debated. The UMN textbook gets this wrong.
- **Magnitude (3.5).** Values are 0.16 MPa (walnut, Ewers), 0.2 to 0.3 MPa (CSBSJU) and "only about 60 feet" (UMN). By my arithmetic 0.1 MPa ≈ 10 m before friction. Safe: "a few storeys, tens of metres at the very most".
- **Conifers (3.6).** The sources conflict (none in pine and spruce stumps vs exudate from Douglas-fir and true firs, all seedlings). The brief's "many conifers show little/none" is not safe. Say "varies a lot between species" or drop.

## Beat 4, attempt 3: capillary action

**Solid.**
- **Rise is inversely proportional to tube radius (4.1)** (CSBSJU h = 14.87/r; OpenStax; Brown). The name "Jurin's law" is not in an opened source.
- **Conduit sizes (4.2).**
  - Tracheids: 10 to 42 µm in Sperry's dataset and up to 50 to 65 µm in mature trunks; Brown gives 10 to 20 µm for conifers.
  - Vessels: from 17 µm to about 100 µm typical in broadleaves (Brown). Over 500 µm only in tropical lianas (Sperry).
  - OpenStax: radii "as small as" 25 µm.
- **The real capillary engine is the nanoscale cell-wall pores (4.4).** Pores of "an order of 10 nm, which corresponds to 30 MPa of capillary pressure" (Brown quoting Steudle). CSBSJU: a 5 nm-radius pore could in theory support about a 3 km column. My arithmetic for a 5 nm radius gives 29 MPa. This is the hand-off to Beat 5.

**Corrected.**
- **How high capillarity gets (4.3).** From centimetres in wide vessels (about 6 cm at 500 µm and 0.3 m at 100 µm, my arithmetic; CSBSJU 0.148 m at r = 100 µm) up to **about 3 m** in the narrowest tracheids (Brown: "Even with the optimal 10µm, a sap rise of only 3m"). That is higher than the brief's "under 1 to 2 m". A 100 m rise would need a radius of about 0.15 µm, "about 180 times" narrower than xylem (OpenStax). Safe: "a few centimetres to a few metres at best". CSBSJU adds that capillarity would fill a tube once and then stop; it can't keep water flowing.

## Beat 5, nature's answer: pull from the top

**Solid.**
- **The mechanism (5.3).** Water evaporates from wet mesophyll cell walls into the leaf's air spaces, the vapour leaves through the stomata, and the tension pulls on continuous columns down to the roots (OpenStax, TCD, Wheeler & Stroock, RHS).
- **Cohesion (hydrogen bonds) and adhesion (to the walls) (5.4)** (UMN, OpenStax "pulled up like a chain", CSBSJU).
- **A stretched liquid (5.5).** Stroock et al.: "liquid water in the thermodynamically metastable state of negative pressure, similar to a rope under tension". Wheeler & Stroock: absolute pressure "often negative". Ponomarenko: "'wires of water' set under tension".
- **The pressure chamber (5.8).** Scholander et al., Science 1965. Holbrook et al. 1995 validated it with a spinning branch ("directly validates the balancing pressure technique"). TCD: Dixon built a glass version in 1922 that exploded; it was "reinvented" in 1965 in metal.
- **Challengers (5.11).** Bentrup 2017 / the Zimmermann school. Use as a one-line caveat at most.

**Corrected.**
- **Dixon & Joly (5.1).** Henry Horatio Dixon (botanist) and John Joly (geologist and physicist) of Trinity College Dublin published in 1894 (a short abstract) and in 1895 ("On the Ascent of Sap", Phil. Trans. R. Soc. B 186:563). TCD says 1895; Britannica, Brown and Bentrup say 1894; Bentrup also credits Boehm (1893). Safe: "in the mid-1890s".
- **Strasburger (5.2).** Stems kept drawing water after being poisoned. The flow stopped only when the poison reached the leaves (Baltimore Sun/LJWorld). Date conflict: TCD 1892 vs Dixon & Joly's own "Summer of 1893".
- **Typical tensions (5.6).** Scholander: −4 to −5 atm in damp forest, −80 atm in desert, −35 to −60 atm in mangroves (my conversion: about −0.4 to −8 MPa). OpenStax gives about −2 MPa at the leaf. No opened source gives measured tall-tree values (Koch full text unavailable). Safe: "many times atmospheric pressure, but negative".
- **Water's strength (5.7).** About −26 MPa (Herbert et al., acoustic) vs −140 MPa at 42 °C in quartz inclusions (Zheng et al.). The two methods disagree. Real xylem fails far earlier, through air seeding.
- **Shrinking trunks (5.9).** WSL/TreeNet: stems shrink and swell by 1 to 200 µm a day. Oberhuber: the xylem itself changes only about 10 to 25 µm a day (minimum around 3 p.m.), while the inner bark changes about 140 µm. Sevanto: the shrink travels downward with a 10 to 50 min lag, "in good agreement with the cohesion theory". Safe: "trunks shrink by up to a few tenths of a millimetre during the day".
- **Energy from the sun (5.10).** TCD: "The energy to drive this process came solely from the sun". OpenStax frames it as the soil-to-air energy difference; RHS: water "warmed by the sun and evaporates". Dry air matters too. Safe: "the sun and the dry air do the lifting; the tree pays nothing for the lift itself".

## Beat 6, the danger: when the rope snaps

**Solid.**
- **Cavitation and embolism (6.1).** A gas bubble breaks the column and the conduit fills with gas (Choat 2012, OpenStax, Ponomarenko).
- **Air seeding through pit membranes (6.2):** Johnson 2022 ("air seeding at inter-conduit pit membranes"), Sperry 2006, Kaack 2021. How the very first bubble forms is less settled.
- **Pits as safety valves (6.4).** Pit membranes pass water but "limit the spread of embolism" (Choat 2008). In conifers, a torus-margo pit seals "by the aspiration of the impermeable torus" (Sperry 2006), and "the torus margo shuts rapidly isolating the intact tracheid" (Johnson 2022). There is a trade-off: pits are over 50% of xylem resistance (Choat 2008), and safer pits conduct less (Domec 2008).
- **Vulnerability curve and P50 (6.5):** the tension at 50% loss of conductivity (Johnson 2022; Smith-Martin 2025).
- **Drought mortality (6.6).** "Xylem hydraulic failure was ubiquitous" at drought death, with 60% or more conductivity lost (Adams 2017). Hydraulic failure is a "primary cause" (Choat 2012). In conifers, the point of no recovery was a 95% loss of leaf conductance (Brodribb & Cochard 2009). Say "mainly", not "only": carbon starvation also plays a part in some species.

**Corrected.**
- **The clicks (6.3).** Milburn & Johnson (1966) detected "clicks" from water-stressed *Ricinus* (castor bean), correlated with water status. The opened summary does not say whether those clicks were audible or ultrasonic. Modern sensors listen above 20 kHz, typically 50 to 200 kHz (PROMETHEUS). Ponomarenko 2014 showed that each ultrasonic pulse is one bubble. Any sound in the video is an illustration, not a recording.
- **Refilling (6.7).** This is contested. Stroock 2014 says plants "bind it back together", but Venturas 2017 cites "current debates on conduit refilling", and Stewart 2026 found no refilling in intact sunflowers and suspects widespread artefacts. Cochard & Delzon 2013 is titled "Hydraulic failure and repair are not routine in trees" (title only seen). Safe: "scientists still argue about whether trees can repair a broken column; often the pipe is simply written off and the tree grows new wood".

**Dropped.**
- "70% of 226 forest species operate with safety margins under 1 MPa" (Choat 2012). The only other supporting source shares authors (Brodribb, Cochard), so it is one family. It would be a strong line if the fact checker can find an independent second source.

## Beat 7, the limit

**Solid.**
- **Top leaves are water-starved (7.3).** Koch: leaf water stress rises with height and "may ultimately limit leaf expansion and photosynthesis". Ishii: leaf water potential "decreased linearly" with height, and morphology changed with it. Nature News: "Leaves near the ground are broad and well-spaced; those at the top are small and scrunched", with the treetops "effectively living in constant drought". Ambrose found leaf mass per area rising with height in giant sequoia. Caveat: these are largely one research family.
- **Hyperion is under the ceiling (7.4):** 116 m vs 122 to 130 m, leaving 6 to 14 m of headroom (my arithmetic). NPS: redwoods "frequently lose sections of their crown due to wind and lightening".

**Corrected.**
- **Koch et al. 2004 (7.1)** estimated "a maximum tree height of 122-130 m barring mechanical damage". It is a regression extrapolation (model), not a law. Koch's "tallest known tree on Earth (112.7 m)" was the Stratosphere Giant, measured before Hyperion was found. Bentrup criticises the method. Nature News and the Baltimore Sun ("no higher than 425 feet") reported it.
- **Gravity's cost (7.2):** about 0.01 MPa per metre (Bentrup, CSBSJU; Scholander: the gradient "closely corresponds to the height"), about 1.1 MPa for Hyperion (my arithmetic), plus friction (CSBSJU's estimate is about 0.02 MPa/m). **OpenStax's "−0.1 MPa m⁻¹" is a tenfold error.**
- **A second model (7.5).** Domec 2008 (Douglas-fir pit anatomy) extrapolates to near-zero pit transport at 109 m in trunks and runaway embolism at about 107 m. Its numbers come from one family, so use it qualitatively: "a different team, a different species, a similar ceiling".
- **Historical giants (7.6).** "Historical accounts of taller trees" (Koch). Douglas-fir "historic height records of 100-127 m" (Domec) and "120m in 1924" (Brown). All unverified. No source was opened for historical mountain ash claims, so leave them out.

## Beat 8, scale and close

**Corrected.**
- **How much water (8.1).**
  - USGS: a large oak can transpire "40,000 gallons (151,000 liters) per year". The page gives no source and the figure is illustrative. That averages about 410 L/day over a year (my arithmetic), with much more on summer days.
  - Wullschleger et al. 1998: measured use ranges from 10 to 1,180 kg/day (52 studies); almost 90% of observations fall between 10 and 200 kg/day for trees averaging 21 m.
  - RHS: "A mature tree can drink up to 900 litres (200 gallons) of water a day".
  - Safe: "hundreds of litres on a summer day; the biggest, close to a tonne".
- **Almost all of it evaporates (8.2).** UNL: "less than 5% … remains in the plant". RHS: "Only around two per cent is used". LibreTexts (OpenStax text): "Less than 1%". But OpenStax Biology also says "Up to 90 percent" is lost. Say "almost all", without a percentage.

**Dropped.**
- Sap velocity in metres per hour: only one source, CSBSJU (vessel flow 4 to 13 mm/s, about 14 to 47 m/h), with no second source found. Typical values vary by an order of magnitude between conifers and ring-porous trees. If needed, the fact checker could source it from a sap-flow review.
- "A leaf transpires many times its own weight in a season": USGS only.
- "An acre of corn gives off 3,000 to 4,000 gallons a day": USGS only, and off-topic.

## Planned beats the sources do not support as written

| README / brief wording | Problem | Safe version |
| --- | --- | --- |
| "capillary rise … well under a metre" / "under ~1-2 m" | The narrowest tracheids give about 3 m (Brown; my arithmetic) | "a few centimetres to a few metres at best" (4.3) |
| "sap in spring maples" as root pressure | Maple sap is freeze-thaw stem pressure | Use birch or grapevine for root pressure; maple only as the exception (3.3, 3.4) |
| "many conifers show little/none" root pressure | Conifer seedling studies conflict | "varies a lot between species" (3.6) |
| "Dixon and Joly, 1894" | 1894 abstract, 1895 paper; TCD says 1895 | "in the mid-1890s" / "1894-95" (5.1) |
| "the 17th-century well-pump problem … 10.3 m" | The historical figure was "18 braccia, about 11 m" | Give the physics value (10 m) separately from the history (2.3) |
| "~97-99% transpired" | OpenStax says "up to 90%"; others say more than 95% | "almost all of it" (8.2) |
| "audible as ultrasonic clicks" | Ultrasonic means above human hearing; the 1966 clicks' frequency is unstated | "clicks that sensitive microphones can pick up, most of them too high-pitched to hear" (6.3) |
| "pits … act like valves that seal off a failed pipe" | Fine for conifer torus-margo pits. Angiosperm pits are fine-pored filters with no moving part | "safety valves" for conifers; "filters that stop the air" in general (6.4) |
| "Drought kills trees this way" | Mainly, but carbon starvation contributes in some species | "Drought kills trees mainly this way" (6.6) |
| "gravity: 0.1 MPa/m" (if lifted from OpenStax) | A tenfold error | "about one atmosphere for every ten metres" (7.2) |

## Visual reference numbers (for the 3D and 2D artists; not for narration unless also in a claim)

Two-family items are claims; the rest are single-source and fine for modelling only.
- **Conduits (4.2, 9.1).**
  - Conifer tracheid: 10 to 65 µm wide and under 6 mm long. Single cells with tapered, closed ends, joined by bordered pits.
  - Vessels: tens to hundreds of µm wide, made of stacked cells with open (perforated) ends. Mean lengths are about 1 to 27 cm, with maxima over 75 cm in some trees.
  - Proportion: a tracheid is roughly 100 times longer than it is wide.
- **Leaf cross-section (9.2).** Top to bottom: waxy cuticle, upper epidermis, one to three layers of column-shaped palisade cells, loose spongy mesophyll with large air spaces, lower epidermis with stomata (guard-cell pairs). This is a typical broadleaf. Redwood needles differ; get a separate reference if the leaf is meant to be a redwood.
- **Stomata (single family: BioNumbers BNID 101758, citing Hetherington & Woodward 2003, Nature, which cites Willmer & Fricker 1996).** About 10 to 80 µm long, at 5 to 1,000 per mm² depending on species, mostly on the lower surface (OpenStax and UMN for the location).
- **Cell-wall pores where evaporation pulls (4.4).** About 10 nm (Steudle via Brown); CSBSJU uses a 5 nm radius. That is about 1/5,000 of a 50 µm tracheid's width, too small to show to scale, so use a zoom-in sequence.
- **Pit membrane pores (single family: Jansen lab, Zhang et al. 2024 and Kaack et al. 2021).** Angiosperm intervessel pit membranes are multi-layered and "mesoporous", with pore constrictions "between 5 and 50 nm" (Zhang 2024 abstract).
- **Torus-margo pit (6.4).** A solid central disc (torus) suspended by a porous web (margo) inside a domed bordered pit. When a neighbour is air-filled, the torus is pulled against the aperture (aspiration), sealing it (Sperry 2006; Johnson 2022).
- **Hyperion (single family: Guinness).**
  - 116.07 m tall (2019).
  - Trunk diameter 4.94 m.
  - About 600 to 800 years old.
  - Grows on a hillside, so heights are averaged between the low and high sides.
- **Redwood roots (single family: NPS Hyperion page):** "incredibly shallow, reaching down 12 feet on average", about 3.7 m.
- **General Sherman (NPS):** 83.8 m tall; first large branch at 39.6 m.
- **Scale comparisons for the height graphic:**
  - suction limit 10.3 m;
  - root-pressure reach about 10 to 30 m (3.5);
  - best capillarity about 3 m (4.3);
  - General Sherman 84 m;
  - Doerner Fir about 99 m before the fire;
  - mountain ash about 100 m;
  - Hyperion 116 m;
  - Koch ceiling 122 to 130 m.

## Five surprising true details for on-screen moments

- In a sunlit tree the water is at *negative absolute pressure*, "a rope under tension" (Stroock 2014) (5.5).
- Each embolism makes an ultrasonic click, one click per bubble (Ponomarenko 2014) (6.3).
- Trunks shrink during the day, and the shrinking starts at the top and travels down the tree (Sevanto 2002; WSL) (5.9).
- The first pressure chamber, Dixon's 1922 glass version, exploded (TCD) (5.8).
- The tallest redwood tops live "in constant drought" with their roots in wet soil (Nature News) (7.3).

## Terms that may trip the TTS voice

| Term | Suggested reading |
| --- | --- |
| xylem | ZY-lum |
| tracheid | TRAY-kee-id |
| stomata / stoma | STOH-muh-tuh / STOH-muh |
| mesophyll | MEZ-oh-fill |
| palisade | pal-ih-SADE |
| guttation | gut-TAY-shun |
| hydathode | HY-duh-thode |
| cavitation | kav-ih-TAY-shun |
| embolism | EM-buh-lizm |
| torus / margo | TOR-us / MAR-go |
| transpiration | tran-spih-RAY-shun |
| Sequoia sempervirens | sih-KWOY-uh sem-per-VY-renz |
| Eucalyptus regnans | yoo-kuh-LIP-tus REG-nanz |
| Torricelli | tor-ih-CHEL-ee |
| Baliani | bahl-YAH-nee |
| braccia | BRAHT-chah |
| Strasburger | SHTRAHS-boor-ger |
| Joly | JOH-lee |
| Scholander | SHOH-lan-der |
| MPa | "megapascals" (write out) |
| µm | "micrometres" (write out) |
| P50 | "P fifty" (avoid in narration) |
