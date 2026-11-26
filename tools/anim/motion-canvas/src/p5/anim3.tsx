// P5 scenes, part 3: stroke three, power (S45-S55), the clock stopped (S56-S67), stroke four, exhaust (S68-S77) and the close (S78-S83).
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import type {Built} from './motion';
import type {Clk} from './shared';
import {all, C, Card, clamp, CUT, Credit, delay, Dots, Engine2D, EP, ease, FadeTag, HeatArrow, Lab, Lead, linear, LW, M, Mono, Photo, photoSize, Pulses, Ring, rgba, sig, Slots, Tag, to, T, Trail,
  TY, Cross, V, waitFor, val, Wheel, Wordmark, mixc, Light, HEAT_SOFT, Bar} from './shared';

const CX = CUT.x, CY = CUT.y;
const dim = {piston: 0.35, rod: 0.35, crank: 0.35, fly: 0.35, valves: 0.35, plug: 0.35, block: 0.4};
const car = (x: number, y: number, o: any = 1) => (
  <Node x={x} y={y} opacity={o}>
    <Line points={[[-70, 20], [-70, -10], [-40, -10], [-20, -45], [35, -45], [60, -10], [75, -10], [75, 20]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" closed />
    <Circle x={-40} y={24} size={32} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
    <Circle x={45} y={24} size={32} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
  </Node>
);

export const A3: Record<string, (k: Clk) => Built> = {
  // ================================================================ stroke three: power
  S45: () => {
    const t0 = sig(0), bar = sig(0), tr = sig(0);
    return {
      overlay: true,
      base: <Node>
        <Tag text="STROKE 3 · POWER" x={-864} y={-430} anchor={[-1, 0]} size={40} opacity={t0} />
        <Node x={CX + 190} y={CY - 100} opacity={() => Math.min(1, bar() * 4)}>
          <Rect width={44} height={240} stroke={C.chalk} lineWidth={LW.structure} />
          <Rect y={() => 120 - 4 - (232 * bar()) / 2} width={30} height={() => Math.max(1, 232 * bar())} fill={C.chalk} />
          <Tag text="pressure" y={150} color={M} size={30} />
        </Node>
        <Trail x={CX} y={CY + 207} r={205} from={20} p={tr} />
      </Node>,
      steps: [to(t0, 1, 0.5), to(bar, 1, 1.2), to(tr, 1, 1.5)],
    };
  },
  S46: () => {
    const arc = sig(0), plus = sig(0), only = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={540} hl={dim} />
        <Node x={330} y={90}>
          <Circle size={300} stroke={C.grid} lineWidth={LW.structure} />
          <Circle size={300} startAngle={90} endAngle={180} stroke={C.chalk} lineWidth={LW.emphasis + 6} opacity={arc} />
          <Tag text="POWER" x={0} y={0} opacity={arc} />
        </Node>
        <Mono text="work made: +" x={300} y={-110} size={52} opacity={plus} />
        <Lab text="ONLY HERE" x={330} y={330} size={72} opacity={only} />
      </Node>,
      steps: [to(arc, 1, 0.6), function* () { yield* all(plus(1, 0.5), only(1, 0.5)); }],
    };
  },
  S47: () => {
    const pulse = sig(0), t = sig(0);
    return {
      base: <Node>
        <Node x={-180} y={50}>
          <Circle size={380} stroke={C.grid} lineWidth={LW.structure} />
          <Circle size={380} startAngle={90} endAngle={180} stroke={C.chalk} lineWidth={() => LW.emphasis + 4 + 6 * Math.sin(T() * 6) * pulse()} opacity={pulse} />
          <Tag text="half a turn" x={-160} y={250} opacity={pulse} />
        </Node>
        <Mono text="≈ 0.04 s" x={280} y={50} size={100} opacity={t} />
      </Node>,
      steps: [to(pulse, 1, 0.6), to(t, 1, 0.6)],
    };
  },
  S48: () => {
    const tr = sig(0), sp = sig(0), flat = sig(0);
    return {
      base: <Node>
        <Wheel x={-420} y={30} r={140} speed={150} />
        <Trail x={-420} y={30} r={175} from={0} p={tr} />
        <Tag text="stored push" x={-420} y={250} opacity={tr} />
        <Node x={60} y={30}>
          {[0, 1, 2, 3].map(i => (
            <Circle size={260} x={i * 0} startAngle={-90 + 90 * i + 2} endAngle={-90 + 90 * (i + 1) - 2} stroke={C.muted} lineWidth={LW.structure} opacity={() => (i === 0 ? 0.6 : sp())} />
          ))}
          <Tag text="given back over 3 strokes" y={210} opacity={sp} color={M} />
        </Node>
        <Node x={470} y={30}>
          <Line points={() => Array.from({length: 40}, (_, i) => { const u = i / 39; const spike = Math.pow(Math.sin(u * Math.PI * 3), 8); return [-170 + u * 340, 80 - 150 * (spike * (1 - flat()) + 0.4 * flat())] as [number, number]; })}
            stroke={C.chalk} lineWidth={LW.emphasis} lineJoin="round" />
          <Tag text="smoother pulses" y={150} opacity={flat} />
        </Node>
      </Node>,
      steps: [to(tr, 1, 1.6), to(sp, 1, 0.8), to(flat, 1, 1.2)],
    };
  },
  S49: () => {
    const b = sig(0), lab = sig(0);
    return {
      base: <Node>
        <Pulses x={-100} y={70} w={1000} h={150} n={1} draw={b} />
        <Tag text="0°" x={-600} y={120} color={M} size={28} opacity={b} />
        <Tag text="720°" x={400} y={120} color={M} size={28} opacity={b} />
        <Lab text="once every two turns" x={-100} y={230} size={60} opacity={lab} />
      </Node>,
      steps: [to(b, 1, 1.4), to(lab, 1, 0.6)],
    };
  },
  S50: () => {
    const c = sig(0), bump = sig(0);
    return {
      base: <Node>
        {[0, 1, 2, 3].map(i => (
          <Node y={-130 + i * 110} opacity={() => clamp(c() * 4 - i)}>
            <Rect x={-650} width={70} height={60} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
            <Txt text={String([1, 3, 4, 2][i])} x={-650} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={34} fill={C.chalk} />
          </Node>
        ))}
        {[0, 1, 2, 3].map(i => <Line points={[[-600, -100 + i * 110], [400, -100 + i * 110]]} stroke={C.grid} lineWidth={LW.structure} />)}
        {[0, 1, 2, 3].map(i => {
          const fire = 180 * i;
          const px = (d: number) => -600 + (d / 720) * 1000;
          const pts = Array.from({length: 31}, (_, j) => { const d = (j / 30) * 180; return [px(fire + d), -100 + i * 110 - 70 * Math.pow(Math.sin((Math.PI * d) / 180), 1.5)] as [number, number]; });
          return <Line points={pts} stroke={C.chalk} lineWidth={LW.emphasis} lineJoin="round" end={bump} opacity={() => clamp(bump() * 4 - i)} />;
        })}
        <Lab text="share the job" x={-100} y={320} size={64} opacity={bump} />
      </Node>,
      steps: [to(c, 1, 1.2), to(bump, 1, 1.8)],
    };
  },
  S51: () => {
    const rule = sig(0), card = sig(0);
    return {
      base: <Node>
        {[0, 1, 2, 3].map(i => {
          const fire = 180 * i;
          const px = (d: number) => -600 + (d / 720) * 1000;
          const pts = Array.from({length: 31}, (_, j) => { const d = (j / 30) * 180; return [px(fire + d), -100 + i * 110 - 70 * Math.pow(Math.sin((Math.PI * d) / 180), 1.5)] as [number, number]; });
          return <Node>
            <Line points={[[-600, -100 + i * 110], [400, -100 + i * 110]]} stroke={C.grid} lineWidth={LW.structure} />
            <Line points={pts} stroke={C.chalk} lineWidth={LW.emphasis} lineJoin="round" />
          </Node>;
        })}
        <Node opacity={rule}>
          {[0, 1, 2, 3].map(i => <Line points={[[-600 + (i * 180 / 720) * 1000, -200], [-600 + (i * 180 / 720) * 1000, 300]]} stroke={C.muted} lineWidth={LW.hairline + 1} lineDash={[8, 8]} />)}
          {[0, 1, 2].map(i => <Mono text="180°" x={-600 + ((i + 0.5) * 180 / 720) * 1000} y={-235} size={30} color={C.chalk} />)}
        </Node>
        <Lab text="4 cylinders: every 180°" x={-100} y={340} size={56} opacity={card} />
      </Node>,
      steps: [to(rule, 1, 0.8), to(card, 1, 0.6)],
    };
  },
  S52: () => {
    const t0 = sig(0), t1 = sig(0), t2 = sig(0), t3 = sig(0);
    return {
      overlay: true,
      base: <Node>
        <Tag text="FIRING ORDER 1-3-4-2" x={-864} y={-430} anchor={[-1, 0]} size={40} opacity={t0} />
        <Tag text="each on a different stroke" x={-864} y={340} anchor={[-1, 0]} size={34} opacity={t1} />
        <Tag text="one pushing" x={400} y={340} size={34} opacity={t2} />
        <Tag text="in · squeeze · out" x={0} y={410} size={34} color={M} opacity={t3} />
      </Node>,
      steps: [to(t0, 1, 0.5), to(t1, 1, 0.5), to(t2, 1, 0.5), to(t3, 1, 0.5)],
    };
  },
  S53: () => {
    const six = sig(0), eight = sig(0);
    return {
      base: <Node>
        <Node opacity={six}>
          <Pulses x={-100} y={-40} w={1000} h={110} n={6} draw={1} />
          <Lab text="6 cylinders: every 120°" x={-100} y={50} size={44} />
        </Node>
        <Node opacity={eight}>
          <Pulses x={-100} y={230} w={1000} h={110} n={8} draw={1} />
          <Lab text="8 cylinders: every 90°" x={-100} y={320} size={44} />
        </Node>
      </Node>,
      steps: [to(six, 1, 0.8), to(eight, 1, 0.8)],
    };
  },
  S54: () => {
    const sm = sig(0), tg = sig(0);
    return {
      base: <Node>
        <Pulses x={-100} y={120} w={1000} h={230} n={6} draw={1} sum={sm} />
        <Lab text="more overlap = smoother" x={-100} y={230} size={60} opacity={tg} />
      </Node>,
      steps: [to(sm, 1, 1.4), to(tg, 1, 0.6)],
    };
  },
  S55: (k) => ({
    base: <Node>
      <Engine2D x={CX} y={CY} th={540} hl={dim} />
      <Ring x={330} y={90} r={150} p={0.75} color={C.muted} />
      <Circle x={330} y={90} size={300} stroke={C.grid} lineWidth={LW.structure} startAngle={0} endAngle={90} />
      <Tag text="3 of 4 strokes done" x={330} y={290} color={M} />
    </Node>,
    steps: [function* () { yield* k.grow(1, 0.9, ease); yield* waitFor(2.2); yield* k.grow(0, 0.8, ease); }],
  }),

  // ================================================================ the clock stopped (aside: no cylinder on screen, clock frozen at 0.129 s)
  S56: (k) => {
    const cyl = sig(1), tag = sig(0);
    return {
      base: <Node><Engine2D x={CX} y={CY} th={540} hl={dim} opacity={cyl} /></Node>,
      steps: [function* () { yield* all(k.dim(1, 0.7), cyl(0, 0.9)); }, to(k.stop, 1, 0.6)],
    };
  },
  S57: () => {
    const t = sig(0), q = sig(0);
    return {
      base: <Node>
        <Lab text="THE OTTO CYCLE" x={-60} y={0} size={110} opacity={t} />
        <Lab text="whose cycle?" x={-60} y={140} size={56} color={M} opacity={q} />
      </Node>,
      steps: [function* () { yield* t(1, 0.7); yield* waitFor(1.6); yield* q(1, 0.6); }],
    };
  },
  S58: () => {
    const ph = sig(0), role = sig(0);
    const [w, h] = photoSize('otto-portrait.jpg', 640, 480);
    return {
      base: <Node>
        <Photo name="otto-portrait.jpg" x={-330} y={10} w={640} h={480} opacity={ph} />
        <Lab text="Nikolaus Otto" x={140} y={-30} size={80} offset={[-1, 0]} opacity={ph} />
        <Tag text="German gas-engine builder" x={140} y={60} anchor={[-1, 0]} color={C.chalk} opacity={role} />
        <Credit text="portrait: unknown, c. 1868 (public domain)" x={-864} y={400} anchor={[-1, 0]} />
      </Node>,
      steps: [to(ph, 1, 0.7), to(role, 1, 0.6)],
    };
  },
  S59: () => {
    const lang = sig(0), med = sig(0), y67 = sig(0), early = sig(0);
    return {
      base: <Node>
        <Photo name="otto-portrait.jpg" x={-480} y={-40} w={400} h={300} />
        <Tag text="Nikolaus Otto" x={-480} y={150} />
        <Card x={150} y={-60} w={640} h={160} lines={['Eugen Langen', "Otto's partner"]} sizes={[60, 36]} opacity={lang} />
        <Node x={150} y={210} opacity={med}>
          <Circle x={-250} size={90} stroke={C.chalk} lineWidth={LW.structure} />
          <Circle x={-250} size={50} stroke={C.chalk} lineWidth={LW.hairline + 1} />
          <Mono text="1867 Paris · gold medal" x={-170} size={36} offset={[-1, 0]} opacity={y67} />
          <Tag text="for an earlier gas engine" x={-170} y={60} anchor={[-1, 0]} color={M} opacity={early} />
        </Node>
      </Node>,
      steps: [to(lang, 1, 0.6), to(med, 1, 0.6), to(y67, 1, 0.5), to(early, 1, 0.5)],
    };
  },
  S60: () => {
    const a = sig(0), b = sig(0), c = sig(0), line = sig(0);
    return {
      base: <Node>
        <Line points={[[-640, 60], [620, 60]]} stroke={C.muted} lineWidth={LW.structure} end={line} />
        <Node x={-420} y={60} opacity={a}>
          <Circle size={26} fill={C.chalk} />
          <Mono text="1867" y={-60} size={52} />
          <Tag text="earlier gas engine" y={80} color={M} />
        </Node>
        <Node x={150} y={60} opacity={b}>
          <Circle size={26} fill={C.chalk} />
          <Mono text="1876" y={-190} size={64} />
          <Rect y={-100} width={300} height={90} radius={10} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Txt text="four-stroke principle" y={-100} fontFamily="Archivo" fontWeight={500} fontSize={30} fill={C.chalk} />
        </Node>
        <Node x={150} y={170} opacity={c}>
          <Line points={[[-100, 40], [-40, 10], [20, -10], [100, -50], [180, -90]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" lineJoin="round" />
          <Tag text="immediate commercial success" y={110} />
        </Node>
      </Node>,
      steps: [function* () { a(1); yield* line(0.45, 0.5); }, function* () { yield* all(line(1, 0.6), b(1, 0.6)); }, to(c, 1, 0.8)],
    };
  },
  S61: () => {
    const sheet = sig(0), zoom = sig(1), px = sig(0), py = sig(0), hl = sig(0);
    const [fw, fh] = photoSize('otto-patent-sheet2.jpg', 560, 800);
    return {
      base: <Node>
        <Photo name="otto-patent-sheet2.jpg" x={-380} y={30} w={560} h={800} opacity={sheet} zoom={zoom} px={px} py={py}
          kids={<Rect x={fw * 0.3} y={-fh * 0.33} width={fw * 0.5} height={fh * 0.22} stroke={C.chalk} lineWidth={LW.emphasis} opacity={hl} />} />
        <Card x={290} y={40} w={620} h={250} lines={['Otto, US patent 1877', 'a gas engine with a layered charge']} sizes={[52, 36]} opacity={sheet} />
        <Credit text="US 194,047, USPTO via Google Patents (public domain)" x={-864} y={440} anchor={[-1, 0]} />
        <Tag text="not the modern engine" x={290} y={200} color={M} opacity={hl} />
      </Node>,
      steps: [to(sheet, 1, 0.7), to(hl, 1, 0.6), function* () { yield* all(zoom(1.9, 1.6, ease), px(-fw * 0.38, 1.6, ease), py(fh * 0.22, 1.6, ease)); }],
    };
  },
  S62: () => {
    const sl = sig(0);
    return {
      base: <Node>
        <Photo name="otto-portrait.jpg" x={() => -80 - 340 * sl()} y={-40} w={400} h={300} />
        <Node opacity={sl} x={260} y={-30}>
          <Rect width={420} height={310} radius={14} stroke={C.muted} lineWidth={LW.structure} lineDash={[16, 12]} />
          <Txt text="first?" fontFamily="Archivo" fontWeight={600} fontSize={96} fill={C.muted} />
        </Node>
        <Tag text="Nikolaus Otto" x={() => -80 - 340 * sl()} y={150} />
      </Node>,
      steps: [to(sl, 1, 0.9)],
    };
  },
  S63: () => {
    const card = sig(0), sheet = sig(0), eng = sig(0);
    return {
      base: <Node>
        <Card x={-160} y={-170} w={900} h={250} lines={['ALPHONSE BEAU DE ROCHAS', 'French engineer', '1862: set out the cycle on paper']} sizes={[56, 38, 38]} colors={[C.chalk, C.muted, C.chalk]} opacity={card} />
        <Node x={-300} y={190} opacity={sheet}>
          <Rect width={300} height={170} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          {[0, 1, 2, 3].map(i => <Rect x={-105 + i * 70} width={50} height={110} stroke={C.chalk} lineWidth={LW.hairline + 1} />)}
          <Tag text="on paper" y={125} color={M} />
        </Node>
        <Node x={140} y={190} opacity={eng}>
          <Rect width={160} height={170} radius={8} stroke={C.muted} lineWidth={LW.structure} lineDash={[14, 12]} />
          <Tag text="never built an engine" y={125} color={M} />
        </Node>
      </Node>,
      steps: [to(card, 1, 0.7), to(sheet, 1, 0.7), to(eng, 1, 0.7)],
    };
  },
  S64: () => {
    const sheet = sig(0), stamp = sig(0), settle = sig(0);
    return {
      base: <Node>
        <Node x={-330} y={30} opacity={sheet}>
          <Rect width={330} height={430} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Mono text="1862" y={-120} size={60} />
          <Tag text="brought to light" y={40} color={M} size={30} />
        </Node>
        <Node x={130} y={30}>
          <Rect width={420} height={430} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Txt text="Otto, German patent" y={-120} fontFamily="Archivo" fontWeight={600} fontSize={34} fill={C.chalk} />
          <Node rotation={-18} scale={() => 1.6 - 0.6 * settle()} opacity={stamp} y={40}>
            <Rect width={300} height={90} radius={6} stroke={C.muted} lineWidth={LW.emphasis} />
            <Mono text="REVOKED 1886" size={38} color={C.muted} />
          </Node>
        </Node>
      </Node>,
      steps: [to(sheet, 1, 0.7), to(stamp, 1, 0.4), to(settle, 1, 0.4)],
    };
  },
  S65: () => {
    const lay = sig(0), q = sig(0), hop = sig(0);
    const rows = [0, 1, 2, 3, 4];
    return {
      base: <Node>
        <Node x={-320} y={30} opacity={lay}>
          <Rect width={300} height={300} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          {rows.map(i => <Dots y={-120 + i * 60} w={280} h={44} n={14 - i * 2} seed={i + 2} />)}
          <Rect y={-155} width={30} height={22} fill={C.chalk} />
          <Tag text="a layered charge" y={-215} />
          <Circle x={() => -100 + 200 * hop()} y={() => -120 + 240 * hop()} size={18} fill={C.heat} opacity={hop} />
        </Node>
        <Card x={290} y={30} w={640} h={330} lines={['"instead of an explosion ensuing,', 'the flame passes gradually', 'from one particle to another"']} sizes={[38, 38, 38]} colors={[C.chalk, C.chalk, C.chalk]} opacity={q} />
        <Credit text="Otto, 1877 patent" x={290} y={230} />
      </Node>,
      steps: [to(lay, 1, 0.8), to(q, 1, 0.8), to(hop, 1, 2.0)],
    };
  },
  S66: () => {
    const mix = sig(0), fr = sig(0), tg = sig(0);
    return {
      base: <Node>
        <Node x={-100} y={30}>
          <Rect width={420} height={300} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Rect width={420} height={300} clip>
            {[0, 1, 2, 3, 4].map(i => <Dots y={() => (-120 + i * 60) * (1 - mix()) + (0) * mix()} w={400} h={() => 44 + 256 * mix() / 5} n={12} seed={i + 2} opacity={() => 1} />)}
            <Circle y={-130} size={() => 20 + 560 * fr()} fill={rgba(C.heat_soft, 0.35)} stroke={C.heat} lineWidth={LW.emphasis} opacity={() => (fr() > 0.01 ? 1 : 0)} />
          </Rect>
        </Node>
        <Lab text="a spreading flame, not a bang" x={-100} y={270} size={52} opacity={tg} />
      </Node>,
      steps: [to(mix, 1, 1.0), function* () { yield* fr(1, 2.2, ease); }, to(tg, 1, 0.6)],
    };
  },
  S67: (k) => {
    const cyl = sig(0);
    return {
      base: <Node><Engine2D x={CX} y={CY} th={540} hl={dim} opacity={cyl} /></Node>,
      steps: [function* () { k.stop(0); yield* all(k.dim(0, 0.7), cyl(1, 0.9)); }],
    };
  },

  // ================================================================ stroke four: exhaust
  S68: () => {
    const t0 = sig(0), open = sig(0), bar = sig(1), cost = sig(0);
    return {
      overlay: true,
      base: <Node>
        <Tag text="STROKE 4 · EXHAUST" x={-864} y={-430} anchor={[-1, 0]} size={40} opacity={t0} />
        <Tag text="OPEN" x={CX + 330} y={CY - 258} size={34} opacity={open} />
        <Node x={CX + 190} y={CY - 100}>
          <Rect width={44} height={240} stroke={C.chalk} lineWidth={LW.structure} />
          <Rect y={() => 120 - 4 - (232 * bar()) / 2} width={30} height={() => Math.max(1, 232 * bar())} fill={C.chalk} />
          <Tag text="pressure" y={150} color={M} size={30} />
        </Node>
        <Tag text="a little work, a net gain" x={CX + 400} y={CY + 140} anchor={[-1, 0]} size={34} color={M} opacity={cost} />
      </Node>,
      steps: [to(t0, 1, 0.5), to(open, 1, 0.4), to(bar, 0.12, 1.4), to(cost, 1, 0.5)],
    };
  },
  S69: () => {
    const g = sig(0), ar = sig(0);
    const path = (u: number): [number, number] => {
      // from the chamber up to the exhaust port and out to the right (px, relative to the scene)
      const a: [number, number] = [CX + 40, CY + EP.head + 60], b: [number, number] = [CX + 47, CY + EP.head - 40], c: [number, number] = [CX + 380, CY + EP.head - 60];
      return u < 0.4 ? [a[0] + (b[0] - a[0]) * (u / 0.4), a[1] + (b[1] - a[1]) * (u / 0.4)] : [b[0] + (c[0] - b[0]) * ((u - 0.4) / 0.6), b[1] + (c[1] - b[1]) * ((u - 0.4) / 0.6)];
    };
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={630} hl={dim} />
        <Trail x={CX} y={CY + 207} r={205} from={20} p={1} opacity={0.6} />
        <Node opacity={g}>
          {Array.from({length: 9}, (_, i) => (
            <Circle size={14} fill={C.heat_soft} stroke={C.heat} lineWidth={3}
              x={() => path((((T() * 0.5 + i / 9) % 1)))[0]} y={() => path((((T() * 0.5 + i / 9) % 1)))[1]} />
          ))}
        </Node>
        <Node opacity={ar}><HeatArrow from={[CX + 300, CY + EP.head - 20]} to={[CX + 470, CY + EP.head - 20]} /></Node>
        <Tag text="burnt gas out" x={CX + 400} y={CY + EP.head + 60} anchor={[-1, 0]} opacity={ar} />
      </Node>,
      steps: [to(g, 1, 0.6), to(ar, 1, 0.6)],
    };
  },
  S70: () => {
    const both = sig(0), tag = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={4} hl={{piston: 0.25, rod: 0.25, crank: 0.25, fly: 0.25, valves: both, plug: 0.25, block: 0.4}} />
        <Lab text="VALVE OVERLAP" x={110} y={-130} size={56} offset={[-1, 0]} opacity={tag} />
        <Tag text="both valves open" x={110} y={-50} anchor={[-1, 0]} opacity={both} color={M} />
      </Node>,
      steps: [to(both, 1, 0.6), to(tag, 1, 0.5)],
    };
  },
  S71: () => {
    const tr = sig(0);
    return {
      base: <Node>
        <Engine2D x={CX} y={CY} th={600} hl={{piston: 0.5, rod: 0.5, crank: 0.5, fly: 1, valves: 0.3, plug: 0.3, block: 0.4}} />
        <Circle x={CX} y={CY + 207} size={410} stroke={C.muted} lineWidth={LW.emphasis} lineDash={[18, 14]} lineDashOffset={() => -T() * 60} opacity={tr} />
        <Lab text="again: the flywheel" x={110} y={150} size={48} offset={[-1, 0]} opacity={tr} />
      </Node>,
      steps: [to(tr, 1, 0.8)],
    };
  },
  S72: () => {
    const bar = sig(0);
    return {
      base: <Node>
        <Rect x={-100} y={20} width={1000} height={110} stroke={C.chalk} lineWidth={LW.structure} end={bar} />
        <Tag text="energy in the fuel" x={-100} y={-80} opacity={bar} />
      </Node>,
      steps: [to(bar, 1, 1.2)],
    };
  },
  S73: () => {
    const seg = sig(0), cr = sig(0);
    return {
      base: <Node>
        <Rect x={-100} y={20} width={1000} height={110} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={() => -100 - 500 + 100 * seg()} y={20} width={() => 200 * seg()} height={100} fill={C.chalk} />
        <Tag text="moves the car: about a fifth" x={-400} y={-80} opacity={seg} />
        {car(-400, 190, cr)}
      </Node>,
      steps: [to(seg, 1, 1.0), to(cr, 1, 0.6)],
    };
  },
  S74: () => {
    const br = sig(0), q = sig(0), src = sig(0);
    return {
      base: <Node>
        <Rect x={-100} y={20} width={1000} height={110} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={-400} y={20} width={200} height={100} fill={C.chalk} />
        <Node y={-60} opacity={br}>
          <Line points={[[-480, 40], [-480, 0], [-300, 0], [-300, 40]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />
          <Mono text="12 to 30 percent" x={-390} y={-50} size={44} />
        </Node>
        <Tag text="depends on how it's driven" x={-100} y={150} opacity={q} />
        <Credit text="US Dept. of Energy" x={-100} y={230} opacity={src} />
      </Node>,
      steps: [to(br, 1, 0.8), to(q, 1, 0.6), to(src, 1, 0.5)],
    };
  },
  S75: () => {
    const h = sig(0), pct = sig(0), a1 = sig(0), a2 = sig(0);
    return {
      base: <Node>
        <Rect x={-100} y={20} width={1000} height={110} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect x={-400} y={20} width={200} height={100} fill={C.chalk} />
        <Rect x={() => -300 + 300 * h()} y={20} width={() => 600 * h()} height={100} fill={C.heat_soft} stroke={C.heat} lineWidth={3} opacity={h} />
        <Mono text="lost as heat: about 60%" x={50} y={-80} size={44} opacity={pct} />
        <Node opacity={a1}><HeatArrow from={[-60, 100]} to={[-60, 230]} /><Tag text="exhaust" x={-60} y={270} /></Node>
        <Node opacity={a2}><HeatArrow from={[260, 100]} to={[260, 230]} /><Tag text="cooling" x={260} y={270} /></Node>
      </Node>,
      steps: [to(h, 1, 1.2), to(pct, 1, 0.5), to(a1, 1, 0.5), to(a2, 1, 0.5)],
    };
  },
  S76: () => {
    const b2 = sig(0), mk = sig(0), seg = sig(0), best = sig(0);
    return {
      base: <Node>
        <Rect x={-100} y={-120} width={1000} height={80} stroke={C.muted} lineWidth={LW.structure} />
        <Rect x={-400} y={-120} width={200} height={72} fill={rgba(C.chalk, 0.3)} />
        <Node y={100} opacity={b2}>
          <Rect x={-100} width={1000} height={110} stroke={C.chalk} lineWidth={LW.structure} />
          <Rect x={() => -100 - 500 + (1000 / 3) * seg() / 2} width={() => (1000 / 3) * seg()} height={100} fill={C.chalk} />
          <Tag text="at the crank: roughly a third" x={-100} y={-85} />
        </Node>
        <Node opacity={mk}>
          <Line points={[[400, 20], [400, 215]]} stroke={C.muted} lineWidth={LW.structure} lineDash={[10, 8]} />
          <Tag text="before the gearbox and tires" x={400} y={250} color={M} />
        </Node>
        <Lab text="at best" x={-100} y={230} size={64} opacity={best} />
      </Node>,
      steps: [to(b2, 1, 0.6), to(mk, 1, 0.6), to(seg, 1, 1.0), to(best, 1, 0.5)],
    };
  },
  S77: (k) => ({
    base: <Node>
      <Engine2D x={CX} y={CY} th={720} hl={dim} />
      <Ring x={330} y={90} r={150} p={1} color={C.muted} />
      <Tag text="two turns, full ring" x={330} y={290} color={M} />
    </Node>,
    steps: [function* () { yield* k.grow(1, 0.9, ease); yield* waitFor(2.2); yield* k.grow(0, 0.8, ease); }],
  }),

  // ================================================================ close
  S78: () => {
    const ring = sig(0), cap = sig(0);
    return {
      base: <Node>
        <Circle x={-100} y={20} size={420} stroke={C.grid} lineWidth={LW.structure} />
        <Ring x={-100} y={20} r={210} p={ring} />
        <Lab text="ONE CYCLE" x={-100} y={20} size={52} opacity={cap} />
      </Node>,
      steps: [function* () { yield* all(ring(1, 1.6, ease), delay(0.8, cap(1, 0.6))); }],
    };
  },
  S79: () => {
    const turns = sig(0), arcs = sig(0), only = sig(0);
    return {
      base: <Node>
        <Wheel x={-380} y={30} r={130} speed={200} />
        <Tag text="2 turns · 4 strokes" x={-380} y={210} color={M} opacity={turns} />
        <Node x={140} y={30} opacity={arcs}>
          {[0, 1, 2, 3].map(i => <Circle size={300} startAngle={-90 + 90 * i + 2} endAngle={-90 + 90 * (i + 1) - 2} stroke={i === 2 ? C.chalk : C.muted} lineWidth={() => (i === 2 ? LW.emphasis + 2 * only() : LW.structure)} />)}
        </Node>
        <Tag text="only one pushing" x={140} y={250} opacity={only} />
      </Node>,
      steps: [to(turns, 1, 0.6), to(arcs, 1, 0.6), to(only, 1, 0.6)],
    };
  },
  S80: () => {
    const fl = sig(0), nb = sig(0);
    return {
      base: <Node>
        <Slots draw={1} lit={1} trail={fl} y={-30} />
        <Node x={0} y={300} opacity={nb}>
          {[-300, 0, 300].map(x => <Rect x={x} width={110} height={90} radius={10} stroke={C.muted} lineWidth={LW.structure} lineDash={[12, 10]} />)}
          <Tag text="carried by a wheel and neighbours" y={80} color={M} />
        </Node>
      </Node>,
      steps: [to(fl, 1, 1.4), to(nb, 1, 0.8)],
    };
  },
  S81: (k) => {
    const cnt = sig(0), light = sig(0);
    return {
      base: <Node>
        {[0, 1, 2, 3].map(i => <Engine2D x={-600 + i * 230} y={110} s={0.21} th={() => ((T() * 140 + [0, 540, 180, 360][i]) % 720)} />)}
        <Mono text="≈ 6 cycles a second" x={-100} y={-80} size={72} opacity={cnt} />
        <Node x={560} y={90} opacity={light}><Light s={0.55} lamp={1} rot={0} /></Node>
      </Node>,
      steps: [
        function* () { k.over(0); yield* k.over(720, 1.8, linear); k.over(NaN); },
        to(cnt, 1, 0.6),
        () => (function* () { })(),
        to(light, 1, 0.6),
      ],
    };
  },
  S82: (k) => {
    const wm = sig(0);
    return {
      base: <Node><Wordmark y={-10} opacity={wm} /></Node>,
      steps: [function* () { k.over(720); yield* k.over(0, 1.3, ease); }, to(wm, 1, 0.9)],
    };
  },
  S83: () => {
    const bx = sig(0);
    return {
      base: <Node>
        <Wordmark y={-180} s={0.7} />
        <Node opacity={bx}>
          <Rect x={-380} y={150} width={560} height={315} radius={14} stroke={C.chalk} lineWidth={LW.structure} lineDash={[18, 14]} />
          <Rect x={260} y={150} width={560} height={315} radius={14} stroke={C.chalk} lineWidth={LW.structure} lineDash={[18, 14]} />
        </Node>
      </Node>,
      steps: [to(bx, 1, 0.8)],
    };
  },
};
