// P4 scenes, part 2: the master key (S17-S26) and the old idea: Egypt, Yale, London (S27-S38).
import {Circle, Line, Node, Rect, Spline, Txt} from '@motion-canvas/2d';
import type {Built} from '../lib/motion';
import {BIT, Bldg, Block, Cyl, Head, Key, Lab, Leader, Mono, MiniDoor, NameCard, Photo, photoBox, Silhouette, Sm, Tick, WoodLock, WX, Doors, VL, Backed} from '../lib/lock';
import {val, all, C, clamp, cue, D, delay, dur, ease, easeOutCubic, linear, Loc, LW, M, Padlock, rgba, sig, sigs, T, to, TY, V, waitFor} from './shared';

const LB = {x: -20, y: -40, s: 0.92};
const Z5 = [0, 0, 0, 0, 0];
const at = (id: string, i: number, extra: number) => Math.min(cue(id, i) + extra, dur(id) - 1.2);
const lab = (text: string, x: number, y: number, o: any = 1, size = TY.label, color = C.chalk, anchor: [number, number] = [0, 0]) => (
  <Lab text={text} x={x} y={y} size={size} color={color} opacity={o} offset={anchor} />
);
// hierarchy tree: grand master, three masters, nine doors. dim 0..1 turns it muted.
const Hier = ({gm = 1, ms = [1, 1, 1], doors = 1, dim = 0}: any) => {
  const col = () => (val(dim) > 0.5 ? M : C.chalk);
  return (
    <Node>
      {[-420, 0, 420].map((gx, g) => (
        <Node>
          {[-100, 0, 100].map(dx => <MiniDoor x={gx + dx} y={250} color={col} opacity={doors} />)}
          <Line points={[[gx - 100, 190], [gx - 100, 170], [gx + 100, 170], [gx + 100, 190]]} stroke={col} lineWidth={LW.hairline + 1} opacity={ms[g]} />
          <Line points={[[gx, 170], [gx, 120]]} stroke={col} lineWidth={LW.hairline + 1} opacity={ms[g]} />
          <Node opacity={ms[g]}>
            <Key x={gx - 70} y={22} s={0.17} color={col} />
            <Lab text="MASTER" x={gx} y={92 - 8} size={TY.small_label} color={col} spacing={2} />
          </Node>
          <Line points={[[gx, 20], [gx, -10], [0, -10], [0, -34]]} stroke={col} lineWidth={LW.hairline + 1} opacity={gm} />
        </Node>
      ))}
      <Node opacity={gm}>
        <Key x={-70} y={-232} s={0.2} color={col} />
        <Lab text="GRAND MASTER" x={0} y={-130} size={TY.small_label + 4} color={col} spacing={2} />
      </Node>
    </Node>
  );
};

export const A2: Record<string, () => Built> = {
  S17: () => {
    const lit = sigs(15), yk = sig(0), mk = sig(0), draw = sig(0), mine = 7;
    return {
      base: <Node>
        <Loc act="1" />
        <Doors x={-220} y={40} cols={5} rows={3} cw={150} ch={170} lit={lit} />
        <Lab text="A BUILDING WITH A MASTER KEY SYSTEM" x={-864} y={-430} size={TY.label} offset={[-1, 0]} />
        <Node opacity={yk}>
          <Key x={470} y={-170} s={0.3} />
          <Sm text="your key: 1 door" x={640} y={-50} color={C.chalk} />
        </Node>
        <Node opacity={mk}>
          <Key x={470} y={110} s={0.3} bow="round" color={VL} />
          <Sm text="master key: many doors" x={640} y={230} color={VL} />
        </Node>
      </Node>,
      steps: [
        function* () { yield yk(1, 0.6); yield* lit[mine](1, 0.5); yield* delay(1.0, mk(1, 0.6)); },
        function* () { yield* all(...lit.map((l, k) => delay(k * 0.12, l(1, 0.4)))); },
      ],
    };
  },
  S18: () => {
    const z = sig(0), mp = sig(0), l = sig(0), hd = sig(1);
    const cx = () => LB.x * (1 - z()), cy = () => LB.y * (1 - z()), cs = () => LB.s + (1.6 - LB.s) * z();
    return {
      drift: false,
      base: <Node>
        <Loc act="1" />
        <Node opacity={hd}><Head text="MASTER KEY" size={88} /></Node>
        <Cyl x={cx} y={cy} s={cs} master={[0, 0, mp, 0, 0]} hdim={[() => 1 - 0.7 * z(), () => 1 - 0.7 * z(), 1, () => 1 - 0.7 * z(), () => 1 - 0.7 * z()]}
          dim={[() => 1 - 0.65 * z(), () => 1 - 0.65 * z(), 1, () => 1 - 0.65 * z(), () => 1 - 0.65 * z()]} />
        <Node opacity={l}>
          <Leader from={[52, 22]} to={[150, 22]} color={VL} />
          <Backed text="MASTER PIN" x={160} y={22} font="label" color={VL} />
        </Node>
      </Node>,
      steps: [
        function* () { yield hd(0.0, 0.6); yield* z(1, 1.4, ease); },
        function* () { yield l(1, 0.5); yield* mp(1, 1.0, ease); },
      ],
    };
  },
  // overlay: the master hero
  S19: () => {
    // 3rd stack = the master stack; its two gaps sit at x ~1142 px, y ~341 and ~364 px (measured from the hero clip)
    const a = sig(0), sp = sig(0), k1 = sig(0), k2 = sig(0), cant = sig(0);
    const GX = 1142 - 960, G1 = 341 - 540, G2 = 364 - 540, CX = 815;
    const leader = (y: number, gy: number, text: string) => (
      <Node>
        <Line points={[[CX - 78, y], [GX, gy]]} stroke={C.chalk} lineWidth={3} shadowColor={C.bg} shadowBlur={6} />
        <Circle x={GX} y={gy} size={14} fill={V} stroke={C.bg} lineWidth={3} />
        <Backed text={text} x={CX} y={y} anchor={[0, 0]} size={40} color={V} />
      </Node>
    );
    return {
      drift: false, overlay: true,
      base: <Node>
        <Node opacity={a}><Backed text={'2 heights\nthat work'} x={CX} y={-330} anchor={[0, 0]} size={38} /></Node>
        <Node opacity={sp}>{leader(-170, G1, 'split 1')}{leader(-60, G2, 'split 2')}</Node>
        <Node opacity={k1}><Backed text="your key" x={CX} y={150} anchor={[0, 0]} size={44} /></Node>
        <Node opacity={k2}><Backed text="master key" x={CX} y={150} anchor={[0, 0]} size={44} color={VL} /></Node>
        <Node opacity={cant}><Backed text={'the lock\ncan\'t tell'} x={CX} y={300} anchor={[0, 0]} size={40} /></Node>
      </Node>,
      ambient: function* () { yield* waitFor(5.2); yield* sp(0, 0.4); },
      steps: [function* () { yield a(1, 0.6); yield* sp(1, 0.5); }, to(k1, 1, 0.5), function* () { yield k1(0, 0.25); yield* k2(1, 0.5); }, to(cant, 1, 0.6)],
    };
  },
  S20: () => {
    const ms = sigs(3), gm = sig(0), doors = sig(0);
    return {
      base: <Node>
        <Loc act="1" />
        <Head text="LEVELS" />
        <Hier ms={ms} gm={gm} doors={doors} />
      </Node>,
      ambient: function* () { yield* doors(1, 0.8); },
      steps: [
        function* () { yield* all(...ms.map((m, i) => delay(i * 0.25, m(1, 0.6, ease)))); },
        to(gm, 1, 0.8),
      ],
    };
  },
  S21: () => {
    const dim = sig(0), q = sig(0);
    return {
      base: <Node>
        <Loc act="1" />
        <Hier dim={dim} />
        <Mono text="?" x={0} y={-340} size={150} color={V} opacity={q} />
      </Node>,
      steps: [function* () { yield* all(dim(1, 0.5), delay(0.2, q(1, 0.5))); }],
    };
  },
  S22: () => {
    const nc = sig(0), paper = sig(0);
    return {
      base: <Node>
        <Loc act="1" />
        <Lab text="2003" x={-864} y={-430} size={88} offset={[-1, 0]} />
        <Node opacity={nc}><NameCard x={-60} y={-170} w={1000} name="Matt Blaze" role={'researcher, AT&T Labs (2003)'} sil /></Node>
        <Node opacity={paper} y={() => 18 * (1 - paper())}>
          <Rect x={-60} y={170} width={1200} height={300} radius={10} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
          <Txt text={'Rights amplification in\nmaster-keyed mechanical locks'} x={-60} y={130} fontFamily="Archivo" fontWeight={600} fontSize={52} fill={C.chalk} textAlign="center" lineHeight={64} />
          <Mono text="IEEE Security & Privacy, 2003" x={-60} y={252} size={36} color={M} />
        </Node>
      </Node>,
      steps: [to(nc, 1, 0.6), to(paper, 1, 0.7)],
    };
  },
  S23: () => {
    const t = sigs(5), keys = sigs(4), ck = sigs(4), cnt = sig(0);
    const bits = [BIT, [3, 6, 2, 5, 4].map(b => b), [3, 5, 2, 6, 4], [4, 6, 3, 5, 4]];
    const names = ['your key', 'master key', 'key 3', 'key 4'];
    return {
      base: <Node>
        <Loc act="1" />
        {[0, 1, 2, 3, 4].map(i => (
          <Node x={-400 + i * 200} y={-200}>
            <Rect width={56} height={220} radius={14} stroke={C.chalk} lineWidth={LW.structure} />
            <Line points={[[-34, -50], [34, -50]]} stroke={V} lineWidth={LW.emphasis} lineCap="round" shadowColor={V} shadowBlur={12} />
            <Line points={[[-34, 40], [34, 40]]} stroke={V} lineWidth={LW.emphasis} lineCap="round" shadowColor={V} shadowBlur={12} opacity={() => ([1, 3].includes(i) ? t[i]() : 0)} />
          </Node>
        ))}
        {[0, 1, 2, 3].map(k => (
          <Node opacity={keys[k]} y={() => 14 * (1 - keys[k]())}>
            <Key x={-640 + k * 330} y={40} s={0.2} bow={k % 2 ? 'round' : 'square'} bit={bits[k]} />
            <Sm text={names[k]} x={-540 + k * 330} y={150} color={k > 1 ? M : C.chalk} />
            <Tick x={-540 + k * 330} y={-30} p={ck[k]} />
          </Node>
        ))}
        <Node opacity={cnt}><Backed text="planned: 2 · accepted: more" x={0} y={290} font="label" /></Node>
      </Node>,
      ambient: function* () { yield* all(...t.map((s, i) => delay(0.2 * i, s(1, 0.5)))); },
      steps: [
        function* () { yield* all(...t.map(s => s(1, 0.3))); },
        function* () {
          yield cnt(1, 0.6);
          yield* all(...keys.map((s, k) => delay(k * 0.45, function* () { yield* s(1, 0.4); yield* ck[k](1, 0.3); }())));
        },
      ],
    };
  },
  S24: () => {
    const b = sigs(5), ck = sigs(5), l2 = sig(0), pulse = sig(0);
    const kinds = ['school', 'office', 'school', 'office', 'school'];
    return {
      base: <Node>
        <Loc act="1" />
        <Lab text="EVERY SYSTEM HE TESTED" x={-864} y={-430} size={TY.label + 8} offset={[-1, 0]} />
        {kinds.map((k, i) => (
          <Node y={() => 16 * (1 - b[i]())} opacity={b[i]}>
            <Bldg x={-600 + i * 300} y={40} kind={k} />
            <Tick x={-600 + i * 300} y={-190} p={ck[i]} />
          </Node>
        ))}
        <Node opacity={l2}>
          <Backed text="top master key: could be worked out" x={0} y={290} font="label" anchor={[0, 0]} />
          <Backed text="(in principle)" x={0} y={355} anchor={[0, 0]} color={V} />
        </Node>
      </Node>,
      ambient: function* () { yield* all(...b.map((s, i) => delay(0.4 + i * 0.35, s(1, 0.6)))); },
      steps: [function* () {
        yield* all(...ck.map((c, i) => delay(i * 0.55, c(1, 0.35))));
        yield* delay(0.4, l2(1, 0.7));
        while (true) { yield* all(...ck.map((c, i) => delay(i * 0.25, function* () { yield* c(0.7, 0.5); yield* c(1, 0.5); }()))); yield* waitFor(0.6); }
      }],
    };
  },
  S25: () => {
    const bd = sigs(5), merge = sig(0), des = sig(0);
    return {
      base: <Node>
        <Loc act="1" />
        <Lab text="NOT ONE BRAND" x={-864} y={-430} size={TY.label + 8} offset={[-1, 0]} />
        {bd.map((o, i) => (
          <Node x={() => (-560 + i * 280) * (1 - merge())} y={() => 20 + 14 * (1 - o()) + Math.sin(T() * 2 + i) * 4} opacity={() => o() * (1 - clamp(merge() * 1.2 - 0.15)) } scale={() => 1 - 0.5 * merge()}>
            <Rect width={230} height={130} radius={14} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
            <Line points={[[-70, -14], [70, -14]]} stroke={M} lineWidth={LW.structure} lineCap="round" />
            <Line points={[[-70, 20], [30, 20]]} stroke={M} lineWidth={LW.structure} lineCap="round" />
            <Circle x={92} y={-46} size={28} fill={V} shadowColor={V} shadowBlur={16} />
          </Node>
        ))}
        <Node opacity={des}>
          <Rect y={20} width={720} height={170} radius={16} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Lab text="THE DESIGN ITSELF" y={20} size={64} />
        </Node>
      </Node>,
      ambient: function* () { yield* all(...bd.map((s, i) => delay(0.3 * i, s(1, 0.5)))); },
      steps: [function* () { yield* all(merge(1, 1.1, ease), delay(0.6, des(1, 0.7))); }],
    };
  },
  S26: () => {
    const tilt = sig(0), two = sig(0), ask = sig(0), bal = sig(1);
    const R = 440;
    const ang = () => (tilt() * 9 * Math.PI) / 180;
    return {
      base: <Node>
        <Loc act="1" />
        <Node opacity={bal} y={20}>
          <Line points={[[-60, 160], [0, 40], [60, 160]]} closed stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" fill={C.panel} />
          <Line points={() => [[-R * Math.cos(ang()), -R * Math.sin(ang())], [R * Math.cos(ang()), R * Math.sin(ang())]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Node x={() => -R * Math.cos(ang())} y={() => -R * Math.sin(ang()) - 110}>
            <Mono text="1" size={96} color={V} opacity={() => 1 - two()} />
            <Mono text="2" size={96} color={V} opacity={two} />
            <Sm text="answers accepted" y={-80} color={C.chalk} />
          </Node>
          <Node x={() => R * Math.cos(ang())} y={() => R * Math.sin(ang()) - 110}>
            <Rect y={30} width={150} height={() => 150 - 100 * tilt()} radius={10} stroke={M} lineWidth={LW.structure} />
            <Sm text="how hard to fool" y={-80} color={M} />
          </Node>
        </Node>
        <Node opacity={ask}><Lab text="THE OLDEST CLAIM ABOUT LOCKS" y={-20} size={72} /></Node>
      </Node>,
      steps: [
        function* () { yield* all(tilt(1, 1.4, ease), delay(0.5, two(1, 0.5))); },
        function* () { yield* all(bal(0, 0.7, ease), delay(0.4, ask(1, 0.8))); },
      ],
    };
  },

  // ================================================================ act two
  S27: () => {
    const draw = sig(0), pyr = sig(0), txt = sig(0), cp = sigs(8), crack = sig(0), wob = sig(0), hd = sig(0);
    const CPOS = [[-640, -290], [-210, -330], [220, -300], [680, -200], [-660, 290], [-220, 330], [230, 300], [690, 260]];
    const plaque = (s: number, extra: any = {}) => (
      <Node scale={s} {...extra}>
        <Rect width={900} height={340} radius={18} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} end={draw} />
        <Line closed points={[[-390, 100], [-270, -90], [-150, 100]]} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" end={pyr} />
        <Line points={[[-340, 20], [-200, 20]]} stroke={C.chalk} lineWidth={LW.hairline} opacity={pyr} />
        <Lab text="4,000 YEARS OLD" x={150} y={-36} size={58} opacity={txt} />
        <Lab text="ANCIENT EGYPT" x={150} y={44} size={TY.small_label + 4} color={M} opacity={txt} />
      </Node>
    );
    return {
      base: <Node>
        <Loc act="2" />
        <Lab text="ACT 2 · AN OLD IDEA" x={-864} y={-430} size={TY.label + 8} offset={[-1, 0]} opacity={hd} />
        {CPOS.map(([x, y], i) => (
          <Node x={x} y={y} opacity={cp[i]} rotation={() => Math.sin(T() * 7 + i) * 3 * wob()} scale={() => 0.4 * (0.7 + 0.3 * cp[i]())}>
            <Rect width={900} height={340} radius={18} fill={C.panel} stroke={C.muted} lineWidth={LW.structure * 1.5} />
            <Lab text="4,000 YEARS OLD" size={64} color={M} />
          </Node>
        ))}
        <Node scale={() => 1 + 0.01 * Math.sin(T() * 1.5)}>{plaque(1)}</Node>
        <Line points={[[-120, -150], [-60, -40], [-110, 20], [-40, 100], [-80, 170]]} stroke={M} lineWidth={LW.emphasis + 2} lineCap="round" lineJoin="round" end={crack} />
      </Node>,
      ambient: function* () {
        yield* all(hd(1, 0.6), draw(1, 1.1, ease), delay(0.6, pyr(1, 1.0, ease)), delay(1.5, txt(1, 0.8)));
      },
      steps: [
        function* () { yield* all(...cp.map((s, i) => delay(i * 0.18, s(1, 0.4, ease)))); },
        function* () { yield wob(1, 0.3); yield* crack(1, 0.9, ease); },
      ],
    };
  },
  S28: () => {
    const flow = sig(0), back = sig(0), pc = sig(0), mut = sig(0);
    const XS = [-570, 0, 580];
    const cardP = (x: number, text: string, w: number, col: any) => (
      <Node x={x} y={80}>
        <Rect width={w} height={130} radius={14} fill={C.panel} stroke={col} lineWidth={LW.structure} />
        <Lab text={text} size={TY.small_label + 2} color={col} spacing={0} />
      </Node>
    );
    return {
      base: <Node>
        <Loc act="2" />
        <Line points={[[-350, 80], [-160, 80]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[14, 12]} lineDashOffset={() => -T() * 40} />
        <Line points={[[160, 80], [300, 80]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[14, 12]} lineDashOffset={() => -T() * 40} />
        <Line points={[[-350, 80], [-160, 80]]} stroke={M} lineWidth={LW.structure} lineDash={[14, 12]} opacity={mut} />
        {cardP(XS[0], 'PITT-RIVERS, 1883', 420, C.chalk)}
        <Node opacity={() => 1 - mut()}>{cardP(XS[1], 'misread', 300, C.chalk)}</Node>
        <Node opacity={mut}>{cardP(XS[1], 'misread', 300, M)}</Node>
        {cardP(XS[2], 'possibly 4,000 years old', 560, C.chalk)}
        <Line points={[[XS[2] - 280, 160], [XS[2] - 280, 220], [XS[0] + 210, 220], [XS[0] + 210, 160]]} stroke={V} lineWidth={LW.emphasis} lineCap="round" lineJoin="round" end={back}
          shadowColor={V} shadowBlur={12} radius={20} />
        <Node opacity={pc} y={() => 14 * (1 - pc())}><NameCard x={0} y={-190} w={1000} name="D. T. Potts" role="archaeologist (1990)" sil /></Node>
        <Node opacity={mut}><Lab text="UNFOUNDED" x={0} y={320} color={V} size={64} /></Node>
      </Node>,
      steps: [to(pc, 1, 0.6), function* () { yield* back(1, 1.2, ease); yield* mut(1, 0.5); }],
    };
  },
  S29: () => {
    const grow = sig(0), nm = sig(0), door = sig(0), grey = sig(0);
    return {
      base: <Node>
        <Loc act="2" />
        <Node x={-560} y={-250} scale={() => 1 + 0.3 * grow()}>
          <Rect width={420} height={130} radius={14} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
          <Lab text="1883" size={64} />
        </Node>
        <Node opacity={nm} y={() => 14 * (1 - nm())}>
          <NameCard x={-120} y={20} w={1000} name="A. Pitt-Rivers" role="general and archaeologist" sil />
        </Node>
        <Node x={640} y={90} opacity={() => 1 - 0.7 * grey()}>
          <Line closed points={[[-170, 150], [-80, -100], [10, 150]]} stroke={() => (grey() > 0.5 ? M : C.chalk)} lineWidth={LW.structure} lineJoin="round" />
          <Lab text="4,000?" y={60} size={TY.small_label + 6} color={() => (grey() > 0.5 ? M : C.chalk)} />
        </Node>
        <Node opacity={door} x={640} y={-220}>
          <Rect width={150} height={210} radius={6} stroke={C.chalk} lineWidth={LW.structure} />
          <Rect x={42} y={0} width={64} height={22} radius={4} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Sm text="doubted it" y={150} color={C.chalk} />
        </Node>
      </Node>,
      ambient: function* () { yield* grow(1, 4.0, ease); },
      steps: [to(nm, 1, 0.6), function* () { yield* all(door(1, 0.6), grey(1, 0.6)); }],
    };
  },
  S30: () => {
    const zoom = sig(1), txt = sig(0), pre = sig(0);
    const [fw] = photoBox('wooden-lock-met.jpg', 1100, 700);
    return {
      drift: false,
      base: <Node>
        <Loc act="2" />
        <Photo name="wooden-lock-met.jpg" x={-250} y={-10} w={1100} h={700} zoom={zoom} />
        <Backed text="Wooden lock, Damascus · The Met (public domain)" x={-250 - fw / 2} y={385} size={34} color={M} />
        <Node opacity={pre}><Block lines={['WHAT WAS', 'ACTUALLY FOUND']} x={440} y={-120} size={TY.label} /></Node>
        <Node opacity={txt}><Block lines={['Wooden pin-lock bolts', 'Roman-era Egypt']} x={440} y={60} size={TY.small_label} /></Node>
      </Node>,
      ambient: function* () { yield* all(zoom(1.12, dur('S30'), linear), delay(0.3, pre(1, 0.6))); },
      steps: [to(txt, 1, 0.6)],
    };
  },
  S31: () => {
    const peg = sigs(4), key = sig(0), kx = sig(620), lift = sig(0), slide = sig(0), l = sigs(3), bolt = sig(1);
    return {
      base: <Node>
        <Loc act="2" />
        <WoodLock x={-80} y={20} s={1} peg={peg} key={key} kx={kx} lift={lift} slide={slide} />
        <Node opacity={l[0]}>{lab('BOLT', -380, 200, 1, TY.label, C.chalk)}<Leader from={[-380, 170]} to={[-380, 90]} /></Node>
        <Node opacity={l[1]}>{lab('PEGS', 360, -150, 1)}<Leader from={[300, -150]} to={[180, -140]} /></Node>
        <Node opacity={l[2]}>{lab('KEY', 640, 250, 1)}</Node>
      </Node>,
      ambient: function* () { yield l[0](1, 0.6); },
      steps: [
        function* () { yield l[1](1, 0.5); yield* all(...peg.map((p, i) => delay(i * 0.3, p(1, 0.5, easeOutCubic)))); },
        function* () { yield key(1, 0.3); yield l[2](1, 0.5); yield* kx(0, D('S31', 1, 1.6), ease); yield* lift(1, 0.5, ease); },
        function* () { yield* slide(140, 1.0, ease); },
      ],
    };
  },
  S32: () => {
    const kx = sig(300), lift = sig(0), ins = sig(0), pegs = sigs(4, 1), hd = sig(0);
    const YL = -20;
    return {
      base: <Node>
        <Loc act="2" />
        <Lab text="SAME PRINCIPLE" x={-864} y={-430} size={72} offset={[-1, 0]} />
        <WoodLock x={-420} y={YL + 70 * 0.62} s={0.62} peg={pegs} key={1} kx={kx} lift={lift} />
        <Cyl x={410} y={YL} s={0.62} ins={ins} key={1} shear={1} ticks={ins} />
        <Line points={[[-860, YL], [860, YL]]} stroke={V} lineWidth={LW.emphasis} lineCap="round" shadowColor={V} shadowBlur={14} opacity={0.9} />
      </Node>,
      ambient: function* () { yield* all(kx(40, 3.2, ease), ins(0.7, 3.2, ease)); },
      steps: [function* () { yield* all(kx(0, 0.6, ease), lift(1, 0.6, ease), ins(1, 0.6, ease)); }],
    };
  },
  S33: () => {
    const bar = sig(0), l1 = sig(0), l2 = sig(0), l3 = sig(0), dot = sig(0);
    return {
      base: <Node>
        <Loc act="2" />
        <Line points={[[-700, 40], [700, 40]]} stroke={C.grid} lineWidth={LW.structure} lineCap="round" />
        {Array.from({length: 8}, (_, k) => <Line points={[[-700 + k * 200, 26], [-700 + k * 200, 54]]} stroke={C.grid} lineWidth={LW.structure} />)}
        <Line points={[[-700, 40], [700, 40]]} stroke={V} lineWidth={LW.emphasis + 4} lineCap="round" end={bar} shadowColor={V} shadowBlur={12} />
        <Circle x={() => -700 + 1400 * (dot() % 1)} y={40} size={22} fill={C.chalk} opacity={() => (bar() > 0.99 ? 1 : 0)} />
        <Lab text="ROMAN-ERA EGYPT" x={-700} y={115} size={TY.small_label + 4} offset={[-1, 0]} />
        <Lab text="20TH CENTURY" x={700} y={115} size={TY.small_label + 4} offset={[1, 0]} opacity={l3} />
        <Sm text="still in everyday use in Egypt and the Near East" x={0} y={-70} size={42} color={C.chalk} opacity={l1} />
        <Sm text="a very long run" x={0} y={-230} size={TY.label} color={M} opacity={l2} />
      </Node>,
      ambient: function* () { yield l2(1, 1.0); },
      steps: [function* () {
        yield l1(1, 0.6);
        yield* bar(1, D('S33', 0, 2.6), ease);
        yield l3(1, 0.5);
        while (true) { dot(0); yield* dot(1, 3.2, linear); }
      }],
    };
  },
  S34: () => {
    const port = sig(1), pat = sig(0), zoom = sig(1), py = sig(0), card = sig(0), pt = sig(0);
    return {
      drift: false,
      base: <Node>
        <Loc act="2" />
        <Node opacity={port}><Photo name="yale-sr.jpg" x={-420} y={-10} w={560} h={700} zoom={zoom} /></Node>
        <Node opacity={pat}><Photo name="patent-3630.jpg" x={-420} y={-10} w={560} h={700} zoom={() => 1.55} py={py} /></Node>
        <Node opacity={card}><NameCard x={330} y={-110} w={840} name="Linus Yale Sr." role={'bank-lock maker,\nNewport, New York'} nameSize={60} /></Node>
        <Node opacity={pt}><Backed text="US patent 3,630 · 1844" x={330} y={110} font="label" anchor={[0, 0]} /></Node>
        <Backed text={() => (pat() > 0.5 ? 'US patent 3,630 (1844), USPTO' : 'Linus Yale Sr., portrait (public domain)')} x={-700} y={385} size={34} color={M} anchor={[-1, 0]} />
      </Node>,
      ambient: function* () { yield* all(card(1, 0.7), zoom(1.12, dur('S34'), linear)); },
      steps: [function* () { yield* all(port(0, 0.6), pat(1, 0.6), pt(1, 0.8)); yield* py(-200, Math.max(1.0, dur('S34') - cue('S34', 0) - 0.8), linear); }],
    };
  },
  S35: () => {
    const easel = sig(0), toLock = sig(0), nm = sig(0), z = sig(1);
    return {
      drift: false,
      base: <Node>
        <Loc act="2" />
        <Photo name="yale-jr.jpg" x={-380} y={-10} w={540} h={700} zoom={z} />
        <Node opacity={nm}><Lab text="LINUS YALE JR. (1821-1868)" x={170} y={-250} size={TY.label} offset={[-1, 0]} /></Node>
        <Backed text="Linus Yale Jr., portrait (public domain)" x={-700} y={385} size={34} color={M} anchor={[-1, 0]} />
        <Node x={480} y={60} opacity={() => easel() * (1 - toLock())} scale={() => 1 - 0.2 * toLock()}>
          <Line points={[[-120, 200], [0, -150], [120, 200]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
          <Line points={[[0, -150], [0, 200]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
          <Rect y={-40} width={190} height={150} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Line points={[[-60, 20], [-10, -60], [30, -10], [60, -70]]} stroke={M} lineWidth={LW.structure} lineCap="round" lineJoin="round" />
          <Line points={[[150, -150], [260, -40]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
          <Sm text="portrait painting" y={260} color={M} />
        </Node>
        <Node opacity={toLock}>
          <Cyl x={470} y={50} s={0.34} kp={[1, 1, 1, 1, 1]} />
          <Sm text="family lock business" x={440} y={260} color={M} />
        </Node>
      </Node>,
      ambient: function* () { yield* all(nm(1, 0.7), z(1.12, dur('S35'), linear)); },
      steps: [to(easel, 1, 0.7), function* () { yield* toLock(1, 0.8, ease); }],
    };
  },
  S36: () => {
    const hatch = sig(0), figure = sig(0), head = sig(0), sheet = sig(1), pins = sig(0), ins = sig(0), tag = sig(0);
    const hatchLines = Array.from({length: 18}, (_, i) => i);
    return {
      base: <Node>
        <Loc act="2" />
        <Node opacity={sheet}>
          <Rect x={-60} y={20} width={1380} height={800} radius={12} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
          <Lab text="L. YALE Jr. · LOCK" x={-700} y={-340} size={TY.label} offset={[-1, 0]} opacity={head} />
          <Mono text="No. 48,475 · Patented June 27, 1865" x={-700} y={-285} size={34} color={M} offset={[-1, 0]} opacity={head} />
        </Node>
        <Node opacity={() => 0.55 + 0.45 * sheet()}>
          <Cyl x={-60} y={50} s={0.78} outline={figure} holes={() => 5 * figure()} kp={[pins, pins, pins, pins, pins]} dr={[pins, pins, pins, pins, pins]} sp={[pins, pins, pins, pins, pins]}
            ins={ins} key={pins} shear={() => pins()} />
          <Rect x={-60 + 40 * 0.78} y={50 + 82 * 0.78} width={980 * 0.78} height={330 * 0.78} clip opacity={() => 0.6 * (1 - pins())}>
            {hatchLines.map(i => <Line points={[[-560 + i * 70, 400], [-360 + i * 70, 0]]} y={-200} stroke={M} lineWidth={LW.hairline} end={hatch} />)}
          </Rect>
        </Node>
        <Node opacity={tag}><Lab text="THE CYLINDER YOU CARRY TODAY" x={0} y={410} size={TY.small_label + 6} /></Node>
      </Node>,
      ambient: function* () { yield* all(head(1, 0.8), figure(1, 3.6, ease), delay(2.0, hatch(1, 3.5, linear))); },
      steps: [function* () { yield* all(sheet(0, 0.8), pins(1, 0.8), delay(0.5, tag(1, 0.6))); yield* ins(1, Math.max(0.8, dur('S36') - cue('S36', 0) - 1.2), ease); }],
    };
  },
  S37: () => {
    const ty = sig(0), ul = sig(0), tag = sig(0);
    const lines = ['“…improvements relating partly', 'to the security of locks', 'against picking.”'];
    const cw = 0.6 * 56;
    return {
      base: <Node>
        <Loc act="2" />
        <Rect y={20} width={1500} height={520} radius={18} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
        <Sm text="Yale's 1865 patent:" x={-700} y={-200} offset={[-1, 0]} color={M} />
        {lines.map((t, i) => (
          <Node>
            <Txt text={() => t.slice(0, Math.round(clamp(ty() * 3 - i) * t.length))} x={-690} y={-90 + i * 100} offset={[-1, 0]}
              fontFamily="IBM Plex Mono" fontWeight={500} fontSize={56} fill={C.chalk} />
          </Node>
        ))}
        <Line points={[[-690 + 11 * cw - 4, 138], [-690 + 18 * cw + 4, 138]]} stroke={V} lineWidth={LW.emphasis + 2} lineCap="round" end={ul} shadowColor={V} shadowBlur={14} />
        <Node opacity={tag}><Lab text="SECURITY AGAINST PICKING" x={0} y={330} size={TY.small_label + 6} color={V} /></Node>
      </Node>,
      ambient: function* () { yield* ty(1, 4.0, linear); },
      steps: [function* () { yield* all(ul(1, 0.7, ease), delay(0.4, tag(1, 0.6))); }],
    };
  },
  S38: () => {
    const draw = sig(0), pin = sig(0), mk = sig(0), lab = sig(0);
    const M1 = [[.52, 0], [.60, .08], [.56, .16], [.62, .22], [.58, .32], [.64, .40], [.72, .48], [.80, .56], [.78, .66], [.68, .70], [.58, .76], [.44, .80], [.32, .78], [.38, .70], [.36, .62], [.42, .54], [.36, .46], [.40, .36], [.44, .26], [.40, .16], [.46, .08]];
    const H = 640, mx = -320, my = -40;
    const pts = M1.map(([u, v]) => [mx + (u - 0.55) * H, my + (v - 0.45) * H] as [number, number]);
    const LX = mx + (0.74 - 0.55) * H, LY = my + (0.66 - 0.45) * H;
    const tx = (yr: number) => -700 + ((yr - 1844) / 21) * 1000 + 0;
    return {
      base: <Node>
        <Loc act="2" />
        <Line closed radius={26} points={pts} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" end={draw} fill={() => rgba(C.chalk, 0.04 * draw())} />
        <Node x={LX} y={() => LY - 420 * (1 - pin())} opacity={pin}>
          <Circle y={-62} size={56} fill={V} shadowColor={V} shadowBlur={16} />
          <Line closed points={[[-24, -50], [0, 0], [24, -50]]} fill={V} stroke={V} lineWidth={LW.structure} lineJoin="round" />
          <Circle y={-62} size={20} fill={C.bg} />
        </Node>
        <Lab text="LONDON · 1851" x={LX + 80} y={LY - 10} size={TY.small_label + 8} offset={[-1, 0]} opacity={lab} />
        <Line points={[[240, 330], [840, 330]]} stroke={C.grid} lineWidth={LW.structure} lineCap="round" />
        {[[1844, '1844'], [1851, '1851'], [1865, '1865']].map(([yr, t]) => (
          <Node>
            <Line points={[[240 + (((yr as number) - 1844) / 21) * 600, 316], [240 + (((yr as number) - 1844) / 21) * 600, 344]]} stroke={C.chalk} lineWidth={LW.structure} />
            <Mono text={t as string} x={240 + (((yr as number) - 1844) / 21) * 600} y={380} size={34} color={M} />
          </Node>
        ))}
        <Circle x={() => 240 + (1 - mk()) * 600 + mk() * (7 / 21) * 600} y={330} size={30} fill={V} shadowColor={V} shadowBlur={14} />
      </Node>,
      ambient: function* () { yield* draw(1, 1.8, ease); },
      steps: [function* () { yield* all(pin(1, 0.7, easeOutCubic), delay(0.3, mk(1, 1.4, ease))); yield* lab(1, 0.5); }],
    };
  },
};
