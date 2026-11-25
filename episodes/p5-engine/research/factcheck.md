# P5 engine: independent fact check

Checked 2026-11-25 against claims.json (36 claims, 40 URLs opened, 13 assets). dossier.md and decisions.md were not read.

**PASS 10 / PASS_WITH_EDIT 26 / FAIL 0**

Method: every cited URL was fetched directly (curl) or, where blocked, with WebFetch (the five Britannica pages, the Windsor flywheel page, DOE Fact 709, MadeHow). PDFs were converted with pdftotext; the Clerk (1909) book was read as full OCR text from archive.org; the Otto patent was read from the Google Patents OCR text and the 8-page PDF was downloaded. Each quote was normalised and matched against the fetched text, numbers were compared across sources, and independence was judged by publisher family (fueleconomy.gov, energy.gov and DOE Fact 709 count once; Gale's Encyclopedia.com and MadeHow count once; MIT lecture slides count once). Wikipedia was used only to find leads and never counted. Numbers are allowed only where two independent sources agree, or are given as a range, or attributed to the single named source and flagged. Where sources conflict the claim is allowed without the number.

## Summary of every claim

| id | verdict | reason |
| --- | --- | --- |
| 1.1 | PASS_WITH_EDIT | Range only; 700 rpm as a labelled example; 13/s is the 800 rpm edge. |
| 1.2 | PASS | All four families matched. |
| 1.3 | PASS_WITH_EDIT | Arithmetic verified; say which rpm. |
| 1.4 | PASS | Three families matched. |
| 2.1 | PASS_WITH_EDIT | 'Air pump' parenthetical not in any source; dropped. |
| 2.2 | PASS_WITH_EDIT | 'In theory'; zero convention; MIT quote is only a slide title. |
| 2.3 | PASS_WITH_EDIT | Concept only; angles differ by engine, ranges allowed. |
| 2.4 | PASS | NASA and Britannica agree. |
| 2.5 | PASS_WITH_EDIT | 'At idle' not sourced; say 'low load such as idle'; pumping is one of the smaller losses. |
| 3.1 | PASS | Matched. |
| 3.2 | PASS_WITH_EDIT | Typical 10-12:1; 8:1 unsupported; 14:1 outlier; 12 is not a hard cap. |
| 3.3 | PASS_WITH_EDIT | Mazda's knock wording loose; use auto-ignition wording. |
| 3.4 | PASS | MIT and EIA matched. |
| 3.5 | PASS_WITH_EDIT | Knock-resistance half matched; 'not energy' half is a derivation from the definition, no independent source says it. |
| 3.6 | PASS_WITH_EDIT | 'Percentage of iso-octane' and test-engine detail not in two sources. |
| 3.7 | PASS | Matched. |
| 3.8 | PASS | US only; no midgrade. |
| 4.1 | PASS_WITH_EDIT | Before TDC firm; angle is range-only; no idle angle. |
| 4.2 | PASS_WITH_EDIT | Late/early reasoning and 14-17 degrees are MIT only; attribute. |
| 4.3 | PASS_WITH_EDIT | Say flame front vs knock; never 'no explosion at all'; kernel numbers MIT only. |
| 4.4 | PASS_WITH_EDIT | Burn angles MIT only; not idle. |
| 5.1 | PASS_WITH_EDIT | Cited NASA quote is about the spark; replacement NASA page found. |
| 5.2 | PASS | Matched. |
| 5.3 | PASS_WITH_EDIT | Even-firing only; 8-cylinder figure is arithmetic; no four-cylinder overlap. |
| 5.4 | PASS_WITH_EDIT | 'Common', not universal; 1-2-4-3 exists. |
| 6.1 | PASS | Matched. |
| 6.2 | PASS_WITH_EDIT | DOE is one family; about a fifth; attribute ranges. |
| 6.3 | PASS_WITH_EDIT | About 60% as heat; exhaust/cooling split single-source. |
| 6.4 | PASS_WITH_EDIT | Sources conflict (low 30s vs 38): 'roughly a third', no digit. |
| 7.1 | PASS_WITH_EDIT | 1862 allowed (EBSCO 1861 outlier); say 'described', not 'patented'. |
| 7.2 | PASS | All four agree; no month. |
| 7.3 | PASS_WITH_EDIT | It is a layered-charge gas-engine patent, not 'the four-stroke patent'; no application date. |
| 7.4 | PASS_WITH_EDIT | Patent 'explosion' line is about its layered charge; the patent also describes four piston strokes. |
| 7.5 | PASS_WITH_EDIT | 1886 and cause agree; do not say courts or patent office. |
| 7.6 | PASS_WITH_EDIT | 1867 gold medal confirmed; ignore NPTEL merge of Lenoir and Otto. |
| 7.7 | PASS_WITH_EDIT | Say 'described it earlier'; Otto was first to build. |

## FAIL

None. No claim was unsupported outright. The closest calls are 3.5 (the 'not energy' half has no independent source) and 4.2 / 4.4 (single MIT family): they pass only in the narrowed wording below.

## Hard-line items asked for

- **Idle rpm (1.1):** range 550-800 rpm; use about 700 as a labelled example. Not 1,000; 13 per second is the 800 rpm edge.
- **Cycle time (1.3):** 120/rpm seconds: 0.150 s at 800, 0.171 s at 700, 0.200 s at 600. Always state the rpm.
- **Compression ratio (3.2):** typical roughly 10:1 to 12:1; Mazda 14:1 is a named outlier; 'about 8 to 12' is not supported.
- **Share of fuel energy to the wheels (6.2):** about a fifth; DOE 12-30% depending on cycle (17-21% combined), Holmberg 21.5%.
- **Octane (3.5):** 'resists knock' is solid; 'not energy' is a derivation from the definition, not a sourced statement.
- **Spark before TDC and flame front (4.1, 4.3):** before TDC firm, no idle angle; flame front supported by MIT and EIA; say 'flame, not detonation', never 'no explosion at all'.
- **Beau de Rochas 1862 (7.1):** 1862 allowed (four sources), EBSCO says 1861; say 'described', not 'patented'.
- **Otto 1876/1877 (7.2, 7.3, 7.4):** four-stroke engine built 1876; US patent 194,047 dated 14 Aug 1877 is a layered-charge gas-engine patent that also describes four piston strokes. Its 'instead of an explosion ensuing' refers to that layered charge, not to normal petrol combustion.
- **1886 (7.5):** German patent revoked; four sources agree on year and cause; do not say courts or patent office.

## Safe wording, allowed numbers and do-not-say, per claim

### 1.1 PASS_WITH_EDIT

**Safe wording:** Idle speed varies by engine and temperature, but a warm petrol car engine usually idles at a few hundred to under a thousand revolutions per minute, with service specifications and test engines clustering around 550 to 800 rpm. For the animation, use about 700 rpm as a typical example (11.7 turns a second) and say it is an example.

**Allowed numbers:** 550-800 rpm (range across the four sources); 650-750 rpm (Toyota Yaris 2007 automatic; 550-650 manual); 700 +/-50 and 750 +/-50 rpm (Honda CRX 1987); 650 rpm (nominal, LAAS report); 600/700/800 rpm (lab engine, hydrogen paper); about 700 rpm as a labelled example

**Do not say:**
- Do not say 'a car idles at 1,000 rpm'.
- Do not say 'about 13 times a second' unless the on-screen rpm is 800: 13.3 turns a second is the top of the range, not the middle.
- Do not present one rpm as universal; cold engines idle higher, newer engines may idle lower.

**Check:** Toyota and Honda spec pages are both reproduced by workshop-manuals.com but are two OEM data sets (counted as two families); the hydrogen paper and the LAAS report are independent third and fourth sources. All quotes matched. Spec pages are 1987 and 2007 vehicles, so 'modern' is a stretch: stay at 'warm petrol engines'. Wikipedia's 600-1000 was not counted. 700 sits inside every source's range, so it is a safe on-screen example.

### 1.2 PASS

**Safe wording:** One full four-stroke cycle (intake, compression, power, exhaust) takes two turns of the crankshaft, which is 720 degrees of crank angle.

**Allowed numbers:** 2 crank revolutions per cycle; 720 degrees; 4 strokes

**Check:** Britannica (WebFetch: 'two revolutions of the crankshaft'), Univ. of Windsor, Autozine and NASA Glenn are four independent families; all matched.

### 1.3 PASS_WITH_EDIT

**Safe wording:** The time for one cycle depends on engine speed: one cycle lasts 120 divided by the rpm, in seconds. At an example idle of 700 rpm that is about 0.17 seconds; at 800 rpm 0.15 seconds; at 600 rpm 0.2 seconds. One degree of crank rotation lasts roughly a fifth to a quarter of a millisecond at those speeds.

**Allowed numbers:** 0.150 s at 800 rpm; 0.171 s at 700 rpm; 0.200 s at 600 rpm; 0.208 ms per crank degree at 800 rpm; 0.238 ms per crank degree at 700 rpm; about 0.2 to 0.3 ms per crank degree across 600-800 rpm (0.28 ms at 600)

**Do not say:**
- Do not say 'about 0.15 seconds' without saying the rpm it assumes (800).
- Do not say '0.2 ms per degree' at 600 rpm (it is 0.28 ms).
- Do not describe this as sourced: it is arithmetic on claims 1.1 and 1.2.

**Check:** Pure arithmetic, re-computed independently: 120/800=0.150, 120/700=0.1714, 120/600=0.200; 1/(6*800)=0.2083 ms, 1/(6*700)=0.2381 ms. The formula is independently confirmed by an MIT slide in lec 9 (1000 rpm = 6 crank degrees per ms; 1200 rpm = 10 cycles/s = 100 ms per cycle), which is consistent. The two listed 'sources' (Britannica, Toyota page) are only the inputs. The result is only as good as the rpm chosen in 1.1.

### 1.4 PASS

**Safe wording:** In each cylinder only the power stroke makes work. The other three strokes are carried by the momentum of the flywheel and by the other cylinders.

**Allowed numbers:** 1 power stroke in every 4

**Do not say:**
- Do not say 'the other three strokes cost energy' as a flat fact: NASA says intake and exhaust 'do not contribute' in the ideal cycle, Autozine says all three consume power; use 'only the power stroke makes work'.

**Check:** TM 10-570 (US War Dept, 1941), Autozine and NASA Glenn: three families, all matched.

### 2.1 PASS_WITH_EDIT

**Safe wording:** On the intake stroke the piston moves from top dead centre down to bottom dead centre with the intake valve open. The falling piston lowers the pressure in the cylinder, and the air outside, at higher pressure, pushes the charge in through the open valve.

**Allowed numbers:** 0 to 180 degrees (convention: crank angle zero at the start of intake)

**Do not say:**
- Drop the parenthetical 'the engine acts as an air pump': no cited page says it.
- Say 'air', or 'air-fuel mixture' only for port-injected engines; in direct-injection engines fuel is added inside the cylinder (not sourced here, so avoid the detail).

**Check:** Windsor, Britannica and NASA matched (Britannica via WebFetch). 'Air pump' phrase is not on the Windsor page or the others and was removed. The 0-180 labelling is a convention, not a sourced number.

### 2.2 PASS_WITH_EDIT

**Safe wording:** In theory each stroke starts at top or bottom dead centre and lasts 180 degrees of crank rotation, so the four strokes of a cycle take up 0-180, 180-360, 360-540 and 540-720 degrees. In a real engine the valve events shift, so these are idealised.

**Allowed numbers:** 180 degrees per stroke; 720 degrees per cycle; 0-180 / 180-360 / 360-540 / 540-720 (labelling convention; say where zero is)

**Do not say:**
- Do not drop 'in theory'.
- Do not claim 0 is always the start of intake: many texts put zero at firing TDC.

**Check:** TM 10-570 ('In theory, an event or stroke ... 180 degrees') and Autozine (720 degrees) matched. The MIT quote is only a slide title and adds nothing; ignore it. Two families.

### 2.3 PASS_WITH_EDIT

**Safe wording:** The valves do not open and close exactly at the ends of the strokes. The intake valve opens a little before the piston reaches the top and closes well after it has passed the bottom. The exhaust valve opens before the bottom of the power stroke and closes at or just after the top, so for a short time both valves are open together (valve overlap).

**Allowed numbers:** Conceptual only. If a number is wanted, use ranges that two sources support: intake valve opens about 4-20 degrees before TDC (Toyota 4; NPTEL 5-20); intake valve closes about 40-60 degrees after BDC (Toyota 44; NPTEL 40-60); exhaust valve opens about 30-50 degrees before BDC (Toyota 46; NPTEL 30-50); exhaust valve closes about 2-20 degrees after TDC (Toyota 2; NPTEL 8-20).

**Do not say:**
- Do not give one set of angles as universal.
- Do not state an overlap angle: Windsor and NPTEL ranges do not agree.
- Variable valve timing moves these at runtime.

**Check:** TM 10-570, Colorado State, NPTEL, Windsor and Toyota/NHTSA matched. Numbers differ by engine and speed, so only the concept and the cross-source ranges are allowed.

### 2.4 PASS

**Safe wording:** Cams on a camshaft open the valves, and the camshaft turns at half the speed of the crankshaft, because each valve opens once every two crank revolutions.

**Allowed numbers:** 2:1 crank to cam

**Check:** NASA Glenn and Britannica (WebFetch: 'the camshaft turns half as fast as the crankshaft') agree.

### 2.5 PASS_WITH_EDIT

**Safe wording:** At low load, such as idle, the throttle partly closes the intake, so the engine pulls its air in against a restriction. Throttling is a main reason a petrol engine is less efficient at part load, because it increases pumping losses.

**Allowed numbers:** none

**Do not say:**
- Do not say 'at idle the engine wastes most of its energy pumping air'; fueleconomy.gov lists pumping among the smaller losses.
- Do not attribute 'main reason' to anything beyond the journal abstract; say 'a main reason'.

**Check:** OSTI journal abstract supports the throttle/part-load statement in the claim's own words. fueleconomy.gov names pumping as a loss (smaller). The MIT lec 19 quote is only a definition of pumping work. DOE Fact 709 (checked via WebFetch) adds that 'engine losses, such as exhaust heat and pumping, are higher for city driving', which is consistent. 'At idle' is not in any source; 'at low load such as idle' is the safe form.

### 3.1 PASS

**Safe wording:** Compression ratio is the volume of the cylinder at the start of compression divided by the volume left at the top of the stroke.

**Allowed numbers:** none

**Check:** NASA Glenn and TM 10-570 matched; both give the same definition.

### 3.2 PASS_WITH_EDIT

**Safe wording:** Typical petrol car engines run compression ratios of roughly 10 to 1 up to about 12 to 1. Knock is what holds the ratio down, and a few engines go higher: Mazda's SKYACTIV-G reached 14 to 1.

**Allowed numbers:** about 10:1 to 12:1 (typical); 10-11:1 (Mazda: conventional naturally aspirated); 12:1, 13:1 with direct injection (MIT lecture slide, knock-limited, attribute it); 14:1 (Mazda SKYACTIV-G, named outlier); 9.6:1 and 10.5:1 (two Toyota Camry-era engines in one 2004 filing; examples only)

**Do not say:**
- Do not say 'about 8 to 12 to 1': no source supports 8 for current engines (8.4 is a textbook example engine, 5:1 is 1941).
- Do not say knock 'caps' ratios at 12:1: Mazda shows 14:1 exists. Use 'holds the ratio down'.
- Do not give a ratio for turbocharged engines.

**Check:** Mazda (manufacturer), MIT slide (SI engine CR limited by knocking to 12, 13 with direct injection) and Toyota/NHTSA document matched. The MIT 12/13 figure and Mazda's 10-11 are each one source; they overlap at 10 to 12, which is what is allowed. The Toyota document is a 2004 filing: examples, not 'modern'.

### 3.3 PASS_WITH_EDIT

**Safe wording:** Squeezing the mixture harder makes it hotter and raises its pressure, and past a limit the unburned part can ignite by itself ahead of the flame. That is knock. Higher compression ratios give better efficiency, but they need fuel that resists knock.

**Allowed numbers:** none

**Do not say:**
- Do not use Mazda's 'fuel burns unevenly' as the definition of knock: use the auto-ignition wording from 3.4.

**Check:** Mazda, fueleconomy.gov and MIT matched. Mazda's wording is loose; MIT/EIA (3.4) are precise. EIA attributes the temperature and pressure rise in the end gas to the primary combustion as well as to compression, so say 'squeezing and burning heat the unburned mixture'.

### 3.4 PASS

**Safe wording:** Knock is not the normal burn. After the spark starts a flame, the unburned mixture ahead of it is squeezed hotter and can ignite by itself. The sudden release of energy produces pressure waves, the audible knock, and in severe cases can damage the engine.

**Allowed numbers:** none

**Do not say:**
- Do not say knock damages the engine every time: MIT says 'in severe knock'.

**Check:** MIT (lec 10: auto-ignition in end-gas; 'Pressure oscillation, Audible noise, Damage to combustion chamber in severe knock') and EIA agree. Independent families.

### 3.5 PASS_WITH_EDIT

**Safe wording:** Octane rating measures a fuel's resistance to knock, that is, to igniting by itself under compression. It is defined by how the fuel behaves in a test engine compared with reference fuels, not by how much energy the fuel holds.

**Allowed numbers:** none

**Do not say:**
- Do not say 'octane measures knock resistance, not energy' as a sourced quotation: none of the three cited pages says 'not energy'.
- Do not say higher octane 'gives more power' or 'burns hotter'.

**Check:** First sentence: fueleconomy.gov, EIA ('measure of fuel stability'), MIT ('A practical measure of a fuel's resistance to knock is the octane number') all matched. The 'not energy' half is not stated by any cited source; it follows from the definition in 3.6 (MIT, EIA: the number comes from matching knock behaviour, with no energy term), and the only explicit statement found is on a pei.org page (a copy of the Wikipedia sentence, not independent, not counted). Kept as a derivation from the definition, flagged. fueleconomy.gov also says higher octane than required gives 'little to no benefit' in normal driving.

### 3.6 PASS_WITH_EDIT

**Safe wording:** Octane is measured by matching the fuel's knock behaviour in a special test engine to a blend of two reference fuels: iso-octane, rated 100, and normal heptane, rated 0. The test engine changes its compression ratio until knock of a set intensity appears.

**Allowed numbers:** 100 (iso-octane); 0 (heptane)

**Do not say:**
- Do not say 'the octane number is the percentage of iso-octane in the blend' as sourced: neither cited page says percentage (the % by volume statement is on pei.org/Wikipedia only).
- The 'compression ratio is changed until knock appears' detail is EIA only.

**Check:** MIT and EIA matched (blend of reference fuels; 100 and 0 references). The percentage-of-iso-octane sentence and the test-engine detail are each single-source or uncited, hence edit.

### 3.7 PASS

**Safe wording:** Modern engines detect knock and delay the spark to stop it, at some cost in power and fuel economy.

**Allowed numbers:** none

**Check:** EIA (computer delays the initial spark) and fueleconomy.gov (adjust spark timing, 'engine power and fuel economy will still suffer') matched.

### 3.8 PASS

**Safe wording:** In the United States regular petrol is generally rated 87 octane and premium 91 to 94 on the pump.

**Allowed numbers:** 87 (regular); 91-94 (premium)

**Do not say:**
- Do not give a midgrade number (88-90 vs 89-90 conflict).
- Do not use these numbers outside the US: the pump number is an average of two test methods in the US; other countries show a different scale.

**Check:** fueleconomy.gov and EIA agree on regular and premium; the 'higher octane aimed at higher compression or turbo' part is on fueleconomy.gov and echoed by 3.3 sources.

### 4.1 PASS_WITH_EDIT

**Safe wording:** The spark fires before the piston reaches top dead centre, near the end of the compression stroke. Textbook ranges are a few tens of degrees before top dead centre, and the best timing changes with speed and load.

**Allowed numbers:** about 15-45 degrees before TDC (NPTEL table, spark ignition); 30 degrees before TDC (MIT example at wide-open throttle, with 50 over-advanced and 10 retarded in the same figure)

**Do not say:**
- Do not give an idle spark angle: no source states one.
- Do not use Toyota's 5 degree BTDC fallback setting.

**Check:** NPTEL and MIT lec 9 matched and are consistent. 'Before TDC' is therefore firmly supported; the angle is range-only.

### 4.2 PASS_WITH_EDIT

**Safe wording:** The spark comes early because burning takes time: the flame needs part of a stroke to spread, so the pressure peak should land just after top dead centre. If the spark is too late, the heat is released too far into the expansion to be turned into work. If it is too early, MIT notes it effectively lowers the compression ratio, adds heat-transfer loss and makes knock more likely.

**Allowed numbers:** peak cylinder pressure about 14-17 degrees after TDC at best (MBT) timing in one MIT example engine (attribute)

**Do not say:**
- Do not state 14-17 degrees as a general rule.
- Treat 'too early' consequences as MIT's statement, not a settled rule for every engine.

**Check:** The late/early reasoning and the 14-17 degrees are MIT only (lec 3 and lec 9 are one family). NPTEL supports only that combustion by turbulent flame propagation runs from shortly after ignition to 15-30 degrees after TDC. Independence is therefore partial: the core idea (burn takes time, so spark early, peak just after TDC) has two families; the late/early losses have one. Keep attributed.

### 4.3 PASS_WITH_EDIT

**Safe wording:** In a petrol engine the spark starts a small hot kernel that grows into a flame, nearly spherical at first and wrinkled by turbulence, which sweeps outward through the mixture until it is burned. It is a flame that spreads, not the whole charge going off at once. The abnormal, much faster event is knock, when the unburned mixture ahead of the flame ignites by itself.

**Allowed numbers:** about 1 mm and 100 microseconds for the first kernel (MIT slide only; attribute or omit)

**Do not say:**
- Do not say 'there is no explosion at all'.
- Do not call knock 'the explosive event' as sourced: MIT says 'rapid heat release' and 'detonation' (a pressure-wave driven reaction); EIA says 'spontaneous combustion ... also called auto-ignition, detonation, or knock'. Use 'knock' or 'auto-ignition'.
- Do not apply the Otto 1877 patent's 'instead of an explosion ensuing' as evidence about normal engines (see 7.4).

**Check:** MIT lec 10 ('almost spherical', 'wrinkled laminar flame', 'Normal combustion: spark initiated premixed flame; Abnormal: pre-ignition, knock'), EIA ('A flame starts at the spark plug and burns throughout the cylinder until all fuel in the cylinder is burned') and NPTEL matched. Two families (MIT, EIA). The statement that normal combustion 'is not an explosion' is a characterisation: both sources say flame propagation, and no source says the word 'explosion' about normal combustion either way, so say 'flame front, not detonation'.

### 4.4 PASS_WITH_EDIT

**Safe wording:** The burn takes a stretch of crank angle, not an instant. MIT gives figures for a modern fast-burn engine at medium speed and part load: about 15 degrees to burn the first 10 percent of the mixture, 25 degrees for half and 35 degrees for 90 percent. At 1000 rpm one millisecond is 6 crank degrees, so that is a few milliseconds.

**Allowed numbers:** 15 / 25 / 35 crank degrees for 10% / 50% / 90% burned, medium speed, part load (MIT, one family; attribute); 6 crank degrees per ms at 1000 rpm (MIT; arithmetic confirms: 1000 rpm = 6000 deg/s); about 5.8 ms for 35 degrees at 1000 rpm (arithmetic)

**Do not say:**
- Do not say these are idle numbers: MIT gives them for medium speed part load.
- Do not state a burn time at idle.

**Check:** Burn angles are MIT lec 9 only; NPTEL's 'up to 15 to 30 degrees after TDC' is consistent but gives no burn-fraction figures. Arithmetic checked (35 deg / 6 deg per ms = 5.8 ms). Single-source numbers must be attributed.

### 5.1 PASS_WITH_EDIT

**Safe wording:** The power stroke is the only stroke that delivers work. Burning raises the pressure of the trapped gas and pushes the piston down; the intake, compression and exhaust strokes are carried by the momentum of the flywheel and by the other cylinders.

**Allowed numbers:** 1 of 4 strokes

**Do not say:**
- Do not use the cited NASA engopt quote ('The sudden opening of the contact produces a spark...') as support: it is about the spark, not about which stroke makes work.

**Check:** TM 10-570 and Autozine matched and support the claim. The NASA quote attached is irrelevant; replacement NASA Glenn page (ottoa.html: 'the intake stroke and exhaust stroke ... do not contribute to the generation of power') supports it. Independence ok with the replacement.

### 5.2 PASS

**Safe wording:** The flywheel stores some of the energy of each power stroke and gives it back during the other strokes, which evens out the pulses of torque.

**Allowed numbers:** none

**Check:** TM 10-570, NASA Glenn (powert.html) and Univ. of Windsor (Flywheel.htm, via WebFetch) agree.

### 5.3 PASS_WITH_EDIT

**Safe wording:** A single-cylinder four-stroke fires once every two turns. In an evenly firing engine with n cylinders a power stroke starts every 720 divided by n degrees: every 180 degrees in a four, 120 in a six, 90 in an eight. With more cylinders the power strokes overlap more and the torque is smoother.

**Allowed numbers:** 180 degrees (4 cylinders); 120 degrees (6 cylinders; TM 10-570 shows a 60 degree overlap); 90 degrees (8 cylinders; arithmetic 720/8); 720/n degrees (rule)

**Do not say:**
- Do not say it of odd-firing engines or of every V engine.
- Do not say a four-cylinder's power strokes overlap: at 180 degrees they follow end to end with no overlap; TM 10-570 says power is developed throughout the cycle.

**Check:** TM 10-570 (six-cylinder figure: new power stroke each 120 degrees, 60 degree overlap) and Autozine (1, 2, 3, 4 and 12 cylinders: 720/n) matched. The 90 degree figure for eight is arithmetic. Even-firing only.

### 5.4 PASS_WITH_EDIT

**Safe wording:** A common firing order for an inline four-cylinder is 1-3-4-2, so each cylinder is at a different stroke at any moment: while one is on the power stroke the others are on exhaust, intake and compression.

**Allowed numbers:** 1-3-4-2 (common); 1-2-4-3 is the other possible order

**Do not say:**
- Do not call 1-3-4-2 universal.
- Do not say 'typical' on the strength of the Toyota page alone: that is one engine; Clerk (1909) says 1342 'appears to be most usually adopted'.

**Check:** Toyota 2.4 L spec (NHTSA filing: Firing Order 1-3-4-2) and Clerk 1909 (full OCR read: 'the two firing orders are: 1243 ... and 1342 ... Both are employed, but 1342 appears to be most usually adopted') are independent. TM 10-570 Fig. 15 is a chart, not an order statement.

### 6.1 PASS

**Safe wording:** On the exhaust stroke the rising piston pushes the burnt gas out through the open exhaust valve. The exhaust valve opens before the piston reaches the bottom of the power stroke, to let the pressure drop; this costs a little work but is a net gain.

**Allowed numbers:** none

**Check:** TM 10-570 (net gain wording), Colorado State and Britannica (WebFetch) matched.

### 6.2 PASS_WITH_EDIT

**Safe wording:** Only a minority of the fuel energy ends up moving a conventional petrol car: about a fifth. The US Department of Energy gives 12 to 30 percent depending on how it is driven (for example 17 to 21 percent combined, 14 to 16 in the city, 20 to 26 on the highway), and a peer-reviewed global estimate for an average passenger car gives 21.5 percent.

**Allowed numbers:** 12-30% (DOE/EPA, depending on drive cycle); 17-21% combined, 14-16% city, 20-26% highway (DOE Fact 709); 21.5% (Holmberg et al., global average passenger car; counts braking and acceleration energy as moving the car); 'about a fifth' as the rounded summary

**Do not say:**
- Do not say 'a fifth of the fuel reaches the wheels' without 'about'.
- Do not mix hybrids or electric cars into these numbers.
- fueleconomy.gov, Fact 1044 and Fact 709 are one DOE family; count once.

**Check:** DOE/EPA (fueleconomy.gov, energy.gov node 3604327, Fact 709) is one family; Holmberg et al. (VTT/Argonne; VTT page and the FME Transactions PDF both matched) is the second, independent one. They overlap at roughly 17-22 percent. Fact 709's URL returned 404 to curl but WebFetch returned the table.

### 6.3 PASS_WITH_EDIT

**Safe wording:** Most of the fuel energy is lost in the engine itself, mostly as heat. About 60 percent leaves as heat through the exhaust and the cooling system (DOE Fact 709: 60-62 percent for a typical car on the combined cycle). One global study splits it as 33 percent exhaust and 29 percent cooling.

**Allowed numbers:** about 60% as heat (DOE Fact 709 combined: 60-62%; Holmberg 33+29=62%); 56-64% across city/highway/combined (DOE); 33% exhaust and 29% cooling (Holmberg, single-source; attribute); 38% mechanical power (Holmberg)

**Do not say:**
- Do not say 'a third out of the exhaust' as established fact: DOE does not split exhaust from coolant.
- Do not say 'all' or 'most' goes up the exhaust.

**Check:** DOE Fact 709 (WebFetch) and Holmberg agree on roughly 60 percent as heat; fueleconomy.gov says 'most of the fuel's energy is lost in the engine, primarily as heat'. The exhaust/cooling split is Holmberg only.

### 6.4 PASS_WITH_EDIT

**Safe wording:** At the crankshaft, before the gearbox and tyres, a petrol engine delivers roughly a third of the fuel energy at best; the rest leaves as heat.

**Allowed numbers:** 'roughly a third' (no digits)

**Do not say:**
- Do not quote a single percentage: MIT says 'low 30's' for modern SI engines at their best point; Holmberg gives 38% for the average car; they conflict.
- Do not say 'never more than a third': MIT's figure is a slide fragment, not a ceiling.

**Check:** MIT lec 18 slide ('Update for modern engines: SI engine in the low 30's') and Holmberg (38%) matched but are different measures (peak brake efficiency vs fleet average), so the no-number form applies. Mazda's 'over half wasted as heat and friction' is a manufacturer statement without a number.

### 7.1 PASS_WITH_EDIT

**Safe wording:** The four-stroke cycle was described in 1862 by the French engineer Alphonse Beau de Rochas, who never built an engine; the development was left to others.

**Allowed numbers:** 1862 (Britannica x3 pages, Clerk 1909, the Naaktgeboren transcription of the 1862 mémoire; EBSCO alone says 1861)

**Do not say:**
- Do not say 'patented' or 'published': Britannica says patented, Encyclopedia.com says the patent was never published because fees went unpaid, EBSCO says a privately published pamphlet of 1861.
- Do not say 'the first person to think of it' (Naaktgeboren: 'deemed the earliest document', a preprint).

**Check:** Britannica (WebFetch; 'patented his idea in 1862 but did not build such an engine'), Clerk 1909 ('in 1862 a French engineer actually proposed the Otto cycle'), engrXiv preprint (1862 handwritten mémoire; not peer reviewed) and Britannica (no four-stroke engine appeared for more than a decade) support 1862. Encyclopedia.com (Gale) adds: 'nor was there any evidence he had produced a working engine'. EBSCO's 1861 is a conflict; with four sources at 1862 the year is allowed, but the document's form is not. Use 'described' or 'proposed'.

### 7.2 PASS

**Safe wording:** Nikolaus Otto built an engine working on the four-stroke principle in 1876.

**Allowed numbers:** 1876

**Do not say:**
- Do not give a month: only EBSCO says May 1876.
- Encyclopedia.com calls it a 'prototype'; 'built' is fine, 'first production engine' is not.

**Check:** Britannica (WebFetch), Clerk 1909, EBSCO and Encyclopedia.com all say 1876.

### 7.3 PASS_WITH_EDIT

**Safe wording:** Otto took out US patent number 194,047, titled 'Improvement in Gas-Motor Engines', dated 14 August 1877; he is named in it as of Deutz, Germany. It describes a gas engine with a layered charge, and its drawings show an engine with a flywheel.

**Allowed numbers:** 194,047; 14 August 1877; Deutz, Germany (named in the patent)

**Do not say:**
- Do not call it 'the four-stroke patent' or 'the patent for the Otto cycle': the patent's own claimed novelty is the layered (stratified) charge; EBSCO's 'patent for his four-stroke engine' is looser than the patent.
- Do not give the application date: the OCR reads 'July 13, 1816' (the year is OCR noise; the actual filing year is not confirmed).
- Do not say 'granted in Germany'; this is a US patent.

**Check:** Patent PDF (8 pages) and Google Patents OCR read directly: 'NICOLAUS A. OTTO, OF DEUTZ, GERMANY. IMPROVEMENT IN GAS-MOTOR ENGINES ... Letters Patent No. 194,047, dated August 14, 1877'; the text also names him of the 'Gas-Motoren Fabrik-Deutz'. Encyclopedia.com ('Otto's ideas concerning stratification were patented in 1877') and EBSCO ('granted a patent ... in 1877') agree on the year.

### 7.4 PASS_WITH_EDIT

**Safe wording:** The 1877 US patent text says that, with its layered charge, 'instead of an explosion ensuing' the flame is communicated gradually from one combustible particle to another. The same patent describes a four-stroke working cycle (draw in the charge, compress, ignite and power, exhaust), with the flywheel's momentum driving the return stroke.

**Allowed numbers:** none

**Do not say:**
- Do not use the patent's 'explosion' sentence to say how a modern petrol engine burns its fuel: it describes a gas engine with a stratified charge, in contrast to the 'explosive mixture' of earlier engines.
- Do not say the patent was for the four-stroke cycle: its claim is the layered charge.
- Do not say 'Otto never used the four-stroke cycle in the patent': the patent text describes four piston strokes per operation.

**Check:** Patent text read directly: 'on ignition, instead of an explosion ensuing, the flame will be communicated gradually from one combustible particle to another'; 'there are four strokes of the piston required for one complete operation -- namely, an outstroke for drawing in the charge ..., an instroke for compressing the gases, a second outstroke when the piston is propelled on the ignition of the gases, and a second instroke for expelling the products of combustion'; 'Motion being thus imparted to the fly-wheel ... its momentum causes the piston to perform its return stroke'. Note: claims.json says the patent does not describe the compress-before-ignite cycle; the patent text does mention compressing the gases in the second stroke, so the claims.json caution is too weak in one direction and the dropped 'not the four-stroke patent' line stays correct. Encyclopedia.com supplies the stratified-charge/patent-validity link.

### 7.5 PASS_WITH_EDIT

**Safe wording:** In 1886 Otto's German patent was revoked after an earlier description of the four-stroke principle by Beau de Rochas was brought to light.

**Allowed numbers:** 1886

**Do not say:**
- Do not say 'courts' or 'patent office': MadeHow says courts, others do not say who.
- Do not say whether Beau de Rochas's document was a patent or a pamphlet.
- Do not say Otto copied him: EBSCO says all evidence is that Otto developed his engine independently.
- Do not say 'the cycle was stolen / invalid forever': in Britain the Crossley challenge failed (Encyclopedia.com).

**Check:** Britannica (WebFetch: 'in 1886 Otto's patent was revoked when Beau de Rochas' earlier patent was brought to light'), EBSCO ('revoked in 1886 ... described the four-cycle principle in 1861 in a rather obscure, privately published pamphlet'), Encyclopedia.com ('The Otto patents were overturned in Germany in 1886') and MadeHow (WebFetch: 'the courts invalidated Otto's patent in 1886 due to the claims of Beau de Rochas and others') all agree on year and cause. MadeHow and Encyclopedia.com are both Gale: three independent families remain. Britannica says patent; EBSCO says pamphlet; MadeHow says courts.

### 7.6 PASS_WITH_EDIT

**Safe wording:** Before the four-stroke engine, Otto and Eugen Langen built an atmospheric gas engine that won a gold medal at the 1867 Paris exhibition; the four-stroke Otto engine of 1876 was then an immediate commercial success.

**Allowed numbers:** 1867; 1876

**Do not say:**
- Do not use the NPTEL line 'Lenoir and Otto developed atmospheric engine': it merges two people.
- Do not say 'shown in 1867' for the first atmospheric engine: Encyclopedia.com has an earlier 1863 one-half horsepower atmospheric engine.
- Keep to a one-line aside.

**Check:** Clerk 1909 ('achieved a partial success in 1867 with the Otto & Langen atmospheric engine'), Encyclopedia.com ('exhibited at the 1867 Paris Exposition ... gold medal') and EBSCO ('gold medal for its engine at the World's Fair in Paris in 1867') support 1867; Britannica (WebFetch: 'The four-stroke Otto engine was an immediate success') and EBSCO ('sold more than thirty thousand ... between 1876 and 1886') support the success. The Britannica Otto bio line about Langen only supports the partnership.

### 7.7 PASS_WITH_EDIT

**Safe wording:** The four-stroke cycle is often called the Otto cycle, after Nikolaus Otto, who was the first to build an engine on the principle, although Beau de Rochas had described it in 1862.

**Allowed numbers:** 1862

**Do not say:**
- Do not say Beau de Rochas 'invented it first' as a flat fact: say 'described it earlier' (Britannica: 'originated by ... Beau de Rochas in 1862').

**Check:** Britannica (WebFetch: 'The four-stroke cycle was originated by French engineer Alphonse Beau de Rochas in 1862'; 'often called the Otto cycle'; 'since Otto was the first to build an engine based upon this principle, it is commonly known as the Otto cycle'), TM 10-570 ('Otto cycle. A cycle of four events ...') matched.

## Assets (assets.json licence claims)

| id | result | evidence | note |
| --- | --- | --- | --- |
| P1 | OK | US 194,047 PDF: US government-published patent, 14 Aug 1877 (pre-1929). Verified: PDF downloaded, 8 pages; Google Patents OCR text matches (dated August 14, 1877). | Licence claim holds. Caption it 'Otto, 1877 patent' and not as the modern cycle. |
| P2 | OK | Drawing sheet 4 PNG: URL returns 200; same patent, same basis as P1. | Licence claim holds. |
| D1 | OK | Internet Archive metadata read via /metadata/TM10-570: licenseurl http://creativecommons.org/publicdomain/mark/1.0/, creator 'United States. War Department', publisher '[Washington] : [U.S. G.P.O.]', date 1941-02-04, PDF 34,467,242 bytes. A US government work is not subject to US copyright (17 USC 105). | Licence claim holds. |
| D2 | OK | Clerk 1909 (Longmans): archive.org metadata has NO licenseurl or rights field; the Cornell scan front page in the OCR says 'no known copyright restrictions in the United States on the use of the text' (matched). Published 1909 (pre-1929), so public domain in the US. | Licence claim holds, but the basis is age plus the Cornell statement, not an archive.org licence field. Log both in credits.json. |
| I1 | OK_WITH_CAVEAT | Commons API: LicenseShortName 'Public domain', Date 'circa 1868', author unknown, Copyrighted False, 1600x1200; source is a Britannica web page. The image itself was not opened. | PD claim holds on age (19th-century photograph). Provenance is a Britannica copy, so open the image and check what it shows before use. |
| I2 | OK_WITH_CAVEAT | Commons API: 'Public domain', author unknown, 2813x3751, source museum-digital Westfalen object 8489. Image not opened. | PD claim holds on age (Otto d. 1891). Credit the museum-digital source; open the image first. |
| I3 | PROBLEM | Commons API: 'Public domain' (template PD-old), photo of a painting, no painter, no painting date, original uploader Addhoc, 2007, 'copied across from german wikipedia', 180x248 px. | Licence rests only on a Commons tag; painter and date are unknown, so PD-old cannot be verified. Do not use; redraw in 2D instead. |
| N1 | OK_WITH_CAVEAT | NASA Images and Media Usage Guidelines read: 'generally are not subject to copyright in the United States'. cylmov2.gif: curl returned 3,142,975 bytes (GET works, HEAD gives 500). Page last updated 2021 and no third-party credit seen. | Licence claim holds; NASA's own wording is 'generally', so reference-only use is right. Keep it out of the final cut. |
| V1 | NOT_USABLE_CONFIRMED | archive.org metadata: no licenseurl, creator, publisher or date; description only 'Examines the automobile engine.' | Agree: unusable until provenance is found. |
| V2 | NOT_USABLE_CONFIRMED | No asset claimed. | Agree: nothing to use. |
| X1 | NOT_USABLE_CONFIRMED | Commons API: CC BY-SA 3.0, Copyrighted True, credit 'Illustration in Troitzsch/Weber, Die Technik, Westermann 1982'. | Agree: not usable. |
| X2 | NOT_USABLE_CONFIRMED | Commons API for Enginy_Otto-langen_1867.jpg: CC BY-SA 3.0 (uploader Mcapdevila). The second file was not queried. | Agree: not usable. |
| X3 | NOT_USABLE_CONFIRMED | Commons API for Otto_A_engine.jpg: CC BY 4.0 (Tiia Monto, own work, 2026). The other two files were not queried. | Agree: not usable (attribution licence outside the PD/CC0/licensed-with-record rule). |

Only I3 has a licence problem. I1 and I2 are fine on age but the images were not opened. D2's licence rests on age and the Cornell statement, not an archive.org field.

## Global notes for the scriptwriter

- Keep the cycle on screen in labelled example numbers: 700 rpm, 0.17 s, 0.24 ms per degree.
- 'Flame not explosion' is the episode's hook for beat 4: phrase as flame front vs knock, and keep Otto's patent sentence out of the claim about modern engines (7.4).
- Single-source numbers that must be attributed on screen or dropped: MIT 15/25/35 degrees burn, 14-17 degrees peak pressure, 1 mm/100 microsecond kernel, 12:1 knock limit, Holmberg 33/29 split.
- Source defects found: 5.1 NASA engopt quote is about the spark; 2.2 and 2.5 each attach one irrelevant quote; the Windsor flywheel page and the Fact 709 URL do not fetch with curl (WebFetch worked).
- Not independent (counted once): fueleconomy.gov + DOE Fact 1044 + Fact 709; Encyclopedia.com + MadeHow (Gale); MIT lec 3/9/10/18/19; Britannica pages.

## URLs that could not be opened directly

- Britannica (five pages): curl 403; opened with WebFetch. Long sentences were matched on the part WebFetch returned.
- https://courses.washington.edu/.../Flywheel.htm : curl 403; WebFetch returned the first part of the quoted sentence.
- https://www.energy.gov/eere/vehicles/fact-709-...: curl 404, WebFetch returned the table.
- https://www.madehow.com/inventorbios/76/Nikolaus-August-Otto.html : empty to curl, opened with WebFetch.
- https://archive.org/details/cu31924004083352 : viewer shell; read the stream (OCR) text instead.

Limits: the Otto patent OCR is noisy (the application year reads '1816'); asset images I1/I2 were not opened.
