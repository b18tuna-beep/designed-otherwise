# Research decisions (Claude, 2026-10-27)

- 3.10 (30% flash gas, GE only): FAIL, dropped. 3.4 carries the mechanism without the number.
- 6.4 (fridges' share of household electricity, EIA only): FAIL, dropped. Beat 6 runs on 6.1, 6.2, 6.3. The 617 kWh EIA average in 6.1 is not used.
- 3.6b and the EPA Technology Transitions revision of May 2026: checked against Holland & Knight (hklaw.com, May 2026) and naturalrefrigerants.com. Neither lists household refrigerators or freezers among the changed subsectors (supermarket, remote condensing units, cold storage, residential AC/heat pumps, semiconductor, intermodal containers, lab centrifuges). The 3.6b line was later cut from the script for length anyway.
- Script length: brief said ~1,350 words for ~9 minutes (150 wpm). bm_george reads at ~174 wpm, so the script targets ~1,450 words (~8.3 min of speech, ~9 min with beat pauses).
- 2026-10-27, script v2: Michael asked whether every line is factual. Claude re-audited line by line and tightened 12 lines that were looser than the facts (main one: the fridge removes heat from the whole inside, including heat leaking in through walls and door, not only from food). New claim 3.11 (heat leaks in through walls and door) passed an independent check: factcheck-addendum.json.
