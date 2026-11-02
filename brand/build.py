"""Designed Otherwise brand suite. python brand/build.py  ->  brand/export/"""
import os

from PIL import Image, ImageDraw, ImageFont

from mark import CHALK, SLATE, svg
from render import mark_image
import compose

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "export")
FONTS = os.path.join(HERE, "..", "style", "fonts")
SEMI = os.path.join(FONTS, "Archivo-SemiCondensed-SemiBold.ttf")
MED = os.path.join(FONTS, "Archivo-SemiCondensed-Medium.ttf")
GRID = "#1A2029"
MUTED = "#8B95A3"
TAGLINE = "How everyday machines really work"


def font(path, px):
    return ImageFont.truetype(path, px)


def spaced(d, xy, text, f, fill, tracking):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + tracking
    return x - tracking


def spaced_len(d, text, f, tracking):
    return sum(d.textlength(ch, font=f) for ch in text) + tracking * (len(text) - 1)


def lockup(h, dark=True, tagline=False):
    """Horizontal lockup image (transparent) of height h: mark + DESIGNED / OTHERWISE stacked."""
    ink = CHALK if dark else SLATE
    m = mark_image(h, fill=0.9, dark=dark, transparent=True)
    cap = int(h * 0.30)
    f1, f2 = font(MED, cap), font(SEMI, cap)
    tr = cap * 0.08
    tmp = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    w_text = max(spaced_len(tmp, "DESIGNED", f1, tr), spaced_len(tmp, "OTHERWISE", f2, tr))
    ft = font(MED, int(cap * 0.42))
    if tagline:
        w_text = max(w_text, tmp.textlength(TAGLINE, font=ft))
    gap = int(h * 0.12)
    W = h + gap + int(w_text) + 4
    im = Image.new("RGBA", (W, h), (0, 0, 0, 0))
    im.paste(m, (0, 0), m)
    d = ImageDraw.Draw(im)
    x = h + gap
    # optical: cap height ~0.72 of font size; centre the two lines on the mark
    block = cap * 2.1 + (cap * 0.75 if tagline else 0)
    y0 = (h - block) / 2 - cap * 0.18
    spaced(d, (x, y0), "DESIGNED", f1, ink, tr)
    spaced(d, (x, y0 + cap * 1.05), "OTHERWISE", f2, ink, tr)
    if tagline:
        d.text((x, y0 + cap * 2.35), TAGLINE, font=ft, fill=MUTED)
    return im


def stacked(size, dark=True):
    ink = CHALK if dark else SLATE
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    m = mark_image(int(size * 0.55), fill=0.9, dark=dark, transparent=True)
    im.paste(m, ((size - m.width) // 2, int(size * 0.08)), m)
    d = ImageDraw.Draw(im)
    cap = int(size * 0.085)
    tr = cap * 0.1
    for i, (t, f) in enumerate((("DESIGNED", font(MED, cap)), ("OTHERWISE", font(SEMI, cap)))):
        w = spaced_len(d, t, f, tr)
        spaced(d, ((size - w) / 2, size * 0.66 + i * cap * 1.1), t, f, ink, tr)
    return im


def on_bg(img, w, h, bg=SLATE, grid=False):
    im = Image.new("RGB", (w, h), bg)
    if grid:
        d = ImageDraw.Draw(im)
        step = max(w // 32, 24)
        for x in range(0, w, step):
            d.line([(x, 0), (x, h)], fill=GRID, width=2)
        for y in range(0, h, step):
            d.line([(0, y), (w, y)], fill=GRID, width=2)
    if img is not None:
        im.paste(img, ((w - img.width) // 2, (h - img.height) // 2), img)
    return im


def avatar(px):
    """Flat mark on slate with a soft warm glow below and cool glow above, plus fine grain."""
    import numpy as np
    W = px
    yy, xx = np.mgrid[0:W, 0:W] / W
    base = np.array([17, 21, 27], float)
    warm = np.exp(-(((xx - 0.55) / 0.35) ** 2 + ((yy - 0.92) / 0.22) ** 2))[..., None] * np.array([90, 40, 10])
    cool = np.exp(-(((xx - 0.2) / 0.3) ** 2 + ((yy - 0.15) / 0.3) ** 2))[..., None] * np.array([10, 28, 50])
    a = base + warm + cool + np.random.default_rng(3).normal(0, 3, (W, W, 1))
    bg = Image.fromarray(np.clip(a, 0, 255).astype("uint8"))
    m = mark_image(px, fill=0.66, transparent=True)
    bg.paste(m, (0, 0), m)
    return bg


def save(im, name):
    p = os.path.join(OUT, name)
    im.save(p, optimize=True)
    return p


def main():
    os.makedirs(OUT, exist_ok=True)
    for dark, tag in ((True, "dark"), (False, "light")):
        open(os.path.join(OUT, f"mark-{tag}.svg"), "w").write(svg(1000, 0.62, dark))
        open(os.path.join(OUT, f"mark-{tag}-transparent.svg"), "w").write(svg(1000, 0.62, dark, background=False))
        save(mark_image(2048, fill=0.8, dark=dark, transparent=True), f"mark-{tag}-2048.png")
        lk = lockup(1000, dark)
        canvas = Image.new("RGBA", (max(3000, lk.width + 200), 1000), (0, 0, 0, 0))
        canvas.paste(lk, ((canvas.width - lk.width) // 2, 0), lk)
        save(canvas, f"wordmark-horizontal-{tag}-3000x1000.png")
        save(stacked(2000, dark), f"wordmark-stacked-{tag}-2000.png")
    # avatars: the flat mark (reads at 32-48 px) on a glowing, grained slate ground
    for name, px in (("youtube-profile-800", 800), ("google-avatar-800", 800), ("instagram-profile-1080", 1080),
                     ("tiktok-profile-1080", 1080), ("facebook-profile-720", 720)):
        save(avatar(px), f"{name}.png")
    save(mark_image(1024, fill=0.72).convert("RGB"), "app-icon-1024.png")
    wm = mark_image(150, fill=0.86, transparent=True)
    save(wm, "youtube-watermark-150.png")
    for px in (512, 192, 180, 32, 16):
        save(mark_image(px, fill=0.86 if px <= 32 else 0.72).convert("RGB"), f"favicon-{px}.png")
    # YouTube banner: Blender hero (render/banner-hero.png, from hero3d.py) + drawing layer (compose.py)
    banner_path = os.path.join(OUT, "youtube-banner-2560x1440.png")
    compose.banner(os.path.join(HERE, "render", "banner-hero.png"), banner_path)
    ban = Image.open(banner_path)
    # Facebook cover and share image: crops of the banner around the lockup (mobile crops the cover's sides)
    save(ban.crop((130, 470, 2430, 1345)).resize((1640, 624), Image.LANCZOS), "facebook-cover-1640x624.png")  # lockup sits high: Facebook centres the avatar over the lower cover
    save(ban.crop((400, 260, 2160, 1184)).resize((1200, 630), Image.LANCZOS), "share-image-1200x630.png")
    # end screen: the hero render with the drawing layer but no wordmark, so YouTube's tiles can sit on it
    save(compose.backdrop(os.path.join(HERE, "render", "banner-hero.png")).resize((1920, 1080), Image.LANCZOS), "end-screen-1920x1080.png")
    previews()
    print("wrote", OUT)


def previews():
    """Contact sheets: avatars in circle crops at real display sizes, and the banner safe area."""
    sheet = Image.new("RGB", (1500, 520), "#2B2F36")
    d = ImageDraw.Draw(sheet)
    x = 30
    for px in (300, 160, 98, 48, 32):
        a = Image.open(os.path.join(OUT, "youtube-profile-800.png")).resize((px, px), Image.LANCZOS)
        m = Image.new("L", (px, px), 0)
        ImageDraw.Draw(m).ellipse([0, 0, px - 1, px - 1], fill=255)
        sheet.paste(a, (x, 40), m)
        d.text((x, 40 + px + 10), f"{px}px", fill="#ccc")
        x += px + 40
    lt = Image.open(os.path.join(OUT, "mark-light-2048.png")).resize((300, 300), Image.LANCZOS)
    bgc = Image.new("RGB", (300, 300), CHALK)
    bgc.paste(lt, (0, 0), lt)
    sheet.paste(bgc, (x, 40))
    sheet.save(os.path.join(OUT, "preview-profile-pictures.png"))
    b = Image.open(os.path.join(OUT, "youtube-banner-2560x1440.png")).copy()
    d = ImageDraw.Draw(b)
    d.rectangle([(2560 - 1546) // 2, (1440 - 423) // 2, (2560 + 1546) // 2, (1440 + 423) // 2], outline="#D6F25C", width=4)
    b.resize((1280, 720), Image.LANCZOS).save(os.path.join(OUT, "preview-youtube-banner.png"))
    w = Image.open(os.path.join(OUT, "wordmark-horizontal-dark-3000x1000.png"))
    on_bg(w, 3000, 1000).resize((1500, 500), Image.LANCZOS).save(os.path.join(OUT, "preview-wordmark.png"))


if __name__ == "__main__":
    main()
