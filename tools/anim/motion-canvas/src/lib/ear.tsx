// Drawing parts for P2 (the inner ear). Colours, type and line weights come from style/tokens.json via parts.tsx.
// P2 colour meanings (episodes/p2-ear/board/production-plan.md):
//   chalk  = structure and its vibration (sound in air as chalk rings, membrane ripple, bone motion)
//   violet = the working part: outer-hair-cell motor push, sound the ear itself makes
//   lime   = electricity: hair-cell signal, hearing nerve
//   muted  = secondary labels, lost cells
// No orange, no blue, and no arrowheads anywhere (arrowheads mean heat).
import {Circle, Img, Line, Node, Rect, Spline} from '@motion-canvas/2d';
import {C, Label, LW, Num, Small, T as TY} from './parts';
import {T as CLK, val} from './clock';

type P = [number, number];
const V = C.refrigerant; // violet: the working part
const VS = C.refrigerant_soft;
const L = C.electric; // lime: electricity
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const fract = (v: number) => ((v % 1) + 1) % 1;

// ------------------------------------------------------------------ ear cross-section (front view, sound enters from the left)
// Local frame: outer ear ~x -690, canal -470..-130, eardrum -110, middle ear -130..140,
// vestibule 200, cochlea centred (330, 70), nerve out to the right. Box is about x -690..570, y -330..250.
export const EAR_FOCUS: Record<string, [number, number, number, number]> = {
  // cx, cy, w, h in section coordinates
  canal: [-310, 0, 420, 190],
  drum: [-60, -30, 260, 330],
  middle: [0, -40, 300, 360],
  cochlea: [320, 60, 360, 360],
  cells: [390, 60, 150, 150],
  whole: [-60, -40, 1300, 600],
};
export const COCHLEA: P = [330, 70];

export const spiralPts = (cx: number, cy: number, r0 = 150, turns = 2.5, r1 = 26, scale = 1, n = 140): P[] => {
  const th = turns * Math.PI * 2;
  const k = Math.log(r0 / r1) / th;
  return Array.from({length: n + 1}, (_, i) => {
    const t = (i / n) * th;
    const r = r0 * Math.exp(-k * t) * scale;
    const a = Math.PI + t; // start on the left, next to the vestibule
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as P;
  });
};

export const EarSection = ({x = 0, y = 0, s = 1, k = 1, drum = 0, rock = 0, plunge = 0, stirrupLit = 0,
  dimOuter = 1, dimMiddle = 1, dimInner = 1, nerve = C.muted, opacity = 1, ...rest}: any) => {
  const st = LW.structure * k, hl = LW.hairline * k;
  return (
    <Node x={x} y={y} scale={s} opacity={opacity} {...rest}>
      {/* outer ear: skin line + pinna */}
      <Node opacity={dimOuter}>
        <Spline points={[[-450, -330], [-462, -200], [-470, -44]]} stroke={C.chalk} lineWidth={st} smoothness={0.5} lineCap="round" />
        <Spline points={[[-470, 44], [-462, 200], [-450, 330]]} stroke={C.chalk} lineWidth={st} smoothness={0.5} lineCap="round" />
        <Spline points={[[-470, -60], [-540, -190], [-620, -300], [-690, -250], [-700, -60], [-660, 120], [-600, 240], [-530, 220], [-500, 120], [-470, 60]]}
          stroke={C.chalk} lineWidth={st} smoothness={0.45} lineCap="round" />
        {/* canal */}
        <Spline points={[[-470, -44], [-300, -40], [-140, -58]]} stroke={C.chalk} lineWidth={st} smoothness={0.4} lineCap="round" />
        <Spline points={[[-470, 44], [-300, 46], [-140, 64]]} stroke={C.chalk} lineWidth={st} smoothness={0.4} lineCap="round" />
      </Node>
      {/* eardrum: thin cone pointing inward; flexes with `drum` */}
      <Spline points={() => [[-136, -76], [-104 + val(drum) * 14, 0], [-136, 80]]} stroke={C.chalk} lineWidth={LW.emphasis * k}
        smoothness={0.6} lineCap="round" opacity={dimMiddle} />
      {/* middle-ear cavity */}
      <Rect x={5} y={-15} width={280} height={350} radius={70} stroke={C.muted} lineWidth={hl} lineDash={[10 * k, 10 * k]} opacity={() => 0.7 * val(dimMiddle)} />
      {/* ossicles: hammer + anvil rock about a pivot, stirrup works like a piston */}
      <Node opacity={dimMiddle}>
        <Node x={-50} y={-115} rotation={() => val(rock) * 6}>
          <Node x={50} y={115}>
            <Line points={[[-110, 30], [-82, -92]]} stroke={C.chalk} lineWidth={LW.emphasis * k} lineCap="round" />
            <Circle x={-74} y={-116} size={52} fill={C.bg} stroke={C.chalk} lineWidth={st} />
            <Circle x={-22} y={-120} size={56} fill={C.bg} stroke={C.chalk} lineWidth={st} />
            <Line points={[[-22, -96], [6, 8]]} stroke={C.chalk} lineWidth={LW.emphasis * k} lineCap="round" />
          </Node>
        </Node>
        <Node x={() => val(plunge) * 8}>
          <Node shadowColor={C.chalk} shadowBlur={() => val(stirrupLit) * 26}>
            <Circle x={14} y={12} size={22} fill={C.chalk} />
            <Spline points={[[20, 2], [70, -26], [122, -30]]} stroke={C.chalk} lineWidth={() => st + val(stirrupLit) * 3 * k} smoothness={0.6} lineCap="round" />
            <Spline points={[[20, 22], [70, 50], [122, 50]]} stroke={C.chalk} lineWidth={() => st + val(stirrupLit) * 3 * k} smoothness={0.6} lineCap="round" />
            <Line points={[[126, -42], [126, 62]]} stroke={C.chalk} lineWidth={() => LW.emphasis * k + val(stirrupLit) * 4 * k} lineCap="round" />
          </Node>
        </Node>
      </Node>
      {/* inner ear: vestibule, semicircular canals, cochlea, nerve */}
      <Node opacity={dimInner}>
        <Rect x={195} y={10} width={120} height={150} radius={60} stroke={C.chalk} lineWidth={st} />
        <Circle x={170} y={-150} size={120} stroke={C.chalk} lineWidth={hl + 1 * k} opacity={0.75} />
        <Circle x={255} y={-130} width={140} height={96} rotation={-30} stroke={C.chalk} lineWidth={hl + 1 * k} opacity={0.75} />
        <Circle x={215} y={-95} width={70} height={130} rotation={20} stroke={C.chalk} lineWidth={hl + 1 * k} opacity={0.75} />
        <Line points={spiralPts(COCHLEA[0], COCHLEA[1], 150)} stroke={C.chalk} lineWidth={st} lineCap="round" />
        <Line points={spiralPts(COCHLEA[0], COCHLEA[1], 150, 2.5, 26, 0.66)} stroke={C.chalk} lineWidth={hl} lineCap="round" opacity={0.7} />
        <Spline points={[[COCHLEA[0] + 20, COCHLEA[1] - 6], [450, 30], [570, 10]]} stroke={nerve} lineWidth={LW.emphasis * k} smoothness={0.5} lineCap="round" />
      </Node>
    </Node>
  );
};

// ------------------------------------------------------------------ corner locator: the same section, small, with the current zoom boxed
export const LOC = {x: 700, y: -372, w: 300, h: 168, s: 0.19};
export const Locator = ({focus = 'cochlea', x = LOC.x, y = LOC.y, opacity = 1}: any) => {
  const [fx, fy, fw, fh] = EAR_FOCUS[focus] ?? EAR_FOCUS.cochlea;
  const ox = 60, oy = 40; // centre of the section box
  return (
    <Node x={x} y={y} opacity={opacity}>
      <Rect width={LOC.w} height={LOC.h} radius={16} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
      <Node scale={LOC.s} x={ox * LOC.s} y={oy * LOC.s}>
        <EarSection k={2.6} />
      </Node>
      <Rect x={(fx + ox) * LOC.s} y={(fy + oy) * LOC.s} width={fw * LOC.s} height={fh * LOC.s} radius={6}
        stroke={C.chalk} lineWidth={LW.structure} />
    </Node>
  );
};

// ------------------------------------------------------------------ sound in air: chalk arcs travelling along x (no arrowheads)
// from a to b, n rings, period seconds per trip; dir +1 = rightward. on: 0..1 visibility.
export const Rings = ({a = -400, b = 400, y = 0, n = 3, period = 2.4, size = 160, color = C.chalk, on = 1, width = LW.structure,
  span = 38, phase = 0, fade = true}: any) => {
  const dir = b >= a ? 1 : -1;
  return (
    <Node opacity={on}>
      {Array.from({length: n}, (_, i) => {
        const u = () => fract(CLK() / period + i / n + phase);
        return (
          <Circle x={() => a + (b - a) * u() - (dir * size) / 2} y={y} size={size} stroke={color} lineWidth={width} lineCap="round"
            startAngle={dir > 0 ? -span : 180 - span} endAngle={dir > 0 ? span : 180 + span}
            opacity={() => (fade ? Math.min(1, u() * 6, (1 - u()) * 5) : 1)} />
        );
      })}
    </Node>
  );
};
// a single ring that makes one trip when `p` goes 0..1
export const RingTrip = ({a = 0, b = 400, y = 0, p, size = 160, color = C.chalk, width = LW.emphasis, span = 40, grow = 0}: any) => {
  const dir = b >= a ? 1 : -1;
  return (
    <Circle x={() => a + (b - a) * val(p) - (dir * (size + grow * val(p))) / 2} y={y} size={() => size + grow * val(p)} stroke={color} lineWidth={width}
      lineCap="round" startAngle={dir > 0 ? -span : 180 - span} endAngle={dir > 0 ? span : 180 + span}
      opacity={() => { const q = val(p); return q <= 0 || q >= 1 ? 0 : Math.min(1, q * 8, (1 - q) * 6); }} />
  );
};

// ------------------------------------------------------------------ probe in the ear canal (side section, zoomed)
export const ProbeCanal = ({x = 0, y = 0, s = 1, labels = false}: any) => (
  <Node x={x} y={y} scale={s}>
    {/* canal walls */}
    <Spline points={[[-900, -190], [-500, -150], [-100, -150], [170, -180]]} stroke={C.chalk} lineWidth={LW.structure} smoothness={0.4} lineCap="round" />
    <Spline points={[[-900, 190], [-500, 150], [-100, 150], [170, 180]]} stroke={C.chalk} lineWidth={LW.structure} smoothness={0.4} lineCap="round" />
    {/* eardrum */}
    <Spline points={[[170, -190], [215, 0], [170, 190]]} stroke={C.chalk} lineWidth={LW.emphasis} smoothness={0.6} lineCap="round" />
    {/* beyond the eardrum, faint: a bone and the coiled cochlea */}
    <Node opacity={0.45}>
      <Line points={[[230, 40], [300, -90]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
      <Circle x={312} y={-112} size={40} stroke={C.chalk} lineWidth={LW.structure} />
      <Line points={spiralPts(560, 30, 130)} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
    </Node>
    {/* soft probe tip with speaker and microphone */}
    <Line points={[[-1000, 0], [-760, 0]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
    <Rect x={-620} width={300} height={250} radius={90} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
    <Node x={-560} y={-52}>
      <Rect x={-30} width={26} height={40} radius={4} stroke={C.chalk} lineWidth={LW.hairline + 1} />
      <Line closed points={[[-17, -20], [20, -38], [20, 38], [-17, 20]]} stroke={C.chalk} lineWidth={LW.hairline + 1} />
    </Node>
    <Node x={-560} y={56}>
      <Circle size={56} stroke={C.chalk} lineWidth={LW.hairline + 1} />
      {[-12, 0, 12].map(d => <Line points={[[d, -16], [d, 16]]} stroke={C.chalk} lineWidth={LW.hairline} />)}
    </Node>
    {labels ? <Small text="probe" x={-620} y={-180} color={C.chalk} /> : null}
  </Node>
);
export const PROBE = {speaker: [-560, -52] as P, mic: [-560, 56] as P, drum: 200, inner: 520};

// ------------------------------------------------------------------ scope trace: flat, a chalk click, a violet echo a few ms later
export const Scope = ({x = 0, y = 0, w = 900, h = 190, click = 0, echo = 0, sweep = 1, echoAt = 0.42, echoW = 0.26, label = '', labelColor = C.chalk}: any) => {
  const N = 220;
  const fy = (u: number) => {
    let v = 0;
    const c = val(click);
    if (c > 0) { const d = (u - 0.1) / 0.012; v += c * -Math.exp(-d * d) * 0.75; }
    return v;
  };
  const ey = (u: number) => {
    const e = val(echo);
    const d = (u - echoAt) / (echoW / 2);
    if (Math.abs(d) > 1) return 0;
    return e * Math.sin((u - echoAt) * 90) * 0.32 * Math.cos((d * Math.PI) / 2) ** 2;
  };
  const pts = (fn: (u: number) => number, u0: number, u1: number) => (): P[] => {
    const end = Math.min(u1, val(sweep));
    const out: P[] = [];
    for (let i = 0; i <= N; i++) {
      const u = u0 + ((u1 - u0) * i) / N;
      if (u > end) break;
      out.push([-w / 2 + 30 + (w - 60) * u, fn(u) * (h / 2 - 10)]);
    }
    return out.length > 1 ? out : [[-w / 2 + 30, 0], [-w / 2 + 31, 0]];
  };
  return (
    <Node x={x} y={y}>
      <Rect width={w} height={h} radius={18} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
      <Line points={[[-w / 2 + 30, 0], [w / 2 - 30, 0]]} stroke={C.grid} lineWidth={LW.hairline} />
      <Line points={pts(fy, 0, 1)} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" lineJoin="round" />
      <Line points={pts(u => ey(u), echoAt - echoW / 2, echoAt + echoW / 2)} stroke={V} lineWidth={LW.emphasis} lineCap="round" lineJoin="round"
        opacity={() => (val(echo) > 0.02 ? 1 : 0)} />
      {/* cursor */}
      <Rect x={() => -w / 2 + 30 + (w - 60) * clamp(val(sweep))} width={4} height={h - 40} fill={C.muted}
        opacity={() => (val(sweep) < 1 ? 0.5 + 0.5 * Math.sin(CLK() * 6) : 0)} />
      {label ? <Small text={label} x={-w / 2} y={-h / 2 - 34} offset={[-1, 0]} color={labelColor} /> : null}
    </Node>
  );
};
export const scopeX = (u: number, w = 900) => -w / 2 + 30 + (w - 60) * u;

// ------------------------------------------------------------------ people
export const Head = ({x = 0, y = 0, s = 1, ring = 0, opacity = 1, stroke = C.chalk, phase = 0}: any) => (
  <Node x={x} y={y} scale={s} opacity={opacity}>
    <Circle y={-30} width={92} height={108} stroke={stroke} lineWidth={LW.structure} />
    <Spline points={[[-78, 90], [-56, 44], [0, 34], [56, 44], [78, 90]]} stroke={stroke} lineWidth={LW.structure} smoothness={0.5} lineCap="round" />
    <Circle x={-48} y={-28} width={14} height={30} stroke={stroke} lineWidth={LW.hairline + 1} />
    <Circle x={48} y={-28} width={14} height={30} stroke={stroke} lineWidth={LW.hairline + 1} />
    {/* faint steady violet tone at the ear */}
    <Node opacity={ring}>
      {[0, 1].map(j => {
        const u = () => fract(CLK() / 2.2 + j / 2 + phase);
        return <Circle x={52} y={-28} size={() => 22 + u() * 56} stroke={V} lineWidth={LW.structure} startAngle={-60} endAngle={60}
          opacity={() => 1 - u()} />;
      })}
      <Circle x={48} y={-28} size={18} fill={V} />
    </Node>
  </Node>
);
// grid of heads; `on` lists the indices that show a violet tone
export const HeadGrid = ({x = 0, y = 0, cols = 8, rows = 3, dx = 170, dy = 200, s = 0.9, on = [] as number[], ring = 1, offDim = 1}: any) => (
  <Node x={x} y={y}>
    {Array.from({length: cols * rows}, (_, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      return <Head x={(c - (cols - 1) / 2) * dx} y={(r - (rows - 1) / 2) * dy} s={s} ring={on.includes(i) ? ring : 0}
        phase={(i * 0.37) % 1} opacity={on.includes(i) ? 1 : offDim} />;
    })}
  </Node>
);
// 13 of 24 (just over half) scattered, fixed pattern
export const OVER_HALF_24 = [0, 2, 3, 5, 7, 8, 11, 12, 14, 17, 18, 20, 23];

// ------------------------------------------------------------------ basilar membrane, straightened: base narrow (left), apex wide (right)
// bump: function u -> displacement in px (chalk ripple); hatching tight at the base, loose at the apex
export const membraneWidth = (u: number, w0 = 44, w1 = 190) => w0 + (w1 - w0) * u;
export const Membrane = ({x = 0, y = 0, len = 1500, w0 = 44, w1 = 190, bump = (_u: number) => 0, hatch = 1, stroke = C.chalk, opacity = 1}: any) => {
  const N = 90;
  const ux = (u: number) => -len / 2 + len * u;
  const edge = (sgn: number) => () => Array.from({length: N + 1}, (_, i) => {
    const u = i / N;
    return [ux(u), (sgn * membraneWidth(u, w0, w1)) / 2 + bump(u)] as P;
  });
  // hatch positions: spacing grows from ~10 px at the base to ~46 px at the apex
  const hs: number[] = [];
  for (let px = 6; px < len - 4;) { hs.push(px / len); px += 10 + 36 * (px / len); }
  return (
    <Node x={x} y={y} opacity={opacity}>
      <Node opacity={hatch}>
        {hs.map(u => (
          <Line points={() => [[ux(u), -membraneWidth(u, w0, w1) / 2 + bump(u) + 4], [ux(u), membraneWidth(u, w0, w1) / 2 + bump(u) - 4]]}
            stroke={stroke} lineWidth={LW.hairline} opacity={0.75} />
        ))}
      </Node>
      <Line points={edge(-1)} stroke={stroke} lineWidth={LW.structure} lineCap="round" />
      <Line points={edge(1)} stroke={stroke} lineWidth={LW.structure} lineCap="round" />
      <Line points={() => [[ux(0), -w0 / 2 + bump(0)], [ux(0), w0 / 2 + bump(0)]] as P[]} stroke={stroke} lineWidth={LW.structure} lineCap="round" />
      <Line points={() => [[ux(1), -w1 / 2 + bump(1)], [ux(1), w1 / 2 + bump(1)]] as P[]} stroke={stroke} lineWidth={LW.structure} lineCap="round" />
    </Node>
  );
};
// travelling-wave envelope: rises toward the place `at` (0..1), peaks there and dies quickly beyond it
export const twEnvelope = (u: number, at: number, sharp = 1) => {
  if (u <= at) { const d = (at - u) / (0.32 / sharp); return Math.exp(-d * d * 1.2); }
  const d = (u - at) / (0.05 / sharp);
  return Math.exp(-d * d);
};
export const twBump = (at: () => number, amp: () => number, speed = 9, k = 60) => (u: number) =>
  -val(amp) * twEnvelope(u, val(at)) * Math.sin(u * k - CLK() * speed);

// ------------------------------------------------------------------ piano keys (high under the base on the left, low under the apex on the right)
export const Keys = ({x = 0, y = 0, len = 1500, n = 26, h = 150, lit = -1, opacity = 1}: any) => {
  const kw = len / n;
  const black = [0, 1, 3, 4, 5]; // pattern of black keys within 7 whites
  return (
    <Node x={x} y={y} opacity={opacity}>
      {Array.from({length: n}, (_, i) => (
        <Rect x={-len / 2 + kw * (i + 0.5)} width={kw - 4} height={h} radius={[0, 0, 8, 8]} stroke={C.chalk} lineWidth={LW.hairline}
          fill={() => (Math.round(val(lit)) === i ? C.grid : null)} />
      ))}
      {Array.from({length: n - 1}, (_, i) => (black.includes(i % 7) ? (
        <Rect x={-len / 2 + kw * (i + 1)} y={-h / 2 + h * 0.3} width={kw * 0.55} height={h * 0.6} radius={[0, 0, 5, 5]} fill={C.muted} />
      ) : null))}
    </Node>
  );
};

// ------------------------------------------------------------------ hair cells
// stereocilia tuft in three stepped rows; tilt in degrees; open: channels at the tips 0..1
export const Tuft = ({x = 0, y = 0, s = 1, tilt = 0, open = 0, v = false, color = C.chalk}: any) => (
  <Node x={x} y={y} scale={s} rotation={tilt}>
    {(v ? [[-34, 46], [-20, 66], [-6, 86], [6, 86], [20, 66], [34, 46]] : [[-22, 50], [0, 72], [22, 94]]).map(([dx, hh], i, arr) => (
      <Node>
        <Line points={[[dx, 0], [dx, -hh]]} stroke={color} lineWidth={LW.structure + 1} lineCap="round" />
        {/* tip link + channel on the shorter neighbour (towards the tallest) */}
        {!v && i < arr.length - 1 ? (
          <Node>
            <Line points={[[dx, -hh], [arr[i + 1][0], -hh - 16]]} stroke={color} lineWidth={LW.hairline} />
            <Circle x={dx} y={-hh} size={16} stroke={color} lineWidth={LW.hairline} fill={() => (val(open) > 0.5 ? L : C.bg)} />
          </Node>
        ) : null}
      </Node>
    ))}
  </Node>
);
export const HairCell = ({x = 0, y = 0, s = 1, tilt = 0, open = 0, stroke = C.chalk, w = 110, h = 230, opacity = 1}: any) => (
  <Node x={x} y={y} scale={s} opacity={opacity}>
    <Rect width={w} height={h} radius={[w / 2, w / 2, w / 2.2, w / 2.2]} stroke={stroke} lineWidth={LW.structure} fill={C.bg} />
    <Circle y={h * 0.14} size={w * 0.38} stroke={stroke} lineWidth={LW.hairline} />
    <Tuft y={-h / 2 + 4} tilt={tilt} open={open} color={stroke} />
  </Node>
);
// outer hair cell: tall cylinder, V tuft, violet motor along the side walls; len: length factor (1 = rest)
export const OuterCell = ({x = 0, y = 0, s = 1, len = 1, motor = 0, w = 74, h = 280, stroke = C.chalk, opacity = 1, tuft = true}: any) => {
  const hh = () => h * val(len);
  return (
    <Node x={x} y={y} scale={s} opacity={opacity}>
      <Rect y={() => -hh() / 2} width={w} height={hh} radius={w / 2} stroke={stroke} lineWidth={LW.structure} fill={C.bg} />
      <Line points={() => [[-w / 2, -hh() + w / 2], [-w / 2, -w / 2]]} stroke={V} lineWidth={LW.emphasis + 2} lineCap="round" opacity={motor}
        shadowColor={V} shadowBlur={18} />
      <Line points={() => [[w / 2, -hh() + w / 2], [w / 2, -w / 2]]} stroke={V} lineWidth={LW.emphasis + 2} lineCap="round" opacity={motor}
        shadowColor={V} shadowBlur={18} />
      <Circle y={-w * 0.6} size={w * 0.42} stroke={stroke} lineWidth={LW.hairline} />
      {tuft ? <Node y={() => -hh()}><Tuft v s={0.62} color={stroke} /></Node> : null}
    </Node>
  );
};
// small hair-cell icon for rows (gap: lost, shown as a muted dashed outline)
export const CellIcon = ({x = 0, y = 0, lost = 0, grow = 1, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect y={10} width={46} height={100} radius={22} stroke={C.muted} lineWidth={LW.hairline} lineDash={[8, 8]} opacity={() => val(lost)} />
    <Node scale={() => Math.max(0.001, val(grow) * (1 - val(lost)))} y={60}>
      <Node y={-50}>
        <Rect width={46} height={100} radius={22} stroke={C.chalk} lineWidth={LW.structure} />
        <Tuft y={-50} s={0.42} v />
      </Node>
    </Node>
  </Node>
);

// ------------------------------------------------------------------ amplifier glyph: a small wave grows into a big one (no triangle, no arrow)
export const AmpGlyph = ({x = 0, y = 0, s = 1, opacity = 1, label = true}: any) => {
  const pts = (u0: number, u1: number) => () => {
    const out: P[] = [];
    for (let i = 0; i <= 80; i++) {
      const u = u0 + ((u1 - u0) * i) / 80;
      const a = 10 + 60 * u * u;
      out.push([-160 + 320 * u, Math.sin(u * 26 - CLK() * 5) * a]);
    }
    return out;
  };
  return (
    <Node x={x} y={y} scale={s} opacity={opacity}>
      <Rect width={380} height={200} radius={26} fill={C.panel} stroke={V} lineWidth={LW.structure} />
      <Line points={pts(0, 0.45)} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
      <Line points={pts(0.45, 1)} stroke={V} lineWidth={LW.emphasis} lineCap="round" />
      {label ? <Small text="small in, big out" y={142} color={C.chalk} /> : null}
    </Node>
  );
};

// ------------------------------------------------------------------ microphone schematic: diaphragm, linkage, transducer
export const MicSchematic = ({x = 0, y = 0, s = 1, crack = 0, opacity = 1}: any) => (
  <Node x={x} y={y} scale={s} opacity={opacity}>
    <Node x={() => -val(crack) * 70} y={() => val(crack) * 20} rotation={() => -val(crack) * 8}>
      <Circle x={-230} width={60} height={260} stroke={C.chalk} lineWidth={LW.emphasis} />
      <Line points={[[-200, 0], [-40, 0]]} stroke={C.chalk} lineWidth={LW.structure} />
    </Node>
    <Node x={() => val(crack) * 70} y={() => -val(crack) * 20} rotation={() => val(crack) * 8}>
      <Line points={[[-40, 0], [0, 0]]} stroke={C.chalk} lineWidth={LW.structure} />
      <Rect x={110} width={220} height={170} radius={18} stroke={C.chalk} lineWidth={LW.structure} />
      {[-50, -20, 10, 40].map(d => <Circle x={110 + d} size={56} startAngle={-90} endAngle={90} stroke={C.chalk} lineWidth={LW.hairline} />)}
      <Line points={[[220, 40], [300, 40], [300, 120]]} stroke={C.chalk} lineWidth={LW.structure} radius={20} />
    </Node>
  </Node>
);

// ------------------------------------------------------------------ mouse outline (facing right)
export const Mouse = ({x = 0, y = 0, s = 1, stroke = C.chalk}: any) => (
  <Node x={x} y={y} scale={s}>
    <Spline closed points={[[-150, 40], [-120, -50], [-20, -80], [80, -60], [150, -10], [190, 20], [150, 40], [40, 60], [-80, 64]]}
      stroke={stroke} lineWidth={LW.structure} smoothness={0.45} />
    <Circle x={70} y={-82} size={64} stroke={stroke} lineWidth={LW.structure} fill={C.bg} />
    <Circle x={70} y={-82} size={30} stroke={stroke} lineWidth={LW.hairline} />
    <Circle x={140} y={-6} size={10} fill={stroke} />
    <Spline points={[[-150, 36], [-220, 20], [-260, 60], [-310, 40]]} stroke={stroke} lineWidth={LW.hairline + 1} smoothness={0.6} lineCap="round" />
    {[[-80, 64], [40, 62]].map(([fx, fy]) => <Line points={[[fx, fy], [fx + 10, fy + 26]]} stroke={stroke} lineWidth={LW.structure} lineCap="round" />)}
  </Node>
);

// ------------------------------------------------------------------ response chart: place along the membrane vs response
// dead: broad and low; living: tall and sharp. m (0..1) morphs living -> dead.
export const CH = {w: 1200, h: 520};
export const respDead = (u: number, at = 0.5) => 0.22 * Math.exp(-(((u - at) / 0.2) ** 2));
export const respLive = (u: number, at = 0.5, sharp = 1) => {
  const d = Math.abs(u - at);
  return 0.92 * Math.exp(-d / (0.035 / sharp)) * 0.85 + 0.92 * 0.15 * Math.exp(-((d / 0.12) ** 2)) + respDead(u, at) * 0.4;
};
export const chartPts = (fn: (u: number) => number, w = CH.w, h = CH.h, n = 160) => () =>
  Array.from({length: n + 1}, (_, i) => { const u = i / n; return [-w / 2 + w * u, h / 2 - h * clamp(fn(u), 0, 1.1)] as P; });
export const ChartAxes = ({w = CH.w, h = CH.h, xl = 'place along the membrane', yl = 'response'}: any) => (
  <Node>
    <Line points={[[-w / 2, -h / 2 - 20], [-w / 2, h / 2], [w / 2 + 20, h / 2]]} stroke={C.muted} lineWidth={LW.structure} />
    <Small text={yl} x={-w / 2 - 20} y={-h / 2 - 50} offset={[-1, 0]} />
    <Small text={xl} x={w / 2} y={h / 2 + 44} offset={[1, 0]} />
  </Node>
);

// ------------------------------------------------------------------ dB ladder
export const LADDER = {x: -520, top: -330, bottom: 330};
export const dbY = (db: number) => 330 - (db - 30) * 9.2; // 30 dB at the bottom, ~100 dB at the top
export const Ladder = ({x = LADDER.x, dim = 1}: any) => (
  <Node x={x} opacity={dim}>
    <Line points={[[0, dbY(30) + 20], [0, dbY(103)]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
    {[40, 50, 60, 70, 80, 90, 100].map(d => <Line points={[[-14, dbY(d)], [14, dbY(d)]]} stroke={C.muted} lineWidth={LW.hairline} />)}
    <Small text="quiet room" x={-36} y={dbY(38)} offset={[1, 0]} color={C.chalk} />
    <Small text="conversation" x={-36} y={dbY(60)} offset={[1, 0]} color={C.chalk} />
    <Small text="louder" x={-36} y={dbY(98)} offset={[1, 0]} color={C.chalk} />
    <Line points={[[-14, dbY(70)], [700, dbY(70)]]} stroke={C.muted} lineWidth={LW.hairline} lineDash={[12, 10]} />
    <Num text="70 dB" x={-36} y={dbY(70)} offset={[1, 0]} size={TY.small_label} color={C.muted} />
    <Small text="unlikely to harm" x={40} y={dbY(70) + 30} offset={[-1, 0]} />
  </Node>
);

// ------------------------------------------------------------------ placeholder-aware still image
// Archival images live in episodes/p2-ear/scenes/assets/<name>.png. If the file is not there yet,
// a labelled placeholder rectangle is drawn instead.
const ASSETS = import.meta.glob('../../../../../episodes/p2-ear/scenes/assets/*.png', {eager: true, query: '?url', import: 'default'}) as Record<string, string>;
export const assetUrl = (name: string) => {
  const key = Object.keys(ASSETS).find(k => k.endsWith('/' + name));
  return key ? ASSETS[key] : null;
};
export const Still = ({name, w = 900, h = 600, x = 0, y = 0, caption = '', ...rest}: any) => {
  const url = assetUrl(name);
  return (
    <Node x={x} y={y} {...rest}>
      {url ? <Img src={url} width={w} height={h} radius={6} /> : (
        <Node>
          <Rect width={w} height={h} radius={6} fill={C.panel} stroke={C.muted} lineWidth={LW.hairline} lineDash={[14, 10]} />
          <Line points={[[-w / 2, -h / 2], [w / 2, h / 2]]} stroke={C.grid} lineWidth={LW.hairline} />
          <Line points={[[-w / 2, h / 2], [w / 2, -h / 2]]} stroke={C.grid} lineWidth={LW.hairline} />
          <Rect width={Math.min(w - 60, 640)} height={130} radius={10} fill={C.panel} />
          <Small text={`ARCHIVAL: ${name}`} y={-22} color={C.chalk} />
          {caption ? <Small text={caption} y={26} /> : null}
        </Node>
      )}
    </Node>
  );
};
// drafting card: panel, registration marks at the corners
export const DraftCard = ({x = 0, y = 0, w = 1000, h = 680, children, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w} height={h} radius={14} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => (
      <Node x={sx * (w / 2 - 26)} y={sy * (h / 2 - 26)}>
        <Line points={[[-14, 0], [14, 0]]} stroke={C.muted} lineWidth={LW.hairline} />
        <Line points={[[0, -14], [0, 14]]} stroke={C.muted} lineWidth={LW.hairline} />
        <Circle size={14} stroke={C.muted} lineWidth={LW.hairline} />
      </Node>
    ))}
    {children}
  </Node>
);
export {V as VIOLET, L as LIME, clamp, fract};
