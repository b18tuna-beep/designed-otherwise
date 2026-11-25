# Research dossier: the pin tumbler lock (working title "Your Front Door Lock Never Reads Your Key")

Episode: P4, Designed Otherwise. Readable companion to `claims.json`: 65 claim entries across the 8 beats. Researched 2026-11-24 (overnight, unattended). Every URL was opened in this session (curl text extraction, or the WebFetch tool where noted in the source title); the locator says where the supporting sentence is.

## Read this first (changes to the brief)

1. **"A 4,000-year-old idea" is not supportable.** Britannica's "possibly 4,000 years old" was traced by D. T. Potts (1990) to a 1957 catalogue's misreading of Pitt-Rivers (1883), who himself doubted pin locks existed in pharaonic Egypt. Hard evidence is Roman-period Egypt (Amheida, Douch, Karanis, Kellis). Use "an old design, still in use in Egypt in the 20th century, attested in Roman-era Egypt". Beats 4 and 8 need rewording (claims 4.1 to 4.7).
2. **Bramah's lock was not a pin tumbler.** It was a slider lock (the challenge lock had 18 sliders). Chubb's detector was a lever lock. The 1851 story is about "no lock is unpickable", not about pins (5.3).
3. **Hobbs: 51 hours of work over 16 days** (24 July to 23 August 1851), not 51 hours straight. The prize was 200 guineas (paid as 210 pounds). Dispute is real: Bramah & Co. protested in writing (5.9, 5.11).
4. **Picking statistics do not exist** in the sources. FBI, BJS and ONS record forcible, unlawful (no force) and unlocked entries, not picking. Do not claim "almost no burglars pick" (7.6 to 7.8).
5. **Britannica says Yale Sr. patented a pin tumbler lock in 1848; the patent says 1844** (US 3,630, 13 June 1844). Yale Jr.'s cylinder lock patent is US 48,475, 27 June 1865 (4.10, 4.12).
6. Typical pin count is "usually five" (NIST) or four to seven (Blaze), not a sourced "five or six" (2.7). Depth counts are single-sourced (2.8).

## Notes for the fact checker

- Sources read by WebFetch extraction (not raw text) and worth re-opening: Britannica (lock, pin tumbler), Pitt-Rivers on Gutenberg, FBI UCR 2019 burglary PDF (blocks scripted download), ONS burglary overview, Science Museum Group Bramah records, Union EN 1303 page, ASSA ABLOY EN 1303 blog, Met object pages.
- Blocked or paywalled, not cited: UL 437 text (UL, ANSI webstore), BSI/DIN EN 1303 text, ANSI/BHMA A156.5 text, Science Museum Egyptian lock explanatory text, Smithsonian Cooper Hewitt, Hagley patent model page (403 via curl; WebFetch worked), Gutenberg direct (503 via curl; WebFetch worked), commons search rate limits.
- Tomlinson/Hobbs book: archive.org item `rudimentarytreat00hobb` is labelled 1853 but its text contains a preface dated April 1868 (Mallet). Cite as "later edition, preface April 1868". The 1853 first edition pages for the controversy may differ in numbering.
- "Hobbs" and "Chubb" counts and times come from the arbitrators' report and a signed witness certificate printed in that book, with Bramah & Co.'s own letter. All other 1851 details agree with Churchill (2015, peer reviewed).
- The MIT Guide and Blaze's picking notes are instruction documents. Only the concept sentences quoted in claims 6.2 and 7.1 were used. Do not quote anything else from them.



## Beat 1: Cold open, the key in your pocket

- **1.1** [supported_with_date_caveat, medium] Mechanical locks guard the vast majority of homes and businesses, and the pin tumbler is the most common cylinder design in US door locks.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: NIST says 'most common' in 1981 for US door locks; Blaze (2003) does not rank pin tumbler specifically. Safe: 'the pin tumbler is the design inside most American door locks' only with 'as of the 1980s and still the standard'. Do not give a percent. Not 'smart locks' era data.
- **1.2** [supported, high] A pin tumbler lock never reads the key's outline. It only asks whether each pin stack is lifted to the right height; the 'secret' is the set of cut depths (the bitting).
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Theodore T. Tool (MIT hobbyist guide; used for concept only): MIT Guide to Lockpicking (Ted the Tool, 1991), archive.org copy (https://archive.org/download/FugitiveDistro_MIT_Guide_To_Lockpicking_Anonymous/MIT%20Guide%20To%20Lockpicking_READ_EN_48.pdf)
  - Note: Wording trap: the keyway profile is a separate, cruder check (see 2.6), so say 'never checks the key's shape beyond whether it fits the slot and lifts the pins'. 'Reads' is a metaphor.
- **1.3** [supported, high] A key cut wrong at even one position will not open the lock.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Theodore T. Tool (MIT hobbyist guide; used for concept only): MIT Guide to Lockpicking (Ted the Tool, 1991), archive.org copy (https://archive.org/download/FugitiveDistro_MIT_Guide_To_Lockpicking_Anonymous/MIT%20Guide%20To%20Lockpicking_READ_EN_48.pdf)
- **1.4** [supported, high] Master key systems, where one extra key opens many locks that each also have their own key, are standard industry practice and are used mainly with pin and disk tumbler locks.
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Note: Blaze tested 'real master-keyed installations, including both educational and commercial environments'. No source gives how many buildings are master keyed: do not give a share.

## Beat 2: Inside the lock

- **2.1** [supported, high] The plug is the rotating part that works the lock; it sits in a shell (housing) fixed to the door. Turning the plug operates the bolt.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: NIST calls the plug the 'core'; MIT calls the shell the 'hull'. Use plug and shell (housing).
- **2.2** [supported, high] Each pin stack is a key pin (bottom) and a driver pin (top) with a spring above, pushed down toward the keyway. Unless the joint between the two pins lines up with the edge between plug and shell, the plug cannot turn.
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
- **2.3** [supported, high] The shear line is the border between the plug and the shell. All the pin joints must sit on it at once.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
- **2.4** [supported, high] A stack lifted too little or too far blocks the plug just as a missing lift does.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Theodore T. Tool (MIT hobbyist guide; used for concept only): MIT Guide to Lockpicking (Ted the Tool, 1991), archive.org copy (https://archive.org/download/FugitiveDistro_MIT_Guide_To_Lockpicking_Anonymous/MIT%20Guide%20To%20Lockpicking_READ_EN_48.pdf)
- **2.5** [supported, high] With no key in, the springs push each driver pin across the shear line into the plug, which locks it.
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Theodore T. Tool (MIT hobbyist guide; used for concept only): MIT Guide to Lockpicking (Ted the Tool, 1991), archive.org copy (https://archive.org/download/FugitiveDistro_MIT_Guide_To_Lockpicking_Anonymous/MIT%20Guide%20To%20Lockpicking_READ_EN_48.pdf)
  - Note: Animation-level explanation; neither source phrases it as 'driver straddles the line' verbatim, but both describe the same state. Fine for narration.
- **2.6** [supported, medium] The keyway shape is a separate, cruder check: ridges (wards) in the slot decide which keys fit at all. A twisted or complex keyway only restricts which blanks go in.
  - Theodore T. Tool (MIT hobbyist guide; used for concept only): MIT Guide to Lockpicking (Ted the Tool, 1991), archive.org copy (https://archive.org/download/FugitiveDistro_MIT_Guide_To_Lockpicking_Anonymous/MIT%20Guide%20To%20Lockpicking_READ_EN_48.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: NIST wording is from a garbled two-column extraction. Narration should only say keyway profile limits which keys fit; the pins do the actual check.
- **2.7** [supported, high] Typical household cylinders have about five pin stacks (NIST, US door locks), and Blaze gives a range of four to seven.
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Note: The brief's 'five or six' is NOT directly sourced. Safe line: 'usually five' or 'about five or six' only if a script editor accepts 'four to seven'. Pins 'less than 1/8 inch' diameter is NIST only.
- **2.8** [single_source, medium] Lock makers pick from a small number of standard cut depths at each position: between four and ten depending on the model.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Note: Only Blaze found. No independent source for depth counts (manufacturer key specs were behind forum or shop pages, not usable). Say 'a handful of depths'. Do not narrate 'ten depths'.
- **2.9** [supported_range_only, medium] A typical commercial lock has anywhere from several thousand to several million possible distinct keys. Standards for key-related security ask for at least 100 to 100,000 distinct 'differs' depending on grade.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Union (ASSA ABLOY group) UK: EN 1303 (grading table; read via WebFetch extraction) (https://www.uniononline.co.uk/uk/en/help-support/standards-and-legislation/en-1303)
  - Note: Do NOT compute 'depths^pins' on screen as a fact for a named lock: no sourced pin/depth pair for a specific product. If the animation shows 5 pins x 10 depths = 100,000, label it 'a simple example' (our arithmetic, not a sourced product spec). Real keys have extra rules (adjacent-cut limits), so the true count is lower.
- **2.10** [single_source, medium] Not every combination of cuts is a legal key: many lock models forbid a very high cut right next to a very low one.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Note: Optional nuance for 'why the key-count is lower than the maths').
- **2.11** [supported, medium] The Yale pin tumbler cylinder was far more compact than earlier locks and opened with a small flat key.
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - ASME (American Society of Mechanical Engineers): Linus Yale, Jr. (https://www.asme.org/engineering-topics/articles/manufacturing-processing/linus-yale-jr)
  - Note: NIST 'start of miniaturization in industry' is a strong claim; keep it as 'much more compact than any earlier lock'.

## Beat 3: The second key (master keying)

- **3.1** [supported, high] Master keying cuts some pin stacks in more than one place (usually two), so that a stack has two heights that work.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: 'Master pin' is an extra pin segment (NIST). Landlord/building-staff key opens many doors, each tenant key opens only one.
- **3.2** [supported, medium] Master key systems come in levels: a master key opens all locks in a group; a grand master opens several master groups.
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
- **3.3** [single_source, high] Because pin stacks do not communicate, a master-keyed lock also opens with keys that mix the two working heights position by position, not only the two intended keys.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Note: Peer-reviewed IEEE paper. Single source; fine for one sentence, conceptual: 'a master-keyed lock accepts more keys than anyone planned'. No attack steps, no counts.
- **3.4** [supported_bibliographic, high] Matt Blaze wrote the 2003 paper on master-keyed locks while at AT&T Labs-Research; it appeared in IEEE Security & Privacy in 2003 (vol. 1, no. 2, pp. 24-32). He argued mechanical locks deserve study by computer scientists.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Note: Both entries describe the same paper, so this is one source family for the content; the bibliographic facts are independent confirmations. The Stanford talk abstract (crypto.stanford.edu, 14 Feb 2003) also confirms the talk. Script: say 'Matt Blaze, then a researcher at AT&T Labs' (he is now an academic: not checked, so do not state his current post).
- **3.5** [single_source_conceptual_only, medium] Blaze studied real master-keyed buildings (educational and commercial) with locks from Arrow, Best, Corbin Russwin, Schlage and Yale, and the weakness appeared in every system he tested, because it comes from the master-keying design itself.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - Note: CONCEPTUAL ONLY. Say: 'he found that giving one door two working keys made the whole building's master key discoverable in principle'. Never describe the method, the tools or the number of test keys. Phrase 'every system he tested' only with that scope.

## Beat 4: A very old idea, then Yale

- **4.1** [corrected, high] The oft-repeated figure that the pin lock is 'about 4,000 years old' is not supported by the archaeology. It traces to Britannica's 'possibly 4,000 years old', which Potts (1990) says came from a 1957 lock catalogue misreading Pitt-Rivers (1883).
  - Universita di Torino / Mesopotamia journal: Lock and Key in Ancient Mesopotamia (D. T. Potts), Mesopotamia 25, 1990 (https://www.yeshiva.org.il/midrash/pdf/wiki/potts_1990_-_lock_and_key_in_ancient_mes.pdf)
  - Pitt-Rivers, 1883 (public domain): On the Development and Distribution of Primitive Locks and Keys (Lt-Gen. A. Pitt-Rivers, 1 (https://www.gutenberg.org/files/44022/44022-h/44022-h.htm)
  - Note: BIG FLAG for the brief: the README's '4,000-year-old idea' (beats 4 and 8) cannot be said as fact. Also repeated by ASME/Lemelson/Yale UK/Britannica/Blaze ('ancient Egypt'). Safe: 'wooden pin locks from Egypt and the Near East, attested in Roman-period Egypt and described in the 19th century as old design; their true age is unclear'.
- **4.2** [supported_dated_source, high] Pitt-Rivers (1883) found it doubtful that the Egyptian pin lock existed in pharaonic Egypt: the earliest solid example he cited dated to Roman Egypt (reign of Trajan, A.D. 90), and sculptures show doors fastened by simple bolts.
  - Pitt-Rivers, 1883 (public domain): On the Development and Distribution of Primitive Locks and Keys (Lt-Gen. A. Pitt-Rivers, 1 (https://www.gutenberg.org/files/44022/44022-h/44022-h.htm)
  - Universita di Torino / Mesopotamia journal: Lock and Key in Ancient Mesopotamia (D. T. Potts), Mesopotamia 25, 1990 (https://www.yeshiva.org.il/midrash/pdf/wiki/potts_1990_-_lock_and_key_in_ancient_mes.pdf)
  - Note: 1883 scholarship; later discoveries could push dates back, none found in this pass. Quote only as 'in 1883 the leading authority doubted it predated Roman times'.
- **4.3** [supported, high] Wooden pin-lock bolts are physically attested in Roman-period Egypt, for example in a Late Romano-Egyptian house at Amheida in the Dakhla Oasis, with parallels at Douch, Karanis and Kellis.
  - NYU Institute for the Study of the Ancient World (ISAW): Amheida II: A Late Romano-Egyptian House in the Dakhla Oasis, ch. 18 Wood Objects (A. Cerv (https://dlib.nyu.edu/awdl/isaw/amheida-ii-house-b2/chapter18.xhtml)
  - Pitt-Rivers, 1883 (public domain): On the Development and Distribution of Primitive Locks and Keys (Lt-Gen. A. Pitt-Rivers, 1 (https://www.gutenberg.org/files/44022/44022-h/44022-h.htm)
  - Note: ISAW record gives the house date as 'Late Romano-Egyptian' (3rd-4th century CE is the usual range, but the dated phase was not quoted in the fetched chapter, so say 'Roman-era'). Bolt: 17.2 cm long with three holes (ISAW catalogue).
- **4.4** [supported, high] How the ancient wooden pin lock works: a wooden bolt with holes; pegs in a fixture on the door drop into the holes; a wooden key with matching pins is pushed in and lifted to raise the pegs so the bolt slides out.
  - NYU Institute for the Study of the Ancient World (ISAW): Amheida II: A Late Romano-Egyptian House in the Dakhla Oasis, ch. 18 Wood Objects (A. Cerv (https://dlib.nyu.edu/awdl/isaw/amheida-ii-house-b2/chapter18.xhtml)
  - Smith College (student-written museum page): Smith College Museum of Ancient Inventions: Tumbler Lock (https://www.smith.edu/bigbad/historyscitech/museum/ancient_inventions/hsc09b.htm)
  - Encyclopaedia Britannica: Lock (security device), Early history / Development of modern types (read via WebFetch ext (https://www.britannica.com/technology/lock-security)
  - Note: Smith page says brass pins; ISAW says wooden pegs. Say 'pins or pegs'.
- **4.5** [supported, high] Egyptian-type wooden pin locks were still in everyday use in Egypt and the Near East in the 19th and early 20th centuries.
  - Science Museum Group: Ancient Egyptian lock (object 1912-294) (https://collection.sciencemuseumgroup.org.uk/objects/co50298/ancient-egyptian-lock)
  - Pitt-Rivers, 1883 (public domain): On the Development and Distribution of Primitive Locks and Keys (Lt-Gen. A. Pitt-Rivers, 1 (https://www.gutenberg.org/files/44022/44022-h/44022-h.htm)
  - Universita di Torino / Mesopotamia journal: Lock and Key in Ancient Mesopotamia (D. T. Potts), Mesopotamia 25, 1990 (https://www.yeshiva.org.il/midrash/pdf/wiki/potts_1990_-_lock_and_key_in_ancient_mes.pdf)
  - Note: Useful bridge: the design survived long enough that Yale could see it. Museum object is a c.1912 Egyptian make, not ancient.
- **4.6** [corrected, medium] At Khorsabad, the Assyrian palace excavated in the 1840s, a gate was reported fastened by 'a huge wooden lock, like those still used in the East'. That 19th-century description is the evidence behind the 'oldest known lock' line, and it did not give a date.
  - Universita di Torino / Mesopotamia journal: Lock and Key in Ancient Mesopotamia (D. T. Potts), Mesopotamia 25, 1990 (https://www.yeshiva.org.il/midrash/pdf/wiki/potts_1990_-_lock_and_key_in_ancient_mes.pdf)
  - Encyclopaedia Britannica: Lock (security device), Early history / Development of modern types (read via WebFetch ext (https://www.britannica.com/technology/lock-security)
  - Note: Potts: 'this statement cannot ... be taken at face value'. Do not call it the oldest lock. Do not say 'found at Khorsabad, 4,000 years old'. Khorsabad (Sargon II's capital) is 8th century BCE as a palace date (not sourced here), a gate lock inside it is not dated by these sources.
- **4.7** [disputed, low] Earliest dated sources are disputed: a student-written Smith College page says the tumbler lock was 'probably invented around 1000 BCE, although a date of 2000 BCE has also been proposed'.
  - Smith College (student-written museum page): Smith College Museum of Ancient Inventions: Tumbler Lock (https://www.smith.edu/bigbad/historyscitech/museum/ancient_inventions/hsc09b.htm)
  - Universita di Torino / Mesopotamia journal: Lock and Key in Ancient Mesopotamia (D. T. Potts), Mesopotamia 25, 1990 (https://www.yeshiva.org.il/midrash/pdf/wiki/potts_1990_-_lock_and_key_in_ancient_mes.pdf)
  - Note: Do not use the numbers. The Met holds two wooden 'door bolts' (ca. 721-664 BCE or later, Dyn. 25, Thebes) but the Met record does not say they were pin-lock bolts, so they are NOT evidence of pin locks.
- **4.8** [supported, high] Linus Yale Sr. (1797-1858) and his son Linus Yale Jr. (1821-1868) were American lock makers; Jr. founded the Yale Lock Manufacturing Company with Henry R. Towne at Stamford, Connecticut, in 1868.
  - Hagley Museum and Library: Hagley Vault post on Linus Yale Sr. (Yale & Towne film clip, 2023) (https://hagley.org/node/3696)
  - ASME (American Society of Mechanical Engineers): Linus Yale, Jr. (https://www.asme.org/engineering-topics/articles/manufacturing-processing/linus-yale-jr)
  - Note: Yale Jr. died 25 Dec 1868 (ASME; Britannica kids/biography agrees on Dec 25, 1868 for 'Linus Yale' born 1821). ASME and Lemelson wrongly say the father died ~1850: the patents show Sr. alive in 1857 (US 18,169) and Hagley says 1858. Use Hagley for Sr.
- **4.9** [supported, high] Yale Sr. was alive and patenting in 1857, so claims that he died around 1850 are wrong.
  - USPTO via Google Patents: US Patent 18,169, Padlock, Linus Yale (Sr.), Newport NY, 8 Sept 1857 (https://patents.google.com/patent/US18169)
  - Hagley Museum and Library: Hagley Vault post on Linus Yale Sr. (Yale & Towne film clip, 2023) (https://hagley.org/node/3696)
  - Note: Same name on the patent could be the son, but Hagley assigns this patent run to Sr. (fourteen patents; Wikipedia list, used only to find, puts 18,169 under Sr.). Medium on attribution of this specific patent; the death date rests on Hagley. Low priority: for correcting the ASME/Lemelson error only.
- **4.10** [supported, high] Yale Sr. received US patent 3,630 on 13 June 1844 for a door lock with spring-loaded pistons (pins) that lock a rotating tumbler, described by Hagley as a pin tumbler safe lock.
  - USPTO via Google Patents: US Patent 3,630, Door-Lock, Linus Yale, 13 June 1844 (https://patents.google.com/patent/US3630)
  - Hagley Museum and Library: Hagley Vault post on Linus Yale Sr. (Yale & Towne film clip, 2023) (https://hagley.org/node/3696)
  - Note: Britannica ('In 1848 ... Linus Yale, who patented a pin tumbler lock') and Lemelson ('in the 1940s', a typo for 1840s) disagree with the patent date. Patent wins: 1844. Patent text says 'Door Locks'; Hagley says 'safe lock'. Say 'a lock with spring-loaded pins'.
- **4.11** [supported, medium] Yale Jr.'s US patent 31,278 (29 Jan 1861) covers a small lock for drawers and cupboards with spring-loaded pins, drivers and a flat key: an early small pin tumbler.
  - USPTO via Google Patents: US Patent 31,278, Lock (drawer lock), Linus Yale Jr., 29 Jan 1861 (https://patents.google.com/patent/US31278)
  - Yale UK (ASSA ABLOY; company history, marketing page): History of Yale (https://yale.co.uk/history-of-yale)
  - Note: Brief says 'flat key + cylinder' 1860s. The 1861 lock is a drawer lock whose bolt revolves; the cylinder lock proper is the 1865 patent. Patent title 'Locks for Drawers, Closets, Cupboards, &c.'.
- **4.12** [supported, high] Yale Jr.'s US patent 48,475 (27 June 1865) is the pin-lock with a cylinder and a thin steel key; NIST dates the pin tumbler cylinder to 1865.
  - USPTO via Google Patents: US Patent 48,475, Improvement in Locks, Linus Yale Jr., 27 June 1865 (https://patents.google.com/patent/US48475)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: Wikipedia (find only) lists 48,475 for 27 June 1865 too. Britannica says only '1860s'. Cleanest line: 'patented in 1865' (not 1861, not 1868). Yale Jr. then of Shelburne Falls, Massachusetts. Drawings are public domain (US government works / expired).
- **4.13** [single_source_primary, medium] Even Yale Jr.'s 1865 patent says its improvements relate partly to the security of locks against picking, and it describes notched tumblers meant to make picking harder.
  - USPTO via Google Patents: US Patent 48,475, Improvement in Locks, Linus Yale Jr., 27 June 1865 (https://patents.google.com/patent/US48475)
  - Note: Primary patent text is strong, but no second source. Nice irony beat: picking was a known problem in 1865, 14 years after Hobbs. One sentence only; attribute to the patent.
- **4.14** [supported, high] Linus Yale Jr. began as a portrait painter before turning to locks.
  - Lemelson-MIT: Linus Yale (https://lemelson.mit.edu/resources/linus-yale)
  - ASME (American Society of Mechanical Engineers): Linus Yale, Jr. (https://www.asme.org/engineering-topics/articles/manufacturing-processing/linus-yale-jr)
  - Note: Both pages also say the father died ~1850 (wrong, see 4.8). Painter fact itself agrees across both.
- **4.15** [supported, medium] Yale Sr. specialised in bank locks at his lock shop in Newport, New York; Britannica lists the Yale 'Infallible' bank lock of 1851.
  - ASME (American Society of Mechanical Engineers): Linus Yale, Jr. (https://www.asme.org/engineering-topics/articles/manufacturing-processing/linus-yale-jr)
  - Yale UK (ASSA ABLOY; company history, marketing page): History of Yale (https://yale.co.uk/history-of-yale)
  - Note: Date of the shop disagrees (1847 vs about 1840): say 'in the 1840s'. 'Infallible bank lock' is credited to Jr. in 1851 by ASME/Britannica biography; skip attributing it to Sr.

## Beat 5: 1851, the unpickable lock

- **5.1** [supported, high] Bramah's lock sat in the window of his shop at 124 Piccadilly, London, with a notice offering 200 guineas to anyone who could make an instrument to pick or open it.
  - Weale / archive.org scan (pre-1929, public domain): A. C. Hobbs, Rudimentary Treatise on the Construction of Locks, ed. C. Tomlinson, later ed (https://archive.org/details/rudimentarytreat00hobb)
  - Linda Hall Library: Scientist of the Day: Joseph Bramah (13 Apr 2022) (https://www.lindahall.org/about/news/scientist-of-the-day/joseph-bramah/)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Note: Notice wording: Tomlinson/arbitrators give 'shall receive two hundred guineas the moment it is produced'; Linda Hall gives 'Instrument', capitals. Use the Linda Hall/London form only if matching the Science Museum placard. Street number 124 appears in a collector site only (antiquebox.org), so say 'Piccadilly'.
- **5.2** [disputed, medium] The challenge lock was in the window since about 1790; sources disagree on the date: the Science Museum catalogues the padlock as made 1801-1851 and the board as 1801.
  - Linda Hall Library: Scientist of the Day: Joseph Bramah (13 Apr 2022) (https://www.lindahall.org/about/news/scientist-of-the-day/joseph-bramah/)
  - Science Museum Group: Bramah padlock and key (object 1972-290; read via WebFetch extraction) (https://collection.sciencemuseumgroup.org.uk/objects/co50473/bramah-padlock-and-key)
  - Note: Also: Churchill says the Bramah lock was 'first patented in 1785' (the patent, not the window lock); collector site antiquebox.org says 'around 1790'; the Science Museum board is dated 1801. Safe line: 'for decades' or 'since around the turn of the 19th century'. Do NOT say 61 years as a fact (Linda Hall's own counting, 1790 to 1851).
- **5.3** [supported, high] Bramah's challenge lock was not a pin tumbler. It used sliders pushed by notches in the end of a tubular key. The challenge lock had 18 sliders; ordinary Bramah locks had four to six.
  - Linda Hall Library: Scientist of the Day: Joseph Bramah (13 Apr 2022) (https://www.lindahall.org/about/news/scientist-of-the-day/joseph-bramah/)
  - Weale / archive.org scan (pre-1929, public domain): A. C. Hobbs, Rudimentary Treatise on the Construction of Locks, ed. C. Tomlinson, later ed (https://archive.org/details/rudimentarytreat00hobb)
  - Note: IMPORTANT for the heist framing: 1851 beat must not say Hobbs picked a pin tumbler. Bramah and Chubb were different mechanisms (slider; lever). The lesson is general ('no mechanical lock is unpickable'), not about pins.
- **5.4** [supported, medium] Joseph Bramah (born 1748) was an English mechanic and inventor who went into the lock business in 1784 and hired 18-year-old Henry Maudslay in 1789 to help build a lock that could not be picked.
  - Linda Hall Library: Scientist of the Day: Joseph Bramah (13 Apr 2022) (https://www.lindahall.org/about/news/scientist-of-the-day/joseph-bramah/)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Note: 1784 vs 1785: Linda Hall counts start of business; Churchill dates the patent. Say 'in the 1780s'. Maudslay later became a famed precision engineer (Linda Hall).
- **5.5** [supported, high] Alfred Charles Hobbs, born in Boston in 1812, was an American locksmith who went to London in 1851 to represent the New York firm Day & Newell at the Great Exhibition.
  - Linda Hall Library: Scientist of the Day: Alfred Charles Hobbs (W. B. Ashworth Jr., 7 Oct 2021) (https://www.lindahall.org/about/news/scientist-of-the-day/alfred-charles-hobbs/)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
- **5.6** [supported, high] The Great Exhibition ran in the Crystal Palace in Hyde Park, London, from 1 May to 11 October 1851, with more than six million visits.
  - Victoria and Albert Museum: The foundation of the V&A's Collections: the Great Exhibition of 1851 (https://www.vam.ac.uk/articles/the-great-exhibition-of-1851)
  - London Museum: What was the Great Exhibition of 1851? (https://londonmuseum.org.uk/collections/london-stories/what-was-great-exhibition-1851)
  - Note: 'Six million visits' is the museums' phrase ('visitors'); repeat visits were common, so say 'around six million visits'.
- **5.7** [supported, high] In July 1851 Hobbs opened a Chubb lock on a strongroom door in Great George Street, Westminster, in 25 minutes in front of witnesses; Chubb contested the fairness.
  - Weale / archive.org scan (pre-1929, public domain): A. C. Hobbs, Rudimentary Treatise on the Construction of Locks, ed. C. Tomlinson, later ed (https://archive.org/details/rudimentarytreat00hobb)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Note: The lock was a six-lever 'Chubb's New Patent' fitted to a strongroom door, tested by invitation, not on the Exhibition floor. Tomlinson also says Hobbs had first shown a Chubb detector lock opened 'in a few minutes' to scientific men in the Crystal Palace. Differences: 25 min (certificate) vs 'within thirty minutes' (Churchill): say 'about 25 minutes' or 'under half an hour'.
- **5.8** [supported, high] The Chubb detector lock was patented in 1818 by Jeremiah Chubb; it was built so that tampering would be detected.
  - The Chubb Archive (History of Locks Museum resources): A Brief History of Chubb 1818-1990s (https://chubbarchive.co.uk/page5)
  - Linda Hall Library: Scientist of the Day: Alfred Charles Hobbs (W. B. Ashworth Jr., 7 Oct 2021) (https://www.lindahall.org/about/news/scientist-of-the-day/alfred-charles-hobbs/)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Note: Chubb Archive also says Chubb won a 100-guinea government reward (single source: skip). Chubb brothers were from Portsea (Chubb Archive); Linda Hall calls Jeremiah 'London lock-maker': say 'Chubb'.
- **5.9** [supported, high] Hobbs began on the Bramah lock on 24 July 1851 and showed it open on 23 August; he worked on it for 16 days, in the room with it for 51 hours, with a pause in between, and the lock was undamaged.
  - Weale / archive.org scan (pre-1929, public domain): A. C. Hobbs, Rudimentary Treatise on the Construction of Locks, ed. C. Tomlinson, later ed (https://archive.org/details/rudimentarytreat00hobb)
  - Linda Hall Library: Scientist of the Day: Joseph Bramah (13 Apr 2022) (https://www.lindahall.org/about/news/scientist-of-the-day/joseph-bramah/)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Note: Safe: '51 hours of work over 16 days'. Not '51 hours straight' and not 'a month' (the calendar span is 24 July to 23 August with a break). Linda Hall says 'August'; Tomlinson gives 23 Aug for the opening and 30 Aug for the formal key test.
- **5.10** [single_source, medium] Three arbitrators supervised: George Rennie FRS of London, Professor Cowper of King's College London, and Dr Black of Kentucky. Bramah & Co. were paid out as £210 (200 guineas) to Hobbs.
  - Weale / archive.org scan (pre-1929, public domain): A. C. Hobbs, Rudimentary Treatise on the Construction of Locks, ed. C. Tomlinson, later ed (https://archive.org/details/rudimentarytreat00hobb)
  - Note: Primary period account (arbitrators' own report and Bramah's letter). Linda Hall: 'oversight committee ... paid the 200 gold coins'. £210 = 200 guineas (a guinea was 21 shillings). Fine to say 'the prize, 200 guineas'.
- **5.11** [supported, high] The outcome was disputed. Bramah & Co. protested that the arbitrators never watched Hobbs work, that the key was not tried until he finished, and that he used fixed apparatus screwed to the woodwork, which would not work on a door, so 'the spirit of the challenge' was not met.
  - Weale / archive.org scan (pre-1929, public domain): A. C. Hobbs, Rudimentary Treatise on the Construction of Locks, ed. C. Tomlinson, later ed (https://archive.org/details/rudimentarytreat00hobb)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Linda Hall Library: Scientist of the Day: Alfred Charles Hobbs (W. B. Ashworth Jr., 7 Oct 2021) (https://www.lindahall.org/about/news/scientist-of-the-day/alfred-charles-hobbs/)
  - Note: Quote from Tomlinson is neutral reporting of Bramah's letter. Churchill: 'locks picked under such conditions were not necessarily deficient for practical purposes'. This is the scandal's true shape: 'unpickable' was disproved in theory, not in the street.
- **5.12** [supported, medium] The scandal did not end the Bramah or Chubb firms: the lock had resisted 51 hours of expert effort, and sales were reportedly unaffected, even bolstered.
  - Linda Hall Library: Scientist of the Day: Alfred Charles Hobbs (W. B. Ashworth Jr., 7 Oct 2021) (https://www.lindahall.org/about/news/scientist-of-the-day/alfred-charles-hobbs/)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Note: Linda Hall gives sales unaffected as the author's judgement, not data. Say 'the firms carried on'.
- **5.13** [supported, high] Hobbs's success was called the 'Great Lock Controversy'; one newspaper said no feature of the Exhibition drew more public attention than this 'celebrated lock contest', and the press was anxious about British industry being bested by an American.
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Weale / archive.org scan (pre-1929, public domain): A. C. Hobbs, Rudimentary Treatise on the Construction of Locks, ed. C. Tomlinson, later ed (https://archive.org/details/rudimentarytreat00hobb)
- **5.14** [supported, high] Makers sold locks as 'unpickable' because buyers could not test them; public lock-picking contests turned that claim into a spectacle. Even in 1981 a US government review noted that inventors keep developing 'unpickable' locks only to find someone has found a way in.
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: Supports the thesis line: 'the only question is how long'. 'Only question is how long' is our paraphrase of Blaze/NIST (picking 'much more difficult' on better locks), not a quotation.
- **5.15** [supported, medium] Hobbs later set up his own lock-making firm in London; in 1854 a Chubb foreman, John Goater, picked one of Hobbs's locks in public and Hobbs disputed it.
  - Linda Hall Library: Scientist of the Day: Alfred Charles Hobbs (W. B. Ashworth Jr., 7 Oct 2021) (https://www.lindahall.org/about/news/scientist-of-the-day/alfred-charles-hobbs/)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Note: Hobbs's 'Protector' lock is depicted in Tomlinson fig. 47. The Churchill table says Goater was 'Chubb's foreman' and Hobbs claimed it was a cheap model.
- **5.16** [supported, medium] The 1850s contests shaped a security industry: locks became a branded product whose strength was proven in public.
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Weale / archive.org scan (pre-1929, public domain): A. C. Hobbs, Rudimentary Treatise on the Construction of Locks, ed. C. Tomlinson, later ed (https://archive.org/details/rudimentarytreat00hobb)
  - Note: The Tomlinson-linked quote actually appears in Churchill (quoting Chambers's Edinburgh Journal), not directly in the Tomlinson scan; treat as Churchill. Single-source in effect.

## Beat 6: Why pins can be beaten at all (concept only)

- **6.1** [supported, high] Picking works because real locks are not machined perfectly: it exploits small manufacturing imperfections and mechanical tolerances.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: This is the design-flaw line (conceptual). Safe wording: 'no hole is drilled exactly in line, so the pins do not all bind equally'. Neither source says 'holes off a line' verbatim: Blaze says 'small manufacturing imperfections and mechanical tolerances'; MIT: 'pins bind one at a time' (6.2).
- **6.2** [supported, medium] Because of those imperfections, the pins do not all press at once: typically one pin binds before the others, so a lock can be set pin by pin instead of all at once.
  - Theodore T. Tool (MIT hobbyist guide; used for concept only): MIT Guide to Lockpicking (Ted the Tool, 1991), archive.org copy (https://archive.org/download/FugitiveDistro_MIT_Guide_To_Lockpicking_Anonymous/MIT%20Guide%20To%20Lockpicking_READ_EN_48.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: SAFETY: concept only, on screen: an exaggerated off-line hole, one pin pressing first. No tool names, no 'apply torque and push' steps. The MIT guide is an instruction manual; the quoted sentences describe why it works, not how to do it. The NIST sentence is about one design but confirms the one-at-a-time principle.
- **6.3** [supported, high] Picking needs skill and is much harder against better-quality locks, especially those built with security features; how resistant a lock is depends on the maker's tolerances, pin lengths and key cuts and on the skill of the person.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)

## Beat 7: The answers, and how burglars actually get in

- **7.1** [supported, medium] Lock makers answer with special 'security pins' (spool and mushroom shapes) that are thinner in the middle and mislead the person trying to set them. NIST also notes mushroom pins in high-security pin tumblers.
  - Matt Blaze / University of Pennsylvania: Notes on Picking Pin Tumbler Locks (Matt Blaze, Univ. of Pennsylvania; concept sentences o (https://www.mattblaze.org/papers/notes/picking/)
  - LockLab (hobbyist): Anti-Picking Designs (BosnianBill's LockLab) (https://lock-lab.com/locklab-university/anti-picking-design/)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: No institutional (standards body or museum) source for spool pins by name; Blaze (Penn professor) is the best. Allowed on screen: one spool pin shape in cutaway. Not allowed: how a spool behaves under picking, false-set explanations.
- **7.2** [partly_single_source, medium] Other answers: tighter tolerances, more pins and more cut depths, complex keyways, side-bar designs that also require each pin to be rotated, and rotating or pick-lockout features.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: Sidebar is single-source (NIST). 'Tighter tolerances' is supported by Blaze/NIST only indirectly: NIST ties pick resistance to tolerances. Do not name brands.
- **7.3** [supported, medium] ANSI/BHMA grades (1 best, 2, 3) for hardware are mostly about durability: for example, Grade 1 cylinders must pass 40,000 operating cycles; the most significant difference between the grades is the cycle test.
  - Builders Hardware Manufacturers Association (BHMA): A156.5-2020 Cylinders and Input Devices for Locks (Hardware Highlights) (https://www.buildershardware.com/ANSI-BHMA-Standards/Hardware-Highlights/A1565-2020-Cylinders-and-Input-Devices-for-Locks)
  - Allegion (Schlage maker): Understanding BHMA grading & testing (https://dev-cs-schlage-commercial.allegion.com/content/dam/allegion-us-2/web-files/allegion/information-documents/Understanding_BHMA_Grading_and_Testing_009968.pdf)
  - Note: Page title says A156.5 'Cylinders and Input Devices for Locks' but its 'what this standard covers' sentence in the extraction mentions bored and preassembled locks, so the source page is internally inconsistent: do not quote scope sentence. A156.5 also has strength, operational and security tests (BHMA page lists them), but the grade-level security thresholds were not found in a free source. Do not state what grade 1/2/3 'test for picking'.
- **7.4** [partial, medium] Pick and drill resistance is rated separately under UL 437 (the standard for key locks); BHMA function numbers mark cylinders 'drill and pick resistant, per UL 437'.
  - Builders Hardware Manufacturers Association (BHMA): A156.5-2020 Cylinders and Input Devices for Locks (Hardware Highlights) (https://www.buildershardware.com/ANSI-BHMA-Standards/Hardware-Highlights/A1565-2020-Cylinders-and-Input-Devices-for-Locks)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: UL's own page is paywalled: the UL 437 test details (durations, number of picks) were NOT verified, and NIST's tabulation is garbled. Do not give any UL 437 test times or counts. Safe: 'a separate UL standard certifies pick and drill resistance'.
- **7.5** [supported_with_edit, medium] In Europe, EN 1303 rates cylinders with an eight-part code that covers durability, corrosion, key-related security (six grades, with minimum numbers of key differs and moving pins) and attack resistance; the best code shown is 1-6-0-B-0-C-6-D.
  - ASSA ABLOY: Standards and patent protection for mechanical cylinders (read via WebFetch extraction) (https://www.assaabloy.com/it/en/stories/blog/standards-and-patent-protection-for-mechanical-cylinders)
  - Union (ASSA ABLOY group) UK: EN 1303 (grading table; read via WebFetch extraction) (https://www.uniononline.co.uk/uk/en/help-support/standards-and-legislation/en-1303)
  - Note: Union lists the eight digits in an order that does not match ASSA's example string, so do not narrate digit by digit and do not quote a digit meaning. Both are manufacturer pages (ASSA ABLOY group, one family: counts as one source family!). Independent confirmation of the table needs the BSI/DIN standard (paywalled). Treat as medium; script may say 'a European standard rates how many distinct keys and pins a cylinder has'.
- **7.6** [single_source, medium] In 2019 US police reports show 55.7% of burglaries involved forcible entry, 37.8% unlawful entry without force and 6.5% attempted forcible entry (about 1.12 million burglaries).
  - FBI Uniform Crime Reporting Program: Crime in the United States 2019: Burglary (read via WebFetch extraction) (https://ucr.fbi.gov/crime-in-the-u.s/2019/crime-in-the-u.s.-2019/topic-pages/burglary.pdf/at_download/file)
  - Note: Country US, year 2019, police-reported. UCR 'forcible entry' includes any force (kick, pry, break glass) and gives NO share for lock picking. Cite as 'in 2019 in the US'. Page was read through the WebFetch extractor only (the FBI PDF blocks scripted download): re-open before use.
- **7.7** [supported, medium] Victim-survey data point the same way: in forcible burglaries, damaging or removing a door was the most common way in, and in 40% of unlawful entries to unoccupied homes offenders came in through an unlocked door or window; only 5% went through a locked door or window by unknown means.
  - U.S. Bureau of Justice Statistics: Victimization During Household Burglary (NCJ 227379), Sept 2010; NCVS 2003-2007 (https://bjs.ojp.gov/content/pub/ascii/vdhb.txt)
  - U.S. Bureau of Justice Statistics: Victimization During Household Burglary (NCJ 227379), Sept 2010; NCVS 2003-2007 (https://bjs.ojp.gov/content/pub/ascii/vdhb.txt)
  - UK Office for National Statistics: Overview of burglary and other household theft, England and Wales (read via WebFetch extra (https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice/articles/overviewofburglaryandotherhouseholdtheft/latest)
  - Note: BJS source family is one (report + press release). Country/year must be stated on screen: US 2003-2007 NCVS (published 2010); England and Wales to YE March 2017. NO statistic on how many burglars pick locks was found by any of the sources: do NOT say 'almost nobody picks'. Safe: 'the data record forced doors, kicked doors, unlocked doors and keys. Picking does not show up as its own category'. BJS 'unlocked' = 'no lock to beat'.
- **7.8** [interpretation, low] The 5% 'locked door or window by unknown means' is the closest official figure to 'how many get past a locked door without leaving a trace', and it includes more than picking.
  - U.S. Bureau of Justice Statistics: Victimization During Household Burglary (NCJ 227379), Sept 2010; NCVS 2003-2007 (https://bjs.ojp.gov/content/pub/ascii/vdhb.txt)
  - FBI Uniform Crime Reporting Program: Crime in the United States 2019: Burglary (read via WebFetch extraction) (https://ucr.fbi.gov/crime-in-the-u.s/2019/crime-in-the-u.s.-2019/topic-pages/burglary.pdf/at_download/file)
  - Note: This is a caution note, not a fact for the script. Different definitions: BJS 5% is of unlawful entries to unoccupied homes, so about 5% of a subset. Do not combine with FBI figures.

## Beat 8: Close

- **8.1** [supported, high] The lock buys time rather than certainty: no mechanical lock is unpickable, designs trade cost, convenience and seconds, and better locks make picking much harder.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: Both sources frame it as a compromise between cost, convenience and security. 'Buys time' is our paraphrase (not a quote).
- **8.2** [supported, high] The 1851 episode is the origin of 'no lock is unpickable': contemporaries took away that English locks, 'perfect inviolability' included, could be opened by a skilled American.
  - Weale / archive.org scan (pre-1929, public domain): A. C. Hobbs, Rudimentary Treatise on the Construction of Locks, ed. C. Tomlinson, later ed (https://archive.org/details/rudimentarytreat00hobb)
  - Oxford University Press / University of Leeds (White Rose accepted version): The Spectacle of Security: Lock-Picking Competitions and the Security Industry in Mid-Vict (https://eprints.whiterose.ac.uk/id/eprint/83078/1/Spectacles%20of%20Security.pdf)
  - Note: Keep the 'only question is how long' framing on our wording.
- **8.3** [gap, low] Scale: no sourced figure for how many pin tumbler locks exist or how many Yale makes. Skipped.
  - Matt Blaze, AT&T Labs-Research (peer-reviewed in IEEE Security & Privacy): Cryptology and Physical Security: Rights Amplification in Master-Keyed Mechanical Locks (p (https://www.mattblaze.org/papers/mk.pdf)
  - U.S. National Bureau of Standards (now NIST): High Security Locking Devices: A State-of-the-Art Report (NBSIR 81-2233, 1981/82) (https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir81-2233.pdf)
  - Note: Both sources are qualitative. The Yale company growth numbers on ASME (35 employees at start, 12,000 later) are a single, undated source: skipped. Use only 1.1 wording.

## Strongest surprises (ranked)

1. **5.3 / 5.9** The "unpickable" lock was not a pin lock at all, and the picking took Hobbs 51 hours of work over 16 days with the prize at stake: the first big proof that no lock is unpickable, and the scandal was about the rules of the test.
2. **4.1** The famous "4,000-year-old" lock is a citation error: a 1957 catalogue misread an 1883 book, Britannica repeated it, and the 1883 author doubted pharaonic Egypt had pin locks at all.
3. **3.3** A master-keyed lock accepts more keys than anyone planned: because pin stacks do not communicate, keys mixing the two working heights also open it (Blaze 2003, IEEE).
4. **4.13** Yale Jr.'s own 1865 patent already says part of the invention is security against picking, 14 years after Hobbs.
5. **1.2 / 2.6** The lock never checks the key's shape: the keyway is a crude gate, the pins only check heights, and a single wrong cut fails.
6. **7.7** In US data the common ways in are damaging a door and walking through unlocked ones (40% of unlawful entries to empty homes were through an unlocked door or window); picking is not even its own category.
7. **4.10 / 4.11** Yale Sr. patented a lock with spring-loaded pins in 1844 (not 1848 as Britannica says), and Jr.'s 1861 drawer lock already had pins, drivers and springs.
8. **5.7** Hobbs opened a Chubb lock on a strongroom door in 25 minutes in front of signed witnesses, weeks before the Bramah attempt.

## Weak or disputed

- **4.1, 4.6, 4.7** Antiquity of the pin lock: the 4,000-year figure is unfounded; Khorsabad evidence is an undated 19th-century description; the Smith College 1000/2000 BCE numbers are student-written and single-source. No source gives a firm pharaonic date.
- **5.2** Date the challenge lock went into the window: about 1790 (Linda Hall) vs 1801 (Science Museum catalogue dates). "61 years" is Linda Hall's own count.
- **4.10** Yale Sr. pin patent: 1844 (patent and Hagley) vs 1848 (Britannica) vs "1940s" (Lemelson typo). Death of Yale Sr.: 1858 (Hagley) vs c.1850 (ASME, Lemelson), contradicted by an 1857 patent.
- **2.7 / 2.8 / 2.9** Pin counts, depth counts and key-space numbers: ranges only, single or indirect sources, no product-specific figure.
- **7.3 to 7.5** Standards: BHMA grade thresholds for picking not verified; UL 437 test details not verified; EN 1303 digit mapping inconsistent between two manufacturer pages. Narrate only at the level of "separate standards exist".
- **7.1** Spool pins: no institutional source, only Blaze (UPenn), a hobbyist site and NIST for mushroom pins.
- **7.6 to 7.8** Burglary numbers: country, year and definition must be on screen; no data on picking.
- **8.3** Scale facts: none sourced.
