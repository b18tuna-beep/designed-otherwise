"""THE HINGE: Designed Otherwise intro sting (3.2 s, 96 frames at 30 fps).

Storyboard: docs in tools/intro/README.md (from the ChatGPT brief Michael approved 2026-11-02).
F0-8    an ordinary appliance box traces in (chalk)
F9-26   the hidden mechanism reveals inside it: power in (lime), working loop (violet), heat out (orange arrow)
F27-44  schematic shrinks to 58% and fades behind the chalk frame, which traces then fills; door closed
F45-62  the blue door swings open on its hinge, orange revealed by a flat mask, violet threshold last 6 frames
F63-71  wordmark reveals through one horizontal mask
F72-95  static hold. Cut at F96.

    python tools/intro/hinge.py <out_dir> [--format wide|vertical-end]
One intro for every video (Michael 2026-11-02): nothing in it is episode-specific.
Writes PNG frames f0000.png.. and still.png (F72) into out_dir.
"""
import json
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont
from shapely.affinity import scale as sscale, translate
from shapely.geometry import LineString, Polygon, box
from shapely.ops import unary_union

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "brand"))
import mark as M  # noqa: E402

T = json.load(open(os.path.join(ROOT, "style", "tokens.json")))["color"]
FONTS = os.path.join(ROOT, "style", "fonts")
SS = 2  # supersampling


def rgb(h, a=255):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def ease_out_cubic(t):
    return 1 - (1 - t) ** 3


def ease_out_quart(t):
    return 1 - (1 - t) ** 4


def ease_in_out(t):
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def prog(f, a, b, ease=lambda t: t):
    """0..1 progress of frame f through [a, b) (b exclusive)."""
    if f < a:
        return 0.0
    if f >= b - 1:
        return 1.0
    return ease((f - a + 1) / (b - a))


# ---------------------------------------------------------------- mark geometry (source units)
def mark_parts():
    S = M.S
    frame = M.rounded(M.para(218, 460, 252, 428, S))
    orange = M.rounded(M.para(439, 665, 330, 420, S))
    door = M.rounded(M.para(334, 572, 240, 332, -S))
    split = 439
    thr = Polygon([(split - 400, 558 - S * 400), (900, 558 + S * (900 - split)), (900, 2000), (split - 400, 2000)])
    left = Polygon([(split, 558), (split + 600, 558 - S * 600), (2000, -2000), (2000, 2000),
                    (split - 600, 558 + S * 600 + 2000), (split - 600, 558 + S * 600)])
    right = box(split, -2000, 3000, 3000)
    blue = door.intersection(right).difference(thr)
    violet = door.intersection(thr).intersection(left)
    hole = door.intersection(frame).difference(right).difference(violet)
    chalk = frame.difference(hole)
    return dict(S=S, split=split, frame=frame, frame_outline=M.para(218, 460, 252, 428, S), orange=orange,
                door=door, blue=blue, violet=violet, hole=hole, chalk=chalk, right=right)


class Space:
    """Source mark units -> output pixels (supersampled)."""

    def __init__(self, parts, box_w, box_h, cx, cy):
        allg = unary_union([parts["orange"], parts["chalk"], parts["blue"], parts["violet"]])
        minx, miny, maxx, maxy = allg.bounds
        self.k = min(box_w / (maxx - minx), box_h / (maxy - miny)) * SS
        self.ox, self.oy = (minx + maxx) / 2, (miny + maxy) / 2
        self.cx, self.cy = cx * SS, cy * SS

    def g(self, geom):
        return translate(sscale(translate(geom, -self.ox, -self.oy), self.k, self.k, origin=(0, 0)), self.cx, self.cy)

    def x(self, v):
        return (v - self.ox) * self.k + self.cx


def fill(d, geom, color):
    for p in getattr(geom, "geoms", [geom]):
        if p.is_empty or p.geom_type != "Polygon":
            continue
        d.polygon([tuple(c) for c in p.exterior.coords], fill=color)
        for ring in p.interiors:
            d.polygon([tuple(c) for c in ring.coords], fill=rgb(T["bg"]))


def stroke(d, pts, color, w, frac=1.0):
    """Draw the first `frac` of a polyline with round caps and joins."""
    if frac <= 0 or len(pts) < 2:
        return
    line = LineString(pts)
    L = line.length * frac
    out, acc = [pts[0]], 0.0
    for a, b in zip(pts, pts[1:]):
        seg = math.dist(a, b)
        if acc + seg >= L:
            t = (L - acc) / seg if seg else 0
            out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
            break
        out.append(b)
        acc += seg
    d.line(out, fill=color, width=int(w), joint="curve")
    r = w / 2
    for (x, y) in (out[0], out[-1]):
        d.ellipse([x - r, y - r, x + r, y + r], fill=color)


def arrow(d, p0, p1, color, w):
    """Heat arrow: shaft plus filled triangle head (2.75x line weight)."""
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    hl = w * 2.75
    base = (p1[0] - hl * math.cos(ang), p1[1] - hl * math.sin(ang))
    stroke(d, [p0, base], color, w)
    nx, ny = -math.sin(ang), math.cos(ang)
    d.polygon([p1, (base[0] + nx * hl * 0.6, base[1] + ny * hl * 0.6), (base[0] - nx * hl * 0.6, base[1] - ny * hl * 0.6)],
              fill=color)


def with_alpha(c, a):
    return c[:3] + (int(255 * max(0, min(1, a))),)


def rounded_rect(x0, y0, W, H, r):
    """Closed rounded-rectangle path starting at the top-left straight edge (for path tracing)."""
    pts = []
    for (ax, ay, a0) in ((x0 + W - r, y0 + r, 270), (x0 + W - r, y0 + H - r, 0), (x0 + r, y0 + H - r, 90), (x0 + r, y0 + r, 180)):
        for k in range(0, 91, 10):
            t = math.radians(a0 + k)
            pts.append((ax + r * math.cos(t), ay + r * math.sin(t)))
    return [(x0 + r, y0)] + pts + [(x0 + r, y0)]


# ---------------------------------------------------------------- the ordinary machine (same in every video)
def machine(layer_draw, f, cx, cy, s, alpha):
    """A plain appliance box. Hidden inside: what is true of every machine on this channel.
    Electricity in (lime), the working mechanism (violet loop), heat out (one orange arrow).
    No cold: cold is not a property of every machine. Same drawing in every video."""
    d = layer_draw
    W, H = 250 * s, 210 * s
    x0, y0 = cx - W / 2, cy - H / 2
    lw = 4 * SS * max(s, 0.6)
    chalk = with_alpha(rgb(T["chalk"]), alpha)
    trace = prog(f, 0, 9, ease_out_cubic)
    r = 16 * s
    cab = rounded_rect(x0, y0, W, H, r)
    reveal = prog(f, 9, 27, ease_in_out)
    if reveal > 0:
        a = alpha
        # power in: lime feed from outside the box to the mechanism
        feed = [(x0 - 70 * s, y0 + H * 0.62), (x0 + W * 0.22, y0 + H * 0.62)]
        stroke(d, feed, with_alpha(rgb(T["electric"]), a), lw, frac=min(1, reveal / 0.35))
        # the mechanism: a closed violet working loop
        if reveal > 0.3:
            lx0, lx1, ly0, ly1 = x0 + W * 0.22, x0 + W * 0.74, y0 + H * 0.26, y0 + H * 0.76
            rr = 26 * s
            loop = [(lx0, ly1 - 0.38 * (ly1 - ly0))]
            for (ax, ay, a0) in ((lx0 + rr, ly0 + rr, 180), (lx1 - rr, ly0 + rr, 270), (lx1 - rr, ly1 - rr, 0), (lx0 + rr, ly1 - rr, 90)):
                for k in range(0, 91, 10):
                    t = math.radians(a0 + k)
                    loop.append((ax + rr * math.cos(t), ay + rr * math.sin(t)))
            loop.append(loop[0])
            stroke(d, loop, with_alpha(rgb(T["refrigerant"]), a), lw * 1.25, frac=(reveal - 0.3) / 0.7)
        # heat out: the only arrow
        ha = prog(f, 20, 27, ease_out_cubic)
        if ha > 0:
            sx = x0 + W + 12 * s
            arrow(d, (sx, y0 + H * 0.5), (sx + 72 * s * ha + 1, y0 + H * 0.5), with_alpha(rgb(T["heat"]), a), lw * 1.5)
    stroke(d, cab, chalk, lw, frac=trace)
    if trace >= 1:
        # an everyday control panel strip and two knobs: reads as "an appliance", not a specific one
        stroke(d, [(x0, y0 + H * 0.16), (x0 + W, y0 + H * 0.16)], chalk, lw * 0.75)
        for kx in (0.70, 0.84):
            rr = 6 * s
            d.ellipse([x0 + W * kx - rr, y0 + H * 0.08 - rr, x0 + W * kx + rr, y0 + H * 0.08 + rr], outline=chalk, width=int(lw * 0.75))


# ---------------------------------------------------------------- door interpolation
def door_at(P, p):
    """Door polygon at opening progress p (0 = closed over the doorway, 1 = approved open position).
    The hinge is the split line; the free edge sweeps from the doorway's left edge to the door's right edge."""
    S, sp = P["S"], P["split"]
    h = 332
    top_l, top_r = 240, 240 + S * (572 - 334)          # free-edge tops: closed (x=334) and open (x=572)
    hinge_top = 240 + S * (sp - 334)
    xf = 334 + (572 - 334) * p
    yt = top_l + (top_r - top_l) * p
    quad = Polygon([(sp, hinge_top), (xf, yt), (xf, yt + h), (sp, hinge_top + h)]) if abs(xf - sp) > 0.5 else None
    if quad is None or not quad.is_valid:
        return None
    rq = quad.buffer(-M.R, join_style="mitre").buffer(M.R, resolution=24) if abs(xf - sp) > 2 * M.R + 2 else quad
    band = box(min(sp, xf), -2000, max(sp, xf), 3000).intersection(box(sp - 20, -2000, sp + 20, 3000))
    return unary_union([rq, quad.intersection(band)])


# ---------------------------------------------------------------- frame renderer
def lockup(vertical=False):
    """Final layout: mark box ~176x188, wordmark 72 px stacked, 36 px gap, group optically centered."""
    fm = ImageFont.truetype(os.path.join(FONTS, "Archivo-SemiCondensed-Medium.ttf"), 72 * SS)
    fs = ImageFont.truetype(os.path.join(FONTS, "Archivo-SemiCondensed-SemiBold.ttf"), 72 * SS)
    tr = 0.08 * 72 * SS
    tmp = ImageDraw.Draw(Image.new("RGB", (10, 10)))

    def tlen(t, f):
        return sum(tmp.textlength(c, font=f) for c in t) + tr * (len(t) - 1)
    ww = max(tlen("DESIGNED", fm), tlen("OTHERWISE", fs)) / SS
    W, H = (1080, 1920) if vertical else (1920, 1080)
    if vertical:
        # stacked lockup for the Shorts end card: mark above, wordmark centered under it
        mark_c = (W / 2, H / 2 - 120)
        text_x = None
        text_y = H / 2 + 20
    else:
        group = 176 + 36 + ww
        left = (W - group) / 2
        mark_c = (left + 88, H / 2)
        text_x = left + 176 + 36
        text_y = H / 2 - 81 / 2 - 36
    return dict(W=W, H=H, mark_c=mark_c, text_x=text_x, text_y=text_y, fm=fm, fs=fs, tr=tr, ww=ww, tlen=tlen)


def draw_text(d, x, y, text, f, fill, tr):
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + tr


def render(f, P, vertical=False, end_card=False):
    L = lockup(vertical)
    W, H = L["W"], L["H"]
    img = Image.new("RGBA", (W * SS, H * SS), rgb(T["bg"]))
    sp = Space(P, 176, 188, *L["mark_c"])

    if end_card:
        # 60-frame end card: mark nearly assembled, door completes its opening F12-23, wordmark holds F24-59
        pd = 0.72 + 0.28 * prog(f, 12, 24, ease_out_quart)
        fd = {"door": pd, "orange": pd, "violet": prog(f, 18, 24), "text": prog(f, 18, 24, ease_out_cubic),
              "frame": 1.0, "grid": 0.0, "schem": None}
    else:
        fd = {"door": prog(f, 45, 63, ease_out_quart), "orange": prog(f, 45, 63, ease_out_quart),
              "violet": prog(f, 57, 63, ease_out_cubic), "text": prog(f, 63, 72, ease_out_cubic),
              "frame": prog(f, 27, 45, ease_out_cubic), "grid": 1 - prog(f, 40, 63, ease_in_out), "schem": f}

    d = ImageDraw.Draw(img, "RGBA")
    # faint drafting grid at the start; gone by the door opening
    if fd["grid"] > 0:
        g = with_alpha(rgb(T["grid"]), 0.55 * fd["grid"])
        step = 60 * SS
        for x in range(0, W * SS, step):
            d.line([(x, 0), (x, H * SS)], fill=g, width=SS)
        for y in range(0, H * SS, step):
            d.line([(0, y), (W * SS, y)], fill=g, width=SS)

    # the machine: traces in, reveals its mechanism, then shrinks to 58% and fades behind the frame
    if fd["schem"] is not None and f < 45:
        shrink = prog(f, 27, 45, ease_out_cubic)
        s = (1 - 0.42 * shrink) * SS
        a = 1 - prog(f, 30, 45, ease_in_out)
        layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        machine(ImageDraw.Draw(layer, "RGBA"), f, sp.cx, sp.cy, s, a)
        img.alpha_composite(layer)
        d = ImageDraw.Draw(img, "RGBA")

    # orange panel revealed through a flat mask that follows the door's free edge
    if fd["orange"] > 0:
        xm = 439 + (665 + 20 - 439) * fd["orange"]
        fill(d, sp.g(P["orange"].intersection(box(-2000, -2000, xm, 3000))), rgb(T["heat"]))

    # chalk frame: outline traces F27-40, fills F40-44 with the doorway cut and the closed door in it
    fr = fd["frame"]
    if fr > 0:
        if fr < 1 or fd["schem"] is not None and f < 41:
            outline = list(sp.g(P["frame"]).exterior.coords)
            stroke(d, outline, rgb(T["chalk"]), 4 * SS, frac=min(1, fr / 0.75))
        fa = 1.0 if fd["schem"] is None else prog(f, 39, 45, ease_out_cubic)
        if fa > 0:
            layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
            ld = ImageDraw.Draw(layer, "RGBA")
            fill(ld, sp.g(P["chalk"]), rgb(T["chalk"]))
            # doorway (dark) shows only where the door no longer covers it
            fill(ld, sp.g(P["hole"]), rgb(T["bg"]))
            if fa < 1:
                layer.putalpha(layer.getchannel("A").point(lambda v: int(v * fa)))
            img.alpha_composite(layer)
            d = ImageDraw.Draw(img, "RGBA")

    # the blue door: closed over the doorway until F45, then one rigid hinge swing
    if fr >= 1 or fd["schem"] is None or f >= 39:
        pdoor = fd["door"]
        if pdoor >= 1:
            fill(d, sp.g(P["blue"]), rgb(T["cold"]))
            fill(d, sp.g(P["violet"]), rgb(T["cold"]))
        else:
            dg = door_at(P, pdoor)
            if dg is not None:
                da = 1.0 if fd["schem"] is None else prog(f, 39, 45, ease_out_cubic)
                fill(d, sp.g(dg), with_alpha(rgb(T["cold"]), da))
        if fd["violet"] > 0:
            fill(d, sp.g(P["violet"]), with_alpha(rgb(T["refrigerant"]), fd["violet"]))

    # wordmark: one horizontal mask, left to right
    if fd["text"] > 0:
        layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer, "RGBA")
        chalk = rgb(T["chalk"])
        if vertical:
            for i, (t, fnt) in enumerate((("DESIGNED", L["fm"]), ("OTHERWISE", L["fs"]))):
                tx = (W * SS - L["tlen"](t, fnt)) / 2
                draw_text(ld, tx, (L["text_y"] + 81 * i) * SS, t, fnt, chalk, L["tr"])
            x0, x1 = (W - L["ww"]) / 2, (W + L["ww"]) / 2
        else:
            draw_text(ld, L["text_x"] * SS, L["text_y"] * SS, "DESIGNED", L["fm"], chalk, L["tr"])
            draw_text(ld, L["text_x"] * SS, (L["text_y"] + 81) * SS, "OTHERWISE", L["fs"], chalk, L["tr"])
            x0, x1 = L["text_x"], L["text_x"] + L["ww"]
        cut = int((x0 + (x1 - x0 + 4) * fd["text"]) * SS)
        if fd["text"] < 1:
            ImageDraw.Draw(layer).rectangle([cut, 0, W * SS, H * SS], fill=(0, 0, 0, 0))
        img.alpha_composite(layer)

    return img.convert("RGB").resize((W, H), Image.LANCZOS)


def main():
    out = sys.argv[1]
    fmt = sys.argv[sys.argv.index("--format") + 1] if "--format" in sys.argv else "wide"
    os.makedirs(out, exist_ok=True)
    P = mark_parts()
    if fmt == "vertical-end":
        for f in range(60):
            render(f, P, vertical=True, end_card=True).save(os.path.join(out, f"f{f:04d}.png"))
    else:
        for f in range(96):
            render(f, P).save(os.path.join(out, f"f{f:04d}.png"))
        render(72, P).save(os.path.join(out, "still.png"))
    print("frames written to", out)


if __name__ == "__main__":
    main()
