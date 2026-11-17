// P3 (how trees lift water) production scenes. Each builder returns {base, steps}: steps map 1:1 to the
// storyboard `changes` for that scene (episodes/p3-trees/board/scenes_src.py) and fire at their word cues
// (episodes/p3-trees/scenes/scenes.json). Blender and footage scenes are transparent 2D overlays (overlay: true);
// archival scenes show a still from episodes/p3-trees/scenes/assets/ (placeholder until it is added).
// Colours: chalk = structure and water (translucent fill, never blue), violet = the pull / tension,
// muted = failed attempts and air-filled pipes, orange = heat only (S33). No arrowheads anywhere.
import {Circle, Line, Node, Rect, Spline} from '@motion-canvas/2d';
import {all, createSignal, delay, easeInOutCubic, easeOutCubic, linear, waitFor} from '@motion-canvas/core';
import {C, Label, LW, Num, Shimmer, Small, Title} from '../lib/parts';
import {T} from '../lib/clock';
import type {Built} from '../lib/motion';
import {
  AttemptTag, Backed, Building, clamp, Dial, Drop, fract, Ground, GROUND, H116, LeafSection, Locator, M, Moon, mY, PANEL, Pipe,
  PXM, Redwood, rgba, scatter, Stamp, Still, Sun, TenLine, Thread, trunkHalf, V, VBracket, VS, WATER, AIRF,
} from '../lib/trees';
import {cue, dur} from './motion';

type P = [number, number];
const sig = createSignal;
const ease = easeInOutCubic;
const val = (v: any) => (typeof v === 'function' ? v() : v);
const on = (s: any, d = 0.6) => function* () { yield* s(1, d, ease); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const HEAVY = rgba(C.chalk, 0.5); // denser chalk fill (mercury, packed sap)

// typewriter text: the line writes itself as p goes 0..1
const Type = ({text, p, ...rest}: any) => (
  <Label text={() => text.slice(0, Math.round(clamp(val(p)) * text.length))} {...rest} />
);

// ------------------------------------------------------------------ the brief (S01, S02, S04)
// sheet on the left, 30-storey building on the right with the 10 m line at its lower floors
const SHEET = {x: -280, y: 0, w: 1080, h: 760};
const SPECS = ['1. Lift water above 30 storeys', '2. No pump, no motor, no moving parts', '3. No suction'];
const BLD = {x: 600, w: 200};
const Sheet = ({x = SHEET.x, y = SHEET.y, w = SHEET.w, h = SHEET.h, children, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w} height={h} radius={14} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
    {Array.from({length: Math.floor(w / 80) - 1}, (_, i) => (
      <Line points={[[-w / 2 + 80 * (i + 1), -h / 2 + 10], [-w / 2 + 80 * (i + 1), h / 2 - 10]]} stroke={C.grid} lineWidth={1} opacity={0.6} />
    ))}
    {Array.from({length: Math.floor(h / 80) - 1}, (_, i) => (
      <Line points={[[-w / 2 + 10, -h / 2 + 80 * (i + 1)], [w / 2 - 10, -h / 2 + 80 * (i + 1)]]} stroke={C.grid} lineWidth={1} opacity={0.6} />
    ))}
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => (
      <Node x={sx * (w / 2 - 26)} y={sy * (h / 2 - 26)}>
        <Line points={[[-14, 0], [14, 0]]} stroke={M} lineWidth={LW.hairline} />
        <Line points={[[0, -14], [0, 14]]} stroke={M} lineWidth={LW.hairline} />
        <Circle size={14} stroke={M} lineWidth={LW.hairline} />
      </Node>
    ))}
    {children}
  </Node>
);
const AttemptBox = ({x = 0, y = 0, w = 320, h = 220, n = 1, name = '', stamp = 0, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w} height={h} radius={12} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
    <Label text={`Attempt ${n}`} y={name ? -h / 2 + 50 : 0} spacing={1} />
    {name ? <Small text={name} y={-h / 2 + 100} color={C.chalk} /> : null}
    <Stamp x={name ? 0 : 20} y={name ? h / 2 - 55 : 60} on={stamp} />
  </Node>
);
// building growing from its base (scale in y), the 10 m line across its lower floors
const BriefBuilding = ({grow = 1, ten = 1}: any) => (
  <Node>
    <Node x={BLD.x} y={GROUND} scaleY={() => Math.max(0.001, val(grow))}><Building w={BLD.w} /></Node>
    <TenLine x0={BLD.x - 170} x1={BLD.x + 140} p={ten} />
  </Node>
);

// ------------------------------------------------------------------ the well (S05, S07, S10): basin, pipe, hand pump
const WL = {px: 0, top: -300, surf: 250, bot: 360, pw: 64};
const levelY = (lv: number) => WL.surf - lv * (WL.surf - WL.top);
const Well = ({level = 0, pumping = 1, line = null as any, children}: any) => {
  const yl = () => levelY(val(level));
  const ang = () => -12 + 16 * Math.sin(T() * 4.2) * val(pumping);
  return (
    <Node>
      {/* basin of open water */}
      <Rect x={-150} y={(WL.surf + 395) / 2} width={1100} height={395 - WL.surf} fill={WATER} />
      <Line points={[[-700, 200], [-700, 395], [400, 395], [400, 200]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />
      <Line points={[[-700, WL.surf], [400, WL.surf]]} stroke={C.chalk} lineWidth={LW.hairline} opacity={0.8} />
      {/* water column inside the pipe */}
      <Rect x={WL.px} y={() => (yl() + WL.bot) / 2} width={WL.pw - 8} height={() => WL.bot - yl()} fill={C.bg} />
      <Rect x={WL.px} y={() => (yl() + WL.bot) / 2} width={WL.pw - 8} height={() => WL.bot - yl()} fill={HEAVY} opacity={0.55} />
      <Line points={() => [[WL.px - WL.pw / 2 + 4, yl()], [WL.px + WL.pw / 2 - 4, yl()]]} stroke={C.chalk} lineWidth={LW.structure} />
      {children}
      {/* pipe walls */}
      <Line points={[[WL.px - WL.pw / 2, WL.bot], [WL.px - WL.pw / 2, WL.top]]} stroke={C.chalk} lineWidth={LW.structure} />
      <Line points={[[WL.px + WL.pw / 2, WL.bot], [WL.px + WL.pw / 2, WL.top]]} stroke={C.chalk} lineWidth={LW.structure} />
      {/* hand pump */}
      <Rect x={WL.px} y={WL.top - 50} width={130} height={100} radius={14} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
      <Line points={[[WL.px - 65, WL.top - 30], [WL.px - 130, WL.top - 30], [WL.px - 130, WL.top + 10]]} stroke={C.chalk} lineWidth={LW.structure} radius={10} />
      <Node x={WL.px + 55} y={WL.top - 100} rotation={ang}>
        <Line points={[[0, 0], [230, 0]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
        <Circle size={22} fill={C.chalk} />
      </Node>
      <Line points={() => [[WL.px, WL.top - 100], [WL.px, WL.top - 40]]} stroke={C.chalk} lineWidth={LW.structure} />
      {line}
    </Node>
  );
};

// ------------------------------------------------------------------ small drawings
// broadleaf tree for the window scene
const LeafyTree = ({x = 0, y = 0, dashes = 0}: any) => (
  <Node x={x} y={y}>
    {[[-120, -190, 230], [60, -260, 250], [170, -150, 210], [-20, -110, 220], [-180, -60, 160], [150, -40, 170]].map(([cx, cy, s]) => (
      <Circle x={cx} y={cy} size={s} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
    ))}
    <Line closed points={[[-40, 300], [-22, 40], [-90, -40], [-70, -50], [-8, 10], [6, -90], [26, -90], [24, 10], [90, -60], [104, -44], [30, 50], [44, 300]]}
      stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} lineJoin="round" />
    {/* the job being done: violet dashes rising up the trunk into the branches */}
    <Node opacity={dashes}>
      {[[[2, 290], [2, 30], [-70, -40]], [[2, 290], [8, 30], [16, -80]], [[2, 290], [12, 30], [92, -50]]].map(pts => (
        <Line points={pts as P[]} stroke={V} lineWidth={LW.emphasis} lineCap="round" lineDash={[14, 22]} lineDashOffset={() => T() * 46}
          radius={30} shadowColor={V} shadowBlur={10} />
      ))}
    </Node>
  </Node>
);
const Window = ({x = 0, y = 0, w = 1000, h = 680}: any) => (
  <Node x={x} y={y}>
    <Rect width={w} height={h} radius={8} stroke={C.chalk} lineWidth={LW.emphasis} />
    <Rect width={w - 50} height={h - 50} radius={4} stroke={C.chalk} lineWidth={LW.hairline} />
    <Rect y={h / 2 + 22} width={w + 80} height={34} radius={6} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
  </Node>
);
const Leaf = ({x = 0, y = 0, rot = 0, w = 60, h = 130, stroke = C.chalk}: any) => (
  <Node x={x} y={y} rotation={rot}>
    <Spline closed smoothness={0.55} points={[[0, -h / 2], [w / 2, -h / 8], [w / 3, h / 4], [0, h / 2], [-w / 3, h / 4], [-w / 2, -h / 8]]}
      stroke={stroke} lineWidth={LW.structure} fill={C.bg} />
    <Line points={[[0, -h / 2 + 10], [0, h / 2 - 6]]} stroke={stroke} lineWidth={LW.hairline} />
  </Node>
);
// air: stippled chalk dots
const Stipple = ({pts, size = 7, opacity = 1, dy = null as any}: any) => (
  <Node opacity={opacity}>
    {pts.map(([x, y]: P, i: number) => <Circle x={x} y={dy ? () => y + dy(i) : y} size={size} fill={C.chalk} opacity={0.55} />)}
  </Node>
);
const Leader = ({from, to, opacity = 1}: any) => <Line points={[from, to]} stroke={M} lineWidth={LW.hairline} opacity={opacity} />;

// pressure scale for S29/S30: zero fixed at y = Z0, k px per atmosphere (signal)
const AX = -150, Z0 = -320;
const atY = (p: number, k: number) => Z0 - p * k;

export const ANIM: Record<string, () => Built> = {
  // ================================================================ 0. hook (before the intro sting)
  // S00a: HERO 8 (3D). The overlay stays empty so the hook opens clean: only the 3D threads through the 1 s beat.
  S00a: () => ({
    drift: false, overlay: true,
    base: <Node />,
    steps: [null],
  }),
  S00b: () => {
    const v = sig(0.62), neg = sig(0), lab = sig(0);
    return {
      base: <Node>
        <Dial x={0} y={170} r={320} v={v} neg={neg} />
        <Label text="below zero" x={-360} y={-40} offset={[1, 0]} color={V} spacing={2} opacity={lab} />
      </Node>,
      steps: [
        function* () { yield* all(v(-0.7, 1.0, ease), delay(0.35, neg(1, 0.6, ease)), delay(0.45, lab(1, 0.6, ease))); },
      ],
      ambient: function* () { yield* v(0.12, cue('S00b', 0), easeInOutCubic); },
    };
  },
  S00c: () => {
    const taut = sig(0), snap = sig(0), drop = sig(0), dead = sig(0);
    const leaves: [number, number, number][] = [[-120, -400, -60], [-40, -430, -20], [50, -440, 20], [130, -405, 60], [-80, -350, -40], [90, -350, 40]];
    const GAP = 90;
    return {
      base: <Node>
        <Line points={[[-150, -380], [150, -380]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
        <Node opacity={() => 1 - dead()}>{leaves.map(([x, y, r]) => <Leaf x={x} y={y} rot={r} />)}</Node>
        <Node opacity={dead}>{leaves.map(([x, y, r]) => <Leaf x={x} y={y} rot={r} stroke={M} />)}</Node>
        {/* the rope of water: slack, then taut (violet = the pull); after the snap the tension is gone (muted) */}
        <Spline smoothness={0.6} lineCap="round" lineWidth={LW.emphasis}
          stroke={() => (snap() > 0.5 ? M : V)} shadowColor={V} shadowBlur={() => (snap() > 0.5 ? 0 : 6 + 16 * taut())}
          points={() => {
            const yb = snap() > 0.5 ? lerp(GAP - 10, -150, snap() * 2 - 1) : 580;
            const sag = 60 * (1 - taut());
            return [[0, -370], [sag, (yb - 370) / 2 - 140], [sag * 0.4, (yb - 370) / 2 + 60], [0, yb]] as P[];
          }} />
        {/* the lower part drops away */}
        <Line points={[[0, GAP + 10], [0, 640]]} stroke={M} lineWidth={LW.emphasis} lineCap="round" y={() => drop() * 520}
          opacity={() => (snap() > 0.5 ? 1 - drop() : 0)} />
        <Node opacity={() => (snap() > 0.5 ? 1 - drop() : 0)}>
          {[[-30, GAP - 6], [30, GAP + 4], [-18, GAP + 22], [22, GAP - 20]].map(([x, y]) => (
            <Line points={[[x * 0.4, y], [x, y + (y - GAP) * 0.6]]} stroke={M} lineWidth={LW.structure} lineCap="round" />
          ))}
        </Node>
      </Node>,
      steps: [
        function* () { yield* taut(1, 0.8, ease); },
        function* () { yield* all(snap(1, 0.5, easeOutCubic), drop(1, 1.1, (t: number) => t * t)); },
        function* () { yield* dead(1, 0.8, ease); },
      ],
    };
  },
  S00d: () => {
    const grow = sig(0), out = sig(1);
    const PX = -380, top = 22;
    return {
      base: <Node opacity={out}>
        <Ground x0={-700} x1={620} />
        {/* a suction pump: water stuck at the 10 m line, however tall the pipe */}
        <Rect x={PX} y={GROUND + 18} width={220} height={36} fill={WATER} />
        <Rect x={PX} y={(mY(10) + GROUND + 20) / 2} width={28} height={GROUND + 20 - mY(10)} fill={HEAVY} />
        <Line points={[[PX - 18, GROUND + 24], [PX - 18, mY(top)]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[PX + 18, GROUND + 24], [PX + 18, mY(top)]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={PX} y={mY(top) - 40} width={100} height={80} radius={12} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
        <Node x={PX + 44} y={mY(top) - 80} rotation={() => -12 + 14 * Math.sin(T() * 4.2)}>
          <Line points={[[0, 0], [170, 0]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Circle size={18} fill={C.chalk} />
        </Node>
        <TenLine x0={-620} x1={480} />
        <Node x={220} y={GROUND} scaleY={() => Math.max(0.001, grow())}><Redwood /></Node>
      </Node>,
      steps: [function* () { yield* grow(1, 1.8, easeOutCubic); }],
      // holds, then eases to the slate ground for the soft landing into the intro sting
      ambient: function* () { yield* waitFor(dur('S00d') - 0.95); yield* out(0, 0.8, ease); },
    };
  },
  // ================================================================ 1. cold open: the brief
  S01: () => {
    const sheet = sig(0), title = sig(0), s1 = sig(0), s2 = sig(0), s3 = sig(0), grow = sig(0), ten = sig(0);
    return {
      base: <Node>
        <Node y={() => (1 - sheet()) * 60} opacity={sheet}>
          <Sheet>
            <Type text="THE BRIEF" p={title} x={-480} y={-280} size={88} spacing={6} offset={[-1, 0]} />
            {SPECS.map((t, i) => <Type text={t} p={[s1, s2, s3][i]} x={-480} y={-120 + i * 110} spacing={1} offset={[-1, 0]} />)}
          </Sheet>
        </Node>
        <BriefBuilding grow={grow} ten={ten} />
      </Node>,
      steps: [
        function* () { yield* all(grow(1, 1.4, easeOutCubic), s1(1, 1.2, linear)); },
        function* () { yield* s2(1, 1.4, linear); },
        function* () { yield* all(s3(1, 0.8, linear), ten(1, 0.9, ease)); },
      ],
      ambient: function* () { yield* sheet(1, 0.7, ease); yield* title(1, 0.9, linear); },
    };
  },
  S02: () => {
    const brief = sig(1), win = sig(0), dashes = sig(0);
    return {
      base: <Node>
        <Node opacity={brief}>
          <Sheet>
            <Label text="THE BRIEF" x={-480} y={-280} size={88} spacing={6} offset={[-1, 0]} />
            {SPECS.map((t, i) => <Label text={t} x={-480} y={-120 + i * 110} spacing={1} offset={[-1, 0]} />)}
          </Sheet>
          <BriefBuilding />
        </Node>
        <Node opacity={win}>
          <Sun x={-330} y={-240} r={46} />
          <Window y={-30} />
          <LeafyTree x={120} y={0} dashes={dashes} />
        </Node>
        <Label text="right now" x={560} y={250} offset={[-1, 0]} spacing={1} color={V} opacity={dashes} />
      </Node>,
      steps: [
        function* () { yield* all(brief(0, 0.5), delay(0.2, win(1, 0.7, ease))); },
        on(dashes, 0.8),
      ],
    };
  },
  S03: () => ({
    drift: false, overlay: true,
    base: <Node><Locator focus="whole" /></Node>,
    steps: [
      <Backed text="Hyperion · coast redwood" font="label" x={-864} y={250} />,
      <Backed text="≈ 116 m" font="num" x={-864} y={345} />,
    ],
  }),
  S04: () => {
    const boxes = sig(0), out = sig(1);
    return {
      base: <Node opacity={out}>
        <Sheet>
          <Label text="THE BRIEF" x={-480} y={-280} size={88} spacing={6} offset={[-1, 0]} />
          <Node opacity={boxes}>
            {[1, 2, 3].map((n, i) => <AttemptBox n={n} x={-360 + i * 360} y={40} />)}
          </Node>
        </Sheet>
        <BriefBuilding />
      </Node>,
      steps: [on(boxes, 0.7)],
    };
  },

  // ================================================================ 2. attempt one: suck it up
  S05: () => {
    const lv = sig(0);
    return {
      base: <Node>
        <AttemptTag n={1} name="suck it up" />
        <Well level={lv} />
      </Node>,
      steps: [function* () { yield* lv(0.32, 1.8, ease); }],
    };
  },
  S06: () => {
    const push = sig(1);
    return {
      drift: false,
      base: <Node>
        <Node scale={push}><Still name="magdeburg-1672.png" w={1920} h={1080} /></Node>
        <Backed text="Magdeburg hemispheres experiment, engraving, 1672 (public domain)" x={-864} y={380} />
      </Node>,
      steps: [function* () { yield* push(1.09, dur('S06') - cue('S06', 0), linear); }],
      ambient: function* () { yield* push(1.015, cue('S06', 0), linear); },
    };
  },
  S07: () => {
    const STOP = 0.62, lv = sig(0.3), lab = sig(0);
    const ys = levelY(STOP);
    return {
      base: <Node>
        <AttemptTag n={1} name="suck it up" />
        <Well level={lv} line={
          <Node opacity={lab}>
            <Line points={[[WL.px - 90, ys], [WL.px + 140, ys]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[16, 12]} />
            <Num text="≈ 18 braccia" x={WL.px + 170} y={ys - 34} offset={[-1, 0]} />
            <Num text="≈ 10-11 m" x={WL.px + 170} y={ys + 34} offset={[-1, 0]} color={M} size={44} />
          </Node>
        } />
      </Node>,
      steps: [on(lab, 0.5)],
      // the column climbs and stops dead at the line on 'eighteen braccia'; the handle keeps working
      ambient: function* () { yield* lv(STOP, cue('S07', 0) + 0.3, easeOutCubic); },
    };
  },
  S08: () => {
    const dim = sig(0), lab = sig(0);
    return {
      base: <Node>
        <Node opacity={() => 1 - 0.6 * dim()}>
          <Rect y={-40} width={900} height={440} radius={16} fill={C.panel} stroke={() => (dim() > 0.5 ? M : C.chalk)} lineWidth={LW.structure} />
          <Title text="Galileo, 1630" y={-130} color={() => (dim() > 0.5 ? M : C.chalk)} />
          <Num text="?" y={40} size={150} color={() => (dim() > 0.5 ? M : C.chalk)} />
        </Node>
        <Label text="no explanation" y={290} spacing={1} opacity={lab} />
      </Node>,
      steps: [
        function* () { yield* all(dim(1, 0.6, ease), delay(0.3, lab(1, 0.6, ease))); },
      ],
    };
  },
  S09: () => {
    const tube = sig(0), col = sig(0), succ = sig(0), name = sig(0);
    const TX = -330;
    return {
      base: <Node>
        {/* dish of mercury */}
        <Rect x={TX} y={290} width={450} height={76} fill={HEAVY} />
        <Line points={[[TX - 245, 200], [TX - 225, 330], [TX + 225, 330], [TX + 245, 200]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />
        {/* the column in the upturned tube; empty space above it */}
        <Rect x={TX} y={() => lerp(300, 300 - 380 / 2, col())} width={52} height={() => 380 * col() + 4} fill={HEAVY} />
        <Line points={[[TX - 30, 300], [TX - 30, -340], [TX + 30, -340], [TX + 30, 300]]} stroke={C.chalk} lineWidth={LW.structure} radius={24} end={tube} />
        <Label text="Evangelista Torricelli, 1643-44" x={-120} y={-120} offset={[-1, 0]} spacing={1} opacity={name} />
        <Small text="Galileo's successor in Florence" x={-120} y={-50} offset={[-1, 0]} color={C.chalk} opacity={succ} />
      </Node>,
      steps: [
        function* () { yield* all(tube(1, 0.9, ease), name(1, 0.6, ease)); yield* col(1, 1.0, easeOutCubic); },
      ],
      ambient: function* () {
        yield* waitFor(4.6);
        yield* succ(1, 0.6, ease);
      },
    };
  },
  S10: () => {
    const lv = sig(0.08), low = sig(0), press = sig(0);
    const outside = scatter(70, -680, 380, 110, 236, 3).filter(([x]) => Math.abs(x - WL.px) > 60);
    const inside = scatter(16, WL.px - 22, WL.px + 22, WL.top + 20, 150, 5);
    return {
      base: <Node>
        <AttemptTag n={1} name="suck it up" />
        <Well level={lv}>
          {/* air inside the pipe above the water: thins out when the pressure drops */}
          <Node opacity={() => 1 - 0.8 * low()}>
            {inside.map(([x, y], i) => <Circle x={x} y={y} size={7} fill={C.chalk} opacity={() => (y < levelY(lv()) - 8 ? (i % 4 === 0 || low() < 0.5 ? 0.6 : 0) : 0)} />)}
          </Node>
        </Well>
        {/* the air outside: a stippled blanket pressing down on the open water */}
        <Stipple pts={outside} dy={(i: number) => press() * (fract(T() / 1.6 + i * 0.137) * 34 - 17)} />
        <Small text="low pressure" x={WL.px + 70} y={-170} offset={[-1, 0]} color={C.chalk} opacity={low} />
        <Small text="the air pushes" x={120} y={70} offset={[-1, 0]} color={C.chalk} opacity={press} />
      </Node>,
      steps: [
        on(low, 0.6),
        function* () { yield* all(press(1, 0.6, ease), lv(0.55, 3.2, ease)); },
      ],
    };
  },
  S11: () => {
    const th = sig(-9), lab = sig(0), vac = sig(0);
    const L = 400, PY = 150;
    const end = (s: number) => (): P => [s * L * Math.cos((th() * Math.PI) / 180), PY + s * L * Math.sin((th() * Math.PI) / 180)];
    const air = scatter(90, -90, 90, -540, 0, 11);
    const top = scatter(10, -36, 36, -540, -400, 13);
    const colH = 380; // water column ≈ 10 m
    return {
      base: <Node>
        {/* fulcrum and beam */}
        <Line closed points={[[0, PY], [-46, PY + 90], [46, PY + 90]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={() => [end(-1)(), end(1)()]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
        {/* left pan: a tall column of air (stipple fading upward: the atmosphere goes on) */}
        <Node position={end(-1) as any}>
          <Line points={[[-100, 60], [0, 0], [100, 60]]} stroke={M} lineWidth={LW.hairline} />
          <Line points={[[-130, 60], [130, 60]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
          <Node y={56}>
            {air.map(([x, y]) => <Circle x={x} y={y} size={7} fill={C.chalk} opacity={0.65 * (1 + y / 540)} />)}
          </Node>
          <Small text="air" y={100} color={C.chalk} />
        </Node>
        {/* right pan: a sealed tube with the water column; the space above it */}
        <Node position={end(1) as any}>
          <Line points={[[-100, 60], [0, 0], [100, 60]]} stroke={M} lineWidth={LW.hairline} />
          <Line points={[[-130, 60], [130, 60]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
          <Rect y={56 - colH / 2} width={84} height={colH} fill={WATER} />
          <Line points={[[-42, 56 - colH], [42, 56 - colH]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Node y={56}>{top.map(([x, y]) => <Circle x={x} y={y} size={7} fill={C.chalk} opacity={() => 0.6 * (1 - vac())} />)}</Node>
          <Rect y={56 - 270} width={96} height={540} radius={[40, 40, 0, 0]} stroke={C.chalk} lineWidth={LW.structure} />
        </Node>
        <Node opacity={lab}>
          <VBracket x={L + 90} y0={PY + 56} y1={PY + 56 - colH} />
          <Small text="≈ 10 m at sea level" x={L + 120} y={PY + 56 - colH / 2} offset={[-1, 0]} color={C.chalk} />
        </Node>
        <Small text="perfect vacuum" x={L + 120} y={PY + 56 - colH - 70} offset={[-1, 0]} color={C.chalk} opacity={vac} />
      </Node>,
      steps: [
        function* () { yield* all(th(0, 1.4, easeOutCubic), lab(1, 0.8, ease)); },
        on(vac, 0.8),
      ],
      ambient: function* () { yield* th(-4, cue('S11', 0), ease); },
    };
  },
  S12: () => {
    const grow = sig(0), stamp = sig(0);
    return {
      base: <Node>
        <AttemptTag n={1} name="suck it up" stamp={stamp} />
        <Ground />
        <TenLine x0={-620} x1={480} />
        <Node y={GROUND} scaleY={() => Math.max(0.001, grow())}><Redwood /></Node>
        <Node opacity={() => clamp(grow() * 2 - 1)}>
          <Num text="≈ 116 m" x={130} y={mY(116)} offset={[-1, 0]} />
          <VBracket x={-260} y0={mY(10)} y1={mY(116)} />
          <Num text="×10+" x={-300} y={mY(60)} offset={[1, 0]} />
        </Node>
        <Locator focus="whole" />
      </Node>,
      steps: [
        function* () { yield* grow(1, 1.8, easeOutCubic); },
        function* () { yield* stamp(1, 0.4, ease); },
      ],
    };
  },

  // ================================================================ 3. attempt two: push from below
  S13: () => {
    const roots = sig(0), pack = sig(0), water = sig(0), rise = sig(0), moon = sig(0), gauge = sig(0);
    const SX = -100, GY = 40;
    const soil = scatter(46, -760, 560, GY + 30, 400, 21);
    const packed = Array.from({length: 18}, (_, i) => [SX + ((i % 3) - 1) * 12, 380 - Math.floor(i / 3) * 30] as P);
    const src = scatter(18, -560, 360, 140, 390, 9);
    // roots: quadratic curves from a junction on the main root out to a tip
    const qb = (a: P, c: P, b: P, t: number): P => [
      (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
    const R: [P, P, P][] = [
      [[SX - 20, 110], [-300, 120], [-560, 260]], [[SX - 20, 200], [-260, 230], [-430, 390]], [[SX - 20, 290], [-200, 330], [-260, 400]],
      [[SX + 20, 130], [150, 140], [380, 270]], [[SX + 20, 230], [140, 260], [280, 390]], [[-300, 152], [-420, 140], [-520, 150]],
      [[160, 168], [260, 150], [330, 160]],
    ];
    const curve = (r: [P, P, P]) => Array.from({length: 25}, (_, i) => qb(r[0], r[1], r[2], i / 24));
    const top = () => lerp(400, -320, rise());
    return {
      base: <Node>
        <AttemptTag n={2} name="push from below" />
        <Line points={[[-820, GY], [640, GY]]} stroke={M} lineWidth={LW.structure} />
        {soil.map(([x, y]) => <Circle x={x} y={y} size={6} fill={C.grid} />)}
        {/* stem and main root: the central water pipe, filling from below */}
        <Rect x={SX} y={() => (top() + 400) / 2} width={40} height={() => 400 - top()} fill={WATER} />
        <Line points={() => [[SX - 20, top()], [SX + 20, top()]]} stroke={C.chalk} lineWidth={LW.structure} opacity={() => clamp(rise() * 8)} />
        <Line points={[[SX - 24, 400], [SX - 24, -340]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[SX + 24, 400], [SX + 24, -340]]} stroke={C.chalk} lineWidth={LW.structure} />
        {R.map((r, i) => <Line points={curve(r)} stroke={C.chalk} lineWidth={i < 5 ? LW.structure : LW.hairline + 1} lineCap="round" end={roots} />)}
        {/* minerals packed into the pipe */}
        {packed.map((p, i) => <Circle position={() => [lerp(src[i][0], p[0], pack()), lerp(src[i][1], p[1], pack())] as P} size={12} fill={C.chalk}
          opacity={() => clamp(pack() * 4)} />)}
        {/* water following in from the soil: chalk dots travelling along the roots to the pipe (no arrowheads) */}
        <Node opacity={water}>
          {R.slice(0, 5).flatMap((r, i) => [0, 1, 2].map(k => {
            const u = () => fract(T() / 2.4 + k / 3 + i * 0.21);
            return <Circle position={() => qb(r[0], r[1], r[2], 1 - u())} size={13} fill={C.chalk} opacity={() => Math.min(1, u() * 5, (1 - u()) * 5)} />;
          }))}
        </Node>
        <Node opacity={() => clamp(water() * 3)}>
          <Line points={[[SX + 24, -60], [300, -60]]} stroke={C.chalk} lineWidth={LW.hairline + 1} />
          <Dial x={420} y={-60} r={120} v={() => -0.9 + 1.5 * gauge()} zero={false} />
          <Label text="minerals in, water follows" x={20} y={-260} offset={[-1, 0]} spacing={1} />
        </Node>
        <Moon x={-560} y={-210} r={56} opacity={moon} />
        <Locator focus="roots" />
      </Node>,
      steps: [
        function* () { yield* pack(1, 1.6, ease); },
        function* () { yield* all(water(1, 0.8, ease), gauge(0.15, 0.8), rise(0.75, 4.0, ease)); yield* gauge(1, 2.6, ease); },
        on(moon, 0.6),
      ],
      ambient: function* () { yield* waitFor(4.4); yield* roots(1, 1.4, ease); },
    };
  },
  S14: () => {
    const grow = sig(0), lab = sig(0);
    const drops: [number, number, number][] = [[338, -268, 26], [196, -170, 16], [64, -40, 18], [-40, 120, 14], [100, -60, 12], [250, -150, 13]];
    return {
      base: <Node>
        <Moon x={-640} y={-300} r={54} />
        <Spline closed smoothness={0.4} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg}
          points={[[-110, 420], [-90, 200], [-20, 20], [110, -150], [330, -300], [150, -120], [60, 30], [10, 210], [10, 420]]} />
        <Line points={[[-50, 420], [-30, 200], [40, 20], [180, -150], [320, -290]]} stroke={C.chalk} lineWidth={LW.hairline} opacity={0.6} />
        {drops.map(([x, y, r], i) => (
          <Node x={x} y={y + r * 0.8} scale={() => clamp(grow() * 1.4 - i * 0.08) * (0.9 + 0.1 * Math.sin(T() * 2 + i))}>
            <Drop r={r} />
          </Node>
        ))}
        <Node opacity={lab}>
          <Label text="guttation" x={-820} y={40} offset={[-1, 0]} spacing={2} />
          <Small text="not dew" x={-820} y={100} offset={[-1, 0]} color={C.chalk} />
        </Node>
        <Locator focus="leaf" />
      </Node>,
      steps: [
        function* () { yield* grow(1, 2.4, ease); },
        on(lab, 0.6),
      ],
    };
  },
  S15: () => {
    const drip = sig(0);
    const Dripper = ({x, y, period = 1.4, phase = 0}: any) => (
      <Node opacity={drip}>
        {[0, 1].map(k => {
          const u = () => fract(T() / period + k / 2 + phase);
          return <Node x={x} y={() => y + (u() < 0.45 ? 0 : (u() - 0.45) ** 2 * 1300)} scale={() => (u() < 0.45 ? 0.3 + u() * 1.55 : 1)}
            opacity={() => (u() > 0.92 ? 0 : 1)}><Drop r={14} /></Node>;
        })}
      </Node>
    );
    return {
      base: <Node>
        <Small text="spring" x={-860} y={-400} offset={[-1, 0]} color={C.chalk} />
        {/* cut birch branch with birch-bark dashes */}
        <Node x={-560} y={-110} rotation={6}>
          <Rect width={600} height={70} radius={[30, 0, 0, 30]} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
          {scatter(16, -270, 260, -26, 26, 4).map(([x, y]) => <Line points={[[x, y], [x + 26, y]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" opacity={0.7} />)}
          <Circle x={300} width={26} height={70} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
        </Node>
        <Dripper x={-262} y={-40} period={1.5} />
        <Small text="birch" x={-560} y={20} color={C.chalk} />
        {/* grapevine cane with nodes */}
        <Node x={340} y={-200} rotation={4}>
          <Rect width={520} height={36} radius={[18, 0, 0, 18]} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
          {[-160, 0, 160].map(x => <Rect x={x} width={16} height={48} radius={8} stroke={C.chalk} lineWidth={LW.hairline + 1} fill={C.bg} />)}
          <Circle x={260} width={16} height={36} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
        </Node>
        <Dripper x={598} y={-160} period={1.25} phase={0.3} />
        <Small text="grapevine" x={330} y={-100} color={C.chalk} />
        <Locator focus="trunk" />
      </Node>,
      steps: [on(drip, 0.5)],
    };
  },
  S16: () => {
    const push = sig(1);
    return {
      drift: false,
      base: <Node>
        <Node scale={push}><Still name="maple-sap-lines.png" w={1920} h={1080} /></Node>
        <Backed text="USDA Forest Service (public domain)" x={864} y={380} anchor={[1, 0]} />
      </Node>,
      steps: [<Backed text="maple sap: freeze-thaw in the trunk" font="label" x={-864} y={290} />],
      ambient: function* () { yield* push(1.06, dur('S16'), linear); },
    };
  },
  S17: () => {
    const push = sig(0), tower = sig(0);
    const TX = 150, top = 12;
    return {
      base: <Node>
        <AttemptTag n={2} name="push from below" />
        <Ground />
        <Redwood x={TX} y={GROUND} opacity={() => 0.35 + 0.65 * tower()} />
        <Rect x={TX} y={() => GROUND - (top * PXM * push()) / 2} width={trunkHalf(0.02) * 1.5} height={() => top * PXM * push()} fill={HEAVY} />
        <Line points={() => [[TX - 26, mY(top * push())], [TX + 26, mY(top * push())]]} stroke={C.chalk} lineWidth={LW.structure} opacity={() => clamp(push() * 5)} />
        <Node opacity={() => clamp(push() * 2 - 1)}>
          <Leader from={[TX - 40, mY(top)]} to={[TX - 110, mY(top)]} />
          <Label text="root push: a few storeys" x={TX - 125} y={mY(top)} offset={[1, 0]} spacing={1} />
        </Node>
        <Node opacity={tower}>
          <VBracket x={TX + 190} y0={mY(top)} y1={mY(116)} color={M} />
        </Node>
        <Locator focus="whole" />
      </Node>,
      steps: [
        function* () { yield* push(1, 1.0, easeOutCubic); },
        on(tower, 0.8),
      ],
    };
  },
  S18: () => {
    const v = sig(0.35), neg = sig(0), stamp = sig(0);
    const TRX = -440;
    return {
      base: <Node>
        <AttemptTag n={2} name="push from below" stamp={stamp} />
        <Sun x={-760} y={-230} r={40} />
        {/* trunk with bark marks and a clamp */}
        <Line points={[[TRX - 70, -330], [TRX - 70, 420]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[TRX + 70, -330], [TRX + 70, 420]]} stroke={C.chalk} lineWidth={LW.structure} />
        {scatter(12, TRX - 50, TRX + 50, -300, 400, 31).map(([x, y]) => <Line points={[[x, y], [x, y + 40]]} stroke={C.chalk} lineWidth={LW.hairline} opacity={0.5} />)}
        <Rect x={TRX} y={120} width={190} height={56} radius={10} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
        <Line points={[[TRX + 95, 120], [260, 120], [260, 100]]} stroke={C.chalk} lineWidth={LW.hairline + 1} radius={10} />
        <Dial x={260} y={100} r={230} v={v} neg={neg} />
        <Label text="pulled" x={-10} y={-90} offset={[1, 0]} color={V} spacing={2} opacity={neg} />
        <Locator focus="trunk" />
      </Node>,
      steps: [
        function* () { yield* v(-0.62, 1.1, ease); },
        function* () { yield* all(neg(1, 0.6, ease), delay(0.3, stamp(1, 0.4, ease))); },
      ],
    };
  },

  // ================================================================ 4. attempt three: thin pipes
  S19: () => {
    const climb = sig(0), hi = sig(0);
    const tubes = [[-360, 110, 40], [-120, 70, 90], [100, 42, 170], [300, 20, 330]];
    const S = 260;
    return {
      base: <Node>
        <AttemptTag n={3} name="thin pipes" />
        <Rect x={-30} y={(S + 390) / 2} width={1000} height={390 - S} fill={WATER} />
        <Line points={[[-540, 200], [-540, 390], [480, 390], [480, 200]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />
        <Line points={[[-540, S], [480, S]]} stroke={C.chalk} lineWidth={LW.hairline} />
        {tubes.map(([x, w, rise], i) => {
          const yt = () => S - rise * climb() * (i === 3 ? 0.55 + 0.45 * hi() : 1);
          return (
            <Node x={x}>
              <Rect y={() => (yt() + 340) / 2} width={w - 6} height={() => 340 - yt()} fill={C.bg} />
              <Rect y={() => (yt() + 340) / 2} width={w - 6} height={() => 340 - yt()} fill={WATER} />
              <Spline points={() => [[-w / 2 + 3, yt() - Math.min(10, w / 5)], [0, yt()], [w / 2 - 3, yt() - Math.min(10, w / 5)]]} stroke={C.chalk}
                lineWidth={LW.structure} smoothness={0.6} />
              <Rect y={0} width={w} height={680} radius={[w / 2, w / 2, 0, 0]} stroke={C.chalk}
                lineWidth={i === 3 ? () => LW.structure + 3 * hi() : LW.structure} />
            </Node>
          );
        })}
        <Label text="narrower = higher" x={400} y={-170} offset={[-1, 0]} spacing={1} opacity={hi} />
      </Node>,
      steps: [
        function* () { yield* climb(1, 2.4, easeOutCubic); },
        function* () { yield* hi(1, 1.0, ease); },
      ],
    };
  },
  S20: () => {
    const sub = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <Backed text="microscopic pipes" x={-864} y={345} opacity={sub} />
        <Locator focus="wood" />
      </Node>,
      steps: [<Backed text="xylem" font="label" x={-864} y={260} />],
      ambient: function* () { yield* waitFor(6.3); yield* sub(1, 0.6, ease); },
    };
  },
  S21: () => {
    const nb = sig(0), wb = sig(0);
    const X0 = -600, MM = 1200;
    return {
      base: <Node>
        {/* 1 mm ruler: ticks every 0.1 mm */}
        <Line points={[[X0, 250], [X0 + MM, 250]]} stroke={C.chalk} lineWidth={LW.structure} />
        {Array.from({length: 11}, (_, i) => (
          <Line points={[[X0 + (MM / 10) * i, 250], [X0 + (MM / 10) * i, i % 5 === 0 ? 200 : 222]]} stroke={C.chalk} lineWidth={i % 5 === 0 ? LW.structure : LW.hairline} />
        ))}
        <Num text="1 mm" x={X0 + MM} y={310} size={44} />
        <Num text="0" x={X0} y={310} size={34} color={M} />
        {/* narrow: 0.01-0.06 mm */}
        <Node opacity={() => clamp(nb() * 3)}>
          <Rect x={X0} y={-120} offset={[-1, 0]} width={() => 0.06 * MM * nb()} height={90} stroke={C.chalk} lineWidth={LW.hairline + 1} fill={WATER} />
          <Rect x={X0} y={-120} offset={[-1, 0]} width={() => 0.01 * MM * nb()} height={90} fill={C.chalk} />
          <Num text="≈ 0.01-0.06 mm" x={X0 + 110} y={-120} offset={[-1, 0]} size={44} />
        </Node>
        {/* wide: up to 0.5 mm */}
        <Node opacity={() => clamp(wb() * 3)}>
          <Rect x={X0} y={50} offset={[-1, 0]} width={() => 0.5 * MM * wb()} height={90} stroke={C.chalk} lineWidth={LW.hairline + 1} fill={WATER} />
          <Num text="up to ≈ 0.5 mm" x={X0 + 640} y={50} offset={[-1, 0]} size={44} />
        </Node>
        <Locator focus="pipe" />
      </Node>,
      steps: [
        function* () { yield* nb(1, 0.8, ease); },
        function* () { yield* wb(1, 1.0, ease); },
      ],
    };
  },
  S22: () => {
    const rise = sig(0), need = sig(0), shrink = sig(0);
    const TX = 250;
    return {
      base: <Node>
        <Ground x0={-200} x1={700} />
        <Redwood x={TX} y={GROUND} />
        <Node opacity={rise}>
          <Rect x={TX + 72} y={GROUND - 10} width={30} height={20} fill={C.chalk} />
          <Rect x={TX + 108} y={GROUND - 2} width={30} height={4} fill={C.chalk} />
          <Small text="cm to a few m" x={TX + 150} y={GROUND - 60} offset={[-1, 0]} color={C.chalk} />
        </Node>
        <Node opacity={need}>
          <VBracket x={TX + 190} y0={mY(0)} y1={mY(100)} />
          <Label text="needed: 100 m" x={TX + 220} y={mY(50)} offset={[-1, 0]} spacing={1} />
          {/* a capillary tube: how narrow it would have to be */}
          <Rect x={-520} y={20} width={() => lerp(120, 4, shrink())} height={560} radius={() => lerp(60, 2, shrink())} stroke={C.chalk} lineWidth={LW.structure} />
          <Small text="thinnest pipe" x={-520} y={-300} color={C.chalk} opacity={() => 1 - shrink()} />
        </Node>
        <Num text="≈ 30× narrower" x={-520} y={340} opacity={shrink} />
        <Locator focus="whole" />
      </Node>,
      steps: [
        on(rise, 0.6),
        function* () { yield* shrink(1, 1.4, ease); },
      ],
      ambient: function* () { yield* waitFor(7.3); yield* need(1, 0.7, ease); },
    };
  },
  S23: () => {
    const st3 = sig(0), thr = sig(0), tree = sig(0.35);
    const TX = 330;
    const names = ['suck it up', 'push from below', 'thin pipes'];
    return {
      base: <Node>
        {names.map((nm, i) => <AttemptBox n={i + 1} name={nm} x={-540} y={-250 + i * 250} w={460} h={220} stamp={i < 2 ? 1 : st3} />)}
        <Ground x0={0} x1={660} />
        <Redwood x={TX} y={GROUND} opacity={tree} />
        <Thread x={TX} y={GROUND} p={thr} />
        <Locator focus="whole" />
      </Node>,
      steps: [
        function* () { yield* st3(1, 0.4, ease); },
        function* () { yield* all(tree(1, 0.5), thr(1, 1.3, ease)); },
      ],
    };
  },

  // ================================================================ 5. nature's answer: pull from the top
  S24: () => {
    const head = sig(0);
    return {
      base: <Node>
        <Sheet x={0} y={20} w={1560} h={720}>
          <Label text="Trinity College Dublin · 1890s" y={-220} spacing={2} opacity={head} />
        </Sheet>
      </Node>,
      steps: [
        <Node x={-380} y={80}>
          <Rect width={640} height={240} radius={14} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
          <Title text="Henry Dixon" y={-30} size={72} />
          <Small text="botanist" y={50} color={C.chalk} />
        </Node>,
        <Node x={380} y={80}>
          <Rect width={640} height={240} radius={14} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
          <Title text="John Joly" y={-30} size={72} />
          <Small text="physicist" y={50} color={C.chalk} />
        </Node>,
      ],
      ambient: function* () { yield* waitFor(4.3); yield* head(1, 0.6, ease); },
    };
  },
  S25: () => {
    const poison = sig(0), lv = sig(0), dead = sig(0), eng = sig(0);
    const SX = -250;
    const leaves: [number, number, number][] = [[-80, -300, -40], [70, -330, 35], [-60, -400, -15], [55, -420, 20], [0, -470, 0], [-95, -230, -60], [90, -250, 55]];
    const yl = () => lerp(280, -190, lv());
    return {
      base: <Node>
        {/* beaker of poison */}
        <Rect x={SX} y={330} width={300} height={136} fill={WATER} />
        <Line points={[[SX - 170, 170], [SX - 160, 400], [SX + 160, 400], [SX + 170, 170]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />
        <Label text="poison" x={SX - 200} y={320} offset={[1, 0]} spacing={2} opacity={poison} />
        {/* tall cut stem; the water level inside keeps rising */}
        <Rect x={SX} y={() => (yl() + 380) / 2} width={28} height={() => 380 - yl()} fill={WATER} />
        <Line points={() => [[SX - 16, yl()], [SX + 16, yl()]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[SX - 18, 380], [SX - 18, -200]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[SX + 18, 380], [SX + 18, -200]]} stroke={C.chalk} lineWidth={LW.structure} />
        {leaves.map(([dx, dy, r]) => <Line points={[[SX, -190], [SX + dx * 0.6, dy + 40]]} stroke={C.chalk} lineWidth={LW.hairline + 1} />)}
        <Node opacity={() => 1 - dead()}>{leaves.map(([dx, dy, r]) => <Leaf x={SX + dx} y={dy} rot={r} />)}</Node>
        <Node opacity={dead}>{leaves.map(([dx, dy, r]) => <Leaf x={SX + dx} y={dy} rot={r} stroke={M} />)}</Node>
        <Node opacity={eng}>
          <Circle x={SX} y={-350} size={340} stroke={C.chalk} lineWidth={LW.hairline + 1} lineDash={[12, 10]} />
          <Label text="the engine is in the leaves" x={-40} y={-350} offset={[-1, 0]} spacing={1} />
        </Node>
        <Locator focus="crown" />
      </Node>,
      steps: [
        function* () { yield* lv(1, cue('S25', 1) - cue('S25', 0), linear); },
        function* () { yield* dead(1, 0.7, ease); },
        on(eng, 0.6),
      ],
      ambient: function* () { yield* waitFor(3.3); yield* poison(1, 0.6, ease); },
    };
  },
  S26: () => {
    const stoma = sig(0), pores = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <Backed text="stoma" font="label" x={-864} y={330} opacity={stoma} />
        <Backed text="cell wall pores ≈ 1/100,000 mm" font="label" x={-864} y={330} opacity={pores} />
        <Locator focus="leaf" />
      </Node>,
      steps: [
        on(stoma, 0.6),
        function* () { yield* stoma(0, 0.4); },
        null,
      ],
      ambient: function* () { yield* waitFor(11.2); yield* pores(1, 0.6, ease); },
    };
  },
  S27: () => ({
    drift: false, overlay: true,
    base: <Node><Locator focus="pipe" /></Node>,
    steps: [
      null,
      <Backed text="cohesion" font="label" x={-864} y={250} />,
      <Backed text="a rope of water" font="label" x={-864} y={340} color={V} />,
    ],
  }),
  S28: () => {
    const l1 = sig(0), l2 = sig(0);
    return {
      base: <Node>
        <Label text="cohesion: water clings to water" y={40} spacing={1} opacity={l1} />
        <Label text="tension: pulled from the top" y={130} spacing={1} color={V} opacity={l2} />
      </Node>,
      steps: [<Title text="COHESION-TENSION" y={-120} />],
      ambient: function* () { yield* waitFor(1.5); yield* l1(1, 0.5, ease); yield* l2(1, 0.5, ease); },
    };
  },
  S29: () => {
    const k = sig(32), y = sig(atY(1, 32)), negL = sig(0), pullL = sig(0);
    return {
      base: <Node>
        <PressureScale k={k} negLabel={negL} />
        <Drop x={AX} y={y} r={22} fill={C.bg} />
        <Num text="≈ 20 atm of pull" x={-40} y={atY(-20, 32)} offset={[-1, 0]} color={V} opacity={pullL} />
        <Locator focus="pipe" />
      </Node>,
      steps: [
        function* () { yield* y(atY(-3, 32), 1.0, ease); yield* y(atY(-9, 32), cue('S29', 1) - cue('S29', 0) - 1.0, linear); },
        function* () { yield* all(y(atY(-20, 32), 1.0, ease), delay(0.5, pullL(1, 0.6, ease))); },
      ],
      ambient: function* () { yield* waitFor(8.4); yield* negL(1, 0.6, ease); },
    };
  },
  S30: () => {
    const k = sig(32), lab = sig(0), pullL = sig(1);
    return {
      base: <Node>
        <PressureScale k={k} negLabel={() => 1 - lab()} />
        <Rect x={AX} y={() => (atY(-20, k()) + Z0) / 2} width={18} height={() => 20 * k()} fill={V} />
        <Drop x={AX} y={() => atY(-20, k())} r={22} fill={C.bg} opacity={() => pullL()} />
        <Num text="≈ 20 atm of pull" x={-40} y={() => atY(-20, k())} offset={[-1, 0]} color={V} opacity={pullL} />
        <Node opacity={lab}>
          <Rect x={AX} y={() => (atY(-260, k()) + Math.min(atY(-1400, k()), 400)) / 2} width={120}
            height={() => Math.min(atY(-1400, k()), 400) - atY(-260, k())} fill={AIRF} stroke={M} lineWidth={LW.hairline} />
          <Label text="lab limit" x={-40} y={() => (atY(-260, k()) + Math.min(atY(-1400, k()), 400)) / 2} offset={[-1, 0]} color={M} spacing={1} />
          <Label text="tree" x={-40} y={() => atY(-20, k()) + 34} offset={[-1, 0]} color={V} spacing={1} />
        </Node>
        <Locator focus="pipe" />
      </Node>,
      steps: [
        function* () { yield* all(k(0.5, 1.8, ease), pullL(0, 0.6), delay(1.0, lab(1, 0.8, ease))); },
      ],
    };
  },
  S31: () => {
    const seal = sig(0), g = sig(0), bead = sig(0), lab = sig(0);
    const CX = -250;
    const gas = scatter(40, CX - 160, CX + 160, -90, 340, 41);
    return {
      base: <Node>
        <Label text="the pressure bomb, 1965" x={-864} y={-400} offset={[-1, 0]} spacing={1} />
        {/* steel chamber with a leafy twig inside */}
        <Rect x={CX} y={120} width={380} height={480} radius={30} fill={C.panel} stroke={C.chalk} lineWidth={LW.emphasis} />
        {gas.map(([x, y], i) => <Circle x={x} y={y} size={7} fill={C.chalk} opacity={() => (i / gas.length < g() ? 0.5 : 0)} />)}
        <Line points={[[CX, -215], [CX, 300]]} stroke={C.chalk} lineWidth={LW.structure} />
        {[[-70, 40, -40], [70, 90, 40], [-70, 170, -35], [70, 230, 35], [-60, 290, -30]].map(([dx, y, r]) => (
          <Leaf x={CX + dx} y={y} rot={r} w={50} h={110} />
        ))}
        <Node y={() => (1 - seal()) * -80}>
          <Rect x={CX} y={-145} width={440} height={50} radius={8} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
          <Line points={[[CX, -170], [CX, -120]]} stroke={C.chalk} lineWidth={LW.structure} />
        </Node>
        <Circle x={CX} y={-215} width={14} height={8} fill={C.chalk} />
        <Node x={CX} y={-238} scale={bead}><Drop r={16} /></Node>
        {/* gas line and gauge */}
        <Line points={[[CX + 190, 300], [380, 300], [380, 70]]} stroke={C.chalk} lineWidth={LW.structure} radius={20} />
        <Dial x={380} y={60} r={190} v={() => -0.95 + 1.6 * g()} zero={false} />
        <Label text="balancing pressure = the pull" x={-864} y={-320} offset={[-1, 0]} spacing={1} opacity={lab} />
        <Locator focus="crown" />
      </Node>,
      steps: [
        function* () { yield* seal(1, 0.6, easeOutCubic); },
        function* () { yield* g(0.85, cue('S31', 2) - cue('S31', 1), linear); },
        function* () { yield* bead(1, 0.6, easeOutCubic); },
      ],
      ambient: function* () { yield* waitFor(11.1); yield* lab(1, 0.6, ease); },
    };
  },
  S32: () => {
    const sw = sig(0);
    const CX = -500, CY = 40, R = 220, W = 820, H = 380, PX = 330;
    const g = (u: number) => Math.exp(-(((u - 0.38) / 0.15) ** 2));
    const tx = (u: number) => PX - W / 2 + 40 + (W - 80) * u;
    return {
      base: <Node>
        {/* trunk section with a dendrometer band; radius follows the trace (exaggerated) */}
        <Node x={CX} y={CY} scale={() => 1 - 0.07 * g(sw())}>
          {[40, 80, 120, 160, 200].map(r => <Circle size={r * 2} stroke={C.chalk} lineWidth={LW.hairline} opacity={0.6} />)}
          <Circle size={R * 2} stroke={C.chalk} lineWidth={LW.structure} />
          <Circle size={R * 2 + 22} stroke={C.chalk} lineWidth={LW.emphasis} />
          <Rect y={-R - 26} width={70} height={40} radius={8} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure} />
        </Node>
        <Line points={[[CX + 30, CY - R - 26], [PX - W / 2, CY - R - 26]]} stroke={C.chalk} lineWidth={LW.hairline} />
        {/* 24 h trace */}
        <Rect x={PX} y={CY} width={W} height={H} radius={16} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
        <Line points={[[PX, CY - H / 2 + 20], [PX, CY + H / 2 - 20]]} stroke={C.grid} lineWidth={LW.hairline} />
        <Line points={[[tx(0), CY - 60], [tx(1), CY - 60]]} stroke={C.grid} lineWidth={LW.hairline} lineDash={[10, 10]} />
        <Line points={() => Array.from({length: 121}, (_, i) => i / 120).filter(u => u <= sw()).map(u => [tx(u), CY - 60 + 150 * g(u)] as P)}
          stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" lineJoin="round" />
        <Sun x={PX - W / 4} y={CY - H / 2 - 64} r={24} />
        <Small text="day" x={PX - W / 4} y={CY - H / 2 + 34} color={C.chalk} />
        <Moon x={PX + W / 4} y={CY - H / 2 - 64} r={26} />
        <Small text="night" x={PX + W / 4} y={CY - H / 2 + 34} color={C.chalk} />
        <Small text="a fraction of a millimetre" x={PX} y={CY + H / 2 + 50} />
        <Locator focus="trunk" />
      </Node>,
      steps: [
        function* () { yield* sw(0.5, 2.6, linear); },
        function* () { yield* sw(1, 1.6, linear); },
      ],
    };
  },
  S33: () => {
    const sun = sig(0), vap = sig(0.35), meter = sig(0);
    const LY = 150;
    return {
      base: <Node>
        <Sun x={-640} y={-300} r={64} stroke={C.heat} glow={() => 24 * sun()} opacity={() => 0.35 + 0.65 * sun()} />
        <Node opacity={sun}>
          <Shimmer x={-250} y={-60} n={3} h={140} />
          <Shimmer x={150} y={-60} n={3} h={140} />
        </Node>
        <LeafSection x={0} y={LY} w={1100} />
        {/* vapour (chalk) leaving the stoma */}
        <Node opacity={vap}>
          {Array.from({length: 7}, (_, i) => {
            const u = () => fract(T() / 2.2 + i / 7);
            const dx = (i % 2 ? 1 : -1) * (40 + (i * 23) % 90);
            return <Circle x={() => dx * u()} y={() => LY + 140 + u() * 110} size={14} fill={C.chalk} opacity={() => 1 - u()} />;
          })}
        </Node>
        <Label text="the sun and dry air do the work" x={-520} y={-300} offset={[-1, 0]} spacing={1} opacity={sun} />
        <Node x={560} y={-60} opacity={meter}>
          <Rect width={420} height={110} radius={14} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
          <Small text="tree's own energy:" x={-180} offset={[-1, 0]} color={C.chalk} />
          <Num text="0" x={170} offset={[1, 0]} />
        </Node>
        <Locator focus="leaf" />
      </Node>,
      steps: [
        function* () { yield* all(sun(1, 0.8, ease), vap(1, 1.2, ease)); },
        on(meter, 0.6),
      ],
    };
  },
  S34: () => {
    const line = sig(0);
    const ticks = scatter(16, -560, 600, 46, 92, 51).sort((a, b) => a[0] - b[0]);
    return {
      base: <Node>
        <Line points={[[-700, 0], [700, 0]]} stroke={C.chalk} lineWidth={LW.structure} end={line} lineCap="round" />
        {[[-620, '1890s'], [80, '1965'], [640, 'today']].map(([x, t], i) => (
          <Node opacity={() => clamp((line() - (Number(x) + 700) / 1400) * 6 + 0.2)}>
            <Circle x={Number(x)} size={22} fill={C.chalk} />
            <Num text={String(t)} x={Number(x)} y={-70} />
          </Node>
        ))}
        {/* doubters: muted tick marks that fade along the century; a few remain */}
        {ticks.map(([x, y], i) => (
          <Line points={[[x, y], [x, y + 34]]} stroke={M} lineWidth={LW.structure} lineCap="round"
            opacity={() => (i % 5 === 4 ? 0.9 : clamp(1.6 - (T() - 1.5) / 5 - (x + 560) / 900)) * clamp(line() * 3)} />
        ))}
      </Node>,
      steps: [function* () { yield* line(1, 2.4, ease); }],
    };
  },

  // ================================================================ 6. when the rope snaps
  S35: () => ({
    drift: false, overlay: true,
    base: <Node><Locator focus="pipe" /></Node>,
    steps: [
      <Backed text="air bubble" font="label" x={-864} y={250} />,
      <Backed text="blocked" font="label" x={-864} y={340} color={M} />,
      null,
    ],
  }),
  S36: () => {
    const clicks = sig(0), pulses = sig(0), lab = sig(0);
    const PX = 230, W = 1060, H = 260;
    const us = [0.12, 0.3, 0.52, 0.7, 0.88];
    const ux = (u: number) => PX - W / 2 + 40 + (W - 80) * u;
    return {
      base: <Node>
        <Line points={[[-680, -340], [-680, 420]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[-620, -340], [-620, 420]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={-570} y={0} width={90} height={70} radius={10} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[-525, 0], [PX - W / 2, 0]]} stroke={C.chalk} lineWidth={LW.hairline + 1} />
        <Rect x={PX} y={0} width={W} height={H} radius={16} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
        <Line points={[[ux(0), 30], [ux(1), 30]]} stroke={C.chalk} lineWidth={LW.structure} />
        {us.map((u, i) => (
          <Node x={ux(u)} y={30} opacity={i < 2 ? clicks : pulses}>
            <Line points={[[-14, 0], [-6, -90], [2, 50], [8, -30], [14, 0]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" fill={C.panel} />
            <Circle y={-120} size={26} stroke={M} lineWidth={LW.structure} opacity={pulses} />
          </Node>
        ))}
        <Label text="1960s: clicks" x={PX - W / 2} y={-190} offset={[-1, 0]} spacing={1} opacity={clicks} />
        <Small text="lab tests: one pulse, one bubble" x={PX - W / 2} y={190} offset={[-1, 0]} color={C.chalk} opacity={lab} />
        <Locator focus="trunk" />
      </Node>,
      steps: [on(clicks, 0.5), on(pulses, 0.6)],
      ambient: function* () { yield* waitFor(8.9); yield* lab(1, 0.6, ease); },
    };
  },
  S37: () => {
    const pits = sig(0), memL = sig(0), flow = sig(0), air = sig(0), torus = sig(0), shut = sig(0), slider = sig(0);
    const AY = -60; // pit centre
    const period = () => 2.2 + 3.5 * slider();
    return {
      base: <Node>
        {/* two neighbouring pipes, the shared wall between them, a bordered pit in the wall */}
        <Rect x={-330} y={AY} width={560} height={600} radius={30} fill={WATER} />
                <Rect x={-330} y={AY} width={560} height={600} radius={30} fill={AIRF} opacity={air} />
        <Rect x={330} y={AY} width={560} height={600} radius={30} fill={WATER} />
        <Rect x={-330} y={AY} width={560} height={600} radius={30} stroke={() => (air() > 0.5 ? M : C.chalk)} lineWidth={LW.structure} />
        <Rect x={330} y={AY} width={560} height={600} radius={30} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={0} y={AY - 205} width={100} height={190} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={0} y={AY + 205} width={100} height={190} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure} />
        <Node opacity={pits}>
          {[-1, 1].map(s => (
            <Node>
              <Line points={[[s * 50, AY - 110], [s * 12, AY - 40]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
              <Line points={[[s * 50, AY + 110], [s * 12, AY + 40]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
            </Node>
          ))}
          {/* membrane: porous (dashed) */}
          <Line points={[[0, AY - 100], [0, AY + 100]]} stroke={C.chalk} lineWidth={LW.hairline + 1} lineDash={[8, 8]} />
        </Node>
        {/* torus: the plug at the centre of a conifer pit; aspirated against the water-side aperture */}
        <Rect x={() => 26 * shut()} y={AY} width={22} height={() => 110 * torus()} radius={8} fill={C.chalk} opacity={torus} />
        {/* water passing through the membrane */}
        <Node opacity={() => flow() * (1 - shut())}>
          {Array.from({length: 6}, (_, i) => {
            const u = () => fract(T() / period() + i / 6);
            return <Circle x={() => -230 + u() * 460} y={AY + ((i % 3) - 1) * 24} size={14} fill={C.chalk} opacity={() => Math.min(1, u() * 6, (1 - u()) * 6)} />;
          })}
        </Node>
        {/* air front stops at the membrane */}
        <Node opacity={air}>
          {scatter(26, -590, -40, AY - 280, AY + 280, 61).map(([x, y]) => <Circle x={x} y={y} size={10} stroke={M} lineWidth={LW.hairline} />)}
          <Spline points={[[-40, AY - 160], [-14, AY - 60], [-10, AY], [-14, AY + 60], [-40, AY + 160]]} stroke={M} lineWidth={LW.structure} smoothness={0.6} />
        </Node>
        <Small text="pit membrane" x={20} y={AY - 330} offset={[-1, 0]} color={C.chalk} opacity={memL} />
        <Leader from={[10, AY - 305]} to={[3, AY - 110]} opacity={memL} />
        <Label text="torus" x={150} y={AY + 150} offset={[-1, 0]} spacing={2} opacity={torus} />
        <Leader from={[140, AY + 140]} to={[34, AY + 40]} opacity={torus} />
        {/* the price: safer valves are harder to push through */}
        <Node opacity={slider}>
          <Line points={[[-860, 350], [-460, 350]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
          <Circle x={() => -860 + 400 * clamp(slider() * 1.2 - 0.2)} y={350} size={34} fill={C.chalk} />
          <Label text="safer = harder to push through" x={-420} y={350} offset={[-1, 0]} spacing={1} size={40} />
        </Node>
        <Locator focus="pipe" />
      </Node>,
      steps: [
        on(flow, 0.6),
        on(air, 0.8),
        function* () { yield* torus(1, 0.4, ease); yield* waitFor(0.2); yield* shut(1, 0.18, easeOutCubic); },
        function* () { yield* all(shut(0, 0.5), slider(1, 1.6, ease)); },
      ],
      ambient: function* () {
        yield* waitFor(3.9); yield* pits(1, 0.6, ease);
        yield* waitFor(2.5); yield* memL(1, 0.6, ease);
      },
    };
  },
  S38: () => {
    const pull = sig(0.5);
    const xs = [-480, -320, -160, 0, 160, 320, 480];
    const air = xs.map(() => sig(0));
    return {
      base: <Node>
        <Label text="drought" x={-864} y={-400} offset={[-1, 0]} spacing={2} />
        {xs.map((x, i) => <Pipe x={x} y={-10} w={120} h={620} fill={1} air={air[i]} pull={pull} />)}
        <Locator focus="wood" />
      </Node>,
      steps: [
        function* () { yield* air[3](1, 0.6, ease); },
        function* () { yield* air[2](1, 0.5, ease); yield* air[4](1, 0.5, ease); yield* air[5](1, 0.5, ease); },
        function* () { yield* air[1](1, 0.5, ease); yield* air[6](1, 0.5, ease); },
      ],
      ambient: function* () { yield* pull(1, cue('S38', 0), linear); },
    };
  },
  S38b: () => {
    const push = sig(1);
    return {
      drift: false,
      base: <Node>
        <Node x={-280} y={-20} scale={push}>
          <Rect width={624} height={824} radius={6} stroke={C.chalk} lineWidth={LW.structure} />
          <Still name="sequoia-dieback-2014.png" w={600} h={800} />
        </Node>
        <Label text="Giant sequoia dieback, 2014 drought" x={100} y={-40} offset={[-1, 0]} spacing={1} size={40} />
        <Small text="N. Stephenson, USGS (public domain)" x={100} y={20} offset={[-1, 0]} />
      </Node>,
      steps: [function* () { yield* push(1.05, dur('S38b') - cue('S38b', 0), linear); }],
      ambient: function* () { yield* push(1.01, cue('S38b', 0), linear); },
    };
  },
  S39: () => {
    const ring = sig(0);
    const CX = -200, CY = 20;
    const pores = (r: number, n: number, seed: number) => Array.from({length: n}, (_, i) => {
      const a = (i / n) * Math.PI * 2 + seed;
      return [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as P;
    });
    return {
      base: <Node>
        {[80, 140, 200, 260].map((r, k) => (
          <Node>
            <Circle x={CX} y={CY} size={r * 2 + 30} stroke={M} lineWidth={LW.hairline} />
            {pores(r, Math.round(r / 12), k).map(([x, y]) => <Circle x={x} y={y} size={14} fill={AIRF} stroke={M} lineWidth={LW.hairline} />)}
          </Node>
        ))}
        <Circle x={CX} y={CY} size={590} stroke={M} lineWidth={LW.structure} />
        {/* the new ring grows outside, its pipes full of water */}
        <Circle x={CX} y={CY} size={() => 590 + 130 * ring()} stroke={C.chalk} lineWidth={LW.structure} opacity={() => clamp(ring() * 4)} />
        <Node opacity={() => clamp(ring() * 2 - 0.6)}>
          {pores(327, 34, 0.3).map(([x, y]) => <Circle x={x} y={y} size={18} fill={WATER} stroke={C.chalk} lineWidth={LW.hairline + 1} />)}
        </Node>
        <Node opacity={() => clamp(ring() * 2 - 1)}>
          <Leader from={[CX + 250, CY - 250]} to={[CX + 380, CY - 330]} />
          <Label text="new wood" x={CX + 400} y={CY - 340} offset={[-1, 0]} spacing={2} />
        </Node>
        <Locator focus="wood" />
      </Node>,
      steps: [function* () { yield* ring(1, 1.6, ease); }],
    };
  },

  // ================================================================ 7. the ceiling
  S40: () => {
    const q = sig(0), ticks = sig(0), lab = sig(0), crown = sig(0);
    const TX = 0;
    return {
      base: <Node>
        <Ground x0={-500} x1={500} />
        <Redwood x={TX} y={GROUND} />
        <Node opacity={q}>
          <Line points={[[-360, mY(122)], [360, mY(122)]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[18, 12]} />
          <Num text="?" x={400} y={mY(122)} offset={[-1, 0]} />
        </Node>
        {Array.from({length: 11}, (_, i) => {
          const m = (i + 1) * 10;
          const hw = 150 + i * 4;
          return <Line points={[[TX - hw - 30 - i * 3, mY(m)], [TX - hw, mY(m)]]} stroke={V} lineWidth={LW.structure + Math.floor(i / 4)} lineCap="round"
            opacity={() => clamp(ticks() * 11 - i)} shadowColor={V} shadowBlur={8} />;
        })}
        <Line points={[[TX - 165, mY(10)], [TX - 165, mY(110)]]} stroke={V} lineWidth={LW.hairline} opacity={() => clamp(ticks() * 3)} />
        <Label text="+1 atmosphere every 10 m" x={-864} y={60} offset={[-1, 0]} spacing={1} color={V} opacity={lab} />
        <Spline smoothness={0.35} stroke={V} lineWidth={LW.emphasis} opacity={crown} shadowColor={V} shadowBlur={30} lineCap="round"
          points={[[-0.085, -0.71], [-0.05, -0.77], [-0.06, -0.82], [-0.03, -0.88], [-0.02, -0.94], [0, -1], [0.025, -0.95], [0.05, -0.89], [0.035, -0.86], [0.075, -0.79], [0.055, -0.75], [0.095, -0.67]]
            .map(([u, v]) => [TX + u * H116, GROUND + v * H116] as P)} />
        <Locator focus="crown" />
      </Node>,
      steps: [
        on(q, 0.6),
        function* () { yield* ticks(1, 5.0, linear); },
        on(crown, 0.8),
      ],
      ambient: function* () { yield* waitFor(11.0); yield* lab(1, 0.6, ease); },
    };
  },
  S41: () => ({
    drift: false, overlay: true,
    base: <Node>
      <Backed text="Redwood National and State Parks (NPS)" x={864} y={380} anchor={[1, 0]} />
    </Node>,
    steps: [<Backed text="Koch et al., 2004" font="label" x={-864} y={290} />],
  }),
  S42: () => {
    const lab = sig(0);
    const Shoot = ({x, y, broad}: any) => (
      <Node x={x} y={y}>
        <Line points={[[-200, 200], [200, -200]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
        {broad
          ? Array.from({length: 14}, (_, i) => {
            const t = (Math.floor(i / 2) + 0.5) / 7, s = i % 2 ? 1 : -1;
            const px = -200 + 400 * t, py = 200 - 400 * t;
            return <Leaf x={px + s * 52} y={py + s * 52} rot={-45} w={30} h={120} />;
          })
          : Array.from({length: 22}, (_, i) => {
            const t = (i + 0.5) / 22;
            const px = -200 + 400 * t, py = 200 - 400 * t, s = i % 2 ? 1 : -1;
            return <Node x={px + s * 18} y={py + s * 18} rotation={45}>
              <Rect width={20} height={46} radius={10} stroke={C.chalk} lineWidth={LW.structure + 1} fill={C.bg} rotation={s * 30} />
            </Node>;
          })}
      </Node>
    );
    return {
      base: <Node>
        <Shoot x={-430} y={-30} broad />
        <Small text="low: broad and flat" x={-430} y={300} color={C.chalk} />
        <Locator focus="crown" />
      </Node>,
      steps: [
        <Node>
          <Shoot x={380} y={-30} />
          <Small text="top: small, thick, packed" x={380} y={300} color={C.chalk} />
        </Node>,
        <Label text="water-starved" x={380} y={-330} spacing={2} />,
      ],
    };
  },
  S43: () => ({
    drift: false, overlay: true,
    base: <Node><Locator focus="whole" /></Node>,
    steps: [
      <Backed text="≈ 122-130 m (predicted)" font="label" x={-864} y={-390} />,
      null,
      <Backed text="Hyperion ≈ 116 m" font="label" x={-864} y={-300} />,
    ],
  }),

  // ================================================================ 8. close
  S44: () => {
    const l1 = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <Backed text="hundreds of litres a day" font="label" x={-864} y={260} opacity={l1} />
        <Backed text="NPS (public domain)" x={864} y={380} anchor={[1, 0]} />
      </Node>,
      steps: [<Backed text="almost all of it evaporates" font="label" x={-864} y={350} />],
      ambient: function* () { yield* waitFor(1.4); yield* l1(1, 0.6, ease); },
    };
  },
  S45: () => ({
    drift: false, overlay: true,
    base: <Node><Backed text="NPS (public domain)" x={864} y={380} anchor={[1, 0]} /></Node>,
    steps: [],
  }),
  S46: () => ({
    drift: false, overlay: true,
    base: <Node><Locator focus="whole" /></Node>,
    steps: [null, null],
  }),
  S47: () => {
    const next = sig(0);
    return {
      base: <Node>
        <Redwood y={150} h={460} opacity={0.6} />
        <Thread y={150} h={460} />
        <Small text="Next time" y={340} color={C.chalk} opacity={next} />
      </Node>,
      steps: [<Label text="DESIGNED OTHERWISE" y={250} size={72} spacing={14} />],
      ambient: function* () { yield* waitFor(7.1); yield* next(1, 0.6, ease); },
    };
  },
};

// pressure scale (S29, S30): air at 1 atm on top, zero, then the violet negative zone below
function PressureScale({k, negLabel = 1}: any) {
  return (
    <Node>
      <Line points={[[AX, -400], [AX, 400]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
      <Rect x={AX + 50} y={(Z0 + 400) / 2} width={60} height={400 - Z0} fill={VS} opacity={0.7} />
      <Line points={[[AX + 20, Z0], [AX + 20, 400]]} stroke={V} lineWidth={LW.structure} />
      <Line points={() => [[AX - 22, atY(1, k())], [AX + 22, atY(1, k())]]} stroke={C.chalk} lineWidth={LW.structure} />
      <Line points={[[AX - 30, Z0], [AX + 30, Z0]]} stroke={C.chalk} lineWidth={LW.emphasis} />
      {Array.from({length: 4}, (_, i) => (
        <Line points={() => [[AX - 14, atY(-5 * (i + 1), k())], [AX + 14, atY(-5 * (i + 1), k())]]} stroke={M} lineWidth={LW.hairline}
          opacity={() => (atY(-5 * (i + 1), k()) < 400 ? 1 : 0) * clamp((k() - 4) / 10)} />
      ))}
      <Small text="air ≈ 1 atm" x={AX - 50} y={() => atY(1, k()) - 6} offset={[1, 0]} color={C.chalk} />
      <Num text="0" x={AX - 50} y={Z0 + 34} offset={[1, 0]} />
      <Label text="negative" x={AX + 110} y={-160} offset={[-1, 0]} color={V} spacing={1} opacity={negLabel} />
    </Node>
  );
}
