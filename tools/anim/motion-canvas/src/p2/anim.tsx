// P2 (the inner ear) production scenes. Each builder returns {base, steps}: steps map 1:1 to the
// storyboard `changes` for that scene (episodes/p2-ear/board/scenes_src.py) and fire at their word cues
// (episodes/p2-ear/scenes/scenes.json). Blender scenes are transparent 2D overlays (overlay: true);
// archival scenes frame a still from episodes/p2-ear/scenes/assets/ (placeholder until it is added).
// Colours: chalk = structure and vibration, violet = the working part / sound the ear makes,
// lime = electricity, muted = secondary and lost cells. No orange, no blue, no arrowheads.
import {Circle, Line, Node, Rect, Spline} from '@motion-canvas/2d';
import {all, createSignal, easeInOutCubic, easeOutCubic, linear, sequence, waitFor} from '@motion-canvas/core';
import {C, Label, LW, Num, Small, Title} from '../lib/parts';
import {T} from '../lib/clock';
import type {Built} from '../lib/motion';
import {
  AmpGlyph, CellIcon, ChartAxes, CH, chartPts, clamp, COCHLEA, DraftCard, EarSection, HairCell, Head, HeadGrid, Keys, LADDER, Ladder,
  LIME, Locator, LOC, Membrane, MicSchematic, Mouse, OuterCell, OVER_HALF_24, ProbeCanal, respDead, respLive, RingTrip, Rings,
  Scope, scopeX, Still, Tuft, twBump, VIOLET, dbY,
} from '../lib/ear';
import {cue} from './motion';

type P = [number, number];
const sig = createSignal;
const V = VIOLET;
const ease = easeInOutCubic;
const on = (s: any, d = 0.6) => function* () { yield* s(1, d, ease); };
// section coordinates -> screen, for a section placed at (x, y) with scale s
const sec = (p: P, x: number, y: number, s: number): P => [x + p[0] * s, y + p[1] * s];
const Leader = ({from, to, opacity = 1}: {from: P; to: P; opacity?: any}) => (
  <Line points={[from, to]} stroke={C.muted} lineWidth={LW.hairline} opacity={opacity} />
);
// violet pulse row: the outer-hair-cell pushes, used over the 3D heroes
const PulseRow = ({x = 0, y = 0, n = 11, gap = 120, on: o = 1}: any) => (
  <Node x={x} y={y} opacity={o}>
    {Array.from({length: n}, (_, i) => {
      const u = () => 0.5 + 0.5 * Math.sin(T() * 7 - i * 0.7);
      return <Node x={(i - (n - 1) / 2) * gap}>
        <Rect width={10} height={() => 26 + u() * 34} radius={5} fill={V} opacity={() => 0.35 + u() * 0.65} shadowColor={V} shadowBlur={14} />
      </Node>;
    })}
  </Node>
);
// stiletto and flat shoe outlines (side view, toe to the right), standing on y = 0
const Stiletto = ({x = 0, y = 0, s = 1}: any) => (
  <Node x={x} y={y} scale={s}>
    {/* pointed toe on the floor, arched sole rising to a high heel seat */}
    <Spline closed smoothness={0.3} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure}
      points={[[196, -4], [140, -30], [60, -54], [-20, -94], [-100, -150], [-160, -188], [-178, -150], [-158, -128], [-110, -116], [-60, -76], [0, -28], [60, -4], [130, 0]]} />
    {/* thin heel spike down to the floor */}
    <Line closed points={[[-176, -138], [-148, -126], [-154, 0], [-162, 0]]} fill={C.chalk} />
  </Node>
);
const Flat = ({x = 0, y = 0, s = 1}: any) => (
  <Node x={x} y={y} scale={s}>
    <Spline closed smoothness={0.35} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure}
      points={[[150, 0], [158, -28], [120, -58], [40, -70], [-40, -88], [-120, -92], [-150, -60], [-150, 0]]} />
    <Line points={[[-150, -14], [150, -14]]} stroke={C.chalk} lineWidth={LW.hairline} />
  </Node>
);
// skulls for the jaw-to-ear story (profile, facing left)
const teeth = (x0: number, x1: number, y: number, len: number, step = 22) =>
  Array.from({length: Math.floor((x1 - x0) / step) + 1}, (_, i) => (
    <Line points={[[x0 + i * step, y], [x0 + i * step, y + len]]} stroke={C.chalk} lineWidth={LW.structure - 1} lineCap="round" />
  ));
// early synapsid (reptile-like) skull, profile facing left: long low snout, many teeth,
// eye socket plus the temporal opening behind it, jaw joint at the very back
const ReptileSkull = ({x = 0, y = 0}: any) => (
  <Node x={x} y={y}>
    <Spline closed smoothness={0.3} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure}
      points={[[-300, 14], [-210, -36], [-70, -82], [40, -104], [150, -100], [238, -72], [276, -10], [268, 42], [150, 26], [0, 22], [-150, 18], [-290, 20]]} />
    <Circle x={30} y={-52} size={54} stroke={C.chalk} lineWidth={LW.hairline + 1} />
    <Circle x={160} y={-40} width={80} height={52} stroke={C.chalk} lineWidth={LW.hairline + 1} />
    <Spline closed smoothness={0.3} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure}
      points={[[-286, 34], [-100, 36], [100, 40], [250, 50], [266, 64], [250, 82], [100, 86], [-100, 72], [-276, 52]]} />
    {teeth(-276, 120, 20, 12)}
    {teeth(-265, 110, 36, -10)}
    <Line points={[[-210, 20], [-210, 44]]} stroke={C.chalk} lineWidth={LW.structure + 1} lineCap="round" />
  </Node>
);
// mammal skull, profile facing left: rounded braincase, shorter snout, a single lower jawbone
// hinged in front of the ear; the middle ear (dashed) sits behind the jaw hinge
const MammalSkull = ({x = 0, y = 0}: any) => (
  <Node x={x} y={y}>
    <Spline closed smoothness={0.4} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure}
      points={[[-250, 30], [-200, -8], [-110, -50], [-20, -112], [80, -160], [190, -150], [262, -88], [278, 0], [242, 50], [150, 42], [40, 44], [-100, 40], [-245, 40]]} />
    <Circle x={-40} y={-30} size={70} stroke={C.chalk} lineWidth={LW.hairline + 1} />
    <Line points={[[-80, 18], [90, 12]]} stroke={C.chalk} lineWidth={LW.hairline + 1} lineCap="round" />
    <Spline closed smoothness={0.3} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure}
      points={[[-248, 50], [-100, 56], [40, 62], [78, 40], [98, 10], [118, 4], [124, 18], [106, 42], [112, 72], [70, 96], [-100, 86], [-240, 66]]} />
    {teeth(-236, -20, 40, 12)}
    {teeth(-226, -10, 56, -10)}
    <Circle x={185} y={25} size={96} stroke={C.muted} lineWidth={LW.hairline} lineDash={[8, 8]} />
  </Node>
);
// specimen jar line drawing with a small cochlea inside
const Jar = ({x = 0, y = 0}: any) => (
  <Node x={x} y={y}>
    <Rect y={20} width={240} height={300} radius={30} stroke={C.chalk} lineWidth={LW.structure} />
    <Rect y={-150} width={270} height={44} radius={10} stroke={C.chalk} lineWidth={LW.structure} />
    <Line points={[[-110, -60], [110, -60]]} stroke={C.muted} lineWidth={LW.hairline} lineDash={[10, 8]} />
    <Line points={Array.from({length: 90}, (_, i) => {
      const t = (i / 90) * 5 * Math.PI, r = 70 * Math.exp(-0.11 * t);
      return [Math.cos(Math.PI + t) * r, 50 + Math.sin(Math.PI + t) * r] as P;
    })} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
  </Node>
);
const Clock = ({x = 0, y = 0, sweep = 1, size = 220}: any) => (
  <Node x={x} y={y}>
    <Circle size={size} stroke={C.chalk} lineWidth={LW.structure} />
    {Array.from({length: 12}, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <Line points={[[Math.sin(a) * size * 0.4, -Math.cos(a) * size * 0.4], [Math.sin(a) * size * 0.46, -Math.cos(a) * size * 0.46]]}
        stroke={C.muted} lineWidth={LW.hairline} />;
    })}
    <Circle size={size * 0.72} stroke={C.chalk} lineWidth={LW.emphasis + 4} startAngle={-90} endAngle={() => -90 + 240 * sweep()} opacity={0.85} />
    <Line points={() => { const a = (240 * sweep() * Math.PI) / 180; return [[0, 0], [Math.sin(a) * size * 0.3, -Math.cos(a) * size * 0.3]]; }}
      stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
  </Node>
);

// probe-in-canal group used by S02, S03, S30, S32 (canal at the top, scope at the bottom)
const PG = {x: 0, y: -70, s: 0.9};
// ---- cold open v2 parts (Michael 2026-11-13: hook first, no baby photo)
const HEAD_PTS: P[] = [[-150, 470], [-160, 330], [-230, 290], [-300, 250], [-310, 190], [-330, 150], [-322, 110], [-385, 60], [-352, 0], [-332, -50],
  [-346, -120], [-300, -280], [-170, -400], [20, -440], [220, -390], [360, -250], [410, -60], [380, 120], [280, 260], [220, 330], [230, 470]];
const EAR: P = [214, 26];
const ProfileHead = ({opacity = 1}: any) => (
  <Spline closed smoothness={0.45} stroke={C.chalk} lineWidth={LW.emphasis} opacity={opacity} points={HEAD_PTS} />
);
// the ear's own faint tone: violet rings that grow out of the ear, steadily, forever
const EarPulse = ({on: o = 1, far = 0}: any) => (
  <Node position={EAR} opacity={o}>
    {Array.from({length: 4}, (_, i) => {
      const u = () => { const v = T() / 3.2 + i / 4; return v - Math.floor(v); };
      return <Circle size={() => 36 + (240 + 360 * val(far)) * u()} stroke={V} lineWidth={LW.emphasis}
        opacity={() => (1 - u()) * Math.min(1, u() * 8)} />;
    })}
  </Node>
);
const ToneTrace = ({x = 0, y = 0, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={560} height={260} radius={16} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
    <Line points={() => Array.from({length: 160}, (_, i) => [-240 + 3 * i, 26 * Math.sin(i * 0.42 - T() * 6)] as P)}
      stroke={V} lineWidth={LW.structure} lineJoin="round" />
    <Small text="faint, steady tone" y={170} color={C.chalk} />
  </Node>
);
const NewbornRow = ({y = 0}: any) => (
  <Node y={y}>
    {Array.from({length: 7}, (_, i) => (
      <Node x={(i - 3) * 230}>
        <Rect width={180} height={86} radius={28} stroke={C.chalk} lineWidth={LW.structure} y={30} />
        <Circle x={-52} y={-2} size={58} stroke={C.chalk} lineWidth={LW.structure} />
      </Node>
    ))}
  </Node>
);
const val = (v: any) => (typeof v === 'function' ? v() : v);

const ProbeView = ({rings = 0, outRings = 0, ring = null as any, labels = true}: any) => (
  <Node x={PG.x} y={PG.y} scale={PG.s}>
    <ProbeCanal />
    <Rings a={-470} b={175} y={-20} n={3} period={1.5} size={170} on={rings} width={LW.structure + 1} />
    <Rings a={480} b={-470} y={10} n={2} period={2.6} size={170} color={V} on={outRings} width={LW.emphasis} />
    {ring ? <RingTrip a={480} b={-470} y={10} p={ring} size={170} color={V} /> : null}
    {labels ? <Small text="eardrum" x={200} y={-240} color={C.muted} /> : null}
  </Node>
);

export const ANIM: Record<string, () => Built> = {
  // ================================================================ 1. cold open: the test that listens
  S01: () => {
    const o = sig(0), tr = sig(0), far = sig(0), cap = sig(0);
    return {
      drift: true,
      base: <Node>
        <Node x={-330}>
          <ProfileHead opacity={0.55} />
          <EarPulse on={o} far={far} />
          <Small text="your ear, right now" x={214} y={300} color={C.chalk} opacity={cap} />
        </Node>
        <ToneTrace x={560} y={-20} opacity={tr} />
      </Node>,
      steps: [
        function* () { yield* all(o(1, 1.4, ease), cap(1, 1.0, ease)); },
        function* () { yield* tr(1, 1.0, ease); },
        function* () { yield* far(1, 1.8, ease); },
      ],
    };
  },
  S02: () => {
    const hook = sig(1), cots = sig(0), cotLab = sig(0), probe = sig(0), rings = sig(0), sc = sig(0), sweep = sig(0.16), lab = sig(0);
    return {
      base: <Node>
        {/* carries on from S01's head and pulse, then gives way to the cots */}
        <Node opacity={hook}>
          <Node x={-330}><ProfileHead opacity={0.55} /><EarPulse on={1} far={1} /></Node>
          <ToneTrace x={560} y={-20} />
        </Node>
        <Node opacity={() => cots() * (1 - probe())}>
          <NewbornRow y={-40} />
          <Label text="newborn hearing screen" y={200} size={44} spacing={4} opacity={cotLab} />
        </Node>
        <Node opacity={probe}>
          <ProbeView rings={rings} />
          <Small text="click" x={-300} y={-250} color={C.chalk} opacity={rings} />
          <Node opacity={sc}><Scope y={300} click={1} sweep={sweep} /></Node>
          <Small text="listening" x={-450} y={155} color={C.chalk} opacity={lab} />
        </Node>
      </Node>,
      steps: [
        function* () { yield* all(hook(0, 0.7, ease), cots(1, 0.9, ease)); },
        function* () { yield* cotLab(1, 0.6, ease); },
        function* () { yield* probe(1, 0.8, ease); },
        function* () { yield* rings(1, 0.6, ease); },
        function* () { yield* all(rings(0, 0.8), sc(1, 0.6, ease), lab(1, 0.6)); yield* sweep(0.86, 3.6, linear); },
      ],
    };
  },
  S03: () => {
    const ring = sig(0), out = sig(0), echo = sig(0);
    return {
      base: <Node>
        <ProbeView ring={ring} outRings={out} />
        <Scope y={300} click={1} echo={echo} sweep={1} />
      </Node>,
      steps: [
        <Label text="sound made inside the ear" x={-860} y={-370} color={V} offset={[-1, 0]} spacing={1} />,
        function* () { yield* echo(1, 0.6, ease); },
      ],
      ambient: function* () {
        yield* waitFor(cue('S03', 0) - 0.3);
        yield* ring(1, 2.0, linear);
        yield* out(1, 0.4);
      },
    };
  },
  S04: () => {
    const o = sig(0);
    return {
      drift: true,
      base: <Node>
        <ProfileHead opacity={0.4} />
        <EarPulse on={o} far={0.4} />
      </Node>,
      steps: [
        <Title text="Your ears are making sound." y={-470} size={84} />,
      ],
      ambient: function* () { yield* o(1, 0.8, ease); },
    };
  },
  S05: () => {
    const head = sig(1), pos = sig<P>([214, 26] as any), scl = sig(0.3), loc = sig(0), secO = sig(1);
    return {
      drift: false,
      base: <Node>
        <Spline closed smoothness={0.45} stroke={C.chalk} lineWidth={LW.emphasis} opacity={() => head() * 0.4}
          points={[[-150, 470], [-160, 330], [-230, 290], [-300, 250], [-310, 190], [-330, 150], [-322, 110], [-385, 60], [-352, 0], [-332, -50],
            [-346, -120], [-300, -280], [-170, -400], [20, -440], [220, -390], [360, -250], [410, -60], [380, 120], [280, 260], [220, 330], [230, 470]]} />
        <Locator focus="whole" opacity={loc} />
      </Node>,
      steps: [
        <Node position={pos as any} scale={scl} opacity={secO}><EarSection k={2.6} /></Node>,
        function* () {
          yield* all(head(0, 0.6), pos([LOC.x + 60 * LOC.s, LOC.y + 40 * LOC.s] as any, 1.1, ease), scl(LOC.s, 1.1, ease), loc(1, 1.1, ease));
          yield* secO(0, 0.2);
        },
      ],
    };
  },
  // ================================================================ 2. the microphone we think we have
  S06: () => {
    const rings = sig(0), drum = sig(0), rock = sig(0), lit = sig(0);
    const X = 60, Y = 40, S = 1.15;
    const at = (p: P) => sec(p, X, Y, S);
    return {
      base: <Node>
        <EarSection x={X} y={Y} s={S} drum={() => drum() * Math.sin(T() * 8)} rock={() => rock() * Math.sin(T() * 8 - 0.7)}
          plunge={() => rock() * Math.sin(T() * 8 - 1.2)} stirrupLit={lit} />
        <Node x={X} y={Y} scale={S}><Rings a={-660} b={-150} y={0} n={3} period={1.6} size={74} on={rings} /></Node>
      </Node>,
      steps: [
        function* () { yield* rings(1, 0.6, ease); },
        <Node>
          <Leader from={[-330, 300]} to={at([-128, 74])} />
          <Label text="EARDRUM" x={-330} y={330} />
          {/* drum flex is driven below */}
        </Node>,
        <Node>
          <Leader from={[-330, -380]} to={at([-80, -150])} />
          <Label text="HAMMER" x={-330} y={-410} />
          <Leader from={[-10, -380]} to={at([0, -164])} />
          <Label text="ANVIL" x={-10} y={-410} />
          <Leader from={[90, 330]} to={at([66, 50])} />
          <Label text="STIRRUP" x={90} y={360} />
        </Node>,
        <Node>
          <Leader from={[560, 330]} to={at([360, 212])} />
          <Label text="COCHLEA" x={560} y={360} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S06', 1) - 0.1);
        yield* drum(1, 0.6, ease);
        yield* waitFor(cue('S06', 2) - cue('S06', 1) - 0.6);
        yield* rock(1, 0.6, ease);
        yield* waitFor(cue('S06', 3) - cue('S06', 2) - 0.6);
        yield* lit(1, 0.6, ease);
      },
    };
  },
  S07: () => ({
    base: <Node>
      <DraftCard x={-330} y={20} w={1040} h={740}>
        <Small text="Gray's Anatomy, 1918, fig. 919" y={330} color={C.muted} />
      </DraftCard>
      <Locator focus="middle" />
    </Node>,
    steps: [
      <Node>
        <Still x={-330} y={-20} name="grays-1918-ossicles.png" w={920} h={580} caption="chain of ossicles, inverted to chalk on slate" />
        <Label text="STIRRUP" x={300} y={-140} offset={[-1, 0]} />
        <Small text="smallest bone in the body" x={300} y={-80} offset={[-1, 0]} color={C.chalk} />
      </Node>,
      <Node>
        <Line points={[[300, 120], [700, 120]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
        <Line points={[[300, 96], [300, 144]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[700, 96], [700, 144]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Num text="≈ 3 mm" x={500} y={200} />
        <Small text="scale bar (actual size of the stirrup)" x={500} y={260} />
      </Node>,
    ],
  }),
  S08: () => {
    const m = sig(0), txt = sig(0);
    return {
      base: <Node>
        <EarSection x={60} y={40} s={1.05} opacity={() => 1 - m() * 0.85} />
        <MicSchematic x={20} y={40} s={1.3} opacity={m} />
        <Label text="a microphone with plumbing?" y={-390} spacing={1} opacity={txt} />
      </Node>,
      steps: [
        function* () { yield* all(m(1, 0.6, ease), txt(1, 0.6, ease)); },
        function* () { yield* m(0, 0.6, ease); },
      ],
    };
  },
  S09: () => {
    const inn = sig(0), bounce = sig(0), cnt = sig(0), cntO = sig(0);
    return {
      base: <Node>
        <Rect x={430} y={0} width={860} height={640} clip>
          {Array.from({length: 26}, (_, i) => (
            <Line points={[[-430 + i * 46 - 300, 330], [-430 + i * 46 + 50, -330]]} stroke={C.muted} lineWidth={LW.hairline} opacity={0.35} />
          ))}
        </Rect>
        <Line points={[[0, -330], [0, 330]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Label text="AIR" x={-430} y={-330} />
        <Label text="FLUID" x={250} y={-330} />
        <Rings a={-820} b={0} y={-20} n={3} period={2.0} size={300} on={inn} width={LW.emphasis} />
        <Rings a={0} b={-820} y={-20} n={3} period={2.0} size={300} on={bounce} width={LW.emphasis} phase={0.5} />
        <Node opacity={bounce}><Rings a={0} b={760} y={-20} n={2} period={3.0} size={300} on={0.3} width={LW.hairline} /></Node>
        <Locator focus="cochlea" />
      </Node>,
      steps: [
        function* () { yield* inn(1, 0.6, ease); },
        function* () { yield* bounce(1, 0.6, ease); },
        <Node>
          <Num text={() => `≈ ${cnt().toFixed(1)}%`} x={-820} y={300} size={72} offset={[-1, 0]} />
          <Small text="bounces off" x={-820} y={370} offset={[-1, 0]} color={C.chalk} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S09', 2));
        yield* cnt(99.9, 1.4, easeOutCubic);
      },
    };
  },
  S10: () => {
    const flow = sig(0);
    return {
      base: <Node>
        <Locator focus="middle" />
      </Node>,
      steps: [
        <Node>
          <Circle x={-620} y={-60} size={300} stroke={C.chalk} lineWidth={LW.emphasis} fill={C.panel} />
          <Circle x={-140} y={-60} size={64} stroke={C.chalk} lineWidth={LW.emphasis} fill={C.panel} />
          <Small text="eardrum" x={-620} y={140} color={C.chalk} />
          <Small text="stirrup footplate" x={-140} y={140} color={C.chalk} />
          <Num text="15–20×" x={-520} y={-320} offset={[1, 0]} />
          <Small text="the area" x={-500} y={-318} offset={[-1, 0]} color={C.chalk} />
        </Node>,
        <Node opacity={flow}>
          {[-130, -65, 0, 65, 130].map(d => (
            <Line points={[[-620 + Math.sqrt(150 * 150 - d * d) * 0.5, -60 + d], [-172, -60 + d * 0.2]]} stroke={C.chalk} lineWidth={LW.structure}
              lineCap="round" lineDash={[6, 22]} lineDashOffset={() => -T() * 70} />
          ))}
        </Node>,
        <Node>
          <Line points={[[200, 20], [860, 20]]} stroke={C.muted} lineWidth={LW.structure} />
          <Stiletto x={400} y={20} s={0.85} />
          <Flat x={745} y={20} s={0.82} />
          <Small text="same weight" x={560} y={-165} color={C.chalk} />
          {/* pressure: dense short ticks under the heel tip, sparse under the flat shoe */}
          {Array.from({length: 9}, (_, i) => { const d = (i - 4) * 4; return <Line points={[[267 + d, 30], [267 + d * 2.2, 66]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />; })}
          {[650, 720, 790, 850].map(xx => <Line points={[[xx, 30], [xx, 44]]} stroke={C.chalk} lineWidth={LW.hairline} lineCap="round" opacity={0.7} />)}
        </Node>,
        <Node>
          <Line points={[[-760, 290], [-280, 250]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Circle x={-620} y={300} size={30} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
          <Small text="+ a little leverage" x={-240} y={270} offset={[-1, 0]} color={C.chalk} />
          <Small text="many times the pressure" x={530} y={190} color={C.chalk} />
        </Node>,
      ],
      ambient: function* () { yield* waitFor(cue('S10', 1)); yield* flow(1, 0.6, ease); },
    };
  },
  S11: () => {
    const hi = sig(0), mig = sig(0);
    const j: P[] = [[-174, 58], [-176, 86]], e: P[] = [[612, 36], [638, 26]];
    const path = (a: P, c: P) => (): P => { const u = mig(); return [a[0] + (c[0] - a[0]) * u, a[1] + (c[1] - a[1]) * u - Math.sin(u * Math.PI) * 170]; };
    return {
      base: <Node>
        <Line points={[[0, -160], [0, 260]]} stroke={C.grid} lineWidth={LW.hairline} />
        <ReptileSkull x={-440} y={20} />
        <MammalSkull x={450} y={20} />
        <Line points={[[652, 52], [680, 50]]} stroke={C.chalk} lineWidth={LW.emphasis + 2} lineCap="round" />
        <Line points={[[-700, 330], [700, 330]]} stroke={C.muted} lineWidth={LW.hairline} />
        <Circle x={() => -700 + 1400 * mig()} y={330} size={26} fill={C.chalk} />
        <Small text="many millions of years" x={0} y={385} opacity={() => (mig() > 0 ? 1 : 0)} />
        <Node shadowColor={C.chalk} shadowBlur={() => hi() * 22}>
          {j.map((a, i) => <Circle position={path(a, e[i]) as any} size={() => 30 - mig() * 10} fill={() => (hi() > 0.5 ? C.chalk : C.bg)}
            stroke={C.chalk} lineWidth={LW.structure} />)}
        </Node>
        <Small text="jaw joint" x={-176} y={150} color={C.chalk} opacity={() => hi() * (1 - mig())} />
        <Locator focus="middle" />
      </Node>,
      steps: [
        <Node>
          <Line points={[[-214, 6], [-176, 0]]} stroke={C.chalk} lineWidth={LW.emphasis + 2} lineCap="round" />
          <Label text="1 ear bone: birds, reptiles" x={-440} y={-190} size={40} spacing={1} />
        </Node>,
        function* () { yield* hi(1, 0.6, ease); },
        function* () { yield* mig(1, 3.2, ease); },
        <Node>
          <Label text="3 ear bones: mammals" x={400} y={-190} size={40} spacing={1} />
          <Small text="hammer + anvil: once the jaw joint" x={450} y={200} color={C.chalk} />
        </Node>,
      ],
    };
  },
  S12: () => {
    const rings = sig(1), drum = sig(0), rock = sig(0), push = sig(0);
    return {
      drift: false,
      base: <Node>
        <Node scale={() => 1 + push() * 0.15} x={() => 60 - push() * 120} y={() => 30 - push() * 20}>
          <EarSection drum={() => drum() * Math.sin(T() * 6)} rock={() => rock() * Math.sin(T() * 6 - 0.7)} plunge={() => rock() * Math.sin(T() * 6 - 1.2)}
            dimOuter={() => 1 - push() * 0.7} dimMiddle={() => 1 - push() * 0.6} />
          <Rings a={-660} b={-150} y={0} n={3} period={1.9} size={74} on={() => rings() * (1 - push())} />
          <Circle x={COCHLEA[0]} y={COCHLEA[1]} size={() => 360 + Math.sin(T() * 3) * 6} stroke={C.chalk} lineWidth={LW.hairline} opacity={push} lineDash={[10, 10]} />
        </Node>
        <Locator focus="cochlea" opacity={push} />
      </Node>,
      steps: [
        function* () { yield* push(1, 1.6, ease); },
      ],
      ambient: function* () {
        yield* waitFor(1.2);
        yield* drum(1, 0.8, ease);
        yield* waitFor(2.0);
        yield* rock(1, 0.8, ease);
      },
    };
  },
  // ================================================================ 3. a piano, rolled up
  S13: () => {
    const turns = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <Num text="≈ 2½ turns" x={-820} y={-390} offset={[-1, 0]} opacity={turns} />
        <Locator focus="cochlea" />
      </Node>,
      steps: [
        function* () { yield* turns(1, 0.6, ease); },
        function* () { yield* turns(0.35, 0.6, ease); },
        <Node>
          <Label text="BASILAR MEMBRANE" x={-760} y={240} offset={[-1, 0]} />
          <Line points={[[-760, 320], [760, 320]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Line points={[[-760, 300], [-760, 340]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Line points={[[760, 300], [760, 340]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Num text="≈ 3 cm" x={420} y={250} offset={[1, 0]} />
          <Small text="unrolled" x={440} y={252} offset={[-1, 0]} color={C.chalk} />
        </Node>,
      ],
    };
  },
  S14: () => ({
    base: <Node>
      <Membrane y={20} bump={(u: number) => (3 + 12 * u * u) * Math.sin(u * 30 - T() * 5)} />
      <Locator focus="cochlea" />
    </Node>,
    steps: [
      <Node>
        <Label text="BASE" x={-750} y={-190} offset={[-1, 0]} />
        <Small text="narrow, stiff" x={-750} y={-135} offset={[-1, 0]} color={C.chalk} />
        <Line points={[[-750, -105], [-750, -20]]} stroke={C.muted} lineWidth={LW.hairline} />
      </Node>,
      <Node>
        <Label text="APEX" x={750} y={190} offset={[1, 0]} />
        <Small text="wide, floppy" x={750} y={245} offset={[1, 0]} color={C.chalk} />
        <Line points={[[750, 125], [750, 160]]} stroke={C.muted} lineWidth={LW.hairline} />
      </Node>,
    ],
  }),
  S15: () => {
    const at = sig(0.12), amp = sig(0), keys = sig(0);
    return {
      base: <Node>
        <Membrane y={-60} bump={twBump(at, amp)} />
        <Small text="BASE" x={-750} y={-180} offset={[-1, 0]} />
        <Small text="APEX" x={750} y={-190} offset={[1, 0]} />
        <Node opacity={keys}><Keys y={190} lit={() => at() * 25} /></Node>
        <Line points={() => [[-750 + 1500 * at(), 20], [-750 + 1500 * at(), 100]]} stroke={C.chalk} lineWidth={LW.hairline} opacity={() => amp() / 40} />
        <Locator focus="cochlea" />
      </Node>,
      steps: [
        function* () { yield* amp(40, 0.6, ease); },
        function* () { yield* at(0.85, 1.4, ease); },
        function* () { yield* keys(1, 0.8, ease); },
        <Node>
          <Num text="≈ 20,000 Hz" x={-750} y={330} offset={[-1, 0]} />
          <Num text="≈ 20 Hz" x={750} y={330} offset={[1, 0]} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S15', 1) + 2.8);
        yield* at(0.12, 2.0, ease);
        yield* at(0.5, 1.4, ease);
      },
    };
  },
  S16: () => ({
    drift: false, overlay: true,
    base: <Node><Locator focus="cochlea" /></Node>,
    steps: [
      <Node>
        <Small text="BASE" x={-820} y={330} offset={[-1, 0]} color={C.chalk} />
        <Small text="APEX" x={820} y={330} offset={[1, 0]} color={C.chalk} />
      </Node>,
      null,
      <Label text="travelling wave" x={-820} y={-380} offset={[-1, 0]} spacing={1} />,
    ],
  }),
  S17: () => ({
    base: <Node>
      <DraftCard x={-150} y={95} w={1300} h={600} />
      <Locator focus="cochlea" />
    </Node>,
    steps: [
      <Title text="Georg von Békésy" x={-740} y={-100} size={80} offset={[-1, 0]} />,
      <Node>
        <Small text="Nobel Prize" x={-740} y={20} offset={[-1, 0]} color={C.chalk} />
        <Num text="1961" x={-530} y={18} offset={[-1, 0]} />
      </Node>,
      <Node>
        <Jar x={320} y={80} />
        <Small text="worked largely on cadaver cochleas" x={-740} y={160} offset={[-1, 0]} color={C.chalk} />
      </Node>,
    ],
  }),
  S18: () => {
    const live = sig(0), sharp = sig(0.55), core = sig(0), death = sig(0), deadO = sig(0);
    const curve = (u: number) => respDead(u) + (respLive(u, 0.5, sharp()) - respDead(u)) * live();
    return {
      base: <Node y={30}>
        <ChartAxes />
        <Line closed points={() => [...chartPts(u => Math.max(curve(u), respDead(u)), CH.w, CH.h, 120)().slice(36, 85), ...chartPts(respDead, CH.w, CH.h, 120)().slice(36, 85).reverse()]}
          fill={V} opacity={() => core() * live() * 0.55} />
        <Line points={chartPts(respDead)} stroke={C.muted} lineWidth={LW.structure} end={deadO} />
        <Line points={chartPts(curve)} stroke={C.chalk} lineWidth={LW.emphasis} opacity={() => (live() > 0.02 ? 1 : 0)} lineJoin="round" />
        <Line points={() => [[-CH.w / 2 + CH.w * death(), -CH.h / 2], [-CH.w / 2 + CH.w * death(), CH.h / 2]]} stroke={C.muted} lineWidth={LW.hairline}
          lineDash={[10, 10]} opacity={() => (death() > 0 && death() < 1 ? 1 : 0)} />
      </Node>,
      steps: [
        <Node><Small text="cadaver ear" x={300} y={210} offset={[-1, 0]} /></Node>,
        <Node><Small text="living ear" x={70} y={-200} offset={[-1, 0]} color={C.chalk} /></Node>,
        function* () { yield* all(sharp(1, 0.8, ease), live(1, 0.8, ease)); },
        <Node><Small text="sensitivity fades after death" x={-560} y={-380} offset={[-1, 0]} color={C.chalk} /></Node>,
        function* () { yield* all(live(1, 1.0, ease), core(1, 1.0, ease)); },
      ],
      ambient: function* () {
        yield* waitFor(cue('S18', 0) - 0.05);
        yield* deadO(1, 0.8, ease);
        yield* waitFor(cue('S18', 1) - cue('S18', 0) - 0.8);
        yield* live(0.7, 0.9, ease);
        yield* waitFor(cue('S18', 3) - cue('S18', 1) - 0.9);
        yield* all(death(1, 1.4, linear), live(0, 1.4, ease));
      },
    };
  },
  S19: () => {
    const dust = sig(0), wave = sig(0), sus = sig(0), yrs = sig(0);
    const dots = Array.from({length: 46}, (_, i) => [(((i * 97) % 100) / 100 - 0.5) * 700, (((i * 61) % 100) / 100 - 0.5) * 520] as P);
    const dpts = () => Array.from({length: 120}, (_, i) => {
      const u = i / 119, a = 70 * (Math.exp(-3.2 * u) * (1 - sus()) + sus() * 0.8);
      return [-300 + 600 * u, Math.sin(u * 30 - T() * 4) * a] as P;
    });
    return {
      base: <Node>
        <Node x={-430} y={30} opacity={() => 1 - dust() * 0.45}>
          <Rect width={760} height={600} radius={10} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
          <Line points={[[-320, -170], [320, -170]]} stroke={C.muted} lineWidth={LW.hairline} />
        </Node>
        <Node x={420} y={190} opacity={wave}>
          <Line points={[[-300, 0], [300, 0]]} stroke={C.grid} lineWidth={LW.hairline} />
          <Line points={dpts} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" opacity={() => 1 - sus() * 0.6} />
          <Line points={dpts} stroke={V} lineWidth={LW.structure} lineCap="round" opacity={sus} />
          <Small text="fluid damps the ripple" x={0} y={-110} color={C.chalk} opacity={() => 1 - sus()} />
          <Small text="energy pumped in" x={0} y={-110} color={V} opacity={sus} />
        </Node>
        <Node x={-430} y={30} opacity={dust}>
          {dots.map(([x, y], i) => <Circle x={x} y={y} size={6 + (i % 4) * 3} fill={C.muted} opacity={0.7} />)}
        </Node>
        <Locator focus="cochlea" />
      </Node>,
      steps: [
        <Node x={-430} y={30}>
          <Num text="1948 · Thomas Gold" y={-225} size={46} />
        </Node>,
        <Node>
          <Num text={'the ear must\ncontain an\namplifier'} x={-430} y={20} size={50} lineHeight={78} textAlign="center" />
          <AmpGlyph x={330} y={-140} />
        </Node>,
        function* () { yield* dust(1, 1.0, ease); },
        <Node>
          <Small text="forgotten" x={250} y={350} offset={[1, 0]} color={C.chalk} />
          <Num text={() => `≈ ${Math.round(yrs())} years`} x={280} y={348} offset={[-1, 0]} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S19', 1) + 3.0);
        yield* wave(1, 0.6, ease);
        yield* waitFor(2.0);
        yield* sus(1, 1.6, ease);
        yield* waitFor(Math.max(0, cue('S19', 3) - (cue('S19', 1) + 3.0 + 0.6 + 2.0 + 1.6)));
        yield* yrs(30, 1.2, easeOutCubic);
      },
    };
  },
  // ================================================================ 4. the amplifier
  S20: () => ({
    drift: false, overlay: true,
    base: <Node><Locator focus="cells" /></Node>,
    steps: [
      null,
      <Node>
        {/* labels sit over chalk cells in the 3D shot: dark backing panel keeps them readable */}
        <Rect x={-850} y={-356} width={640} height={150} offset={[-1, 0]} radius={12} fill={C.panel} opacity={0.88} />
        <Small text="1 row · inner" x={-820} y={-390} offset={[-1, 0]} color={C.chalk} />
        <Num text="≈ 3,500" x={-560} y={-392} offset={[-1, 0]} size={44} />
      </Node>,
      <Node>
        <Small text="3 rows · outer" x={-820} y={-320} offset={[-1, 0]} color={C.chalk} />
        <Num text="≈ 3× as many" x={-560} y={-322} offset={[-1, 0]} size={44} />
      </Node>,
    ],
  }),
  S21: () => ({
    base: <Node>
      <DraftCard x={-150} y={50} w={1180} h={740} />
      <Locator focus="cells" />
    </Node>,
    steps: [
      <Node>
        <Still x={-150} y={0} name="stereocilia-sem.png" w={1060} h={560} caption="NIDCD / Yoshiyuki Kawashima (public domain)" />
        <Small text="FIG. stereocilia (electron microscope)" x={-150} y={350} color={C.chalk} />
      </Node>,
    ],
  }),
  S22: () => {
    const bend = sig(0), openOn = sig(0), dots = sig(0), sigOn = sig(0);
    const tilt = () => bend() * (10 + 10 * Math.sin(T() * 2.6));
    const CX = -300, CY = 40, S = 1.8;
    return {
      base: <Node>
        <Line points={[[-760, 262], [300, 262]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Spline points={[[CX, 248], [CX, 320], [CX + 120, 330], [700, 330]]} stroke={() => (sigOn() > 0.5 ? LIME : C.muted)} lineWidth={LW.emphasis}
          smoothness={0.4} lineCap="round" />
        <HairCell x={CX} y={CY} s={S} tilt={tilt} open={() => openOn() * (tilt() > 4 ? 1 : 0)} />
        <Node opacity={dots}>
          {Array.from({length: 6}, (_, i) => {
            const u = () => ((T() / 1.4 + i / 6) % 1);
            return <Circle x={CX - 30 + (i % 3) * 30} y={() => -300 + u() * 260} size={16} fill={LIME} opacity={() => Math.min(1, (1 - u()) * 4) * (tilt() > 6 ? 1 : 0.3)} />;
          })}
        </Node>
        <Node opacity={sigOn}>
          {[0, 1].map(j => {
            const u = () => ((T() / 1.6 + j / 2) % 1);
            const pos = (): P => { const q = u(); return q < 0.2 ? [CX, 248 + 400 * q] : [CX + (q - 0.2) / 0.8 * 1000, 330]; };
            return <Circle position={pos as any} size={30} fill={LIME} shadowColor={LIME} shadowBlur={18} />;
          })}
        </Node>
        <Locator focus="cells" />
      </Node>,
      steps: [
        function* () { yield* bend(1, 0.8, ease); },
        <Node>
          <Leader from={[-150, -300]} to={[-250, -260]} />
          <Small text="channels open" x={-130} y={-300} offset={[-1, 0]} color={C.chalk} />
          {/* channels fill lime when open */}
        </Node>,
        function* () { yield* dots(1, 0.6, ease); },
        <Node>
          <Small text="electrical signal" x={700} y={385} offset={[1, 0]} color={LIME} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S22', 1));
        yield* openOn(1, 0.3);
        yield* waitFor(cue('S22', 3) - cue('S22', 1) - 0.3);
        yield* sigOn(1, 0.6);
      },
    };
  },
  S23: () => {
    const thick = sig(0), thin = sig(0), dim = sig(1), bar5 = sig(0);
    const trunk: P = [-760, 340];
    const fib = (to: P, j: number, n: number): P[] => [[trunk[0], trunk[1] + (j - n / 2) * 3], [to[0] - 120, 300], [to[0] + (j - n / 2) * 2.5, to[1]]];
    const outer = [-110, 40, 190];
    return {
      base: <Node>
        <Line points={[[-760, 60], [420, 60]]} stroke={C.chalk} lineWidth={LW.structure} />
        <HairCell x={-430} y={-44} s={0.9} />
        <Node opacity={dim}>{outer.map(x => <OuterCell x={x} y={60} s={0.78} />)}</Node>
        <Small text="inner" x={-430} y={-280} />
        <Small text="outer" x={40} y={-310} />
        <Node opacity={thick}>
          {Array.from({length: 14}, (_, j) => <Spline points={fib([-430, 60], j, 14)} stroke={LIME} lineWidth={LW.structure} smoothness={0.5} opacity={0.85} />)}
        </Node>
        <Node opacity={thin}>
          {outer.map((x, j) => <Spline points={fib([x, 60], j, 3)} stroke={LIME} lineWidth={LW.hairline} smoothness={0.5} />)}
        </Node>
        <Locator focus="cells" />
      </Node>,
      steps: [
        <Node>
          <Rect x={280 + 0.95 * 520 / 2} y={300} width={0.95 * 520 - 6} height={46} radius={8} fill={LIME} />
          <Num text="≈ 95%" x={280} y={235} offset={[-1, 0]} size={44} />
          <Small text="of nerve fibres" x={280} y={370} offset={[-1, 0]} color={C.chalk} />
        </Node>,
        <Node>
          <Rect x={280 + 0.975 * 520} y={300} width={0.05 * 520 - 6} height={46} radius={6} fill={LIME} opacity={0.75} />
          <Num text="≈ 5%" x={800} y={235} offset={[1, 0]} size={44} />
        </Node>,
        function* () { yield* dim(0.4, 0.8, ease); },
        <Label text="what are they for?" x={40} y={-390} spacing={1} />,
      ],
      ambient: function* () {
        yield* waitFor(cue('S23', 0) - 0.1);
        yield* thick(1, 0.6, ease);
        yield* waitFor(Math.max(0, cue('S23', 1) - cue('S23', 0) - 0.5));
        yield* thin(1, 0.6, ease);
      },
    };
  },
  S24: () => {
    const cur = sig(0), len = sig(1), motor = sig(0), osc = sig(0);
    const L = () => len() + osc() * 0.13 * Math.sin(T() * 5);
    return {
      base: <Node>
        <DraftCard x={-330} y={50} w={980} h={700} />
        <Node x={-330} y={50}>
          <Circle y={250} width={760} height={120} stroke={C.muted} lineWidth={LW.hairline} />
          <Rect y={225} width={260} height={18} radius={6} stroke={C.chalk} lineWidth={LW.structure} fill={() => (cur() > 0.5 ? C.grid : null)} />
          <Line points={[[0, -320], [0, -255]]} stroke={() => (cur() > 0.5 ? LIME : C.muted)} lineWidth={LW.structure} lineCap="round" />
          <Rect y={-340} width={60} height={40} radius={8} stroke={() => (cur() > 0.5 ? LIME : C.muted)} lineWidth={LW.structure} />
          <Num text="+" x={70} y={-300} color={LIME} opacity={cur} />
          <Num text="−" x={180} y={235} color={LIME} opacity={cur} />
        </Node>
        <Locator focus="cells" />
      </Node>,
      steps: [
        <Node>
          <OuterCell x={-330} y={266} s={1} len={L} motor={motor} />
          <Num text="1985 · Brownell" x={260} y={-160} offset={[-1, 0]} size={46} />
        </Node>,
        function* () { yield* cur(1, 0.4); },
        <Node>
          <Small text="electromotility" x={260} y={-95} offset={[-1, 0]} color={V} />
          <Line points={[[-270, 42], [-230, 42]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Small text="shorter" x={-210} y={42} offset={[-1, 0]} color={C.chalk} />
        </Node>,
        <Node>
          <Line points={[[-270, -56], [-230, -56]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Small text="longer" x={-210} y={-56} offset={[-1, 0]} color={C.chalk} />
        </Node>,
        <Node x={500} y={140} rotation={-8}>
          <Rect width={330} height={120} radius={10} stroke={C.chalk} lineWidth={LW.emphasis} />
          <Label text="MOTOR" size={72} spacing={12} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S24', 2));
        yield* all(len(0.8, 0.6, ease), motor(1, 0.6));
        yield* waitFor(cue('S24', 3) - cue('S24', 2) - 0.6);
        yield* len(1.15, 0.8, ease);
        yield* waitFor(cue('S24', 4) - cue('S24', 3) - 0.8);
        yield* all(len(1, 0.6, ease), osc(1, 0.6));
      },
    };
  },
  S25: () => {
    const lat = sig(0);
    const tc = cue('S25', 2);
    const ph = () => {
      const t = T(), w0 = 2.4, w1 = 13, R = 1.5, a = Math.max(0, t - tc);
      return t * w0 + (a < R ? 0.5 * (w1 - w0) / R * a * a : 0.5 * (w1 - w0) * R + (w1 - w0) * (a - R));
    };
    const flex = () => Math.sin(ph());
    return {
      base: <Node>
        <OuterCell x={-650} y={230} s={0.9} />
        <Rect x={-683} y={40} width={44} height={90} radius={6} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[-661, 0], [-260, -190]]} stroke={C.muted} lineWidth={LW.hairline} />
        <Line points={[[-661, 85], [-260, 310]]} stroke={C.muted} lineWidth={LW.hairline} />
        <Rect x={240} y={60} width={1000} height={500} radius={18} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
        <Node x={240} y={30} opacity={lat}>
          <Line points={() => [[-460, -90 - flex() * 16], [460, -90 - flex() * 16]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Line points={() => [[-460, 90 + flex() * 16], [460, 90 + flex() * 16]]} stroke={C.chalk} lineWidth={LW.structure} />
          {Array.from({length: 11}, (_, i) => (
            <Rect x={(i - 5) * 82} width={() => 54 - flex() * 8} height={() => 150 + flex() * 32} radius={24} fill={C.refrigerant_soft} stroke={V} lineWidth={LW.structure} />
          ))}
        </Node>
        <Locator focus="cells" />
      </Node>,
      steps: [
        function* () { yield* lat(1, 0.6, ease); },
        <Node>
          <Num text="2000 · prestin" x={-220} y={-150} offset={[-1, 0]} size={46} color={V} />
          <Node x={-200} y={240}>
            {[0, 1, 2, 3, 4].map(i => <Line points={[[0, -24 + i * 12], [300, -24 + i * 12]]} stroke={C.muted} lineWidth={LW.hairline} />)}
            <Label text="Presto" x={10} y={-62} offset={[-1, 0]} size={40} spacing={1} />
          </Node>
          <Small text="presto = fast" x={200} y={230} offset={[-1, 0]} color={C.chalk} />
        </Node>,
        null,
      ],
    };
  },
  S26: () => {
    const lock = sig(0), f = sig(0.05), mark = sig(0);
    const W = 1400, H = 380;
    const trace = (amp: number, lag: number) => () => Array.from({length: 260}, (_, i) => {
      const u = i / 259, cyc = 3 + 32 * f();
      return [-W / 2 + 40 + (W - 80) * u, Math.sin(u * cyc * Math.PI * 2 - T() * 6 - lag) * amp] as P;
    });
    return {
      base: <Node>
        <Small text="isolated cells, lab tests" x={-740} y={-250} offset={[-1, 0]} color={C.chalk} />
        <Rect x={-40} y={-10} width={W} height={H} radius={18} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
        <Node x={-40} y={-10} opacity={lock}>
          <Node y={-90}><Line points={trace(48, 0)} stroke={LIME} lineWidth={LW.structure} /></Node>
          <Node y={100}><Line points={trace(48, 0.15)} stroke={V} lineWidth={LW.structure} /></Node>
          <Small text="signal" x={-W / 2 + 40} y={-160} offset={[-1, 0]} color={LIME} />
          <Small text="cell length" x={-W / 2 + 40} y={30} offset={[-1, 0]} color={V} />
        </Node>
        <Line points={[[-740, 280], [660, 280]]} stroke={C.muted} lineWidth={LW.structure} />
        <Line points={[[380, 250], [380, 310]]} stroke={C.chalk} lineWidth={LW.structure} opacity={() => 0.4 + mark() * 0.6} />
        <Rect x={() => -740 + 1400 * f()} y={280} width={10} height={44} radius={4} fill={C.chalk} />
        <Locator focus="cells" />
      </Node>,
      steps: [
        function* () { yield* lock(1, 0.6, ease); },
        <Small text="tens of thousands of times a second" x={-740} y={360} offset={[-1, 0]} color={C.chalk} />,
        <Small text="highest pitch we hear" x={380} y={240} color={C.chalk} offset={[0, 1]} />,
      ],
      ambient: function* () {
        yield* waitFor(cue('S26', 1));
        yield* f(0.72, 3.5, easeInOutCubic);
        yield* waitFor(Math.max(0, cue('S26', 2) - cue('S26', 1) - 3.5));
        yield* all(f(0.94, 1.6, ease), mark(1, 0.6));
      },
    };
  },
  S27: () => {
    const pump = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <PulseRow y={170} on={pump} />
        <Locator focus="cells" />
      </Node>,
      steps: [
        function* () { yield* pump(1, 0.6, ease); },
        <Node>
          <Num text="≈ 100×" x={-820} y={-390} offset={[-1, 0]} color={V} />
          <Small text="boost to the faintest sounds" x={-600} y={-388} offset={[-1, 0]} color={C.chalk} />
        </Node>,
        null,
        <Node x={560} y={300}>
          <Rect width={540} height={190} radius={16} fill={C.panel} opacity={0.92} />
          {[['whisper', 24, 110, -100], ['shout', 120, 22, 100]].map(([t, a, b, x]: any) => (
            <Node x={x}>
              <Rect y={30 - a / 2} width={70} height={a} fill={C.chalk} radius={4} />
              <Rect y={30 - a - b / 2} width={70} height={b} fill={V} radius={4} />
              <Small text={t} y={70} color={C.chalk} />
            </Node>
          ))}
        </Node>,
      ],
    };
  },
  S28: () => {
    const h2 = sig(230), br = sig(0);
    return {
      base: <Node>
        <Line points={[[-760, 340], [760, 340]]} stroke={C.muted} lineWidth={LW.hairline} />
        <Locator focus="cells" />
      </Node>,
      steps: [
        <Node>
          <Mouse x={-430} y={-60} />
          <Mouse x={330} y={-60} />
          <Small text="normal" x={-430} y={-240} color={C.chalk} />
          <Label text="no prestin" x={300} y={-212} spacing={1} />
          <Rect x={-430} y={340 - 115} width={120} height={230} fill={C.chalk} radius={[8, 8, 0, 0]} />
          <Rect x={330} y={() => 340 - h2() / 2} width={120} height={h2} fill={C.chalk} radius={[8, 8, 0, 0]} />
          <Small text="sensitivity" x={-760} y={110} offset={[-1, 0]} />
        </Node>,
        <Node opacity={br}>
          <Rect x={330} y={110 + (230 - 70) / 2} width={120} height={230 - 70} stroke={C.muted} lineWidth={LW.hairline} lineDash={[10, 8]} />
          <Line points={[[420, 110], [440, 110], [440, 270], [420, 270]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Num text="40–60 dB" x={460} y={165} offset={[-1, 0]} size={44} />
          <Small text="less sensitive" x={460} y={220} offset={[-1, 0]} color={C.chalk} />
        </Node>,
        <Node>
          <Tuft x={700} y={-100} s={0.9} tilt={() => 14 * Math.sin(T() * 3)} />
          <Small text="still senses motion" x={700} y={-20} color={C.chalk} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S28', 1));
        yield* all(h2(70, 1.0, ease), br(1, 0.8, ease));
      },
    };
  },
  S29: () => {
    const crack = sig(0), micO = sig(1);
    const at: P = sec(COCHLEA, 60, 30, 1);
    return {
      base: <Node>
        <EarSection x={60} y={30} />
        <Node x={at[0]} y={at[1]} opacity={micO}>
          <Rect width={420} height={300} radius={20} fill={C.bg} opacity={() => 1 - crack() * 0.5} />
          <MicSchematic s={0.62} x={-20} crack={crack} />
        </Node>
      </Node>,
      steps: [
        <Node>
          <Label text="not a microphone" x={-60} y={360} color={C.muted} spacing={1} />
          {/* the crack runs with this step */}
        </Node>,
        <Node>
          <AmpGlyph x={at[0]} y={at[1]} s={0.85} label={false} />
          <Label text="an amplifier" x={at[0]} y={360} color={V} spacing={1} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S29', 0));
        yield* crack(1, 0.9, ease);
        yield* waitFor(cue('S29', 1) - cue('S29', 0) - 0.9);
        yield* micO(0, 0.4);
      },
    };
  },
  // ================================================================ 5. the ear talks back
  S30: () => {
    const rings = sig(0), click = sig(0), sweep = sig(0), echo = sig(0), ring = sig(0), out = sig(0);
    const sx = (u: number) => scopeX(u);
    return {
      base: <Node>
        <ProbeView rings={rings} ring={ring} outRings={out} />
        <Scope y={300} click={click} echo={echo} sweep={sweep} />
        <Locator focus="canal" />
      </Node>,
      steps: [
        <Node x={-560} y={-385}>
          <Rect width={560} height={92} radius={12} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
          <Num text="1978 · David Kemp" size={44} />
        </Node>,
        function* () { yield* all(rings(1, 0.5), click(1, 0.3), sweep(0.3, 1.2, linear)); },
        function* () { yield* all(ring(1, 2.0, linear)); yield* out(1, 0.4); },
        <Node>
          <Line points={[[sx(0.1), 225], [sx(0.1), 205], [sx(0.29), 205], [sx(0.29), 225]]} stroke={C.chalk} lineWidth={LW.structure} y={0} />
          <Small text="a few milliseconds later" x={(sx(0.1) + sx(0.29)) / 2} y={160} color={C.chalk} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S30', 3) - 0.2);
        yield* all(rings(0, 0.5), sweep(1, 1.2, linear), echo(1, 1.0, ease));
      },
    };
  },
  S31: () => ({
    base: <Node>
      <Locator focus="canal" />
    </Node>,
    steps: [
      <Scope x={-430} y={20} w={780} h={300} click={1} echo={1} sweep={1} label="normal ear" />,
      <Scope x={430} y={20} w={780} h={300} click={1} echo={0} sweep={1} label="cochlear deafness" />,
    ],
  }),
  S32: () => {
    const cut = sig(0), ring = sig(0), out = sig(0), sc = sig(0), echo = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <Node opacity={cut}>
          <Rect width={1920} height={1080} fill={C.bg} />
          <ProbeView ring={ring} outRings={out} />
          <Node opacity={sc}><Scope y={300} click={0} echo={echo} sweep={1} /></Node>
          <Locator focus="canal" />
        </Node>
        <Locator focus="cochlea" opacity={() => 1 - cut()} />
      </Node>,
      steps: [
        <Label text="otoacoustic emission" x={-820} y={-390} offset={[-1, 0]} color={V} spacing={1} />,
        function* () { yield* cut(1, 0.4); yield* ring(1, 2.2, linear); yield* out(1, 0.4); },
        function* () { yield* all(sc(1, 0.6, ease), echo(1, 0.8, ease)); },
      ],
    };
  },
  S33: () => {
    const tick = sig(0);
    return {
      base: <Node>
        <Node x={-430} y={-40} scale={0.62}><ProbeView ring={1} outRings={1} labels={false} /></Node>
        <Locator focus="canal" />
      </Node>,
      steps: [
        null,
        <Node>
          <Label text="checks the ear, not the nerve" x={140} y={-170} offset={[-1, 0]} size={40} spacing={1} />
          <Line points={[[260, -70], [300, -30], [380, -120]]} stroke={C.chalk} lineWidth={LW.emphasis + 2} lineCap="round" lineJoin="round" end={tick} />
        </Node>,
        <Small text="the nerve gets a different test" x={140} y={-30} offset={[-1, 0]} color={C.chalk} />,
        <Node>
          {Array.from({length: 100}, (_, i) => (
            <Circle x={220 + (i % 10) * 26} y={40 + Math.floor(i / 10) * 26} size={16} fill={i < 98 ? C.chalk : null}
              stroke={i < 98 ? null : C.muted} lineWidth={LW.hairline} />
          ))}
          <Num text="≈ 98" x={520} y={70} offset={[-1, 0]} size={60} />
          <Small text="of every 100 newborns" x={520} y={140} offset={[-1, 0]} color={C.chalk} />
          <Small text="screened (US, 2020)" x={520} y={190} offset={[-1, 0]} color={C.chalk} />
        </Node>,
      ],
      ambient: function* () { yield* waitFor(cue('S33', 1) + 6.5); yield* tick(1, 0.6, ease); },
    };
  },
  S34: () => {
    const ring = sig(0), spec = sig(0), half = sig(0), sim = sig(0), women = sig(0);
    const on20 = [0, 2, 3, 6, 7, 9, 11, 12, 15, 17, 18];
    const specPts = () => Array.from({length: 200}, (_, i) => {
      const u = i / 199;
      let v = 0.06 + 0.03 * Math.sin(u * 91 + T() * 9) * Math.sin(u * 37 - T() * 5);
      v += 0.75 * Math.exp(-(((u - 0.36) / 0.008) ** 2)) + 0.55 * Math.exp(-(((u - 0.64) / 0.008) ** 2));
      return [-300 + 600 * u, 120 - 320 * v] as P;
    });
    return {
      base: <Node>
        <Node opacity={() => 1 - sim() * 0.8}>
          <HeadGrid x={-470} y={-30} cols={5} rows={4} dx={150} dy={170} s={0.7} on={on20} ring={ring} />
          <Small text="more than half of people with normal hearing" x={-440} y={300} color={C.chalk} opacity={half} />
          <Node x={430} y={-50} opacity={spec}>
            <Rect width={680} height={420} radius={16} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
            <Line points={[[-300, 140], [300, 140]]} stroke={C.muted} lineWidth={LW.hairline} />
            <Line points={specPts} stroke={V} lineWidth={LW.structure} lineJoin="round" />
            <Small text="pitch" x={300} y={175} offset={[1, 0]} />
          </Node>
          <Small text="more common in women" x={430} y={225} color={C.chalk} opacity={women} />
        </Node>
        <Locator focus="cochlea" opacity={() => 1 - sim()} />
      </Node>,
      steps: [
        function* () { yield* ring(1, 0.8, ease); },
        <Node>
          <Label text="spontaneous otoacoustic emissions" x={-120} y={-400} size={42} spacing={1} />
        </Node>,
        function* () { yield* women(1, 0.6, ease); },
        <Node>
          <Rect width={1300} height={400} radius={20} fill={C.panel} stroke={V} lineWidth={LW.structure} opacity={sim} />
          <Label text="SIMULATION" y={-120} spacing={10} />
          <Line points={() => Array.from({length: 240}, (_, i) => [-520 + (1040 * i) / 239, Math.sin(i * 0.55 - T() * 14) * 46] as P)}
            stroke={V} lineWidth={LW.structure} />
          <Small text="real tones are far too quiet to hear" y={120} color={C.chalk} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S34', 1) - 0.1);
        yield* spec(1, 0.6, ease);
        yield* waitFor(4.8);
        yield* half(1, 0.6, ease);
        yield* waitFor(Math.max(0, cue('S34', 3) - cue('S34', 1) - 6.1));
        yield* sim(1, 0.5, ease);
      },
    };
  },
  // ================================================================ 6. the price of an amplifier
  S35: () => {
    const lad = sig(0.25), w = sig(0);
    const bars = [85, 88, 91, 94, 97];
    return {
      base: <Node>
        <Ladder dim={lad} />
        <Locator focus="cells" />
      </Node>,
      steps: [
        function* () { yield* lad(1, 0.8, ease); },
        <Node>
          <Line points={[[LADDER.x - 14, dbY(85)], [LADDER.x + 760, dbY(85)]]} stroke={C.chalk} lineWidth={LW.emphasis} />
          <Num text="85 dB" x={LADDER.x - 36} y={dbY(85)} offset={[1, 0]} size={44} />
        </Node>,
        <Node>
          {bars.map((d, i) => (
            <Rect x={() => LADDER.x + 30 + (660 / 2 ** i) * w() / 2} y={dbY(d) - 18} width={() => (660 / 2 ** i) * w()} height={22} radius={6} fill={C.chalk}
              opacity={0.8} />
          ))}
          <Label text="louder = less time" x={-20} y={dbY(97)} offset={[-1, 0]} size={40} spacing={1} />
        </Node>,
      ],
      ambient: function* () { yield* waitFor(cue('S35', 2) + 0.1); yield* w(1, 1.4, ease); },
    };
  },
  S36: () => ({
    drift: false, overlay: true,
    base: <Node><Locator focus="cells" /></Node>,
    steps: [
      <Node>
        <Rect x={-850} y={-390} width={900} height={84} offset={[-1, 0]} radius={12} fill={C.panel} opacity={0.88} />
        <Label text="among the first cells noise destroys" x={-820} y={-390} offset={[-1, 0]} spacing={1} />
      </Node>,
      <Node>
        <Rect x={-850} y={360} width={520} height={70} offset={[-1, 0]} radius={12} fill={C.panel} opacity={0.88} />
        <Small text="base: high pitches go first" x={-820} y={360} offset={[-1, 0]} color={C.chalk} />
      </Node>,
    ],
  }),
  S37: () => {
    const m = sig(0), blur = sig(0);
    const live2 = (u: number) => Math.max(respLive(u, 0.42, 1.2), respLive(u, 0.58, 1.2));
    const dead2 = (u: number) => (respDead(u, 0.42) + respDead(u, 0.58)) * 0.8;
    const curve = (u: number) => live2(u) + (dead2(u) - live2(u)) * m();
    return {
      base: <Node y={40}>
        <ChartAxes />
        <Line points={chartPts(curve, CH.w, CH.h, 220)} stroke={C.chalk} lineWidth={LW.emphasis} lineJoin="round" />
        <Line closed points={() => [...chartPts(u => Math.max(curve(u), dead2(u)), CH.w, CH.h, 220)().slice(60, 161), ...chartPts(dead2, CH.w, CH.h, 220)().slice(60, 161).reverse()]}
          fill={V} opacity={() => (1 - m()) * 0.5} />
        <Small text="two close pitches" x={-CH.w / 2 + CH.w * 0.5} y={-CH.h / 2 - 40} color={C.chalk} opacity={() => 1 - m()} />
      </Node>,
      steps: [
        <Node>
          <Num text="≈ 50 dB" x={-640} y={-360} offset={[-1, 0]} size={48} />
          <Small text="less sensitive (animal studies)" x={-430} y={-358} offset={[-1, 0]} color={C.chalk} />
        </Node>,
        <Node opacity={blur}>
          <Line points={[[-180, 120], [-180, 100], [180, 100], [180, 120]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Small text="blurred into one" y={60} color={C.chalk} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(cue('S37', 0));
        yield* m(1, 1.8, ease);
        yield* waitFor(cue('S37', 1) - cue('S37', 0) - 1.8);
        yield* blur(1, 0.6);
      },
    };
  },
  S38: () => {
    const lostM = sig(0), lostB = sig(0), grow = sig(0), birdL = sig(0), under = sig(0);
    const gaps = [2, 3, 6, 8, 9];
    const row = (y: number, lost: any, regrow: boolean) => Array.from({length: 12}, (_, i) => (
      <CellIcon x={-660 + i * 120} y={y} lost={gaps.includes(i) ? (regrow ? () => lost() * (1 - grow()) : lost) : 0} />
    ));
    return {
      base: <Node>
        <Label text="mammals: lost for good" x={-800} y={-280} offset={[-1, 0]} size={42} spacing={1} />
        <Line points={() => [[-800, -246], [-800 + 520 * under(), -246]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" opacity={() => (under() > 0 ? 1 : 0)} />
        {row(-110, lostM, false)}
        <Line points={[[-720, -40], [720, -40]]} stroke={C.muted} lineWidth={LW.hairline} />
        <Node opacity={birdL}>
          <Label text="birds: grow back (1988)" x={-800} y={90} offset={[-1, 0]} size={42} spacing={1} />
          {row(250, lostB, true)}
          <Line points={[[-720, 320], [720, 320]]} stroke={C.muted} lineWidth={LW.hairline} />
        </Node>
        <Locator focus="cells" />
      </Node>,
      steps: [
        function* () { yield* lostM(1, 0.8, ease); },
        function* () { yield* grow(1, 1.6, ease); },
        function* () { yield* under(1, 0.6, ease); },
      ],
      ambient: function* () {
        yield* waitFor(cue('S38', 0) + 4.0);
        yield* all(birdL(1, 0.6, ease), lostB(1, 0.01));
      },
    };
  },
  S39: () => {
    const l85 = sig(0), sweep = sig(0);
    return {
      base: <Node>
        <Ladder dim={0.55} />
        <Node opacity={l85}>
          <Line points={[[LADDER.x - 14, dbY(85)], [LADDER.x + 560, dbY(85)]]} stroke={C.chalk} lineWidth={LW.emphasis} />
          <Num text="85 dB" x={LADDER.x - 36} y={dbY(85)} offset={[1, 0]} size={44} />
        </Node>
        <Locator focus="cells" />
      </Node>,
      steps: [
        <Node>
          <Clock x={300} y={dbY(85) + 20} sweep={sweep} />
          <Small text="85 dB averaged over 8 hours (NIOSH)" x={300} y={dbY(85) + 190} color={C.chalk} />
        </Node>,
      ],
      ambient: function* () {
        yield* waitFor(3.6);
        yield* l85(1, 0.6, ease);
        yield* waitFor(cue('S39', 0) - 3.6);
        yield* sweep(1, 1.2, ease);
      },
    };
  },
  // ================================================================ 7. close
  S40: () => {
    const pump = sig(0), rings = sig(0);
    return {
      drift: false, overlay: true,
      base: <Node>
        <PulseRow y={170} on={pump} />
        <Node opacity={rings}>
          {[0, 1, 2].map(j => {
            const u = () => ((T() / 3 + j / 3) % 1);
            return <Circle size={() => 120 + u() * 700} stroke={V} lineWidth={LW.structure} opacity={() => (1 - u()) * 0.8} />;
          })}
        </Node>
        <Locator focus="cochlea" />
      </Node>,
      steps: [
        null,
        function* () { yield* pump(1, 0.6, ease); },
        function* () { yield* pump(0, 0.8, ease); },
        function* () { yield* rings(1, 0.8, ease); },
      ],
    };
  },
  S41: () => {
    const next = sig(0);
    return {
      base: <Node>
        <EarSection x={30} y={-150} s={0.6} opacity={0.6} />
        <Node x={30 + COCHLEA[0] * 0.6} y={-150 + COCHLEA[1] * 0.6}>
          {[0, 1, 2].map(j => {
            const u = () => ((T() / 3 + j / 3) % 1);
            return <Circle size={() => 80 + u() * 380} stroke={V} lineWidth={LW.structure} opacity={() => (1 - u()) * 0.7} />;
          })}
        </Node>
        <Small text="Next time" y={340} color={C.chalk} opacity={next} />
      </Node>,
      steps: [
        <Label text="DESIGNED OTHERWISE" y={250} size={72} spacing={14} />,
      ],
      ambient: function* () { yield* waitFor(cue('S41', 0) + 3.2); yield* next(1, 0.6, ease); },
    };
  },
};

