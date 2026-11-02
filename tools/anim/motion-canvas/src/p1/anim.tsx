// FPI P1 production scenes. Each builder returns {base, steps}: steps map 1:1 to the
// storyboard `changes` for that scene (scenes_src.py) and fire at their word cues.
import {Circle, Line, Node, Rect, Txt, Video} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeOutCubic, linear, sequence, waitFor} from '@motion-canvas/core';
import {
  AirLine, Bar, OpenDoor, Bolt, Bubbles, C, Card, Coil, CoilAssembly, FridgeCut, FridgeSide, Gauge, Hand, HeatArrow, HeatArrows,
  Label, LoopDiagram, LoopFlow, LW, MiniLoop, Moisture, Num, Particles, PipeFlow, Shimmer, Small, T as TY, Thermometer, Title,
} from '../lib/parts';
import {T} from '../lib/clock';
import type {Built} from '../lib/motion';

type P = [number, number];
const Pipe = ({x = 0, y = 0, w = 800, h = 90, liquid = 1, children = null}: any) => (
  <Node x={x} y={y}>
    <Rect width={w} height={h} radius={h / 2} fill={C.refrigerant_soft} stroke={C.chalk} lineWidth={LW.structure} />
    {liquid > 0 ? <Rect x={-w / 2 + (w * liquid) / 2 + 4} width={w * liquid - 8} height={h - 16} radius={(h - 16) / 2} fill={C.refrigerant} /> : null}
    {children}
  </Node>
);
const fadeOut = (r: any, d = 0.4) => function* () { yield* r().opacity(0, d); };

export const ANIM: Record<string, () => Built> = {
  // ================================================================ 1. cold open
  S01: () => {
    const warm = createSignal(0);
    return {
      base: <Node>
        <Node opacity={() => warm()}><Shimmer x={-610} y={-120} n={3} h={190} /><Shimmer x={-50} y={-120} n={3} h={190} /></Node>
        <FridgeCut x={-330} y={-20} s={0.86} warmSides={warm} machineDim={0.25} />
        <Title text="Why does your fridge" x={500} y={-88} size={64} />
        <Label text="cold inside" x={-330} y={-430} color={C.cold} size={36} />
      </Node>,
      steps: [
        null,
        <Node><Title text="heat up to keep" x={500} y={0} size={64} /><Label text="warm outside" x={-330} y={378} color={C.heat} size={36} /></Node>,
        <Title text="food cold?" x={500} y={88} size={64} />,
      ],
      ambient: function* () { yield* waitFor(1.3); yield* warm(1, 0.8); },
    };
  },
  S02: () => {
    const warm = createSignal(0);
    const grille = createSignal(0);
    return {
      // 2D layer only: composited over the Blender render (renders/S02.mp4) by tools/anim/composite_heroes.py
      drift: false,
      overlay: true,
      base: <Node>
        {/* warmth is a graphic overlay on a neutral render (side panel ~x 25..180, y -440..360 in this framing) */}
        <Line closed points={[[-18, -440], [132, -400], [132, 300], [-18, 340]]} fill={C.heat} opacity={() => warm() * 0.3} />
        <Node x={200} y={-80} opacity={() => warm()}><Shimmer n={3} h={200} /></Node>
        <Rect x={-135} y={330} width={240} height={40} radius={16} fill={C.heat} opacity={() => grille() * 0.5} shadowColor={C.heat} shadowBlur={40} />
      </Node>,
      steps: [
        null,
        <Hand x={58} y={-90} s={0.62} rotation={-6} />,
        function* () { yield* warm(1, 1.2); },
        function* () { yield* grille(1, 0.8); },
      ],
    };
  },
  S03: () => {
    const lv = createSignal(0.3);
    const read = createSignal(0);
    return {
      base: <Node>
        <FridgeSide x={-480} y={20} />
        <Rect x={-330} y={20} width={14} height={600} fill={C.heat} opacity={0.85} radius={7} />
        <Node opacity={read}>
          <Num text="> 50 °C" x={140} y={-150} size={110} color={C.heat_peak} offset={[-1, 0]} />
          <Label text="some models, in a hot room" x={140} y={80} size={46} offset={[-1, 0]} />
        </Node>
      </Node>,
      steps: [
        <Node><Line points={[[-322, -40], [-150, -40]]} stroke={C.chalk} lineWidth={LW.structure} /><Thermometer x={-90} y={-20} level={lv} color={C.heat_peak} /></Node>,
        function* () { yield* all(lv(0.78, 1.2, easeOutCubic), read(1, 0.8)); },
        <Num text="≈ 120 °F" x={140} y={-30} size={70} offset={[-1, 0]} />,
        null,
      ],
    };
  },
  S04: () => {
    const zoom = createSignal(0);
    const heat = createSignal(0);
    return {
      base: <Node>
        <Node opacity={() => 1 - zoom() * 0.6}><FridgeCut x={-560} y={20} s={0.75} heater="outline" /></Node>
        <Rect x={-560} y={-290} width={420} height={230} stroke={C.chalk} lineWidth={LW.hairline} radius={12} opacity={() => zoom()} />
      </Node>,
      steps: [
        function* () { yield* zoom(1, 1.0); },
        <Node><CoilAssembly x={420} y={-60} w={620} h={260} heater="outline" /><Label text="COLD COIL" x={420} y={-260} color={C.cold} /></Node>,
        <Node>
          <Line x={420} y={-60} points={[[-320, 170], [320, 170], [320, 200], [-320, 200]]} stroke={C.heat} lineWidth={12} radius={14} lineCap="round" shadowColor={C.heat} shadowBlur={30} opacity={() => 0.75 + heat() * 0.25 * Math.sin(T() * 6)} />
          <Label text="HEATER" x={420} y={210} color={C.heat} />
        </Node>,
        function* () { yield* heat(1, 0.3); },
      ],
    };
  },
  // ================================================================ 2. cold is not a thing
  S05: () => {
    return {
      base: <Node>
        <FridgeCut x={-420} y={0} s={0.8} />
      </Node>,
      steps: [
        <OpenDoor x={-420} y={0} s={0.8} />,
        <Title text="“Let the cold out.”" x={420} y={-300} size={64} />,
        <Title text="“Keep the cold in.”" x={420} y={-180} size={64} />,
        <Node>
          <Line points={[[160, -300], [680, -300]]} stroke={C.chalk} lineWidth={LW.emphasis} />
          <Line points={[[160, -180], [680, -180]]} stroke={C.chalk} lineWidth={LW.emphasis} />
          <HeatArrows from={[60, 40]} to={[-330, 40]} n={3} gap={110} />
          <Label text="heat gets in" x={420} y={230} color={C.heat} />
        </Node>,
      ],
    };
  },
  S06: () => {
    const a = createSignal(0.85), b = createSignal(0.25);
    return {
      base: <Node>
        <Rect x={-280} y={20} width={400} height={300} radius={20} fill={C.heat_soft} stroke={C.heat} lineWidth={LW.structure} />
        <Rect x={280} y={20} width={400} height={300} radius={20} fill={C.cold_soft} stroke={C.cold} lineWidth={LW.structure} />
        <Label text="hotter" x={-280} y={230} color={C.heat} />
        <Label text="colder" x={280} y={230} color={C.cold} />
        <Thermometer x={-280} y={-260} h={200} level={a} color={C.heat} scale={0.8} />
        <Thermometer x={280} y={-260} h={200} level={b} color={C.cold} scale={0.8} />
      </Node>,
      steps: [
        null,
        <HeatArrows from={[-170, 20]} to={[170, 20]} n={3} gap={80} />,
        function* () { yield* all(a(0.6, 1.5), b(0.45, 1.5)); },
      ],
      ambient: function* () { yield* waitFor(0); },
    };
  },
  S07: () => {
    const mug = createRef<Node>();
    const glass = createRef<Node>();
    return {
      base: <Node>
        <Hand x={0} y={20} s={1.2} />
        <Node ref={glass} opacity={0} x={520} y={40}>
          <Rect width={160} height={250} radius={[0, 0, 16, 16]} stroke={C.cold} lineWidth={LW.structure} fill={C.cold_soft} />
          <Small text="cold drink" y={180} color={C.chalk} />
        </Node>
      </Node>,
      steps: [
        <Node ref={mug}>
          <Node x={-520} y={40}>
            <Rect width={180} height={220} radius={[0, 0, 30, 30]} stroke={C.chalk} lineWidth={LW.structure} fill={C.heat_soft} />
            <Circle x={-120} size={120} startAngle={90} endAngle={270} stroke={C.chalk} lineWidth={LW.structure} />
            <Shimmer y={-190} n={3} h={90} />
            <Small text="hot mug" y={170} color={C.chalk} />
          </Node>
          <HeatArrows from={[-400, 40]} to={[-158, 40]} n={2} gap={70} />
        </Node>,
        function* () { yield* all(mug().opacity(0, 0.5), glass().opacity(1, 0.5)); },
        <Node>
          <HeatArrows from={[150, 40]} to={[410, 40]} n={2} gap={70} />
          <Label text="the hand is losing heat to the drink" y={-380} size={40} />
        </Node>,
      ],
    };
  },
  S08: () => ({
    base: <FridgeCut x={0} y={0} s={0.86} milkCold={false} />,
    steps: [
      <Node>
        <HeatArrow from={[-110, -50]} to={[-60, -260]} />
        <HeatArrow from={[60, 20]} to={[40, -260]} />
        <Label text="removes heat" x={560} y={-300} color={C.heat} />
        <Small text="heat goes to the cold coil" x={560} y={-240} color={C.chalk} />
      </Node>,
      <Node x={-95} y={26}>
        <Rect width={70} height={110} stroke={C.cold} lineWidth={LW.structure} radius={6} fill={C.panel} />
        <Line points={[[-35, -55], [0, -85], [35, -55]]} stroke={C.cold} lineWidth={LW.structure} />
      </Node>,
    ],
  }),
  S09: () => {
    const ball = createSignal(0);
    const cl = createRef<Node>();
    const pos = (u: number): P => [-560 + u * 980, -60 + u * 312];
    return {
      base: <Node>
        <Rect x={-520} y={-250} width={700} height={330} radius={30} fill={C.heat_soft} opacity={0.4} />
        <Line points={[[-760, -100], [500, 300]]} stroke={C.chalk} lineWidth={LW.structure} />
        <FridgeCut x={680} y={150} s={0.5} />
        <Circle size={70} fill={C.heat} position={() => { const p = pos(ball()); return [p[0], p[1] - 40]; }} />
        <Node ref={cl} opacity={0}><Small text="Clausius statement · second law of thermodynamics" x={-600} y={360} color={C.chalk} offset={[-1, 0]} /></Node>
      </Node>,
      steps: [
        <Node><Label text="KITCHEN · warmer" x={-520} y={-370} color={C.heat} /><Label text="INSIDE · colder" x={680} y={-140} color={C.cold} /></Node>,
        function* () { yield* ball(1, 2.2, easeInOutCubic); },
        function* () { yield* ball(0.9, 0.5, easeOutCubic).to(1, 0.6, easeInOutCubic); },
        function* () {
          yield* cl().opacity(1, 0.5); yield* waitFor(3.5); yield* cl().opacity(0, 0.6);
          // "takes work": the ball tries to climb and rolls back
          yield* ball(0.7, 1.0, easeOutCubic); yield* ball(1, 0.9, easeInOutCubic);
          yield* ball(0.6, 1.1, easeOutCubic); yield* ball(1, 1.0, easeInOutCubic);
        },
      ],
      ambient: function* () { yield* waitFor(0); },
    };
  },
  S10: () => {
    const ball = createSignal(0);
    const pos = (u: number): P => [420 - u * 720, 230 - u * 290];
    return {
      base: <Node>
        <Rect x={-520} y={-250} width={700} height={330} radius={30} fill={C.heat_soft} opacity={0.4} />
        <Label text="KITCHEN" x={-520} y={-370} color={C.heat} />
        <Line points={[[-760, -100], [500, 300]]} stroke={C.chalk} lineWidth={LW.structure} />
        <FridgeCut x={680} y={150} s={0.5} />
        <Rect x={60} y={120} width={190} height={130} radius={30} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} rotation={17} />
        <Label text="HEAT PUMP" x={60} y={-20} />
        <Circle size={70} fill={C.heat} position={() => pos(ball())} />
      </Node>,
      steps: [
        <Node><Line points={[[60, 190], [60, 240]]} stroke={C.electric} lineWidth={LW.structure} /><Bolt x={60} y={290} s={1} /></Node>,
        function* () { yield* all(ball(1, 2.0, easeInOutCubic)); },
      ],
    };
  },
  // ================================================================ 3. the loop
  S11: () => {
    const drop = createSignal(0);
    return {
      base: <Node />,
      steps: [
        <LoopDiagram zones labels={false} bolt={false} lit={[]} />,
        <Node><Rect width={1100} height={560} radius={70} stroke={C.refrigerant} lineWidth={LW.emphasis} /><Label text="REFRIGERANT" y={-40} color={C.refrigerant} /><Small text="one sealed loop, one drop to follow" y={20} /></Node>,
        <Circle size={34} fill={C.refrigerant} x={() => 300 - ((T() * 120) % 700)} y={-280} />,
      ],
    };
  },
  S12: () => {
    const hi = createSignal(0.5), lo = createSignal(0.5);
    const bub = createSignal(0);
    return {
      base: <Line points={[[0, -380], [0, 380]]} stroke={C.grid} lineWidth={LW.hairline} />,
      steps: [
        <Node>
          {[-440, 440].map((x, i) => (
            <Node x={x}>
              <Pipe y={140} w={600} h={110} liquid={1} />
              <Gauge y={-120} v={i ? lo : hi} />
              <Thermometer x={230} y={-150} h={240} level={i ? () => 0.5 - (0.5 - lo()) * 0.9 : () => hi()} color={i ? C.cold : C.heat} scale={0.7} />
              <Small text="boiling temperature" x={230} y={40} color={C.chalk} />
              <Label text={i ? 'LOW PRESSURE' : 'HIGH PRESSURE'} y={-330} size={36} />
              <Label text={i ? 'lower boiling temperature' : 'higher boiling temperature'} y={300} size={36} color={i ? C.cold : C.heat}
                opacity={i ? () => Math.min(1, (0.5 - lo()) / 0.35) : () => Math.min(1, (hi() - 0.5) / 0.35)} />
              {i ? <Node y={140} opacity={bub}><Bubbles xs={[-180, -60, 60, 170]} y0={30} y1={-30} size={22} period={1.3} /></Node> : null}
            </Node>
          ))}
        </Node>,
        function* () { yield* hi(0.85, 1.0); },
        function* () { yield* all(lo(0.15, 1.0), bub(1, 0.6)); },
      ],
      ambient: function* () { yield* waitFor(0); },
      // captions appear with their gauges
    } as Built;
  },
  S13: () => {
    const m = createSignal(0);
    return {
      base: <Node>
        <Thermometer x={-420} y={-20} level={() => 0.5 - m() * 0.22} color={C.cold} />
        <Node x={600} y={100}>
          <Line points={[[-90, -170], [-90, 60], [-120, 150], [120, 150], [90, 60], [90, -170]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Rect y={95} width={220} height={100} fill={C.refrigerant} />
        </Node>
      </Node>,
      steps: [
        <Node><Line points={[[-520, -60], [-320, -60]]} stroke={C.chalk} lineWidth={LW.structure} /><Num text="32 °F (0 °C) water freezes" x={-280} y={-60} size={36} offset={[-1, 0]} /></Node>,
        <Node>
          <Line points={[[-500, 60], [-340, 60]]} stroke={C.refrigerant} lineWidth={LW.emphasis} />
          <Num text="≈ 11 °F (−12 °C)" x={-280} y={50} size={50} color={C.refrigerant} offset={[-1, 0]} />
          <Label text="ISOBUTANE BOILS" x={-280} y={120} color={C.refrigerant} size={36} offset={[-1, 0]} />
          <Label text="at ordinary air pressure" x={-280} y={175} size={36} offset={[-1, 0]} />
        </Node>,
        <Node x={600} y={100}><Bubbles xs={[-50, 0, 50, -20]} y0={130} y1={-120} size={24} period={1.8} /></Node>,
      ],
      ambient: function* () { yield* m(1, 1.5); },
    };
  },
  S14: () => ({
    base: <Node>
      <MiniLoop focus="evaporator" />
      <Rect x={-80} y={0} width={1200} height={560} radius={30} fill={C.cold_soft} opacity={0.35} />
      <Line points={[[-520, 250], [360, 250], [360, 280], [-520, 280]]} stroke={C.muted} lineWidth={6} lineDash={[14, 12]} radius={14} />
      <Small text="defrost heater (off)" x={-80} y={330} color={C.muted} />
      <Pipe x={-80} y={40} w={1000} h={150} liquid={0.62} />
      <Small text="liquid" x={-560} y={150} color={C.refrigerant} />
      <Small text="vapor" x={400} y={150} color={C.refrigerant} />
    </Node>,
    steps: [
      <Label text="EVAPORATOR: low pressure, so it boils" x={-80} y={-470} color={C.cold} size={36} />,
      <Node>
        <Node x={-80} y={40}><Bubbles xs={[-380, -260, -140, -20, 80]} y0={50} y1={-50} size={26} period={1.4} /></Node>
        <PipeFlow a={180} b={400} y={40} n={5} size={18} period={2.2} jitter={14} />
      </Node>,
      <Node>
        <Rect x={-400} y={-360} width={130} height={80} radius={14} stroke={C.chalk} lineWidth={LW.structure} />
        <Small text="leftovers, air" x={-250} y={-360} color={C.chalk} offset={[-1, 0]} />
        <HeatArrows from={[-400, -300]} to={[-400, -50]} n={2} gap={160} axis="x" />
      </Node>,
      <Node>
        <Rect x={260} y={-360} width={60} height={110} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[290, -415], [330, -400], [330, -320], [290, -305]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Small text="walls, door" x={360} y={-360} color={C.chalk} offset={[-1, 0]} />
        <HeatArrows from={[200, -300]} to={[200, -50]} n={2} gap={160} axis="x" />
      </Node>,
    ],
  }),
  S15: () => {
    const p = createSignal(0); // 0 = open, 1 = squeezed
    const halo = createSignal(0);
    return {
      base: <Node>
        <MiniLoop focus="compressor" />
        <Pipe x={-555} y={20} w={400} h={160} liquid={0} />
        <PipeFlow a={-720} b={-380} y={20} n={6} size={18} period={3} jitter={40} />
        <Rect x={-80} y={20} width={520} height={360} radius={40} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={-80} y={20} width={300} height={200} radius={10} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={() => -215 + p() * 150} y={20} width={30} height={196} fill={C.chalk} />
        {[[0.1, -55], [0.8, -60], [0.45, -20], [0.2, 30], [0.65, 15], [0.9, 50], [0.35, 70], [0.55, -70]].map(([fx, fy], i) => (
          <Circle size={18} fill={C.refrigerant}
            x={() => { const L = -195 + p() * 150; return L + 15 + fx * (40 - L); }}
            y={() => 20 + fy * (1 - p() * 0.15) + Math.sin(T() * 5 + i) * 3} />
        ))}
        <Pipe x={380} y={-60} w={360} h={70} liquid={0} />
        <Rect x={380} y={-60} width={380} height={92} radius={46} stroke={C.heat} lineWidth={10} opacity={() => halo() * 0.85} shadowColor={C.heat} shadowBlur={30} />
        <PipeFlow a={220} b={540} y={-60} n={10} size={16} period={1.8} />
        <Label text="COMPRESSOR squeezes vapor" x={-80} y={-330} />
      </Node>,
      steps: [
        null,
        function* () { for (let k = 0; k < 3; k++) { yield* p(1, 1.0, easeInOutCubic); yield* p(0, 0.8, easeInOutCubic); } },
        function* () { yield* halo(1, 0.8); },
        <Node><Line points={[[-80, 200], [-80, 240]]} stroke={C.electric} lineWidth={LW.structure} /><Bolt x={-80} y={290} s={1} /><Small text={"still vapor, now\nhigh pressure and hot"} x={540} y={90} color={C.chalk} textAlign="center" /></Node>,
      ],
    };
  },
  S16: () => {
    const fridge = (x: number, i: number) => (
      <Node x={x} y={-20}>
        <FridgeSide w={260} h={560} />
        {i === 0 ? <Line points={[[140, -200], [160, -150], [140, -100], [160, -50], [140, 0], [160, 50], [140, 100], [160, 150]]} stroke={C.heat} lineWidth={LW.structure} /> : null}
        {i === 1 ? <Node><Line points={[[-120, -240], [-120, 160]]} stroke={C.heat} lineWidth={LW.emphasis} /><Line points={[[120, -240], [120, 160]]} stroke={C.heat} lineWidth={LW.emphasis} /></Node> : null}
        {i === 2 ? <Node><Coil x={-40} y={220} w={120} h={70} turns={2} color={C.heat} fill={C.heat_soft} /><Circle x={70} y={220} size={60} stroke={C.chalk} lineWidth={LW.hairline} rotation={() => T() * 400} startAngle={0} endAngle={300} /></Node> : null}
        <Small text={['back coil', 'in the side walls', 'bottom, fan-cooled'][i]} y={340} color={C.chalk} />
      </Node>
    );
    return {
      base: <Label text="CONDENSER: three common places" y={-400} color={C.heat} />,
      steps: [fridge(-560, 0), fridge(0, 1), fridge(560, 2)],
    };
  },
  S17: () => {
    const cond = createSignal(0);
    return {
      base: <Node>
        <MiniLoop focus="condenser" />
        <Coil x={-120} y={40} w={380} h={560} turns={0} color={C.heat} fill={C.heat_soft} />
        <Label text="CONDENSER" x={-120} y={-400} color={C.heat} />
        <Pipe x={-120} y={200} w={300} h={70} liquid={0} />
        <PipeFlow a={-240} b={0} y={200} n={4} size={18} period={2.5} />
        <Pipe x={-120} y={20} w={300} h={70} liquid={0} />
        <Rect x={() => -120 - 150 + 4 + (296 * 0.45 * cond()) / 2} y={20} width={() => 296 * 0.45 * cond()} height={54} radius={27} fill={C.refrigerant} opacity={() => (cond() > 0.02 ? 1 : 0)} />
        <Pipe x={-120} y={-160} w={300} h={70} liquid={0} />
        <Rect x={-120} y={-160} width={() => 292 * cond()} height={54} radius={27} fill={C.refrigerant} opacity={() => (cond() > 0.02 ? 1 : 0)} />
        <Line points={[[30, 200], [70, 200], [70, 20], [30, 20]]} stroke={C.chalk} lineWidth={LW.structure} radius={40} />
        <Line points={[[-270, 20], [-310, 20], [-310, -160], [-270, -160]]} stroke={C.chalk} lineWidth={LW.structure} radius={40} />
        <Small text="in from the compressor" x={-120} y={370} color={C.chalk} />
        <Small text="out to the capillary tube" x={-120} y={-300} color={C.chalk} />
        <Label text="vapor turns to liquid" x={-560} y={20} size={36} />
      </Node>,
      steps: [
        <Node><HeatArrows from={[90, 20]} to={[420, 20]} n={3} gap={150} /><Small text="hotter than the room, so heat leaves" x={560} y={240} color={C.heat} /></Node>,
        function* () { yield* cond(1, 1.6, easeInOutCubic); },
      ],
      ambient: function* () { yield* waitFor(0); },
    } as Built;
  },
  S18: () => {
    const lp = createSignal(0.5);
    return {
      base: <Node>
        <MiniLoop focus="capillary" />
        <Pipe x={560} y={0} w={560} h={150} liquid={1} />
        <Label text="HIGH PRESSURE" x={560} y={140} size={36} />
        <Gauge x={560} y={330} v={0.85} />
      </Node>,
      steps: [
        <Node>
          <Rect x={0} y={0} width={620} height={40} radius={20} fill={C.refrigerant} stroke={C.chalk} lineWidth={LW.structure} />
          <Label text="CAPILLARY TUBE: a long, very narrow bore" y={-200} />
        </Node>,
        <Node>
          <Pipe x={-560} y={0} w={560} h={150} liquid={0.75} />
          <Label text="LOW PRESSURE" x={-560} y={140} size={36} />
          <Small text="to the evaporator" x={-560} y={190} color={C.chalk} />
          <Gauge x={-560} y={330} v={lp} />
          {[0, 1, 2, 3].map(i => <Rect width={60} height={14} radius={7} fill={C.refrigerant_soft} y={0} x={() => 290 - (((T() / 1.2 + i / 4) % 1) * 580)} />)}
        </Node>,
        function* () { yield* lp(0.15, 1.0); },
        <Node x={-560} y={0}><Bubbles xs={[-60, 40, 120, 180]} y0={40} y1={-40} size={24} period={1.3} /></Node>,
      ],
      ambient: function* () { yield* waitFor(0); },
    } as Built;
  },
  S19: () => ({
    base: <Node>
      <MiniLoop focus="capillary" focus2="compressor" />
      <Pipe x={0} y={60} w={1500} h={110} liquid={0} />
      <PipeFlow a={-700} b={700} y={90} n={9} size={18} period={6} />
      <Pipe x={0} y={-15} w={1500} h={40} liquid={1} />
      <Small text="capillary tube: warm liquid" x={-750} y={-80} color={C.chalk} offset={[-1, 0]} />
      <Small text="suction line to the compressor: cold vapor" x={-750} y={160} color={C.chalk} offset={[-1, 0]} />
    </Node>,
    steps: [
      null,
      <Node><Rect x={0} y={5} width={1400} height={10} radius={5} fill={C.chalk} /><Small text="solder joint" x={0} y={-110} color={C.chalk} /></Node>,
      <Node>{[-450, -150, 150, 450].map(x => <HeatArrow from={[x, -25]} to={[x, 55]} width={LW.emphasis} />)}</Node>,
    ],
  }),
  S20: () => ({
    base: <Node><LoopDiagram zones lit={[]} /><LoopFlow n={16} period={8} /></Node>,
    steps: [<Node><LoopDiagram zones heatIn heatOut /><LoopFlow n={16} period={8} /></Node>],
  }),
  S21: () => ({
    base: <Node><MiniLoop focus="evaporator" focus2="compressor" /><Label text="Energy is conserved" x={-200} y={-380} /></Node>,
    steps: [
      <Bar x={-560} h={300} color={C.heat} label="heat removed from inside" />,
      <Node><Label text="+" x={-360} y={150} size={80} /><Bar x={-160} h={170} color={C.electric} label="electricity in" /></Node>,
      <Node>
        <Label text="=" x={60} y={150} size={80} />
        <Node x={380}>
          <Rect y={300 - 150} width={160} height={300} fill={C.heat} />
          <Rect y={300 - 300 - 85} width={160} height={170} fill={C.heat} stroke={C.electric} lineWidth={LW.structure} />
          <Small text="heat into the kitchen" y={340} color={C.chalk} />
        </Node>
      </Node>,
    ],
  }),
  S22: () => {
    const g = createSignal(0);
    const rng = createSignal(0);
    const pulse = createSignal(0);
    return {
      base: <Node>
        <Small text="per unit of electricity, on a standard compressor test" y={-380} color={C.chalk} />
        {[0, 1, 2].map(i => (
          <Node x={-200 + i * 320}><Line points={[[0, -220], [0, 150]]} stroke={C.grid} lineWidth={LW.hairline} /><Num text={`${i}`} y={-250} size={34} color={C.muted} /></Node>
        ))}
        <Node y={-150}><Label text="electricity in" x={-760} offset={[-1, 0]} size={36} /><Rect x={-200 + 160} width={320} height={80} radius={8} fill={C.electric} stroke={C.chalk} lineWidth={() => pulse() * 6} /></Node>
        <Label text="heat removed from inside" x={-760} y={80} offset={[-1, 0]} size={36} color={C.heat} />
        <Rect x={() => -200 + (g() * 320) / 2} y={80} width={() => g() * 320} height={80} radius={8} fill={C.heat} opacity={() => (g() > 0.01 ? 1 : 0)} />
        <Node y={80} opacity={rng}>
          <Rect x={-200 + 448 + 96} width={192} height={80} radius={8} fill={C.heat} opacity={0.35} />
          <Line points={[[248, 70], [248, 110], [440, 110], [440, 70]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Num text="≈ 1.4 to 2" x={344} y={160} size={44} />
        </Node>
      </Node>,
      steps: [
        function* () { yield* pulse(1, 0.3); yield* pulse(0, 0.6); },
        function* () { yield* g(1.4, 1.2, easeInOutCubic); yield* rng(1, 0.5); },
      ],
    };
  },
  // ================================================================ 4. why it must run hot
  S23: () => {
    const c = createSignal(0.5);
    const flow = createSignal(0);
    return {
      base: <Node>
        <LoopDiagram zones zoneLabels={false} labels={false} x={-280} scale={0.7} lit={['condenser']} />
        <Label text="the condenser must be hotter than the room" x={0} y={-430} size={40} />
        <Thermometer x={500} y={-60} h={360} level={c} color={C.heat} scale={0.8} />
        <Thermometer x={720} y={-60} h={360} level={0.45} color={C.chalk} scale={0.8} />
        <Small text="condenser" x={500} y={230} color={C.heat} />
        <Small text="kitchen air" x={720} y={230} color={C.chalk} />
        <Node opacity={flow}><HeatArrows from={[-280 + 0.7 * 660, 0]} to={[-280 + 0.7 * 880, 0]} n={3} gap={65} /></Node>
      </Node>,
      steps: [
        function* () { yield* c(0.85, 1.2); },
        function* () { yield* flow(1, 0.6); },
        function* () { yield* all(c(0.47, 1.4), flow(0, 1.4)); },
        <Node x={180} y={280}><FridgeSide w={120} h={200} /><Shimmer x={75} y={-10} n={2} h={70} /></Node>,
      ],
      ambient: function* () { yield* waitFor(0); },
    } as Built;
  },
  S24: () => {
    const lint = createSignal(0);
    const air = createSignal(0);
    const run = createSignal(0);
    const rt = createRef<Node>();
    return {
      base: <Node>
        <Coil x={-320} y={-20} w={460} h={460} color={C.heat} fill={C.heat_soft} turns={8} />
        <Node opacity={lint}>{[[-480, -150], [-330, -60], [-420, 80], [-230, 130], [-370, -200], [-260, 10]].map(([x, y]) => <Rect x={x} y={y} width={120} height={22} radius={11} fill={C.muted} opacity={0.8} />)}</Node>
        <AirLine from={[-800, -40]} to={[-560, -40]} opacity={0.5} />
        <Node opacity={() => 1 - air() * 0.8}><AirLine from={[-80, -40]} to={[60, -40]} opacity={0.6} /><AirLine from={[-80, 60]} to={[60, 60]} opacity={0.6} /></Node>
        <Node ref={rt} x={480} y={-200} opacity={0}>
          <Small text="compressor run time" y={-50} color={C.chalk} />
          <Rect x={-170} width={320} height={34} radius={17} fill={C.chalk} offset={[-1, 0]} />
          <Rect x={150} width={() => 180 * run()} height={34} radius={17} fill={C.chalk} opacity={() => (run() > 0.01 ? 0.5 : 0)} offset={[-1, 0]} />
          <Small text="longer" x={250} y={50} color={C.chalk} opacity={run} />
        </Node>
      </Node>,
      steps: [
        function* () { yield* lint(1, 1.6); },
        function* () { yield* air(1, 1.2); },
        function* () { yield* rt().opacity(1, 0.4); yield* run(1, 1.2); },
        <Card x={480} y={160} w={780} h={220}>
          <Label text="Hotpoint: clean the coils" y={-50} size={36} />
          <Label text="at least once a year" y={0} size={36} />
          <Small text="some models don't need routine cleaning" y={60} color={C.chalk} />
        </Card>,
      ],
    };
  },
  S25: () => {
    const panel = (i: number) => (
      <Node x={i ? 460 : -460} y={20}>
        <Rect y={i ? 30 : -10} width={i ? 440 : 570} height={i ? 300 : 380} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} radius={10} />
        <Line points={[[-300, -10], [i ? -220 : -285, -10]]} stroke={C.chalk} lineWidth={10} />
        <Line points={[[300, -10], [i ? 220 : 285, -10]]} stroke={C.chalk} lineWidth={10} />
        {i ? <Line points={[[0, -220], [0, -120]]} stroke={C.chalk} lineWidth={10} /> : null}
        {[-1, 1].map(k => (
          <Node>
            <Small text={i ? '5 cm' : '1/8 in'} x={k * (i ? 140 : 190)} y={-70} color={C.chalk} />
            <Line points={[[k * (i ? 185 : 250), -55], [k * (i ? 258 : 292), -16]]} stroke={C.chalk} lineWidth={LW.hairline} />
          </Node>
        ))}
        {i ? <Small text="5 cm" x={70} y={-170} color={C.chalk} /> : null}
        <Label text={i ? 'Samsung: 5 cm ≈ 2 in, sides and back' : 'GE side-by-side: 1/8 in, sides only'} y={-340} size={32} />
      </Node>
    );
    return {
      base: <Node>{[-460, 460].map(x => (
        <Node x={x} y={20}>
          <Line points={[[-300, 220], [-300, -220], [300, -220], [300, 220]]} stroke={C.muted} lineWidth={LW.emphasis} />
          <Small text="FRONT (door)" y={210} color={C.chalk} />
          <Small text="wall" y={-250} color={C.muted} />
        </Node>
      ))}</Node>,
      steps: [
        <Label text="top view" y={-450} size={36} />,
        <Small text="air gaps vary by model" y={-400} color={C.chalk} />,
        panel(0),
        panel(1),
      ],
    };
  },
  S26: () => ({
    base: <Node>
      <FridgeCut x={0} y={-10} s={0.72} />
      <Label text="heat around the fridge makes shedding heat harder" y={-460} size={36} />
    </Node>,
    steps: [
      <Node><Rect x={-380} y={170} width={170} height={200} stroke={C.chalk} lineWidth={LW.structure} radius={10} /><Small text="oven" x={-380} y={305} color={C.chalk} /><HeatArrow from={[-300, 240]} to={[-190, 270]} /></Node>,
      <Node><Rect x={480} y={150} width={280} height={260} stroke={C.chalk} lineWidth={LW.structure} radius={10} /><Small text="dishwasher" x={480} y={320} color={C.chalk} /><HeatArrow from={[330, 250]} to={[190, 280]} /></Node>,
      <Node>
        <Node x={-720} y={-230}>{[0, 1, 2, 3].map(i => <Line points={[[-70, -30 + i * 18], [70, -30 + i * 18]]} stroke={C.chalk} lineWidth={LW.structure} />)}<Small text="heating vent" y={60} color={C.chalk} /></Node>
        <HeatArrow from={[-640, -200]} to={[-200, -80]} />
      </Node>,
      <Node>
        <Circle x={680} y={-330} size={110} fill={C.heat} opacity={0.9} />
        <Small text="sunlight" x={680} y={-240} color={C.chalk} />
        <HeatArrow from={[600, -280]} to={[200, -120]} />
        <Thermometer x={-720} y={40} h={220} level={0.85} color={C.heat} scale={0.6} />
        <Thermometer x={-545} y={40} h={220} level={() => 0.55 + Math.min(T() / 30, 0.2)} color={C.chalk} scale={0.6} />
        <Small text="condenser" x={-720} y={195} color={C.heat} />
        <Small text="room air" x={-545} y={195} color={C.chalk} />
      </Node>,
    ],
  }),
  // ================================================================ 5. the second heater
  S27: () => {
    const fr = createSignal(0);
    const cold = createSignal(0);
    const food = createSignal(0);
    return {
      base: <Node>
        <FridgeCut x={-510} y={0} s={0.66} frost={0} />
        <Node opacity={() => 1 - fr()}><CoilAssembly x={360} y={-40} w={700} h={300} frost={0} heater="outline" /></Node>
        <Node opacity={fr}><CoilAssembly x={360} y={-40} w={700} h={300} frost={0.35} heater="outline" /></Node>
        <Rect x={360} y={-40} width={760} height={340} radius={24} stroke={C.cold} lineWidth={6} opacity={() => cold() * (0.5 + 0.3 * Math.sin(T() * 3))} />
        <Label text="below freezing" x={360} y={-250} color={C.cold} size={36} opacity={cold} />
        <Node opacity={food}>{[0, 1, 2, 3].map(i => <Circle size={14} fill={C.chalk} x={() => -600 + (((T() / 6 + i / 4) % 1) * 800)} y={() => 40 + i * 30 + Math.sin(T() * 2 + i) * 15} />)}</Node>
        <Label text="FROST" x={360} y={-345} color={C.cold} opacity={fr} />
      </Node>,
      steps: [
        <OpenDoor x={-510} y={0} s={0.66} />,
        <Node>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <Circle size={14} fill={C.chalk} opacity={0.85}
            x={() => -350 + (((T() / 5 + i / 8) % 1) * 650)} y={() => -250 + (i % 4) * 90 + Math.sin(T() * 2 + i) * 20} />)}
          <Small text="moisture from food and from humid air when the door opens" x={360} y={300} color={C.chalk} />
        </Node>,
        function* () { yield* fr(1, 1.6); },
      ],
      ambient: function* () { yield* waitFor(2.0); yield* cold(1, 0.8); yield* waitFor(2.4); yield* food(1, 0.8); },
    };
  },
  S28: () => {
    const th = createSignal(0);
    const thin = createSignal(0);
    return {
      base: <Node>
        <Node opacity={() => 1 - th()}><CoilAssembly x={0} y={-20} w={760} h={340} frost={0.35} heater="outline" /></Node>
        <Node opacity={th}><CoilAssembly x={0} y={-20} w={760} h={340} frost={0.9} heater="outline" /></Node>
        <Node opacity={() => 1 - thin()}>{[-110, 0, 110].map(y => <HeatArrow from={[-880, y - 20]} to={[-250, y - 20]} />)}</Node>
        <Node opacity={thin}>
          <HeatArrow from={[-880, -80]} to={[-250, -80]} width={LW.emphasis} />
          <HeatArrow from={[-880, 40]} to={[-250, 40]} width={LW.structure + 1} />
          <Small text="less heat gets in" x={-640} y={170} color={C.heat} />
          <Label text="frost insulates the coil and clogs the gaps" y={-330} color={C.cold} size={40} />
        </Node>
      </Node>,
      steps: [
        function* () { yield* th(1, 1.2); },
        function* () { yield* thin(1, 0.8); },
        <Node><AirLine from={[860, 0]} to={[500, 0]} opacity={0.25} /><Small text="less air gets through" x={680} y={80} color={C.chalk} /></Node>,
      ],
      ambient: function* () { yield* waitFor(0); },
    } as Built;
  },
  S29: () => {
    const lab = createSignal(0), glass = createSignal(0);
    return {
      // 2D layer only: composited over the Blender render (renders/S29.mp4)
      drift: false,
      overlay: true,
      base: <Node><Label text="DEFROST HEATER" x={-560} y={-440} color={C.heat} opacity={() => lab() * (1 - Math.min(1, glass() * 3))} /><Label text="glass-tube heater" x={-40} y={330} size={40} opacity={glass} /></Node>,
      steps: [
        function* () { yield* lab(1, 0.4); },
        null,
        function* () { yield* waitFor(0.0); yield* all(glass(1, 0.5)); },
      ],
    };
  },
  S30: () => {
    const sweep = createSignal(0);
    const on = createSignal(1);
    const clk = createSignal(0);
    const sub = createSignal(0), v1 = createSignal(0), v2 = createSignal(0);
    return {
      base: <Node>
        <Label text="POWER WHILE ON" y={-420} />
        <Label text="two service-manual examples" y={-360} size={36} color={C.chalk} opacity={sub} />
        <Num text="≈ 450 W" x={-640} y={300 - 450 * 0.6 - 40} size={38} opacity={() => v1() * (0.35 + on() * 0.65)} />
        <Num text="≈ 470 W" x={-380} y={300 - 470 * 0.6 - 40} size={38} opacity={() => v2() * (0.35 + on() * 0.65)} />
        <Node x={500} y={40} opacity={clk}>
          <Circle size={240} stroke={C.chalk} lineWidth={LW.structure} />
          <Circle size={240} stroke={C.heat} lineWidth={LW.emphasis} startAngle={-90} endAngle={() => -90 + sweep() * 60} opacity={on} />
          <Line points={() => [[0, 0], [Math.cos((sweep() * 60 - 90) * Math.PI / 180) * 90, Math.sin((sweep() * 60 - 90) * Math.PI / 180) * 90]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
          <Label text="runs for minutes, then off" y={190} size={36} />
        </Node>
      </Node>,
      steps: [
        <Node opacity={() => 0.35 + on() * 0.65}>
          <Bar x={-640} h={450 * 0.6} w={130} color={C.electric} label="heater, ex. 1" />
          <Bar x={-380} h={470 * 0.6} w={130} color={C.electric} label="heater, ex. 2" />
        </Node>,
        function* () { yield* sub(1, 0.5); },
        function* () { yield* v1(1, 0.4); },
        function* () { yield* v2(1, 0.4); },
        <Node>
          <Bar x={-90} h={160 * 0.6} w={130} color={C.electric} value="120–160 W" label="compressor" />
          <Line points={[[-640, -60], [-640, -90], [-90, -90], [-90, 120]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Num text="≈ 3×" x={-365} y={-130} size={52} />
        </Node>,
        function* () { yield* clk(1, 0.4); yield* sweep(1, 0.9, linear); yield* on(0, 0.3); },
      ],
    };
  },
  S31: () => {
    const cur = createSignal(0);
    return {
      base: <Node>
        <Label text="compressor running time (hours)" x={-760} y={-330} size={36} offset={[-1, 0]} />
        {[0, 25, 50, 75, 100].map(h => <Num text={`${h}`} x={-760 + h * 15} y={-260} size={34} color={C.muted} />)}
        <Line points={[[-760, -130], [760, -130]]} stroke={C.muted} lineWidth={LW.structure} />
        <Line points={[[-760, 170], [760, 170]]} stroke={C.muted} lineWidth={LW.structure} />
        <Line points={() => [[-760 + cur() * 15, -200], [-760 + cur() * 15, 240]]} stroke={C.chalk} lineWidth={LW.hairline} opacity={0.7} />
      </Node>,
      steps: [
        function* () { yield* cur(104, 10, linear); },
        <Node>
          {Array.from({length: 12}, (_, i) => <Rect x={-760 + (i + 1) * 8 * 15} y={-130} width={14} height={60} fill={C.heat} radius={4} />)}
          <Label text="older timer: about every 8 h of running" x={-760} y={-50} size={34} offset={[-1, 0]} />
        </Node>,
        <Node>
          <Line points={[[-760 + 1500, 130], [-760 + 1500, 210]]} stroke={C.chalk} lineWidth={LW.emphasis} />
          <Line points={[[-760 + 1470, 130], [-760 + 1500, 130]]} stroke={C.chalk} lineWidth={LW.emphasis} />
          <Line points={[[-760 + 1470, 210], [-760 + 1500, 210]]} stroke={C.chalk} lineWidth={LW.emphasis} />
          <Label text="adaptive control: up to 100+ h, with the doors shut" x={-760} y={250} size={34} offset={[-1, 0]} />
        </Node>,
      ],
    };
  },
  S32: () => ({
    base: <Node>
      <FridgeSide x={-120} y={0} w={420} h={780} />
      <CoilAssembly x={20} y={-230} w={120} h={110} frost={0} heater="none" s={0.9} />
      <Line points={[[80, -150], [170, -100], [170, 300], [120, 320]]} stroke={C.chalk} lineWidth={LW.structure} radius={20} />
      <Rect x={60} y={345} width={190} height={34} stroke={C.chalk} lineWidth={LW.structure} radius={[0, 0, 8, 8]} />
      <Coil x={-150} y={330} w={140} h={60} turns={2} color={C.heat} fill={C.heat_soft} />
      <Small text="drain tube" x={300} y={60} color={C.chalk} offset={[-1, 0]} />
      <Small text="drain pan" x={300} y={360} color={C.chalk} offset={[-1, 0]} />
      <Small text="condenser" x={-352} y={330} color={C.heat} offset={[1, 0]} /><Line points={[[-344, 330], [-228, 330]]} stroke={C.heat} lineWidth={LW.hairline} />
    </Node>,
    steps: [
      <Node>
        {[0, 1, 2].map(i => <Circle size={20} fill={C.chalk} x={170} y={() => -100 + (((T() / 2.4 + i / 3) % 1) * 400)} />)}
        <Rect x={60} y={355} width={176} height={14} fill={C.chalk} opacity={0.5} />
      </Node>,
      <HeatArrow from={[-90, 312]} to={[10, 352]} />,
      <Node>{[0, 1, 2, 3].map(i => { const u = () => ((T() / 3 + i / 4) % 1); return <Circle size={14} fill={C.chalk} x={() => 120 + u() * 380} y={() => 330 - u() * 140 + Math.sin(T() * 2 + i) * 8} opacity={() => 0.8 - u() * 0.6} />; })}<Small text="into the kitchen" x={520} y={200} color={C.chalk} /></Node>,
    ],
  }),
  S33: () => {
    const beads = createSignal(1);
    const frame = (x: number) => (
      <Node x={x} y={20}>
        <Rect width={620} height={560} radius={20} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
        <Rect x={-170} width={160} height={560} fill={C.cold_soft} opacity={0.5} />
        <Small text="inside" x={-190} y={-310} color={C.cold} />
        <Rect x={40} width={70} height={560} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure} />
        <Small text="cabinet face" x={30} y={-310} color={C.chalk} />
        <Rect x={150} width={40} height={560} fill={C.muted} opacity={0.6} />
        <Small text="door seal" x={160} y={-310} color={C.chalk} offset={[-1, 0]} />
        <Node opacity={beads}>{[-180, -90, 60, 150].map(yy => <Circle x={40} y={yy} size={18} fill={C.chalk} />)}</Node>
      </Node>
    );
    return {
      base: <Label text="where the door seals, up close" y={-460} />,
      steps: [
        <Node>{frame(-460)}{frame(460)}</Node>,
        <Node x={-460} y={20}>
          <Line points={[[-40, -230], [-40, 230]]} stroke={C.refrigerant} lineWidth={18} lineCap="round" />
          <HeatArrows from={[-25, 0]} to={[30, 0]} n={3} gap={140} />
          <Label text="warm refrigerant tube" y={360} size={34} />
        </Node>,
        <Node x={460} y={20}>
          <Line points={[[-40, -230], [-40, 230]]} stroke={C.heat} lineWidth={10} lineCap="round" />
          <Line points={[[-40, -230], [-40, -270], [-120, -270]]} stroke={C.electric} lineWidth={LW.structure} />
          <Bolt x={-150} y={-270} s={0.45} />
          <HeatArrows from={[-25, 0]} to={[30, 0]} n={3} gap={140} />
          <Label text="small electric heater" y={360} size={34} />
        </Node>,
        function* () { yield* beads(0, 1.2); },
        <Node>
          <Small text="stays dry: no condensation" x={-420} y={322} color={C.chalk} />
          <Small text="stays dry: no condensation" x={500} y={322} color={C.chalk} />
          <Rect x={640} y={-378} width={110} height={50} radius={25} stroke={C.chalk} lineWidth={LW.structure} />
          <Circle x={665} y={-378} size={36} fill={C.chalk} />
          <Small text="energy saver switch" x={560} y={-378} color={C.chalk} offset={[1, 0]} />
        </Node>,
      ],
    };
  },
  S34: () => {
    const marker = (n: number, y: number, t: string, sig: any) => (
      <Node opacity={sig}><Circle x={-500} y={y} size={64} fill={C.heat} /><Num text={`${n}`} x={-500} y={y} size={36} color={C.bg} /><Small text={t} x={-560} y={y + 60} color={C.chalk} /></Node>
    );
    const edges = createSignal(0), heater = createSignal(0), cond = createSignal(0);
    return {
      base: <Node>
        <FridgeCut x={-200} y={-20} s={0.86} heater="outline" condenserHot />
        <Rect x={-200} y={-20} width={480 * 0.86} height={860 * 0.86} radius={24} stroke={C.heat} lineWidth={LW.flow} shadowColor={C.heat} shadowBlur={30} opacity={edges} />
        <Line x={-200} y={-20 + (-430 + 115) * 0.86} scale={0.86} points={[[-140, 95], [140, 95], [140, 125], [-140, 125]]} stroke={C.heat} lineWidth={12} radius={14} shadowColor={C.heat} shadowBlur={30} opacity={heater} />
        <Label text="where the heat is" x={540} y={0} />
        {marker(1, -60, 'door edges', edges)}
        {marker(2, -300, 'defrost heater', heater)}
        {marker(3, 260, 'condenser', cond)}
      </Node>,
      steps: [
        function* () { yield* edges(1, 0.6); },
        function* () { yield* heater(1, 0.6); },
        function* () { yield* cond(1, 0.6); },
      ],
    };
  },
  // ================================================================ 6. the bill
  S35: () => {
    const bar = createSignal(0);
    return {
      base: <Node>
        <Node x={-700} y={-60}>
          <Circle size={200} stroke={C.electric} lineWidth={LW.emphasis} />
          <Line points={() => [[0, 0], [Math.cos(T() * 2) * 70, Math.sin(T() * 2) * 70]]} stroke={C.electric} lineWidth={LW.emphasis} lineCap="round" />
          <Small text="electricity meter" y={140} color={C.chalk} />
        </Node>
        <Rect x={-200} y={() => 300 - (363 * 0.7 * bar()) / 2} width={170} height={() => 363 * 0.7 * bar()} fill={C.electric} radius={[8, 8, 0, 0]} opacity={() => (bar() > 0.01 ? 1 : 0)} />
        <Num text="363 kWh/yr" x={-310} y={300 - 363 * 0.35} size={44} offset={[1, 0]} opacity={bar} />
      </Node>,
      steps: [
        <Label text="a few hundred kWh/yr" x={420} y={-430} size={36} />,
        <Node><Label text="ENERGY STAR example" x={-200} y={-430} /><Label text="18 cu ft top-freezer" x={-200} y={-370} size={36} color={C.chalk} /></Node>,
        function* () { yield* bar(1, 1.0); },
        <Node>
          <Line points={[[-420, 300 - 404 * 0.7], [420, 300 - 404 * 0.7]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[16, 12]} />
          <Small text="federal limit 404 kWh/yr" x={250} y={300 - 404 * 0.7 - 30} color={C.chalk} />
        </Node>,
        <Num text="≈ 10% under" x={200} y={120} size={44} />,
      ],
    };
  },
  S36: () => ({
    base: <Node>
      <Line points={[[-520, 300], [520, 300]]} stroke={C.chalk} lineWidth={LW.structure} />
      <Small text="energy use per year" x={-520} y={-440} color={C.chalk} offset={[-1, 0]} />
    </Node>,
    steps: [
      <Bar x={-260} h={600} w={200} color={C.electric} value="> 1,800 kWh/yr" label="1974, average new fridge" />,
      <Node><Bar x={260} h={150} w={200} color={C.electric} value="a few hundred" label="today" /><Num text="≈ ¼ the energy" x={260} y={-60} size={52} /></Node>,
      <Node>
        <Rect x={60} y={-360} width={60} height={110} radius={8} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={170} y={-375} width={84} height={150} radius={10} stroke={C.chalk} lineWidth={LW.structure} />
        <Small text="holds more" x={240} y={-375} color={C.chalk} offset={[-1, 0]} />
      </Node>,
    ],
  }),
  S37: () => {
    const puff = createSignal(0);
    const room = createSignal(0);
    return {
      base: <Node>
        <Rect width={1600} height={800} radius={20} stroke={C.chalk} lineWidth={LW.structure} fill={C.heat_soft} opacity={() => 0.08 + room() * 0.22} />
        <Small text="one closed kitchen" x={-760} y={-300} color={C.chalk} offset={[-1, 0]} />
        <FridgeCut x={-200} y={0} s={0.72} />
        <Node opacity={() => 1 - room()}><Thermometer x={620} y={-40} h={420} level={0.45} color={C.chalk} /></Node>
        <Node opacity={room}><Thermometer x={620} y={-40} h={420} level={() => 0.45 + room() * 0.3} color={C.heat} /></Node>
        <Rect x={-610} y={270} width={170} height={110} fill={C.cold_soft} opacity={puff} radius={40} />
        <Label text="room gets warmer" x={560} y={-340} color={C.heat} size={36} opacity={room} />
      </Node>,
      steps: [
        <OpenDoor x={-200} y={0} s={0.72} />,
        <HeatArrow from={[160, -120]} to={[-260, -120]} />,
        <Node><HeatArrows from={[-60, 250]} to={[280, 250]} n={2} gap={60} /><Line points={[[-310, 300], [-310, 330]]} stroke={C.electric} lineWidth={LW.structure} /><Bolt x={-310} y={360} s={0.45} /></Node>,
        function* () { yield* room(1, 2.0); },
        function* () { yield* puff(0.7, 0.3); yield* waitFor(0.7); yield* puff(0, 0.7); },
      ],
    };
  },
  // ================================================================ 7. close
  S38: () => {
    const glow = createSignal(0);
    return {
    base: <Node><LoopDiagram zones heatIn heatOut labels={false} scale={0.8} /><Rect scale={0.8} width={1100} height={560} radius={70} stroke={C.refrigerant} lineWidth={16} opacity={glow} shadowColor={C.refrigerant} shadowBlur={30} /><LoopFlow n={12} period={7} scale={0.8} /></Node>,
    steps: [
      <Title text="It moves heat." y={-430} size={72} />,
      function* () { yield* glow(1, 0.4); yield* glow(0.3, 0.8); yield* glow(1, 0.4); yield* glow(0, 0.8); },
      <Node>
        <HeatArrow from={[182, 262]} to={[640, 262]} />
        <Small text="plus a little extra from the electricity" x={430} y={378} color={C.heat} />
      </Node>,
    ],
  };
  },
  S39: () => ({
    base: <Node>
      <LoopDiagram zones zoneLabels={false} labels={false} scale={0.55} x={-420} y={0} lit={['condenser']} />
      <Node x={-420}><LoopFlow n={10} period={7} scale={0.55} /></Node>
    </Node>,
    steps: [
      <Node>
        <FridgeSide x={420} y={20} />
        <Line points={[[-420 + 0.55 * 550 + 50, 0], [230, 0], [230, -230], [290, -240]]} stroke={C.refrigerant} lineWidth={LW.emphasis} radius={30} />
        <Line points={[[290, -240], [290, 260]]} stroke={C.refrigerant} lineWidth={LW.emphasis} />
      </Node>,
      <Node>
        <Line points={[[290, -240], [290, 260]]} stroke={C.heat} lineWidth={LW.emphasis} shadowColor={C.heat} shadowBlur={20} />
        <Shimmer x={230} y={-60} n={3} h={160} />
        <Label text="Much of that warmth came from inside." x={300} y={-430} color={C.heat} />
      </Node>,
    ],
  }),
  S40: () => ({
    base: <Node>
      <FridgeCut x={0} y={-90} s={0.72} warmSides />
      <Shimmer x={-210} y={-180} n={2} h={120} opacity={0.6} />
      <Shimmer x={210} y={-180} n={2} h={120} opacity={0.6} />
    </Node>,
    steps: [
      <Label text="THE HIDDEN MECHANISM" y={350} size={44} spacing={10} />,
      <Small text="Next time" y={400} color={C.chalk} />,
    ],
  }),
};
