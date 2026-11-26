// P5 scenes, part 2: stroke two, compression (S17-S33) and the spark chapter (S34-S44).
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import type {Built} from './motion';
import type {Clk} from './shared';
import {all, C, Card, clamp, CUT, D, delay, dur, cue, Dots, Engine2D, EP, ease, easeOutCubic, FadeTag, Lab, Lead, linear, LW, M, mixc, Mono, Pump, Ring, rgba, S, sig, Sm, Strike, Tag, to, T, Trace, trackPx,
  TRACE, TY, Cross, V, waitFor, zp, val, HEAT_SOFT} from './shared';

const CX = CUT.x, CY = CUT.y;
const HC = EP.head; // head underside, px relative to the cutaway origin

// a cylinder section: bore box with violet dots; h animates the volume (the dot count stays constant)
const Chamber = ({x = 0, y = 0, w = 300, h = 300, n = 40, seed = 3, hot = 0, label = '', opacity = 1, kids = null as any}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w} height={h} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
    <Rect width={w} height={h} clip>
      <Dots y={0} w={w} h={h} n={n} seed={seed} edge={hot !== 0} />
      {kids}
    </Rect>
    {label ? <Tag text={label} y={-val(h) / 2 - 40} color={M} /> : null}
  </Node>
);
const Thermo = ({x = 0, y = 0, level = 0, limit = null as any, h = 300}: any) => (
  <Node x={x} y={y}>
    <Rect width={44} height={h} radius={22} stroke={C.chalk} lineWidth={LW.structure} />
    <Rect y={() => h / 2 - 8 - ((h - 16) * clamp(val(level))) / 2} width={26} height={() => Math.max(1, (h - 16) * clamp(val(level)))} fill={C.heat_soft} stroke={C.heat} lineWidth={2} />
    <Circle y={h / 2 + 18} size={64} fill={C.heat_soft} stroke={C.chalk} lineWidth={LW.structure} />
    {limit !== null ? <Line points={[[-50, h / 2 - 8 - (h - 16) * limit], [50, h / 2 - 8 - (h - 16) * limit]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[10, 8]} /> : null}
  </Node>
);
const ratioText = (s: any) => () => `${Math.round(val(s))} : 1`;

export const A2: Record<string, (k: Clk) => Built> = {
  // ================================================================ stroke two: compression
  S17: () => {
    const t0 = sig(0), cl = sig(0), sm = sig(0);
    return {
      overlay: true,
      base: <Node>
        <Tag text="STROKE 2 · COMPRESSION" x={-864} y={-430} anchor={[-1, 0]} size={40} opacity={t0} />
        <Node opacity={cl}>
          <Tag text="CLOSED" x={CX - 330} y={CY - 258} color={M} size={34} />
          <Tag text="CLOSED" x={CX + 330} y={CY - 258} color={M} size={34} />
        </Node>
        <Node opacity={sm}>
          <Tag text="small space at the top" x={CX + 400} y={CY - 175} anchor={[-1, 0]} size={34} />
          <Lead from={[CX + 395, CY - 175]} to={[CX + 60, CY - 172]} color={C.chalk} />
        </Node>
      </Node>,
      steps: [to(t0, 1, 0.5), to(cl, 1, 0.5), to(sm, 1, 0.5)],
    };
  },
  S18: () => {
    const a = sig(0), b = sig(0), r = sig(0);
    return {
      base: <Node>
        <Chamber x={-330} y={20} w={260} h={320} n={42} seed={3} opacity={a} />
        <Chamber x={110} y={20} w={260} h={64} n={42} seed={3} opacity={b} />
        <Tag text="volume at the bottom" x={-330} y={-190} opacity={a} />
        <Tag text="volume left at the top" x={110} y={-190} opacity={b} />
        <Node opacity={r}>
          <Line points={[[-180, 20], [-20, 20]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[12, 10]} />
          <Lab text="compression ratio" x={110} y={110} size={TY.small_label} />
          <Mono text="bottom ÷ top" x={110} y={165} size={34} color={M} />
        </Node>
      </Node>,
      steps: [to(a, 1, 0.6), to(b, 1, 0.6), to(r, 1, 0.6)],
    };
  },
  S19: () => {
    const c = sig(1), br = sig(0);
    return {
      base: <Node>
        <Mono text={ratioText(c)} x={-60} y={0} size={190} />
        <Node opacity={br}>
          <Line points={[[-420, 130], [-420, 160], [300, 160], [300, 130]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />
          <Tag text="typical gasoline car" x={-60} y={220} />
        </Node>
      </Node>,
      steps: [function* () { yield* c(10, 1.0, ease); br(1); }, to(c, 12, 0.9)],
    };
  },
  S20: () => {
    const dial = sig(0), bar = sig(0);
    return {
      base: <Node>
        <Node x={-330} y={20}>
          <Circle size={260} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Line points={() => { const a = ((-130 + 260 * dial()) * Math.PI) / 180 - Math.PI / 2; return [[0, 0], [Math.cos(a) * 110, Math.sin(a) * 110]]; }} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Tag text="compression ratio" y={200} color={M} />
        </Node>
        <Node x={180} y={20}>
          <Rect y={0} width={90} height={380} stroke={C.chalk} lineWidth={LW.structure} />
          <Rect y={() => 190 - 4 - (372 * (0.25 + 0.55 * bar())) / 2} width={74} height={() => 372 * (0.25 + 0.55 * bar())} fill={C.chalk} />
          <Tag text="efficiency" x={170} y={0} anchor={[-1, 0]} />
        </Node>
      </Node>,
      steps: [to(dial, 1, 1.4), to(bar, 1, 1.4)],
    };
  },
  S21: () => {
    const c = sig(10), wall = sig(0), tg = sig(0);
    return {
      base: <Node>
        <Mono text={ratioText(c)} x={-150} y={0} size={170} />
        <Node opacity={wall} x={330}>
          <Line points={[[0, -200], [0, 200]]} stroke={C.chalk} lineWidth={14} lineCap="round" />
          <Txt text="?" x={80} y={0} fontFamily="Archivo" fontWeight={600} fontSize={160} fill={C.chalk} />
        </Node>
        <Tag text="WHY STOP?" x={-150} y={170} opacity={tg} />
      </Node>,
      steps: [to(c, 17, 1.4), function* () { yield* all(wall(1, 0.5), tg(1, 0.5)); }],
    };
  },
  S22: () => {
    const lvl = sig(0.1), hh = sig(320);
    return {
      base: <Node>
        <Chamber x={-250} y={30} w={280} h={hh} n={42} seed={3} hot={1} />
        <Thermo x={150} y={40} level={lvl} h={340} />
        <Tag text="squeezing = hotter" x={380} y={-170} anchor={[0, 0]} color={C.chalk} />
      </Node>,
      steps: [function* () { yield* all(hh(70, 2.8, ease), lvl(0.72, 2.8, ease)); }],
    };
  },
  S23: () => {
    const lvl = sig(0.72), lim = sig(0), pocket = sig(0), kn = sig(0);
    return {
      base: <Node>
        <Chamber x={-250} y={30} w={280} h={120} n={42} seed={3} hot={1} kids={<Node>
          <Circle x={95} y={30} size={() => 90 * pocket()} fill={C.heat} opacity={() => pocket() * (0.6 + 0.4 * Math.sin(T() * 18))} />
          <Rect x={0} y={-60} width={8} height={20} fill={C.electric} opacity={0} />
        </Node>} />
        <Thermo x={150} y={40} level={lvl} limit={0.82} h={340} />
        <Node opacity={lim}><Tag text="limit" x={235} y={() => 40 - 170 + 340 * 0.18} anchor={[-1, 0]} color={M} /></Node>
        <Lab text="KNOCK" x={-250} y={-190} size={72} opacity={kn} />
      </Node>,
      steps: [function* () { yield* all(lvl(0.95, 1.2), lim(1, 0.6)); }, to(pocket, 1, 0.5), to(kn, 1, 0.5)],
    };
  },
  S24: () => {
    const rip = sig(0), snd = sig(0), crack = sig(0);
    return {
      base: <Node>
        <Chamber x={-250} y={30} w={280} h={140} n={20} seed={6} hot={1} />
        <Node x={-250} y={30} opacity={rip}>
          {[0, 1, 2].map(i => (
            <Circle size={() => 60 + 120 * ((((T() * 0.9 + i / 3) % 1)))} stroke={C.muted} lineWidth={LW.structure} lineDash={[10, 10]}
              opacity={() => 1 - (((T() * 0.9 + i / 3) % 1))} />
          ))}
        </Node>
        <Node x={170} y={-30} opacity={snd}>
          {[0, 1, 2].map(i => <Circle size={90 + i * 60} stroke={C.chalk} lineWidth={LW.structure} startAngle={-40} endAngle={40} opacity={() => 0.4 + 0.6 * Math.sin(T() * 7 - i)} />)}
          <Tag text="knocking sound" y={140} />
        </Node>
        <Node x={-250} y={235} opacity={crack}>
          <Rect width={280} height={70} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Line points={[[-60, -35], [-30, -5], [-55, 15], [-10, 35]]} stroke={C.muted} lineWidth={LW.emphasis} lineJoin="round" lineCap="round" />
          <Tag text="can damage the engine" y={85} color={M} />
        </Node>
        <Tag text="pressure waves" x={-250} y={-100} color={M} opacity={rip} />
      </Node>,
      steps: [to(rip, 1, 0.5), to(snd, 1, 0.5), to(crack, 1, 0.5)],
    };
  },
  S25: () => {
    const card = sig(0), c = sig(12);
    return {
      base: <Node>
        <Mono text={ratioText(c)} x={-60} y={-40} size={190} />
        <Card x={-60} y={190} w={720} h={120} lines={['Mazda Skyactiv-G']} sizes={[52]} opacity={card} />
      </Node>,
      steps: [to(card, 1, 0.6), to(c, 14, 0.8)],
    };
  },
  S26: () => {
    const pump = sig(0), zm = sig(0);
    return {
      base: <Node>
        <Node opacity={pump}><Pump x={-100} y={20} plate="" s={1.15} /></Node>
        <Node x={() => -100 + 100 * zm()} y={() => 20 - 70 * zm() + 50 * (1 - zm())} scale={() => 1 + 1.6 * zm()}>
          <Rect width={120} height={80} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} opacity={pump} />
          <Mono text="87" size={56} opacity={pump} />
        </Node>
        <Tag text="the number on the pump" x={-100} y={330} color={M} opacity={zm} />
      </Node>,
      steps: [to(pump, 1, 0.7), to(zm, 1, 1.0)],
    };
  },
  S27: () => {
    const strike = sig(0), tg = sig(0);
    return {
      base: <Node>
        <Lab text="octane" x={-330} y={20} size={96} />
        <Line x={20} y={20} closed fill={C.muted} points={[[8, -70], [-30, 8], [-2, 8], [-14, 70], [30, -10], [2, -10], [16, -70]]} />
        <Cross x={20} y={20} w={150} h={170} end={strike} />
        <Lab text="NOT ENERGY" x={-100} y={190} size={72} opacity={tg} />
      </Node>,
      steps: [function* () { yield* all(strike(1, 0.6), tg(1, 0.6)); }],
    };
  },
  S28: () => {
    const fill = sig(0), plate = sig(0);
    return {
      base: <Node>
        <Rect x={-60} y={20} width={760} height={74} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={() => -60 - 380 + 380 * 0.42 * fill()} y={20} width={() => 760 * 0.42 * fill()} height={64} fill={rgba(C.chalk, 0.4)} />
        <Tag text="knock resistance" x={-60} y={-70} />
        <Node x={() => -60 - 380 + 760 * 0.42} y={20} opacity={plate}>
          <Rect y={110} width={110} height={70} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Mono y={110} text="87" size={50} />
          <Line points={[[0, 75], [0, 45]]} stroke={C.chalk} lineWidth={LW.structure} />
        </Node>
      </Node>,
      steps: [to(fill, 1, 1.4), to(plate, 1, 0.5)],
    };
  },
  S29: () => {
    const eng = sig(0), dial = sig(0), kn = sig(0), sc = sig(0), a = sig(0), b = sig(0);
    return {
      base: <Node>
        <Node x={-400} y={0} opacity={eng}>
          <Rect width={330} height={230} radius={14} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Tag text="test engine" y={-170} color={M} />
          <Circle y={10} size={120} stroke={C.chalk} lineWidth={LW.structure} />
          <Line points={() => { const t = ((-120 + 240 * dial()) * Math.PI) / 180 - Math.PI / 2; return [[0, 10], [Math.cos(t) * 50, 10 + Math.sin(t) * 50]]; }} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Tag text="KNOCK" y={170} color={C.chalk} opacity={kn} />
        </Node>
        <Node x={190} y={30} opacity={sc}>
          <Line points={[[-300, 140], [300, 140]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Line points={[[-300, 100], [-300, 180]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Line points={[[300, 100], [300, 180]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Tag text="heptane = 0" x={-300} y={-30} opacity={b} />
          <Tag text="iso-octane = 100" x={300} y={-30} opacity={a} />
          <Circle x={-300} y={140} size={34} fill={C.chalk} opacity={b} />
          <Circle x={300} y={140} size={34} fill={C.chalk} opacity={a} />
          <Circle x={() => -300 + 600 * 0.87 * a()} y={140} size={34} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} opacity={a} />
          <Tag text="your fuel" x={() => -300 + 600 * 0.87 * a()} y={220} color={M} opacity={a} />
        </Node>
      </Node>,
      steps: [to(eng, 1, 0.6), to(dial, 1, 1.2), to(kn, 1, 0.3), to(sc, 1, 0.6), to(a, 1, 0.6), to(b, 1, 0.5)],
    };
  },
  S30: () => {
    const a = sig(0), b = sig(0);
    const btn = (x: number, t1: string, t2: string, o: any) => (
      <Node x={x} y={20} opacity={o}>
        <Rect width={420} height={240} radius={20} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
        <Txt text={t1} y={-48} fontFamily="Archivo" fontWeight={600} fontSize={52} fill={C.chalk} />
        <Mono text={t2} y={46} size={80} />
      </Node>
    );
    return {
      base: <Node>{btn(-280, 'regular', '87', a)}{btn(220, 'premium', '91 to 94', b)}</Node>,
      steps: [to(a, 1, 0.6), to(b, 1, 0.6)],
    };
  },
  S31: () => {
    const bal = sig(0), tg = sig(0), tilt = sig(0);
    return {
      base: <Node x={-60} y={20}>
        <Line points={[[0, 120], [0, 40]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[-100, 130], [100, 130]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
        <Node y={40} rotation={() => -6 * tilt()} opacity={bal}>
          <Line points={[[-380, 0], [380, 0]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Node x={-380} y={() => 20 + 60 * (0.0)}>
            <Rect y={80} width={260} height={110} radius={10} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
            <Txt text="compression ratio" y={80} fontFamily="Archivo" fontWeight={500} fontSize={30} fill={C.chalk} />
          </Node>
          <Node x={380}>
            <Rect y={80} width={260} height={110} radius={10} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
            <Txt text="knock resistance" y={80} fontFamily="Archivo" fontWeight={500} fontSize={30} fill={C.chalk} />
          </Node>
        </Node>
        <Lab text="TRADE-OFF" y={-210} size={72} opacity={tg} />
      </Node>,
      steps: [function* () { yield* all(bal(1, 0.6), tilt(1, 1.6)); }, to(tg, 1, 0.5)],
    };
  },
  S32: () => {
    const tr = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={300} hl={{piston: 0.5, rod: 0.5, crank: 0.5, fly: 1, valves: 0.3, plug: 0.3, block: 0.4}} />
        <Circle x={CX} y={CY + 207} size={410} stroke={C.muted} lineWidth={LW.emphasis} lineDash={[18, 14]} lineDashOffset={() => -T() * 60} opacity={tr} />
        <Lab text="paid for by the flywheel" x={110} y={150} size={44} offset={[-1, 0]} opacity={tr} />
      </Node>,
      steps: [to(tr, 1, 0.8)],
    };
  },
  S33: (k) => {
    const lab = sig(0), half = sig(0), z = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={360} hl={{piston: 0.35, rod: 0.35, crank: 0.35, fly: 0.35, valves: 0.35, plug: 0.35, block: 0.35}} />
        <Node opacity={half}>
          <Ring x={330} y={190} r={110} p={0.5} />
          <Circle x={330} y={190} size={220} stroke={C.grid} lineWidth={LW.structure} />
          <Tag text="half the cycle" x={330} y={340} />
        </Node>
        <Mono text="work made so far: 0" x={330} y={0} size={40} opacity={z} />
      </Node>,
      steps: [function* () { yield* k.grow(1, 0.9, ease); yield* waitFor(2.4); yield* k.grow(0, 0.8, ease); }, to(half, 1, 0.6), to(z, 1, 0.5)],
    };
  },

  // ================================================================ the spark chapter (a labelled zoom on the last 30 degrees of compression; the clock is held)
  S34: () => {
    const z = sig(0), tr = sig(0);
    return {
      base: <Node>
        <Tag text="ZOOM · LAST 30° OF COMPRESSION" x={-864} y={-430} anchor={[-1, 0]} size={36} opacity={z} />
        <Engine2D x={CX} y={CY} th={330} hl={{piston: 0.5, rod: 0.5, crank: 0.5, fly: 0.5, valves: 0.3, plug: 0.5, block: 0.5}} charge={1} />
        <Trace x={480} y={90} w={640} h={360} spark={-20} end={tr} />
      </Node>,
      steps: [to(z, 1, 0.5), to(tr, 1, 3.0)],
    };
  },
  S35: () => {
    const arc = sig(0), mk = sig(0), lab = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={340} hl={{piston: 0.5, rod: 0.5, crank: 0.5, fly: 0.5, valves: 0.3, plug: 0.8, block: 0.5}} charge={1} />
        <Line x={CX} y={CY + HC + 10} points={[[0, 0], [-16, 14], [10, 24], [-12, 38], [6, 52]]} stroke={C.electric} lineWidth={LW.emphasis} lineCap="round" lineJoin="round"
          shadowColor={C.electric} shadowBlur={() => 34 * arc()} opacity={arc} />
        <Trace x={480} y={90} w={640} h={360} spark={-20} mark={mk} />
        <Tag text="SPARK" x={480 + trackPx(640, -20)} y={90 + 215} color={C.electric} opacity={mk} />
        <Tag text="a few tens of degrees early" x={480} y={340} color={M} opacity={lab} />
      </Node>,
      steps: [function* () { yield* arc(1, 0.1); yield* waitFor(0.2); yield* arc(0.5, 0.5); }, function* () { yield* all(mk(1, 0.4), lab(1, 0.5)); }],
    };
  },
  S36: () => {
    const ring = sig(0), th = sig(300);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={th} hl={{piston: 1, rod: 0.6, crank: 0.5, fly: 0.5, valves: 0.3, plug: 0.5, block: 0.5}} charge={1} />
        <Node x={400} y={50}>
          <Circle size={320} stroke={C.grid} lineWidth={LW.structure} />
          <Ring r={160} p={ring} />
          <Line points={() => { const a = (ring() * 360 * Math.PI) / 180 - Math.PI / 2; return [[0, 0], [Math.cos(a) * 130, Math.sin(a) * 130]]; }} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Lab text="burning takes time" y={250} size={TY.small_label + 6} />
        </Node>
      </Node>,
      steps: [function* () { yield* all(ring(1, 3.2, ease), th(360, 3.2, ease)); }],
    };
  },
  S37: () => {
    const burst = sig(0), x = sig(0), lab = sig(0);
    const star = Array.from({length: 24}, (_, i) => { const a = (i / 24) * Math.PI * 2, r = i % 2 ? 80 : 160; return [Math.cos(a) * r, Math.sin(a) * r] as [number, number]; });
    return {
      base: <Node>
        <Line x={-100} y={20} closed points={star} stroke={C.chalk} lineWidth={LW.emphasis} lineJoin="round" opacity={burst} fill={rgba(C.chalk, 0.06)} />
        <Lab text="BANG" x={-100} y={20} size={88} opacity={burst} />
        <Cross x={-100} y={20} w={400} h={340} end={x} />
        <Lab text="not an explosion" x={-100} y={290} size={64} opacity={lab} />
      </Node>,
      steps: [to(burst, 1, 0.5), function* () { yield* all(x(1, 0.6), lab(1, 0.6)); }],
    };
  },
  S38: () => {
    const k = sig(0), f = sig(0), w = sig(0);
    // The labels keep a leader line to the front for the whole shot. The line ends on the wrinkled boundary of the growing ball
    // (radius = e1_engine.py build_flame: 0.02 + 1.65 over 12 to 97 percent of the clip, 310 px per unit, tip at about (0, -135)),
    // clamped to the chamber walls (x +-256, floor y 195) once the charge is full, so it never crosses the filled chamber.
    const reach = () => { const u = clamp((T() / dur('S38') - 0.12) / 0.85); return 310 * (0.02 + 1.65 * u) * 0.72; };
    const endL = (): [number, number] => [Math.max(-256, -reach()), Math.min(195, -135 + reach())];
    const endR = (): [number, number] => [Math.min(256, reach()), Math.min(195, -135 + reach())];
    return {
      overlay: true,
      base: <Node>
        <Tag text="ZOOM · THE CHAMBER, NOT TO SCALE" x={-864} y={-430} anchor={[-1, 0]} size={34} />
        <Node opacity={k}><Tag text="kernel" x={-640} y={-150} /><Lead from={[-570, -150]} to={[-40, -125]} color={C.chalk} /></Node>
        <Node opacity={f}><Tag text="flame front" x={-640} y={40} /><Line points={() => [[-560, 40], endL()]} stroke={C.chalk} lineWidth={LW.hairline + 1} lineCap="round" /></Node>
        <Node opacity={w}><Tag text="wrinkled by swirling air" x={650} y={100} /><Line points={() => [[490, 100], endR()]} stroke={C.chalk} lineWidth={LW.hairline + 1} lineCap="round" /></Node>
      </Node>,
      steps: [to(k, 1, 0.5), to(f, 1, 0.5), to(w, 1, 0.5), () => (function* () { })()],
    };
  },
  S39: () => {
    const cv = sig(0), mk = sig(0), lab = sig(0);
    const W = 640, H = 340;
    const f = (u: number) => 1 - Math.exp(-5 * Math.pow(u, 3));
    const half = Math.pow(Math.log(2) / 5, 1 / 3);
    return {
      base: <Node x={-150} y={60}>
        <Line points={[[-W / 2, H / 2], [W / 2, H / 2]]} stroke={C.grid} lineWidth={LW.structure} />
        <Line points={[[-W / 2, H / 2], [-W / 2, -H / 2]]} stroke={C.grid} lineWidth={LW.structure} />
        <Tag text="fraction burned" x={-W / 2} y={-H / 2 - 40} anchor={[-1, 0]} color={M} size={34} />
        <Tag text="crank degrees" x={W / 2} y={H / 2 + 50} anchor={[1, 0]} color={M} size={34} />
        <Line points={() => Array.from({length: 61}, (_, i) => { const u = i / 60; return [-W / 2 + u * W, H / 2 - H * f(u * 1.15)] as [number, number]; })}
          stroke={C.chalk} lineWidth={LW.emphasis} end={cv} lineCap="round" />
        <Node opacity={mk}>
          <Line points={[[-W / 2, 0], [-W / 2 + (half / 1.15) * W, 0], [-W / 2 + (half / 1.15) * W, H / 2]]} stroke={C.muted} lineWidth={LW.structure} lineDash={[10, 8]} />
          <Circle x={-W / 2 + (half / 1.15) * W} y={H / 2 - H * f(half)} size={24} fill={C.chalk} />
          <Mono text="50%" x={-W / 2 - 60} y={0} size={34} color={M} />
        </Node>
        <Node opacity={lab}><Mono text="≈ 25° of crank rotation" x={170} y={110} size={38} /></Node>
        <Tag text="MIT figures, modern engine" x={0} y={H / 2 + 110} color={M} size={34} opacity={cv} />
      </Node>,
      steps: [to(cv, 1, 2.0), to(mk, 1, 0.6), to(lab, 1, 0.6)],
    };
  },
  S40: () => {
    const pk = sig(0), pis = sig(0);
    return {
      base: <Node>
        <Trace x={-60} y={60} w={760} h={380} spark={-20} />
        <Node opacity={pk}>
          <Circle x={-60 + trackPx(760, 18)} y={60 + 190 - 380 * (62.6 / 90 / 1.15)} size={26} fill={C.chalk} />
          <Tag text="PEAK just after the top" x={-60 + trackPx(760, 18) + 30} y={60 + 190 - 380 * (62.6 / 90 / 1.15) - 70} anchor={[-1, 0]} />
        </Node>
        <Engine2D x={560} y={230} s={0.3} th={380} opacity={pis} hl={{block: 0.8}} />
      </Node>,
      steps: [to(pk, 1, 0.6), to(pis, 1, 0.6)],
    };
  },
  S41: () => {
    const sp = sig(-20), ar = sig(0), tg = sig(0);
    return {
      base: <Node>
        <Trace x={-60} y={60} w={760} h={380} spark={sp} area={[22, 80]} areaOp={ar} mark={1} />
        <Tag text="too late: heat can't be used" x={-60} y={330} opacity={tg} />
        <Engine2D x={560} y={230} s={0.3} th={420} hl={{block: 0.8}} />
      </Node>,
      steps: [to(sp, -2, 1.4), function* () { yield* all(ar(1, 0.8), tg(1, 0.6)); }],
    };
  },
  S42: () => {
    const sp = sig(-20), leak = sig(0), w = sig(0), kn = sig(0);
    return {
      base: <Node>
        <Trace x={-60} y={60} w={760} h={380} spark={sp} mark={1} />
        <Node x={500} y={140} opacity={leak}>
          <Circle size={80} fill={C.heat_soft} stroke={C.heat} lineWidth={3} y={() => -10 * Math.sin(T() * 3)} />
          <Tag text="wasted heat" y={90} color={C.chalk} opacity={w} />
        </Node>
        <Tag text="knock more likely" x={-60} y={330} color={C.chalk} opacity={kn} />
      </Node>,
      steps: [function* () { yield* sp(-42, 1.4); leak(1, 0.5); }, to(w, 1, 0.5), to(kn, 1, 0.5)],
    };
  },
  S43: () => {
    const l = sig(0), r = sig(0), front = sig(0), pocket = sig(0);
    return {
      base: <Node>
        <Node x={-320} y={40}>
          <Chamber w={300} h={260} n={40} seed={3} hot={0} opacity={l} kids={<Node>
            <Circle y={-100} size={() => 20 + 380 * front()} fill={rgba(C.heat_soft, 0.55)} stroke={C.heat} lineWidth={LW.emphasis} opacity={() => l() * (front() > 0.01 ? 1 : 0)} />
          </Node>} />
          <Tag text="smooth burn" y={-190} opacity={l} />
        </Node>
        <Node x={180} y={40}>
          <Chamber w={300} h={260} n={40} seed={3} hot={0} opacity={r} kids={<Node>
            <Circle y={-100} size={() => 20 + 200 * front()} fill={rgba(C.heat_soft, 0.55)} stroke={C.heat} lineWidth={LW.emphasis} opacity={() => r() * (front() > 0.01 ? 1 : 0)} />
            <Circle x={90} y={80} size={() => 120 * pocket()} fill={C.heat} opacity={pocket} />
          </Node>} />
          <Tag text="knock: ahead of the flame" y={-190} opacity={r} />
        </Node>
      </Node>,
      steps: [function* () { yield* all(l(1, 0.5), r(1, 0.5)); yield* front(1, 2.8, ease); }, to(pocket, 1, 0.4)],
    };
  },
  S44: () => {
    const sens = sig(0), mk = sig(0), tg = sig(0), tg2 = sig(0), sp = sig(-20);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={330} hl={{piston: 0.5, rod: 0.5, crank: 0.5, fly: 0.5, valves: 0.3, plug: 0.5, block: 1}} charge={1} />
        <Node opacity={sens} x={CX - 135} y={CY + 80}>
          <Rect width={60} height={80} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          {[0, 1, 2].map(i => <Circle x={-30} size={80 + i * 50} stroke={C.chalk} lineWidth={LW.structure} startAngle={140} endAngle={220} opacity={() => 0.4 + 0.6 * Math.sin(T() * 7 - i)} />)}
          <Tag text="knock sensor" y={-80} color={M} />
        </Node>
        <Trace x={500} y={120} w={520} h={290} spark={sp} mark={1} />
        <Tag text="less power" x={330} y={330} anchor={[-1, 0]} opacity={tg} color={M} />
        <Tag text="worse economy" x={330} y={390} anchor={[-1, 0]} opacity={tg2} color={M} />
      </Node>,
      steps: [to(sens, 1, 0.6), function* () { yield* sp(-8, 1.5, ease); }, function* () { yield* all(tg(1, 0.5), delay(0.6, tg2(1, 0.5))); }],
    };
  },
};
