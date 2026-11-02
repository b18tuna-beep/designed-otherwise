"""Script helpers: strip source tags to narration text, report words per beat.

    python tools/script_tools.py episodes/p1-refrigerator/script/script.md episodes/p1-refrigerator/script/narration.txt
"""
import re
import sys

WPM_EST = 174  # bm_george at speed 1.0, measured on the audition paragraph


def beats(md):
    cur, out = None, []
    for line in md.splitlines():
        m = re.match(r"^## (.+)", line)
        if m:
            cur = [m.group(1), []]
            out.append(cur)
            continue
        if cur and line.strip():
            cur[1].append(re.sub(r"\s*\[[^\]]*\]\s*$", "", line).strip())
    return out


def main():
    md = open(sys.argv[1], encoding="utf-8").read()
    bs = beats(md)
    total = 0
    for name, lines in bs:
        n = sum(len(l.split()) for l in lines)
        total += n
        print(f"{n:5d} words  ~{n / WPM_EST * 60:5.0f} s  {name}")
    print(f"{total:5d} words  ~{total / WPM_EST:4.1f} min at {WPM_EST} wpm")
    untagged = [l for l in md.splitlines() if l.strip() and not l.startswith("#") and "[" not in l
                and not l.startswith(("FPI", "Every line"))]
    if untagged:
        print("LINES WITHOUT A SOURCE TAG:", *untagged, sep="\n  ")
    with open(sys.argv[2], "w", encoding="utf-8") as fh:
        fh.write("\n\n".join(" ".join(lines) for _n, lines in bs) + "\n")


if __name__ == "__main__":
    main()
