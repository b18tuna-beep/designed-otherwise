// P5 scenes, part 1: cold open (S00a-g), set-up (S01-S06) and stroke one, intake (S07-S16).
// A builder returns {base, steps}: steps map 1:1 to the storyboard `changes`, fired at their word cues (scenes.json).
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import type {Built} from './motion';
import type {Clk} from "./shared";
import {all, C, Card, clamp, Cross, CUT, Cutaway, D, delay, dur, cue, Dots, Engine2D, EP, ease, easeOutCubic, FadeTag, hdr, Lab, Lead, Light,
  liftIn, linear, LW, Locator, M, mixc, Pump, Ring, S, sig, Sm, Mono, Slots, Strike, Tag, to, T, TY, Trail, V, Wheel, waitFor, zp, val} from './shared';

const CX = CUT.x, CY = CUT.y;
const hero = (text: string) => <Tag text={text} x={-864} y={-430} anchor={[-1, 0]} size={40} />;
const cut = (th: number, hl: any = {}, charge: any = 0, opacity: any = 1) => <Engine2D x={CX} y={CY} th={th} hl={hl} charge={charge} opacity={opacity} />;

export const A1: Record<string, (k: Clk) => Built> = {
  // ================================================================ 1. cold open
  S00a: () => {
    const draw = sig(0), lamp = sig(0), arcs = sig(0);
    return {
      base: <Node>
        <Light x={0} y={10} draw={draw} lamp={lamp} pulse />
        {[0, 1, 2].map(i => (
          <Circle x={150} y={-130} size={110 + i * 70} stroke={C.muted} lineWidth={LW.structure} startAngle={-38} endAngle={38}
            opacity={() => arcs() * (0.5 + 0.5 * Math.sin(T() * 5 - i * 1.1))} />
        ))}
      </Node>,
      steps: [to(draw, 1, 1.0), to(lamp, 1, 0.4), to(arcs, 1, 0.5)],
    };
  },
  S00b: () => {
    const lx = sig(0), ws = sig(0), cnt = sig(0);
    return {
      base: <Node>
        <Light x={() => lx()} y={10} s={() => 1 - 0.4 * (lx() / -560)} lamp={1} />
        <Node opacity={ws}><Wheel x={80} y={0} r={170} speed={() => 190 * ws()} /></Node>
        <Node opacity={cnt}>
          <Mono text="700" x={80} y={-300} size={120} />
          <Lab text="per minute" x={80} y={-205} size={44} color={M} />
        </Node>
      </Node>,
      ambient: function* () { yield* lx(-560, 0.9, ease); },
      steps: [to(ws, 1, 0.5), to(cnt, 1, 0.6)],
    };
  },
  S00c: () => {
    const fill = sig(0), note = sig(0), lab = sig(0);
    return {
      base: <Node>
        <Light x={-560} y={10} s={0.6} lamp={1} />
        <Wheel x={-100} y={0} r={170} speed={190} />
        <Rect x={420} y={0} width={520} height={60} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={() => 420 - 260 + 260 * fill()} width={() => 520 * fill()} height={52} fill={rgba2(C.chalk, 0.35)} />
        {Array.from({length: 12}, (_, i) => (
          <Line points={[[420 - 260 + (i + 0.5) * (520 / 12), -58], [420 - 260 + (i + 0.5) * (520 / 12), -92]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round"
            opacity={() => (fill() * 12 > i && fill() * 12 < i + 1.6 ? 1 : 0.18)} />
        ))}
        <Tag text="idle differs by engine" x={-100} y={300} color={M} opacity={note} />
        <Mono text="≈ 12 turns every second" x={420} y={90} size={40} opacity={lab} />
      </Node>,
      steps: [to(note, 1, 0.5), function* () { yield* all(fill(1, 1.0, linear), lab(1, 0.5)); }],
    };
  },
  S00d: () => {
    const draw = sig(0), lit = sig(0), tag = sig(0);
    return {
      base: <Node>
        <Slots draw={draw} lit={lit} />
        <Lab text="1 in 4 pushes" x={0} y={-290} size={72} opacity={tag} />
      </Node>,
      steps: [to(draw, 1, 1.0), function* () { yield* all(lit(1, 0.6), tag(1, 0.6)); }],
    };
  },
  S00e: () => {
    const trail = sig(0), word = sig(0);
    return {
      base: <Node>
        <Slots draw={1} lit={1} trail={trail} />
        <Node x={800}><Wheel r={70} speed={140} /></Node>
        <Lab text="carried" x={-170} y={-290} size={72} opacity={word} color={M} />
      </Node>,
      steps: [to(trail, 1, 1.2), to(word, 1, 0.5)],
    };
  },
  S00f: () => {
    const cyl = sig(0), p = sig(0), lab = sig(0), ghost = sig(1), hand = sig(0);
    return {
      base: <Node>
        <Engine2D x={-330} y={20} s={0.8} th={0} opacity={cyl} />
        <Node x={420} y={20}>
          <Circle size={340} stroke={C.grid} lineWidth={LW.structure} />
          <Ring r={170} p={p} />
          <Circle size={340} stroke={M} lineWidth={LW.hairline + 1} opacity={() => 0.5 * ghost()} rotation={() => T() * 540} startAngle={-90} endAngle={-30} />
          <Line points={() => { const a = ((T() * 25 * hand()) * Math.PI) / 180 - Math.PI / 2; return [[0, 0], [Math.cos(a) * 150, Math.sin(a) * 150]]; }} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" opacity={hand} />
          <Lab text="1/6 second" y={250} size={44} opacity={lab} />
          <Tag text="real time" y={310} color={M} opacity={lab} />
        </Node>
      </Node>,
      steps: [to(cyl, 1, 0.8), function* () { yield* all(p(1 / 6, 1.2, ease), lab(1, 0.6)); }, function* () { yield* all(ghost(0, 0.6), hand(1, 0.6)); }],
    };
  },
  S00g: (k) => {
    const fade = sig(1);
    return {
      base: <Node opacity={fade}>
        <Engine2D x={-330} y={20} s={0.8} th={0} />
        <Node x={420} y={20}>
          <Circle size={340} stroke={C.grid} lineWidth={LW.structure} />
          <Ring r={170} p={1 / 6} />
          <Line points={() => { const a = ((T() * 25) * Math.PI) / 180 - Math.PI / 2; return [[0, 0], [Math.cos(a) * 150, Math.sin(a) * 150]]; }} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
        </Node>
      </Node>,
      steps: [function* () { yield* all(k.show(1, 0.6), k.origin(1, 0.6)); }, to(k.split, 1, 0.5), function* () { yield* fade(0, 0.9); }],
    };
  },

  // ================================================================ 2. stroke one: the set-up
  S01: () => ({ base: <Node />, steps: [cut(0)] }),
  S02: () => {
    const [a, b, c, d] = [sig(0), sig(0), sig(0), sig(0)];
    const [la, lb, lc, ld] = [sig(0), sig(0), sig(0), sig(0)];
    const ring = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={0} hl={{piston: a, rod: b, crank: c, fly: d, valves: 0, plug: 0, block: 0.35}} />
        <FadeTag o={la} text="piston" x={20} y={-150} anchor={[-1, 0]} />
        <FadeTag o={lb} text="connecting rod" x={20} y={-10} anchor={[-1, 0]} />
        <FadeTag o={lc} text="crankshaft" x={20} y={130} anchor={[-1, 0]} />
        <FadeTag o={ld} text="flywheel" x={20} y={330} anchor={[-1, 0]} />
        <Circle x={CX} y={CY + 207} size={410} stroke={C.chalk} lineWidth={LW.emphasis} opacity={() => ring() * (0.5 + 0.5 * Math.sin(T() * 6))} />
      </Node>,
      steps: [
        function* () { yield* all(a(1, 0.4), la(1, 0.4)); },
        function* () { yield* all(a(0, 0.3), b(1, 0.4), lb(1, 0.4)); },
        function* () { yield* all(b(0, 0.3), c(1, 0.4), lc(1, 0.4)); },
        function* () { yield* all(c(0, 0.3), d(1, 0.4), ld(1, 0.4)); },
        to(ring, 1, 0.4),
      ],
    };
  },
  S03: () => {
    const v = sig(0), pl = sig(0), l1 = sig(0), l2 = sig(0), l3 = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={0} hl={{piston: 0.25, rod: 0.25, crank: 0.25, fly: 0.25, valves: v, plug: pl, block: 0.5}} />
        <FadeTag o={l1} text="intake: air and fuel in" x={-860} y={-380} anchor={[-1, 0]} />
        <FadeTag o={l2} text="exhaust: burnt gas out" x={110} y={-170} anchor={[-1, 0]} />
        <FadeTag o={l3} text="spark plug" x={110} y={-60} anchor={[-1, 0]} />
        <Lead from={[-560, -375]} to={[CX - 47, CY - 300]} opacity={l1} />
        <Lead from={[105, -170]} to={[CX + 55, CY - 290]} opacity={l2} />
        <Lead from={[105, -60]} to={[CX + 12, CY - 210]} opacity={l3} />
      </Node>,
      steps: [to(v, 1, 0.5), function* () { yield* all(l1(1, 0.5), l2(1, 0.5)); }, function* () { yield* all(v(0.3, 0.4), pl(1, 0.4), l3(1, 0.5)); }],
    };
  },
  S04: () => {
    const r1 = sig(0), r2 = sig(0), lab = sig(0);
    return {
      base: <Node>
        <Wheel x={-120} y={20} r={110} speed={170} />
        <Ring x={-120} y={20} r={170} p={r1} />
        <Ring x={-120} y={20} r={210} p={r2} color={M} />
        <Lab text="720°" x={330} y={20} size={120} opacity={lab} />
        <Tag text="2 turns = 720°" x={330} y={130} color={M} opacity={lab} />
      </Node>,
      steps: [to(r1, 1, 1.8), function* () { yield* all(r2(1, 1.6), lab(1, 0.8)); }],
    };
  },
  S05: () => {
    const sp = sig(0), tg = sig(0);
    const names = ['intake', 'compression', 'power', 'exhaust'];
    const ang = [-45, 45, 135, 225];
    return {
      base: <Node x={-120} y={20}>
        {names.map((nm, i) => (
          <Node>
            <Circle size={400} startAngle={-90 + 90 * i + 2} endAngle={-90 + 90 * (i + 1) - 2} stroke={i === 0 ? C.chalk : C.muted} lineWidth={i === 0 ? LW.emphasis : LW.structure}
              x={() => Math.cos((ang[i] * Math.PI) / 180) * 22 * sp()} y={() => Math.sin((ang[i] * Math.PI) / 180) * 22 * sp()} />
            <Txt text={nm} x={Math.cos((ang[i] * Math.PI) / 180) * 290} y={Math.sin((ang[i] * Math.PI) / 180) * 275} fontFamily="Archivo" fontWeight={600} fontSize={TY.small_label} fill={i === 0 ? C.chalk : C.muted} opacity={sp} />
            <Mono text="180°" x={Math.cos((ang[i] * Math.PI) / 180) * 125} y={Math.sin((ang[i] * Math.PI) / 180) * 125} size={34} color={i === 0 ? C.chalk : C.muted} opacity={tg} />
          </Node>
        ))}
        <Lab text="4 strokes × 180°" x={0} y={0} size={34} opacity={tg} />
      </Node>,
      steps: [to(sp, 1, 0.8), to(tg, 1, 0.6)],
    };
  },
  S06: () => {
    const mag = sig(0), lab = sig(0), mv = sig(0);
    const ticks = [-2, -1, 0, 1, 2];
    return {
      base: <Node>
        <Circle x={752} y={-318} size={150} stroke={C.chalk} lineWidth={LW.emphasis} opacity={mag} />
        <Line points={[[800, -265], [845, -215]]} stroke={C.chalk} lineWidth={LW.emphasis + 4} lineCap="round" opacity={mag} />
        <Lead from={[752, -240]} to={[560, -120]} opacity={mag} color={C.chalk} />
        <Node x={420} y={30} opacity={mag}>
          <Rect width={460} height={220} radius={14} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
          {ticks.map(t => <Line points={[[t * 80, 20], [t * 80, t === 0 ? -55 : -30]]} stroke={t === 0 ? C.chalk : C.muted} lineWidth={t === 0 ? LW.emphasis : LW.structure} lineCap="round" />)}
          <Line points={() => [[-80 + 80 * mv(), 20], [-80 + 80 * mv(), 80]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Mono text="1° ≈ 0.24 ms" y={-80} size={40} opacity={lab} />
        </Node>
      </Node>,
      steps: [to(mag, 1, 0.7), function* () { yield* all(lab(1, 0.6), mv(1, 1.2)); }],
    };
  },

  // ================================================================ 3. stroke one: intake
  S07: () => {
    const trail = sig(0), open = sig(0), t0 = sig(0);
    return {
      overlay: true,
      base: <Node>
        <Tag text="STROKE 1 · INTAKE" x={-864} y={-430} anchor={[-1, 0]} size={40} opacity={t0} />
        <Line x={CX + 110} points={[[0, -133 + CY], [0, 47 + CY]]} stroke={C.muted} lineWidth={LW.emphasis} lineDash={[16, 14]} end={trail} lineCap="round" />
        <Tag text="OPEN" x={CX - 330} y={CY - 258} color={C.chalk} opacity={open} size={34} />
        <Tag text="CLOSED" x={CX + 330} y={CY - 258} color={M} opacity={open} size={34} />
      </Node>,
      steps: [to(t0, 1, 0.5), to(open, 1, 0.5), to(trail, 1, 2.5)],
    };
  },
  S08: () => {
    const word = sig(0), x = sig(0), lo = sig(0), hi = sig(0), dots = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={180} hl={{piston: 0.4, rod: 0.4, crank: 0.4, fly: 0.4}} charge={dots} />
        <Lab text="suck" x={330} y={-120} size={72} opacity={word} />
        <Cross x={330} y={-120} w={190} h={90} end={x} />
        <Node opacity={lo}><Tag text="lower pressure inside" x={110} y={20} anchor={[-1, 0]} /></Node>
        <Node opacity={hi}><Tag text="higher pressure outside" x={-860} y={-250} anchor={[-1, 0]} /></Node>
      </Node>,
      steps: [function* () { word(1); yield* x(1, 0.6); }, to(lo, 1, 0.5), to(hi, 1, 0.5), to(dots, 1, 2.5)],
    };
  },
  S09: () => {
    const pipe = sig(0), tag = sig(0);
    return {
      base: <Node>
        <Rect x={-30} y={20} width={760} height={140} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} end={pipe} />
        <Dots x={-30} y={20} w={700} h={100} n={34} seed={5} opacity={pipe} />
        <Tag text="AT IDLE" x={-30} y={-110} opacity={tag} />
      </Node>,
      steps: [to(pipe, 1, 0.9), to(tag, 1, 0.5)],
    };
  },
  S10: () => {
    const plate = sig(0), link = sig(0), part = sig(0), sq = sig(0);
    return {
      base: <Node>
        <Rect x={-30} y={20} width={760} height={200} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
        <Rect x={-30} y={20} width={720} height={160} fill={C.bg} />
        <Node x={-30} y={20} opacity={plate}>
          <Line points={() => [[0, -80], [48 * part() + 0, -80 + 160 * 0.27 + 0]]} stroke={C.chalk} lineWidth={LW.emphasis + 4} lineCap="round" />
          <Line points={() => [[0, 80], [48 * part(), 80 - 160 * 0.27]]} stroke={C.chalk} lineWidth={LW.emphasis + 4} lineCap="round" />
        </Node>
        <Node x={-30} y={20} opacity={sq}>
          <Dots x={-200} w={240} h={150} n={38} seed={9} />
          <Dots x={230} w={260} h={150} n={12} seed={4} />
        </Node>
        <Tag text="throttle" x={-30} y={-130} opacity={plate} />
        <Node opacity={link}>
          <Line points={[[-30, 130], [-30, 300], [-380, 300]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[14, 12]} />
          <Rect x={-440} y={300} width={110} height={70} radius={10} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Tag text="accelerator" x={-440} y={380} color={M} />
        </Node>
        <Tag text="partly closed" x={190} y={-130} color={M} opacity={part} />
      </Node>,
      steps: [to(plate, 1, 0.5), to(link, 1, 0.8), to(part, 1, 0.8), to(sq, 1, 0.8)],
    };
  },
  S11: () => {
    const ti = sig(0), eff = sig(0), loop = sig(0), term = sig(0);
    return {
      base: <Node>
        <Lab text="THROTTLING" x={-50} y={-250} size={96} opacity={ti} />
        <Rect x={-290} y={-20} width={90} height={340} stroke={C.chalk} lineWidth={LW.structure} opacity={eff} />
        <Rect x={-290} y={() => 150 - 40 * eff()} width={74} height={() => 80 * eff()} fill={C.chalk} opacity={eff} />
        <Tag text="less efficient at light load" x={-40} y={60} anchor={[-1, 0]} opacity={eff} />
        <Node x={-60} y={220} opacity={loop}>
          <Circle size={80} stroke={C.muted} lineWidth={LW.emphasis} startAngle={-40} endAngle={250} />
        </Node>
        <Lab text="pumping losses" x={60} y={220} size={TY.label} color={M} opacity={term} offset={[-1, 0]} />
      </Node>,
      steps: [to(ti, 1, 0.6), to(eff, 1, 0.8), to(loop, 1, 0.5), to(term, 1, 0.5)],
    };
  },
  S12: () => {
    const fuel = sig(0), x = sig(0), fly = sig(0), pis = sig(0), tr = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={150} hl={{piston: () => 0.3 + 0.7 * pis(), rod: () => 0.3 + 0.7 * pis(), crank: 0.4, fly: () => 0.3 + 0.7 * fly(), valves: 0.3, plug: 0.3, block: 0.4}} />
        <Trail x={CX} y={CY + 207} r={205} from={20} p={tr} opacity={fly} />
        <Node opacity={fuel}>
          <Line points={[[330, -120], [372, -165], [414, -120], [372, -85], [330, -120]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" closed />
          <Tag text="not fuel" x={372} y={-30} />
        </Node>
        <Cross x={372} y={-125} w={130} h={110} end={x} />
        <Tag text="the flywheel" x={CX + 330} y={CY + 207} anchor={[-1, 0]} opacity={fly} />
      </Node>,
      steps: [function* () { fuel(1); yield* x(1, 0.6); }, function* () { yield* all(fly(1, 0.6), tr(1, 1.8)); }, to(pis, 1, 0.7)],
    };
  },
  S13: () => {
    const v = sig(0), ideal = sig(0), real = sig(0);
    const BX = -420, BY = 150, BW = 760;
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={90} hl={{piston: 0.25, rod: 0.25, crank: 0.25, fly: 0.25, valves: v, plug: 0.25, block: 0.4}} />
        <Node x={140} y={190}>
          <Line points={[[0, 130], [560, 130]]} stroke={C.grid} lineWidth={LW.structure} />
          <Line points={[[40, 130], [40, 20], [320, 20], [320, 130]]} stroke={C.muted} lineWidth={LW.emphasis} lineDash={[16, 12]} end={ideal} />
          <Line points={() => {
            const pts: any[] = [];
            for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([40 + u * 340, 130 - 110 * Math.pow(Math.sin(Math.PI * u), 1.2)]); }
            return pts;
          }} stroke={C.chalk} lineWidth={LW.emphasis} end={real} lineCap="round" />
          <Tag text="what you'd guess" x={180} y={-40} color={M} opacity={ideal} />
          <Tag text="what happens" x={230} y={185} opacity={real} />
        </Node>
      </Node>,
      steps: [to(v, 1, 0.5), to(ideal, 1, 0.8), to(real, 1, 1.2)],
    };
  },
  S14: () => {
    const arcS = sig(0), arcE = sig(0), open = sig(0), closed = sig(0);
    const rr = 200;
    // intake window on the 720 dial: starts 15 degrees before the top (0), ends 215 degrees after it (past the bottom at 180)
    const a0 = -15, a1 = 215;
    const pt = (deg: number, r: number): [number, number] => { const a = ((deg / 720) * 360 - 90) * Math.PI / 180; return [Math.cos(a) * r, Math.sin(a) * r]; };
    return {
      base: <Node x={-140} y={20}>
        <Circle size={2 * rr} stroke={C.grid} lineWidth={LW.structure} />
        <Circle size={2 * rr} stroke={C.chalk} lineWidth={LW.emphasis + 2} startAngle={() => -90 + (a0 / 720) * 360 * arcS()} endAngle={() => -90 + (a0 / 720) * 360 + ((a1 - a0) / 720) * 360 * arcE()} />
        <Line points={[pt(0, rr - 24), pt(0, rr + 24)]} stroke={C.chalk} lineWidth={LW.emphasis} />
        <Line points={[pt(180, rr - 24), pt(180, rr + 24)]} stroke={C.chalk} lineWidth={LW.emphasis} />
        <Mono text="TOP" x={pt(0, rr + 55)[0]} y={pt(0, rr + 55)[1]} size={30} color={M} />
        <Mono text="BOTTOM" x={pt(180, rr + 60)[0] + 20} y={pt(180, rr + 60)[1]} size={30} color={M} />
        <Tag text="OPEN: a little early" x={pt(-15, rr + 60)[0] - 40} y={pt(-15, rr + 60)[1] - 24} anchor={[1, 0]} opacity={open} />
        <Tag text="CLOSED: well after bottom" x={pt(215, rr + 70)[0] + 30} y={pt(215, rr + 70)[1] + 50} anchor={[-1, 0]} opacity={closed} />
      </Node>,
      steps: [to(arcS, 1, 0.5), to(open, 1, 0.4), to(arcE, 1, 1.6), to(closed, 1, 0.5)],
    };
  },
  S15: () => {
    const cam = sig(0), half = sig(0), lift = sig(0);
    return {
      base: <Node>
        <Wheel x={-380} y={30} r={130} speed={190} />
        <Tag text="crank" x={-380} y={210} color={M} />
        <Node x={60} y={30} opacity={cam} rotation={() => T() * 95}>
          <Circle size={230} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Line points={[[0, -115], [0, -165], [30, -118]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />
          <Circle size={36} fill={C.chalk} />
        </Node>
        <Rect x={60} y={() => -180 - 40 * Math.max(0, Math.sin((T() * 95 * Math.PI) / 180)) * lift()} width={60} height={110} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} opacity={cam} />
        <Tag text="camshaft" x={60} y={210} opacity={cam} />
        <Lab text="HALF SPEED" x={60} y={290} size={44} opacity={half} />
      </Node>,
      steps: [to(cam, 1, 0.6), to(half, 1, 0.5), to(lift, 1, 0.6)],
    };
  },
  S16: (k) => {
    const lab = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={180} hl={{piston: 0.35, rod: 0.35, crank: 0.35, fly: 0.35, valves: 0.35, plug: 0.35, block: 0.35}} />
        <Mono text="work made so far: 0" x={330} y={100} size={46} opacity={lab} />
      </Node>,
      steps: [
        function* () { yield* k.grow(1, 0.9, ease); yield* waitFor(2.4); yield* k.grow(0, 0.8, ease); },
        to(lab, 1, 0.5),
      ],
    };
  },
};
function rgba2(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
