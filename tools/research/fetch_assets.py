"""Fetch public-domain visual assets for an episode (runs in Actions; the workspace can't reach these sites).

    python tools/research/fetch_assets.py <list.json> <out_dir>

list.json: [{"name": "p1_newborn_screen", "kind": "page", "url": "<page with the image>", "pick": "media.defense.gov"},
            {"name": "gray919_ossicles", "kind": "commons", "title": "File:Gray919.png"}]
kind "page":    downloads the page, takes the largest-looking image link containing `pick` (or og:image)
kind "commons": asks the Wikimedia Commons API for the original file URL and its licence metadata
Writes each image as <name>.<ext> plus licenses.json (source page, file URL, licence fields as published).
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request

UA = {"User-Agent": "DesignedOtherwiseAssetFetch/1.0 (educational YouTube channel; public-domain assets only)"}


def get(url, binary=False):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        data = r.read()
        return data if binary else data.decode("utf-8", "replace")


def from_page(item):
    html = get(item["url"])
    pick = item.get("pick")
    links = re.findall(r'(?:href|src|content)="([^"]+\.(?:jpe?g|png|gif|tiff?))"', html, flags=re.I)
    links = [urllib.parse.urljoin(item["url"], l) for l in links]
    if pick:
        links = [l for l in links if pick in l]
    if not links:
        m = re.search(r'property="og:image"\s+content="([^"]+)"', html)
        links = [m.group(1)] if m else []
    if not links:
        raise SystemExit(f"no image found on {item['url']}")
    # defense.gov: the original is the -1/-1/0 variant; otherwise prefer the longest URL (usually the full size)
    best = sorted(set(links), key=lambda l: ("/-1/-1/0/" in l, "large" in l.lower(), len(l)), reverse=True)[0]
    rights = re.findall(r"(public domain[^<]{0,160}|cleared for release[^<]{0,80})", html, flags=re.I)[:3]
    return best, {"rights_text_on_page": rights}


def from_commons(item):
    q = urllib.parse.urlencode({"action": "query", "titles": item["title"], "prop": "imageinfo",
                                "iiprop": "url|extmetadata", "format": "json"})
    d = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))
    page = next(iter(d["query"]["pages"].values()))
    info = page["imageinfo"][0]
    meta = {k: info["extmetadata"].get(k, {}).get("value") for k in ("LicenseShortName", "UsageTerms", "Artist", "Credit", "DateTimeOriginal")}
    return info["url"], meta


def main():
    items = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    log = []
    for it in items:
        try:
            url, meta = from_commons(it) if it["kind"] == "commons" else from_page(it)
            ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower() or ".jpg"
            path = os.path.join(out, it["name"] + ext)
            open(path, "wb").write(get(url, binary=True))
            log.append({"name": it["name"], "file": os.path.basename(path), "source": it.get("url") or it.get("title"),
                        "file_url": url, "bytes": os.path.getsize(path), **meta})
            print("ok", it["name"], url)
        except Exception as e:  # noqa: BLE001
            log.append({"name": it["name"], "error": str(e)})
            print("FAIL", it["name"], e)
    json.dump(log, open(os.path.join(out, "licenses.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
