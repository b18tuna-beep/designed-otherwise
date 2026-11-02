"""Engineering-drawing layer for Designed Otherwise artwork (banner, covers, end screen).

    python brand/compose.py <hero.png> <out.png> [kind]
kind: banner (2560x1440, YouTube safe area 1546x423) | cover (1640x624) | endscreen (1920x1080)
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "style", "fonts")
SEMI = os.path.join(FONTS, "Archivo-SemiCondensed-SemiBold.ttf")
MED = os.path.join(FONTS, "Archivo-SemiCondensed-Medium.ttf")
MONO = os.path.join(FONTS, "IBMPlexMono-Medium.ttf")
CHALK = (236, 231, 220)
HEAT = (255, 122, 51)
COLD = (61, 168, 245)
MUTED = (139, 149, 163)


def F(p, s):
    return ImageFont.truetype(p, int(s))


def mark_bbox(im):
    """Locate the mark from its blue door (the only saturated blue in the frame), then grow to the whole mark."""
    a = np.asarray(im.convert("RGB")).astype(int)
    blue = (a[..., 2] > 170) & (a[..., 0] < 120) & (a[..., 2] - a[..., 0] > 90)
    ys, xs = np.where(blue)
    by0, by1 = np.percentile(ys, 1), np.percentile(ys, 99)
    bh = by1 - by0
    region = np.zeros(blue.shape, bool)
    region[int(by0 - bh * 0.6):int(by1 + bh * 0.35), :] = True
    lit = (a.max(-1) > 150) & region
    # keep the connected band around the door horizontally
    cols = np.where(lit.sum(0) > bh * 0.05)[0]
    bx = (np.percentile(xs, 1) + np.percentile(xs, 99)) / 2
    near = cols[np.abs(cols - bx) < bh * 1.6]
    rows = np.where(lit[:, near.min():near.max() + 1].sum(1) > 3)[0]
    return int(near.min()), int(rows.min()), int(near.max()), int(rows.max())


class Ink:
    def __init__(self, size, s=1.0):
        self.im = Image.new("RGBA", size, (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)
        self.s = s

    def line(self, pts, col=CHALK, a=70, w=2):
        self.d.line(pts, fill=col + (a,), width=max(1, int(w * self.s)))

    def rect(self, b, col=CHALK, a=70, w=2, r=0):
        self.d.rounded_rectangle(b, radius=r, outline=col + (a,), width=max(1, int(w * self.s)))

    def circle(self, c, r, col=CHALK, a=70, w=2, fill=None):
        x, y = c
        self.d.ellipse([x - r, y - r, x + r, y + r], outline=col + (a,), width=max(1, int(w * self.s)), fill=fill)

    def text(self, xy, t, size, col=CHALK, a=110, font=MONO, anchor="la"):
        self.d.text(xy, t, font=F(font, size * self.s), fill=col + (a,), anchor=anchor)

    def dim(self, x0, x1, y, label, a=90, size=16):
        """Horizontal dimension line with end ticks and a centred label."""
        s = self.s
        self.line([(x0, y), (x1, y)], a=a, w=1.5)
        for x in (x0, x1):
            self.line([(x, y - 10 * s), (x, y + 10 * s)], a=a, w=1.5)
            self.line([(x - 6 * s, y + 6 * s), (x + 6 * s, y - 6 * s)], a=a, w=1.5)
        self.text(((x0 + x1) / 2, y - 14 * s), label, size, a=a + 30, anchor="ms")

    def vdim(self, x, y0, y1, label, a=90, size=16):
        s = self.s
        self.line([(x, y0), (x, y1)], a=a, w=1.5)
        for y in (y0, y1):
            self.line([(x - 10 * s, y), (x + 10 * s, y)], a=a, w=1.5)
        self.text((x + 14 * s, (y0 + y1) / 2), label, size, a=a + 30, anchor="lm")

    def leader(self, p0, p1, label, size=16, a=110):
        s = self.s
        self.line([p0, p1], a=a - 20, w=1.5)
        self.circle(p0, 4 * s, a=a, fill=CHALK + (a,))
        self.line([p1, (p1[0] + 40 * s, p1[1])], a=a - 20, w=1.5)
        self.text((p1[0] + 48 * s, p1[1]), label, size, a=a, anchor="lm")

    def cross(self, c, r=14, a=90):
        x, y = c
        self.line([(x - r * self.s, y), (x + r * self.s, y)], a=a, w=1.5)
        self.line([(x, y - r * self.s), (x, y + r * self.s)], a=a, w=1.5)


# --------------------------------------------------------------- schematics (faint, outside the safe area)
def fridge(k, x, y, h, a=55):
    s = h / 600
    w = 300 * s
    k.rect([x, y, x + w, y + h], a=a, w=2, r=int(18 * s))
    k.line([(x, y + h * 0.3), (x + w, y + h * 0.3)], a=a, w=1.5)
    k.line([(x + w - 22 * s, y + 60 * s), (x + w - 22 * s, y + 140 * s)], a=a, w=3)
    k.line([(x + w - 22 * s, y + h * 0.36), (x + w - 22 * s, y + h * 0.6)], a=a, w=3)
    # back coil (heat) as a zigzag, defrost heater as an orange bar
    pts = [(x + w + 18 * s + (12 * s if i % 2 else 0), y + 60 * s + i * 30 * s) for i in range(16)]
    k.line(pts, col=HEAT, a=a + 20, w=2)
    k.line([(x + 40 * s, y + h * 0.25), (x + w - 50 * s, y + h * 0.25)], col=HEAT, a=a + 40, w=4)
    for i in range(6):
        k.line([(x + 40 * s + i * 36 * s, y + 40 * s), (x + 40 * s + i * 36 * s, y + h * 0.22)], col=COLD, a=a, w=2)
    k.dim(x, x + w, y - 26 * s, "W 30 IN", a=a + 10, size=14)
    k.vdim(x - 30 * s, y, y + h, "H 66 IN", a=a + 10, size=14)
    k.text((x, y + h + 34 * s), "FIG. 01  REFRIGERATOR", 15, a=a + 50)


def signal(k, x, y, h, a=55):
    s = h / 600
    w = 200 * s
    k.rect([x, y, x + w, y + h], a=a, w=2, r=int(30 * s))
    for i, col in enumerate((CHALK, CHALK, CHALK)):
        k.circle((x + w / 2, y + 110 * s + i * 190 * s), 70 * s, a=a, w=2)
        k.line([(x + w / 2 - 80 * s, y + 40 * s + i * 190 * s), (x + w / 2 + 80 * s, y + 40 * s + i * 190 * s)], a=a - 15, w=1.5)
    k.circle((x + w / 2, y + 110 * s), 24 * s, col=HEAT, a=a + 30, w=2)
    k.line([(x + w / 2, y + h), (x + w / 2, y + h + 120 * s)], a=a, w=2)
    k.text((x - 10 * s, y + h + 160 * s), "FIG. 02  TRAFFIC SIGNAL", 15, a=a + 50)


def coil(k, cx, cy, r, a=50):
    pts = []
    for i in range(0, 900):
        t = i / 900 * 7 * 2 * math.pi
        rr = r * (0.18 + 0.82 * i / 900)
        pts.append((cx + rr * math.cos(t), cy + rr * math.sin(t)))
    k.line(pts, col=HEAT, a=a, w=2)
    k.circle((cx, cy), r * 1.08, a=a - 10, w=1.5)
    k.text((cx - r * 1.08 - 20, cy - r * 1.08 - 30), "FIG. 03  INDUCTION COIL", 15, a=a + 50)


def microwave(k, x, y, w, a=50):
    s = w / 520
    h = 300 * s
    k.rect([x, y, x + w, y + h], a=a, w=2, r=int(14 * s))
    k.rect([x + 30 * s, y + 30 * s, x + 360 * s, y + h - 30 * s], a=a, w=1.5, r=int(10 * s))
    for i in range(5):
        k.line([(x + 400 * s, y + 50 * s + i * 40 * s), (x + 490 * s, y + 50 * s + i * 40 * s)], a=a - 10, w=1.5)
    # wave lines inside the cavity
    for j in range(3):
        pts = [(x + 60 * s + t * 3 * s, y + 90 * s + j * 50 * s + 12 * s * math.sin(t / 8)) for t in range(95)]
        k.line(pts, col=HEAT, a=a, w=1.5)
    k.text((x, y + h + 36 * s), "FIG. 04  MICROWAVE OVEN", 15, a=a + 50)


def grain_vignette(im, strength=7, vig=0.42, seed=7):
    a = np.asarray(im.convert("RGB")).astype(np.float32)
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    a *= (1 - vig * np.clip(r - 0.35, 0, 1) ** 1.6)[..., None]
    rng = np.random.default_rng(seed)
    a += rng.normal(0, strength, (h, w, 1))
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def wordmark(k, x, ymid, cap, tag=True):
    s = 1
    f1, f2 = F(MED, cap), F(SEMI, cap)
    tr = cap * 0.08

    def put(t, f, y):
        xx = x
        for ch in t:
            k.d.text((xx, y), ch, font=f, fill=CHALK + (255,), anchor="ls")
            xx += k.d.textlength(ch, font=f) + tr
        return xx - tr
    e1 = put("DESIGNED", f1, ymid - cap * 0.12)
    e2 = put("OTHERWISE", f2, ymid + cap * 0.95)
    if tag:
        k.d.text((x, ymid + cap * 1.75), "How everyday machines really work", font=F(MED, cap * 0.36), fill=MUTED + (255,), anchor="ls")
    return max(e1, e2)


def drafting(bg, W, H):
    for x in range(0, W, 64):
        bg.line([(x, 0), (x, H)], a=12 if x % 320 else 22, w=1)
    for y in range(0, H, 64):
        bg.line([(0, y), (W, y)], a=12 if y % 320 else 22, w=1)
    fridge(bg, 150, 300, 640)
    signal(bg, 2240, 230, 520)
    coil(bg, 1800, 1150, 105)
    microwave(bg, 150, 1120, 400)


def backdrop(hero_path):
    """Hero render + drafting layer, no wordmark (end screens, video backgrounds)."""
    W, H = 2560, 1440
    im = Image.open(hero_path).convert("RGB").resize((W, H), Image.LANCZOS)
    bg = Ink((W, H))
    drafting(bg, W, H)
    return grain_vignette(Image.alpha_composite(im.convert("RGBA"), bg.im))


def banner(hero_path, out):
    W, H = 2560, 1440
    im = Image.open(hero_path).convert("RGB").resize((W, H), Image.LANCZOS)
    x0, y0, x1, y1 = mark_bbox(im)
    sx0, sy0, sx1, sy1 = (W - 1546) // 2, (H - 423) // 2, (W + 1546) // 2, (H + 423) // 2
    bg = Ink((W, H))
    drafting(bg, W, H)
    # registration crosses on the safe-area corners
    for c in ((sx0, sy0), (sx1, sy0), (sx0, sy1), (sx1, sy1)):
        bg.cross(c, 16, a=70)
    # title block, bottom right (TV view only)
    tb = (W - 640, H - 150, W - 60, H - 60)
    bg.rect(tb, a=80, w=1.5)
    bg.line([(tb[0], tb[1] + 45), (tb[2], tb[1] + 45)], a=80, w=1.5)
    bg.line([(tb[0] + 330, tb[1]), (tb[0] + 330, tb[3])], a=80, w=1.5)
    bg.text((tb[0] + 16, tb[1] + 14), "DESIGNED OTHERWISE", 18, a=150)
    bg.text((tb[0] + 346, tb[1] + 14), "SHEET 01 / CHANNEL", 18, a=150)
    bg.text((tb[0] + 16, tb[1] + 60), "DRAWN: CHALK ON SLATE", 15, a=110)
    bg.text((tb[0] + 346, tb[1] + 60), "SCALE 1:1  REV A", 15, a=110)
    im = Image.alpha_composite(im.convert("RGBA"), bg.im)
    # inside the safe area: annotations on the mark, then the wordmark
    fg = Ink((W, H))
    fg.dim(x0, x1, y1 + 40, "FIG. 00", a=110, size=15)
    fg.leader((x0 + (x1 - x0) * 0.18, y0 + (y1 - y0) * 0.2), (x0 - 60, y0 - 10), "FRAME", 15)
    cap = 104
    tx = x1 + 90
    end = wordmark(fg, tx, (sy0 + sy1) / 2 - 20, cap)
    assert end <= sx1 - 10, f"wordmark runs past safe area: {end} > {sx1}"
    fg.line([(tx, (sy0 + sy1) / 2 + cap * 2.15), (tx + 140, (sy0 + sy1) / 2 + cap * 2.15)], col=COLD, a=255, w=6)
    fg.line([(tx + 140, (sy0 + sy1) / 2 + cap * 2.15), (tx + 280, (sy0 + sy1) / 2 + cap * 2.15)], col=HEAT, a=255, w=6)
    im = Image.alpha_composite(im, fg.im)
    grain_vignette(im).save(out, optimize=True)
    print("banner", out, "mark bbox", (x0, y0, x1, y1), "wordmark end", end, "safe right", sx1)


if __name__ == "__main__":
    banner(sys.argv[1], sys.argv[2])
