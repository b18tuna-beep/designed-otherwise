"""Manim toolchain test (5 s): a temperature-vs-time graph in house colors.
Illustrative curves only, not script data.

    manim -qh --fps 30 -o manim-test tools/tests/manim_test.py ManimTest
"""
import json
from pathlib import Path

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Axes, Create, Dot, FadeIn, Scene, Text, ValueTracker,
                   always_redraw, config, linear)

T = json.loads((Path(__file__).resolve().parents[2] / "style" / "tokens.json").read_text())
C = T["color"]
config.background_color = C["bg"]
FONT = "Archivo"


class ManimTest(Scene):
    def construct(self):
        title = Text("MANIM · GRAPH TEST", font=FONT, weight="SEMIBOLD", color=C["chalk"]).scale(0.55).to_edge(UP)
        ax = Axes(x_range=[0, 10, 2], y_range=[0, 40, 10], x_length=10, y_length=5,
                  axis_config={"color": C["muted"], "stroke_width": 3, "include_ticks": True},
                  tips=False).shift(DOWN * 0.3)
        xl = Text("time", font=FONT, color=C["muted"]).scale(0.4).next_to(ax.x_axis, DOWN)
        yl = Text("temperature", font=FONT, color=C["muted"]).scale(0.4).rotate(np.pi / 2).next_to(ax.y_axis, LEFT)
        # two bodies exchanging heat drift toward a shared temperature (illustrative)
        warm = ax.plot(lambda t: 20 + 15 * np.exp(-t / 3), x_range=[0, 10], color=C["heat"], stroke_width=6)
        cool = ax.plot(lambda t: 20 - 15 * np.exp(-t / 3), x_range=[0, 10], color=C["cold"], stroke_width=6)
        lw = Text("warm object", font=FONT, color=C["heat"]).scale(0.38).next_to(ax.c2p(0.3, 35), RIGHT)
        lc = Text("cold object", font=FONT, color=C["cold"]).scale(0.38).next_to(ax.c2p(0.3, 5), RIGHT)
        tracker = ValueTracker(0)
        dw = always_redraw(lambda: Dot(ax.c2p(tracker.get_value(), 20 + 15 * np.exp(-tracker.get_value() / 3)),
                                       color=C["heat"], radius=0.09))
        dc = always_redraw(lambda: Dot(ax.c2p(tracker.get_value(), 20 - 15 * np.exp(-tracker.get_value() / 3)),
                                       color=C["cold"], radius=0.09))
        self.play(FadeIn(title), Create(ax), FadeIn(xl), FadeIn(yl), run_time=1.0)
        self.add(dw, dc)
        self.play(Create(warm), Create(cool), FadeIn(lw), FadeIn(lc), tracker.animate.set_value(10),
                  run_time=3.6, rate_func=linear)
        self.wait(0.4)
