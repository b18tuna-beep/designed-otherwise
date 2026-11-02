"""Designed Otherwise mark, rebuilt as clean geometry from the approved ChatGPT refinement
(reference/approved-refinement.png, locked by Michael 2026-10-28).

Three parallelograms on one skew (s): the chalk door frame and the orange panel lean up to the
right, the blue door leans the other way. The door shape cuts a dark doorway through the frame; its
lower strip is violet where it crosses the threshold. The violet placement is deliberate (Michael
2026-10-28): do not "correct" it to the orange/blue overlap.

    from mark import layers   # [(color_hex, shapely geometry), ...] back to front, in a 1000x1000 box
"""
from shapely.affinity import scale as sscale, translate
from shapely.geometry import Polygon, box
from shapely.ops import unary_union

S = 0.52          # skew: rise per unit of x
R = 15            # corner radius in source pixels (887 px reference)
CHALK, BLUE, HEAT, VIOLET, SLATE = "#ECE7DC", "#3DA8F5", "#FF7A33", "#B38CFF", "#11151B"


def para(x0, x1, top_at_x0, h, s):
    """Parallelogram with vertical sides at x0 and x1; the top edge rises by s per unit x."""
    t1 = top_at_x0 - s * (x1 - x0)
    return Polygon([(x0, top_at_x0), (x1, t1), (x1, t1 + h), (x0, top_at_x0 + h)])


def rounded(p, r=R):
    return p.buffer(-r, join_style="mitre").buffer(r, resolution=24)


def layers(size=1000, fill=0.62, dark=True):
    frame = rounded(para(218, 460, 252, 428, S))
    orange = rounded(para(439, 665, 330, 420, S))
    door = rounded(para(334, 572, 240, 332, -S))
    split_x = 439
    # the threshold line: blue above, violet below (door skew), starting at the blue's lower-left corner
    thr = Polygon([(split_x - 400, 558 - S * 400), (900, 558 + S * (900 - split_x)), (900, 2000), (split_x - 400, 2000)])
    # violet's left edge follows the frame skew through the same corner
    left = Polygon([(split_x, 558), (split_x + 600, 558 - S * 600), (2000, -2000), (2000, 2000), (split_x - 600, 558 + S * 600 + 2000), (split_x - 600, 558 + S * 600)])
    right_of_split = box(split_x, -2000, 3000, 3000)
    blue = door.intersection(right_of_split).difference(thr)
    violet = door.intersection(thr).intersection(left)
    hole = door.intersection(frame).difference(right_of_split).difference(violet)
    chalk = frame.difference(hole)
    ink = CHALK if dark else SLATE
    out = [(HEAT, orange), (ink, chalk), (BLUE, blue), (VIOLET, violet)]
    allg = unary_union([g for _, g in out])
    minx, miny, maxx, maxy = allg.bounds
    k = size * fill / max(maxx - minx, maxy - miny)
    cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
    res = []
    for c, g in out:
        g = translate(g, -cx, -cy)
        g = sscale(g, k, k, origin=(0, 0))
        res.append((c, translate(g, size / 2, size / 2)))
    return res


def svg(size=1000, fill=0.62, dark=True, background=True):
    def path(g):
        polys = getattr(g, "geoms", [g])
        d = []
        for p in polys:
            for ring in [p.exterior, *p.interiors]:
                pts = list(ring.coords)
                d.append("M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts) + " Z")
        return " ".join(d)
    bg = f'<rect width="{size}" height="{size}" fill="{SLATE if dark else CHALK}"/>' if background else ""
    body = "".join(f'<path fill="{c}" fill-rule="evenodd" d="{path(g)}"/>' for c, g in layers(size, fill, dark))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">{bg}{body}</svg>'
