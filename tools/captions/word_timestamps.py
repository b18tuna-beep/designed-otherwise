"""Word-level timestamps with faster-whisper, plus a script-vs-transcript word check.

    python tools/captions/word_timestamps.py <audio> <script.txt> <out.json>

Writes {"words": [{"w", "start", "end", "p"}...], "check": {...}}.
Exit code 2 if any script word is missing from the transcript (in order),
which is how mispronounced or dropped words are caught before a human hears them.
"""
import difflib
import json
import re
import sys

MODEL = "small.en"


def norm(s):
    s = s.lower().replace("’", "'")
    return re.findall(r"[a-z0-9']+", s)


def transcribe(audio, prompt=None):
    from faster_whisper import WhisperModel
    model = WhisperModel(MODEL, device="cpu", compute_type="int8")
    segs, _info = model.transcribe(audio, word_timestamps=True, beam_size=5,
                                   initial_prompt=prompt, vad_filter=False)
    words = []
    for s in segs:
        for w in s.words:
            words.append({"w": w.word.strip(), "start": round(w.start, 3),
                          "end": round(w.end, 3), "p": round(w.probability, 3)})
    return words


NUMBER_WORDS = set(
    "a and point percent zero one two three four five six seven eight nine ten eleven twelve thirteen "
    "fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy "
    "eighty ninety hundred thousand million seventies eighties nineties minus".split())
HOMOPHONES = {("grille", "grill"), ("g e", "ge"), ("centimetres", "centimeters"), ("meltwater", "melt water")}


def numeric_only(script_toks, heard_toks):
    """Whisper writes spoken numbers as digits; '120' for 'a hundred and twenty' is not an error."""
    return (script_toks and heard_toks
            and all(t in NUMBER_WORDS for t in script_toks)
            and all(re.fullmatch(r"\d+s?|percent", t) for t in heard_toks))


def check(script_text, words):
    want = norm(script_text)
    got = norm(" ".join(w["w"] for w in words))
    sm = difflib.SequenceMatcher(a=want, b=got, autojunk=False)
    problems = []
    for op, a0, a1, b0, b1 in sm.get_opcodes():
        if op == "equal":
            continue
        s_t, h_t = want[a0:a1], got[b0:b1]
        if numeric_only(s_t, h_t) or (" ".join(s_t), " ".join(h_t)) in HOMOPHONES:
            continue
        problems.append({"op": op, "script": " ".join(s_t), "heard": " ".join(h_t)})
    low = [w for w in words if w["p"] < 0.5]
    return {"script_words": len(want), "heard_words": len(got),
            "match_ratio": round(sm.ratio(), 4), "mismatches": problems,
            "low_confidence": low}


def main():
    audio, script_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
    script_text = open(script_path, encoding="utf-8").read()
    # No prompt on purpose: a prompt would bias whisper toward the script and hide mispronunciations.
    words = transcribe(audio)
    result = {"words": words, "check": check(script_text, words)}
    json.dump(result, open(out, "w"), indent=1)
    c = result["check"]
    print(f"{audio}: {c['heard_words']}/{c['script_words']} words, ratio {c['match_ratio']}, "
          f"{len(c['mismatches'])} mismatches, {len(c['low_confidence'])} low-confidence")
    for m in c["mismatches"]:
        print(f"  {m['op']}: script '{m['script']}' heard '{m['heard']}'")
    sys.exit(2 if c["mismatches"] else 0)


if __name__ == "__main__":
    main()
