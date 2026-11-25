# P4 research decisions (2026-11-24, overnight, unattended)

Dated notes on what was dropped, softened or decided without asking.

## 2026-11-24 changes to the brief's framing
- **Dropped "4,000-year-old idea" as a fact.** Potts (1990) traces Britannica's "possibly 4,000 years old" to a misreading of Pitt-Rivers (1883); Pitt-Rivers doubted pharaonic pin locks. Replaced with "old design, attested in Roman-era Egypt, still used in the 20th century" (claims 4.1 to 4.7). Beats 4 and 8 of the README need rewording by the script writer. Also noted: ASME, Lemelson, Yale UK and Blaze all repeat the "ancient Egypt / 4,000 years" line. The Smith College "1000 BCE (or 2000)" is student-written and was not used.
- **Khorsabad softened.** The only evidence is a 19th-century excavation description ("a huge wooden lock, like those still used in the East"); not called oldest, not dated.
- **Bramah and Chubb are not pin tumblers.** Kept the 1851 beat but added claim 5.3 so the script does not say "the pin lock was picked in 1851".
- **Hobbs's time restated** as "51 hours of work over 16 days, 24 July to 23 August". Not "51 hours straight".
- **"Since 1790"** kept as "around 1790 / for decades". Science Museum catalogue dates the padlock 1801-1851 and the board 1801. "61 years" not used.
- **"Five or six pins"** not sourced: NIST says five, Blaze four to seven. Depth counts and key-space numbers kept as ranges. No product-specific key count (no usable source for Schlage/Kwikset specs: only forum and shop pages came up).
- **Yale dates.** Sr.'s pin patent is 3,630 of 13 June 1844 (Britannica's 1848 and Lemelson's "1940s" rejected). Jr.'s cylinder lock is 48,475 of 27 June 1865. I first expected patent 64,447 for a Yale 1867 cylinder patent: wrong, it is an unrelated wrench-bar patent, so it was not used. Jr.'s 1868 patents were not verified, so none are claimed. ASME and Lemelson say the father died c.1850: contradicted by Hagley (1858) and an 1857 patent.
- **No picking statistic.** FBI 2019, BJS 2003-2007 and ONS record forcible, unlawful (no force), unlocked and door/window entry, not picking. The script must not say how often burglars pick. UK data: ONS gives door about 70% / window about 30% for England and Wales over the decade to 2017 only.
- **UL 437, A156.5 pick thresholds, EN 1303 digit meanings not stated.** UL and BSI texts are paywalled. EN 1303 digits are inconsistent between two manufacturer pages (both ASSA ABLOY family, so one source family). The script may say separate standards rate pick/drill resistance, durability cycles (Grade 1 cylinder: 40,000 cycles) and key differs.
- **Scale facts dropped.** No sourced figure for how many pin tumbler locks or Yale locks exist. Company-growth numbers on ASME (35 employees at start) are single, undated.
- **Hobbs's technique and the Blaze attack are not described anywhere.** Tomlinson's account includes technical detail about wax impressions and instruments; not copied. The Blaze attack method and counts are not copied; claim 3.5 is conceptual only. MIT Guide and Blaze's picking notes were opened for concept sentences only (claims 6.2 and 7.1): the safety line of the brief governs. Quotes from them are limited to why the defect exists, never steps, tools or amounts.
- **Spool pins:** no institutional source, so claim 7.1 uses Blaze (UPenn), a hobbyist site and NIST (mushroom). On screen, show a spool pin shape only; no behaviour under picking.

## Source handling decisions
- Wikipedia and LockWiki were used to find sources and patent numbers, never as one of the two. Patent numbers from Wikipedia's lists were checked against Google Patents texts (3,630; 31,278; 32,331; 48,475; 18,169; 8,071; 15,031).
- Two archive.org identifiers (Hobbs/Tomlinson book, MIT Guide copy) came from archive.org's search API and a web search result respectively; the Tomlinson edition is labelled 1853 on archive.org but contains a preface dated April 1868.
- Same-family rule: Blaze 2003 and Blaze's notes count as one family; BJS report and press release one; ASSA ABLOY and Union one; BHMA and Allegion treated as two (different publishers) though Allegion is a BHMA member.
- Claims left with fewer than two independent sources are marked `single_source` in `status`, with a note: 2.8, 2.10, 3.3 (Blaze only, peer-reviewed), 4.13 (patent text only), 5.10 (the arbitrators' own report), 7.6 (FBI). They may be used only as the note says or dropped at the fact check.
- Claim 3.4 lists two entries from the same author's paper (title page and bibliographic record); treat as one source family.

## Gaps
- No firm pharaonic-era date for any pin lock.
- No second source for pin-depth counts, MACS, sidebars, or the FBI split.
- No usable photograph of an ancient Egyptian pin lock with PD/CC0 licence (Met door bolts are not described as pin-lock bolts).
- No Hobbs portrait with a checked licence; Great Exhibition catalogue leaves not located.
