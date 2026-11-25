# P5 four-stroke engine: public-domain asset scout

Scouted 2026-11-25. Bar: US patents and government works, works published before 1929, Commons files tagged public domain. CC BY / BY-SA and unverified-licence items are **not usable**.

Totals: 13 candidates, **8 usable** (1 patent PDF + 1 patent sheet PNG, 2 books, 3 portraits, 1 NASA animation), 5 not usable or unverified.

## Access notes
- Commons API rate-limits (429): licence fields above were read from the Commons API (extmetadata) with backoff; none of the Commons images was opened as a picture. Check I1 to I3 when fetched.
- Google Patents: only sheet 4 and the first two text pages of US 194,047 have a direct PNG link on the patent page. Sheets 1 to 3 are in the PDF (P1, pages 1 to 3): rasterise in Actions (`pdftoppm -r 300 -png`). Sheet 2 (Fig. 2) is the hero engine view.
- Archive.org downloads (D1, D2) return 200 with application/pdf (34 MB each). They are scanned books: the figures must be cropped from rendered pages.
- No US-government four-stroke film was verified (V1 has no provenance, V2 not found). The NASA page animation (N1) is reference quality only.
- The Otto patent drawing is a gas engine with a layered charge ("instead of an explosion ensuing"); the caption must not call it the modern four-stroke engine (claim 7.3, 7.4).

## Usable

| ID | Beat | Item | Credit | Licence | Size |
|---|---|---|---|---|---|
| P1 | 7 | [US 194,047 (N. A. Otto, Improvement in Gas-Motor Engines, 14 Aug 1877): full patent PDF, 8 pages (pages 1-4 are drawing sheets 1-4, pages 5-8 the specification)](https://patents.google.com/patent/US194047) | USPTO via Google Patents (N. A. Otto, 1877) | Patent published 1877-08-14; Google Patents legal status "Expired - Lifetime". A US patent grant of 1877 is a pre-1929 government-published document. | PDF, 8 pages; rasterise pages 1-4 at 300 dpi in Actions |
| P2 | 7 | [US 194,047, drawing sheet 4 (Figs. 6-13, valve gear details), full size PNG](https://patents.google.com/patent/US194047) | USPTO via Google Patents (N. A. Otto, 1877) | as P1 | 2320x3408 PNG |
| D1 | 2,5 | [TM 10-570, The Internal Combustion Engine (War Department Technical Manual, 4 Feb 1941), 4-stroke diagrams, valve timing figure 53, power-stroke overlap Figs. 15-17](https://archive.org/details/TM10-570) | U.S. War Department / U.S. Government Publishing Office (1941), via Internet Archive | Internet Archive metadata licenseurl: http://creativecommons.org/publicdomain/mark/1.0/ (Public Domain Mark). Author: United States. War Department; publisher: U.S. G.P.O... | PDF scan, 34 MB |
| D2 | 5,7 | [Dugald Clerk, The Gas, Petrol and Oil Engine, vol. II: The Gas, Petrol and Oil Engine in Practice (Longmans, 1909), engravings and diagrams of Otto-cycle petrol motors, crankshaft and firing-order figures](https://archive.org/details/cu31924004083352) | Dugald Clerk and G. A. Burls, Longmans, Green and Co., 1909; scan by Cornell University Library via Internet Archive | Cornell scan front page (read in the OCR text of this item): "There are no known copyright restrictions in the United States on the use of the text." Published 1909, befo... | PDF scan, 34 MB, 880 images |
| I1 | 7 | [Portrait of Nikolaus August Otto (c. 1868), Commons File:Nikolaus August Otto.png](https://commons.wikimedia.org/wiki/File:Nikolaus_August_Otto.png) | Unknown photographer, c. 1868 (public domain), via Wikimedia Commons | Commons extmetadata LicenseShortName: "Public domain"; Date "circa 1868"; author unknown; source a Britannica page. Photograph of the 1860s by an unknown author: public d... | 1600x1200 PNG |
| I2 | 7 | [Photographic portrait of Nicolaus August Otto (1832-1891), Commons File:Fotoportraet-des-nicolaus-august-otto-1832-1891-8489.jpg](https://commons.wikimedia.org/wiki/File:Fotoportraet-des-nicolaus-august-otto-1832-1891-8489.jpg) | Unknown photographer, mid-late 19th century (public domain), via Wikimedia Commons / museum-digital Westfalen | Commons extmetadata LicenseShortName: "Public domain"; author unknown; dated "mid to late 19th century"; source: LWL museum-digital Westfalen object 8489. | 2813x3751 JPG |
| I3 | 7 | [Alphonse Beau de Rochas (photograph of a painting), Commons File:Beauderochas.jpg](https://commons.wikimedia.org/wiki/File:Beauderochas.jpg) | Painter unknown; photograph via Wikimedia Commons (public domain tag) | Commons extmetadata: "Public domain" (transferred from en.wikipedia by User:Addhoc). Description: photograph of a painting of Alphonse Beau de Rochas. | 180x248 JPG (very low) |
| N1 | 2-6 | [NASA Glenn: animated drawing of one cylinder of the Wright 1903 four-stroke engine (cylmov2.gif, 646 x 486, 3.1 MB) and its stroke stills engop1-4](https://www.grc.nasa.gov/www/K-12/airplane/engopt.html) | NASA Glenn Research Center | NASA Images and Media Usage Guidelines: "NASA content ... generally are not subject to copyright in the United States." Page notes NASA sometimes uses third-party copyrig... | 646x486 GIF |

## Not usable or unverified

| ID | Item | Why not |
|---|---|---|
| V1 | Prelinger Archives: "Elements of the Automobile, Pt II: The Engine" (archive.org 0953_Elements_Of_The_Automobile_Pt_II_The_Engine) | Probably an old educational film, but the producer and date are not recorded: cannot call it a US government work or pre-1929. NOT usable until provenance is found. |
| V2 | US government engine footage (Army, Navy, NASA, NARA training films) | Not found. The Army 1941 technical manual (D1) is the government visual we did verify. A NARA catalogue or Library of Congress search is the next place to look; it needs a session with those hosts allowed. |
| X1 | Otto four-stroke test engine, 1876 (Commons File:Viertactversuchsmotor von Otto.jpg) | The 1876 drawing itself is old, but the file is licensed CC BY-SA and taken from a copyrighted book. Not usable under the repo rule (PD, CC0 or properly licensed). Redraw in 2D. |
| X2 | Otto and Langen atmospheric engine of 1867 (Commons File:Enginy Otto-langen 1867.jpg) and File:Atmospharische Gaskraftsmaschine von Otto Nr.1.jpg | CC BY-SA. Not usable. |
| X3 | Museum photographs of Otto engines (Commons: Atmosphärischer Ottomotor.jpg, Otto & Langen.jpg, Otto A engine.jpg) | Attribution licences: outside the repo's PD / CC0 / licensed-with-record rule, same as P4. Not usable. |

## Notes per usable item

- **P1**: The Otto patent drawing the brief asks for. Sheet 2 (Fig. 2) is the full engine in side elevation with flywheel; sheet 1 Fig. 1 is the cylinder section; sheet 4 has valve-gear details. Opened and rendered in this session: pages 1-4 are drawings, 5-8 text. The drawing is a gas engine with a layered charge, not a modern-looking four-stroke: caption it "Otto, 1877 patent", and do not present it as the modern cycle.
- **P2**: Direct PNG (2320 x 3408, 1-bit) opened in this session. Sheets 1-3 have no direct PNG link on the Google page: take them from P1.
- **D1**: The best US-government visual find: 1940s technical-manual line drawings of the four events (Fig. 4 intake onward), compression ratio (Fig. 7), the four-cylinder (Fig. 15) and six-cylinder (Fig. 16) power overlap charts and valve timing (Fig. 53, named in the text). The text of the same manual is cited in claims.json as TM 10-570. Figure numbers come from the OCR text: confirm each when rasterised. PDF headers returned 200 (34 MB).
- **D2**: Pre-1929 engravings and indicator diagrams of early petrol engines; firing-order and crankshaft figures (fig. 295 and following, four-cylinder section; the text discusses figs. 300-303). Also the text source for claims 5.4, 7.1, 7.2 and 7.6. Figure pages not individually checked: find the Otto-engine and crankshaft plates by searching the OCR when fetched.
- **I1**: Portrait for the "who were they" beat. 1600 x 1200. Licence read from the Commons API this session; the image itself was not opened (check what it shows when fetched).
- **I2**: Higher resolution alternative to I1 (2813 x 3751). Licence read from the Commons API; the photographer is unknown so the PD basis is age (Otto died 1891), not an author death date. Image itself not opened.
- **I3**: Only portrait found. 180 x 248 px: too small for a full-frame shot; use as a small inset or redraw in 2D from it. The painting date and painter are not stated, so the PD tag rests on Commons only: weakest licence of the usable set. Do not use it if the fact check wants a stronger basis.
- **N1**: Reference only (low resolution, 1903 engine, NASA colour code differs from ours): useful to check our own Blender cutaway animation, not as a final shot. GIF downloaded and checked in this session.
