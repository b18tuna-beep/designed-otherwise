// P4 scenes, part 4: why it can be beaten at all, the answers, the twist, the close (S55-S69).
// Safety: conceptual only. No pick tools, no tension tools, no hands, no step sequences.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import type {Built} from '../lib/motion';
import {Backed, BIT, Block, Cyl, Door, Gauge, Key, KX, Lab, Leader, Lof, Mono, Silhouette, Sm, Stopwatch, Tick, VL, WoodLock} from '../lib/lock';
import {all, C, clamp, cue, D, delay, dur, ease, easeOutCubic, linear, Loc, LW, M, Padlock, rgba, sig, sigs, T, to, TY, V, val, waitFor} from './shared';

const LB = {x: -20, y: -40, s: 0.92};
const fadeIn = (s: any, d = 0.6) => function* () { yield* s(1, d, ease); };
const all5 = (v: number) => [v, v, v, v, v];

// tolerance diagram: the perfect line of hole centres against the real, slightly offset ones
const OFF = [14, -18, 8, -10, 20];
const Tol = ({x = 0, y = 0, s = 1, perfect = 1, real = 1, violet = [0, 0, 0, 0, 0] as any[], op = 1}: any) => (
  <Node x={x} y={y} scale={s} opacity={op}>
    <Line points={[[-420, 0], [420, 0]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[18, 12]} end={perfect} />
    {[0, 1, 2, 3, 4].map(i => (
      <Node x={-320 + i * 160}>
        <Circle size={44} stroke={M} lineWidth={LW.hairline + 1} opacity={perfect} />
        <Circle y={() => OFF[i] * real()} size={34} fill={() => (violet[i]() > 0.5 ? V : C.chalk)} opacity={real} shadowColor={V} shadowBlur={() => 18 * violet[i]()} />
      </Node>
    ))}
  </Node>
);
const Spool = ({x = 0, y = 0, s = 1, color = C.chalk}: any) => (
  <Node x={x} y={y} scale={s}>
    <Line closed points={[[-30, -70], [30, -70], [30, -50], [12, -40], [12, 40], [30, 50], [30, 70], [-30, 70], [-30, 50], [-12, 40], [-12, -40], [-30, -50]]}
      stroke={color} lineWidth={LW.structure} lineJoin="round" fill={C.panel} />
  </Node>
);
const Mushroom = ({x = 0, y = 0, s = 1, color = C.chalk}: any) => (
  <Node x={x} y={y} scale={s}>
    <Line closed points={[[-14, 70], [14, 70], [14, 10], [30, -10], [30, -40], [0, -70], [-30, -40], [-30, -10], [-14, 10]]}
      stroke={color} lineWidth={LW.structure} lineJoin="round" fill={C.panel} />
  </Node>
);
const House = ({x = 0, y = 0, hi = 0, s = 1}: any) => (
  <Node x={x} y={y} scale={s}>
    <Rect y={20} width={130} height={100} stroke={C.chalk} lineWidth={LW.structure} fill={() => rgba(C.chalk, 0.22 * hi())} />
    <Line closed points={[[-82, -30], [0, -90], [82, -30]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" fill={C.bg} />
    <Rect x={-30} y={44} width={34} height={52} stroke={C.chalk} lineWidth={LW.structure} />
    <Line points={[[-13, 20], [-13, 70], [24, 62], [24, 8]]} closed stroke={V} lineWidth={LW.structure} lineJoin="round" opacity={hi} />
    <Rect x={32} y={10} width={34} height={30} stroke={C.chalk} lineWidth={LW.hairline + 1} />
  </Node>
);

export const A4: Record<string, () => Built> = {
  S55: () => {
    const hd = sig(0), o = sig(0), pins = sig(0);
    return {
      base: <Node>
        <Loc act="3" />
        <Lab text="ACT 3 · THE BARGAIN" x={-864} y={-430} size={TY.label + 8} offset={[-1, 0]} />
        <Cyl {...LB} outline={o} holes={() => 5 * o()} kp={all5(0).map(() => pins)} dr={all5(0).map(() => pins)} sp={all5(0).map(() => pins)} shear={pins} />
      </Node>,
      ambient: function* () { yield* o(1, 1.2, ease); },
      steps: [function* () { yield* pins(1, 1.0, ease); }],
    };
  },
  S56: () => {
    const ruler = sig(0), mag = sig(0), lab = sig(0), mx = sig(-360);
    return {
      base: <Node>
        <Loc act="3" />
        <Cyl {...LB} />
        <Line points={[[-300, -350], [240, -350]]} stroke={C.chalk} lineWidth={LW.structure} end={ruler} />
        {Array.from({length: 12}, (_, k) => <Line points={[[-300 + k * 49, -350], [-300 + k * 49, -330]]} stroke={C.chalk} lineWidth={LW.hairline + 1} opacity={ruler} />)}
        <Lab text="A MANUFACTURING DETAIL" x={0} y={400} size={TY.small_label + 8} opacity={lab} />
        <Node x={mx} y={-60} opacity={mag}>
          <Circle size={300} fill={C.bg} stroke={C.chalk} lineWidth={LW.emphasis} />
          <Line points={[[-120, 0], [120, 0]]} stroke={C.chalk} lineWidth={LW.hairline + 1} lineDash={[10, 8]} />
          {[-80, 0, 80].map((hx, k) => <Rect x={hx + [10, -8, 14][k]} width={34} height={150} stroke={C.chalk} lineWidth={LW.structure} />)}
          <Line points={[[150, 110], [220, 180]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
        </Node>
        <Mono text="± a hair" x={0} y={-420} size={44} color={V} opacity={mag} />
      </Node>,
      ambient: function* () { yield* ruler(1, 1.0, ease); yield* lab(1, 0.6); },
      steps: [function* () { yield mag(1, 0.4); yield* mx(220, D('S56', 0, 2.0), ease); }],
    };
  },
  S57: () => {
    const perfect = sig(0), real = sig(0), v = sigs(5), l2 = sig(0), l3 = sig(0), l1 = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <Tol x={-560} y={290} s={0.62} perfect={perfect} real={real} violet={v} />
        <Node opacity={l1}><Backed text="perfect line" x={-864} y={180} /></Node>
        <Node opacity={real}><Backed text="real holes" x={-864} y={385} /></Node>
        <Node opacity={l2}><Backed text="never all at once" x={-864} y={-440} font="label" size={40} /></Node>
        <Lab text="THE WEAKNESS" x={-250} y={280} size={72} color={V} offset={[-1, 0]} opacity={l3} />
      </Node>,
      steps: [
        function* () { yield l1(1, 0.5); yield* perfect(1, 0.8, ease); yield* real(1, 0.6); },
        function* () { yield l2(1, 0.5); yield* all(...v.map((s, i) => delay([0.2, 1.0, 0.6, 1.4, 1.8][i], s(1, 0.3)))); },
        fadeIn(l3),
      ],
    };
  },
  S58: () => {
    const sh = sig(0), tx = sig(0), meters = sig(0), skill = sig(0.8), lock = sig(0.2), v = sigs(5);
    return {
      base: <Node>
        <Loc act="3" />
        <Tol x={0} y={-20} s={1.3} perfect={1} real={1} violet={v} op={() => 1 - 0.7 * sh() * (1 - meters())} />
        <Rect x={0} y={() => -1200 + 1250 * sh()} width={1100} height={680} radius={10} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
        {Array.from({length: 9}, (_, k) => <Line points={[[-540, -1200 + (k - 4) * 80 + 0], [540, -1200 + (k - 4) * 80]]} y={() => 1250 * sh() + 0} stroke={C.grid} lineWidth={LW.hairline + 1} />)}
        <Node opacity={() => clamp(tx() * (1 - meters() * 1.0))}>
          <Lab text="CONCEPT ONLY" y={-70} size={88} />
          <Sm text="that's as far as we go" y={30} size={52} />
        </Node>
        <Node opacity={meters}>
          <Gauge x={-250} y={-10} h={420} target={0.8} dot={skill} />
          <Gauge x={250} y={-10} h={420} target={0.2} dot={lock} />
          <Lab text="SKILL" x={-250} y={260} size={TY.small_label + 8} />
          <Lab text="WELL-MADE LOCK" x={250} y={260} size={TY.small_label + 8} />
        </Node>
      </Node>,
      steps: [
        function* () { yield sh(1, 0.8, easeOutCubic); yield* delay(0.5, tx(1, 0.6)); },
        function* () { yield* meters(1, 0.5); yield* all(lock(0.9, 1.6, ease), skill(0.15, 1.6, ease)); },
      ],
    };
  },
  S59: () => {
    const sec = sig(0), sp = sig(0), mu = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <Node opacity={sec}><Backed text="security pins" x={715} y={-250} anchor={[0, 0]} font="label" size={44} /></Node>
        <Node opacity={sp}><Spool x={575} y={-110} s={1.0} /><Lab text="spool" x={630} y={-110} size={44} offset={[-1, 0]} /></Node>
        <Node opacity={mu}><Mushroom x={575} y={40} s={1.0} /><Lab text="mushroom" x={630} y={40} size={44} offset={[-1, 0]} /></Node>
      </Node>,
      ambient: function* () { yield* sec(1, 0.6); },
      steps: [fadeIn(sp), fadeIn(mu)],
    };
  },
  S60: () => {
    const g = sigs(4), pulse = sig(0);
    const cell = (x: number, y: number, title: string, k: number, children: any) => (
      <Node x={x} y={y} opacity={g[k]} scale={() => 0.94 + 0.06 * g[k]()}>
        <Rect width={820} height={300} radius={16} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
        {children}
        <Lab text={title} x={-120} y={-80} size={TY.small_label + 8} offset={[-1, 0]} />
      </Node>
    );
    return {
      base: <Node>
        <Loc act="3" />
        {cell(-430, -130, 'MORE PINS', 0, <Cyl x={-250} y={20} s={0.17} bolt={0} />)}
        {cell(430, -130, 'COMPLEX KEYWAY', 1, <Node x={-270} y={0}>
          <Circle size={200} stroke={C.chalk} lineWidth={LW.structure} />
          <Line closed points={[[-14, -80], [14, -80], [14, -40], [40, -20], [14, 0], [14, 20], [-30, 40], [-30, 60], [-14, 80], [-14, 20], [-14, -20], [-40, -40]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />
        </Node>)}
        {cell(-430, 200, 'SIDE BAR', 2, <Node x={-270} y={0}>
          <Circle size={200} stroke={C.chalk} lineWidth={LW.structure} />
          {[-40, 0, 40].map(px => <Circle x={px} y={-30} size={20} fill={V} />)}
          <Rect x={104} y={() => -10 + 12 * Math.sin(T() * 3)} width={30} height={90} radius={5} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
        </Node>)}
        {cell(430, 200, 'LOCK-UP', 3, <Node x={-270} y={0}>
          <Rect width={200} height={130} radius={10} stroke={C.chalk} lineWidth={LW.structure} />
          <Rect x={50} y={-10} width={60} height={60} fill={M} opacity={0.6} />
          <Line points={[[-60, -20], [-60, 30]]} stroke={M} lineWidth={LW.emphasis} lineCap="round" />
        </Node>)}
      </Node>,
      steps: [fadeIn(g[0]), fadeIn(g[1]), fadeIn(g[2]), fadeIn(g[3])],
    };
  },
  S61: () => {
    const b = sigs(3), cyc = sig(0), sep = sig(0), hl = sig(0);
    return {
      base: <Node>
        <Loc act="3" />
        <Lab text="LOCK HARDWARE GRADES (US)" x={-864} y={-430} size={TY.label + 4} offset={[-1, 0]} />
        {[1, 2, 3].map((n, i) => (
          <Node x={-560 + i * 300} y={-90} opacity={b[i]} scale={() => 0.8 + 0.2 * b[i]() + (i === 0 ? 0.12 * hl() : 0)}>
            <Circle size={210} stroke={i === 0 ? C.chalk : C.muted} lineWidth={() => LW.structure + (i === 0 ? 4 * hl() : 0)} fill={C.panel} />
            <Mono text={String(n)} size={96} color={i === 0 ? C.chalk : M} />
          </Node>
        ))}
        <Node opacity={cyc} x={380} y={-80}>
          <Circle size={210} stroke={C.chalk} lineWidth={LW.structure} />
          <Circle size={210} stroke={V} lineWidth={LW.emphasis + 4} startAngle={-90} endAngle={() => -90 + 360 * ((T() / 2.2) % 1)} lineCap="round" shadowColor={V} shadowBlur={10} />
          <Lab text="DURABILITY = CYCLES" y={160} size={TY.small_label + 4} />
        </Node>
        <Node opacity={sep} y={() => 14 * (1 - sep())}>
          <Rect x={0} y={270} width={1120} height={130} radius={14} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
          <Lab text="PICK RESISTANCE" x={-420} y={250} size={TY.small_label + 8} offset={[-1, 0]} />
          <Sm text="rated separately · own standard (UL 437)" x={-420} y={300} offset={[-1, 0]} color={M} />
        </Node>
      </Node>,
      ambient: function* () {
        yield* all(...b.map((s, i) => delay(0.5 + 0.7 * i, s(1, 0.5))));
        yield* hl(1, 0.8);
        yield* waitFor(0.5);
        yield* hl(0, 0.8);
      },
      steps: [fadeIn(cyc), fadeIn(sep)],
    };
  },
  S62: () => {
    const lockHi = sig(1), frame = sig(0);
    return {
      base: <Node>
        <Loc act="3" />
        <Node x={0} y={30}>
          <Door w={400} h={680} lock />
          <Circle x={136} y={14} size={150} stroke={V} lineWidth={LW.emphasis} shadowColor={V} shadowBlur={20} opacity={() => lockHi() * (0.8 + 0.2 * Math.sin(T() * 4))} />
          <Rect width={470} height={740} y={-18} radius={8} stroke={C.chalk} lineWidth={LW.emphasis + 2} lineDash={[26, 16]} lineDashOffset={() => -T() * 40} opacity={frame} shadowColor={C.chalk} shadowBlur={10} />
        </Node>
      </Node>,
      steps: [function* () { yield* all(lockHi(0, 0.6), frame(1, 0.7)); }],
    };
  },
  S63: () => {
    const draw = sig(0), mark = sig(0), seg = sigs(3), leg = sigs(3);
    const W = 1400, X0 = -700, Y = 40, H = 150;
    const P = [55.7, 37.8, 6.5], cols = [C.chalk, C.muted, rgba(M, 0.3)];
    const x0 = (i: number) => X0 + (W * P.slice(0, i).reduce((a, b) => a + b, 0)) / 100;
    const names = ['forcible entry', 'no force', 'attempted'];
    return {
      base: <Node>
        <Loc act="3" />
        <Lab text="REPORTED BURGLARIES · US · 2019" x={-864} y={-430} size={TY.label} offset={[-1, 0]} />
        <Rect x={0} y={Y} width={W} height={H} stroke={C.chalk} lineWidth={LW.structure} end={draw} />
        {P.map((p, i) => (
          <Rect x={() => x0(i) + (W * p * seg[i]()) / 200} y={Y} width={() => (W * p * seg[i]()) / 100} height={H - 6} fill={cols[i]} stroke={i === 2 ? M : undefined} lineWidth={i === 2 ? 4 : 0} />
        ))}
        <Line points={[[0, Y - 120], [0, Y + 120]]} stroke={V} lineWidth={LW.structure} lineDash={[12, 10]} opacity={mark} />
        <Mono text="50 %" x={0} y={Y - 150} size={44} color={V} opacity={mark} />
        {P.map((p, i) => (
          <Node opacity={leg[i]} x={i === 2 ? 640 : X0 + (W * (P.slice(0, i).reduce((a, b) => a + b, 0) + p / 2)) / 100} y={Y + 125}>
            <Mono text={`${p} %`} y={0} size={i === 0 ? 60 : 48} color={i === 2 ? M : C.chalk} />
            <Sm text={names[i]} y={58} color={i === 2 ? M : C.chalk} size={38} />
          </Node>
        ))}
        <Sm text="FBI · US · 2019 (reported burglaries)" x={0} y={340} color={M} size={36} />
      </Node>,
      ambient: function* () {
        yield* draw(1, 1.2, ease);
        yield* waitFor(0.8);
        yield seg[0](1, 1.5, ease);
        yield delay(1.0, seg[1](1, 1.2, ease));
        yield delay(2.0, seg[2](1, 0.8, ease));
        yield* waitFor(2.39);
        yield* all(...leg.map((l, i) => delay(i * 0.25, l(1, 0.4))));
        yield* mark(1, 0.6);
      },
      steps: [],
    };
  },
  S64: () => {
    const crack = sig(0), lift = sig(0), a = sig(0), b = sig(0);
    return {
      base: <Node>
        <Loc act="3" />
        <Node scale={0.78} y={60}>
        <Rect x={0} y={20} width={470} height={760} radius={8} stroke={C.chalk} lineWidth={LW.structure} />
        <Node x={() => -70 * lift()} y={() => 20 - 40 * lift()} rotation={() => -9 * lift()}>
          <Door w={400} h={680} lock />
          <Line points={[[-200, -300], [-170, -150], [-210, -40], [-180, 120], [-205, 330]]} stroke={M} lineWidth={LW.emphasis + 2} lineCap="round" lineJoin="round" end={crack} />
        </Node>
        </Node>
        <Sm text="in US victim surveys" x={-864} y={-440} offset={[-1, 0]} color={M} opacity={a} size={TY.small_label} />
        <Node opacity={b}><Lab text="MOST COMMON WAY IN: THE DOOR ITSELF" x={-864} y={-390} size={TY.label} offset={[-1, 0]} /></Node>
        <Sm text="BJS victim survey · US · 2003-2007" x={0} y={410} color={M} />
      </Node>,
      ambient: function* () { yield* a(1, 0.6); yield* waitFor(Math.max(cue('S64', 0) - 4.2, 0)); yield* b(1, 0.7); },
      steps: [function* () { yield* crack(1, 0.8, ease); yield* lift(1, 1.4, ease); }],
    };
  },
  S65: () => {
    const hs = sigs(10), hi = sigs(10), tx = sig(0);
    const picks = [1, 4, 6, 8];
    return {
      base: <Node>
        <Loc act="3" />
        <Lab text="NOBODY HOME · NO FORCE" x={-864} y={-430} size={TY.label} offset={[-1, 0]} />
        {hs.map((h, k) => (
          <Node opacity={h}><House x={-560 + (k % 5) * 280} y={-130 + Math.floor(k / 5) * 250} hi={hi[k]} s={1.1} /></Node>
        ))}
        <Node opacity={tx}><Lab text="4 IN 10 · UNLOCKED" x={0} y={410} size={64} /></Node>
        <Sm text="BJS · US · 2003-2007 · unoccupied homes" x={0} y={310} color={M} size={34} />
      </Node>,
      ambient: function* () { yield* all(...hs.map((h, k) => delay(k * 0.18, h(1, 0.4)))); },
      steps: [function* () {
        yield tx(1, 0.6);
        yield* all(...picks.map((k, i) => delay(i * 0.4, hi[k](1, 0.4))));
        while (true) { yield* all(...picks.map((k, i) => delay(i * 0.2, function* () { yield* hi[k](0.5, 0.5); yield* hi[k](1, 0.5); }()))); yield* waitFor(0.4); }
      }],
    };
  },
  S66: () => {
    const sw = sig(0), settle = sig(0), tx = sig(0);
    const P = {c: [-480, 250], v: [480, 250], s: [0, -300]};
    const dx = () => (1 - settle()) * 190 * Math.sin(T() * 1.3) , dy = () => (1 - settle()) * 90 * Math.sin(T() * 1.9 + 1);
    return {
      base: <Node>
        <Loc act="3" />
        <Line closed points={[P.c as any, P.v as any, P.s as any]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" radius={20} />
        <Lab text="COST" x={P.c[0]} y={P.c[1] + 60} size={TY.label} />
        <Lab text="CONVENIENCE" x={P.v[0]} y={P.v[1] + 60} size={TY.label} />
        <Lab text="SECURITY" x={P.s[0] + 280} y={P.s[1] - 10} size={TY.label} />
        <Circle x={() => dx()} y={() => 60 + dy()} size={48} fill={V} shadowColor={V} shadowBlur={18} />
        <Node opacity={sw} x={() => P.s[0] - 40 * sw()} y={() => P.s[1] + 60 + 40 * sw()} scale={() => 0.4 + 0.6 * sw()}>
          <Stopwatch r={110} p={() => ((T() / 3) % 1)} />
        </Node>
        <Node opacity={tx}><Lab text="IT BUYS TIME" x={-860} y={-430} size={72} offset={[-1, 0]} /></Node>
      </Node>,
      steps: [function* () { yield tx(1, 0.6); yield* sw(1, 0.9, ease); }, function* () { yield* settle(1, 1.2, ease); }],
    };
  },
  S67: () => {
    const solid = sig(1), dots = sig(1), drop = sigs(5), line = sig(0), tx = sig(0);
    const KO = {x: -465, y: -380, s: 0.9};
    const gx = (i: number) => KO.x + KX(i) * KO.s;
    const GY = 100, GH = 440, TG = 0.62;
    const landY = GY + GH / 2 - GH * TG;
    return {
      drift: false,
      base: <Node>
        <Node opacity={solid} scale={() => 1 + 0.008 * Math.sin(T() * 2.4)}><Key x={KO.x} y={KO.y} s={KO.s} /></Node>
        {BIT.map((b, i) => (
          <Node>
            <Gauge x={gx(i)} y={GY} h={GH} w={52} target={TG} dot={0} op={() => drop[i]()} lit={line} />
            <Circle x={gx(i)} y={() => KO.y + Lof(b) * KO.s + (landY - (KO.y + Lof(b) * KO.s)) * drop[i]()} size={36} fill={V} shadowColor={V} shadowBlur={16} />
          </Node>
        ))}
        <Line points={[[gx(0) - 60, landY], [gx(4) + 60, landY]]} stroke={V} lineWidth={LW.emphasis} lineCap="round" end={line} shadowColor={V} shadowBlur={14} />
        <Node opacity={tx}><Lab text="5 HEIGHTS · 1 LINE" x={0} y={455} size={64} /></Node>
      </Node>,
      steps: [
        function* () { yield* solid(0, 1.0, ease); },
        function* () { yield tx(1, 0.6); yield* all(...drop.map((d, i) => delay(i * 0.18, d(1, 0.8, easeOutCubic)))); yield* line(1, 0.6, ease); },
      ],
    };
  },
  S68: () => {
    const wood = sig(1), cyl = sig(0), sm = sig(0), moved = sig(0);
    return {
      drift: false,
      base: <Node>
        <Node opacity={() => wood() * (1 - 0.0)}><WoodLock x={-120} y={0} s={0.9} peg={[1, 1, 1, 1]} key={0} /></Node>
        <Node x={() => 400 * moved()} y={() => 150 * moved()} scale={() => 1 - 0.6 * sm()} opacity={cyl}>
          <Cyl x={-20} y={-40} s={0.92} key={0} bolt={0} />
        </Node>
        <Node x={430} y={170} scale={1.5} opacity={sm}>
          <Line closed points={[[-170, -100], [170, -100], [170, 90], [100, 140], [-100, 140], [-170, 90]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" radius={30} />
          <Line points={[[-150, -70], [150, -70]]} stroke={C.chalk} lineWidth={LW.hairline + 1} lineDash={[12, 10]} />
          <Sm text="pocket" y={190} color={M} />
        </Node>
      </Node>,
      steps: [function* () {
        yield wood(0, 0.5); yield* cyl(1, 0.5);
        yield sm(1, 1.0, ease); yield* moved(1, 1.0, ease);
      }],
    };
  },
  S69: () => {
    const mark = sig(0), tx = sig(0), sub = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <Node opacity={mark} y={() => 12 * (1 - mark())}>
          <Node x={715} y={-170} scale={0.36}>
            <Rect x={20} y={10} width={330} height={560} fill={C.heat} />
            <Line closed points={[[-170, -270], [170, -270], [170, 270], [-170, 270]]} stroke={C.chalk} lineWidth={44} lineJoin="round" />
            <Line closed points={[[-60, -230], [150, -170], [150, 330], [-60, 270]]} fill={C.cold} />
            <Line points={[[-200, 210], [200, 210]]} stroke={C.refrigerant} lineWidth={36} />
          </Node>
          <Txt text="DESIGNED" x={715} y={60} fontFamily="Archivo" fontWeight={500} fontSize={58} letterSpacing={5} fill={C.chalk} />
          <Txt text="OTHERWISE" x={715} y={125} fontFamily="Archivo" fontWeight={600} fontSize={58} letterSpacing={5} fill={C.chalk} />
        </Node>
      </Node>,
      steps: [fadeIn(mark, 0.9)],
    };
  },
};
