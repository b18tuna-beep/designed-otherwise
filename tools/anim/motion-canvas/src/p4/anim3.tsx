// P4 scenes, part 3: 1851, the unpickable lock (S39-S54).
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import type {Built} from '../lib/motion';
import {Backed, BIT, Block, Cyl, Key, Lab, Leader, Mono, Photo, photoBox, Silhouette, Sm, Stopwatch, Tick, VL} from '../lib/lock';
import {all, C, clamp, cue, D, delay, dur, ease, easeOutCubic, linear, Loc, LW, M, Padlock, rgba, ShopWindow, sig, sigs, T, to, TY, V, val, waitFor} from './shared';

const at = (id: string, i: number, extra: number) => Math.min(cue(id, i) + extra, dur(id) - 1.2);
// archival layout: framed photo at the left, text column at the right
const PX = -380;
const credit = (name: string, w: number, h: number, text: string, x = PX, y = 385) => {
  const [fw] = photoBox(name, w, h);
  return <Backed text={text} x={x - fw / 2} y={y} size={28} color={M} anchor={[-1, 0]} />;
};
const fadeIn = (s: any, d = 0.6) => function* () { yield* s(1, d, ease); };
const Chair = ({x = 0, y = 0, o = 1}: any) => (
  <Node x={x} y={y} opacity={o}>
    <Rect y={30} width={96} height={20} radius={5} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
    <Rect y={-30} width={84} height={70} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
    <Line points={[[-36, 40], [-36, 90]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
    <Line points={[[36, 40], [36, 90]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
  </Node>
);

export const A3: Record<string, () => Built> = {
  S39: () => {
    const zoom = sig(1), py = sig(0), px = sig(0), nm = sig(0), hd = sig(0);
    return {
      drift: false,
      base: <Node>
        <Loc act="2b" />
        <Photo name="bramah-lock.jpg" x={PX} y={-10} w={1100} h={720} zoom={zoom} px={px} py={py} />
        {credit('bramah-lock.jpg', 1100, 720, 'Bramah lock, Otto’s Encyclopedia (public domain)')}
        <Node opacity={hd}><Block lines={['THE BRAMAH LOCK', '1780s']} x={400} y={-250} size={TY.small_label + 4} /></Node>
        <Node opacity={nm} y={() => 14 * (1 - nm())}><NameCard2 /></Node>
      </Node>,
      ambient: function* () { yield* all(hd(1, 0.7), zoom(1.3, dur('S39'), linear), px(-70, dur('S39'), linear), py(40, dur('S39'), linear)); },
      steps: [fadeIn(nm), function* () { yield* all(zoom(1.5, Math.max(1, dur('S39') - cue('S39', 1)), linear)); }],
    };
  },
  S40: () => {
    const draw = sig(0), sign = sig(0), pad = sig(0), notice = sig(0), z = sig(0), card = sig(0);
    return {
      base: <Node>
        <Loc act="2b" />
        <ShopWindow x={-230} y={60} draw={draw} sign={sign} pad={pad} card={card} />
        <Node x={610} y={60} opacity={notice} scale={() => 0.92 + 0.08 * notice()}>
          <Rect width={470} height={520} radius={12} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
          <Mono text="200" y={-170} size={96} />
          <Lab text="GUINEAS" y={-95} size={TY.label} />
          <Txt text={'to anyone who\ncan make an\ninstrument\nto pick this lock'} y={80} fontFamily="Archivo" fontWeight={500} fontSize={TY.small_label + 4} fill={C.chalk}
            textAlign="center" lineHeight={52} />
        </Node>
      </Node>,
      ambient: function* () { yield* all(draw(1, 1.6, ease), delay(1.2, sign(1, 0.7)), delay(2.6, pad(1, 0.7)), delay(3.4, card(1, 0.7))); },
      steps: [fadeIn(notice, 0.8)],
    };
  },
  S41: () => {
    const stamp = sig(0), ft = sig(0);
    const day = () => 0.5 + 0.5 * Math.sin(T() * 4.2);
    return {
      base: <Node>
        <Loc act="2b" />
        <ShopWindow x={-230} y={60} light={() => 0.6 * day()}>
          <Circle x={300} y={-180} size={70} stroke={C.chalk} lineWidth={LW.structure} opacity={day} />
          <Circle x={300} y={-180} size={50} stroke={C.chalk} lineWidth={LW.structure} lineDash={[8, 8]} opacity={() => 1 - day()} />
        </ShopWindow>
        {[0, 1, 2, 3, 4].map(k => {
          const p = () => (((T() * 2.6 + k / 5) % 1) + 1) % 1;
          return (
            <Rect x={610} y={() => 60 - 140 * p()} width={240} height={280} radius={8} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} opacity={() => 1 - p()} rotation={() => -4 * p()} />
          );
        })}
        <Rect x={610} y={-120} width={260} height={34} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.bg} />
        <Lab text="FOR DECADES" x={-864} y={-430} size={72} offset={[-1, 0]} />
        <Node opacity={stamp} x={610} y={150} rotation={-8} scale={() => 1.6 - 0.6 * stamp()}>
          <Rect width={360} height={110} radius={10} stroke={C.chalk} lineWidth={LW.emphasis} fill={C.bg} />
          <Lab text="UNPICKED" size={64} />
        </Node>
      </Node>,
      steps: [fadeIn(stamp, 0.35)],
    };
  },
  S42: () => {
    const zoom = sig(1), py = sig(0), a = sig(0), b = sig(0), hd = sig(0);
    return {
      drift: false,
      base: <Node>
        <Loc act="2b" />
        <Photo name="great-exhibition-nave.jpg" x={PX} y={-10} w={1100} h={720} zoom={zoom} py={py} />
        {credit('great-exhibition-nave.jpg', 1100, 720, 'The British nave, 1851. Library of Congress (public domain)')}
        <Node opacity={hd}><Block lines={['THE GREAT EXHIBITION', '1851']} x={400} y={-200} size={TY.small_label + 4} /></Node>
        <Node opacity={a}><Block lines={['Crystal Palace, Hyde Park', '1 May to 11 October 1851']} x={400} y={-30} size={TY.small_label} /></Node>
        <Node opacity={b}><Block lines={['≈ 6 million visits']} x={400} y={140} size={TY.number - 8} color={V} /></Node>
      </Node>,
      ambient: function* () { yield* all(hd(1, 0.7), zoom(1.3, dur('S42'), linear), py(-30, dur('S42'), linear)); },
      steps: [fadeIn(a), fadeIn(b)],
    };
  },
  S43: () => {
    const sil = sig(0), n = sig(0), r1 = sig(0), r2 = sig(0);
    return {
      base: <Node>
        <Loc act="2b" />
        <Node opacity={sil} scale={() => 1.0 + 0.02 * Math.sin(T() * 1.4)}>
          <Silhouette x={-640} y={20} s={3.0} />
        </Node>
        <Node x={240} y={-10}>
          <Rect width={900} height={420} radius={16} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} opacity={n} />
          <Lab text="ALFRED CHARLES HOBBS" y={-110} size={56} opacity={n} />
          <Sm text="American locksmith" y={-20} size={44} opacity={r1} color={C.chalk} />
          <Sm text="in London for Day & Newell, New York" y={60} size={TY.small_label + 4} color={M} opacity={r2} />
        </Node>
      </Node>,
      ambient: function* () { yield* sil(1, 0.5); yield* waitFor(Math.max(cue('S43', 0) + 1.4 - 0.5, 0)); yield* r1(1, 0.6); yield* waitFor(1.4); yield* r2(1, 0.6); },
      steps: [fadeIn(n, 0.5)],
    };
  },
  S44: () => {
    const zoom = sig(1), l = sigs(3), sw = sig(0), tx = sig(0);
    return {
      drift: false,
      base: <Node>
        <Loc act="2b" />
        <Photo name="chubb-lock-engraving.jpg" x={PX} y={-10} w={1000} h={700} zoom={zoom} />
        {credit('chubb-lock-engraving.jpg', 1000, 700, 'Chubb lock, Hobbs and Tomlinson (public domain)')}
        <Node opacity={l[0]}><Block lines={['22 JULY 1851']} x={360} y={-250} size={TY.label} /></Node>
        <Node opacity={l[1]}><Block lines={['strongroom door,', 'Westminster']} x={360} y={-120} size={TY.small_label} /></Node>
        <Node opacity={l[2]}><Block lines={['witnessed']} x={360} y={-10} size={TY.small_label} /></Node>
        <Stopwatch x={600} y={190} r={130} p={sw} />
        <Node opacity={tx}><Mono text="under 30 minutes" x={600} y={380} size={36} /></Node>
      </Node>,
      ambient: function* () { yield* all(zoom(1.12, dur('S44'), linear), l[0](1, 0.6), delay(2.4, l[1](1, 0.6)), delay(4.6, l[2](1, 0.6))); },
      steps: [function* () { yield tx(1, 0.5); yield* sw(0.42, Math.max(1.0, dur('S44') - cue('S44', 0) - 0.4), linear); }],
    };
  },
  S45: () => {
    const zoom = sig(1), a = sig(0), b = sig(0);
    return {
      drift: false,
      base: <Node>
        <Loc act="2b" />
        <Photo name="chubb-detector.jpg" x={PX} y={-10} w={1000} h={700} zoom={zoom} />
        {credit('chubb-detector.jpg', 1000, 700, 'Chubb detector lock (public domain)')}
        <Node opacity={a}><Block lines={['CHUBB DETECTOR LOCK', 'patented 1818']} x={400} y={-110} size={TY.small_label + 4} /></Node>
        <Node opacity={b}><Block lines={['shows if it has', 'been tampered with']} x={400} y={110} size={TY.small_label + 2} /></Node>
      </Node>,
      ambient: function* () { yield* all(zoom(1.14, dur('S45'), linear), delay(Math.max(cue('S45', 0) + 3.2, 0), b(1, 0.6))); },
      steps: [fadeIn(a)],
    };
  },
  S46: () => {
    const sit = sig(0);
    return {
      base: <Node>
        <Loc act="2b" />
        <ShopWindow x={-230} y={60} />
        <Node x={560} y={() => 150 + 70 * sit()}><Silhouette s={2.3} /></Node>
        <Rect x={560} y={260} width={300} height={24} radius={6} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
        <Line points={[[430, 272], [430, 360]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
        <Line points={[[690, 272], [690, 360]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
        <Lab text="THE BRAMAH LOCK" x={-864} y={-430} size={64} offset={[-1, 0]} />
      </Node>,
      steps: [function* () { yield* sit(1, D('S46', 0, 1.0), ease); }],
    };
  },
  S47: () => {
    const ch = sigs(3), sq = sigs(16), ring = sig(0), l16 = sig(0), l51 = sig(0);
    return {
      base: <Node>
        <Loc act="2b" />
        <Line points={[[-560, -150], [560, -150]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" opacity={() => ch[0]()} />
        {[-300, 0, 300].map((x, i) => <Chair x={x} y={-250} o={ch[i]} />)}
        <Lab text="3 ARBITRATORS" x={0} y={-60} size={TY.small_label + 6} color={M} opacity={() => ch[2]()} />
        {sq.map((s, k) => (
          <Rect x={-760 + (k % 8) * 62 + 30} y={120 + Math.floor(k / 8) * 62} width={52} height={52} radius={6} stroke={C.chalk} lineWidth={LW.hairline + 1}
            fill={() => rgba(V, 0.8 * s())} />
        ))}
        <Node opacity={l16}><Mono text="16 days" x={-480 + 30} y={280} size={56} /></Node>
        <Stopwatch x={400} y={170} r={140} p={ring} hand={false} />
        <Node opacity={l51}><Mono text="51 hours" x={400} y={375} size={56} /></Node>
      </Node>,
      ambient: function* () { yield* all(...ch.map((c, i) => delay(0.1 + 0.3 * i, c(1, 0.5)))); },
      steps: [
        function* () { yield* all(...ch.map(c => c(1, 0.3))); },
        function* () { yield l16(1, 0.4); yield* all(...sq.map((s, k) => delay(k * 0.09, s(1, 0.2)))); },
        function* () { yield l51(1, 0.4); for (let k = 1; k <= 5; k++) yield* ring(k / 5, 0.4, ease); },
      ],
    };
  },
  S48: () => {
    const open = sig(0), flash = sig(0), und = sig(0), purse = sig(0), sil = sig(1);
    return {
      base: <Node>
        <Loc act="2b" />
        <ShopWindow x={-230} y={60} open={open} flash={flash} card={0} />
        <Node x={560} y={150}><Silhouette s={2.3} /></Node>
        <Node opacity={und}><Lab text="OPENED · UNDAMAGED" x={-230} y={-430} size={64} /></Node>
        <Node x={() => -230 + 790 * purse()} y={() => 120 - 90 * Math.sin(Math.PI * purse())} opacity={() => (purse() > 0 ? 1 : 0)}>
          <Circle size={100} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
          <Line points={[[-26, -40], [0, -62], [26, -40]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
          <Mono text="200" size={34} y={4} />
        </Node>
        <Node opacity={() => clamp(purse() * 3 - 2)}><Lab text="200 GUINEAS" x={560} y={-170} size={TY.small_label + 8} /></Node>
      </Node>,
      steps: [
        function* () { yield flash(1, 0.15); yield open(1, 0.3, ease); yield und(1, 0.5); yield* flash(0, 0.8); },
        function* () { yield* purse(1, D('S48', 1, 1.3), ease); },
      ],
    };
  },
  S49: () => {
    const zoom = sig(1), hd = sig(0), b = sigs(3);
    const texts = ['never watched him work', 'apparatus fixed to the woodwork', 'not a real door'];
    return {
      drift: false,
      base: <Node>
        <Loc act="2b" />
        <Photo name="bramah-diagram.jpg" x={PX} y={-10} w={1000} h={700} zoom={zoom} />
        {credit('bramah-diagram.jpg', 1000, 700, 'Bramah lock, fig. 34, Hobbs and Tomlinson (public domain)')}
        <Node opacity={hd}><Block lines={["BRAMAH'S FIRM PROTESTED"]} x={330} y={-250} size={TY.small_label + 2} /></Node>
        {texts.map((t, i) => <Node opacity={b[i]} y={() => 12 * (1 - b[i]())}><Block lines={[t]} x={330} y={-110 + i * 130} size={TY.small_label + 2} /></Node>)}
      </Node>,
      ambient: function* () { yield* all(hd(1, 0.7), zoom(1.14, dur('S49'), linear)); },
      steps: [fadeIn(b[0]), fadeIn(b[1]), fadeIn(b[2])],
    };
  },
  S50: () => {
    const zoom = sig(1), head = sig(0), col = sig(0);
    return {
      drift: false,
      base: <Node>
        <Loc act="2b" />
        <Photo name="great-exhibition-machinery.jpg" x={PX} y={-10} w={1100} h={700} zoom={zoom} />
        {credit('great-exhibition-machinery.jpg', 1100, 700, 'Moving Machinery, 1854 (public domain)')}
        <Node opacity={head}><Backed text="THE GREAT LOCK CONTROVERSY" x={PX} y={220} font="label" size={52} anchor={[0, 0]} /></Node>
        <Node opacity={col} y={() => 14 * (1 - col())}>
          <Rect x={640} y={-30} width={420} height={420} radius={8} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
          {[-150, -110, -70].map(y => <Line points={[[500, y - 20], [780, y - 20]]} stroke={C.grid} lineWidth={LW.structure} lineCap="round" />)}
          <Txt text={'“no feature of the\nExhibition drew\nmore attention”'} x={640} y={50} fontFamily="Archivo" fontWeight={600} fontSize={TY.small_label + 6} fill={C.chalk} textAlign="center" lineHeight={54} />
        </Node>
      </Node>,
      ambient: function* () { yield zoom(1.12, dur('S50'), linear); },
      steps: [fadeIn(head), fadeIn(col)],
    };
  },
  S51: () => {
    const crack = sig(0), star = sig(0);
    const flag = (x: number, children: any, o: any = 1) => (
      <Node x={x} opacity={o}>
        <Line points={[[-230, 200], [-230, -230]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" />
        <Rect x={0} y={-120} width={420} height={250} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
        {children}
      </Node>
    );
    return {
      base: <Node>
        <Loc act="2b" />
        {flag(-370, <Line closed points={[[-90, 20], [-70, -80], [-30, -30], [0, -100], [30, -30], [70, -80], [90, 20]]} y={-120} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" />)}
        <Lab text="INVIOLABLE" x={-370 + 0} y={270} size={64} />
        {flag(370, <Line closed points={[[0, -90], [26, -28], [90, -24], [42, 16], [58, 80], [0, 44], [-58, 80], [-42, 16], [-90, -24], [-26, -28]]} y={-120} stroke={C.chalk} lineWidth={LW.structure} lineJoin="round" scale={0.8} />, star)}
        <Node opacity={star}><Lab text="OPENED" x={370} y={270} size={64} /></Node>
        <Line points={[[-520, -240], [-450, -150], [-500, -110], [-420, -30], [-470, 10]]} stroke={M} lineWidth={LW.emphasis + 2} lineCap="round" lineJoin="round" end={crack} />
      </Node>,
      steps: [function* () { yield* all(crack(1, 0.8, ease), delay(0.4, star(1, 0.6))); }],
    };
  },
  S52: () => {
    const b = sig(0), c = sig(0), bm = sig(0), cm = sig(0);
    const XS = [-570, 0, 570];
    return {
      base: <Node>
        <Loc act="2b" />
        {/* Bramah: sliders around a barrel */}
        <Node x={XS[0]} y={-30} opacity={() => b() * (1 - 0.55 * bm())}>
          <Circle size={260} stroke={() => (bm() > 0.5 ? M : C.chalk)} lineWidth={LW.structure} />
          {Array.from({length: 8}, (_, k) => {
            const a = (k / 8) * Math.PI * 2;
            return <Line points={[[Math.cos(a) * 60, Math.sin(a) * 60], [Math.cos(a) * 118, Math.sin(a) * 118]]} stroke={() => (bm() > 0.5 ? M : C.chalk)} lineWidth={LW.emphasis} lineCap="round" />;
          })}
          <Circle size={40} stroke={() => (bm() > 0.5 ? M : C.chalk)} lineWidth={LW.structure} />
        </Node>
        {/* Chubb: levers */}
        <Node x={XS[1]} y={-30} opacity={() => c() * (1 - 0.55 * cm())}>
          <Rect width={300} height={240} radius={10} stroke={() => (cm() > 0.5 ? M : C.chalk)} lineWidth={LW.structure} />
          {[-80, -30, 20, 70].map((y, k) => <Line points={[[-110, y], [110 - k * 14, y]]} stroke={() => (cm() > 0.5 ? M : C.chalk)} lineWidth={LW.emphasis} lineCap="round" />)}
          <Circle x={-110} y={-5} size={26} stroke={() => (cm() > 0.5 ? M : C.chalk)} lineWidth={LW.structure} />
        </Node>
        <Cyl x={XS[2] - 20} y={-80} s={0.3} key={0} bolt={0} />
        <Lab text="BRAMAH: SLIDERS" x={XS[0]} y={150} size={TY.small_label + 4} />
        <Lab text="CHUBB: LEVERS" x={XS[1]} y={150} size={TY.small_label + 4} opacity={c} />
        <Lab text="YOUR DOOR: PINS" x={XS[2]} y={150} size={TY.small_label + 4} color={V} />
        <Sm text="not a pin lock" x={XS[0]} y={205} color={M} opacity={bm} />
        <Sm text="not a pin lock" x={XS[1]} y={205} color={M} opacity={cm} />
      </Node>,
      ambient: function* () { yield* b(1, 0.6); },
      steps: [function* () { yield* bm(1, 0.5); }, function* () { yield c(1, 0.5); yield* delay(0.5, cm(1, 0.5)); }],
    };
  },
  S53: () => {
    const run = sig(1), st = sigs(5), cr = sigs(5);
    return {
      base: <Node>
        <Loc act="2b" />
        <Line points={[[-900, 150], [900, 150]]} stroke={C.grid} lineWidth={LW.emphasis} lineCap="round" lineDash={[30, 22]} lineDashOffset={() => T() * 60} />
        {[0, 1, 2, 3, 4].map(i => (
          <Node x={() => -700 + i * 350 + 1500 * run()} y={() => 30 + 5 * Math.sin(T() * 2 + i)}>
            <Padlock s={1.1} />
            <Node opacity={() => clamp(st[i]())} scale={() => 1 + 1.1 * (1 - clamp(st[i]()))} y={110} rotation={-8}>
              <Rect width={300} height={82} radius={8} stroke={C.chalk} lineWidth={LW.emphasis} fill={C.bg} />
              <Lab text="UNPICKABLE" size={36} spacing={2} />
              <Line points={[[-60, -40], [-20, -6], [-54, 20], [10, 40]]} stroke={M} lineWidth={LW.emphasis} lineCap="round" lineJoin="round" end={cr[i]} />
            </Node>
          </Node>
        ))}
      </Node>,
      ambient: function* () { yield* run(0, 3.0, easeOutCubic); },
      steps: [
        function* () { yield* all(...st.map((s, i) => delay(i * 0.45, s(1, 0.2, easeOutCubic)))); },
        function* () { yield* all(...cr.map((s, i) => delay(i * 0.35, s(1, 0.4)))); },
      ],
    };
  },
  S54: () => {
    const p = sig(0), q = sig(0);
    return {
      drift: false,
      base: <Node>
        <Loc act="2b" />
        <Stopwatch x={0} y={20} r={300} p={() => ((T() / 6) % 1)} hand={true} />
        <Padlock y={30} s={1.7} />
        <Lab text="HOW LONG?" y={-420 + 0} x={-560} size={88} opacity={q} />
      </Node>,
      steps: [to(q, 1, 0.5)],
    };
  },
};

// Hobbs name card for S39 (Bramah)
function NameCard2() {
  return (
    <Node x={580} y={90}>
      <Rect width={480} height={320} radius={16} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
      <Silhouette x={0} y={-80} s={1.0} />
      <Lab text="JOSEPH BRAMAH" y={50} size={44} />
      <Sm text="mechanic and inventor" y={105} color={M} />
    </Node>
  );
}
