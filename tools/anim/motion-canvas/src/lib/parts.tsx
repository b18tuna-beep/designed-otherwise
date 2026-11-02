// Shared drawing parts for Designed Otherwise. Every color, size and weight
// comes from style/tokens.json; color meanings follow style/style-bible.md §3.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import tokens from '../../../../../style/tokens.json';
import {T as CLK, val} from './clock';

export const C = tokens.color;
export const LW = tokens.line_px_1080p;
export const T = tokens.type_px_1080p;
type P = [number, number];

// ------------------------------------------------------------------ type
export const Label = ({text, x = 0, y = 0, color = C.chalk, size = T.label, spacing = 4, ...rest}: any) => (
  <Txt text={text} x={x} y={y} fontFamily="Archivo" fontWeight={600} fontSize={size}
    letterSpacing={spacing} fill={color} {...rest} />
);
export const Small = ({text, x = 0, y = 0, color = C.muted, size = T.small_label, ...rest}: any) => (
  <Txt text={text} x={x} y={y} fontFamily="Archivo" fontWeight={500} fontSize={size} fill={color} {...rest} />
);
export const Num = ({text, x = 0, y = 0, color = C.chalk, size = T.number, ...rest}: any) => (
  <Txt text={text} x={x} y={y} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={size} fill={color} {...rest} />
);
export const Title = ({text, x = 0, y = 0, color = C.chalk, size = T.title, ...rest}: any) => (
  <Txt text={text} x={x} y={y} fontFamily="Archivo" fontWeight={600} fontSize={size} fill={color}
    textAlign="center" {...rest} />
);

// ------------------------------------------------------------------ arrows (heat is the only thing that flows)
export const HeatArrow = ({from, to, width = LW.flow, flow = true, ...rest}: {from: P; to: P; [k: string]: any}) => (
  <Line points={[from, to]} stroke={C.heat} lineWidth={width} endArrow arrowSize={width * 2.75}
    lineCap="round" lineDash={flow ? [width * 4, width * 2.2] : []} lineDashOffset={() => (flow ? -CLK() * 90 : 0)} {...rest} />
);
export const HeatArrows = ({from, to, n = 3, gap = 70, axis = 'y'}: {from: P; to: P; n?: number; gap?: number; axis?: 'x' | 'y'}) => (
  <Node>
    {Array.from({length: n}, (_, i) => {
      const o = (i - (n - 1) / 2) * gap;
      const d: P = axis === 'y' ? [0, o] : [o, 0];
      return <HeatArrow from={[from[0] + d[0], from[1] + d[1]]} to={[to[0] + d[0], to[1] + d[1]]} />;
    })}
  </Node>
);
// air movement (neutral): thin chalk lines with small arrowheads
export const AirLine = ({from, to, opacity = 0.7}: {from: P; to: P; opacity?: number}) => (
  <Line points={[from, to]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round"
    lineDash={[4, 22]} lineDashOffset={() => -CLK() * 60} opacity={opacity} />
);
// moisture: small chalk dots drifting (no arrowheads)
export const Moisture = ({points, opacity = 0.85}: {points: P[]; opacity?: number}) => (
  <Node opacity={opacity}>{points.map(([x, y]) => <Circle x={x} y={y} size={14} fill={C.chalk} />)}</Node>
);

// electricity: lime bolt
export const Bolt = ({x = 0, y = 0, s = 1}: any) => (
  <Line x={x} y={y} scale={s} closed fill={C.electric}
    points={[[8, -60], [-26, 6], [-2, 6], [-12, 60], [26, -8], [2, -8], [14, -60]]} />
);

// ------------------------------------------------------------------ fridge
export const FridgeFront = ({x = 0, y = 0, w = 380, h = 720, stroke = C.chalk, opacity = 1, interior = false}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w} height={h} radius={26} stroke={stroke} lineWidth={LW.structure}
      fill={interior ? C.panel : null} />
    <Line points={[[-w / 2, -h / 2 + h * 0.32], [w / 2, -h / 2 + h * 0.32]]} stroke={stroke} lineWidth={LW.structure} />
    <Line points={[[w / 2 - 40, -h / 2 + 50], [w / 2 - 40, -h / 2 + h * 0.32 - 40]]} stroke={stroke} lineWidth={LW.emphasis} lineCap="round" />
    <Line points={[[w / 2 - 40, -h / 2 + h * 0.32 + 40], [w / 2 - 40, -h / 2 + h * 0.6]]} stroke={stroke} lineWidth={LW.emphasis} lineCap="round" />
    <Rect y={h / 2 - 34} width={w - 60} height={30} radius={6} stroke={stroke} lineWidth={LW.hairline} />
  </Node>
);
// side section: back on the right, door on the left
export const FridgeSide = ({x = 0, y = 0, w = 300, h = 720, stroke = C.chalk, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w} height={h} radius={20} stroke={stroke} lineWidth={LW.structure} />
    <Line points={[[-w / 2, -h / 2 + h * 0.32], [w / 2, -h / 2 + h * 0.32]]} stroke={stroke} lineWidth={LW.hairline} />
    <Rect x={0} y={h / 2 - 60} width={w} height={120} stroke={stroke} lineWidth={LW.hairline} radius={[0, 0, 20, 20]} />
  </Node>
);

// heat shimmer: short wavy orange strokes rising off a surface
export const Shimmer = ({x = 0, y = 0, n = 3, h = 120, opacity = 0.8}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    {Array.from({length: n}, (_, i) => (
      <Line x={() => (i - (n - 1) / 2) * 34 + Math.sin(CLK() * 2.4 + i * 1.7) * 5}
        y={() => Math.sin(CLK() * 1.8 + i) * 8} opacity={() => 0.6 + 0.4 * Math.sin(CLK() * 3 + i)}
        stroke={C.heat} lineWidth={LW.structure} lineCap="round" smoothness={0.6}
        radius={30}
        points={[[0, h / 2], [12, h / 4], [-12, 0], [12, -h / 4], [0, -h / 2]]} />
    ))}
  </Node>
);

// ------------------------------------------------------------------ thermometer
export const Thermometer = ({x = 0, y = 0, h = 520, level = 0.5, color = C.heat, ...rest}: any) => (
  <Node x={x} y={y} {...rest}>
    <Rect width={54} height={h} radius={27} stroke={C.chalk} lineWidth={LW.structure} />
    <Rect width={26} height={() => (h - 40) * val(level)} radius={13} fill={color} y={() => (h - 40) / 2 - ((h - 40) * val(level)) / 2} />
    <Circle y={h / 2 + 30} size={90} fill={color} stroke={C.chalk} lineWidth={LW.structure} />
  </Node>
);

// ------------------------------------------------------------------ refrigerant loop
// Layout is fixed by the style bible: evaporator left, condenser right,
// compressor bottom, capillary (expansion) top.
export type Station = 'evaporator' | 'compressor' | 'condenser' | 'capillary';
export const LOOP = {w: 1100, h: 560};
export const STATION_POS: Record<Station, P> = {
  evaporator: [-LOOP.w / 2, 0],
  condenser: [LOOP.w / 2, 0],
  compressor: [0, LOOP.h / 2],
  capillary: [0, -LOOP.h / 2],
};

export const Coil = ({x = 0, y = 0, w = 170, h = 300, color = C.cold, fill = C.cold_soft, turns = 6}: any) => (
  <Node x={x} y={y}>
    <Rect width={w} height={h} radius={18} fill={fill} stroke={color} lineWidth={LW.structure} />
    {Array.from({length: turns}, (_, i) => {
      const yy = -h / 2 + (h / (turns + 1)) * (i + 1);
      return <Line points={[[-w / 2 + 22, yy], [w / 2 - 22, yy]]} stroke={color} lineWidth={LW.hairline} opacity={0.8} />;
    })}
  </Node>
);

export const Compressor = ({x = 0, y = 0, active = true}: any) => (
  <Node x={x} y={y}>
    <Rect width={200} height={150} radius={70} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
    <Line points={[[-50, 0], [50, 0]]} stroke={C.chalk} lineWidth={LW.hairline} opacity={0.6} />
    {active ? <Node><Line points={[[100, 0], [150, 0]]} stroke={C.electric} lineWidth={LW.structure} /><Bolt x={175} y={0} s={0.6} /></Node> : null}
  </Node>
);

export const Capillary = ({x = 0, y = 0, w = 300}: any) => {
  const pts: P[] = [];
  for (let i = 0; i <= 16; i++) pts.push([-w / 2 + (w / 16) * i, i % 2 ? -14 : 14]);
  return <Line x={x} y={y} points={pts} stroke={C.refrigerant} lineWidth={LW.hairline + 1} radius={6} />;
};

export const Particles = ({points, size = 22, opacity = 1}: {points: P[]; size?: number; opacity?: number}) => (
  <Node opacity={opacity}>{points.map(p => <Circle x={p[0]} y={p[1]} size={size} fill={C.refrigerant} />)}</Node>
);

export const LoopDiagram = ({x = 0, y = 0, scale = 1, lit = ['evaporator', 'compressor', 'condenser', 'capillary'] as Station[],
  labels = true, heatIn = false, heatOut = false, bolt = true, zones = false, zoneLabels = true, extraOut = false}: any) => {
  const on = (s: Station) => (lit.includes(s) ? 1 : 0.28);
  const [ex, ey] = STATION_POS.evaporator, [cx, cy] = STATION_POS.condenser;
  const [kx, ky] = STATION_POS.compressor, [px, py] = STATION_POS.capillary;
  return (
    <Node x={x} y={y} scale={scale}>
      {zones ? (
        <Node>
          <Rect x={(-LOOP.w / 2 - 280 + -190) / 2} width={LOOP.w / 2 + 280 - 190} height={LOOP.h + 260}
            fill={C.cold_soft} opacity={0.35} radius={30} />
          <Line points={[[-190, -LOOP.h / 2 - 130], [-190, LOOP.h / 2 + 130]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[18, 14]} opacity={0.6} />
          {zoneLabels ? <Small text="INSIDE THE FRIDGE" x={-LOOP.w / 2} y={LOOP.h / 2 + 100} color={C.cold} /> : null}
          {zoneLabels ? <Small text="KITCHEN" x={LOOP.w / 2} y={LOOP.h / 2 + 100} color={C.chalk} /> : null}
        </Node>
      ) : null}
      <Rect width={LOOP.w} height={LOOP.h} radius={70} stroke={C.refrigerant} lineWidth={LW.emphasis} />
      <Node opacity={on('evaporator')}><Coil x={ex} y={ey} color={C.cold} fill={C.cold_soft} /></Node>
      <Node opacity={on('condenser')}><Coil x={cx} y={cy} color={C.heat} fill={C.heat_soft} /></Node>
      <Node opacity={on('compressor')}><Compressor x={kx} y={ky} active={bolt} /></Node>
      <Node opacity={on('capillary')}>
        <Rect x={px} y={py} width={340} height={70} radius={35} fill={C.bg} />
        <Capillary x={px} y={py} />
      </Node>
      {labels ? (
        <Node>
          {zones
            ? <Label text="EVAPORATOR" x={ex} y={-LOOP.h / 2 - 50} color={C.cold} size={T.small_label} opacity={on('evaporator')} />
            : <Label text="EVAPORATOR" x={ex + 125} y={ey} color={C.cold} size={T.small_label} opacity={on('evaporator')} offset={[-1, 0]} />}
          <Label text="CONDENSER" x={cx - 125} y={cy} color={C.heat} size={T.small_label} opacity={on('condenser')} offset={[1, 0]} />
          <Label text="COMPRESSOR" x={kx} y={ky - 120} size={T.small_label} opacity={on('compressor')} />
          <Label text="CAPILLARY TUBE" x={px} y={py - 70} size={T.small_label} opacity={on('capillary')} />
        </Node>
      ) : null}
      {heatIn ? <HeatArrows from={[ex - 330, 0]} to={[ex - 110, 0]} n={3} gap={90} /> : null}
      {heatOut ? <HeatArrows from={[cx + 110, 0]} to={[cx + 330, 0]} n={extraOut ? 4 : 3} gap={extraOut ? 75 : 90} /> : null}
    </Node>
  );
};

// ------------------------------------------------------------------ bars
export const Bar = ({x = 0, base = 300, h = 200, w = 120, color = C.heat, label = '', value = '', valueColor = C.chalk}: any) => (
  <Node x={x}>
    <Rect y={base - h / 2} width={w} height={h} fill={color} radius={[8, 8, 0, 0]} />
    <Num text={value} y={base - h - 40} size={T.small_label + 4} fill={valueColor} />
    <Small text={label} y={base + 40} color={C.chalk} />
  </Node>
);

// card with a thin border used for quotes and rule statements
export const Card = ({x = 0, y = 0, w = 1200, h = 300, children}: any) => (
  <Node x={x} y={y}>
    <Rect width={w} height={h} radius={20} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
    {children}
  </Node>
);

// ------------------------------------------------------------------ hand (chalk outline, palm toward the viewer)
export const Hand = ({x = 0, y = 0, s = 1, rotation = 0}: any) => (
  <Node x={x} y={y} scale={s} rotation={rotation}>
    {[[-60, -120, 120], [-20, -140, 150], [20, -135, 140], [58, -110, 105]].map(([fx, fy, fh]) => (
      <Rect x={fx} y={fy} width={36} height={fh} radius={18} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure} />
    ))}
    <Rect x={-95} y={10} width={36} height={120} radius={18} rotation={-40} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure} />
    <Rect x={0} y={20} width={170} height={170} radius={[40, 40, 60, 60]} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure} />
    <Rect x={-8} y={10} width={150} height={150} radius={40} fill={C.bg} />
  </Node>
);

// ------------------------------------------------------------------ evaporator + defrost heater assembly
// The same silhouette in S04, S27, S28, S29 and the fridge cutaway.
// frost: 0 (clean) .. 1 (fins buried); heater: 'none' | 'outline' | 'on'
export const CoilAssembly = ({x = 0, y = 0, w = 420, h = 200, frost = 0, heater = 'outline', s = 1}: any) => {
  const fins = 14;
  return (
    <Node x={x} y={y} scale={s}>
      {[0, 1, 2].map(r => (
        <Line points={[[-w / 2 - 20, -h / 2 + 40 + r * ((h - 80) / 2)], [w / 2 + 20, -h / 2 + 40 + r * ((h - 80) / 2)]]}
          stroke={C.cold_deep} lineWidth={14} lineCap="round" />
      ))}
      {Array.from({length: fins}, (_, i) => {
        const fx = -w / 2 + (w / (fins - 1)) * i;
        return <Rect x={fx} width={6} height={h} radius={3} fill={C.cold_deep} />;
      })}
      {/* frost: separate chalk-white deposit on the fins and tubes; at high frost it bridges some gaps */}
      {frost > 0 ? Array.from({length: fins}, (_, i) => {
        const fx = -w / 2 + (w / (fins - 1)) * i;
        const gap = w / (fins - 1);
        const bridge = frost > 0.6 && i % 3 !== 2 ? gap * frost : 0;
        return (
          <Node>
            <Rect x={fx} width={6 + frost * gap * 0.7} height={h * (0.35 + 0.65 * frost)} y={h * (1 - (0.35 + 0.65 * frost)) / 2}
              radius={8} fill={C.chalk} stroke={C.cold} lineWidth={2} opacity={0.92} />
            {bridge ? <Rect x={fx + gap / 2} y={-h * 0.1} width={bridge} height={h * 0.45} radius={12} fill={C.chalk} stroke={C.cold} lineWidth={2} opacity={0.92} /> : null}
          </Node>
        );
      }) : null}
      {frost > 0 ? [0, 1, 2].map(r => (
        <Line points={[[-w / 2 - 20, -h / 2 + 40 + r * ((h - 80) / 2)], [w / 2 + 20, -h / 2 + 40 + r * ((h - 80) / 2)]]}
          stroke={C.chalk} lineWidth={6 + frost * 16} lineCap="round" opacity={0.7} />
      )) : null}
      {heater !== 'none' ? (
        <Line points={[[-w / 2 - 10, h / 2 + 40], [w / 2 + 10, h / 2 + 40], [w / 2 + 10, h / 2 + 70], [-w / 2 - 10, h / 2 + 70]]}
          stroke={heater === 'on' ? C.heat : C.muted} lineWidth={heater === 'on' ? 12 : 6} radius={14} lineCap="round"
          lineDash={heater === 'outline' ? [14, 12] : []}
          shadowColor={heater === 'on' ? C.heat : 'rgba(0,0,0,0)'} shadowBlur={heater === 'on' ? 30 : 0} />
      ) : null}
    </Node>
  );
};

// ------------------------------------------------------------------ fridge cutaway (front)
// freezer on top with the coil assembly on its back wall; fresh-food below;
// machine compartment at the bottom: compressor (left), condenser (right), drain pan.
export const FridgeCut = ({x = 0, y = 0, s = 1, frost = 0, heater = 'outline', contents = true, warmSides = false,
  doorEdges = false, condenserHot = true, dim = 1, milkCold = true, machineDim = 1}: any) => {
  const w = 480, h = 860;
  return (
    <Node x={x} y={y} scale={s} opacity={dim}>
      <Rect width={w} height={h} radius={28} fill={C.panel} stroke={doorEdges ? C.heat : C.chalk} lineWidth={doorEdges ? LW.flow : LW.structure}
        shadowColor={doorEdges ? C.heat : 'rgba(0,0,0,0)'} shadowBlur={doorEdges ? 30 : 0} />
      {warmSides ? (
        <Node opacity={warmSides === true ? 1 : warmSides}>
          <Rect x={-w / 2 - 6} width={10} height={h - 80} radius={5} fill={C.heat} opacity={0.9} />
          <Rect x={w / 2 + 6} width={10} height={h - 80} radius={5} fill={C.heat} opacity={0.9} />
        </Node>
      ) : null}
      {/* freezer */}
      <Rect y={-h / 2 + 140} width={w - 50} height={240} radius={14} fill={C.cold_soft} opacity={0.6} />
      <Node opacity={machineDim}><CoilAssembly y={-h / 2 + 115} w={260} h={110} frost={frost} heater={heater} /></Node>
      <Line points={[[-w / 2, -h / 2 + 270], [w / 2, -h / 2 + 270]]} stroke={C.chalk} lineWidth={LW.structure} />
      {/* fresh food */}
      <Rect y={40} width={w - 50} height={460} radius={14} fill={C.cold_soft} opacity={0.35} />
      {[-60, 110].map(yy => <Line points={[[-w / 2 + 30, yy], [w / 2 - 30, yy]]} stroke={C.chalk} lineWidth={LW.hairline} opacity={0.7} />)}
      {contents ? (
        <Node>
          <Node x={-110} y={30}>
            <Rect width={70} height={110} stroke={milkCold ? C.cold : C.chalk} lineWidth={LW.structure} radius={6} />
            <Line points={[[-35, -55], [0, -85], [35, -55]]} stroke={milkCold ? C.cold : C.chalk} lineWidth={LW.structure} />
          </Node>
          <Rect x={60} y={70} width={150} height={60} radius={12} stroke={C.cold} lineWidth={LW.structure} />
          <Rect x={10} y={210} width={120} height={70} radius={10} stroke={C.cold} lineWidth={LW.structure} />
        </Node>
      ) : null}
      {/* machine compartment */}
      <Line points={[[-w / 2, h / 2 - 130], [w / 2, h / 2 - 130]]} stroke={C.chalk} lineWidth={LW.structure} />
      <Node opacity={machineDim}>
      <Rect x={-120} y={h / 2 - 65} width={110} height={70} radius={30} fill={C.panel} stroke={C.chalk} lineWidth={LW.hairline + 1} />
      <Coil x={100} y={h / 2 - 72} w={160} h={50} turns={2} color={condenserHot ? C.heat : C.muted} fill={condenserHot ? C.heat_soft : C.panel} />
      <Rect x={100} y={h / 2 - 30} width={150} height={16} radius={[0, 0, 6, 6]} stroke={C.chalk} lineWidth={LW.hairline} />
      </Node>
    </Node>
  );
};

// ------------------------------------------------------------------ locator: tiny loop in a corner
export const MiniLoop = ({x = 700, y = -380, focus = null as Station | null, focus2 = null as Station | null}: any) => {
  const sc = 0.2;
  const ring = (st: Station | null) => st ? (
    <Circle x={STATION_POS[st][0] * sc} y={STATION_POS[st][1] * sc} size={90} stroke={C.chalk} lineWidth={LW.structure} />
  ) : null;
  return (
    <Node x={x} y={y}>
      <Rect width={LOOP.w * sc + 90} height={LOOP.h * sc + 90} radius={16} fill={C.panel} opacity={0.9} />
      <Rect width={LOOP.w * sc} height={LOOP.h * sc} radius={16} stroke={C.refrigerant} lineWidth={LW.structure} />
      <Rect x={STATION_POS.evaporator[0] * sc} width={30} height={56} radius={6} fill={C.cold_soft} stroke={C.cold} lineWidth={2} />
      <Rect x={STATION_POS.condenser[0] * sc} width={30} height={56} radius={6} fill={C.heat_soft} stroke={C.heat} lineWidth={2} />
      <Rect y={STATION_POS.compressor[1] * sc} width={40} height={28} radius={12} fill={C.panel} stroke={C.chalk} lineWidth={2} />
      {ring(focus)}{ring(focus2)}
    </Node>
  );
};

// ------------------------------------------------------------------ gauge (needle 0..1 = low..high)
export const Gauge = ({x = 0, y = 0, v = 0.5, label = 'pressure', size = 200}: any) => {
  const a = () => Math.PI * (1 - val(v)) + Math.sin(CLK() * 9) * 0.015;
  return (
    <Node x={x} y={y}>
      <Circle size={size} stroke={C.chalk} lineWidth={LW.structure} startAngle={180} endAngle={360} />
      <Line points={[[-size / 2, 0], [size / 2, 0]]} stroke={C.chalk} lineWidth={LW.hairline} />
      <Line points={() => [[0, 0], [Math.cos(a()) * size * 0.4, -Math.sin(a()) * size * 0.4]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
      <Small text={label} y={45} />
    </Node>
  );
};

// ------------------------------------------------------------------ refrigerant flow around the fixed loop
// Direction is fixed: up the condenser (right), right-to-left along the top (capillary),
// down the evaporator (left), left-to-right along the bottom (compressor).
export const loopPoint = (u: number, w = LOOP.w, h = LOOP.h): P => {
  const per = 2 * (w + h);
  let d = (((1 - u) % 1) + 1) % 1 * per; // reversed parameterisation = flow direction
  if (d < w) return [-w / 2 + d, -h / 2];
  d -= w; if (d < h) return [w / 2, -h / 2 + d];
  d -= h; if (d < w) return [w / 2 - d, h / 2];
  d -= w; return [-w / 2, h / 2 - d];
};
export const LoopFlow = ({n = 14, size = 18, period = 9, scale = 1, opacity = 1}: any) => (
  <Node scale={scale} opacity={opacity}>
    {Array.from({length: n}, (_, i) => (
      <Circle size={size} fill={C.refrigerant}
        position={() => loopPoint((CLK() / period + i / n) % 1)} />
    ))}
  </Node>
);
// particles drifting along a straight pipe section (x from a to b), wrapping
export const PipeFlow = ({a = -400, b = 400, y = 0, n = 6, size = 18, period = 4, jitter = 0}: any) => (
  <Node>
    {Array.from({length: n}, (_, i) => (
      <Circle size={size} fill={C.refrigerant}
        x={() => a + (((CLK() / period + i / n) % 1) * (b - a))}
        y={() => y + (jitter ? Math.sin(CLK() * 3 + i * 2) * jitter : 0)} />
    ))}
  </Node>
);
// bubbles rising inside a liquid band (x range, from y0 up to y1), wrapping
export const Bubbles = ({xs = [-100, 0, 100], y0 = 30, y1 = -30, size = 22, period = 1.6}: any) => (
  <Node>
    {xs.map((x: number, i: number) => (
      <Circle x={() => x + Math.sin(CLK() * 4 + i) * 4} y={() => y0 + (((CLK() / period + i * 0.37) % 1) * (y1 - y0))}
        size={size} fill={C.refrigerant_soft} stroke={C.refrigerant} lineWidth={3}
        opacity={() => 1 - (((CLK() / period + i * 0.37) % 1)) * 0.6} />
    ))}
  </Node>
);

// ------------------------------------------------------------------ open door for the front-view cutaway
// A door swung open on the right-hand hinge, drawn as a narrow trapezoid; heat arrows enter through
// the opening between the door edge and the cabinet front, never through a side wall.
export const OpenDoor = ({x = 0, y = 0, s = 1, side = 'left'}: any) => {
  const k = side === 'left' ? -1 : 1;
  return (
    <Node x={x} y={y}>
      <Node scale={s}>
        <Line closed points={[[240 * k, -430], [380 * k, -330], [380 * k, 330], [240 * k, 430]]} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
        <Line points={[[350 * k, -250], [350 * k, -60]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
      </Node>
      {/* above the cabinet over the swung door, clear of the hinge corner */}
      <Small text="door open" x={310 * s * k} y={-430 * s - 50} color={C.chalk} />
    </Node>
  );
};
