"""P4 hero shots L1: the pin tumbler lock, parametric cutaway. One script, five short shots.

    python l1_lock.py -- <out_dir> [first last] [--mode hook|wrong|master|tolerance|spool]
        [--frames N] [--res PCT] [--samples S] [--test 1,120,300]

Same contract as the P3 hero scripts (see .github/workflows/render-blender.yml): frames land in
<out_dir>/f_%04d.png, `--frames N` stretches the whole timeline (cue points scale with it).
Cue points below are in default-length frames (30 fps); the script prints them at start.

  hook       330 f  3/4 push-in. key enters 25-120, pins settle 120-135, shear line flashes 135-160
                    (glow holds), plug turns 170-250, hold to end.
  wrong      240 f  side cutaway. wrong key enters 20-100, blocked stacks highlight 108-128, plug tries
                    to turn 135-150, stops, shake 150-200, shear line stays dark.
  master     360 f  side cutaway, wafer in stack 3 (index 2). key A enters 12-70, flash 75, turn 100-135,
                    back 150-175, A leaves 185-225, key B enters 235-290, flash 295, turn 315-345.
  tolerance  270 f  top-view schematic, holes off-line (exaggerated). plug slides under force 35-150, the
                    pin with the least-off hole binds at 150 (turns violet, others muted), shudder
                    150-185, push-in on it 170-260.
  spool      270 f  3/4 close-up. key enters 15-90, spool column highlights 105-125, plug turns 120-148,
                    spool catches (tilts) 148-158, plug rocks back 158-190.
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from lock_common import (Args, Lock, ToleranceSlice, camera, cam_hero, cam_side, ease, ease_out,  # noqa: E402
                         lerp, lerp_cam, lights, render_loop, seg, set_cam, setup_scene, smoothstep, XP)

MODES = {"hook": 330, "wrong": 240, "master": 360, "tolerance": 270, "spool": 270}
args = Args(MODES, "hook")
sc = setup_scene(args)
lights()
cam = camera(60)

DESIGN = (3, 5, 2, 6, 4)          # the bitting the pins are cut for (the right key)
P_OFF = -0.45                      # key just outside the left edge of the frame


def key_p(vf, t0, t1, a=P_OFF, b=1.0):
    return lerp(a, b, seg(vf, t0, t1))


def flash(vf, t0):
    """shear line glow: quick rise to a peak at t0+6, settle to a steady glow."""
    return float(1.35 * smoothstep(t0, t0 + 6, vf) - 0.5 * smoothstep(t0 + 6, t0 + 26, vf))


# ---------------------------------------------------------------- hook
def build_hook():
    lock = Lock(design=DESIGN)
    a, b = cam_hero(target=(0.9, 0, 0.4), dist=15.8, el=16, az=-36, lens=55), \
        cam_hero(target=(1.6, 0, 0.55), dist=13.6, el=10, az=-22, lens=55)

    def update(vf, f):
        lock.key_insert(key_p(vf, 25, 120))
        g = flash(vf, 135)
        lock.shear(g)
        for i in range(5):
            lock.style_stack(i, 0.0, 0.18 * min(g, 1.0))
        lock.plug_turn(38.0 * seg(vf, 170, 250))
        lock.apply()
        set_cam(cam, lerp_cam(a, b, seg(vf, 1, 330, lambda x: x * x * (3 - 2 * x))))
    return update


# ---------------------------------------------------------------- wrong key
def build_wrong():
    lock = Lock(design=DESIGN)
    lock.keys["A"].show = False
    # same cuts as the right key at stacks 0 and 3; stack 1 too high, 2 and 4 too low
    lock.add_key("W", (3, 3, 5, 6, 6), "square")
    lock.keys["W"].p = P_OFF
    lock.key_insert(1.0, "W")
    lock.apply()
    blocked = lock.blocked_stacks()
    print("wrong key: blocked stacks", blocked, flush=True)
    a = cam_hero(target=(0.85, 0, 0.4), dist=15.0, el=9, az=-24, lens=62)
    b = cam_hero(target=(1.35, 0, 0.5), dist=13.6, el=12, az=-33, lens=62)

    def update(vf, f):
        lock.key_insert(key_p(vf, 20, 100), "W")
        hl = seg(vf, 108, 128)
        for i in range(5):
            if i in blocked:
                lock.style_stack(i, 0.0, 0.55 * hl)
            else:
                lock.style_stack(i, 0.55 * hl, 0.0)
        lock.shear(0.0)
        th = 5.0 * seg(vf, 135, 150, ease_out)
        if vf > 150:
            th += 1.4 * math.exp(-(vf - 150) / 9.0) * math.sin((vf - 150) * 1.5)
        lock.plug_turn(th)
        lock.apply()
        set_cam(cam, lerp_cam(a, b, seg(vf, 1, 240)))
    return update


# ---------------------------------------------------------------- master key
def build_master():
    lock = Lock(design=DESIGN, master={2: 2})
    kb = list(DESIGN)
    kb[2] += 2                                # key B is cut two steps deeper where the wafer is
    lock.add_key("B", kb, "round")
    lock.keys["B"].show = False
    lock.keys["B"].p = P_OFF
    a = cam_side(target=(0.8, 0, 0.32), width=7.6, az=-6, el=4, lens=90)
    b = cam_side(target=(1.1, 0, 0.3), width=7.5, az=-8, el=5, lens=90)

    def update(vf, f):
        inA = vf < 230
        lock.keys["A"].show = inA
        lock.keys["B"].show = not inA
        pA = lerp(P_OFF, 1.0, seg(vf, 12, 70))
        pA = lerp(pA, P_OFF, seg(vf, 185, 225))
        lock.key_insert(pA, "A")
        lock.key_insert(key_p(vf, 235, 290), "B")
        g = float(max(flash(vf, 75) * (vf < 190), 0.0) * (1 - smoothstep(170, 185, vf))
                  + flash(vf, 295) * (vf >= 230))
        lock.shear(g)
        for i in range(5):
            if i == 2:
                lock.style_stack(i, 0.0, 0.2 + 0.2 * min(g, 1))
            else:
                lock.style_stack(i, 0.4, 0.0)
        th = 28.0 * seg(vf, 100, 135) * (1 - seg(vf, 150, 175)) + 28.0 * seg(vf, 315, 345)
        lock.plug_turn(th)
        lock.apply()
        set_cam(cam, lerp_cam(a, b, seg(vf, 1, 360)))
    return update


# ---------------------------------------------------------------- tolerance
def build_tolerance():
    ts = ToleranceSlice()
    jam = ts.jam_offsets()
    first = int(np.argmin(jam))
    print("tolerance: binds first at stack", first, "after slide", round(min(jam), 3), flush=True)
    a = dict(target=(1.45, 0.05, -0.12), dist=0, el=68, az=0, lens=85)
    wide = 4.6
    import math as m
    dist_w = lambda w, lens: w / (2 * m.tan(m.atan(18.0 / lens)))
    a["dist"] = dist_w(wide, 85)
    b = dict(target=(XP[first], 0.1, -0.12), dist=dist_w(2.4, 85), el=62, az=-4, lens=85)

    def update(vf, f):
        d = min(jam) * seg(vf, 35, 150)
        if vf > 150:
            d += 0.0
        ts.d = d
        lit = seg(vf, 150, 170)
        for i in range(5):
            ts.states[i] = (1.0 - lit, 0.6 * lit) if i == first else (1.0, 0.0)
        ts.apply()
        if vf > 150:                                   # shudder against the stop
            sh = 0.008 * math.exp(-(vf - 150) / 10.0) * math.sin((vf - 150) * 1.7)
            ts.plug.location.y += sh
            for r in ts.rings_p:
                r.location.y += sh
        set_cam(cam, lerp_cam(a, b, seg(vf, 170, 260)))
    return update


# ---------------------------------------------------------------- spool
def build_spool():
    lock = Lock(design=DESIGN, spool=[1])
    lock.set_bitting((3, 7, 2, 6, 4))       # column 1 sits at rest: the spool waist on the shear line
    a = cam_hero(target=(1.2, 0, 0.55), dist=14.6, el=13, az=-38, lens=62)
    b = cam_hero(target=(1.45, 0, 0.35), dist=12.6, el=11, az=-30, lens=62)

    def update(vf, f):
        lock.key_insert(key_p(vf, 15, 90))
        hl = seg(vf, 105, 125)
        for i in range(5):
            if i == 1:
                lock.style_stack(i, 0.0, 0.5 * hl)
            else:
                lock.style_stack(i, 0.5 * hl, 0.0)
        lock.shear(0.35 * hl)
        th = 13.0 * seg(vf, 120, 148, ease_out)
        th -= 6.5 * seg(vf, 158, 190)
        if 148 < vf < 158:
            th += 0.4 * math.sin((vf - 148) * 1.6)
        lock.plug_turn(th)
        lock.spool_tilt = -1.0 * th
        lock.apply()
        set_cam(cam, lerp_cam(a, b, seg(vf, 1, 270)))
    return update


update = {"hook": build_hook, "wrong": build_wrong, "master": build_master,
          "tolerance": build_tolerance, "spool": build_spool}[args.mode]()
render_loop(args, update, "L1-" + args.mode)
