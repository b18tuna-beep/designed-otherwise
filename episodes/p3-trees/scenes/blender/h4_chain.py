"""P3 hero H4 (S27): the rope of water inside one pipe.

A translucent chalk tube (one conduit) holds the water column drawn as a chain of
linked chalk beads (molecules, linked by short bonds; a few thin ties to the wall
for adhesion). On 'tugs' (1.95 s) the top bead lifts out of the pipe mouth and
fades (evaporation) and the tug travels down the chain as it closes the gap. On
'cling to each other' (5.77 s) a violet tension glow runs down the chain (the pull).
The camera tracks down the column so it reads as long. On 'like a rope' (18.59 s)
the next top bead leaves and the whole column rises together, all at once.
Re-voiced cues (1.97, 5.85, 18.61 s) are 0.02-0.08 s later than the authored ones,
so each change still lands a few frames before its word.

    python h4_chain.py -- <out_dir> [first last] [--res PCT] [--samples S] [--test 1,200]
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from tree_common import (T, Args, DynMesh, Mat, bars, camera, lerp, place_camera, render_loop,  # noqa: E402
                         seg, setup_scene, smoothstep, static, sun, tube_along, uv_sphere)

args = Args(641, "h4")
DUR = args.frames / 30.0
sc = setup_scene(args)
sc.cycles.transparent_max_bounces = 8

RT = 1.0                    # tube radius
NB = 104                    # beads
HR, DZ, DA = 0.43, 0.42, 1.9
RB = 0.29
ZTOP = -0.55


def helix(p):
    """bead centre for continuous chain parameter p (0 = top position)."""
    p = np.asarray(p, float)
    return np.stack([HR * np.cos(p * DA), HR * np.sin(p * DA), ZTOP - p * DZ], -1)


m_bead = Mat("bead", T["chalk"], rough=0.6, spec=0.35, alt=T["refrigerant"], mix=0.0, mix_attr="glow",
             emit_color=T["refrigerant"], emit=0.0, glow_attr="glow", alpha_attr="a")
m_tube = Mat("tube", T["chalk"], alpha=0.025, rim=0.4, rough=0.5)
m_rim = Mat("rim", T["chalk"], rough=0.8)

# tube: open at the top (the pipe mouth into the leaf), running far down out of frame
P = np.stack([np.zeros(60), np.zeros(60), np.linspace(-60.0, 0.0, 60)], -1)
v, f, _ = tube_along(P, RT, 40)
tube = static("tube", v, f, m_tube.m, smooth=True)
a = np.linspace(0, 2 * np.pi, 49)
v, f, _ = tube_along(np.stack([RT * np.cos(a), RT * np.sin(a), np.zeros_like(a)], -1), 0.05, 8)
static("mouth", v, f, m_rim.m, smooth=True)
tube.ob.visible_shadow = False

SV, SF = uv_sphere(8, 14)
NSV = len(SV)
LV, LF = bars(np.zeros((1, 3)), np.array([[0, 0, 1.0]]), np.array([1.0]), 8)
NLV = len(LV)
TIE = np.arange(2, NB, 3)                   # adhesion ties to the wall
NL = NB - 1 + len(TIE)
beads = DynMesh("beads", np.zeros((NB * NSV, 3)), (SF[None] + NSV * np.arange(NB)[:, None, None]).reshape(-1, 4),
                m_bead.m, attrs=("glow", "a"))
links = DynMesh("links", np.zeros((NL * NLV, 3)), (LF[None] + NLV * np.arange(NL)[:, None, None]).reshape(-1, 4),
                m_bead.m, attrs=("glow", "a"))

sun((40, -130), 2.8)
sun((25, 60), 1.8, color=(0.92, 0.95, 1.0), angle_deg=6)
sun((75, -90), 0.35)
cam = camera(35)
cam.data.clip_start = 0.05


def update(t, f):
    idx = np.arange(NB, dtype=float)
    # chain parameter: each bead moves to the slot above as the column advances
    # first advance (after the tug at 1.95): the tug travels down, deeper beads move later
    u1 = np.array([seg(t, 2.15 + 0.035 * i, 3.6 + 0.035 * i) for i in range(NB)])
    # second advance (18.59 'like a rope'): everything at once
    u2 = seg(t, 18.6, 20.1)
    p = idx - u1 - u2
    C = helix(np.maximum(p, 0.0))
    alpha = np.ones(NB)
    scale = np.ones(NB)
    # beads that leave the mouth: lift up and away, shrink and fade (vapour)
    for i, t0 in ((0, 1.95), (1, 18.59)):
        lv = seg(t, t0, t0 + 1.6)
        if t >= t0:
            C[i] = helix(0.0) + np.array([0.25 * lv, -0.1 * lv, 0.6 + 2.6 * lv]) * (lv > 0)
            alpha[i] = 1 - smoothstep(0.35, 1.0, lv)
            scale[i] = 1 - 0.45 * lv
        if t > t0 + 1.6:
            alpha[i] = 0.0
            scale[i] = 1e-3
    # tug stretch: a small extra lift that decays down the chain during the tug
    tug = math.exp(-max(0.0, t - 2.0) * 1.4) * (t > 1.95)
    C[:, 2] += 0.12 * tug * np.exp(-idx / 10.0)
    # violet tension: 5.77 front runs down the chain, then travelling pulses
    front = (t - 5.6) * 14.0
    g = np.clip((front - idx) / 6.0, 0, 1)
    puls = 0.75 + 0.25 * np.cos((idx * 0.5 + t * 6.0))
    glow = g * puls * lerp(1.0, 1.25, seg(t, 18.4, 19.4))
    V = C[:, None, :] + RB * scale[:, None, None] * SV[None]
    beads.set_verts(V.reshape(-1, 3))
    beads.set_attr("glow", np.repeat(glow, NSV))
    beads.set_attr("a", np.repeat(alpha, NSV))
    # bonds between neighbours (skip any bond to a departing bead once it lifts) and wall ties
    P0 = np.concatenate([C[:-1], C[TIE]])
    P1 = np.concatenate([C[1:], C[TIE] * np.array([RT / HR * 0.97, RT / HR * 0.97, 1.0])])
    lg = np.concatenate([(glow[:-1] + glow[1:]) / 2, glow[TIE] * 0.6])
    la = np.concatenate([np.minimum(alpha[:-1], alpha[1:]), np.ones(len(TIE))])
    for i, t0 in ((0, 1.95), (1, 18.59)):
        if t >= t0 + 0.15:
            la[i] = 0.0
    R = np.concatenate([np.full(NB - 1, 0.075), np.full(len(TIE), 0.03)])
    lv_, _ = bars(P0, P1, R, 8)
    links.set_verts(lv_)
    links.set_attr("glow", np.repeat(lg, NLV))
    links.set_attr("a", np.repeat(la, NLV))
    m_bead.set(mix=0.8, emit=0.7)
    # camera: mouth at the top, then track down the column, settle mid-column for the rise
    dn = seg(t, 6.6, 15.2)
    tz = lerp(-2.6, -17.0, dn)
    tz = lerp(tz, -16.0, seg(t, 15.2, DUR))
    d = lerp(lerp(13.5, 12.5, seg(t, 0, 6.6)), 14.5, dn)
    place_camera(cam, (0.0, 0.0, tz), d, lerp(16.0, 6.0, dn), lerp(-18.0, -30.0, seg(t, 0, DUR)))


render_loop(args, update, "H4")
