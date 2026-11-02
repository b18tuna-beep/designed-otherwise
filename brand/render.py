"""Rasterize the mark with PIL (4x supersampled)."""
from PIL import Image, ImageDraw

from mark import CHALK, SLATE, layers

SS = 4


def mark_image(px, fill=0.62, dark=True, bg=None, transparent=False):
    W = px * SS
    im = Image.new("RGBA", (W, W), (0, 0, 0, 0) if transparent else (bg or (SLATE if dark else CHALK)))
    d = ImageDraw.Draw(im)
    for c, g in layers(W, fill, dark):
        for p in getattr(g, "geoms", [g]):
            d.polygon(list(p.exterior.coords), fill=c)
            for hole in p.interiors:
                d.polygon(list(hole.coords), fill=(0, 0, 0, 0) if transparent else (bg or (SLATE if dark else CHALK)))
    return im.resize((px, px), Image.LANCZOS)
