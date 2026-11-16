# P3 trees: public-domain asset scout

Scouted 2026-11-16. Every item was opened with WebFetch unless noted, and licence wording is quoted from the page. `assets.json` has the same IDs with fuller notes and direct URLs. `fetch_list.json` lists the 29 usable stills for the Actions download step.
Licensing bar: US federal works, LoC "no known restrictions", or works published before 1929. CC BY / BY-SA, non-commercial, "educational use", contractor or unknown-photographer items count as **not usable**.

Totals: 62 items, **42 usable** (31 stills incl. one source book, 11 video), 20 not usable or maybe.

## Access notes
- commons.wikimedia.org could not be fetched (the permission request timed out). Commons files were read on mirrors (download.osmand.net, wiki.riteme.site). Some mirrors drop the licence template, so for R6, R7 and H1 **re-check the Commons tag in the fetch step** (expected: PD-USGov-NPS for R6/R7, PD-old/PD-Art for H1).
- These URLs were blocked by permission timeouts and not read: npgallery AssetDetail d83c9958 and edfb1c90 (sources of R6/R7), commons.wikimedia.org File:Magdeburg.jpg and File:Magdeburger_Halbkugeln.jpg, osmand File:Baro_1.png (Flammarion 1923 barometer), archive.org structureofwoods00gerrrich, nasa.gov media guidelines, science.nasa.gov PIA20717, collections.nlm.nih.gov catalog page for H3.
- loc.gov item pages returned client errors (as in P2), so no LoC items made the list.
- NPS redwood B-roll: the clip pages carry the NPS-wide line "Multimedia made available by NPS should not be presumed to be public domain", but the park's B-roll index says "You can download and freely use this HD footage for any media project", and every clip is credited "NPS: <name>". Treated as usable.
- DVIDS (W5, W6): no image URL showed in the fetched text, so the `pick` is just the DVIDS ID. If the fetch fails, look for the cloudfront link on the page.

## Usable, by beat

Michael's standing note applies: never open on a photo. Beat 1 photos and clips go after the animated hook and sting.

| Beat | ID | Item | Credit | Licence (quoted) | Res / length |
| --- | --- | --- | --- | --- | --- |
| 1, 7 | V1 | [Redwood Trunk: slow tilt up a 300 ft redwood](https://www.nps.gov/media/video/view.htm?id=F2A4BB60-A45E-4EEC-90F74BD73067803E) | NPS: G Litten | "You can download and freely use this HD footage for any media project." | 720p, 1:37 |
| 1, 2 | V3 | [Creek to Canopy: pan from creek to treetop](https://www.nps.gov/media/video/view.htm?id=F087D99A-A318-2DAF-174262B1B4AB228E) | NPS: G Litten | same | 720p, 0:37 |
| 1, 8 | V6 | [Redwood Groves](https://www.nps.gov/media/video/view.htm?id=DE96C05B-ABAD-08F8-9FBB4E3168B63587) | Liam Carey-Rand, NPS | same | 720p, 0:58 |
| 1, 7 | R1 | [Looking up through the redwoods, 2015](https://npgallery.nps.gov/AssetDetail/fbcf44ce-0a69-45cc-9987-62dbf7724677) | NPS, Redwood NSP | "Public domain" | 2048x1356 |
| 1, 5 | R2 | [Sun beaming through foggy redwoods, 2015](https://npgallery.nps.gov/AssetDetail/14fbe861-f031-42aa-8d83-a31d7d408acc) | NPS, Redwood NSP | "Public domain" | 1360x1020 |
| 1, 5, 8 | R8 | [Sequoia grove at sunrise](https://www.usgs.gov/media/images/sequoia-grove-sunrise) | J. McFarland, USGS | "Public Domain." | n/s |
| 1, 7, 8 | R3, R4, R5 | Commons REDW9345 / REDW2151 / REDW9343 | NPS Digital Image Archives | "All photographs and images in this archive ... are public domain images." | ~2048x3072 (check what each shows) |
| 2 | H1 | [Magdeburg hemispheres plate, Guericke 1672](https://commons.wikimedia.org/wiki/File:Magdeburg.jpg) | Guericke, *Experimenta nova* | PD by date (tag to re-check) | 4196x3381 |
| 2 | H2 | Commons Magdeburg hemispheres (Fotothek crop) | Guericke | "Public domain" | 727x671 |
| 2 | H3 | [NLM: Guericke 1672, atmospheric pressure globes](https://collections.nlm.nih.gov/dc/nlm:nlmuid-101435294-img) | NLM | "The National Library of Medicine believes this item to be in the public domain" | TIFF |
| 2 | H4 | [NLM: Boyle's air pump, 1777](https://digirepo.nlm.nih.gov/catalog/nlm:nlmuid-101436390-img) | NLM | same | TIFF |
| 2 | H5 | [Smithsonian: *Experimenta nova* title page](https://library.si.edu/image-gallery/105454) | SIL-76-15313 | "No Copyright - United States" | n/s |
| 3 | W5, W6 | [USFS maple sap lines, Green Mountain NF](https://www.dvidshub.net/image/9603124/twin-maple-sugarbush-operation) | Forest Service photo by Briana Shepherd | "PUBLIC DOMAIN" | 5184x3456 |
| 3 | W7 | [Water droplets on a leaf](https://www.usgs.gov/media/11982) | USGS | CC0 1.0 | n/s (not guttation, so don't caption it as guttation) |
| 4, 6 | M1 | [Marshall Ward, *The Oak* (1892) fig. 16: wood elements, vessels, tracheids](https://commons.wikimedia.org/wiki/File:The_Oak_(Marshall_Ward)_Fig_16.jpg) | H. Marshall Ward | "free of known restrictions"; PD Mark | 1450x2000 |
| 4, 5 | V5 | [Redwood Trunk - Close Up](https://www.nps.gov/media/video/view.htm?id=F4618936-A6B7-F0A0-3DD82D1579EE21C1) | NPS: G Litten | park B-roll grant | 720p, 0:32 |
| 4 | M5 | [ARS: leaf sample into SEM](https://www.ars.usda.gov/oc/images/photos/dec00/k9162-1/) | Peggy Greb, ARS | "copyright-free, public domain" | 300 dpi |
| 5 | M4 | [ARS: measuring peach leaf stomatal conductance](https://www.ars.usda.gov/oc/images/photos/nov12/d2683-1/) | Peggy Greb, ARS | same | 300 dpi |
| 5, 8 | W3 | [USGS sap flow sensors on a trunk](https://www.usgs.gov/media/images/sap-flow-sensors-blackwater-national-wildlife-preserve) | USGS EESC | "Public Domain." | n/s |
| 5, 8 | W4 | [USGS sap probe install](https://www.usgs.gov/media/images/sap-probe-install) | USGS EESC | "Public Domain." | n/s |
| 5 | V2 | [Fog in Redwood Trees](https://www.nps.gov/media/video/view.htm?id=DF2E96F7-C3A9-2CAE-A9ACBB156616B570) | NPS: Liam Carey-Rand | park B-roll grant | 720p, 0:23 |
| 5 | V4 | [Sun in Redwood Canopy](https://www.nps.gov/media/video/view.htm?id=8C7A8FCB-A1F3-787A-8521EC1B84BBA0FA) | NPS: G Litten | park B-roll grant | 720p, 1:07 |
| 5 | M2, M3 | USGS stomata diagram, transpiration poster | USGS | "Public Domain." | reference for our own animation |
| 5 | H6 | [Dixon 1914, *Transpiration and the Ascent of Sap in Plants* (BHL)](https://biodiversitylibrary.org/bibliography/44194) | H. H. Dixon | PD by date (1914) | page scans; figures still to pick |
| 6 | W1 | [Dead and dying pines, Sequoia NF (2016)](https://www.jpl.nasa.gov/news/nasa-maps-california-drought-effects-on-sierra-trees/) | "USDA Forest Service" | federal work | n/s |
| 6, 7 | W2 | [Giant sequoia foliage dieback in drought, 2014](https://www.usgs.gov/media/images/giant-sequoia-foliage-dieback-during-californias-extreme-drought) | USGS photo by N. Stephenson | "Public Domain." | n/s |
| 6 | V9 | [Firefighters in Redwood Canyon after KNP Complex](https://npgallery.nps.gov/AssetDetail/8c3e1034-170b-4ebc-b3bf-ac4da0d5cff0) | NPS/Joe Suarez | "Public domain:Full Granting Rights" | 4K, 0:26 (fire, optional) |
| 6, 8 | W8 | [USFS "Monitoring giants" photos](https://fs.usda.gov/about-agency/features/monitoring-giants) | USDA Forest Service photo by Jamie Hinrichs | federal work | 320 px shown (fire, optional) |
| 7, 8 | V11 | [NASA SVS: GEDI Forest Height](https://svs.gsfc.nasa.gov/4950) | NASA's Scientific Visualization Studio | credit SVS (NASA guidelines to confirm) | 1080p/4K |
| 8 | V12 | [NASA SVS: USFS/GEDI old growth](https://svs.gsfc.nasa.gov/5095) | NASA SVS | same | 1080p/4K |
| 8 | V7, V8 | [Revelation Trail](https://www.nps.gov/media/video/view.htm?id=F3FC6727-BE91-6A3E-9186A2B2BB8370E8), [Redwood Tree](https://www.nps.gov/media/video/view.htm?id=EFE6A42C-BE08-9DC4-6DD87ABB4DAE3BDF) | NPS: G Litten | park B-roll grant | 720p, 1:21 / 1:04 |
| 8 | R6 | Commons: man on horseback before a giant sequoia | NPS staff | NPS staff (tag to re-check) | 2048x3072 |
| 8 | R7 | Commons: Giant Forest, Crescent Meadow | NPS staff | same | 2048x3072 |
| 8 | R9 | [Two USGS techs measuring one sequoia](https://www.usgs.gov/media/images/it-takes-two-measure-giant-sequoia) | Elizabeth MacDougal, USGS | "Public Domain." | n/s |
| 8 | R10 | [USGS: checking giant sequoias](https://www.usgs.gov/media/images/giant-sequoias) | USGS | "Public Domain." | n/s |
| 8 | R11 | [Watkins: men and a hollow sequoia, Mariposa Grove](https://www.usgs.gov/media/images/a-photo-some-men-and-a-sequoia-mariposa-grove) | Watkins' Pacific Coast Series (19th c.) | PD by date | small |
| 8 | R12 | Commons *Big Trees of California* (Southern Pacific 1913) | Southern Pacific | "No known copyright restrictions"; 1913 | 3166x4588 |

Videos are not in `fetch_list.json`. Direct MP4 URLs are in `assets.json` (`direct_url`).

## Not usable or maybe (reasons)

| ID | Item | Reason |
| --- | --- | --- |
| R13 | [Crowds at the General Sherman Tree](https://npgallery.nps.gov/AssetDetail/095e134c-e47b-4bad-a80c-eaadcf2eeedd) | Marked "Public domain:Full Granting Rights" but credited to a named individual, Rebecca Paterson, with no NPS affiliation. Maybe. Best people-for-scale shot found. |
| R14-R17, R19 | SEKI Historic Images (General Sherman in snow, Ranger School group, photographing General Sherman, winter Giant Forest, sequoia sections) | NPS marks them "Public domain", but photographers are unknown or named without affiliation (Jack Hickey, Hank Jones, Sam Pusateri). Maybe. |
| R18 | Overgrown sequoia stump | Unknown photographer, off-topic. |
| R20 | [Visitors at Muir Woods](https://npgallery.nps.gov/AssetDetail/90bca2e3-f83d-c411-2bf5-06c1904808e8) | Park archive item, creator and date unknown. Maybe. |
| R21 | [Muir Woods Image Gallery](https://www.nps.gov/goga/learn/photosmultimedia/muir-woods-images.htm) | "any legitimate non-commercial public or press use": non-commercial only. |
| R22 | [Scientist climbs giant sequoia](https://www.usgs.gov/media/images/scientist-climbs-giant-sequoia) | "Photo credit: A. Ambrose, UC Berkeley": not federal. |
| H7 | [Figuier 1867: Galileo and the Florentine pumps](https://www.lindahall.org/about/news/scientist-of-the-day/evangelista-torricelli) | The perfect beat-2 image, but this copy is under Linda Hall's "All Rights Reserved" footer. Find a Gallica or Internet Archive scan of Figuier's *Merveilles de la science* (1867). |
| H8 | [Caltech Experimenta Nova](https://digital.archives.caltech.edu/collections/Images/RB-OG1672-1) | "accessible for purposes of education and research". |
| H9 | Wellcome Torricelli engraving V0005861 | Wellcome Commons uploads are CC BY 4.0 (not opened). |
| H10 | [Royal Society "Two botanists"](https://pictures.royalsociety.org/image-rs-18734) | "©The Royal Society". No PD Dixon or Joly portrait found. |
| H11 | Commons Tracheiden Picea abies (bordered pits) | CC BY-SA. Fine as a modelling reference for the Blender pits. |
| M6 | ARS Cryptosporidium in a spinach stoma | Licence fine; wrong subject (pathogen). |
| M7 | ARS Puccinia infection tube | Off-topic; photographer affiliation unclear. |
| M8 | [EurekAlert Arabidopsis stomata](https://www.eurekalert.org/multimedia/862058) | "Licensed content", Nature. |
| W9 | AVIRIS tree-health map | "NASA/JPL-Caltech/USDA Forest Service": check JPL image policy. Our own map is better anyway. |
| V10 | [SEKI clips by Midpines Media](https://npgallery.nps.gov/AssetDetail/df10493d-6d5d-4caa-84b4-973a6f966ed1) | "Steven Bumgardner of Midpines Media for the National Park Service": contractor. NPS marks it "Public domain", so this is a decision for Michael, not a clear yes. |

## Gaps
- No PD stomata or xylem SEM micrograph that is clearly federal turned up. Plan the leaf, stomata and pit shots as our own 3D/2D (the README already does). M1 (*The Oak*, 1892) and the Dixon 1914 figures give a period look.
- No clean pre-1929 Torricelli tube or suction-pump engraving was confirmed (Figuier 1867 and Flammarion 1923 exist; scans need a PD host). H1 covers air pressure.
- No guttation, dendrometer or Scholander pressure chamber photo with a clean licence.
