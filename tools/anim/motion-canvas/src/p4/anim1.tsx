// P4 scenes, part 1: the hook (S00a-e) and act one up to the key's bitting (S01-S16).
// Each builder returns {base, steps}: steps map 1:1 to the storyboard `changes` and fire at their word cues (scenes.json).
// Colours: chalk = structure, violet = pins and the shear line, muted = blocked / wrong. No arrowheads.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import type {Built} from '../lib/motion';
import {BIT, Cyl, Door, Gauge, Head, Key, KX, Lab, Leader, Lof, Mono, Silhouette, Sm} from '../lib/lock';
import {interp, all, C, clamp, cue, D, delay, dur, ease, easeOutCubic, linear, Loc, LW, M, Padlock, rgba, ShopWindow, sig, sigs, T, to, TY, V, waitFor} from './shared';
import {Backed} from '../lib/lock';

const LA = {x: -190, y: -20, s: 0.85}; // with the cam and bolt on the right
const LB = {x: -20, y: -40, s: 0.92};
const Z5 = [0, 0, 0, 0, 0];
const label = (o: any, text: string, x: number, y: number, size = TY.label, color = C.chalk, anchor: [number, number] = [0, 0]) => (
  <Lab text={text} x={x} y={y} size={size} color={color} opacity={o} offset={anchor} />
);

export const A1: Record<string, () => Built> = {
  // ================================================================ 1. cold open
  S00a: () => {
    const p = sig(0), dots = sig(0);
    return {
      drift: false,
      base: <Node scale={() => 1 + 0.012 * Math.sin(T() * 2.4)}><Key x={-345} y={-165} rotation={-5} p={p} dots={dots} /></Node>,
      steps: [function* () { yield* p(1, D('S00a', 0, 0.8), ease); }, to(dots, 1, 1.3)],
    };
  },
  // overlay: the hook hero
  S00b: () => {
    const a = sig(0), cross = sig(0), ticks = sig(0);
    const CX = 715; // clean slate column right of the 3D lock (the hero never reaches x > 1450 px)
    return {
      drift: false, overlay: true,
      base: <Node>
        <Node opacity={a}>
          <Key x={CX - 91} y={-330} s={0.28} dashed />
          <Line points={[[CX - 55, -385], [CX + 55, -275]]} stroke={M} lineWidth={LW.emphasis} lineCap="round" end={cross} />
          <Line points={[[CX + 55, -385], [CX - 55, -275]]} stroke={M} lineWidth={LW.emphasis} lineCap="round" end={cross} />
          <Backed text="shape" x={CX} y={-230} anchor={[0, 0]} size={44} />
        </Node>
        <Node opacity={ticks}>
          <Backed text="5 gaps · 1 line" x={CX} y={-100} anchor={[0, 0]} size={44} />
        </Node>
        <Line points={[[CX - 175, -20], [CX + 175, -20]]} stroke={V} lineWidth={LW.emphasis} lineCap="round" end={ticks} shadowColor={V} shadowBlur={14} />
        {[0, 1, 2, 3, 4].map(i => (
          <Line points={[[CX - 175 + i * 87.5, -38], [CX - 175 + i * 87.5, -2]]} stroke={V} lineWidth={LW.emphasis} lineCap="round"
            opacity={() => clamp(ticks() * 6 - i)} />
        ))}
      </Node>,
      steps: [function* () { yield* a(1, 0.4, ease); yield* cross(1, 0.5, ease); }, to(ticks, 1, 0.8)],
    };
  },
  S00c: () => {
    const open = sig(0), k1 = sig(-1100), k1o = sig(1), k2 = sig(1400), k2o = sig(0), l1 = sig(0), l2 = sig(0);
    const KY = -69, K1END = -211, K2END = 455;
    return {
      base: <Node>
        <Door x={0} y={-20} w={360} h={560} open={open} />
        <Node opacity={k1o}><Key x={k1} y={KY} s={0.34} /></Node>
        <Node opacity={k2o} x={k2} y={KY} scale={[-0.34, 0.34]}><Key bow="round" dashed color={C.muted} /></Node>
        <Lab text="your key" x={-420} y={150} size={44} opacity={l1} color={C.chalk} />
        <Lab text="a key you've never seen" x={600} y={140} size={44} opacity={l2} color={M} />
      </Node>,
      steps: [
        function* () { yield* all(k1(K1END, D('S00c', 0, 1.0), ease), l1(1, 0.5)); yield* open(1, 0.35); },
        function* () { yield* all(open(0, 0.3), k1o(0, 0.3)); k2o(1); yield* k2(K2END, D('S00c', 1, 1.0), ease); },
        function* () { yield* all(open(1, 0.35), l2(1, 0.5)); },
      ],
    };
  },
  S00d: () => {
    const draw = sig(0), card = sig(0), pd = sig(0), lift = sig(0), sil = sig(0), sx = sig(780), t1851 = sig(0);
    return {
      base: <Node>
        <Lab text="1851" x={-864} y={-430} size={88} offset={[-1, 0]} opacity={t1851} />
        <ShopWindow x={-100} y={40} draw={draw} card={card} pad={pd} lift={lift} />
        <Node opacity={sil} x={sx} y={190}><Silhouette s={2.1} /></Node>
      </Node>,
      ambient: function* () { yield* all(t1851(1, 0.6), draw(1, 0.9, ease), delay(0.25, pd(1, 0.4))); },
      steps: [to(card, 1, 0.7), function* () { sil(1); yield* all(sx(420, 1.2, ease), delay(0.8, lift(1, 0.7, ease))); }],
    };
  },
  S00e: () => {
    const rot = sig(-5), out = sig(1);
    return {
      drift: false,
      base: <Node opacity={out}><Node rotation={rot}><Key x={-201} y={-106} s={0.6} /></Node></Node>,
      ambient: function* () { yield* waitFor(Math.max(dur('S00e') - 1.0, 0.5)); yield* out(0, 0.9, ease); },
      steps: [function* () { yield* rot(-95, D('S00e', 0, 1.1), ease); }],
    };
  },

  // ================================================================ 2. act one
  S01: () => {
    const o = sig(0), lo = sig(0.3);
    return {
      drift: false,
      base: <Node>
        <Head text="ACT 1 · WHAT IT CHECKS" />
        <Node opacity={lo}><Loc act="1" /></Node>
        <Cyl {...LB} outline={o} holes={0} kp={Z5} dr={Z5} sp={Z5} />
      </Node>,
      ambient: function* () { yield* lo(1, 0.6); },
      steps: [function* () { yield* o(1, D('S01', 0, 1.5), ease); }],
    };
  },
  S02: () => {
    const plugOn = sig(0), shellOn = sig(0), turn = sig(0), l1 = sig(0), l2 = sig(0), l3 = sig(0);
    return {
      base: <Node>
        <Loc act="1" />
        <Cyl {...LA} kp={Z5} dr={Z5} sp={Z5} holes={0} bolt={1} turn={turn} plugOn={plugOn} shellOn={shellOn} />
        <Node opacity={l1}>{label(1, 'PLUG', -804, 118, TY.label, C.chalk, [-1, 0])}
          <Leader from={[-690, 118]} to={[-666, 118]} /></Node>
        <Node opacity={l2}>{label(1, 'SHELL', -156, -388)}<Sm text="(fixed to the door)" x={-156} y={-346} color={M} /><Leader from={[-156, -326]} to={[-156, -268]} /></Node>
        <Node opacity={l3}>{label(1, 'BOLT', 636, 52)}</Node>
      </Node>,
      steps: [
        function* () { yield plugOn(1, 0.4); yield l1(1, 0.4); yield* turn(11, 0.45, ease); yield* turn(-11, 0.8, ease); yield* turn(0, 0.45, ease); },
        function* () { yield* all(plugOn(0, 0.4), shellOn(1, 0.4), l2(1, 0.4)); },
        function* () { yield* all(shellOn(0, 0.4), l3(1, 0.4), turn(85, D('S02', 2, 1.2), ease)); },
      ],
    };
  },
  S03: () => {
    const holes = sig(0), lab = sig(0);
    return {
      base: <Node>
        <Loc act="1" />
        <Cyl {...LB} kp={Z5} dr={Z5} sp={Z5} holes={holes} />
        <Node opacity={lab}>
          <Line points={[[-278, -340], [238, -340]]} stroke={C.chalk} lineWidth={LW.hairline + 1} />
          {[-278, 238].map(x => <Line points={[[x, -340], [x, -316]]} stroke={C.chalk} lineWidth={LW.hairline + 1} />)}
          {label(1, 'USUALLY 5', -20, -392)}
        </Node>
      </Node>,
      steps: [function* () { yield* holes(5, D('S03', 0, 1.9), linear); }, to(lab, 1, 0.6)],
    };
  },
  S04: () => {
    const kp = sig(0), dr = sig(0), sp = sig(0), l = sigs(3);
    const cl = {x: 0, y: 0, s: 1.6};
    const ys = [174, 0, -251], names = ['KEY PIN', 'DRIVER PIN', 'SPRING'];
    return {
      base: <Node>
        <Loc act="1" />
        <Cyl {...cl} hdim={[0, 0, 1, 0, 0]} kp={[0, 0, kp, 0, 0]} dr={[0, 0, dr, 0, 0]} sp={[0, 0, sp, 0, 0]} />
        {l.map((o, k) => (
          <Node opacity={o}>
            <Leader from={[52, ys[k]]} to={[140, ys[k]]} color={V} />
            <Backed text={names[k]} x={150} y={ys[k]} font="label" />
          </Node>
        ))}
      </Node>,
      steps: [
        function* () { yield l[0](1, 0.4); yield* kp(1, 0.7, easeOutCubic); },
        function* () { yield l[1](1, 0.4); yield* dr(1, 0.7, easeOutCubic); },
        function* () { yield l[2](1, 0.4); yield* sp(1, 0.8, easeOutCubic); },
      ],
    };
  },
  S05: () => {
    const z = sig(0), line = sig(0), lab = sig(0), oh = sig(0), pins = sigs(4);
    const lerp = (a: number, b: number) => () => a + (b - a) * z();
    const k = (i: number) => [0, 1, 3, 4][i];
    const ohd = [() => oh(), () => oh(), 1, () => oh(), () => oh()];
    const idx = [0, 1, 99, 2, 3];
    const pp = (i: number) => (idx[i] === 99 ? 1 : pins[idx[i]]);
    return {
      drift: false,
      base: <Node>
        <Loc act="1" />
        <Cyl x={lerp(0, LB.x)} y={lerp(0, LB.y)} s={lerp(1.6, LB.s)} hdim={ohd} kp={[0, 1, 2, 3, 4].map(pp)} dr={[0, 1, 2, 3, 4].map(pp)} sp={[0, 1, 2, 3, 4].map(pp)}
          shear={line} flash={() => 0.4 * line()} />
        <Node opacity={lab}>{label(1, 'SHEAR LINE', 490, -40, TY.label, V, [-1, 0])}</Node>
      </Node>,
      ambient: function* () {
        yield* all(z(1, 1.5, ease), delay(0.5, oh(1, 0.8)), delay(0.6, pins[0](1, 0.7, easeOutCubic)), delay(0.75, pins[2](1, 0.7, easeOutCubic)),
          delay(0.9, pins[1](1, 0.7, easeOutCubic)), delay(1.05, pins[3](1, 0.7, easeOutCubic)));
      },
      steps: [function* () { yield* all(line(1, 1.1, ease), delay(0.5, lab(1, 0.5))); }],
    };
  },
  S06: () => {
    const sg = sigs(5, 0), bars = sig(0), jolt = sig(0), turn = sig(0), lock = sig(0), pulse = sig(1);
    return {
      base: <Node>
        <Loc act="1" />
        <Cyl {...LA} sh={sg} bolt={1} turn={turn} jolt={jolt} shear={1} bars={() => bars() * (0.85 + 0.15 * Math.sin(T() * 3))} />
        <Node opacity={lock}>
          <Padlock x={560} y={-190} s={1.1} color={M} />
          <Lab text="PINNED" x={560} y={-70} color={M} />
        </Node>
      </Node>,
      steps: [
        function* () {
          yield* all(...sg.map((s, i) => delay(i * 0.1, s(52, 0.6, easeOutCubic))));
          yield* bars(1, 0.5);
        },
        function* () {
          yield lock(1, 0.5);
          yield* all(jolt(1, 0.6, linear), turn(16, 0.2, ease));
          yield* turn(0, 0.15, ease);
        },
      ],
    };
  },
  // overlay: the right key goes in, height bars, gap ticks
  S07: () => {
    const h = sigs(5), ticks = sig(0), lab = sig(0), free = sig(0);
    const BX = (i: number) => 560 + i * 85; // right-hand clean column
    return {
      drift: false, overlay: true,
      base: <Node>
        {BIT.map((b, i) => (
          <Node x={BX(i)} y={230}>
            <Rect width={44} height={240} radius={12} stroke={C.chalk} lineWidth={LW.structure} />
            <Rect y={() => 120 - (h[i]() * b * 34) / 2 - 4} width={30} height={() => h[i]() * b * 34} radius={8} fill={rgba(C.chalk, 0.7)} />
            <Line points={[[-30, 0], [30, 0]]} stroke={V} lineWidth={LW.emphasis + 2} lineCap="round" shadowColor={V} shadowBlur={16}
              y={() => 120 - b * 34 - 4} opacity={() => clamp(ticks() * 5 - i)} />
          </Node>
        ))}
        <Node opacity={lab}><Backed text="all 5 on the line" x={730} y={40} anchor={[0, 0]} size={40} /></Node>
        <Lab text="FREE" x={730} y={430} size={80} color={V} opacity={free} />
      </Node>,
      steps: [
        function* () { yield* all(...h.map((s, i) => delay(i * 0.3, s(1, 0.9, ease)))); },
        function* () { yield lab(1, 0.5); yield* ticks(1, 1.0, linear); },
        to(free, 1, 0.5),
      ],
    };
  },
  S08: () => {
    const dot = sigs(5), lit = sigs(5);
    const TG = [0.45, 0.8, 0.3, 0.65, 0.55];
    return {
      base: <Node>
        <Loc act="1" />
        <Head text="THE WHOLE TEST" />
        {TG.map((t, i) => (
          <Node>
            <Gauge x={-440 + i * 220} y={20} h={440} target={t} dot={dot[i]} lit={lit[i]} />
            <Sm text={String(i + 1)} x={-440 + i * 220} y={290} color={M} />
          </Node>
        ))}
      </Node>,
      steps: [function* () {
        yield* all(...dot.map((d, i) => delay(i * 0.1, function* () { yield* d(TG[i], 0.9, easeOutCubic); yield* lit[i](1, 0.2); }())));
      }],
    };
  },
  S09: () => {
    const solid = sig(1), dashed = sig(0), nums = sig(0), cap = sig(0);
    const KO = {x: -335, y: -150};
    return {
      base: <Node>
        <Loc act="1" />
        <Node opacity={solid}><Key {...KO} /></Node>
        <Node opacity={dashed}><Key {...KO} dashed color={M} /></Node>
        {BIT.map((b, i) => (
          <Node>
            <Circle x={KO.x + KX(i)} y={KO.y + Lof(b)} size={38} fill={V} shadowColor={V} shadowBlur={16} />
            <Mono text={String(b)} x={KO.x + KX(i)} y={KO.y + Lof(b) - 66} opacity={nums} color={C.chalk} size={56} />
          </Node>
        ))}
        <Node opacity={cap}><Lab text="ONLY THESE 5 HEIGHTS" x={0} y={290} /></Node>
      </Node>,
      steps: [
        function* () { yield* all(solid(0, 0.7, ease), dashed(1, 0.5), delay(0.5, dashed(0.1, 0.9, ease))); },
        function* () { yield nums(1, 0.6); yield* cap(1, 0.6); },
      ],
    };
  },
  S10: () => {
    const R = 210, CX = -470, CY = -20;
    const A = [[-34, -125], [34, -125], [34, -70], [52, -52], [52, -12], [34, 6], [34, 50], [52, 68], [52, 125], [-34, 125], [-34, 70], [-52, 52], [-52, 10], [-34, -8]] as [number, number][];
    const B = A.map(([x, y]) => [x * 1.7, y] as [number, number]);
    const Cc = [[-34, -125], [34, -125], [34, -30], [62, -10], [62, 40], [34, 60], [34, 125], [-34, 125], [-34, 40], [-62, 20], [-62, -30], [-34, -50]] as [number, number][];
    const bx = sigs(3, 0), bo = sigs(3, 0), bm = sigs(3, 0), fill = sig(0), left = sig(1), right = sig(0), ins = sig(0), l2 = sig(0);
    const shapes = [B, Cc, A], REST_X = 200;
    const SC = 1.2;
    const blank = (k: number) => (
      <Line closed points={shapes[k].map(([x, y]) => [x * SC, y * SC] as [number, number])} x={() => REST_X - bx[k]() * (REST_X - CX)} y={CY}
        stroke={() => (k < 2 && bm[k]() > 0.5 ? M : C.chalk)} lineWidth={LW.structure} lineJoin="round" opacity={bo[k]}
        fill={() => rgba(C.chalk, k === 2 ? 0.35 * fill() : 0)} />
    );
    const tryBlank = (k: number, ok: boolean) => function* () {
      yield bo[k](1, 0.2);
      yield* bx[k](1, 0.3, ease);
      if (ok) { yield* fill(1, 0.3); return; }
      bm[k](1);
      yield* bx[k](0.9, 0.08); yield* bx[k](1, 0.08); yield* bx[k](0.9, 0.08);
      yield* bx[k](0, 0.25, ease);
      yield* bo[k](0, 0.15);
    };
    return {
      base: <Node>
        <Loc act="1" />
        <Node opacity={() => 0.35 + 0.65 * left()}>
          <Circle x={CX} y={CY} size={2 * R} stroke={C.chalk} lineWidth={LW.structure} />
          <Line closed points={A.map(([x, y]) => [CX + x * 1.32, CY + y * 1.2] as [number, number])} stroke={C.chalk} lineWidth={LW.structure}
            fill={C.bg} lineJoin="round" />
          {[0, 1, 2].map(blank)}
          <Lab text="KEYWAY: WHICH KEYS FIT" x={CX} y={265} size={TY.small_label + 6} />
        </Node>
        <Node opacity={right}>
          <Cyl x={410} y={-50} s={0.5} ins={ins} key={1} shear={1} ticks={() => ins()} />
          <Lab text="PINS: THE REAL CHECK" x={410} y={265} size={TY.small_label + 6} color={V} />
        </Node>
      </Node>,
      steps: [
        function* () { yield* tryBlank(0, false)(); yield* tryBlank(1, false)(); yield* tryBlank(2, true)(); },
        function* () { yield left(0, 0.5); yield right(1, 0.5); yield* ins(1, 1.6, ease); },
      ],
    };
  },
  // overlay: the wrong key; stack 1 too high, stacks 2 and 4 too low
  S12: () => {
    // labels follow the 3D stacks: x/top measured from the hero clip (1920x1080 px, canvas = px - (960, 540))
    const TS: number[] = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10.3];
    const XS: Record<number, number[]> = {
      1: [1001, 998, 991, 977, 954, 932, 917, 908, 904, 903],
      2: [1099, 1097, 1090, 1076, 1054, 1034, 1019, 1010, 1007, 1006],
      4: [1290, 1286, 1280, 1267, 1246, 1226, 1212, 1204, 1200, 1199],
    };
    const TOP = [131, 130, 128, 125, 118, 111, 106, 104, 103, 103];
    const k = (arr: number[]): [number, number][] => arr.map((v, i) => [TS[i], v]);
    const lo = sig(0), hi = sig(0), lk = sig(0);
    const tag = (i: number, text: string, op: any, dx = 0) => (
      <Node opacity={op}>
        <Line points={() => [[interp(k(XS[i]), T()) - 960 + dx, -540 + 102], [interp(k(XS[i]), T()) - 960, interp(k(TOP), T()) - 540 - 2]]}
          stroke={C.chalk} lineWidth={3} shadowColor={C.bg} shadowBlur={6} />
        <Node x={() => interp(k(XS[i]), T()) - 960 + dx} y={-540 + 70}><Backed text={text} anchor={[0, 0]} size={40} color={V} /></Node>
      </Node>
    );
    return {
      drift: false, overlay: true,
      base: <Node>
        {tag(2, 'too low', lo, 15)}
        {tag(4, 'too low', lo)}
        {tag(1, 'too high', hi, -60)}
        <Node opacity={lk}>
          <Rect x={715} y={-100} width={400} height={130} radius={14} fill={C.panel} stroke={V} lineWidth={LW.structure} />
          <Lab text="LOCKED" x={715} y={-100} size={76} />
        </Node>
      </Node>,
      steps: [to(lo, 1, 0.5), to(hi, 1, 0.5), to(lk, 1, 0.5)],
    };
  },
  S13: () => {
    const kx = sig(0), nums = sig(0), lab = sig(0);
    return {
      base: <Node>
        <Loc act="1" />
        <Node x={kx}><Key x={-335} y={-150} /></Node>
        <Node opacity={nums}>
          {BIT.map((b, i) => <Mono text={String(b)} x={-400 + i * 200} y={30} size={150} color={V} />)}
          {BIT.map((b, i) => <Line points={[[-440 + i * 200, 120], [-360 + i * 200, 120]]} stroke={C.grid} lineWidth={LW.structure} lineCap="round" />)}
        </Node>
        <Node opacity={lab}>
          <Lab text="THE BITTING" x={0} y={235} size={64} />
          <Sm text="the real secret" x={0} y={295} color={M} />
        </Node>
      </Node>,
      steps: [function* () { yield* kx(-1900, D('S13', 0, 1.2), ease); }, function* () { yield lab(1, 0.6); yield* nums(1, 0.7, ease); }],
    };
  },
  S14: () => {
    const m = sigs(5), lit = sigs(5), rng = sig(0);
    const CXs = (i: number) => -480 + i * 240;
    return {
      base: <Node>
        <Loc act="1" />
        {BIT.map((b, i) => <Mono text={String(b)} x={CXs(i)} y={-250} size={96} color={V} />)}
        {BIT.map((b, i) => (
          <Node x={CXs(i)} y={40} opacity={m[i]}>
            {Array.from({length: 8}, (_, k) => (
              <Rect y={-170 + k * 52} width={160} height={30} radius={13} stroke={C.chalk} lineWidth={LW.hairline + 1}
                fill={() => rgba(V, k === b - 1 ? lit[i]() : 0)} />
            ))}
          </Node>
        ))}
        <Node opacity={rng}><Lab text="ABOUT 4 TO 10 DEPTHS" x={0} y={340} /></Node>
      </Node>,
      steps: [
        function* () { yield* all(...m.map((s, i) => delay(i * 0.12, function* () { yield* s(1, 0.5, ease); yield* lit[i](1, 0.4); }()))); },
        function* () { yield* rng(1, 0.6, ease); },
      ],
    };
  },
  S15: () => {
    const lo = sig(0), roll = sig(0), hi = sig(0);
    return {
      base: <Node>
        <Loc act="1" />
        <Rect width={1500} height={540} y={20} radius={20} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
        <Lab text="POSSIBLE KEYS" x={0} y={-190} size={64} />
        <Line points={[[-600, 40], [600, 40]]} stroke={C.grid} lineWidth={LW.structure} lineCap="round" />
        <Line points={() => [[-600, 40], [-600 + 1200 * roll(), 40]]} stroke={V} lineWidth={LW.emphasis + 2} lineCap="round" shadowColor={V} shadowBlur={14} />
        <Circle x={() => -600 + 1200 * roll()} y={40} size={40} fill={V} shadowColor={V} shadowBlur={16} />
        {Array.from({length: 13}, (_, k) => (
          <Line points={[[-600 + k * 100, 22], [-600 + k * 100, 58]]} stroke={C.grid} lineWidth={LW.structure} />
        ))}
        <Lab text="several thousand" x={-600} y={125} size={TY.small_label + 8} opacity={lo} offset={[-1, 0]} />
        <Lab text="several million" x={600} y={125} size={TY.small_label + 8} opacity={hi} offset={[1, 0]} />
        <Sm text="estimate: M. Blaze, 2003" x={0} y={250} color={M} />
      </Node>,
      steps: [function* () { yield lo(1, 0.5); yield* roll(0.04, 0.5, ease); }, function* () { yield hi(1, 0.5); yield* roll(1, D('S15', 1, 2.4), ease); }],
    };
  },
  S16: () => {
    const two = sig(0), tx = sig(900), tagA = sig(1), tagB = sig(0), bob = sig(0);
    return {
      base: <Node>
        <Loc act="1" />
        <Node y={() => 6 * Math.sin(T() * 1.3)}>
          <Node opacity={two} x={tx} y={() => 60 + 4 * Math.sin(T() * 1.1)}><Key x={-251} y={-132} s={0.75} bow="round" dashed color={M} /></Node>
          <Key x={-251 - 30} y={-132 - 40} s={0.75} />
        </Node>
        <Node y={-290}>
          <Node opacity={tagA} scale={() => 1 + 0.02 * Math.sin(T() * 2.2)}>
            <Rect width={560} height={92} radius={14} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
            <Lab text="ONE OF A KIND?" size={TY.label} />
            <Line closed points={[[-40, -62], [-28, -90], [-14, -70], [0, -100], [14, -70], [28, -90], [40, -62]]} y={-12} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />
          </Node>
          <Node opacity={tagB}>
            <Rect width={560} height={92} radius={14} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
            <Mono text="1 of 2?" size={56} />
          </Node>
        </Node>
      </Node>,
      steps: [function* () {
        two(1); yield* tx(30, 1.0, ease);
        for (let k = 0; k < 2; k++) { yield* all(tagA(0, 0.08), tagB(1, 0.08)); yield* all(tagA(1, 0.08), tagB(0, 0.08)); }
        yield* all(tagA(0, 0.1), tagB(1, 0.1));
      }],
    };
  },
};
