# P4 lock: public-domain asset scout

Scouted 2026-11-24. Bar: US patents and government works, works published before 1929, Met Open Access (public domain), Commons files tagged public domain. CC BY / BY-SA, non-commercial, and unverified-licence items are **not usable**.

Totals: 29 candidates, **23 usable** (7 patent sheets, 6 book leaves, 7 Commons files, 3 Met images), 6 not usable or unverified.

## Access notes
- Commons API rate-limits (429): fetch with backoff in Actions. Licence fields above were read from the Commons API (extmetadata) in this session.
- Google Patents drawing PNG URLs were taken from the patent pages' HTML. `fetch_assets.py` kind=page with a `pick` finds them.
- Book leaves: archive.org page-image URLs `/download/rudimentarytreat00hobb/page/nNN_w1400.jpg`. Leaf n89 was opened and shows p. 76, fig. 35. Other leaf numbers (n87, n94, n69, n102, n113) come from the OCR object index in the same item, which aligned for n89: confirm each when fetched. The whole page comes back: crop the figure.
- Met images are direct `images.metmuseum.org` URLs from the Met API; none were opened as pictures, so check M1 to M3 for what they show.
- Not found: a free photo of an ancient Egyptian wooden pin lock with a clear PD/CC0 tag. Use the Met bolts/Damascus lock with careful captions, or draw it in 2D.

## Usable

| ID | Beat | Item | Credit | Licence | Size |
|---|---|---|---|---|---|
| P1 | 4 | [US 3,630 (Linus Yale Sr., 13 June 1844) drawings, sheet 1](https://patents.google.com/patent/US3630) | USPTO via Google Patents (Linus Yale, 1844) | Patent published 1844; legal status 'Expired - Lifetime' on Google Patents. US patent text | PNG, drawing sheet |
| P2 | 4 | [US 3,630 drawings, sheet 2](https://patents.google.com/patent/US3630) | USPTO via Google Patents | as P1 |  |
| P3 | 4 | [US 31,278 (Linus Yale Jr., 29 Jan 1861) drawings, sheet 1](https://patents.google.com/patent/US31278) | USPTO via Google Patents (Linus Yale Jr., 1861) | Patent published 1861; expired (Google Patents). |  |
| P4 | 4 | [US 31,278 drawings, sheet 2](https://patents.google.com/patent/US31278) | USPTO via Google Patents | as P3 |  |
| P5 | 4 | [US 48,475 (Linus Yale Jr., 27 June 1865) drawings, sheet 1](https://patents.google.com/patent/US48475) | USPTO via Google Patents (Linus Yale Jr., 1865) | Patent published 1865; expired (Google Patents). |  |
| P6 | 4 | [US 48,475 (Linus Yale Jr., 27 June 1865) drawings, sheet 2](https://patents.google.com/patent/US48475) | USPTO via Google Patents (Linus Yale Jr., 1865) | Patent published 1865; expired (Google Patents). |  |
| P7 | 4 | [US 48,475 (Linus Yale Jr., 27 June 1865) drawings, sheet 3](https://patents.google.com/patent/US48475) | USPTO via Google Patents (Linus Yale Jr., 1865) | Patent published 1865; expired (Google Patents). |  |
| T1 | 5 | [Tomlinson/Hobbs, Construction of Locks: Fig. 35 'Exterior of a Bramah lock' (p. 76; viewed: leaf n89 confirmed](https://archive.org/details/rudimentarytreat00hobb) | A. C. Hobbs / C. Tomlinson, Construction of Locks (Weale's series), via Internet Archive | Wood-engraved figure in a book first published 1853 (this edition's preface dated April 18 | 1387x2296 JPG (w1400 derivative) |
| T2 | 5 | [Tomlinson/Hobbs, Construction of Locks: Fig. 34 'Diagram to illustrate the Bramah lock' (p. 74)](https://archive.org/details/rudimentarytreat00hobb) | A. C. Hobbs / C. Tomlinson, Construction of Locks (Weale's series), via Internet Archive | Wood-engraved figure in a book first published 1853 (this edition's preface dated April 18 | 1387x2296 JPG (w1400 derivative) |
| T3 | 5 | [Tomlinson/Hobbs, Construction of Locks: Fig. 39 'Section of the Bramah cylinder' (p. 81)](https://archive.org/details/rudimentarytreat00hobb) | A. C. Hobbs / C. Tomlinson, Construction of Locks (Weale's series), via Internet Archive | Wood-engraved figure in a book first published 1853 (this edition's preface dated April 18 | 1387x2296 JPG (w1400 derivative) |
| T4 | 5 | [Tomlinson/Hobbs, Construction of Locks: Fig. 31 'Chubb lock, with detector and six tumblers' (p. 56)](https://archive.org/details/rudimentarytreat00hobb) | A. C. Hobbs / C. Tomlinson, Construction of Locks (Weale's series), via Internet Archive | Wood-engraved figure in a book first published 1853 (this edition's preface dated April 18 | 1387x2296 JPG (w1400 derivative) |
| T5 | 5 | [Tomlinson/Hobbs, Construction of Locks: Fig. 40 'The American Parautoptic lock; bolt unshot' (Day & Newell)](https://archive.org/details/rudimentarytreat00hobb) | A. C. Hobbs / C. Tomlinson, Construction of Locks (Weale's series), via Internet Archive | Wood-engraved figure in a book first published 1853 (this edition's preface dated April 18 | 1387x2296 JPG (w1400 derivative) |
| T6 | 5 | [Tomlinson/Hobbs, Construction of Locks: Fig. 47 'Hobbs's Protector Lock'](https://archive.org/details/rudimentarytreat00hobb) | A. C. Hobbs / C. Tomlinson, Construction of Locks (Weale's series), via Internet Archive | Wood-engraved figure in a book first published 1853 (this edition's preface dated April 18 | 1387x2296 JPG (w1400 derivative) |
| C1 | 5 | [File:Bramah lock, Otto's Encyclopedia.jpg](https://commons.wikimedia.org/wiki/File:Bramah_lock,_Otto's_Encyclopedia.jpg) | Ottuv slovnik naucny vol. 27 (1908) | Public domain (Commons licence field 'Public domain'); source Ottuv slovnik naucny, Prague | 1862x1204 |
| C2 | 5 | [File:Miscellany - Mr. Bramah's patent lock ; Mr. Rowntree's patent lock - (...) del. ; Lowry scul. LCCN2006691](https://commons.wikimedia.org/wiki/File:Miscellany_-_Mr._Bramah's_patent_lock_;_Mr._Rowntree's_patent_lock_-_(...)_del._;_Lowry_scul._LCCN2006691762.jpg) | Wilson Lowry, engraver; Abraham Rees (1814); Library of Congress | Public domain (Commons licence field); engraved 1814 by Wilson Lowry for Rees's Cyclopaedi | 3291x4096 |
| C3 | 5 | [File:The great industrial exhibition of 1851. Plate 3. The British nave LCCN2003665158.jpg](https://commons.wikimedia.org/wiki/File:The_great_industrial_exhibition_of_1851._Plate_3._The_British_nave_LCCN2003665158.jpg) | Library of Congress (1852 print) | Public domain (Commons licence field); print 1852, Library of Congress Popular Graphic Art | 9790x7767 |
| C4 | 5 | [File:Moving Machinery - Dickinson's comprehensive pictures of the Great Exhibition (1854) vol 2, plate XXI - R](https://commons.wikimedia.org/wiki/File:Moving_Machinery_-_Dickinson's_comprehensive_pictures_of_the_Great_Exhibition_(1854)_vol_2,_plate_XXI_-_Royal_Coll.jpg) | Louis Haghe / Dickinson (1854) | Public domain (Commons licence field); Louis Haghe, 1854, Royal Collection Trust | 1848x1113 |
| C5 | 5 | [File:Chubb detector.jpg](https://commons.wikimedia.org/wiki/File:Chubb_detector.jpg) | KillingForCulture (Wikimedia Commons) | Public domain (Commons licence field; self-released by uploader KillingForCulture); photo  | 820x530 |
| C6 | 4 | [File:Linus Yale Jr., portrait.jpg](https://commons.wikimedia.org/wiki/File:Linus_Yale_Jr.,_portrait.jpg) | Yale Genealogy (1908) | Public domain (Commons licence field); from Yale Genealogy book, 1908 | 350x449 |
| C7 | 4 | [File:Linus Yale Sr., father of Linus Yale Jr., founders of the Yale Lock Company.png](https://commons.wikimedia.org/wiki/File:Linus_Yale_Sr.,_father_of_Linus_Yale_Jr.,_founders_of_the_Yale_Lock_Company.png) | Yale Genealogy (1908), photograph before 1858 | Public domain (Commons licence field); unknown author, before 1858 | 500x653 |
| M1 | 4 | [The Met, Door Bolt, ca. 721-664 BCE or later, wood, Thebes (Met 28.3.136)](https://www.metmuseum.org/art/collection/search/553795) | The Metropolitan Museum of Art (Open Access) | Met Open Access: isPublicDomain true in the Met API and 'Public Domain' on the page ('avai |  |
| M2 | 4 | [The Met, Door Bolt, ca. 721-664 BCE or later, soft wood (Met 28.3.134)](https://www.metmuseum.org/art/collection/search/553794) | The Metropolitan Museum of Art (Open Access) | Met Open Access: isPublicDomain true in the Met API and 'Public Domain' on the page ('avai |  |
| M3 | 4 | [The Met, Lock or Thumbler or Pin, 16th-19th century, carved inlaid wood, attributed to Damascus (Met 10.100.17](https://www.metmuseum.org/art/collection/search/446006) | The Metropolitan Museum of Art (Open Access) | Met Open Access: isPublicDomain true in the Met API and 'Public Domain' on the page ('avai |  |

## Not usable or unverified

- **P8** US 32,331 (Yale Jr., 1861) bank lock drawings: Not a pin tumbler (bank lock with levers/keys); would confuse beat 4. Skip.
- **C8** File:Bramah challenge lock.JPG: Modern photo under CC BY-SA: not allowed under the channel's PD/CC0 bar.
- **M4** The Met, Key, 305-30 BCE, iron, Ptolemaic Period (Met): Ptolemaic iron key: type unchecked (not necessarily for a pin lock). Low value.
- **X1** Science Museum Group object photos (Bramah padlock 1972-290, challenge board 1972-291, Egyptian lock: Licence unverified, likely non-commercial: do not use.
- **X2** Alfred Hobbs portrait (1886) referred to by Linda Hall as 'Wikimedia commons': No licence checked: find at fetch time or use text card.
- **X3** Hobbs and Great Exhibition illustrations in the Official Descriptive and Illustrated Catalogue (1851: Candidate only: needs a leaf search at fetch time. Chubb detector exhibit and Koh-i-Noor case appear in vol. 2 per Linda Hall.
