// Drawing parts for P3 (how trees lift water). Colours, type and line weights come from style/tokens.json via parts.tsx.
// P3 colour meanings (episodes/p3-trees/board/scenes_src.py):
//   chalk  = structure (wood, pipes, leaves, the tree, the building) and water (translucent chalk fill, never blue)
//   violet = the pull: tension in the water column, the menisci that pull, the "rope"
//   muted  = failed attempts, air-filled (embolised) pipes, dead leaves
//   orange = heat only (the sun driving evaporation, S33); nowhere else
// No arrowheads anywhere (arrowheads mean heat): direction by motion, dashes and travelling dots.
import {Circle, Img, Line, Node, Rect, Spline, Txt} from '@motion-canvas/2d';
import {C, LW, T as TY} from './parts';
import {T as CLK, val} from './clock';

type P = [number, number];
export const V = C.refrigerant; // violet: the pull
export const VS = C.refrigerant_soft;
export const M = C.muted;
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const fract = (v: number) => ((v % 1) + 1) % 1;
export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
export const WATER = rgba(C.chalk, 0.26); // water: translucent chalk
export const AIRF = rgba(C.muted, 0.1); // air-filled pipe: dark, with muted bubbles
export const PANEL = rgba(C.bg, 0.86); // backing panel for text over busy imagery

// deterministic scatter (stipple, minerals)
export const scatter = (n: number, x0: number, x1: number, y0: number, y1: number, seed = 1): P[] => {
  let s = (Math.abs(Math.round(seed)) % 1000) * 9301 + 49297;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return Array.from({length: n}, () => [x0 + (x1 - x0) * r(), y0 + (y1 - y0) * r()] as P);
};

// ------------------------------------------------------------------ text on a dark backing panel (auto-sized)
// anchor: offset of the panel, e.g. [-1, 0] = left edge at x
export const Backed = ({text, x = 0, y = 0, anchor = [-1, 0], font = 'small', color = C.chalk, opacity = 1, size}: any) => {
  const f = font === 'label' ? {fontFamily: 'Archivo', fontWeight: 600, fontSize: size ?? TY.label, letterSpacing: 1}
    : font === 'num' ? {fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: size ?? TY.number}
    : {fontFamily: 'Archivo', fontWeight: 500, fontSize: size ?? TY.small_label};
  return (
    <Rect layout x={x} y={y} offset={anchor} padding={[12, 22, 12, 22]} radius={10} fill={PANEL} opacity={opacity}>
      <Txt text={text} fill={color} {...f} />
    </Rect>
  );
};

// ------------------------------------------------------------------ scale view: metres to pixels (shared by S01, S12, S17, S22, S23, S40)
export const PXM = 6.4; // px per metre: 116 m = 742 px
export const GROUND = 380;
export const mY = (m: number) => GROUND - m * PXM;
export const H116 = 116 * PXM;

// coast redwood silhouette, base at (0, 0), top at (0, -h): narrow trunk, tall ragged spire of a crown
const CROWN: P[] = [[0, -1], [0.025, -0.95], [0.05, -0.89], [0.035, -0.86], [0.075, -0.79], [0.055, -0.75], [0.095, -0.67], [0.07, -0.63],
  [0.11, -0.55], [0.08, -0.5], [0.1, -0.44], [0.06, -0.4], [0.07, -0.36], [0.02, -0.34], [-0.02, -0.34], [-0.08, -0.37], [-0.06, -0.42],
  [-0.105, -0.47], [-0.08, -0.53], [-0.1, -0.6], [-0.065, -0.65], [-0.085, -0.71], [-0.05, -0.77], [-0.06, -0.82], [-0.03, -0.88], [-0.02, -0.94]];
export const Redwood = ({x = 0, y = 0, h = H116, stroke = C.chalk, opacity = 1, lw = LW.structure, crownFill = C.bg, ...rest}: any) => (
  <Node x={x} y={y} opacity={opacity} {...rest}>
    <Line closed points={[[-0.04 * h, 0], [-0.022 * h, -0.03 * h], [-0.012 * h, -0.36 * h], [0.012 * h, -0.36 * h], [0.022 * h, -0.03 * h], [0.04 * h, 0]]}
      stroke={stroke} lineWidth={lw} fill={C.bg} lineJoin="round" />
    <Spline closed smoothness={0.35} points={CROWN.map(([u, v]) => [u * h, v * h] as P)} stroke={stroke} lineWidth={lw} fill={crownFill} />
  </Node>
);
// trunk half-width at height fraction f (0 = base)
export const trunkHalf = (f: number, h = H116) => (f < 0.03 ? 0.04 - (0.018 * f) / 0.03 : 0.022 - (0.01 * (f - 0.03)) / 0.33) * h;

// the violet "rope": a thread from the roots to the crown, drawn on with `p` (0..1)
export const Thread = ({x = 0, y = 0, h = H116, p = 1, glow = 1, width = LW.emphasis}: any) => (
  <Line x={x} y={y} points={[[0, -4], [0, -0.97 * h]]} stroke={V} lineWidth={width} lineCap="round" end={p}
    shadowColor={V} shadowBlur={() => 14 * val(glow)} />
);

// 30-storey building silhouette, base at (0, 0); `floors` lines drawn every storey
export const Building = ({x = 0, y = 0, w = 200, h = 30 * 3.3 * PXM, storeys = 30, stroke = C.chalk, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect y={-h / 2} width={w} height={h} stroke={stroke} lineWidth={LW.structure} fill={C.bg} />
    {Array.from({length: storeys - 1}, (_, i) => (
      <Line points={[[-w / 2 + 12, -(h / storeys) * (i + 1)], [w / 2 - 12, -(h / storeys) * (i + 1)]]} stroke={stroke} lineWidth={LW.hairline} opacity={0.45} />
    ))}
    <Rect y={-h - 10} width={w * 0.4} height={20} stroke={stroke} lineWidth={LW.hairline} />
  </Node>
);

// dashed "10 m" line: the suction ceiling. Plain line, no arrowheads.
export const TenLine = ({x0 = -600, x1 = 600, y = mY(10), p = 1, label = '10 m', labelX, color = C.chalk, opacity = 1}: any) => (
  <Node opacity={opacity}>
    <Line points={[[x0, y], [x1, y]]} stroke={color} lineWidth={LW.structure} lineDash={[18, 12]} end={p} />
    {label ? <Txt text={label} x={labelX ?? x1 + 20} y={y} offset={[-1, 0]} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={TY.small_label}
      fill={color} opacity={() => clamp(val(p) * 2 - 1)} /> : null}
  </Node>
);

// vertical dimension bracket (plain line with end ticks)
export const VBracket = ({x = 0, y0 = 0, y1 = -100, opacity = 1, color = C.chalk, tick = 18}: any) => (
  <Node opacity={opacity}>
    <Line points={[[x, y0], [x, y1]]} stroke={color} lineWidth={LW.hairline + 1} />
    <Line points={[[x - tick, y0], [x + tick, y0]]} stroke={color} lineWidth={LW.hairline + 1} />
    <Line points={[[x - tick, y1], [x + tick, y1]]} stroke={color} lineWidth={LW.hairline + 1} />
  </Node>
);

// ground line for the scale view
export const Ground = ({x0 = -700, x1 = 700, y = GROUND}: any) => (
  <Line points={[[x0, y], [x1, y]]} stroke={C.muted} lineWidth={LW.structure} lineCap="round" />
);

// ------------------------------------------------------------------ pipe (tracheid) seen from the side
// fill: water level 0..1 from the bottom; air: 0..1 grey (embolised); pull: 0..1 violet tension thread
export const Pipe = ({x = 0, y = 0, w = 100, h = 600, fill = 1, air = 0, pull = 0, pits = true, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect y={() => h / 2 - (h * val(fill)) / 2} width={w - 8} height={() => h * val(fill)} fill={WATER} opacity={() => 1 - val(air)} radius={(w - 8) / 2.2} />
    <Node opacity={air}>
      <Rect width={w - 8} height={h} fill={AIRF} radius={(w - 8) / 2.2} />
      {scatter(9, -w / 2 + 18, w / 2 - 18, -h / 2 + 30, h / 2 - 30, Math.round(x) + 7).map(([bx, by]) => (
        <Circle x={bx} y={by} size={14} stroke={M} lineWidth={LW.hairline} />
      ))}
    </Node>
    <Line points={[[0, h / 2 - 10], [0, -h / 2 + 10]]} stroke={V} lineWidth={() => LW.structure + 3 * val(pull)} lineCap="round"
      opacity={() => val(pull) * (1 - val(air))} shadowColor={V} shadowBlur={12} />
    <Rect width={w} height={h} radius={w / 2.2} stroke={() => (val(air) > 0.5 ? M : C.chalk)} lineWidth={LW.structure} lineDash={() => (val(air) > 0.5 ? [14, 10] : [])} />
    {pits ? [-0.3, 0, 0.3].flatMap(f => [-1, 1].map(s => (
      <Circle x={(s * w) / 2} y={f * h} width={10} height={26} stroke={C.chalk} lineWidth={LW.hairline} fill={C.bg} />
    ))) : null}
  </Node>
);

// ------------------------------------------------------------------ pressure dial: 0 at the top, positive to the right,
// negative to the left; the negative quarter can light violet (the pull)
export const Dial = ({x = 0, y = 0, r = 220, v = 0, neg = 0, zero = true, label = ''}: any) => {
  const a = () => (clamp(val(v), -1, 1) * Math.PI) / 2 + Math.sin(CLK() * 9) * 0.006;
  return (
    <Node x={x} y={y}>
      <Circle size={2 * r} stroke={C.chalk} lineWidth={LW.structure} startAngle={180} endAngle={360} />
      <Line points={[[-r, 0], [r, 0]]} stroke={C.chalk} lineWidth={LW.hairline} />
      <Circle size={2 * r - 40} stroke={M} lineWidth={14} startAngle={180} endAngle={270} opacity={() => 0.5 * (1 - val(neg))} />
      <Circle size={2 * r - 40} stroke={V} lineWidth={14} startAngle={180} endAngle={270} opacity={neg} shadowColor={V} shadowBlur={16} />
      {[-1, -0.5, 0, 0.5, 1].map(t => {
        const b = (t * Math.PI) / 2;
        return <Line points={[[Math.sin(b) * (r - 6), -Math.cos(b) * (r - 6)], [Math.sin(b) * (r - 34), -Math.cos(b) * (r - 34)]]}
          stroke={C.chalk} lineWidth={t === 0 ? LW.structure : LW.hairline} />;
      })}
      {zero ? <Txt text="0" y={-r - 44} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={TY.number} fill={C.chalk} /> : null}
      <Line points={() => [[0, 0], [Math.sin(a()) * r * 0.82, -Math.cos(a()) * r * 0.82]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
      <Circle size={30} fill={C.chalk} />
      {label ? <Txt text={label} y={52} fontFamily="Archivo" fontWeight={500} fontSize={TY.small_label} fill={M} /> : null}
    </Node>
  );
};

// ------------------------------------------------------------------ leaf cross-section (simple, for S33): cuticle, palisade, spongy cells, stoma below
export const LeafSection = ({x = 0, y = 0, w = 1000, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w} height={240} radius={30} stroke={C.chalk} lineWidth={LW.structure} />
    {Array.from({length: 14}, (_, i) => (
      <Rect x={-w / 2 + 50 + i * ((w - 100) / 13)} y={-48} width={46} height={100} radius={20} stroke={C.chalk} lineWidth={LW.hairline + 1} />
    ))}
    {scatter(11, -w / 2 + 60, w / 2 - 60, 40, 80, 7).map(([cx, cy], i) => (
      <Circle x={cx} y={cy} width={70 + (i % 3) * 10} height={44} stroke={C.chalk} lineWidth={LW.hairline + 1} />
    ))}
    {/* stoma: two guard cells on the underside */}
    <Circle x={-22} y={120} width={40} height={26} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
    <Circle x={22} y={120} width={40} height={26} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
  </Node>
);

// teardrop (water)
export const Drop = ({x = 0, y = 0, r = 18, stroke = C.chalk, fill = WATER, ...rest}: any) => (
  <Spline x={x} y={y} closed smoothness={0.4} stroke={stroke} lineWidth={LW.hairline + 1} fill={fill}
    points={[[0, -1.8], [0.5, -0.7], [0.95, 0.2], [0.65, 0.82], [0, 1], [-0.65, 0.82], [-0.95, 0.2], [-0.5, -0.7]].map(([a, b]) => [a * r, b * r] as P)} {...rest} />
);

// chalk sun outline (orange only where the sun is shown as heat: pass stroke)
export const Sun = ({x = 0, y = 0, r = 60, stroke = C.chalk, opacity = 1, glow = 0}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Circle size={2 * r} stroke={stroke} lineWidth={LW.structure} shadowColor={stroke} shadowBlur={glow} />
    {Array.from({length: 10}, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return <Line points={[[Math.cos(a) * (r + 18), Math.sin(a) * (r + 18)], [Math.cos(a) * (r + 44), Math.sin(a) * (r + 44)]]}
        stroke={stroke} lineWidth={LW.structure} lineCap="round" />;
    })}
  </Node>
);
export const Moon = ({x = 0, y = 0, r = 50, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Spline closed smoothness={0.55} stroke={C.chalk} lineWidth={LW.structure}
      points={[[0, -r], [-r * 0.85, -r * 0.4], [-r * 0.85, r * 0.4], [0, r], [-r * 0.35, r * 0.4], [-r * 0.35, -r * 0.4]]} />
  </Node>
);

// ------------------------------------------------------------------ attempt tag (top-left), with a muted "failed" stamp
export const AttemptTag = ({n = 1, name = '', stamp = 0, x = -864, y = -444, w = 680}: any) => (
  <Node>
    <Rect x={x} y={y} offset={[-1, -1]} width={w} height={86} radius={12} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
    <Txt text={`Attempt ${n}: ${name}`} x={x + 28} y={y + 43} offset={[-1, 0]} fontFamily="Archivo" fontWeight={600} fontSize={TY.label}
      letterSpacing={1} fill={C.chalk} />
    <Stamp x={x + w + 110} y={y + 43} on={stamp} />
  </Node>
);
export const Stamp = ({x = 0, y = 0, on = 1, s = 1}: any) => (
  <Node x={x} y={y} rotation={-8} opacity={on} scale={() => s * (1.25 - 0.25 * clamp(val(on)))}>
    <Rect width={180} height={70} radius={8} stroke={M} lineWidth={LW.structure} />
    <Txt text="failed" fontFamily="Archivo" fontWeight={600} fontSize={TY.label} letterSpacing={2} fill={M} />
  </Node>
);

// ------------------------------------------------------------------ corner locator: a small chalk redwood with the current zoom boxed
export const LOC = {x: 745, y: -290, w: 200, h: 290};
const LB = 105, LH = 225; // locator tree base and height (local)
export const LOC_FOCUS: Record<string, [number, number, number, number]> = {
  whole: [0, -8, 170, 256],
  crown: [0, -88, 70, 72],
  leaf: [18, -42, 34, 34],
  trunk: [0, 68, 40, 82],
  wood: [0, 72, 26, 26],
  pipe: [0, 74, 16, 16],
  roots: [0, 112, 96, 30],
};
export const Locator = ({focus = 'whole', x = LOC.x, y = LOC.y, opacity = 1}: any) => {
  const [fx, fy, fw, fh] = LOC_FOCUS[focus] ?? LOC_FOCUS.whole;
  return (
    <Node x={x} y={y} opacity={opacity}>
      <Rect width={LOC.w} height={LOC.h} radius={16} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
      <Redwood y={LB} h={LH} lw={LW.hairline + 1} crownFill={C.panel} />
      {[[-26, 12], [-8, 16], [10, 15], [28, 11]].map(([dx, dy]) => (
        <Line points={[[dx * 0.3, LB], [dx, LB + dy]]} stroke={C.chalk} lineWidth={LW.hairline} lineCap="round" />
      ))}
      <Rect x={fx} y={fy} width={fw} height={fh} radius={4} stroke={C.chalk} lineWidth={focus === 'pipe' || focus === 'wood' ? 3 : LW.structure} />
    </Node>
  );
};

// ------------------------------------------------------------------ placeholder-aware still image (episodes/p3-trees/scenes/assets/<name>.png)
const ASSETS = import.meta.glob('../../../../../episodes/p3-trees/scenes/assets/*.png', {eager: true, query: '?url', import: 'default'}) as Record<string, string>;
export const assetUrl = (name: string) => {
  const key = Object.keys(ASSETS).find(k => k.endsWith('/' + name));
  return key ? ASSETS[key] : null;
};
// w/h must keep the file's aspect ratio (magdeburg and maple 16:9, sequoia 3:4)
export const Still = ({name, w = 900, h = 600, x = 0, y = 0, caption = '', ...rest}: any) => {
  const url = assetUrl(name);
  return (
    <Node x={x} y={y} {...rest}>
      {url ? <Img src={url} width={w} height={h} /> : (
        <Node>
          <Rect width={w} height={h} radius={6} fill={C.panel} stroke={M} lineWidth={LW.hairline} lineDash={[14, 10]} />
          <Line points={[[-w / 2, -h / 2], [w / 2, h / 2]]} stroke={C.grid} lineWidth={LW.hairline} />
          <Line points={[[-w / 2, h / 2], [w / 2, -h / 2]]} stroke={C.grid} lineWidth={LW.hairline} />
          <Rect width={Math.min(w - 60, 640)} height={130} radius={10} fill={C.panel} />
          <Txt text={`ARCHIVAL: ${name}`} y={-22} fontFamily="Archivo" fontWeight={500} fontSize={TY.small_label} fill={C.chalk} />
          {caption ? <Txt text={caption} y={26} fontFamily="Archivo" fontWeight={500} fontSize={TY.small_label} fill={M} /> : null}
        </Node>
      )}
    </Node>
  );
};
