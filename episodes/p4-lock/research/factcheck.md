# P4 lock: independent fact check

Checked 2026-11-24 against claims.json (65 claims, 35 URLs opened). dossier.md, decisions.md, README and every script were not read.

**PASS 19 / PASS_WITH_EDIT 42 / FAIL 4**

Method: every cited URL was fetched directly (curl) or, where blocked, with WebFetch; PDFs were converted with pdftotext; the Hobbs/Tomlinson treatise was read as OCR full text from archive.org (the /details page is only a viewer shell); the Gutenberg Pitt-Rivers text was read via WebFetch and the identical mirror gutenberg.pglaf.org. Each quote was matched against the fetched text, numbers and dates were compared across sources, and independence was judged by publisher family (ASSA ABLOY group, Allegion, BJS, etc. count once; Wikipedia/LockWiki were used only to find leads and never counted).

Rules applied: numbers are allowed only where two independent sources agree, except for primary official statistics, patents and a peer-reviewed paper, which are allowed with explicit attribution (named agency/author, country, year) and flagged as single-source. Where sources disagree the claim is allowed without the number. Replacement or additional sources found by the checker are marked REPLACEMENT/ADDITIONAL in factcheck.json.

## Summary of every claim

| id | verdict | reason |
| --- | --- | --- |
| 1.1 | PASS_WITH_EDIT | 'Most common in US door locks' is NIST 1981 only; Blaze does not rank pin tumbler; date and attribute. |
| 1.2 | PASS_WITH_EDIT | 'Never reads the outline' is a metaphor; keyway wards still limit which keys enter. |
| 1.3 | PASS | All cited sources matched; independent. |
| 1.4 | PASS_WITH_EDIT | Blaze quote does not support 'standard industry practice'; dropped. NIST master-key definition fine. |
| 2.1 | PASS | All cited sources matched; independent. |
| 2.2 | PASS | All cited sources matched; independent. |
| 2.3 | PASS | All cited sources matched; independent. |
| 2.4 | PASS | All cited sources matched; independent. |
| 2.5 | PASS | All cited sources matched; independent. |
| 2.6 | PASS_WITH_EDIT | NIST also credits unusual keyways with making picking harder; 'only restricts' dropped. |
| 2.7 | PASS | All cited sources matched; independent. |
| 2.8 | PASS_WITH_EDIT | Single source (Blaze) for four to ten depths; Allegion MACS page weakly consistent (replacement noted). |
| 2.9 | PASS_WITH_EDIT | EN 1303 half rests on one publisher family; dropped. Blaze range kept, attributed. |
| 2.10 | PASS_WITH_EDIT | Blaze plus Allegion MACS page (replacement second source); locator corrected to 3.2.3. |
| 2.11 | PASS_WITH_EDIT | NIST 'start of miniaturization' too strong; keep 'much more compact' and small flat key. |
| 3.1 | PASS | All cited sources matched; independent. |
| 3.2 | PASS | All cited sources matched; independent. |
| 3.3 | PASS_WITH_EDIT | Safety: the mixed-key sentence is the attack's working principle; rewritten conceptually; single source. |
| 3.4 | PASS | All cited sources matched; independent. |
| 3.5 | PASS_WITH_EDIT | Single paper cited twice; conceptual only, no method, tools or counts; scope 'systems he tested'. |
| 4.1 | PASS_WITH_EDIT | Misreading chain is Potts's view (single source): attribute; Britannica still says 'possibly 4,000 years old'. |
| 4.2 | PASS_WITH_EDIT | Wilkinson's opinion is about the earliest KEY WITH PINS (Trajan, A.D. 90), not an 'earliest solid example'; 1883 source. |
| 4.3 | PASS_WITH_EDIT | Amheida bolt confirmed (ISAW); second source does not attest Roman bolts; Roman-era only. |
| 4.4 | PASS | All cited sources matched; independent. |
| 4.5 | PASS | All cited sources matched; independent. |
| 4.6 | PASS_WITH_EDIT | 'Excavated in the 1840s' not in sources; never call it the oldest lock; no date. |
| 4.7 | FAIL | FAIL: dates come only from a student page with no source; Potts gives no date. |
| 4.8 | PASS_WITH_EDIT | Jr. dates and Stamford 1868 confirmed (Hagley, ASME, Britannica bio); Sr.'s 1797-1858 is Hagley only and contested: dropped. |
| 4.9 | PASS_WITH_EDIT | Patent says 'Linus Yale of Newport NY', not 'Sr.'; Hagley 1858 is single; soften. |
| 4.10 | PASS_WITH_EDIT | Patent says 'Linus Yale', door lock; 'Sr.' and 'safe lock' are Hagley; Britannica's 1848 is wrong. |
| 4.11 | PASS_WITH_EDIT | Drawer-lock patent confirmed; 'flat key' not in patent; not the cylinder lock. |
| 4.12 | PASS | All cited sources matched; independent. |
| 4.13 | PASS_WITH_EDIT | Single primary source (the patent), attribute; 'notched tumblers meant to make picking harder' not stated. |
| 4.14 | PASS_WITH_EDIT | Studied portrait painting and hoped to be a portraitist; 'began as a portrait painter' overstates. |
| 4.15 | PASS_WITH_EDIT | Shop date conflicts (1847 vs about 1840): 'the 1840s'; Infallible lock belongs to Jr. |
| 5.1 | PASS_WITH_EDIT | '124 Piccadilly' is in no opened source; dropped. Notice wording differs between sources. |
| 5.2 | PASS_WITH_EDIT | Window date conflicts (1790 vs Science Museum 1801): no year; 'for decades'. |
| 5.3 | PASS_WITH_EDIT | 18 sliders confirmed twice; ordinary 4-6 sliders Linda Hall only; slider lock, not pin tumbler. |
| 5.4 | PASS_WITH_EDIT | 1784 vs 1785 conflict: '1780s'; birth year and Maudslay's age are Linda Hall only. |
| 5.5 | PASS_WITH_EDIT | 1851 and Day & Newell confirmed twice; birth year and place Linda Hall only. |
| 5.6 | PASS | All cited sources matched; independent. |
| 5.7 | PASS_WITH_EDIT | 25 minutes (witness certificate) vs Churchill 'within thirty': 'under half an hour'; Hobbs-friendly source. |
| 5.8 | PASS | All cited sources matched; independent. |
| 5.9 | PASS_WITH_EDIT | 51 hours and 16 days confirmed three ways; calendar dates single-source, dropped. |
| 5.10 | PASS_WITH_EDIT | Arbitrators' names only in the Hobbs-edited treatise (single primary); 200 guineas confirmed three ways. |
| 5.11 | PASS | All cited sources matched; independent. |
| 5.12 | PASS_WITH_EDIT | 'Sales unaffected' is Linda Hall's judgement, not data: say the firms carried on. |
| 5.13 | PASS_WITH_EDIT | 'The press was anxious' too strong: parts of the press (Churchill). |
| 5.14 | PASS_WITH_EDIT | Churchill and NIST confirmed; 'only question is how long' is script framing, not a source quote. |
| 5.15 | PASS_WITH_EDIT | Hobbs firm and Goater 1854 confirmed; outcome was disputed. |
| 5.16 | PASS_WITH_EDIT | Churchill's thesis only; second quote not in the Tomlinson text; attribute by name. |
| 6.1 | PASS_WITH_EDIT | Conceptual only; 'no hole drilled in line' wording is not sourced. |
| 6.2 | FAIL | FAIL, safety: rewrite conceptually (pin-by-pin sequence from a picking manual; NIST sentence does not support). |
| 6.3 | PASS | All cited sources matched; independent. |
| 7.1 | PASS_WITH_EDIT | 'Mislead the person trying to set them' dropped (describes defeating a picker); security pins otherwise confirmed. |
| 7.2 | PASS_WITH_EDIT | 'Tighter tolerances' only indirect; dropped. Sidebar and lockout NIST only. |
| 7.3 | PASS_WITH_EDIT | 40,000 cycles is BHMA only and product-specific: number not allowed; 'cycle test' point confirmed. |
| 7.4 | PASS | All cited sources matched; independent. |
| 7.5 | FAIL | FAIL: single publisher family (ASSA ABLOY group) and the two pages conflict on digit order. |
| 7.6 | PASS_WITH_EDIT | Single official source (FBI): attribute with country and year; 'law enforcement agencies', not 'police'. |
| 7.7 | PASS_WITH_EDIT | BJS 40% and 5% single family: attribute with years; ONS 70% ok with dates. |
| 7.8 | FAIL | FAIL: researcher's interpretation; sources say only 'locked door or window by unknown means'. |
| 8.1 | PASS_WITH_EDIT | 'No lock is unpickable' and 'buys time' are script framing, not sourced; reworded. |
| 8.2 | PASS_WITH_EDIT | 'Origin of no lock is unpickable' is a gloss; keep the 1851 shock. |
| 8.3 | PASS | All cited sources matched; independent. |

## FAIL

- **4.7**: FAIL: the only dates come from a student-written Smith College page ('probably invented around 1000 BCE, although a date of 2000 BCE has also been proposed'); no source is cited there, and Potts gives no date, only 'the archaeological evidence for early locks remains slight'. Unsupported and single-source.
  - Safe replacement or action: Do not use. If the topic comes up, say only that the evidence for early locks is slight (Potts 1990).
- **6.2**: safety: rewrite conceptually. The claim as written describes the order in which pins bind and that a lock can be set 'pin by pin'; the only support is a hobbyist picking manual (MIT guide), which is an instruction text, and the NIST sentence cited is about a magnetic pin tumbler (it does not support the claim). The conceptual statement is already covered by 6.1 and 6.3.
  - Safe replacement or action: Safe replacement: Real locks are never perfect, so the pins never all line up at exactly the same instant. That tiny imperfection is the weakness picking exploits, which is why better-made locks are much harder to pick.
- **7.5**: FAIL: single publisher family. Both pages are ASSA ABLOY group (ASSA ABLOY blog and Union UK), and they disagree on the structure: the ASSA ABLOY page gives the best code as '1-6-0-B-0-C-6-D' while the Union page defines digit 6 as corrosion (0, A, B, C), digit 7 as key security (1-6) and digit 8 as attack resistance (0-2), so 'D' and the digit order cannot both be right. Neither is the standard text (BSI/DIN previews were paywalled).
  - Safe replacement or action: Do not use. Say nothing specific about EN 1303 (no code, no grades, no differs counts) until an independent source is found.
- **7.8**: FAIL: this is the researcher's interpretation, and the sources do not support it. BJS says only 'a locked door or window by unknown means', not 'without a trace' or 'getting past a locked door'; the FBI quote cited ('37.8 percent were unlawful entries') says nothing about locks. The 5 percent is also of a subset (unoccupied homes) and covers more than picking.
  - Safe replacement or action: Do not use. Use the BJS figures in 7.7 with their own definitions only.

## PASS_WITH_EDIT: reason and safe wording

- **1.1** reason: Blaze's sentence is about mechanical locks in general and does not rank the pin tumbler. 'Most common cylinder tumbler used in U.S. door locks' is NIST 1981 only (one source, dated). Both quotes matched verbatim.
  - Safe wording: Mechanical locks guard the vast majority of homes, businesses, schools and government buildings (Matt Blaze, IEEE Security & Privacy, 2003), and a US government report from 1981 called the pin tumbler the most common cylinder design in American door locks.
- **1.2** reason: Both quotes matched (Blaze 'the bitting of a key is the secret'; MIT guide 'lifts each pin pair until the gap ... reaches the sheer line'). 'Never reads the outline' is a metaphor and ignores the keyway wards (see 2.6), so the keyway caveat is added.
  - Safe wording: A pin tumbler lock does not read the shape of the key. It only asks whether each pin stack has been lifted to the right height. Those cut depths, called the bitting, are the secret. The slot itself only decides which keys fit in at all.
- **1.4** reason: NIST glossary matched ('MASTER KEY SYSTEM ... used primarily with pin and disk tumbler locks'). The Blaze quote lists the brands tested; it does not say master keying is 'standard industry practice' (the phrase in Blaze describes the keying schemes of the systems he tested). That part is dropped.
  - Safe wording: In a master key system, one key opens many locks, and each of those locks also has its own key. Such systems are used mainly with pin tumbler and disc tumbler locks.
- **2.6** reason: MIT: 'Wards restrict the set of keys that can be inserted into the plug' matched. NIST: 'wards ... paracentric and of unique shapes in order to prevent different keys from entering the keyway and also making picking more difficult' matched (the OCR is clean, not garbled as the researcher noted). 'Only restricts which blanks go in' is dropped because NIST also credits keyways with making picking harder.
  - Safe wording: The keyway is a separate, cruder check. Ridges in the slot, called wards, decide which keys can be pushed in at all, and unusual keyway shapes make picking harder. The pins do the real checking.
- **2.8** reason: Blaze Section 2.2 matched verbatim (four to ten; better locks more pins and depths). Independent weak confirmation added by the checker: Allegion's MACS page lists Schlage bitting pairs such as '0 and 9', which implies at least ten depth values on that line. Otherwise single source (Blaze).
  - Safe wording: Lock makers pick from a small fixed menu of cut depths at each position. Depending on the model that is somewhere between about four and ten depths, and better locks use more pins and more depths.
- **2.9** reason: Blaze Section 2.1 matched verbatim. The EN 1303 half of the claim (100 to 100,000 differs) rests only on ASSA ABLOY group pages (Union), one publisher family, and the ASSA ABLOY page lists the code in a different digit order, so the standards sentence is dropped (see 7.5). Single source for the range.
  - Safe wording: Blaze estimates that a typical commercial lock has between several thousand and several million possible keys.
- **2.10** reason: Blaze Section 3.2.3 matched ('with some lock models it is not possible on a standard key to have a very high cut immediately adjacent to a very low cut', MACS). Independent confirmation found by the checker (Allegion MACS knowledge-base page). Locator in claims.json said 'Section 3 footnote'; it is 3.2.3 Practical Considerations.
  - Safe wording: Not every combination of cuts makes a legal key: many lock models forbid a very deep cut right next to a very shallow one, so the real number of keys is lower than the simple arithmetic.
- **2.11** reason: NIST 'Being much more compact than any previous lock' matched; ASME 'small cylinder lock with a pin tumbler mechanism and small flat key' matched; Yale Jr.'s 1865 patent also describes the key as 'a thin slip of steel'. NIST's 'start of miniaturization in industry' is too strong and is dropped. ASME's biography has factual errors elsewhere (father's death) but not here.
  - Safe wording: The Yale pin tumbler cylinder was much more compact than earlier locks and opened with a small flat key.
- **3.3** reason: Blaze Section 4 sentence matched verbatim, but the claim as written ('keys that mix the two working heights position by position') is the working principle of the attack he describes and is rewritten conceptually. Single source (peer-reviewed paper): attribute to Blaze.
  - Safe wording: A master-keyed lock accepts more keys than the two that were planned for it. That surprise is the starting point of Matt Blaze's 2003 research.
- **3.5** reason: Blaze Section 6 matched: 'medium- and large-scale institutional master keyed installations, including both educational and commercial environments ... Arrow (SFIC), Best (SFIC), Corbin Russwin, Schlage, and Yale' and 'the attack yielded the TMK in all cases'. Both listed sources are the same paper (one source). He also notes the systems were keyed to standard practice and that results do not make an exhaustive survey.
  - Safe wording: Blaze tested real master-keyed buildings, educational and commercial, with locks from several well-known makers, and found that a building's top master key could be worked out in principle in every system he tested. The weakness comes from how master keying works, not from one brand.
- **4.1** reason: Potts p. 187 matched verbatim (1957 catalogue by Eras, Britannica 'possibly 4,000 years old'; 'unfounded'; evidence 'remains slight'). Pitt-Rivers (via WebFetch and mirror) matched: 'It appears doubtful whether or not this pin-lock was known to the ancient Egyptians.' Current Britannica text still reads 'Possibly 4,000 years old'. The misreading chain is Potts's view (single source): attribute it.
  - Safe wording: You will often hear that the pin lock is about 4,000 years old. That figure is shaky. Britannica's lock article says its oldest example was 'possibly 4,000 years old', and archaeologist D. T. Potts argued in 1990 that this statement was unfounded and came from a misreading of Pitt-Rivers' 1883 paper. Pitt-Rivers himself thought it doubtful that the pin lock was known to the ancient Egyptians.
- **4.2** reason: Pitt-Rivers matched verbatim: 'If the pin-lock was in use in ancient Egypt it was certainly exceptional, as all the sculptures represent the doors as being fastened by simple bolts.' and 'Sir Gardner Wilkinson is of opinion that the earliest example of a key with pins ... is of the Roman period, in the reign of Trajan, A.D. 90'. The researcher's 'earliest solid example he cited' misstates this: it is Wilkinson's opinion about the earliest KEY WITH PINS, and Pitt-Rivers called Rhind's tomb find doubtful. Potts p. 187 confirms 'did not appear to antedate the Roman period'.
  - Safe wording: In 1883 the general and archaeologist Pitt-Rivers wrote that if the pin lock was used in ancient Egypt it was exceptional, because the sculptures show doors fastened by simple bolts. He reported Gardner Wilkinson's view that the earliest key with pins was Roman.
- **4.3** reason: ISAW chapter matched (bolt 18.1, 17.2 cm, three holes; 'The type of bolt used was a pin-tumbler lock'; comparisons to Douch, Karanis, Kellis). The second source, Pitt-Rivers on distribution ('Egypt to Yarkand'), does not attest Roman bolts; but Pitt-Rivers does report Wilkinson dating the earliest pinned key to the Roman period (4.2), which is consistent. Kelsey Museum/Global Egyptian Museum pages on Roman Egypt locks and keys are context only (they do not say pin tumbler).
  - Safe wording: Wooden pin-lock bolts and keys turn up in Roman-era Egypt. Excavators at Amheida in the Dakhla Oasis found a door bolt with three holes from a late Romano-Egyptian house, and compare it with finds at Douch, Karanis and Kellis.
- **4.6** reason: Potts p. 186-187 matched ('the oldest known example was found in the ruins of the palace of Khorsabad ... cannot, as we shall show, be taken at face value'; Botta found, Bonomi 1857 described). Britannica current text confirmed via WebFetch. The researcher's phrase 'excavated in the 1840s' is not stated in either source: dropped.
  - Safe wording: Britannica says the oldest known lock was found in the ruins of the palace of Khorsabad, but the evidence is a 19th-century description of a gate fastened by 'a huge wooden lock, like those still used in the East'. Specialists say that statement cannot be taken at face value, and it gives no date.
- **4.8** reason: Jr.'s dates and the 1868 Stamford company with Towne are confirmed by Hagley, ASME and, as an additional independent source, the Britannica biography (born April 4, 1821; died Dec. 25, 1868; founded the company at Stamford with Henry Robinson Towne). Sr.'s dates 1797-1858 rest on Hagley alone and are contradicted by ASME and Lemelson (father died about 1850); an 1857 Newport, NY patent in the name Linus Yale supports Hagley (see 4.9). So Sr.'s dates are dropped. Hagley says the company was 'Yale Lock Manufacturing'.
  - Safe wording: Linus Yale Jr. (1821-1868) was an American lock maker. In 1868 he founded the Yale Lock Manufacturing Company with Henry R. Towne in Stamford, Connecticut. His father, Linus Yale Sr., was also an inventor and lock maker.
- **4.9** reason: Patent 18,169 text matched: 'LINUS YALE, of Newport, in the county of Herkimer, in the State of New York ... Padlocks ... dated September 8, 1857'. The patent does not say 'Sr.'; attribution rests on place (Newport NY, the elder Yale's shop per ASME, Yale UK, Britannica) and Hagley. Hagley's death year 1858 is a single source.
  - Safe wording: Some biographies say Linus Yale Sr. died around 1850, but a patent for a padlock was issued in 1857 to 'Linus Yale, of Newport, New York', the place of the Yale lock shop, and the Hagley Museum dates his death to 1858.
- **4.10** reason: Patent text matched: 'LINUS YALE, of Springfield ... Massachusetts ... Door Locks', cylindrical pistons pressed inward by springs, priority date 1844-06-13. Hagley matched: 'On June 13, 1844, he received his eighth patent; U.S. Patent 3,630 for a pin tumbler safe lock.' The patent names only 'Linus Yale' and calls it a door lock; 'Sr.' and 'safe lock' come from Hagley. Britannica's '1848' is contradicted by the patent.
  - Safe wording: On 13 June 1844 Linus Yale, whom the Hagley Museum identifies as Yale Sr., received US patent 3,630 for a lock with spring-loaded pins that pass into a rotating tumbler.
- **4.11** reason: Patent text matched: 'LINUS YALE, Jr., of Philadelphia, Pennsylvania ... Locks for Drawers, Closets, Cupboards, &c.', 'Patented Jan. 29, 1861', pistons, drivers and springs. The patent text does not describe a flat key (it mentions 'flat ended' pins) and Yale UK only says 'Granted patents in 1861 and 1865': 'flat key' is dropped. The bolt is a revolving tumbler, so it is a forerunner, not the cylinder lock.
  - Safe wording: In January 1861 Linus Yale Jr. received US patent 31,278 for a small lock for drawers, closets and cupboards that uses spring-loaded pins and drivers.
- **4.13** reason: Patent text matched verbatim ('The improvements relate partly to the security of locks against picking, partly to methods of construction'). Single primary source (the patent): attribute to the patent. 'Notched tumblers meant to make picking harder' is not stated that way in the patent text I could read: dropped.
  - Safe wording: Even Yale Jr.'s 1865 patent says its improvements relate partly to the security of locks against picking.
- **4.14** reason: ASME ('hoping one day to become a respected portraitist') and Lemelson ('had begun serious studies in portrait painting. In 1850 he decided a career in painting wasn't for him') both matched. 'Began as a portrait painter' overstates it. Both pages share an error (father's death), but the painting fact agrees.
  - Safe wording: As a young man Linus Yale Jr. studied portrait painting and hoped to become a portrait painter, then gave it up for the family lock business.
- **4.15** reason: ASME (shop founded 1847; bank locks) and Yale UK ('about 1840 ... Yale Lock Shop in Newport, New York ... expensive, handmade bank locks') disagree on the date, so 'the 1840s'. Britannica biography confirms the father made bank locks at Newport NY about 1840 and that Jr.'s 'first achievement was the Yale Infallible Bank Lock in 1851': the Infallible lock belongs to Jr., not Sr.
  - Safe wording: Linus Yale Sr. made expensive, handmade bank locks at his lock shop in Newport, New York, from the 1840s. His son Linus Yale Jr. brought out the Yale Infallible Bank Lock in 1851.
- **5.1** reason: Hobbs/Tomlinson text: 'There had been for many years exhibited in the window of Messrs. Bramah's shop, in Piccadilly, a padlock ... a reward of two hundred guineas'; arbitrators' report gives the label ('The artist who can make an instrument that will pick or open this lock shall receive two hundred guineas the moment it is produced'). Linda Hall gives the placard as 'The Artist who can make an Instrument ... Receive 200 Guineas the Moment it is produced.' Churchill: 'Piccadilly shop window for decades ... two hundred guineas'. The street number '124' is in none of the opened sources (the only '124' in the Tomlinson text is a page number): dropped.
  - Safe wording: For decades Joseph Bramah's shop in Piccadilly, London, displayed a padlock in its window with a notice offering 200 guineas to anyone who could make an instrument to pick it.
- **5.2** reason: Linda Hall: made by 1790, stood in the window 'through Bramah's death in 1814'. Science Museum record: 'Bramah padlock and key (1801)', made 1801-1851. Churchill: 'for decades'; Tomlinson: 'for many years'. Conflicting dates, so no number.
  - Safe wording: The challenge lock sat in the window, unpicked, for decades. Sources disagree on when it was made, so no year is given.
- **5.3** reason: Linda Hall matched ('18 slots of varying depths cut into the end ... 18 sliders'; 'Most Bramah locks of this type had 4-6 sliders'). Tomlinson/Hobbs matched: 'The lock having eighteen sliders' and the key 'has notches or clefts at the end of the pipe equal in number to the slides'. The 4-6 range is Linda Hall only.
  - Safe wording: Bramah's challenge lock was not a pin tumbler. Its tubular key had 18 slots of different depths that pushed 18 sliders to the right positions. Ordinary Bramah locks had far fewer sliders.
- **5.4** reason: Linda Hall matched (born Apr. 13, 1748; business 1784; hired an 18-year-old Henry Maudslay in 1789) and Churchill matched ('first patented in 1785'). 1784 and 1785 differ (business start versus patent), so '1780s'. Birth year and Maudslay's age are Linda Hall only.
  - Safe wording: Joseph Bramah was an English mechanic and inventor who went into the lock business in the 1780s. His team, helped by the young Henry Maudslay, built a lock that could not be picked by the methods of the day.
- **5.5** reason: Linda Hall matched (born in Boston Oct. 7, 1812; 'In 1851, he went to London to represent his lock firm, Day & Newell of New York'). Churchill matched ('representative of the American lock-making firm Day & Newell'). Tomlinson's 22 July 1851 certificate calls him 'of the City of New York'. Birth year/place are Linda Hall only.
  - Safe wording: Alfred Charles Hobbs was an American locksmith who went to London in 1851 to represent the New York firm Day & Newell at the Great Exhibition.
- **5.7** reason: Tomlinson/Hobbs prints the witnesses' certificate dated 22 July 1851: 'commenced at 35 minutes past 11 o'clock a.m., and opened the lock within 25 minutes', at 34 Great George Street, Westminster, a six-tumbler lock marked 'Chubb's New Patent'. Churchill: 'widely credited with fairly picking the lock within thirty minutes, yet Chubb & Son contested this'. The two agree on 'under half an hour'; 25 is the signed figure. The Tomlinson account is Hobbs-friendly. Hobbs was only allowed to examine the keyhole; the keys were never accessible to him per the certificate.
  - Safe wording: On 22 July 1851, in front of witnesses, Hobbs opened a Chubb lock on a strongroom door in Westminster in under half an hour. Chubb's firm disputed that the test was fair.
- **5.9** reason: Tomlinson/Hobbs reprints the arbitrators' account: 'On July 24 Mr. Hobbs commenced his operations; and on August 23 Mr. Hobbs exhibited the lock opened ... the number of days occupied by Mr. Hobbs was sixteen, and the number of hours he was actually in the room with the lock was fifty-one.' Linda Hall ('51 hours of picking, spread over 16 days'), Churchill ('16 days', and the contest table 'successful after fifty-one hours') agree on both numbers. The calendar dates (24 July, 23 August) are Tomlinson only and are dropped. Linda Hall says the lock had to 'remain undamaged and workable'.
  - Safe wording: Hobbs worked on the Bramah challenge lock for 16 days in the summer of 1851 and was in the room with it for 51 hours in total. The lock was not damaged.
- **5.10** reason: Names are from the arbitrators' own report printed in Tomlinson/Hobbs ('George Rennie, Esq., F.R.S., of London; and Professor Cowper, of King's College, London; and Dr. Black, of Kentucky') and Bramah's letter ('beg to hand you the 210/. awarded by the arbitrators to Mr. Hobbs'). Neither Linda Hall nor Churchill names them (Linda Hall: 'oversight committee ... paid the 200 gold coins'). Single primary source for the names; 200 guineas is confirmed by all three. 210 pounds is 200 guineas by arithmetic.
  - Safe wording: Three arbitrators supervised the contest: the engineer George Rennie, Professor Cowper of King's College London, and Dr Black of Kentucky. They awarded Hobbs the prize of 200 guineas.
- **5.12** reason: Linda Hall ('both Bramah and Chubb lock sales were unaffected. If anything, they were bolstered') is the author's judgement, not sales data. Churchill: 'if a lock survived a trial on such generous terms, its reputation was thereby enhanced'. Say the firms 'carried on', not that sales rose.
  - Safe wording: The scandal did not end the Bramah or Chubb firms. A lock that resists 51 hours of expert work still has a reputation to sell.
- **5.13** reason: Churchill matched both ('one newspaper even asserted that no feature of the Exhibition had attracted greater public attention than this celebrated lock contest'; 'sections of the press - reluctant to admit defeat at the hands of an American'). Tomlinson/Hobbs matched: 'the remarkable year 1851 ... evidences of national failure as well as of success ... English locks ... perfect inviolability'. 'The press was anxious' is stronger than the sources: use 'parts of the press'.
  - Safe wording: Hobbs's success became known as the 'Great Lock Controversy'. One newspaper said no feature of the Exhibition drew more public attention than this 'celebrated lock contest', and parts of the British press were reluctant to admit defeat at the hands of an American.
- **5.14** reason: Churchill matched ('they had to convince potential consumers that their product was functionally effective - that the lock really was unpickable ... consumers could find no guarantee, before purchasing'). NIST 1981 matched ('inventors still spend great amounts of time in developing and getting patented ... "unpickable" locks only to find that someone else has ingeniously discovered a method of picking or decoding the same lock'). 'The only question is how long' is the script's own framing, not a sourced quotation.
  - Safe wording: Lock makers sold locks as 'unpickable' because buyers had no way to test them before buying, and public picking contests turned that claim into a spectacle. Even in 1981 a US government report noted that inventors keep patenting 'unpickable' locks only to find someone has found a way to pick or decode them.
- **5.15** reason: Linda Hall matched ('Hobbs did set up a lock-making firm in London that was quite successful'); Tomlinson mentions 'Messrs. Hobbs and Co. in their London establishment'. Churchill matched ('John Goater's much-disputed picking of a Hobbs lock in 1854'; table: Goater 'Chubb's foreman', Hobbs claimed it was 'a cheap model' whose flaw he had already disclosed).
  - Safe wording: Hobbs later set up his own lock-making firm in London. In 1854 John Goater, a foreman at Chubb's, picked one of Hobbs's locks in public, and Hobbs disputed it.
- **5.16** reason: Churchill's abstract matched ('lock-picking contests played a significant role in the commodification of security and the emergence of the security industry in the 1850s and 1860s'). The second source does not support it: the 'like a watch or a steam-engine' quote is not in the Tomlinson text (it is quoted inside Churchill from Chambers's Edinburgh Journal). Single source: attribute to Churchill by name.
  - Safe wording: Historian David Churchill argues that the lock-picking contests of the 1850s and 1860s helped turn security into a product and create the security industry.
- **6.1** reason: Blaze matched verbatim ('picking, which exploits small manufacturing imperfections and mechanical tolerances to set a lock to a keyed state without using a key'). NIST matched on tolerances ('Variations between manufacturers concerning pin lengths, hole drilling, tolerances and key cuts' affect pick resistance). Conceptual wording only.
  - Safe wording: Picking works because real locks are never machined perfectly. It exploits small manufacturing imperfections and mechanical tolerances.
- **7.1** reason: Blaze notes page matched ('The most common security pins are the "spool" and "mushroom" top pin designs, which are thinner in their mid-section'). NIST matched: MUSHROOM TUMBLER glossary ('add security against picking') and 'All of the bottom pins and some of the driver pins are of a mushroom type which increase the pick resistance' (OCR hyphen 'mush- room'). LockLab (hobbyist) matched on 'security pins'. 'Mislead the person trying to set them' is dropped: it describes how they defeat a picker.
  - Safe wording: Lock makers answer picking with special 'security pins', usually spool or mushroom shapes that are narrower in the middle, designed to resist picking. A 1981 US government report also notes mushroom pins in high-security cylinders.
- **7.2** reason: Blaze matched ('Better quality locks generally employ more pins and use more distinct cut depths on each'). NIST matched: PIN TUMBLER WITH SIDE-BAR (pins must be elevated, then rotated individually), PICKING LOCKOUT glossary entry, paracentric keyways. 'Tighter tolerances' is only indirectly supported (NIST ties pick resistance to tolerances) and is dropped. Sidebar and lockout rest on NIST alone.
  - Safe wording: Other answers include more pins and more cut depths, complex keyways, side-bar designs that also make each pin turn, and features that lock the cylinder up if picking is attempted.
- **7.3** reason: Allegion matched ('The most significant difference between the ANSI/BHMA grades is the cycle test'). BHMA's A156.5 page matched ('Grade 1 cylinders, for example, must pass a rigorous test through 40,000 cycles') but that figure is a single source and cycle counts differ by product type (other pages show 1,000,000 for Grade 1 bored locks), so the number is not allowed. The BHMA page's scope sentence is inconsistent with its title: do not quote it.
  - Safe wording: The ANSI/BHMA grades for hardware (Grade 1 best, then 2 and 3) are mostly about durability: the most significant difference between the grades is the cycle test.
- **7.6** reason: FBI UCR Burglary page matched via WebFetch ('55.7 percent of burglaries involved forcible entry', '37.8 percent were unlawful entries', '6.5 percent were attempted forcible entry', 'an estimated 1,117,696 burglaries'). The page says 'law enforcement agencies', so 'reported' not 'police reports'. Single official source (the primary dataset): numbers allowed only with 'FBI, US, 2019'. 'Forcible entry' covers any force and gives no share for lock picking.
  - Safe wording: In the US in 2019, according to the FBI, about 56 percent of reported burglaries involved forcible entry, about 38 percent were unlawful entries without force, and about 6 percent were attempted forcible entries, out of an estimated 1.1 million burglaries.
- **7.7** reason: BJS matched ('Damaging or removing a door was the most common type of entry in forcible and attempted forcible entry burglaries'; 'In 40% of unlawful entries to unoccupied residences, offenders gained access through an unlocked door or window (table 7). A smaller percentage (5%) ... through a locked door or window by unknown means'). ONS matched ('through a door around 70% of the time and through a window around 30%'; latest data year ending March 2017). The two BJS entries are one source; the 40% and 5% are BJS only, attribute them. The ONS figure covers dwellings entered, not locked doors.
  - Safe wording: In US victim surveys for 2003 to 2007, damaging or removing a door was the most common way into a home in forcible burglaries, and in 40 percent of unlawful entries to unoccupied homes the offender came in through an unlocked door or window. Only 5 percent came through a locked door or window by unknown means. In England and Wales, entry through a door happened around 70 percent of the time (data to March 2017).
- **8.1** reason: Blaze matched ('much more difficult to carry out against locks of better quality'); NIST matched ('the search continues to go on for the perfect lock - one that is economical in both cost and maintenance, that is convenient to use, easy to control and practically unpenetrable'; and the 'unpickable' passage). 'No mechanical lock is unpickable' and 'buys time' are the script's own framing, not sourced statements.
  - Safe wording: No lock is perfect: designs trade cost, convenience and security, better locks are much harder to pick, and makers have claimed 'unpickable' many times only to see someone find a way in.
- **8.2** reason: Tomlinson/Hobbs matched ('probably no one suspected before the trial, that English locks, so celebrated ... for ... perfect inviolability, would readily yield to a well-arranged system of lock-picking'); Churchill matched ('Hobbs's conquest of these two unpickable locks captivated the press'). The claim that 1851 is 'the origin of no lock is unpickable' is the researcher's gloss and is dropped.
  - Safe wording: In 1851 it shocked contemporaries that English locks, famed for 'perfect inviolability', could be opened by a skilled American.

## Do not say

- **1.1**: Do not give a percentage.
- **1.1**: Do not say 'today' or 'still' about the pin tumbler being most common: the only ranking source is from 1981.
- **1.1**: Do not extend to smart locks or to other countries.
- **1.2**: Do not say the key's outline is irrelevant: the keyway ward profile decides which keys can enter.
- **1.4**: Do not say 'standard industry practice' for master keying in general.
- **1.4**: Do not give a share of buildings that are master keyed: no source.
- **2.6**: Do not say a complex keyway adds no security.
- **2.7**: Do not say 'five or six' as sourced.
- **2.7**: Pin diameter 'less than 1/8 inch' is NIST only.
- **2.8**: Do not narrate 'ten depths' as universal.
- **2.8**: Do not name a brand's depth count.
- **2.9**: Do not quote EN 1303 differs figures.
- **2.9**: Do not compute depths^pins for a named lock; if the animation shows 5 pins x 10 depths label it 'a simple example', and note real keys have adjacent-cut limits (see 2.10) so the true count is lower.
- **2.10**: Do not give a number of excluded keys: neither source does.
- **2.11**: Do not say it started miniaturisation in industry.
- **3.3**: safety: no mixing procedure, no key-cutting detail, no counts of test keys.
- **3.3**: Do not present as a how-to.
- **3.4**: Do not state Blaze's current post (not checked).
- **3.5**: safety: do not describe the method, tools, blanks, or number of test keys.
- **3.5**: Do not say 'every master-keyed building' - only the systems he tested.
- **3.5**: Do not name the brands as flawed: it is the master-keying design.
- **4.1**: Do not say 'the oldest lock in the world is 4,000 years old'.
- **4.1**: Do not repeat ASME/Yale UK/Lemelson/Blaze 'ancient Egyptians built ... 4,000 years ago' as fact.
- **4.1**: Do not say the Egyptians did not have it: say its age is unclear.
- **4.2**: Do not give 'A.D. 90' as fact: it is Wilkinson's 19th-century opinion, single source.
- **4.2**: Do not say later discoveries cannot move the date: 1883 scholarship.
- **4.3**: Do not give a century for the house: the chapter says 'Late Romano-Egyptian' only.
- **4.3**: Do not call these 'the earliest pin locks'.
- **4.6**: Do not call it the oldest lock.
- **4.6**: Do not date the Khorsabad lock.
- **4.6**: Do not say 'excavated in the 1840s' (not in the sources).
- **4.7**: Do not use 1000 BCE or 2000 BCE.
- **4.7**: Do not cite the Metropolitan Museum bolts as pin locks.
- **4.8**: Do not give Sr.'s birth or death year.
- **4.8**: Do not say Sr. died about 1850 (ASME, Lemelson).
- **4.9**: Do not state Sr.'s death year as settled.
- **4.9**: Low priority: only needed to correct the ASME/Lemelson error.
- **4.10**: Do not say 1848 for Yale Sr.'s pin lock (Britannica) - the patent says 1844.
- **4.10**: Do not say it is the modern Yale lock: it is an earlier design.
- **4.11**: Do not call it the cylinder lock; that is the 1865 patent.
- **4.11**: Do not say it had a flat key.
- **4.12**: Say 'patented in 1865', not 'invented from scratch': the principle is much older.
- **4.13**: Do not describe how the tumblers resist picking.
- **4.13**: Do not say '14 years after Hobbs' as sourced (arithmetic only: 1865 minus 1851 is 14).
- **4.14**: Do not say he worked as a professional painter.
- **4.14**: Do not say the father died in 1850.
- **4.15**: Do not credit the Infallible lock to Sr.
- **4.15**: Do not give 1847 or 1840 as the shop date.
- **5.1**: Do not say '124 Piccadilly'.
- **5.1**: Quote the notice only with one consistent wording; the sources differ in capitals and 'receive'.
- **5.2**: Do not give a year for the lock.
- **5.2**: Do not say it 'was never picked before 1851' as measured: say it stood unpicked for decades.
- **5.3**: Do not say Hobbs picked a pin tumbler lock: Bramah's was a slider lock, Chubb's a lever lock.
- **5.3**: Do not give '4 to 6 sliders' as sourced twice.
- **5.4**: Do not give 1784 or 1785.
- **5.4**: Do not give Maudslay's age or Bramah's birth year as double-sourced.
- **5.5**: Do not give Hobbs's birth year or birthplace as double-sourced.
- **5.5**: Do not say he was at the Exhibition as an exhibitor of Bramah or Chubb locks.
- **5.7**: Do not say it was at the Exhibition: it was a strongroom door in a house in Westminster.
- **5.7**: Do not describe Hobbs's tools or technique.
- **5.8**: Do not give the day (3 February) as double-sourced.
- **5.8**: Do not repeat the 100-guinea government reward (Chubb Archive only).
- **5.9**: Do not say '51 hours straight' or 'a month'.
- **5.9**: Do not give 24 July or 23 August as double-sourced.
- **5.9**: Do not describe the tools.
- **5.10**: Do not give the arbitrators' first names or roles beyond the report.
- **5.10**: Say 'according to the arbitrators' own report'.
- **5.12**: Do not say sales went up or were unaffected as measured.
- **5.13**: Do not say the whole press was anxious.
- **5.14**: Do not attribute 'the only question is how long' to a source.
- **5.15**: Do not say Goater's 1854 picking proved Hobbs's locks were weak: the contest outcome was disputed.
- **5.16**: Do not state it as settled fact without naming Churchill.
- **6.1**: safety: show an exaggerated, labelled cartoon only; no tool names or steps.
- **6.1**: Do not say 'no hole is drilled exactly in line' as sourced; that wording is the researcher's.
- **6.2**: safety: no 'one pin binds first', no pin-by-pin sequence, no tension or lifting steps, no tool names.
- **7.1**: safety: do not explain how a spool behaves under picking or what a 'false set' is.
- **7.1**: Do not name brands.
- **7.2**: Do not name brands.
- **7.2**: Do not say 'tighter tolerances' as sourced.
- **7.3**: Do not say '40,000 cycles' (single source, product-specific).
- **7.3**: Do not say grades measure only durability: BHMA also lists strength and security tests.
- **7.4**: Do not give UL 437 test times or pick counts (NIST's 1981 table is for the 1979 edition and garbled).
- **7.4**: Do not give a current UL 437 edition.
- **7.5**: Do not quote the 8-digit code.
- **7.5**: Do not give the differs table.
- **7.5**: Do not say 'the best code is ...'.
- **7.6**: Do not say how many burglars pick locks: no source gives it.
- **7.6**: Do not drop 'US' or '2019'.
- **7.7**: Do not say 'almost nobody picks locks': no source measures it.
- **7.7**: Do not combine BJS and FBI figures.
- **7.7**: Always give country and years.
- **7.8**: Do not call 5 percent 'the picking figure'.
- **8.1**: Do not say 'every lock can be picked' as a sourced fact.
- **8.1**: Do not attribute 'buys time' to a source.
- **8.2**: Do not call 1851 the origin of the idea that no lock is unpickable.

## Safe headline facts

The 10 most surprising claims that passed, in their safe wording.

1. **[1.2 and 1.3]** A pin tumbler lock does not read the shape of the key. It only asks whether each pin stack has been lifted to the right height. Those cut depths, called the bitting, are the secret. The slot itself only decides which keys fit in at all. A key cut to the wrong depth at even one position will not open the lock.
2. **[3.5]** Blaze tested real master-keyed buildings, educational and commercial, with locks from several well-known makers, and found that a building's top master key could be worked out in principle in every system he tested. The weakness comes from how master keying works, not from one brand.
3. **[4.1]** You will often hear that the pin lock is about 4,000 years old. That figure is shaky. Britannica's lock article says its oldest example was 'possibly 4,000 years old', and archaeologist D. T. Potts argued in 1990 that this statement was unfounded and came from a misreading of Pitt-Rivers' 1883 paper. Pitt-Rivers himself thought it doubtful that the pin lock was known to the ancient Egyptians.
4. **[4.5]** Egyptian-type wooden pin locks were still in everyday use in Egypt and the Near East in the 19th and early 20th centuries.
5. **[4.10]** On 13 June 1844 Linus Yale, whom the Hagley Museum identifies as Yale Sr., received US patent 3,630 for a lock with spring-loaded pins that pass into a rotating tumbler.
6. **[4.13]** Even Yale Jr.'s 1865 patent says its improvements relate partly to the security of locks against picking.
7. **[5.7]** On 22 July 1851, in front of witnesses, Hobbs opened a Chubb lock on a strongroom door in Westminster in under half an hour. Chubb's firm disputed that the test was fair.
8. **[5.9]** Hobbs worked on the Bramah challenge lock for 16 days in the summer of 1851 and was in the room with it for 51 hours in total. The lock was not damaged.
9. **[5.11]** The result was disputed. Bramah's firm protested that the arbitrators never watched Hobbs work, that the key was not tried until he had finished, and that he used a fixed apparatus screwed to the woodwork that could not have been used on a real door, so 'the spirit of the challenge' was not met.
10. **[7.7]** In US victim surveys for 2003 to 2007, damaging or removing a door was the most common way into a home in forcible burglaries, and in 40 percent of unlawful entries to unoccupied homes the offender came in through an unlocked door or window. Only 5 percent came through a locked door or window by unknown means. In England and Wales, entry through a door happened around 70 percent of the time (data to March 2017).

## Global notes for the scriptwriter

- The 'about 4,000 years old' line must not be said as fact. The pin lock is old and wooden pin locks were in use in Egypt and the Near East into the 20th century, but the age is unclear (4.1, 4.2, 4.6, 4.7).
- Bramah's challenge lock was a slider lock and Chubb's a lever lock. The 1851 contest is not about pin tumblers; the lesson is general (5.3).
- Yale dates: Sr. patent 1844 (3,630), Jr. drawer-lock patent 1861 (31,278), Jr. cylinder patent 1865 (48,475), company 1868. Britannica's '1848' for Sr. and ASME/Lemelson's 'father died about 1850' are contradicted by primary patents (4.8 to 4.12).
- The Tomlinson/Hobbs treatise is a Hobbs-edited, partisan account. Its numbers (25 minutes, 51 hours, 16 days) are corroborated by Churchill and Linda Hall; its other details (names of arbitrators, calendar dates) are single-source.
- Safety: 6.2 fails; 3.3, 3.5, 6.1, 7.1 are rewritten conceptually. The MIT guide, the Blaze picking notes page and the LockLab page are instruction texts: cite only the single sentences listed, never their procedures. Do not show any picking tool or step.
- Blaze's 2003 paper (3.3, 3.5): conceptual only. Do not describe the method, tools or counts.
- Source errors found: ASME and Lemelson say Yale Sr. died about 1850; Lemelson says 'in the 1940s' and 'Newport, Rhode Island'; Britannica says 1848 for Sr.'s patent; the BHMA A156.5 page is internally inconsistent about scope; Union and ASSA ABLOY disagree on the EN 1303 digit order.
- Not independent (same family): ASSA ABLOY and Union (EN 1303); the two BJS items; Blaze's paper cited twice (3.4, 3.5); Linda Hall, Churchill and Tomlinson overlap on the 1851 story but are different authors.

## URLs that could not be opened directly

None unopened. Routes other than a direct fetch:
- https://www.gutenberg.org/files/44022/44022-h/44022-h.htm : curl 503; opened with WebFetch and via the mirror gutenberg.pglaf.org (same file).
- https://www.britannica.com/technology/lock-security and https://collection.sciencemuseumgroup.org.uk/... (both records): curl 403/Cloudflare; opened with WebFetch.
- https://www.uniononline.co.uk/... and https://www.assaabloy.com/it/en/stories/...: curl returned shells; opened with WebFetch.
- https://ucr.fbi.gov/.../burglary.pdf/at_download/file : curl 403; opened with WebFetch.
- https://patents.google.com/patent/US18169 : WebFetch refused (permission) and curl 503; fetched /patent/US18169A/en with curl.
- https://archive.org/details/rudimentarytreat00hobb : viewer shell; read the full OCR text at the archive.org stream URL.

Limits: UL 437, EN 1303 and ANSI A156.5 standard texts are paywalled and were not opened; Pitt-Rivers beyond the Egyptian passage was not read in full; Wikipedia and LockWiki were never used as sources.
