// Drawing parts for P4 (the pin tumbler lock). Colours, type and line weights come from style/tokens.json via parts.tsx.
// P4 colour meanings (episodes/p4-lock/board/scenes_src.py):
//   chalk  = structure (shell, plug, key, doors, buildings, frames)
//   violet = the working part: the pins and the shear line; a gap that lands on the line glows violet
//   muted  = blocked, failed, wrong, "not a pin lock"
//   orange (heat) and lime (electricity) are NOT used. No arrowheads: direction by motion, dashes and travelling dots.
import {Circle, Img, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {C, LW, T as TY} from './parts';
import {val} from './clock';
import {clamp, M, rgba, V, VS, PANEL, Backed} from './trees';
export {clamp, M, rgba, V, VS, PANEL, Backed};

type P = [number, number];
export const VL = '#D9C6FF'; // lighter violet for the master pin (a tint of the refrigerant token toward chalk)
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ------------------------------------------------------------------ cylinder section geometry (local px, y down, shear line at y = 0)
export const SX = [-280, -140, 0, 140, 280]; // stack x positions
export const BIT = [3, 6, 2, 5, 4]; // the example bitting
export const Lof = (b: number) => 70 + 22 * b; // key pin length (= key surface depth) for a bitting value
export const REST = 52; // how far springs push the stacks down with no key
export const HOLE_TOP = -262;
export const HW = 54; // hole width
const KEYWAY = {y0: 56, y1: 296};
const BLADE_TOP = 62, BLADE_BOT = 290;
const KEY_LEN = 980;
export const KEY_SHOULDER = -540; // key shoulder x when fully inserted

// ------------------------------------------------------------------ key
// blade outline (closed polygon) in key-local coordinates: shoulder at x = 0, cuts at SX[i] + 280 + 260 - 280 ...
export const KX = (i: number) => 260 + 140 * i;
export const bladePoints = (bit: any[] = BIT): P[] => {
  const pts: P[] = [[0, BLADE_TOP]];
  bit.forEach((bv, i) => {
    const b = val(bv);
    const x = KX(i), y = Lof(b);
    pts.push([x - 58, BLADE_TOP], [x - 24, y], [x + 24, y], [x + 58, BLADE_TOP]);
  });
  pts.push([KEY_LEN - 50, BLADE_TOP], [KEY_LEN, 150], [KEY_LEN, BLADE_BOT], [0, BLADE_BOT]);
  return pts;
};
export const KEYR = 130; // round bow radius
// Key: p draws it on (0..1); bow 'square' | 'round'; dashed = unseen key; dots = violet dots on the cuts (0..1)
export const Key = ({x = 0, y = 0, s = 1, rotation = 0, bit = BIT, p = 1, bow = 'square', color = C.chalk, dashed = false, dots = 0,
  fillOp = 1, opacity = 1}: any) => {
  const dash = dashed ? [16, 12] : [];
  const e = () => clamp(val(p));
  return (
    <Node x={x} y={y} scale={s} rotation={rotation} opacity={opacity}>
      <Node opacity={() => fillOp * clamp((val(p) - 0.6) / 0.4)}>
        {bow === 'square'
          ? <Rect x={-170} y={170} width={300} height={250} radius={34} fill={C.panel} />
          : <Circle x={-140} y={172} size={KEYR * 2} fill={C.panel} />}
        <Line closed points={() => bladePoints(bit)} fill={C.panel} />
      </Node>
      {bow === 'square'
        ? <Rect x={-170} y={170} width={300} height={250} radius={34} stroke={color} lineWidth={LW.structure} lineDash={dash} end={e} />
        : <Circle x={-140} y={172} size={KEYR * 2} stroke={color} lineWidth={LW.structure} lineDash={dash} end={e} />}
      {bow === 'square'
        ? <Circle x={-200} y={170} size={64} stroke={color} lineWidth={LW.structure} lineDash={dash} opacity={() => clamp((val(p) - 0.4) * 3)} />
        : <Circle x={-140} y={172} size={64} stroke={color} lineWidth={LW.structure} lineDash={dash} opacity={() => clamp((val(p) - 0.4) * 3)} />}
      <Line closed points={() => bladePoints(bit)} stroke={color} lineWidth={LW.structure} lineJoin="round" lineDash={dash} end={e} />
      {/* violet dots on the five cuts */}
      {bit.map((b, i) => (
        <Circle x={KX(i)} y={() => Lof(val(b))} size={() => 38 * clamp(val(dots) * 1.4 - i * 0.14 - 0.0)} fill={V} shadowColor={V} shadowBlur={14} />
      ))}
    </Node>
  );
};

// ------------------------------------------------------------------ one pin stack (local to the stack column; group sits at y = sh)
// kp/dr/sp: presence 0..1 (drop in); sh: px below the shear line (0 = gap on the line)
export const Stack = ({i, sh, kp = 1, dr = 1, sp = 1, master = 0, lk = Lof(BIT[i]), op = 1, tint = V}: any) => {
  const shv = () => val(sh);
  const spring = () => {
    const top = HOLE_TOP + 6 - shv(), bot = -104 - 6;
    const n = 8, pts: P[] = [];
    for (let k = 0; k <= n; k++) pts.push([k === 0 || k === n ? 0 : (k % 2 ? 17 : -17), lerp(top, bot, k / n)]);
    return pts;
  };
  return (
    <Node x={SX[i]} y={sh} opacity={op}>
      {/* spring */}
      <Line points={spring} stroke={M} lineWidth={LW.structure} lineJoin="round" lineCap="round"
        opacity={sp} y={() => -(1 - clamp(val(sp))) * 50} />
      {/* driver pin */}
      <Node opacity={dr} y={() => -(1 - clamp(val(dr))) * 90}>
        <Rect y={-52} width={42} height={96} radius={4} fill={rgba(tint, 0.42)} stroke={tint} lineWidth={LW.structure} />
      </Node>
      {/* master pin: a thin disc between key pin and driver; the stack above it moves up by its thickness */}
      <Node opacity={master}>
        <Rect y={10} width={42} height={22} radius={3} fill={rgba(VL, 0.85)} stroke={VL} lineWidth={LW.structure} />
      </Node>
      {/* key pin */}
      <Node opacity={kp} y={() => -(1 - clamp(val(kp))) * 110}>
        <Line closed points={() => [[-21, 3 + 22 * val(master)], [21, 3 + 22 * val(master)], [21, lk - 30], [0, lk], [-21, lk - 30]]} fill={rgba(tint, 0.2)} stroke={tint}
          lineWidth={LW.structure} lineJoin="round" />
      </Node>
    </Node>
  );
};

// ------------------------------------------------------------------ the cylinder section
// ins: key insertion 0..1 (0 = key out, pins pinned); extra: per-stack px offsets added to the stack (wrong cuts: + short, - overshoot);
// sh: optional explicit per-stack signals overriding ins. outline/holes/shear/flash: draw-on signals.
export const tipX = (ins: number) => -700 + 1140 * ins;
export const uOf = (ins: number, i: number) => smooth(clamp((tipX(ins) - (SX[i] - 70)) / 90));
export const Cyl = ({x = 0, y = 0, s = 1, rotation = 0, ins = 0, bit = BIT, pbit = BIT, key = 0, bow = 'square', keyColor = C.chalk, extra = [0, 0, 0, 0, 0],
  sh = null as any, outline = 1, holes = 5, kp = [1, 1, 1, 1, 1], dr = [1, 1, 1, 1, 1], sp = [1, 1, 1, 1, 1], master = [0, 0, 0, 0, 0],
  bars = 0, barsAlways = false, shear = 0, flash = 0, dim = [1, 1, 1, 1, 1], hdim = [1, 1, 1, 1, 1], bolt = 0, turn = 0, jolt = 0,
  plugOn = 0, shellOn = 0, ticks = 0, opacity = 1, children = null as any}: any) => {
  const shOf = (i: number) => (sh ? sh[i] : () => (1 - uOf(val(ins), i)) * REST + val(extra[i]));
  const edge = {stroke: C.chalk, lineWidth: LW.structure, lineJoin: 'round' as const};
  const keyX = () => KEY_SHOULDER - (1 - val(ins)) * 1140; // shoulder x
  const jx = () => Math.sin(val(jolt) * 9) * 7 * (1 - clamp(val(jolt)));
  return (
    <Node x={x} y={y} scale={s} rotation={rotation} opacity={opacity}>
      {/* fills first so edges draw over them */}
      <Node opacity={() => clamp(val(outline) * 1.6 - 0.6)}>
        <Rect x={40} y={-145} width={960} height={290} fill={() => rgba(C.chalk, 0.035 + 0.12 * val(shellOn))} />
        <Rect x={40} y={363} width={960} height={66} fill={() => rgba(C.chalk, 0.035 + 0.12 * val(shellOn))} />
        <Node x={jx}>
          <Rect x={-20} y={165} width={1080} height={330} fill={() => rgba(C.chalk, 0.025 + 0.14 * val(plugOn))} />
        </Node>
      </Node>
      {/* shell: top block and bottom strip */}
      <Line points={[[-440, 0], [-440, -290], [520, -290], [520, 0]]} {...edge} end={outline} />
      <Line points={[[-440, 330], [-440, 396], [520, 396], [520, 330]]} {...edge} end={outline} />
      {/* plug: its face sticks out of the shell on the left, a tail carries on to the cam on the right */}
      <Node x={jx}>
        <Line points={[[-560, 0], [-560, 330], [520, 330], [520, 0], [-560, 0]]} {...edge} end={outline} />
        <Line points={[[520, 120], [620, 120]]} {...edge} end={outline} />
        <Line points={[[520, 210], [620, 210]]} {...edge} end={outline} />
        {/* keyway slot */}
        <Rect x={-30} y={176} width={1060} height={KEYWAY.y1 - KEYWAY.y0} fill={C.bg} stroke={C.chalk} lineWidth={LW.hairline}
          opacity={() => clamp(val(outline) * 2 - 1)} />
      </Node>
      {/* holes drill down through shell and plug */}
      {SX.map((hx, i) => (
        <Rect x={hx} y={() => HOLE_TOP + (324 * clamp(val(holes) - i)) / 2} width={HW} height={() => 324 * clamp(val(holes) - i)}
          fill={C.bg} stroke={C.chalk} lineWidth={LW.hairline + 1} opacity={() => val(hdim[i])} />
      ))}
      {/* the key lies in the keyway, under the pins */}
      <Node opacity={key}>
        <Key x={keyX} y={0} bit={bit} bow={bow} color={keyColor} />
      </Node>
      {/* stacks */}
      {SX.map((_, i) => (
        <Stack i={i} sh={shOf(i)} kp={kp[i]} dr={dr[i]} sp={sp[i]} master={master[i]} lk={Lof(pbit[i])} op={dim[i]} />
      ))}
      {/* gaps that land on the shear line glow violet */}
      {SX.map((hx, i) => (
        <Line points={[[hx - 27, 0], [hx + 27, 0]]} stroke={V} lineWidth={LW.emphasis + 2} lineCap="round" shadowColor={V} shadowBlur={22}
          opacity={() => val(dim[i]) * clamp(val(ticks) * (1 - Math.abs(val(shOf(i))) / 10))} />
      ))}
      {/* muted bars where a driver or key pin crosses the line */}
      {SX.map((hx, i) => (
        <Rect x={hx} y={0} width={HW + 14} height={9} radius={3} fill={M} opacity={() => val(bars) * (barsAlways || Math.abs(val(shOf(i))) > 8 ? 1 : 0)} />
      ))}
      {/* the shear line itself */}
      <Line points={[[-440, 0], [520, 0]]} stroke={V} lineWidth={LW.emphasis} lineCap="round" end={shear}
        shadowColor={V} shadowBlur={() => 10 + 26 * val(flash)} opacity={() => 0.85 + 0.15 * val(flash)} />
      {/* cam and bolt at the right-hand end of the plug */}
      <Node opacity={bolt}>
        <Line points={[[620, 120], [620, 210]]} {...edge} />
        <Circle x={700} y={165} size={150} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
        <Node x={700} y={165} rotation={turn}>
          <Line points={[[0, 0], [58, 0]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Circle x={58} size={16} fill={C.chalk} />
        </Node>
        <Rect x={() => 800 + 62 - val(turn) * 0.9 + 150} y={165} width={360} height={56} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
      </Node>
      {children}
    </Node>
  );
};
// screen position of a point in a Cyl's local coordinates
export const cp = (c: {x: number; y: number; s: number}, lx: number, ly: number): P => [c.x + c.s * lx, c.y + c.s * ly];

// ------------------------------------------------------------------ corner locator: a small chalk cylinder with the current act
export const LOCW = {x: 664, y: -384, w: 400, h: 120};
export const Locator = ({act = '', x = LOCW.x, y = LOCW.y, opacity = 1}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={LOCW.w} height={LOCW.h} radius={16} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
    <Node x={-LOCW.w / 2 + 62} y={0}>
      <Rect y={-14} width={80} height={26} stroke={C.chalk} lineWidth={3} />
      <Rect y={24} width={80} height={26} stroke={C.chalk} lineWidth={3} />
      <Rect y={6} width={110} height={26} x={-20} stroke={C.chalk} lineWidth={3} fill={C.panel} />
      {[-24, 0, 24].map(px => <Line points={[[px, -26], [px, 36]]} stroke={V} lineWidth={3} />)}
      <Line points={[[-40, 1], [40, 1]]} stroke={V} lineWidth={3} />
    </Node>
    <Txt text={act} x={36} fontFamily="Archivo" fontWeight={500} fontSize={TY.small_label} fill={C.chalk} />
  </Node>
);
export const ACT = {
  1: '1 · what it checks', 2: '2 · an old idea', '2b': '2 · 1851', 3: '3 · the bargain',
} as Record<string, string>;

// ------------------------------------------------------------------ archival still in a chalk frame with a credit line
const ASSETS = import.meta.glob('../../../../../episodes/p4-lock/scenes/assets/*.jpg', {eager: true, query: '?url', import: 'default'}) as Record<string, string>;
export const assetUrl = (name: string) => {
  const key = Object.keys(ASSETS).find(k => k.endsWith('/' + name));
  return key ? ASSETS[key] : null;
};
export const PHOTO_SIZE: Record<string, [number, number]> = {
  'wooden-lock-met.jpg': [1260, 754], 'yale-sr.jpg': [500, 653], 'patent-3630.jpg': [613, 900], 'yale-jr.jpg': [350, 449],
  'bramah-lock.jpg': [1392, 900], 'great-exhibition-nave.jpg': [1319, 900], 'chubb-lock-engraving.jpg': [1165, 735],
  'chubb-detector.jpg': [820, 530], 'bramah-diagram.jpg': [1249, 758], 'great-exhibition-machinery.jpg': [1494, 900],
};
// A framed photo: fits inside (w, h); `zoom`, `px`, `py` push in / pan the picture inside the fixed chalk frame.
export const Photo = ({name, x = 0, y = 0, w = 1200, h = 720, zoom = 1, px = 0, py = 0, opacity = 1}: any) => {
  const [iw, ih] = PHOTO_SIZE[name];
  const k = Math.min(w / iw, h / ih), fw = iw * k, fh = ih * k;
  const url = assetUrl(name);
  return (
    <Node x={x} y={y} opacity={opacity}>
      <Rect width={fw + 36} height={fh + 36} radius={10} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
      <Rect width={fw} height={fh} clip>
        <Node scale={zoom} x={px} y={py}>
          {url ? <Img src={url} width={fw} height={fh} /> : <Rect width={fw} height={fh} fill={C.panel} />}
        </Node>
      </Rect>
      <Rect width={fw} height={fh} stroke={C.grid} lineWidth={LW.hairline} />
    </Node>
  );
};
export const photoBox = (name: string, w: number, h: number) => {
  const [iw, ih] = PHOTO_SIZE[name], k = Math.min(w / iw, h / ih);
  return [iw * k + 36, ih * k + 36] as P;
};
export const Credit = ({text, x = 0, y = 0, anchor = [0, 0]}: any) => <Backed text={text} x={x} y={y} anchor={anchor} size={30} color={M} />;

// ------------------------------------------------------------------ small drawings
// name card: big name, role line, optional silhouette (no face)
export const Silhouette = ({x = 0, y = 0, s = 1, color = C.chalk, op = 1}: any) => (
  <Node x={x} y={y} scale={s} opacity={op}>
    <Circle y={-62} size={74} stroke={color} lineWidth={LW.structure} fill={C.panel} />
    <Line closed points={[[-76, 60], [-72, 0], [-40, -22], [40, -22], [72, 0], [76, 60]]} stroke={color} lineWidth={LW.structure}
      fill={C.panel} lineJoin="round" radius={26} />
  </Node>
);
export const NameCard = ({x = 0, y = 0, w = 900, name = '', role = '', sil = false, opacity = 1, nameSize = 64}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w} height={role.split('\n').length * 50 + 150} radius={16} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
    {sil ? <Silhouette x={-w / 2 + 130} y={14} s={1.25} /> : null}
    <Txt text={name} x={sil ? 100 : 0} y={-(role.split('\n').length * 25) - 14} fontFamily="Archivo" fontWeight={600} fontSize={nameSize} letterSpacing={1}
      fill={C.chalk} />
    <Txt text={role} x={sil ? 100 : 0} y={nameSize / 2 + 8} fontFamily="Archivo" fontWeight={500} fontSize={TY.small_label}
      fill={M} textAlign="center" lineHeight={46} />
  </Node>
);

// chalk stopwatch ring: p = share of the ring filled (violet arc), ticks every 30 degrees
export const Stopwatch = ({x = 0, y = 0, r = 160, p = 0, color = V, opacity = 1, hand = true}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect y={-r - 34} width={44} height={26} radius={6} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
    <Circle size={2 * r} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
    {Array.from({length: 12}, (_, k) => {
      const a = (k / 12) * Math.PI * 2;
      return <Line points={[[Math.sin(a) * (r - 14), -Math.cos(a) * (r - 14)], [Math.sin(a) * (r - 30), -Math.cos(a) * (r - 30)]]}
        stroke={C.chalk} lineWidth={LW.hairline + 1} lineCap="round" />;
    })}
    <Circle size={2 * r - 60} stroke={color} lineWidth={14} startAngle={-90} endAngle={() => -90 + 360 * clamp(val(p))} lineCap="round"
      shadowColor={color} shadowBlur={10} opacity={() => (val(p) > 0.002 ? 1 : 0)} />
    {hand ? <Line points={() => [[0, 0], [Math.sin(val(p) * Math.PI * 2) * (r - 50), -Math.cos(val(p) * Math.PI * 2) * (r - 50)]]}
      stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" /> : null}
    <Circle size={20} fill={C.chalk} />
  </Node>
);

// chalk door with a lock: open 0..1 (violet line along the edge when open), size w x h, centred at (x, y)
export const Door = ({x = 0, y = 0, w = 300, h = 520, open = 0, lit = 0, color = C.chalk, glow = 0, opacity = 1, lock = true}: any) => (
  <Node x={x} y={y} opacity={opacity}>
    <Rect width={w + 50} height={h + 36} y={-18} radius={6} stroke={color} lineWidth={LW.hairline + 1} opacity={0.6} />
    <Rect width={w} height={h} radius={6} stroke={color} lineWidth={LW.structure} fill={() => rgba(V, 0.22 * val(lit))} />
    <Rect width={w - 70} height={h * 0.4} y={-h * 0.2} radius={4} stroke={color} lineWidth={LW.hairline} opacity={0.5} />
    <Rect width={w - 70} height={h * 0.3} y={h * 0.3} radius={4} stroke={color} lineWidth={LW.hairline} opacity={0.5} />
    {lock ? (
      <Node x={w * 0.34} y={h * 0.02}>
        <Rect width={50} height={96} radius={12} stroke={color} lineWidth={LW.structure} fill={C.panel} />
        <Circle y={-16} size={22} stroke={color} lineWidth={LW.structure} />
        <Line points={[[0, -4], [0, 22]]} stroke={color} lineWidth={LW.structure} lineCap="round" />
      </Node>
    ) : null}
    <Line points={[[w / 2, -h / 2 + 6], [w / 2, h / 2 - 6]]} stroke={V} lineWidth={LW.emphasis} lineCap="round" shadowColor={V} shadowBlur={22}
      opacity={() => clamp(val(open)) + val(glow)} />
  </Node>
);

// building front: grid of small doors (cols x rows), lit by index
export const Doors = ({x = 0, y = 0, cols = 4, rows = 3, cw = 150, ch = 190, lit = [] as any[], op = 1}: any) => (
  <Node x={x} y={y} opacity={op}>
    <Rect width={cols * cw + 60} height={rows * ch + 60} radius={10} stroke={C.chalk} lineWidth={LW.structure} />
    {Array.from({length: rows * cols}, (_, k) => {
      const cx = ((k % cols) - (cols - 1) / 2) * cw, cy = (Math.floor(k / cols) - (rows - 1) / 2) * ch;
      return (
        <Node x={cx} y={cy}>
          <Rect width={cw - 40} height={ch - 40} radius={5} stroke={C.chalk} lineWidth={LW.hairline + 1}
            fill={() => rgba(V, 0.45 * clamp(val(lit[k] ?? 0)))} />
          <Circle x={(cw - 40) / 2 - 22} y={4} size={12} fill={C.chalk} />
        </Node>
      );
    })}
  </Node>
);

// vertical gauge with a violet target line; dot position 0..1 (0 = bottom)
export const Gauge = ({x = 0, y = 0, h = 360, w = 56, target = 0.5, dot = 0, op = 1, lit = 0}: any) => (
  <Node x={x} y={y} opacity={op}>
    <Rect width={w} height={h} radius={w / 2} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
    <Line points={[[-w / 2 - 16, h / 2 - h * target], [w / 2 + 16, h / 2 - h * target]]} stroke={V} lineWidth={LW.emphasis} lineCap="round"
      shadowColor={V} shadowBlur={() => 22 * val(lit)} />
    <Circle y={() => h / 2 - 24 - (h - 48) * clamp(val(dot))} size={w - 14} fill={C.chalk} />
  </Node>
);

// plain text helpers (type tokens)
export const Lab = ({text, x = 0, y = 0, color = C.chalk, size = TY.label, ...rest}: any) => (
  <Txt text={text} x={x} y={y} fontFamily="Archivo" fontWeight={600} fontSize={size} letterSpacing={3} fill={color} {...rest} />
);
export const Sm = ({text, x = 0, y = 0, color = C.chalk, size = TY.small_label, ...rest}: any) => (
  <Txt text={text} x={x} y={y} fontFamily="Archivo" fontWeight={500} fontSize={size} fill={color} {...rest} />
);
export const Mono = ({text, x = 0, y = 0, color = C.chalk, size = TY.number, ...rest}: any) => (
  <Txt text={text} x={x} y={y} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={size} fill={color} {...rest} />
);
// plain leader line (no arrowhead)
export const Leader = ({from, to, color = M, opacity = 1, end = 1}: any) => (
  <Line points={[from, to]} stroke={color} lineWidth={LW.hairline + 1} lineCap="round" opacity={opacity} end={end} />
);
// big title at the top-left of the safe area
export const Head = ({text, x = -864, y = -430, opacity = 1, color = C.chalk, size = 72}: any) => (
  <Txt text={text} x={x} y={y} offset={[-1, 0]} fontFamily="Archivo" fontWeight={600} fontSize={size} letterSpacing={3} fill={color} opacity={opacity} />
);
