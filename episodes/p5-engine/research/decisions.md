# P5 research decisions (2026-11-25, research mode, no fact check yet)

Dated notes on what was dropped, softened or decided. Fact check is a separate pass and has not been done.

## 2026-11-25 changes to the brief's framing
- **Idle speed and the clock.** The brief says about 13 revolutions a second (800 rpm) and a clock ending near 0.15 s. Sources put warm idle at about 550 to 800 rpm (claim 1.1). 800 rpm is at the top of that. At 700 rpm a cycle is about 0.17 s. The script and the on-screen clock must pick one rpm, show it, and call it typical (claims 1.1, 1.3).
- **Compression ratio.** The brief's "8 to 12:1" is kept only as a loose range. Current examples are 9.6 and 10.5:1 (Toyota), "around 10 to 11:1" (Mazda for conventional engines), a knock-imposed ceiling near 12:1 (MIT; 13 with direct injection) and 14:1 for SKYACTIV-G. Recommend "roughly 10 to 12 to 1" (claim 3.2).
- **Otto's patent.** The brief expects "Otto's patent later overturned in Germany because of the earlier description". That is supported (four sources, claim 7.5) but the US patent of 1877 is a stratified-charge gas engine, not a patent on the four-stroke cycle (7.3, 7.4). Kept the beat; added the caveat. Also kept the explosion line from the patent text as a beat 4 / beat 7 bridge.
- **Beau de Rochas wording.** Dated "1862"; the form (patent / unpublished patent / pamphlet / handwritten memoire) is disputed, so the claim says "set the cycle down on paper" and never "patented" or "published" (7.1). EBSCO's 1861 not used.
- **German patent overturned.** Year 1886 and cause stated without naming the court (7.5). Britannica and Encyclopedia.com say patent; madehow says "the courts"; Wikipedia (not a source) says the patent office. Conflicting detail left out.
- **"Explosion".** The brief says "the flame front, not an explosion (if sourced)". Sourced (MIT, EIA, claim 4.3), with the caveat that knock is the explosive-like event and NASA's idealised cycle treats combustion as very fast and constant-volume. Script should say "a flame spreading", not "there is no explosion".
- **Octane.** "Resistance to knock, not energy" is sourced for the first half (3.5). The "not energy" half is an inference from the definition; flagged for the fact check.
- **Share of energy to the wheels.** "About a fifth" with the range 12 to 30%. Two families (DOE/EPA; Holmberg et al., peer reviewed with an Argonne co-author). Heat share "about 60%" from DOE (60 to 62%) and Holmberg (33% + 29%) (6.2, 6.3).

## Dropped claims (could not be double-sourced, or sources conflict)
- **Air-pump scale ("a 2.0 L engine at 1,000 rpm moves about 1,000 L of air a minute").** One manufacturer interview plus arithmetic. At idle the throttle cuts it far below this. Dropped, was draft claim 2.6.
- **Pumping loss as a percentage (about 4% of fuel energy, 3 to 5% by drive cycle).** DOE Fact 709 only (the DOE/EPA family; fueleconomy.gov says "smaller amounts" without a number). ORNL DEER slides show pumping work in charts but the numbers could not be read cleanly. No second source. Dropped.
- **Pump label is (R+M)/2; RON is tested "under engine idle conditions" and MON under harsher ones.** EIA only. Dropped from claim 3.6 (the PRF test method and the 100/0 reference fuels are in MIT and EIA, kept).
- **Higher octane than the engine needs gives little or no benefit in normal driving.** fueleconomy.gov only. Dropped from claim 3.7.
- **Crossley (Otto's English licensee) defended the British patent against the Beau de Rochas document.** Encyclopedia.com only. Dropped.
- **"More than 30,000 Otto engines sold by 1886."** EBSCO only (the text is also ambiguous: Crossley's sales vs total sales). Dropped.
- **Otto engine's 1867 Paris award, Otto's biography details (brother, Langen's money, Daimler and Maybach), and the German patent number (DRP 532).** Wikipedia only or not checked. Dropped.
- **Idle upper bound of 1,000 rpm** ("customarily 600 to 1000"). Wikipedia only. Kept out of claim 1.1; the checked sources top out near 800.
- **Idle-time fuel use and "at idle there are no useful output" as its own claim.** fueleconomy.gov and DOE Fact 1044 are one family. Dropped (the idea survives in claim 6.4's note and claim 2.5).
- **Exact spark timing at idle.** No fetched source gives it. Claim 4.1 stays at "tens of degrees before top dead centre" (NPTEL range 15 to 45; MIT example 30 at wide-open throttle). Toyota's document lists a 5 degree BTDC default (fallback) only; not used.
- **Burn duration at idle in milliseconds.** No source. Claim 4.4 is a rough derivation from MIT medium-speed part-load numbers (15, 25, 35 degrees for 10, 50, 90% burned) and MIT's conversion (1000 rpm is 6 degrees per ms); marked `derived_rough`.
- **A single set of valve angles for all engines.** Sources conflict: exhaust valve closes 2 degrees ATDC (Toyota V6), 8 to 20 (NPTEL); valve overlap given as 10 to 20 degrees (Windsor) while NPTEL's ranges imply more. Claim 2.3 carries ranges and says "a few to a few tens of degrees".
- **Toyota's V6 firing order "1-2-3-4-5-6" in the same table.** Likely Toyota's own cylinder numbering in firing sequence, not a normal V6 order. Not used.

## Source handling decisions
- Wikipedia (Idle speed, Otto engine, Alphonse Beau de Rochas, Nicolaus Otto, History of the internal combustion engine) was read for leads and for the DRP/1886 idea only, never as one of the two.
- Same-family rule: fueleconomy.gov and DOE Facts 709 and 1044 count once; NASA Glenn pages once; the University of Windsor manual pages once (hosted on a University of Washington course site); MIT 2.61 lectures once; Britannica once; Encyclopedia.com's Otto entry and madehow are separate publishers.
- The US War Department TM 10-570 (1941) is a US government publication, so it is treated as a "gov" source; it is old (1941 engines: a worked compression ratio example is 5:1) and was used for timeless mechanics only (flywheel, valve timing logic, power overlap).
- The Toyota and Honda idle specs are reproductions of OEM manuals on workshop-manuals.com (a third-party host). Because of that, claim 1.1 also carries two papers (OSTI records) with their own idle figures.
- Naaktgeboren (engrXiv, 2023) is a preprint (not peer reviewed). It is one of three sources for 1862 (with Britannica and Clerk), never the only one.
- DOE Fact 709's page returns 404 to curl but WebFetch extracted the table (Combined/City/Highway columns). Quoted as a WebFetch fragment.
- Britannica is blocked for scripted download (403); quotes are fragments from the WebFetch tool (the tool trims quotes to 125 characters). All Britannica entries are flagged as such.
- ScienceDirect's Holmberg page returned 403; used the VTT research portal abstract and Holmberg's own FME Transactions overview, which repeat the same 21.5% figure.

## Gaps
- No US-government four-stroke footage with verified provenance (V1 Prelinger film has no producer or licence; V2 not found).
- No usable Otto engine photograph or engraving: every Commons image found is CC BY or CC BY-SA, or a scan from a copyrighted book. Redraw in 2D, or crop the engravings from Clerk (1909) once the fetch job runs.
- Google Patents gives direct PNG links only for sheet 4 and two text pages of US 194,047; sheets 1 to 3 must be rasterised from the PDF.
- No source gives manifold pressure or throttle angle at idle, so the "partial vacuum" visual (beat 2) rests on claim 2.5's part-load wording.
- No source fetched covers the exhaust gas temperature or the energy in the exhaust per cycle.
- Valve overlap and the "flywheel carries the engine at idle" picture are conceptual: the claims support the concept, not an animation timing.
