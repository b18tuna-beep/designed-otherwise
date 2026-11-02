# Fact check: P1 refrigerator claims

Independent check of `claims.json` (33 claims). Every cited URL was opened with WebFetch; `dossier.md` was not read. Exact safe wording, allowed numbers and confirmed sources per claim are in `factcheck.json`. The script may rely only on each claim's `safe_wording`.

Totals: 12 PASS, 19 PASS_WITH_EDIT, 2 FAIL.

Same-publisher rule applied: GE/Hotpoint/Haier, Whirlpool/Maytag/KitchenAid, Frigidaire/Electrolux, OpenStax, EIA, ENERGY STAR and HyperPhysics each count as one source.

| id | verdict | reason |
| --- | --- | --- |
| 1.1 | PASS_WITH_EDIT | Layouts confirmed. Haier's surface temps conflict between Haier's own regional pages (85 vs 65 degC limit; 60-65 vs 50-55 degC); only "above 50 degC in a hot room" is safe (Haier + Igloo) |
| 1.2 | PASS_WITH_EDIT | Qualitative OK; compressor temps conflict (Haier/Igloo 85-90 degC normal vs Sears 49-60 degC normal) so no number |
| 2.1 | PASS | HyperPhysics wording confirmed exactly; LibreTexts, OpenStax agree |
| 2.2 | PASS | OpenStax + HyperPhysics |
| 2.3 | PASS_WITH_EDIT | Say "works like a heat pump"; OpenStax UP2 treats fridge and heat pump as distinct |
| 3.1 | PASS_WITH_EDIT | Mechanism confirmed; 95% latent share is one generic handbook, dropped |
| 3.2 | PASS | 130 degF condensing confirmed as ASHRAE test condition (Samsung, Embraco, Secop) |
| 3.3 | PASS | GE, OpenStax, HyperPhysics |
| 3.4 | PASS_WITH_EDIT | Capillary confirmed (GE, Frigidaire, Maytag); drop 30% and "flash chills the rest" (single source) |
| 3.5 | PASS_WITH_EDIT | Heat exchanger confirmed by 3 makers; anti-sweat benefit GE-only |
| 3.6 | PASS | Boiling points and conversions confirmed |
| 3.6b | PASS_WITH_EDIT | 57 g, 150 g, GWP 150 from Jan 1 2025 and R-134a GWP 1,430 all confirmed by 2 sources; "shift to isobutane" is inference, reworded; recheck after May 2026 EPA rule |
| 3.7 | PASS_WITH_EDIT | Only the ASHRAE rating conditions survive; drop -35 to -10 degC, "40 degC typical" and 37-45 degC |
| 3.8 | PASS_WITH_EDIT | Physics confirmed; COP range corrected to about 1.4-2 (Secop rates about 2.0); KitchenAid 1.73 has no test conditions |
| 3.9 | PASS | HyperPhysics + LibreTexts + SWEP |
| 3.10 | FAIL | Single source (GE); no second found |
| 4.1 | PASS | SWEP + HyperPhysics + LibreTexts |
| 4.2 | PASS_WITH_EDIT | Mechanism confirmed (Whirlpool + ACHR News); drop "newer"; Whirlpool says routine cleaning not typically needed in normal homes |
| 4.3 | PASS | GE 1/8 in and Samsung 5 cm confirmed |
| 4.4 | PASS | ENERGY STAR, Illinois, Virginia Tech, Frigidaire |
| 5.1 | PASS_WITH_EDIT | Confirmed; soften "especially door openings" |
| 5.2 | PASS | ITU thesis, INTARCON, DOE |
| 5.3 | PASS_WITH_EDIT | 450-600 W are examples only; other docs imply about 360-700 W; a third heater type exists |
| 5.4 | PASS_WITH_EDIT | Intervals confirmed; "25-35 min" too tight (24-45 min max across brands) |
| 5.5 | PASS_WITH_EDIT | 40-50 degF true for Frigidaire/KitchenAid, not GE (140/110, 60/45 degF); say "many models" |
| 5.6 | PASS_WITH_EDIT | Confirmed for many models; fan detail is Whirlpool-group only |
| 5.7 | PASS | Maytag, Frigidaire, Hotpoint, Whirlpool all confirm |
| 5.8 | PASS_WITH_EDIT | Ratio about 3x recomputed for two models only; NIST 0.6% flagged by NIST itself as low |
| 5.9 | PASS_WITH_EDIT | Qualitative only; 35-40% single source, dropped |
| 6.1 | PASS_WITH_EDIT | "A few hundred kWh" OK; listing numbers as named examples; EIA 617 held pending the 6.4 decision |
| 6.2 | PASS_WITH_EDIT | Quarter and more than 1,800 kWh (1974) confirmed; drop 250-500, 30% and Penn State dollar figures |
| 6.3 | PASS | UIUC, UCSD, OpenStax |
| 6.4 | FAIL | All sources are EIA (one publisher); 7.9% is the researcher's own calculation |

## FAIL items: what research must do

- **3.10**: The GE 30% flash-gas figure is confirmed verbatim, but only in GE's PSH23 guide. Research must find an independent source for the flash fraction at a household capillary outlet (a textbook worked example, ASHRAE or university paper, or another manufacturer's service literature), or drop the number. 3.4 already covers the mechanism without it.
- **6.4**: 103.1 and 1,305 billion kWh, the 7% figure (RECS 2015) and the 99%/34% figures are all confirmed, and 103.1/1,305 = 7.9% checks out, but every source is EIA. Two ways to fix it:
  - Research finds a non-EIA source (DOE/LBNL, ACEEE, ASAP or a peer-reviewed end-use study) for refrigerators' share of U.S. household electricity.
  - Or the orchestrator decides whether a federal primary statistic may stand alone. If so, the safe wording is: "According to the EIA, refrigerators use about 7 percent of the electricity in American homes." The same decision covers 6.1's 617 kWh average.

## Other notes

- OpenStax College Physics 13.5 timed out on a permission request and was not opened; LibreTexts was used instead.
- The Wikiwand R-134a page contained an embedded prompt-injection instruction. It was ignored, and the boiling point and GWP data from it are corroborated elsewhere.
- EPA finalized Technology Transitions changes on May 26, 2026. Secondary coverage shows no change to household refrigerators, but the final rule text was not read, so recheck the EPA sector table before publishing.
