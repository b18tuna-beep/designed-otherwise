# Research dossier: Why Your Refrigerator Has to Heat Up to Keep Food Cold

Episode: FPI P1, Designed Otherwise (produced under the working name The Hidden Mechanism). Companion to `claims.json` (33 claims: 24 supported, 9 corrected, 0 rejected).
Researched 2026-10-27. Every source listed in claims.json was opened, except where a locator says otherwise.

## Notes for the fact checker

- Pages were read through a fetch tool that returns extracted text. Quotes marked as verbatim came back from that tool in quotation marks, but a few are joined fragments (flagged in notes). Check the exact wording against the page.
- Blocked or failed, so not cited: energy.gov/energysaver/refrigerators (site error), energy.gov "refrigerator standards save consumers billions" (site error), PubChem isobutane and 1,1,1,2-tetrafluoroethane (blocked by permission prompt), a LibreTexts OpenStax URL (too long for the fetch proxy), Penn State courses.ems.psu.edu (login redirect; the e-education.psu.edu copy opened instead).
- Corporate overlap: GE 31-9090, GE 31-9091 and the Hotpoint guide are all GE. Maytag and KitchenAid are now Whirlpool brands (the Maytag manual is from 2005, before the merger). GE Appliances is now owned by Haier. Each claim that relies on these still has a source from a different company.
- Four figures are my own arithmetic, labelled in claims.json: the 7.9% refrigerator share (6.4), compressor COP of about 1.7 (3.8), defrost heater of about 390 W from a 37 ohm reading (5.3 notes, not used), and a mullion heater of about 9 to 10 W (5.7).

## Beat 1, cold open

**Solid.** A running fridge sheds heat through its skin. Haier gives real numbers: the condenser-side surface runs at **about 40 °C in a 25 °C room**, about 50 °C just after power-on, 60 to 65 °C when the room is above 35 °C, with an 85 °C limit (1.1).

**Corrected.**
- **Condenser layout.** All three layouts exist: exposed back coil, tubing bonded inside the side walls ("hot-wall"), and a fan-cooled coil in a machine compartment at the bottom or rear. U.S. service manuals (GE, Frigidaire, Maytag, Whirlpool, KitchenAid) show fan-cooled bottom or rear condensers. One paper says internal hot-wall condensers are common in North America. No source gives market shares, so **don't call any one layout "the most common."**
- **Compressor heat.** It is not always hot. Haier lists a casing temperature of **85 to 90 °C**, but GE's inverter-compressor guide says the exterior "may be room temperature while operating" (1.2). Say "often runs hot."

## Beat 2, cold is not a thing

**Solid.**
- The Clausius statement, with wording from HyperPhysics and LibreTexts (Yan, Engineering Thermodynamics) (2.1).
- Heat is energy transfer driven by a temperature difference, and a fridge cools food by removing heat (2.2).
- A refrigerator is "an engine running in reverse" (OpenStax), which makes it a heat pump (2.3).

**Corrected.**
- No source uses the phrase "cold isn't a thing." The definitions support the framing, so keep the line as narration and don't attribute it.
- Avoid "heat can never flow from cold to hot." Say "never on its own." At the molecular level energy moves both ways, and only the net flow runs hot to cold.

## Beat 3, the loop

**Solid.**
- Evaporator, compressor, condenser and capillary tube are each confirmed by at least one manufacturer service guide and one textbook (3.1 to 3.5).
- The boiling point depends on pressure (3.9). SWEP gives a mountain-top analogy for water, and HyperPhysics says the refrigerant is made to evaporate and condense by "successively lowering and raising the pressure."
- The capillary is soldered to the suction line as a heat exchanger. Confirmed by GE, Maytag and Frigidaire (3.5).
- Boiling points at atmospheric pressure (3.6):

  | Refrigerant | Boiling point | Sources |
  | --- | --- | --- |
  | Isobutane (R-600a) | about −11.7 °C / 11 °F | NIST, Wikipedia, National Refrigerants SDS |
  | R-134a | about −26.3 °C / −15 °F | NIST, Wikipedia, Honeywell SDS |

- The U.S. move to isobutane (3.6b):
  - 2011: the EPA's SNAP program approves isobutane for household fridges, with a 57 g charge cap.
  - 2018: the cap is raised to 150 g.
  - January 1, 2025: under the Technology Transitions rule, new household refrigerators and freezers must use a refrigerant with a GWP of 150 or less.
  - The EPA proposed reforms to that rule in September 2025. The release I read did not mention household fridges. Check the rule's status before publishing.
- Energy balance: Qh = Qc + W, and COP = Qc / W (3.8).

**Corrected.**
- **Operating temperatures (3.7).** No source gives "typical operating" evaporator and condenser temperatures. What exists:
  - the standard compressor rating condition (ASHRAE LBP): **−23.3 °C (−10 °F) evaporating, 54.4 °C (130 °F) condensing**;
  - one compressor's design range of −35 to −10 °C;
  - the Haier surface figure of about 40 °C.

  Present these as rough figures.
- **COP (3.8).** No credible whole-fridge COP was found. OpenStax's "2 to 6" covers air conditioners and refrigerators in general and is too high for a household fridge. Household compressors are rated at about **1.4 to 1.7** under harsh test conditions. Either use that with the framing or leave out the number.
- **Capillary (3.4).** GE describes it as a flow restrictor. The pressure drop is the result of the restriction. Phrase it that way.

**Single source.** GE says about **30% of the refrigerant flashes to vapor** as it leaves the capillary (3.10). Attribute it to GE or drop it.

## Beat 4, why it must run hot

**Solid.**
- The condenser has to be hotter than the room for heat to flow out. SWEP: "The surrounding medium must be at a lower temperature than the condensing temperature" (4.1).
- Clearances vary a lot by model (4.3):
  - GE side-by-side: 1/8 in sides, 1/2 in rear, 1 in top
  - Hotpoint: 3/4 in sides, 1 in top and back
  - Samsung: 5 cm sides and back, 2.5 cm top

**Corrected.**
- **Dirty coils (4.2).** Whirlpool: blocked airflow raises condenser temperature. Hotpoint: clean "at least once a year." Whirlpool: every 3 to 6 months in homes with pets or dust. Some newer models need no routine cleaning (GE's "No-Clean condenser"). No DOE or ENERGY STAR source I opened gives an energy penalty, so **don't cite a percent**.
- **Heat sources (4.4).** This is not a DOE tip I could verify, because the DOE page failed. It is supported by ENERGY STAR (archived), the State of Illinois, Virginia Tech extension and Frigidaire. Frigidaire also says not to install the fridge where the room falls below 60 °F or rises above 110 °F.

## Beat 5, the second heater

**Solid.**
- Frost forms because the evaporator sits below freezing and moisture from the air (door openings, food) freezes onto it. Frost insulates the coil and clogs the airflow (5.1, 5.2).
- **Defrost heaters are rated at about 450 to 600 W**, either radiant tube or calrod type (5.3).
- Defrost timing (5.4):
  - mechanical timer: about every 8 hours of compressor run time, for about 25 to 35 minutes;
  - adaptive control: anywhere from 4 to 6 hours up to 60, 96 or "100+" hours of run time, depending on door openings.
- A bimetal terminator opens at about **42 to 47 °F** (5.5). GE's electronic models instead use a thermistor and an over-temperature safety disc.
- Meltwater drains to a pan beside the condenser, where condenser heat and the condenser fan evaporate it back into the kitchen. Confirmed by a Maytag manual and by Whirlpool and GE patents (5.6).
- **Anti-condensation heating is confirmed (5.7)**, so it is safe to use.
  - Warm refrigerant loops are called "post-condenser loop" (Maytag), "perimeter hot tube" (Frigidaire), "heat loop" (Whirlpool) and "yoder loop" (Maytag patent).
  - Electric mullion and seal heaters exist on some models.
  - Hotpoint and Whirlpool "energy saver" switches turn the electric heater off.

**Corrected.** I found no source for foil defrost heaters, so leave them out.

**Weak.**
- Manual-defrost fridges use less energy (Virginia Tech, Illinois). The **35 to 40%** figure comes from one source and conflicts with a NIST test where defrost added only 0.6% for one unit. Don't use the number (5.9).

## Beat 6, the bill

**Solid.**
- **Older fridges (6.2).** New ones use about a quarter of the energy of 1970s models while offering almost 30% more space. DOE: about **1,800 kWh/yr in 1974** versus 250 to 500 kWh/yr by 2008. Penn State: a typical 1973 model cost nearly $160 a year to run, against about $55 for a new top-freezer.
- **Open door (6.3).** Leaving the door open warms the kitchen. UIUC Physics Van and UCSD both say so, and OpenStax asks it as a textbook exercise.

**Corrected.**
- **Typical use (6.1).** There is no single "typical modern fridge" figure. Examples:
  - an 18 cu ft ENERGY STAR top-freezer is rated at 363 kWh/yr, against a federal limit of 404;
  - ENERGY STAR models are about 9% better than the federal minimum overall;
  - the average most-used fridge in U.S. homes used 617 kWh in 2020 (EIA RECS), across all ages, at about $87 a year.

**Single publisher.** Refrigerators' share of household electricity is about **7 to 8%** (6.4). EIA RECS 2020 gives 103.1 billion kWh out of 1,305 billion kWh, which is 7.9% by my calculation. EIA's earlier figure from RECS 2015 is 7%. Every source here is EIA.

## Five surprising true details for on-screen moments

1. **The defrost heater draws about three times the compressor's power.** A Frigidaire data sheet lists a 450 W defrost heater against a compressor drawing 120 to 160 W. KitchenAid lists 470 W against 153 W. To stay cold, the fridge regularly switches on a heater bigger than its own cooling engine (5.8). Pair it with the NIST note that defrost is still a small share of total energy.
2. **The fridge deliberately heats its own door frame.** Hot refrigerant tubing (Maytag's "yoder loop" patent) or small electric heaters keep the seal area warm so the outside doesn't sweat. Whirlpool says the edges can feel unusually warm for up to 24 hours (5.7).
3. **The refrigerant boils colder than your freezer.** Isobutane boils at about 11 °F and R-134a at about −15 °F at normal air pressure. A refrigerant "boiling" is what makes cold (3.6).
4. **The cooling engine sits right next to a puddle that it boils off.** Defrost water drips to a pan beside the hot condenser, and the condenser fan evaporates it back into your kitchen. The water your fridge pulled out of the air goes back into the room (5.6).
5. **A 1974 fridge used about 1,800 kWh a year, and an efficient new one uses about a quarter of that** (and 2008 models used 250 to 500 kWh) while holding about 30% more food (6.2).

Runners-up:
- The side walls of some fridges run at about 40 °C, and a compressor shell can reach 85 to 90 °C (Haier) (1.1, 1.2).
- About 30% of the refrigerant flashes to vapor as it leaves the capillary (GE, single source) (3.10).
- The capillary tube is soldered to the return line so the cold line doesn't sweat (3.5).

## Terms that may trip the TTS voice

| Term | Suggested reading |
| --- | --- |
| Clausius | KLOW-zee-us |
| isobutane | eye-so-BYOO-tane |
| R-600a | "R six hundred A" |
| R-134a | "R one thirty-four A" |
| capillary | KAP-ih-lair-ee |
| mullion | MULL-yun |
| calrod | CAL-rod |
| bimetal | BYE-metal |
| thermodisc / thermistor | THER-mo-disk / ther-MISS-ter |
| yoder loop | YO-der loop |
| ASHRAE | ASH-ray |
| SNAP (EPA program) | "snap" |
| GWP | "G W P" or "global warming potential" |
| HFC | "H F C" |
| COP | "C O P" or "coefficient of performance" |
| kWh | "kilowatt-hours" (write out in the script) |
| Btu | "B T U" |
| °F / °C | "degrees Fahrenheit / Celsius" (write out) |
| latent heat | LAY-tent |
| evaporator / condenser | ee-VAP-or-ay-ter / con-DEN-ser |
