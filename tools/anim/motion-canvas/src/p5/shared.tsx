// Shared drawings for P5 (the four-stroke engine): clock and crank-angle dial, the cylinder cutaway (2D twin of the Blender hero),
// and small helpers. Colours: chalk = structure, heat = flame/exhaust/bill only, lime = the spark only, violet = the air-fuel charge,
// muted = coasting / stored / inactive. Arrowheads only for heat. Positions are px at 1080p, y down.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createSignal, delay, easeInOutCubic, easeOutCubic, linear, waitFor} from '@motion-canvas/core';
import {C, LW, T as TY} from '../lib/parts';
import {T, val} from '../lib/clock';
import {Backed, clamp, lerp, M, rgba, V, Lab, Sm, Mono} from '../lib/lock';
import {cue, dur, meta} from './motion';

export {all, delay, easeInOutCubic, easeOutCubic, linear, waitFor, createSignal, C, LW, TY, T, val, clamp, lerp, M, rgba, V, Lab, Sm, Mono, Backed, cue, dur};
export type P = [number, number];
export const sig = createSignal;
export const ease = easeInOutCubic;
export const sigs = (n: number, v = 0) => Array.from({length: n}, () => createSignal(v));
export const to = (s: any, v: number, d = 0.6) => function* () { yield* s(v, d, ease); };
// time left in the scene after cue i, so a short scene still finishes its move
export const D = (id: string, i: number, want: number) => Math.max(0.25, Math.min(want, dur(id) - cue(id, i) - 0.1));
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mixc = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b), u = clamp(t);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * u)},${Math.round(A[1] + (B[1] - A[1]) * u)},${Math.round(A[2] + (B[2] - A[2]) * u)})`;
};
export const HEAT_SOFT = C.heat_soft;

// ------------------------------------------------------------------ time and crank angle
// Hero sweeps: the Blender clips (e1_engine.py SWEEP) turn the crank at constant speed over 4 % .. 94 % of the slot, 180 degrees.
export const SWEEP: P = [0.04, 0.94];
export const HERO_START: Record<string, number> = {S07: 0, S17: 180, S45: 360, S68: 540};
export const num = (id: string) => parseInt(id.slice(1), 10);
// crank angle the cylinder rests at in scene n (hold), before any sweep
export const holdDeg = (n: number) => (n <= 7 ? 0 : n <= 17 ? 180 : n <= 45 ? 360 : n <= 68 ? 540 : 720);
export const arcOf = (n: number) => (n <= 16 ? 0 : n <= 44 ? 1 : n <= 67 ? 2 : 3);
export const MS_PER_DEG = 0.2375; // 0.171 s / 720 degrees
export const clockText = (deg: number) => (deg * MS_PER_DEG / 1000).toFixed(3) + ' s';

export interface Clk {
  show: any; dim: any; stop: any; grow: any; split: any; origin: any; over: any;
  deg: () => number; // hand and crank angle
  time: () => number; // angle the clock counts (differs from deg only when the hand is moved for show)
  arc: number;
}
export const makeClk = (id: string): Clk => {
  const n = num(id), cold = id.startsWith('S00');
  const hidden = cold && id !== 'S00g';
  const frozen = n >= 57 && n <= 66;
  const show = createSignal(hidden ? 0 : 1);
  const dim = createSignal(frozen ? 1 : 0);
  const stop = createSignal(frozen ? 1 : 0);
  const grow = createSignal(0);
  const split = createSignal(id === 'S00g' ? 0 : 1);
  const origin = createSignal(id === 'S00g' ? 0 : 0);
  const over = createSignal(NaN);
  const a0 = HERO_START[id] ?? holdDeg(n);
  const isHero = HERO_START[id] !== undefined;
  const base = () => {
    if (!isHero) return a0;
    const u = clamp((T() / dur(id) - SWEEP[0]) / (SWEEP[1] - SWEEP[0]));
    return a0 + 180 * u;
  };
  const deg = () => (Number.isNaN(over()) ? base() : over());
  return {show, dim, stop, grow, split, origin, over, deg, time: base, arc: arcOf(n)};
};

export const CLK = {x: 752, y: -318};
export const ClockDial = ({k}: {k: Clk}) => {
  const col = () => mixc(C.chalk, C.muted, k.dim());
  const arcs = [0, 1, 2, 3].map(i => (
    <Circle size={200} startAngle={-90 + 90 * i + 1.5} endAngle={-90 + 90 * (i + 1) - 1.5}
      stroke={() => (k.split() > 0.5 ? (i === k.arc ? col() : C.muted) : C.grid)}
      lineWidth={() => (k.split() > 0.5 && i === k.arc ? LW.emphasis : LW.structure)} />
  ));
  return (
    <Node opacity={() => k.show()} x={() => lerp(CLK.x, 0, k.grow())} y={() => lerp(CLK.y, -60, k.grow())} scale={() => 1 + 1.6 * k.grow()}>
      <Circle size={226} fill={rgba(C.bg, 0.92)} />
      {arcs}
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return <Line points={[[Math.cos(a) * 82, Math.sin(a) * 82], [Math.cos(a) * 94, Math.sin(a) * 94]]} stroke={C.grid} lineWidth={LW.hairline} />;
      })}
      <Line points={() => {
        const a = (k.deg() / 720) * Math.PI * 2 - Math.PI / 2;
        return [[0, 0], [Math.cos(a) * 86, Math.sin(a) * 86]];
      }} stroke={col} lineWidth={LW.emphasis} lineCap="round" />
      <Circle size={14} fill={col} />
      <Txt text={() => clockText(k.time())} x={-128} y={-22} offset={[1, 0]} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={TY.number} fill={col} />
      <Txt text={() => 'CRANK ' + Math.round(k.deg()) + '°'} x={-128} y={28} offset={[1, 0]} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={34} fill={() => mixc(C.muted, C.muted, 0)} />
      <Txt text="CLOCK STOPPED" x={-128} y={70} offset={[1, 0]} fontFamily="Archivo" fontWeight={600} fontSize={34} letterSpacing={3} fill={C.muted} opacity={() => k.stop()} />
      <Txt text="0° = START OF INTAKE" x={-128} y={70} offset={[1, 0]} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={30} fill={C.muted} opacity={() => k.origin()} />
    </Node>
  );
};

// ------------------------------------------------------------------ the cylinder cutaway (2D twin of the Blender H1 hero, 90 px per unit)
export const S = 90;
const R_ = 1, L_ = 3, BORE = 0.9, HEAD = R_ + L_ + 0.5 + 0.28;
export const zp = (a: number) => {
  const r = (a * Math.PI) / 180;
  return R_ * Math.cos(r) + Math.sqrt(L_ * L_ - (R_ * Math.sin(r)) ** 2);
};
const bump = (u: number, p = 1.2) => (u > 0 && u < 1 ? Math.pow(Math.sin(Math.PI * u), p) : 0);
export const liftIn = (th: number) => { let t = ((th % 720) + 720) % 720; if (t > 705) t -= 720; return 0.32 * bump((t + 15) / 230); };
export const liftEx = (th: number) => { let t = ((th % 720) + 720) % 720; if (t < 15) t += 720; return 0.32 * bump((t - 515) / 220); };
const X = (x: number) => x * S;
const Y = (z: number) => -(z - 2.3) * S;
const rnd = (() => { let s = 7; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
const SLOT = Array.from({length: 70}, () => [rnd(), rnd()] as P);

const box = (x0: number, x1: number, z0: number, z1: number, extra: any = {}) => (
  <Rect x={X((x0 + x1) / 2)} y={Y((z0 + z1) / 2)} width={(x1 - x0) * S} height={(z1 - z0) * S} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} {...extra} />
);
const op = (v: any) => () => 0.2 + 0.8 * val(v);
export const FULL = {piston: 1, rod: 1, crank: 1, fly: 1, valves: 1, plug: 1, block: 1};

// th: crank angle (number or signal); hl: per-part brightness 0..1; charge: share of violet dots shown (0..1)
export const Engine2D = ({x = 0, y = 0, s = 1, th = 0, hl = FULL, charge = 0, opacity = 1, ghost = 0, kids = null as any}: any) => {
  const t = () => val(th);
  const h = HEAD;
  const hlp = {...FULL, ...hl};
  return (
    <Node x={x} y={y} scale={s} opacity={opacity}>
      {/* flywheel behind everything: 12 muted ticks make the turn readable */}
      <Node opacity={op(hlp.fly)}>
        <Circle y={Y(0)} size={3.9 * S} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
        {Array.from({length: 12}, (_, i) => (
          <Line points={() => {
            const a = (t() * Math.PI) / 180 + (i * Math.PI) / 6;
            return [[Math.sin(a) * 1.5 * S, Y(0) - Math.cos(a) * 1.5 * S], [Math.sin(a) * 1.88 * S, Y(0) - Math.cos(a) * 1.88 * S]];
          }} stroke={C.muted} lineWidth={LW.emphasis} />
        ))}
      </Node>
      <Node opacity={op(hlp.block)}>
        {[-1, 1].map(s2 => (
          <Node>
            {box(Math.min(s2 * BORE, s2 * 1.45), Math.max(s2 * BORE, s2 * 1.45), 1.25, h)}
            {box(Math.min(s2 * BORE, s2 * 1.45), Math.max(s2 * BORE, s2 * 1.45), h, h + 0.27)}
            {box(Math.min(s2 * BORE, s2 * 1.45), Math.max(s2 * BORE, s2 * 1.45), h + 0.97, h + 1.42)}
            {box(Math.min(s2 * 1.45, s2 * 3.4), Math.max(s2 * 1.45, s2 * 3.4), h + 0.17, h + 0.27)}
            {box(Math.min(s2 * 1.45, s2 * 3.4), Math.max(s2 * 1.45, s2 * 3.4), h + 0.97, h + 1.07)}
            {box(Math.min(s2 * 0.18, s2 * 0.86), Math.max(s2 * 0.18, s2 * 0.86), h + 1.42, h + 1.57)}
            {box(Math.min(s2 * 0.86, s2 * BORE), Math.max(s2 * 0.86, s2 * BORE), h, h + 1.42)}
          </Node>
        ))}
        {box(-0.18, 0.18, h, h + 1.57)}
      </Node>
      {/* charge: constant dot count in a changing volume, so density shows compression */}
      <Node>
        {SLOT.map(([u, v], i) => (
          <Circle size={9} fill={V}
            x={() => X((u - 0.5) * 1.55)}
            y={() => { const crown = zp(t()) + 0.55; return Y(crown + 0.06 + v * Math.max(h - crown - 0.12, 0.02)); }}
            opacity={() => (i / SLOT.length < val(charge) ? 1 : 0)} />
        ))}
      </Node>
      <Node opacity={op(hlp.crank)}>
        <Circle y={Y(0)} size={2.36 * S} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={() => { const a = (t() * Math.PI) / 180; return [[Math.sin(a) * 0.7 * S, Y(0) - Math.cos(a) * 0.7 * S], [Math.sin(a) * 1.12 * S, Y(0) - Math.cos(a) * 1.12 * S]]; }}
          stroke={C.muted} lineWidth={LW.emphasis} />
        <Circle size={0.4 * S} fill={C.chalk}
          x={() => X(R_ * Math.sin((t() * Math.PI) / 180))} y={() => Y(R_ * Math.cos((t() * Math.PI) / 180))} />
      </Node>
      <Node opacity={op(hlp.rod)}>
        <Line points={() => { const a = (t() * Math.PI) / 180; return [[X(R_ * Math.sin(a)), Y(R_ * Math.cos(a))], [0, Y(zp(t()))]]; }}
          stroke={C.chalk} lineWidth={26} lineCap="round" />
        <Line points={() => { const a = (t() * Math.PI) / 180; return [[X(R_ * Math.sin(a)), Y(R_ * Math.cos(a))], [0, Y(zp(t()))]]; }}
          stroke={C.panel} lineWidth={18} lineCap="round" />
      </Node>
      <Node opacity={op(hlp.piston)} y={() => Y(zp(t()) + 0.025)}>
        <Rect width={(2 * BORE - 0.06) * S} height={1.05 * S} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[-(BORE - 0.03) * S, -0.27 * S], [(BORE - 0.03) * S, -0.27 * S]]} stroke={C.chalk} lineWidth={LW.hairline + 1} y={0} />
        <Line points={[[-(BORE - 0.03) * S, -0.16 * S], [(BORE - 0.03) * S, -0.16 * S]]} stroke={C.chalk} lineWidth={LW.hairline + 1} />
        <Circle y={0.1 * S} size={0.26 * S} stroke={C.chalk} lineWidth={LW.structure} />
      </Node>
      <Node opacity={op(hlp.valves)}>
        {[[-0.52, liftIn], [0.52, liftEx]].map(([vx, fn]: any) => (
          <Node x={X(vx)} y={() => Y(h - fn(t()) - 0.045)}>
            <Rect width={0.68 * S} height={0.09 * S} fill={C.chalk} />
            <Rect y={-0.98 * S} width={0.09 * S} height={1.95 * S} fill={C.chalk} />
          </Node>
        ))}
      </Node>
      <Node opacity={op(hlp.plug)}>
        <Rect x={0} y={Y(h + 1.1)} width={0.22 * S} height={1.3 * S} fill={C.chalk} />
        <Rect x={0} y={Y(h + 0.18)} width={0.07 * S} height={0.6 * S} fill={C.electric} />
      </Node>
      {kids}
    </Node>
  );
};
// where parts sit on the cutaway (px, relative to the Engine2D origin at scale 1)
export const EP = {
  inValve: (th: number) => [X(-0.52), Y(HEAD - liftIn(th) - 0.045)] as P,
  exValve: (th: number) => [X(0.52), Y(HEAD - liftEx(th) - 0.045)] as P,
  head: Y(HEAD), plug: [0, Y(HEAD + 0.3)] as P, crown: (th: number) => Y(zp(th) + 0.55), piston: (th: number) => Y(zp(th)),
  crank: [0, Y(0)] as P, fly: [0, Y(0)] as P,
};

// the cutaway pinned to the same spot in every scene that shows it
export const CUT = {x: -200, y: 20};
export const Cutaway = (p: any) => <Engine2D x={CUT.x} y={CUT.y} {...p} />;
// locator inset: the cylinder small, bottom left, so a 2D aside never loses the engine
export const Locator = ({th = 180, label = 'ENGINE'}: any) => (
  <Node x={-790} y={330}>
    <Rect width={190} height={300} radius={16} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
    <Engine2D y={22} s={0.2} th={th} />
    <Txt text={label} y={-128} fontFamily="Archivo" fontWeight={600} fontSize={26} letterSpacing={3} fill={C.muted} />
  </Node>
);

// ------------------------------------------------------------------ small kit
export const Tag = ({text, x = 0, y = 0, color = C.chalk, size = TY.small_label, anchor = [0, 0] as P}: any) => (
  <Backed text={text} x={x} y={y} anchor={anchor} size={size} color={color} />
);
export const Cross = ({x = 0, y = 0, w = 120, h = 80, color = C.muted, end = 1}: any) => (
  <Node x={x} y={y}>
    <Line points={[[-w / 2, -h / 2], [w / 2, h / 2]]} stroke={color} lineWidth={LW.emphasis} lineCap="round" end={end} />
    <Line points={[[w / 2, -h / 2], [-w / 2, h / 2]]} stroke={color} lineWidth={LW.emphasis} lineCap="round" end={end} />
  </Node>
);
export const Strike = ({x = 0, y = 0, w = 300, color = C.muted, end = 1}: any) => (
  <Line x={x} y={y} points={[[-w / 2, 0], [w / 2, 0]]} stroke={color} lineWidth={LW.emphasis} lineCap="round" end={end} />
);
export const Ring = ({x = 0, y = 0, r = 160, p = 1, color = C.chalk, w = LW.emphasis, from = 0, opacity = 1}: any) => (
  <Circle x={x} y={y} size={2 * r} stroke={color} lineWidth={w} opacity={opacity}
    startAngle={() => -90 + from} endAngle={() => -90 + from + 360 * clamp(val(p))} />
);
export const Bar = ({x = 0, y = 0, w = 800, h = 70, p = 1, fill = C.chalk, outline = true, color = C.chalk}: any) => (
  <Node x={x} y={y}>
    {outline ? <Rect width={w} height={h} stroke={color} lineWidth={LW.structure} offset={[0, 0]} /> : null}
    <Rect x={() => -w / 2 + (w * clamp(val(p))) / 2} width={() => w * clamp(val(p))} height={h - 8} fill={fill} />
  </Node>
);
// violet charge dots in a box (counts stay constant while the box changes size)
export const Dots = ({x = 0, y = 0, w = 300, h = 200, n = 40, seed = 3, color = V, size = 10, edge = false, opacity = 1}: any) => {
  let s = seed * 997 + 13;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return (
    <Node x={x} y={y} opacity={opacity}>
      {Array.from({length: n}, () => {
        const u = r(), v = r();
        return <Circle x={() => (u - 0.5) * val(w) * 0.94} y={() => (v - 0.5) * val(h) * 0.94} size={size} fill={color} stroke={edge ? HEAT_SOFT : undefined} lineWidth={edge ? 3 : 0} />;
      })}
    </Node>
  );
};
export const HeatArrow = ({from, to, opacity = 1, end = 1}: any) => (
  <Line points={[from, to]} stroke={C.heat} lineWidth={LW.flow} endArrow arrowSize={22} lineCap="round" lineDash={[28, 16]}
    lineDashOffset={() => -T() * 90} opacity={opacity} end={end} />
);
// dashed muted momentum trail (no arrowheads): a ring segment
export const Trail = ({x = 0, y = 0, r = 160, from = 0, p = 1, opacity = 1}: any) => (
  <Circle x={x} y={y} size={2 * r} stroke={C.muted} lineWidth={LW.emphasis} lineDash={[18, 14]} opacity={opacity}
    lineDashOffset={() => -T() * 60} startAngle={() => -90 + from} endAngle={() => -90 + from + 300 * clamp(val(p))} />
);
export const Title = ({text, x = 0, y = 0, size = 88, color = C.chalk, opacity = 1}: any) => (
  <Txt text={text} x={x} y={y} fontFamily="Archivo" fontWeight={600} fontSize={size} letterSpacing={4} fill={color} opacity={opacity} />
);
export const Card = ({x = 0, y = 0, w = 900, h = 200, lines = [] as string[], sizes = [64, 40, 36], colors = [C.chalk, C.muted, C.muted], opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w} height={h} radius={16} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
    {lines.map((t: string, i: number) => {
      const tot = lines.length;
      const yy = (i - (tot - 1) / 2) * 62;
      return <Txt text={t} y={yy} fontFamily="Archivo" fontWeight={i === 0 ? 600 : 500} fontSize={sizes[i] ?? 34} fill={colors[i] ?? C.muted} />;
    })}
  </Node>
);
export const Pump = ({x = 0, y = 0, s = 1, plate = '87', opacity = 1}: any) => (
  <Node x={x} y={y} scale={s} opacity={opacity}>
    <Rect width={170} height={330} radius={14} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
    <Rect y={-95} width={120} height={80} radius={8} stroke={C.chalk} lineWidth={LW.structure} />
    <Txt text={plate} y={50} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={64} fill={C.chalk} />
    <Line points={[[85, -40], [150, -40], [150, 90], [120, 140]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" lineJoin="round" />
  </Node>
);
export const hdr = (text: string) => <Lab text={text} x={-864} y={-430} size={40} offset={[-1, 0]} color={C.chalk} />;
export {meta};
export const Lead = ({from, to, color = C.muted, opacity = 1}: any) => (
  <Line points={[from, to]} stroke={color} lineWidth={LW.hairline + 1} lineCap="round" opacity={opacity} />
);
// a label that fades in with its own signal (for function steps that also move other things)
export const FadeTag = ({o, ...r}: any) => <Tag {...r} opacity={o} />;
// traffic light (cold open): chalk housing, three lamps; `fill` lights the top lamp chalk (never red)
export const Light = ({x = 0, y = 0, s = 1, draw = 1, lamp = 0, rot = -4, pulse = false}: any) => (
  <Node x={x} y={y} scale={s} rotation={rot}>
    <Rect width={170} height={420} radius={30} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} end={draw} />
    {[-130, 0, 130].map((yy, i) => (
      <Circle y={yy} size={96} stroke={C.chalk} lineWidth={LW.structure} fill={i === 0 ? () => rgba(C.chalk, 0.9 * val(lamp)) : undefined} opacity={() => clamp(val(draw) * 3 - i * 0.4)}
        scale={i === 0 && pulse ? () => 1 + 0.045 * Math.sin(T() * 4) * val(lamp) : 1} />
    ))}
  </Node>
);
// four stroke slots (cold open): in, squeeze, push, out; `lit` = how far slot three is singled out (the others go muted)
export const SLOTX = [-510, -170, 170, 510];
export const Slots = ({y = 0, draw = 1, lit = 0, trail = 0}: any) => {
  const names = ['in', 'squeeze', 'push', 'out'];
  const col = (i: number) => () => (i === 2 ? C.chalk : mixc(C.chalk, C.muted, val(lit)));
  return (
    <Node y={y}>
      {SLOTX.map((sx, i) => (
        <Node x={sx} opacity={() => clamp(val(draw) * 2 - i * 0.3)}>
          <Rect width={260} height={300} radius={12} stroke={col(i)} lineWidth={() => (i === 2 && val(lit) > 0.5 ? LW.emphasis : LW.structure)} fill={C.panel} />
          <Rect y={() => { const ph = (T() / 2.4) % 1; return i % 2 === 0 ? -80 + 160 * ph : 80 - 160 * ph; }} width={200} height={70} stroke={col(i)} lineWidth={LW.structure} fill={C.panel} />
          <Txt text={names[i]} y={190} fontFamily="Archivo" fontWeight={600} fontSize={TY.small_label} letterSpacing={3} fill={col(i)} />
        </Node>
      ))}
      {[0, 1, 3].map(i => (
        <Line points={[[SLOTX[i], 235], [SLOTX[i], 300], [800, 300], [800, 130]]} stroke={C.muted} lineWidth={LW.emphasis} lineDash={[16, 14]} lineDashOffset={() => -T() * 60}
          end={trail} lineCap="round" />
      ))}
    </Node>
  );
};
export const Wheel = ({x = 0, y = 0, r = 150, speed = 200, color = C.chalk, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity} rotation={() => T() * val(speed)}>
    <Circle size={2 * r} stroke={color} lineWidth={LW.structure} fill={C.panel} />
    <Line points={[[0, -r], [0, r]]} stroke={color} lineWidth={LW.structure} />
    <Line points={[[-r, 0], [r, 0]]} stroke={color} lineWidth={LW.structure} />
    <Circle y={-r * 0.62} size={r * 0.3} fill={color} />
  </Node>
);

// ------------------------------------------------------------------ cylinder pressure trace (spark chapter): x = crank degrees from the top mark
export const TRACE = {x0: -40, x1: 80};
const Vc = (a: number) => 0.1 + 0.5 * (1 - Math.cos((a * Math.PI) / 180));
export const pressure = (a: number, spark: number, burn = 58) => {
  const xb = a <= spark ? 0 : 1 - Math.exp(-5 * Math.pow((a - spark) / burn, 3));
  return Math.pow(Vc(a), -1.3) * (1 + 4.2 * xb);
};
export const PMAX = 1.0 / 1; // normalisation set below
const pnorm = (spark: number) => Math.max(...Array.from({length: 121}, (_, i) => pressure(TRACE.x0 + i, spark)));
// x,y centre; w,h box. spark: degrees (negative = before the top), number or signal. end: draw-on 0..1.
export const Trace = ({x = 0, y = 0, w = 640, h = 360, spark = -20, end = 1, cursor = null as any, area = null as any, areaOp = 1, thick = true, topMark = true, opacity = 1, mark = 0}: any) => {
  const px = (a: number) => -w / 2 + ((a - TRACE.x0) / (TRACE.x1 - TRACE.x0)) * w;
  const py = (p: number) => h / 2 - (p / 1.15) * h;
  const norm = 90;
  const pts = (a0: number, a1: number) => {
    const out: P[] = [];
    for (let i = 0; i <= 60; i++) { const a = a0 + ((a1 - a0) * i) / 60; out.push([px(a), py(pressure(a, val(spark)) / norm)]); }
    return out;
  };
  return (
    <Node x={x} y={y} opacity={opacity}>
      <Line points={[[-w / 2, h / 2], [w / 2, h / 2]]} stroke={C.grid} lineWidth={LW.structure} />
      <Line points={[[-w / 2, h / 2], [-w / 2, -h / 2]]} stroke={C.grid} lineWidth={LW.structure} />
      {topMark ? <Line points={[[px(0), h / 2], [px(0), -h / 2 - 20]]} stroke={C.muted} lineWidth={LW.structure} lineDash={[10, 10]} /> : null}
      {topMark ? <Txt text="TOP" x={px(0)} y={-h / 2 - 44} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={30} fill={C.muted} /> : null}
      <Txt text="pressure" x={-w / 2} y={-h / 2 - 30} offset={[-1, 0]} fontFamily="Archivo" fontWeight={500} fontSize={30} fill={C.muted} />
      {area ? <Line closed fill={rgba(C.heat_soft, 0.75)} opacity={areaOp}
        points={() => { const p = pts(area[0], area[1]); return [...p, [px(area[1]), py(0)], [px(area[0]), py(0)]] as P[]; }} /> : null}
      <Line points={() => pts(TRACE.x0, TRACE.x1)} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" end={end} />
      {thick ? <Line points={() => pts(0, 60)} stroke={C.chalk} lineWidth={LW.emphasis + 4} lineJoin="round" end={end} opacity={0} /> : null}
      {cursor !== null ? <Circle size={22} fill={C.chalk} x={() => px(val(cursor))} y={() => py(pressure(val(cursor), val(spark)) / norm)} /> : null}
      <Node x={() => px(val(spark))} y={h / 2} opacity={() => 1}>
        <Line points={[[0, 0], [0, -h * 0.55]]} stroke={C.electric} lineWidth={LW.emphasis} lineCap="round" opacity={() => val(mark)} />
      </Node>
    </Node>
  );
};
export const trackPx = (w: number, a: number) => -w / 2 + ((a - TRACE.x0) / (TRACE.x1 - TRACE.x0)) * w;

// ------------------------------------------------------------------ archival stills (public domain) in a chalk frame
import {Img} from '@motion-canvas/2d';
const ASSETS = import.meta.glob('../../../../../episodes/p5-engine/scenes/assets/*.jpg', {eager: true, query: '?inline', import: 'default'}) as Record<string, string>;
export const assetUrl = (name: string) => {
  const key = Object.keys(ASSETS).find(k => k.endsWith('/' + name));
  return key ? ASSETS[key] : null;
};
export const PHOTO_SIZE: Record<string, [number, number]> = {'otto-portrait.jpg': [1200, 900], 'otto-patent-sheet2.jpg': [1702, 2500]};
// fits inside (w, h); zoom / px / py push in and pan inside the fixed frame (px, py in picture px at zoom 1)
export const Photo = ({name, x = 0, y = 0, w = 600, h = 450, zoom = 1, px = 0, py = 0, opacity = 1, kids = null as any}: any) => {
  const [iw, ih] = PHOTO_SIZE[name];
  const k = Math.min(w / iw, h / ih), fw = iw * k, fh = ih * k;
  const url = assetUrl(name);
  return (
    <Node x={x} y={y} opacity={opacity}>
      <Rect width={fw + 36} height={fh + 36} radius={10} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
      <Rect width={fw} height={fh} clip>
        <Node scale={zoom} x={px} y={py}>
          {url ? <Img src={url} width={fw} height={fh} /> : <Rect width={fw} height={fh} fill={C.panel} />}
          {kids}
        </Node>
      </Rect>
    </Node>
  );
};
export const photoSize = (name: string, w: number, h: number) => {
  const [iw, ih] = PHOTO_SIZE[name], k = Math.min(w / iw, h / ih);
  return [iw * k, ih * k] as P;
};
export const Credit = ({text, x = 0, y = 0, anchor = [0, 0] as P}: any) => <Backed text={text} x={x} y={y} anchor={anchor} size={30} color={M} />;
// power pulses of an n-cylinder engine over 720 degrees: one half-sine lobe of 180 degrees per cylinder; `sum` draws the total
export const lobe = (x: number) => (x >= 0 && x <= 180 ? Math.pow(Math.sin((Math.PI * x) / 180), 1.5) : 0);
export const Pulses = ({x = 0, y = 0, w = 1000, h = 90, n = 1, draw = 1, sum = 0, color = C.chalk, label = ''}: any) => {
  const px = (d: number) => -w / 2 + (d / 720) * w;
  const lobes = Array.from({length: n}, (_, i) => (360 + (i * 720) / n) % 720);
  const one = (start: number) => {
    const pts: P[] = [];
    for (let d = 0; d <= 180; d += 6) pts.push([px((start + d) % 720 + (start + d >= 720 ? 0 : 0)), -h * lobe(d)] as P);
    return pts;
  };
  const wrap = (start: number) => {
    // split a lobe that crosses 720 into two lines
    const a: P[] = [], b: P[] = [];
    for (let d = 0; d <= 180; d += 6) { const dd = start + d; (dd <= 720 ? a : b).push([px(dd <= 720 ? dd : dd - 720), -h * lobe(d)]); }
    return [a, b].filter(p => p.length > 1);
  };
  return (
    <Node x={x} y={y}>
      <Line points={[[-w / 2, 0], [w / 2, 0]]} stroke={C.muted} lineWidth={LW.structure} end={draw} />
      {lobes.flatMap(s => wrap(s).map(p => <Line points={p} stroke={n === 1 ? color : C.muted} lineWidth={n === 1 ? LW.emphasis : LW.structure} lineJoin="round" end={draw} />))}
      {sum !== 0 ? <Line points={() => {
        const out: P[] = [];
        for (let d = 0; d <= 720; d += 8) { let t = 0; lobes.forEach(s => { t += lobe(((d - s) % 720 + 720) % 720); }); out.push([px(d), -h * 0.6 * t]); }
        return out;
      }} stroke={C.chalk} lineWidth={LW.emphasis} lineJoin="round" end={sum} opacity={sum} /> : null}
      {label ? <Txt text={label} x={-w / 2 - 20} offset={[1, 0]} fontFamily="Archivo" fontWeight={500} fontSize={30} fill={C.muted} /> : null}
    </Node>
  );
};
export const Wordmark = ({x = 0, y = 0, s = 1, opacity = 1}: any) => (
  <Node x={x} y={y} scale={s} opacity={opacity}>
    <Txt text="DESIGNED" y={-62} fontFamily="Archivo" fontWeight={600} fontSize={118} letterSpacing={14} fill={C.chalk} />
    <Txt text="OTHERWISE" y={62} fontFamily="Archivo" fontWeight={600} fontSize={118} letterSpacing={14} fill={C.chalk} />
  </Node>
);
