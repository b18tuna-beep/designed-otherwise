# Research dossier: the four-stroke petrol engine (working title "Your Car Engine Only Pushes One Stroke in Four")

Episode: P5, Designed Otherwise. Readable companion to `claims.json`: 36 claim entries across beats 1 to 7 (beat 8 is the close and needs no new claims). Researched 2026-11-25 (research mode; no fact check done here). Every URL listed was opened in this session (curl text extraction, or the WebFetch tool where the quote kind or locator says so: the Britannica pages and DOE Fact 709). Each quote was machine-checked against the fetched text unless marked as a WebFetch fragment. Locators say where the supporting sentence is.

## Read this first (changes to the brief)

1. **Idle speed: the brief's "13 times a second" (800 rpm) is the top of what the sources show.** Service specs: Toyota Yaris 550 to 650 rpm (manual) or 650 to 750 (automatic), Honda CRX 700 to 750; test papers 600 to 800 and 650 (claim 1.1). One cycle is two revolutions, so 800 rpm = 0.150 s, 700 rpm = 0.171 s, 600 rpm = 0.200 s (1.3). Suggest the clock runs at about 700 rpm: "about 12 times a second" and "about a sixth of a second". The brief's "0.15 s" is right only at 800 rpm.
2. **Compression ratio: "about 8 to 12:1" is stretched at the low end.** Current engines in the sources: 9.6:1 and 10.5:1 (two Toyotas), "around 10 to 11:1" for conventional naturally aspirated petrol (Mazda), knock-limited near 12:1 (13 with direct injection, MIT), and 14:1 for Mazda's SKYACTIV-G. 8.4:1 is only MIT's example engine and 5:1 only a 1941 manual (3.2). Recommend "roughly 10 to 12 to 1".
3. **Otto's 1877 patent was not a patent on the four-stroke cycle.** The US patent (194,047, 14 Aug 1877) describes a stratified charge: fuel mixture dispersed in air so that "instead of an explosion ensuing" the flame is passed on gradually (7.3, 7.4). That fits beats 4 and 5 well (it even has the flywheel carrying the return stroke), but the script must not say "Otto patented the four-stroke cycle".
4. **Beau de Rochas: 1862, but not clearly a patent.** Britannica says "patented" (1862); Encyclopedia.com says the patent was never published because fees went unpaid; EBSCO says a privately published pamphlet of 1861; a 2023 preprint and Clerk (1909) say 1862 (a memoire / a proposal). Safe wording: "in 1862 he set the cycle down on paper, and never built an engine" (7.1).
5. **German patent overturned in 1886: four sources agree**, but they split on cause (a patent vs a pamphlet) and on who did it (courts vs patent office). Safe: "overturned in 1886 once Beau de Rochas's earlier description surfaced". Do not name the court (7.5).
6. **Energy to the wheels: use "about a fifth" and the range 12 to 30%.** DOE/EPA gives 12 to 30% by drive cycle; an independent peer-reviewed estimate gives 21.5% for an average passenger car; about 60% leaves as heat (DOE 60-62%; Holmberg exhaust 33% + cooling 29%) (6.2, 6.3). Both heat figures are car-average estimates: do not attribute them to one engine.
7. **Pumping loss: no percentage, and no source says "at idle" in so many words.** Sources say part-load throttling causes pumping loss (2.5). The DOE Fact 709 pumping figure (about 4%) is one family only and was left out (see decisions.md).
8. **"Octane is not energy" is an inference.** All three sources define octane as resistance to knock (3.5); none says "not energy content" word for word.
9. **Burn time at idle is not sourced.** Claim 4.4 is a rough derivation from MIT medium-speed numbers.

## Three most surprising true facts (for the hook and title)

- **One stroke in four.** In each cylinder only the power stroke delivers work; the flywheel carries the engine through the other three (claims 1.4, 5.1, 5.2). A 1941 Army manual says it plainly: "Energy imparted to the flywheel by the power stroke is sufficient to keep it rotating through the exhaust, intake, and compression strokes."
- **A fifth, and then the heat.** Only about 12 to 30% of the fuel's energy moves the car; about 60% leaves as heat from exhaust and cooling (6.2, 6.3).
- **The man the cycle is named after lost his German patent, and the man who described it first never built one.** Beau de Rochas set out the cycle in 1862 and built nothing; Otto built it in 1876; Otto's German patent was overturned in 1886 (7.1, 7.2, 7.5). Bonus: Otto's own patent text is about avoiding "an explosion" (7.4).

## Notes for the fact checker

- **Read via WebFetch extraction, not raw text:** Britannica (four-stroke cycle, Otto, Beau de Rochas, Development of gasoline engines, Camshaft) and DOE Fact 709 (the energy.gov URL gave curl a 404 but WebFetch returned the table). Britannica blocks scripted download (403). Re-open all of these.
- **OCR sources:** Google Patents text of US 194,047 (OCR noise, e.g. "NIOOLAUS A. OTTO"); the 1941 TM 10-570 text from govinfo (the Figure 15 chart rows are read from OCR); Clerk 1909 (djvu text, hyphenation breaks).
- **Slide-fragment sources:** MIT 2.61 slides (Lectures 3, 9, 10, 19 from OCW; Lecture 18 from web.mit.edu) are bullets, not full sentences. "SI engine in the low 30's" and "SI engine CR limited by knocking to 12" are slide fragments. All five MIT items count as one source family.
- **Same-family rule applied:** fueleconomy.gov and DOE Facts 1044 and 709 (DOE/EPA); the NASA Glenn pages; the three University of Windsor manual pages; Britannica (five pages); MIT 2.61 (five lectures).
- **Service data via a third-party host:** the Toyota Yaris and Honda CRX idle specs come from workshop-manuals.com reproductions of OEM manuals (claim 1.1). The Toyota Camry spec tables are Toyota's own pages filed with NHTSA.
- **Not used as sources:** Wikipedia (Idle speed, Otto engine, Beau de Rochas, History of the internal combustion engine) was used only for leads. fueleconomy.gov Fact 880 and the AFDC data page returned 404. ScienceDirect (Holmberg) returned 403: the VTT portal abstract and the author's FME Transactions overview were used instead.
- **Date traps:** Encyclopedia.com, EBSCO, Clerk and Britannica disagree on 1861 vs 1862 and patent vs pamphlet for Beau de Rochas. EBSCO says Otto got "a patent for his four-stroke engine in 1877" but the patent text is a stratified-charge engine.


## Beat 1: Cold open, the engine at a red light

- **1.1** [supported, high] A warm petrol car engine idles at a few hundred to under a thousand revolutions per minute. Service specifications and test papers cluster at roughly 550 to 800 rpm (for example 550-650 manual or 650-750 automatic for one Toyota, 700-750 for one Honda, 650 for a Toyota V6).
  - Toyota Motor Corp. service data, hosted by workshop-manuals.com: 2007 Toyota Yaris L4-1.5L (1NZ-FE), Idle Speed: Specifications (Toyota service data as reproduced by workshop-manuals.com) (https://workshop-manuals.com/toyota/yaris/l4-1.5l_(1nz-fe)/maintenance/tune-up_and_engine_performance_checks/idle_speed/system_information/specifications/)
  - Honda service data, hosted by workshop-manuals.com: 1987 Honda CRX L4-1488cc 1.5L SOHC (D15A3) MFI, Idle Speed: Specifications (Honda service data as reproduced by workshop-manuals.com) (https://workshop-manuals.com/honda/crx/l4-1488cc_1.5l_sohc_(d15a3)__mfi/maintenance/tune-up_and_engine_performance_checks/idle_speed/system_information/specifications/)
  - OSTI / ETDEWEB record of a peer-reviewed journal article: Reducing the idle speed of a spark-ignited gasoline engine with hydrogen addition (Int. J. Hydrogen Energy, DOI 10.1016/J.IJHYDENE.2010.08.002; abstra (https://www.osti.gov/etdeweb/biblio/21341179)
  - CNRS / LAAS (France), via OSTI: S.I. engine idle control improvement by using automobile reversible "alternator" (LAAS-CNRS report) (https://www.osti.gov/etdeweb/servlets/purl/508818)
  - Numbers: 550-800 rpm (idle range across the sources checked); 650-750 rpm (Toyota Yaris 2007 automatic); 700+/-50 to 750+/-50 rpm (Honda CRX 1987)
  - Note: Wikipedia says "customarily between 600 and 1000 rpm" for passenger cars: not used as a source, but consistent. Modern engines run lower when warm (550-750 here) and higher when cold. The brief's "about 13 times a second" is 800 rpm, the TOP of what these sources show. Safer on-screen number: about 700 rpm (11.7 rev/s) or give a range. Do not say "a car idles at 1,000 rpm".
- **1.2** [supported, high] One full four-stroke cycle (intake, compression, power, exhaust) takes two revolutions of the crankshaft, which is 720 degrees of crank angle.
  - Encyclopaedia Britannica: four-stroke cycle (https://www.britannica.com/technology/four-stroke-cycle)
  - University of Windsor / University of Washington (course page): Four Stroke Cycle Engines (University of Windsor engine manual, hosted on a University of Washington course site) (https://courses.washington.edu/engr100/Section_Wei/engine/UofWindsorManual/Four%20Stroke%20Cycle%20Engines.htm)
  - Autozine (independent automotive engineering site): Engine Configuration and Smoothness: Introduction and Basic Theory (Autozine Technical School) (https://autozine.org/technical_school/engine/Smoothness1.html)
  - NASA Glenn Research Center: 4-Stroke Internal Combustion Engine (Beginner's Guide to Aeronautics) (https://www.grc.nasa.gov/www/K-12/airplane/engopt.html)
  - Numbers: 2 crank revolutions per cycle; 720 degrees (crank angle per cycle)
  - Note: Four families agree (Britannica x2 counts as one).
- **1.3** [derived, high] Real time of one cycle at idle follows from rpm: one cycle is 120 divided by rpm in seconds. 800 rpm gives 0.150 s, 700 rpm gives about 0.171 s, 600 rpm gives 0.200 s. Each crank degree lasts about 0.2 ms at idle (1 degree = 1/(6 x rpm) s).
  - Encyclopaedia Britannica: four-stroke cycle (https://www.britannica.com/technology/four-stroke-cycle)
  - Toyota Motor Corp. service data, hosted by workshop-manuals.com: 2007 Toyota Yaris L4-1.5L (1NZ-FE), Idle Speed: Specifications (Toyota service data as reproduced by workshop-manuals.com) (https://workshop-manuals.com/toyota/yaris/l4-1.5l_(1nz-fe)/maintenance/tune-up_and_engine_performance_checks/idle_speed/system_information/specifications/)
  - Numbers: 0.150 s (800 rpm); 0.171 s (700 rpm); 0.200 s (600 rpm); 0.208 ms (1 crank degree at 800 rpm); 0.238 ms (1 crank degree at 700 rpm)
  - Note: Pure arithmetic from claims 1.1 and 1.2, no outside source states it. Check: 800 rpm = 13.33 rev/s, a cycle is 2 revs = 0.150 s. For the clock, use the rpm that is on screen and say it is typical, not universal. The brief's "about 0.15 s" holds only at 800 rpm; at 700 rpm it is about 0.17 s ("about a sixth of a second").
- **1.4** [supported, high] In each cylinder only one of the four strokes is the power stroke. The piston is pushed by burning gas on the power stroke; for the other three strokes the crankshaft, carried by the flywheel and the other cylinders, moves the piston.
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Autozine (independent automotive engineering site): Engine Configuration and Smoothness: Introduction and Basic Theory (Autozine Technical School) (https://autozine.org/technical_school/engine/Smoothness1.html)
  - NASA Glenn Research Center: Otto Cycle Thermodynamic Analysis (https://www.grc.nasa.gov/www/K-12/airplane/ottoa.html)
  - Numbers: 1 of 4 strokes (power stroke per cycle)
  - Note: Same idea as claim 5.1; kept in beat 1 for the cold open. NASA says intake and exhaust "do not contribute" in the ideal cycle; Autozine says all three consume power. Say "only the power stroke makes power" and not "the other three cost energy" unless leaning on Autozine.

## Beat 2: Intake (0 to 180 degrees)

- **2.1** [supported, high] On the intake stroke the piston moves from top dead centre to bottom dead centre with the intake valve open. This lowers the pressure in the cylinder and the pressure outside pushes the air-fuel mixture in (the engine acts as an air pump).
  - University of Windsor / University of Washington (course page): Four Stroke Cycle Engines (University of Windsor engine manual, hosted on a University of Washington course site) (https://courses.washington.edu/engr100/Section_Wei/engine/UofWindsorManual/Four%20Stroke%20Cycle%20Engines.htm)
  - University of Windsor / University of Washington (course page): Four Stroke Cycle Engines (University of Windsor engine manual, hosted on a University of Washington course site) (https://courses.washington.edu/engr100/Section_Wei/engine/UofWindsorManual/Four%20Stroke%20Cycle%20Engines.htm)
  - NASA Glenn Research Center: 4-Stroke Internal Combustion Engine (Beginner's Guide to Aeronautics) (https://www.grc.nasa.gov/www/K-12/airplane/engopt.html)
  - Encyclopaedia Britannica: four-stroke cycle (https://www.britannica.com/technology/four-stroke-cycle)
  - Numbers: 0-180 degrees (crank angle of the intake stroke)
  - Note: Windsor and Britannica are two families; NASA a third. The two Windsor entries are one source.
- **2.2** [supported, high] In theory each stroke begins at top or bottom dead centre and lasts 180 degrees of crank rotation, so the four strokes span 0-180, 180-360, 360-540 and 540-720 degrees.
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Autozine (independent automotive engineering site): Engine Configuration and Smoothness: Introduction and Basic Theory (Autozine Technical School) (https://autozine.org/technical_school/engine/Smoothness1.html)
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 3: Engine Cycles (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/e9421a34d0cd5c5fc4fc81365975503e_MIT2_61S17_lec3.pdf)
  - Numbers: 180 degrees (per stroke); 720 degrees (per cycle)
  - Note: TM 10-570 adds "in theory" because valve events actually shift (claim 2.3). The 0-180-360-540-720 labelling is the brief's convention; crank angle zero at start of intake is the textbook choice but many texts put 0 at firing TDC, so the clock must say which it uses.
- **2.3** [supported_range_only, high] The valves do not open and close exactly at the ends of the strokes. The intake valve opens a little before top dead centre and closes well after bottom dead centre; the exhaust valve opens before bottom dead centre and closes at or just after top dead centre, so the two are briefly open together (overlap).
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Colorado State University, Dept. of Mechanical Engineering: Valve Timing (fluids course notes) (https://www.engr.colostate.edu/~allan/fluids/page6/page6.html)
  - NPTEL / Indian Institutes of Technology: Module 1, Lecture 1: Introduction to IC Engines and Air Pollution (NPTEL course 112104033) (https://archive.nptel.ac.in/content/storage2/courses/112104033/lecture1/1_4.htm)
  - University of Windsor / University of Washington (course page): Additional Engine Considerations (University of Windsor engine manual, hosted on a University of Washington course site) (https://courses.washington.edu/engr100/Section_Wei/engine/UofWindsorManual/Additional%20Engine%20Considerations.htm)
  - Toyota Motor Sales (filed with U.S. NHTSA): Toyota Camry engine specifications, New Car Features excerpt (NHTSA ODI file PE04-021, Attachment 12) (https://static.nhtsa.gov/odi/inv/2004/INRD-PE04021-18337.pdf)
  - Numbers: 4-20 degrees before TDC (intake valve opens (Toyota V6: 4; NPTEL 5-20)); 40-60 degrees after BDC (intake valve closes (Toyota V6: 44; NPTEL 40-60)); 30-50 degrees before BDC (exhaust valve opens (Toyota V6: 46; NPTEL 30-50)); 2-20 degrees after TDC (exhaust valve closes (Toyota V6: 2; NPTEL 8-20))
  - Note: Conceptual wording is safe. Numbers differ by engine and by speed (the Windsor page gives overlap as 10-20 degrees; NPTEL ranges imply more): give only "a few to a few tens of degrees", never one set of angles as universal. Modern engines with variable valve timing (fueleconomy.gov lists VVT) move these angles while running. Toyota table OCR order is Intake Open/Close then Exhaust Open/Close for the V6 (line "Valve Timing") - confirm against the PDF image.
- **2.4** [supported, high] Valves are opened by cams on a camshaft that turns at half the speed of the crankshaft, because each valve opens once per two crank revolutions.
  - NASA Glenn Research Center: 4-Stroke Internal Combustion Engine (Beginner's Guide to Aeronautics) (https://www.grc.nasa.gov/www/K-12/airplane/engopt.html)
  - Encyclopaedia Britannica: gasoline engine: Camshaft (https://www.britannica.com/technology/gasoline-engine/Camshaft)
  - Numbers: 2:1 crank to cam revolutions
  - Note: NASA and Britannica agree.
- **2.5** [supported_with_inference, medium] At low load, including idle, the throttle partly closes the intake and the engine has to pull air in against that restriction. This throttling is a main reason a petrol engine is less efficient at part load: it increases pumping losses.
  - OSTI / ETDEWEB record of a peer-reviewed journal article: Methods to improve efficiency of four stroke, spark ignition engines at part load (Energy Conversion and Management 46, DOI 10.1016/j.enconman.2005.03 (https://www.osti.gov/etdeweb/biblio/20647074)
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 19: Engine Friction and Lubrication (https://ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/ad971a51c4a7f2db8a20f9570c870f0d_MIT2_61S17_lec19.pdf)
  - U.S. DOE / EPA, fueleconomy.gov: Where the Energy Goes: Gasoline Vehicles (https://fueleconomy.gov/feg/atv.shtml)
  - Note: Sources state part-load throttling and pumping loss. "At idle" is the lowest-load case so it is the extreme of this, but none of the sources fetched says "at idle" in those words. Say "at low load such as idle". Pumping loss is a "smaller amount" per fueleconomy.gov; do not make it the main loss. No percentage given (see decisions.md).

## Beat 3: Compression, knock and octane (180 to 360)

- **3.1** [supported, high] Compression ratio is the cylinder volume at the start of compression divided by the volume left at the top of the stroke (the total volume over the clearance volume).
  - NASA Glenn Research Center: Otto Cycle Thermodynamic Analysis (https://www.grc.nasa.gov/www/K-12/airplane/ottoa.html)
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Note: TM 10-570 gives a worked example that comes out at 5:1 (1941), a reminder that ratios were far lower then.
- **3.2** [supported_range_only, high] Modern naturally aspirated petrol engines typically have compression ratios of about 10:1 to 11:1 (examples: 9.6:1 Toyota 2.4 four, 10.5:1 Toyota 3.0 V6). Knock has long capped them near 12:1 (13:1 with direct injection); a few engines go higher (Mazda SKYACTIV-G, 14:1).
  - Mazda Motor Corporation: Where Engine Dreams Meet Possibilities: The SKYACTIV-Z Challenge (interview with Mazda engine developers) (https://www.mazda.com/en/mazda-mirai-base/articles/20250319-multisolution-skyactivez/)
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 3: Engine Cycles (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/e9421a34d0cd5c5fc4fc81365975503e_MIT2_61S17_lec3.pdf)
  - Toyota Motor Sales (filed with U.S. NHTSA): Toyota Camry engine specifications, New Car Features excerpt (NHTSA ODI file PE04-021, Attachment 12) (https://static.nhtsa.gov/odi/inv/2004/INRD-PE04021-18337.pdf)
  - Numbers: 9.6-10.5 :1 (two Toyota Camry engines, same document); 10-11 :1 (Mazda: conventional naturally aspirated petrol); 12 (13 with direct injection) :1 (MIT: knock-limited for SI engines); 14 :1 (Mazda SKYACTIV-G, a high outlier)
  - Note: The brief says "about 8 to 12:1". The sources support about 9.5 to 12:1 for current engines; 8.4:1 appears only as MIT's example engine (Fig 5-1, 3500 rpm) and 5:1 only in the 1941 manual. Recommend the script says "roughly 10 to 12 to 1". Turbocharged engines often run lower geometric ratios (not sourced here, so not claimed).
- **3.3** [supported, high] Compression ratio is limited because squeezing the mixture harder raises its temperature and pressure until the unburned part can ignite by itself (knock). Higher ratios give better efficiency but need fuel that resists knock.
  - Mazda Motor Corporation: Where Engine Dreams Meet Possibilities: The SKYACTIV-Z Challenge (interview with Mazda engine developers) (https://www.mazda.com/en/mazda-mirai-base/articles/20250319-multisolution-skyactivez/)
  - U.S. DOE / EPA, fueleconomy.gov: Selecting the Right Octane Fuel (https://www.fueleconomy.gov/feg/octane.shtml)
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 3: Engine Cycles (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/e9421a34d0cd5c5fc4fc81365975503e_MIT2_61S17_lec3.pdf)
  - Note: Mazda adds that wording "uneven burning" is how they describe knock; MIT and EIA (3.4) are more precise: auto-ignition of the end-gas.
- **3.4** [supported, high] Knock is not the normal burn. After the spark starts a flame, the unburned mixture ahead of it (the end gas) is squeezed hotter and can ignite spontaneously. The sudden release of energy makes pressure waves, the audible knock, and can damage the engine.
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 10: SI engine combustion II (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/35c1c5bbf304c0f41e1de0cec0b0ee85_MIT2_61S17_lec10.pdf)
  - U.S. Energy Information Administration: Octane in depth (Gasoline explained) (https://www.eia.gov/energyexplained/gasoline/octane-in-depth.php)
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 10: SI engine combustion II (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/35c1c5bbf304c0f41e1de0cec0b0ee85_MIT2_61S17_lec10.pdf)
  - Note: MIT and EIA are two families. Visual: normal flame front growing from the plug vs a second ignition site in the far corner.
- **3.5** [supported, high] The octane rating measures a fuel's resistance to knocking (to auto-ignition under compression). It is not a measure of how much energy the fuel contains.
  - U.S. DOE / EPA, fueleconomy.gov: Selecting the Right Octane Fuel (https://www.fueleconomy.gov/feg/octane.shtml)
  - U.S. Energy Information Administration: Octane in depth (Gasoline explained) (https://www.eia.gov/energyexplained/gasoline/octane-in-depth.php)
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 10: SI engine combustion II (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/35c1c5bbf304c0f41e1de0cec0b0ee85_MIT2_61S17_lec10.pdf)
  - Note: "Not a measure of energy" is not stated word for word in these three; it follows from their definition and fueleconomy.gov's "under normal driving conditions, you may get little to no benefit" from higher octane than required (3.7). Script may say "octane measures resistance to knock" without further claim, or "higher octane is not more energy" only if the fact check accepts the inference.
- **3.6** [supported, high] Octane is measured by matching the fuel's knock behaviour in a test engine to a blend of two reference fuels: iso-octane (rated 100) and normal heptane (rated 0). The octane number is the percentage of iso-octane in the matching blend. The test engine changes its compression ratio until knock of a set intensity appears.
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 10: SI engine combustion II (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/35c1c5bbf304c0f41e1de0cec0b0ee85_MIT2_61S17_lec10.pdf)
  - U.S. Energy Information Administration: Octane in depth (Gasoline explained) (https://www.eia.gov/energyexplained/gasoline/octane-in-depth.php)
  - U.S. Energy Information Administration: Octane in depth (Gasoline explained) (https://www.eia.gov/energyexplained/gasoline/octane-in-depth.php)
  - Numbers: 100 octane number (iso-octane reference); 0 octane number (heptane reference)
  - Note: MIT and EIA are two families. EIA also says the pump label is (R+M)/2 (average of research and motor octane): single source, left out of claims (decisions.md).
- **3.7** [supported, high] Modern engines detect knock and delay the spark to stop it, at some cost in efficiency.
  - U.S. Energy Information Administration: Octane in depth (Gasoline explained) (https://www.eia.gov/energyexplained/gasoline/octane-in-depth.php)
  - U.S. DOE / EPA, fueleconomy.gov: Selecting the Right Octane Fuel (https://www.fueleconomy.gov/feg/octane.shtml)
  - Note: The claim that higher octane than needed gives little or no benefit is fueleconomy.gov only: dropped as a claim (decisions.md).
- **3.8** [supported_range_only, high] In the United States regular petrol is generally 87 octane and premium 91 to 94. Higher octane is aimed at engines with higher compression or turbocharging.
  - U.S. DOE / EPA, fueleconomy.gov: Selecting the Right Octane Fuel (https://www.fueleconomy.gov/feg/octane.shtml)
  - U.S. Energy Information Administration: Octane in depth (Gasoline explained) (https://www.eia.gov/energyexplained/gasoline/octane-in-depth.php)
  - Numbers: 87 octane (pump rating) (regular); 91-94 octane (pump rating) (premium)
  - Note: Sources disagree on midgrade (88-90 vs 89-90): say nothing about midgrade. Regular 87 and premium 91-94 agree.

## Beat 4: The spark comes early

- **4.1** [supported_range_only, high] The spark fires before the piston reaches top dead centre, near the end of the compression stroke. Textbook ranges are tens of degrees before TDC (about 15 to 45 degrees in one table); the best timing depends on speed and load.
  - NPTEL / Indian Institutes of Technology: Module 1, Lecture 1: Introduction to IC Engines and Air Pollution (NPTEL course 112104033) (https://archive.nptel.ac.in/content/storage2/courses/112104033/lecture1/1_4.htm)
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 9: SI engine combustion I (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/f8aec73c2e9233c4e8e3674d77428483_MIT2_61S17_lec9.pdf)
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 9: SI engine combustion I (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/f8aec73c2e9233c4e8e3674d77428483_MIT2_61S17_lec9.pdf)
  - Numbers: 15-45 degrees before TDC (NPTEL table, spark ignition); 30 degrees before TDC (MIT example: MBT timing at wide-open throttle, 50 over-advanced, 10 retarded)
  - Note: No source fetched gives the idle value. The MIT 30 degrees is at wide-open throttle (a figure caption). Say "a few tens of degrees before top dead centre", not a single angle. The ECU also moves it constantly. Toyota's document mentions a 5 degree BTDC default (fallback) setting only: do not use as typical.
- **4.2** [supported, high] The spark comes early because burning takes time: the flame needs part of a stroke to spread, so the pressure peak should land just after top dead centre. Spark too late means the heat is released too far into the expansion to be turned into work; too early lowers the effective compression ratio, wastes heat and risks knock.
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 9: SI engine combustion I (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/f8aec73c2e9233c4e8e3674d77428483_MIT2_61S17_lec9.pdf)
  - NPTEL / Indian Institutes of Technology: Module 1, Lecture 1: Introduction to IC Engines and Air Pollution (NPTEL course 112104033) (https://archive.nptel.ac.in/content/storage2/courses/112104033/lecture1/1_4.htm)
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 3: Engine Cycles (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/e9421a34d0cd5c5fc4fc81365975503e_MIT2_61S17_lec3.pdf)
  - Numbers: 14-17 degrees after TDC (MIT: peak cylinder pressure location at best (MBT) timing in the example)
  - Note: MIT lec 3 and 9 are one family. NPTEL is the second.
- **4.3** [supported, high] Combustion in a petrol engine is a flame spreading outward from the spark plug through the mixture, not an explosion. The spark makes a small hot kernel that grows into a nearly spherical flame, wrinkled by turbulence, that sweeps through the cylinder until the fuel is burned. The explosive event is knock.
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 10: SI engine combustion II (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/35c1c5bbf304c0f41e1de0cec0b0ee85_MIT2_61S17_lec10.pdf)
  - U.S. Energy Information Administration: Octane in depth (Gasoline explained) (https://www.eia.gov/energyexplained/gasoline/octane-in-depth.php)
  - NPTEL / Indian Institutes of Technology: Module 1, Lecture 1: Introduction to IC Engines and Air Pollution (NPTEL course 112104033) (https://archive.nptel.ac.in/content/storage2/courses/112104033/lecture1/1_4.htm)
  - Numbers: 1 mm (MIT: initial kernel size on slide, with ~100 microseconds (slide text "1mm, 100 s"))
  - Note: EIA contrasts "controlled combustion" with knock ("spontaneous combustion"). Do not say "there is no explosion at all" about knock; knock is the explosive-like event. NASA's page says "rapid combustion" in an idealised cycle: fine, but "rapid" is not "explosion". The 1 mm / 100 us kernel figure is a slide fragment, so left out of numbers for script use.
- **4.4** [derived_rough, medium] The burn takes a stretch of crank angle: for a modern fast-burn engine at medium speed and part load, about 15 degrees to burn the first 10% of the mixture, 25 degrees for half and 35 degrees for 90%. At an engine speed of 1000 rpm one millisecond is 6 crank degrees, so that is a few milliseconds.
  - MIT OpenCourseWare: MIT 2.61 Internal Combustion Engines (Spring 2017), Lecture 9: SI engine combustion I (https://www.ocw.mit.edu/courses/2-61-internal-combustion-engines-spring-2017/f8aec73c2e9233c4e8e3674d77428483_MIT2_61S17_lec9.pdf)
  - NPTEL / Indian Institutes of Technology: Module 1, Lecture 1: Introduction to IC Engines and Air Pollution (NPTEL course 112104033) (https://archive.nptel.ac.in/content/storage2/courses/112104033/lecture1/1_4.htm)
  - Numbers: 15 / 25 / 35 crank degrees (0-10% / 0-50% / 0-90% mass burned, medium speed part load (MIT)); 6 crank degrees per ms (1000 rpm (MIT conversion slide); 4.5 degrees/ms at 750 rpm); 5.8 ms (35 degrees at 1000 rpm; about 7.8 ms at 750 rpm)
  - Note: MIT gives the burn angles for medium speed part load, not idle; its slide says burn angle rises roughly as rpm^0.2, so an idle burn is probably no longer in degrees, but that is an inference, not a number. The millisecond figures use the MIT conversion (1000 rpm = 6 degrees per ms). NPTEL is a looser second source (it gives where combustion ends relative to TDC, not its length). Use as "a few thousandths of a second", not a precise number.

## Beat 5: Power (360 to 540), flywheel and firing order

- **5.1** [supported, high] The power stroke is the only stroke that delivers work. Burning raises the pressure of the trapped gas, which pushes the piston down; the intake, compression and exhaust strokes are driven by stored momentum and the other cylinders.
  - NASA Glenn Research Center: 4-Stroke Internal Combustion Engine (Beginner's Guide to Aeronautics) (https://www.grc.nasa.gov/www/K-12/airplane/engopt.html)
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Autozine (independent automotive engineering site): Engine Configuration and Smoothness: Introduction and Basic Theory (Autozine Technical School) (https://autozine.org/technical_school/engine/Smoothness1.html)
  - Numbers: 1 of 4 strokes
  - Note: Same family caution as 1.4.
- **5.2** [supported, high] The flywheel stores some of the energy of each power stroke and gives it back during the other strokes, evening out the pulses of torque.
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - NASA Glenn Research Center: Engine Power Train (https://www.grc.nasa.gov/www/k-12/airplane/powert.html)
  - University of Windsor / University of Washington (course page): Flywheel (University of Windsor engine manual, hosted on a University of Washington course site) (https://courses.washington.edu/engr100/Section_Wei/engine/UofWindsorManual/Flywheel.htm)
  - Note: The sentence in TM 10-570 begins "One end of the crankshaft is ordinarily fitted with a flywheel"; the quote is the continuing clause as printed.
- **5.3** [supported, high] In a four-cylinder four-stroke engine a power stroke begins every 180 degrees of crank rotation (a single cylinder fires once every two revolutions, a six every 120 degrees, an eight every 90). With more cylinders the power strokes overlap more, so the torque is smoother.
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Autozine (independent automotive engineering site): Engine Configuration and Smoothness: Introduction and Basic Theory (Autozine Technical School) (https://autozine.org/technical_school/engine/Smoothness1.html)
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Numbers: 180 degrees (between firings, 4 cylinders); 120 degrees (between firings, 6 cylinders); 90 degrees (between firings, 8 cylinders); 720/n degrees (general rule, n cylinders)
  - Note: TM 10-570 and Autozine are two families. The 180-degree four-cylinder interval is Autozine; TM 10-570 shows it in Fig. 15 (a four-cylinder chart, "power is being developed throughout the cycle"). Even-firing engines only; odd-fire and V-engine angles differ (not covered).
- **5.4** [supported, high] A typical inline four-cylinder fires in the order 1-3-4-2, so each cylinder is at a different stroke at any moment: while one is on the power stroke, the others are on exhaust, intake and compression.
  - Toyota Motor Sales (filed with U.S. NHTSA): Toyota Camry engine specifications, New Car Features excerpt (NHTSA ODI file PE04-021, Attachment 12) (https://static.nhtsa.gov/odi/inv/2004/INRD-PE04021-18337.pdf)
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Longmans, Green and Co. (1909), scan on Internet Archive: The Gas, Petrol and Oil Engine, vol. 2 (Dugald Clerk and G. A. Burls, Longmans, 1909; archive.org item cu31924004083352) (https://archive.org/details/cu31924004083352)
  - Numbers: 1-3-4-2 firing order (inline four)
  - Note: Toyota (2.4 L inline four) states 1-3-4-2; Clerk (1909) says the two possible orders for the normal four-cylinder crankshaft are 1-2-4-3 and 1-3-4-2, "1342 most usually adopted". The TM 10-570 Fig. 15 chart implies 1-3-4-2 from its row labels (OCR of the figure). Do not call 1-3-4-2 universal; "typical" is safe. Cylinder numbering is front to back.

## Beat 6: Exhaust (540 to 720) and the bill

- **6.1** [supported, high] On the exhaust stroke the piston rises and pushes the burnt gas out through the open exhaust valve. The exhaust valve opens before the piston reaches the bottom of the power stroke to let the pressure fall, which costs a little work but is a net gain.
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Colorado State University, Dept. of Mechanical Engineering: Valve Timing (fluids course notes) (https://www.engr.colostate.edu/~allan/fluids/page6/page6.html)
  - Encyclopaedia Britannica: four-stroke cycle (https://www.britannica.com/technology/four-stroke-cycle)
  - Note: 
- **6.2** [supported, high] Only a minority of the fuel energy reaches the wheels of a conventional car: fueleconomy.gov gives about 12% to 30% depending on the drive cycle, and a peer-reviewed global estimate for an average passenger car gives 21.5%.
  - U.S. DOE / EPA, fueleconomy.gov: Where the Energy Goes: Gasoline Vehicles (https://fueleconomy.gov/feg/atv.shtml)
  - U.S. DOE Vehicle Technologies Office (Fact of the Week), source: DOE/EPA Fuel Economy Guide: FOTW #1044, August 27, 2018: 12-30% of Energy Put into a Conventional Car is Used to Move the Car Down the Road (https://www.energy.gov/node/3604327)
  - VTT Technical Research Centre of Finland / Argonne National Laboratory (peer-reviewed; VTT portal abstract): Global energy consumption due to friction in passenger cars (Holmberg, Andersson, Erdemir; Tribology International 47 (2012) 221-234) (https://cris.vtt.fi/en/publications/global-energy-consumption-due-to-friction-in-passenger-cars/)
  - K. Holmberg, VTT (journal article, FME Transactions): Holmberg K., Global Impact of Friction on Energy Consumption, Economy and Environment (FME Transactions 43(3), author overview) (https://www.mas.bg.ac.rs/_media/istrazivanje/fme/vol43/3/01_kholmberg.pdf)
  - U.S. DOE Vehicle Technologies Office (Fact of the Week), source: DOE/EPA Fuel Economy Guide: Fact #709: January 9, 2012, Engine Energy Use: Where Does the Energy Go? (https://www.energy.gov/eere/vehicles/fact-709-january-9-2012-engine-energy-use-where-does-energy-go)
  - Numbers: 12-30 % of fuel energy (moves the car, depending on drive cycle (DOE/EPA)); 21.5 % of fuel energy (used to move the car, average passenger car (Holmberg et al. 2012)); 17-21 % of fuel energy (power to wheels, combined cycle (DOE Fact 709))
  - Note: Two families: DOE/EPA (fueleconomy.gov, Fact 1044 and 709: same data) and Holmberg et al. (Argonne co-author, peer-reviewed; includes a global-average assumption, and counts braking/acceleration energy as "moving the car"). "12-30%" is a wide range and 21.5% sits inside it. Say "roughly a fifth, and in city driving less". "Power to wheels" in Fact 709 (17-21% combined) is the same ballpark. Holmberg's 38% mechanical includes diesels in the global fleet. Safe numbers: about 12-30%, about one fifth.
- **6.3** [supported, high] Most of the fuel energy is lost in the engine itself, mostly as heat out of the exhaust and through the cooling system. Holmberg et al. put exhaust at 33%, cooling at 29% and mechanical power at 38%; DOE Fact 709 puts thermal losses (radiator, exhaust heat) at 60-62% for a typical car.
  - U.S. DOE / EPA, fueleconomy.gov: Where the Energy Goes: Gasoline Vehicles (https://fueleconomy.gov/feg/atv.shtml)
  - K. Holmberg, VTT (journal article, FME Transactions): Holmberg K., Global Impact of Friction on Energy Consumption, Economy and Environment (FME Transactions 43(3), author overview) (https://www.mas.bg.ac.rs/_media/istrazivanje/fme/vol43/3/01_kholmberg.pdf)
  - U.S. DOE Vehicle Technologies Office (Fact of the Week), source: DOE/EPA Fuel Economy Guide: Fact #709: January 9, 2012, Engine Energy Use: Where Does the Energy Go? (https://www.energy.gov/eere/vehicles/fact-709-january-9-2012-engine-energy-use-where-does-energy-go)
  - Numbers: 33 % of fuel energy (exhaust (Holmberg et al.)); 29 % of fuel energy (cooling (Holmberg et al.)); 38 % of fuel energy (mechanical power at the crank, before friction and drag); 60-62 % of fuel energy (thermal losses, combined cycle (DOE Fact 709))
  - Note: Holmberg (exhaust+cooling = 62%) and DOE (60-62%) agree. Safe line: "about 60% leaves as heat". The Holmberg split (33/29) is a global-average estimate; DOE does not split exhaust from coolant. Do not say "a third out the exhaust" as an established fact without the fact check.
- **6.4** [supported_range_only, medium] At the crankshaft, before the transmission and tyres, a petrol engine delivers roughly a third of the fuel energy at best: low 30s per cent for a modern engine at its best point (MIT), 38% in an average-car estimate (Holmberg et al.). The rest leaves as heat.
  - MIT (web.mit.edu/2.61): MIT 2.61 lecture notes, Lec. 18: Engine Heat Transfer (https://web.mit.edu/2.61/www/Lecture%20notes/Lec.%2018%20Heat%20transf.pdf)
  - K. Holmberg, VTT (journal article, FME Transactions): Holmberg K., Global Impact of Friction on Energy Consumption, Economy and Environment (FME Transactions 43(3), author overview) (https://www.mas.bg.ac.rs/_media/istrazivanje/fme/vol43/3/01_kholmberg.pdf)
  - Mazda Motor Corporation: Where Engine Dreams Meet Possibilities: The SKYACTIV-Z Challenge (interview with Mazda engine developers) (https://www.mazda.com/en/mazda-mirai-base/articles/20250319-multisolution-skyactivez/)
  - Numbers: low 30s % of fuel energy (peak brake efficiency of modern SI engines (MIT note)); 38 % of fuel energy (mechanical power at the crank, average passenger car (Holmberg et al.))
  - Note: Numbers differ (low 30s vs 38%): say "roughly a third" without a digit. MIT slide is a one-line fragment ("Update for modern engines: SI engine in the low 30's") for peak efficiency, not a drive-cycle average. Mazda is a manufacturer statement without a number.

## Beat 7: Where the cycle came from

- **7.1** [supported_with_date_caveat, high] The four-stroke cycle was set out in 1862 by the French engineer Alphonse Beau de Rochas, who never built an engine.
  - Encyclopaedia Britannica: Alphonse Eugene Beau de Rochas (https://www.britannica.com/biography/Alphonse-Eugene-Beau-de-Rochas)
  - Longmans, Green and Co. (1909), scan on Internet Archive: The Gas, Petrol and Oil Engine, vol. 2 (Dugald Clerk and G. A. Burls, Longmans, 1909; archive.org item cu31924004083352) (https://archive.org/details/cu31924004083352)
  - engrXiv preprint (not peer reviewed), Universidade Tecnologica Federal do Parana: On Beau de Rochas' Engines: Transcription from his 1862 handwritten memoire (C. Naaktgeboren, preprint, 2023) (https://engrxiv.org/preprint/download/3003/5771/4567)
  - Encyclopaedia Britannica: gasoline engine: Development of gasoline engines (https://www.britannica.com/technology/gasoline-engine/Development-of-gasoline-engines)
  - Numbers: 1862 year (Beau de Rochas description)
  - Note: Date and form disagree: Britannica says he "patented" it in 1862; Encyclopedia.com says the patent (filed 1862) was never published because fees went unpaid; EBSCO says an obscure privately published pamphlet of 1861; Naaktgeboren and Clerk say 1862 (a handwritten memoire / a proposal). Safe: "in 1862 Beau de Rochas set the four-stroke cycle down on paper". Do not say "patented" or "published".
- **7.2** [supported, high] Nikolaus Otto built an engine working on the four-stroke principle in 1876.
  - Encyclopaedia Britannica: Nikolaus Otto (https://www.britannica.com/biography/Nikolaus-August-Otto)
  - Longmans, Green and Co. (1909), scan on Internet Archive: The Gas, Petrol and Oil Engine, vol. 2 (Dugald Clerk and G. A. Burls, Longmans, 1909; archive.org item cu31924004083352) (https://archive.org/details/cu31924004083352)
  - EBSCO Information Services (Research Starters): Otto's Practical Internal Combustion Engine (EBSCO Research Starters) (https://www.ebsco.com/research-starters/history/ottos-practical-internal-combustion-engine)
  - Encyclopedia.com (Complete Dictionary of Scientific Biography / Gale): Otto, Nikolaus August (1832-1891) (https://www.encyclopedia.com/environment/encyclopedias-almanacs-transcripts-and-maps/otto-nikolaus-august-1832-1891)
  - Numbers: 1876 year (Otto four-stroke engine)
  - Note: EBSCO says May 1876; do not give a month unless the fact check finds a second source. Encyclopedia.com says "prototype". Britannica: "since Otto was the first to build an engine based upon this principle, it is commonly known as the Otto cycle".
- **7.3** [supported_with_caveat, high] Otto took out United States patent No. 194,047, "Improvement in gas-motor engines", granted 14 August 1877; Otto was then at the Gas-Motoren-Fabrik Deutz in Germany.
  - USPTO via Google Patents: US Patent 194,047, Improvement in gas-motor engines (N. A. Otto, 14 Aug 1877) (https://patents.google.com/patent/US194047)
  - Encyclopedia.com (Complete Dictionary of Scientific Biography / Gale): Otto, Nikolaus August (1832-1891) (https://www.encyclopedia.com/environment/encyclopedias-almanacs-transcripts-and-maps/otto-nikolaus-august-1832-1891)
  - EBSCO Information Services (Research Starters): Otto's Practical Internal Combustion Engine (EBSCO Research Starters) (https://www.ebsco.com/research-starters/history/ottos-practical-internal-combustion-engine)
  - Numbers: 194,047 US patent number; 1877-08-14 date (grant date)
  - Note: IMPORTANT: the US patent text is about a gas engine whose charge is a mixture dispersed in air so that "instead of an explosion ensuing" the flame spreads gradually (stratified charge), not a claim on the four-stroke cycle as such. EBSCO's "patent for his four-stroke engine" is looser than the patent text; Encyclopedia.com says "ideas concerning stratification were patented in 1877". The script should say "Otto's 1877 patent" not "patent on the four-stroke cycle". Google Patents header OCR is noisy (inventor line reads NIOOLAUS A. OTTO, OF DEUTZ, GERMANY); the grant date and number are clean in the text.
- **7.4** [supported_with_caveat, medium] Otto's patent was built on a stratified-charge idea: a combustible mixture spread through air so that, as the patent puts it, "instead of an explosion ensuing" the flame is passed gradually from one combustible particle to another. The patent also describes the piston's return stroke driven by the momentum of the flywheel.
  - USPTO via Google Patents: US Patent 194,047, Improvement in gas-motor engines (N. A. Otto, 14 Aug 1877) (https://patents.google.com/patent/US194047)
  - USPTO via Google Patents: US Patent 194,047, Improvement in gas-motor engines (N. A. Otto, 14 Aug 1877) (https://patents.google.com/patent/US194047)
  - Encyclopedia.com (Complete Dictionary of Scientific Biography / Gale): Otto, Nikolaus August (1832-1891) (https://www.encyclopedia.com/environment/encyclopedias-almanacs-transcripts-and-maps/otto-nikolaus-august-1832-1891)
  - Note: Nice tie to beats 4 and 5 (explosion vs flame, flywheel carries the strokes), but it is a primary text read through OCR and a second, secondary source. The patent describes an engine in which the first outstroke draws a layered charge, not the compress-before-ignite cycle; do not say it describes the modern four-stroke. Fact check should read the PDF itself.
- **7.5** [supported, high] In 1886 Otto's German patent was overturned (revoked) after an earlier description of the four-stroke principle, by Beau de Rochas, was brought to light.
  - Encyclopaedia Britannica: Nikolaus Otto (https://www.britannica.com/biography/Nikolaus-August-Otto)
  - Encyclopedia.com (Complete Dictionary of Scientific Biography / Gale): Otto, Nikolaus August (1832-1891) (https://www.encyclopedia.com/environment/encyclopedias-almanacs-transcripts-and-maps/otto-nikolaus-august-1832-1891)
  - EBSCO Information Services (Research Starters): Otto's Practical Internal Combustion Engine (EBSCO Research Starters) (https://www.ebsco.com/research-starters/history/ottos-practical-internal-combustion-engine)
  - MadeHow.com / Gale: Nikolaus August Otto (Inventor Biographies) (https://www.madehow.com/inventorbios/76/Nikolaus-August-Otto.html)
  - Numbers: 1886 year (German patent overturned)
  - Note: Four sources agree on the year and the cause. They disagree on whether Beau de Rochas' document was a patent (Britannica, Encyclopedia.com) or a pamphlet (EBSCO) and on whether "courts" or the patent office did it (madehow says courts; Wikipedia says patent office; neither is a source here). Safe: "Otto's German patent was overturned in 1886 once Beau de Rochas's earlier description surfaced". Do not name the court. Encyclopedia.com: Crossley (Otto's English licensee) defended the British patent against the same document: single-source, not claimed.
- **7.6** [supported, medium] Otto and Eugen Langen had built an atmospheric engine, shown in 1867, before Otto's four-stroke engine; the four-stroke Otto engine was then an immediate commercial success.
  - Longmans, Green and Co. (1909), scan on Internet Archive: The Gas, Petrol and Oil Engine, vol. 2 (Dugald Clerk and G. A. Burls, Longmans, 1909; archive.org item cu31924004083352) (https://archive.org/details/cu31924004083352)
  - Encyclopaedia Britannica: Nikolaus Otto (https://www.britannica.com/biography/Nikolaus-August-Otto)
  - Encyclopaedia Britannica: gasoline engine: Development of gasoline engines (https://www.britannica.com/technology/gasoline-engine/Development-of-gasoline-engines)
  - Numbers: 1867 year (Otto and Langen atmospheric engine); 1876 year (four-stroke engine)
  - Note: The 1867 date is Clerk (1909) and NPTEL ("1867 J. E. E. Lenoir and Nikolaus Otto developed atmospheric engine": this wording merges Lenoir and Otto and is not used). Encyclopedia.com: "By 1867 the engine design was perfected and a patent applied for." Keep this to a one-line aside.
- **7.7** [supported, high] The four-stroke cycle is often called the Otto cycle, after Nikolaus Otto, even though Beau de Rochas described it first.
  - Encyclopaedia Britannica: four-stroke cycle (https://www.britannica.com/technology/four-stroke-cycle)
  - U.S. War Department / U.S. Government Publishing Office: TM 10-570 The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941) (https://www.govinfo.gov/content/pkg/GOVPUB-W-4251326e95fd1360d74b0778679fed0d/html/GOVPUB-W-4251326e95fd1360d74b0778679fed0d.htm)
  - Encyclopaedia Britannica: Alphonse Eugene Beau de Rochas (https://www.britannica.com/biography/Alphonse-Eugene-Beau-de-Rochas)
  - Note: Fragment quote comes from the Beau de Rochas biography extraction.
