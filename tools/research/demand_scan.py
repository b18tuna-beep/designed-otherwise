"""Demand scan for the video idea catalogue (runs in Actions; Claude's workspace can't reach YouTube).

1. YouTube autocomplete expansion over question prefixes ("how does a", "why do", ...) x a-z.
   Autocomplete ranks reflect what people actually search on YouTube.
2. Subjects pulled out of "how does X work" style suggestions, scored by how often and how high they appear.
3. For the top subjects (plus any --extra topics), the YouTube search results page for
   "how does <subject> work": top videos' titles, views, age and channel, as a demand/competition read.

    python tools/research/demand_scan.py <out_dir> [--top 250] [--extra extra.txt]
Writes autocomplete.json, subjects.csv, serp.json.
"""
import csv
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9"}
PREFIXES = [
    "how does ", "how does a ", "how does an ", "how does the ", "how do ", "how do you ", "how do the ",
    "why does ", "why do ", "why is ", "why are ", "what happens when ", "how does it ",
    "how does your body ", "how does the human ", "how does your brain ", "how do animals ", "how do birds ",
    "how do plants ", "how do trees ", "how does money ", "how does the internet ", "how does a city ",
    "how do cities ", "how do ships ", "how do planes ", "how do trains ", "how does weather ",
    "how do they make ", "how are ", "how is ", "how do they build ", "how does the sun ", "how does the ocean ",
    "why does the ", "why do we ", "how does a car ", "how do cars ", "how does a phone ", "how does a computer ",
    "how does electricity ", "how does water ",
]
LETTERS = [""] + list("abcdefghijklmnopqrstuvwxyz")


def get(url, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001
            if i == tries - 1:
                print("fail", url[:120], e, file=sys.stderr)
                return None
            time.sleep(2 + 3 * i)


def autocomplete(q):
    t = get("https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&hl=en&gl=us&q="
            + urllib.parse.quote(q))
    if not t:
        return []
    j = json.loads(t[t.index("(") + 1: t.rindex(")")])
    return [x[0] for x in j[1]]


SUBJ = re.compile(r"^how (?:does|do|do the|do you|does the|does a|does an|does your|does it)?\s*(.+?)\s+"
                  r"(?:actually |really )?work(?:s|ing)?\b")


def subjects(ac):
    best = {}
    for q, arr in ac.items():
        for i, s in enumerate(arr):
            b = best.setdefault(s, {"r": 99, "n": 0})
            b["r"] = min(b["r"], i)
            b["n"] += 1
    out = {}
    for s, b in best.items():
        m = SUBJ.match(s)
        if not m:
            continue
        x = re.sub(r"^(a|an|the|your|my) ", "", m.group(1).strip().lower())
        if not x or len(x) > 50:
            continue
        o = out.setdefault(x, {"appearances": 0, "best_rank": 99, "examples": []})
        o["appearances"] += b["n"]
        o["best_rank"] = min(o["best_rank"], b["r"])
        if len(o["examples"]) < 3:
            o["examples"].append(s)
    return out


def views(txt):
    if not txt:
        return None
    m = re.match(r"([\d.,]+)\s*([KMB]?)", txt.replace(",", ""))
    if not m:
        return None
    n = float(m.group(1))
    return int(n * {"": 1, "K": 1e3, "M": 1e6, "B": 1e9}[m.group(2)])


def serp(q):
    html = get("https://www.youtube.com/results?hl=en&gl=US&search_query=" + urllib.parse.quote(q))
    if not html:
        return None
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html) or re.search(r"ytInitialData\"\] = (\{.*?\});", html)
    if not m:
        return {"error": "no ytInitialData"}
    data = json.loads(m.group(1))
    vids = []

    def walk(o):
        if isinstance(o, dict):
            if "videoRenderer" in o:
                v = o["videoRenderer"]
                title = "".join(r.get("text", "") for r in v.get("title", {}).get("runs", []))
                vc = v.get("viewCountText", {}).get("simpleText") or "".join(
                    r.get("text", "") for r in v.get("viewCountText", {}).get("runs", []))
                vids.append({
                    "id": v.get("videoId"), "title": title,
                    "views": views(vc.replace(" views", "").replace(" view", "")) if vc else None,
                    "age": v.get("publishedTimeText", {}).get("simpleText"),
                    "length": v.get("lengthText", {}).get("simpleText"),
                    "channel": "".join(r.get("text", "") for r in v.get("ownerText", {}).get("runs", [])),
                })
                return
            for x in o.values():
                walk(x)
        elif isinstance(o, list):
            for x in o:
                walk(x)
    walk(data)
    return {"videos": vids[:12]}


def main():
    out = sys.argv[1]
    top = int(sys.argv[sys.argv.index("--top") + 1]) if "--top" in sys.argv else 250
    extra = []
    if "--extra" in sys.argv:
        extra = [l.strip() for l in open(sys.argv[sys.argv.index("--extra") + 1]) if l.strip() and not l.startswith("#")]
    os.makedirs(out, exist_ok=True)

    ac = {}
    for p in (PREFIXES if top > 0 else []):
        for l in LETTERS:
            ac[p + l] = autocomplete(p + l)
            time.sleep(0.15)
    json.dump(ac, open(os.path.join(out, "autocomplete.json"), "w"), indent=0)
    print("autocomplete queries", len(ac), "suggestions", len({s for v in ac.values() for s in v}))

    if top == 0 and os.environ.get("SUBJECTS_FROM"):
        ac = json.load(open(os.environ["SUBJECTS_FROM"]))
    subj = subjects(ac)
    rows = sorted(subj.items(), key=lambda kv: (-kv[1]["appearances"], kv[1]["best_rank"]))
    with open(os.path.join(out, "subjects.csv"), "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["subject", "appearances", "best_rank", "examples"])
        for k, v in rows:
            w.writerow([k, v["appearances"], v["best_rank"], " | ".join(v["examples"])])
    print("subjects", len(rows))

    head = [k for k, _ in rows[:top]]
    targets = head + [e for e in extra if e.lower() not in head]   # extras always get a read
    res = {}
    for i, s in enumerate(targets):
        q = s if s.startswith(("how ", "why ", "what ")) else f"how does {s} work"
        res[s] = {"query": q, **(serp(q) or {"error": "fetch failed"})}
        time.sleep(1.0)
        if i % 25 == 0:
            print("serp", i, "/", len(targets))
    json.dump(res, open(os.path.join(out, "serp.json"), "w"), indent=1)
    ok = sum(1 for v in res.values() if v.get("videos"))
    print("serp done", len(res), "with videos", ok)


if __name__ == "__main__":
    main()
