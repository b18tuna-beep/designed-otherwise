// FPI P1 storyboard v2 key poses: one still per scene (episodes/p1-refrigerator/board/scenes_src.py).
// v2 applies the external review: show the action, keep the machine findable, arrows mean heat only.
import {Circle, Img, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {
  AirLine, Bar, Bolt, C, Capillary, Card, Coil, CoilAssembly, Compressor, FridgeCut, FridgeFront, FridgeSide,
  Gauge, Hand, HeatArrow, HeatArrows, Label, LoopDiagram, LOOP, LW, MiniLoop, Moisture, Num, Particles, Shimmer,
  Small, STATION_POS, T, Thermometer, Title,
} from '../lib/parts';

type P = [number, number];
const loopPts = (n: number, w = 1100, h = 560): P[] => {
  const per = 2 * (w + h);
  return Array.from({length: n}, (_, i) => {
    let d = (i / n) * per;
    if (d < w) return [-w / 2 + d, -h / 2];
    d -= w; if (d < h) return [w / 2, -h / 2 + d];
    d -= h; if (d < w) return [w / 2 - d, h / 2];
    d -= w; return [-w / 2, h / 2 - d];
  });
};
export const stamp = (id: string, text: string) => (
  <Small text={`${id}  ·  ${text}`} x={-930} y={500} color={C.muted} size={26} offset={[-1, 0]} />
);
// a pipe segment with walls; liquid fill 0..1 and optional bubbles/particles inside
const Pipe = ({x = 0, y = 0, w = 800, h = 90, liquid = 1, bubbles = [] as P[], vapor = [] as P[]}: any) => (
  <Node x={x} y={y}>
    <Rect width={w} height={h} radius={h / 2} fill={C.refrigerant_soft} stroke={C.chalk} lineWidth={LW.structure} />
    {liquid > 0 ? <Rect x={-w / 2 + (w * liquid) / 2 + 4} width={w * liquid - 8} height={h - 16} radius={(h - 16) / 2} fill={C.refrigerant} /> : null}
    {bubbles.map(([bx, by]) => <Circle x={bx} y={by} size={24} fill={C.refrigerant_soft} stroke={C.refrigerant} lineWidth={3} />)}
    {vapor.map(([vx, vy]) => <Circle x={vx} y={vy} size={18} fill={C.refrigerant} />)}
  </Node>
);

export const BOARD: Record<string, () => any> = {
  // ---------------------------------------------------------------- 1. cold open: one fridge, investigated
  S01: () => (
    <Node>
      <FridgeCut x={-330} y={0} s={0.98} warmSides machineDim={0.25} />
      <Shimmer x={-640} y={-120} n={3} h={190} />
      <Shimmer x={-20} y={-120} n={3} h={190} />
      <Label text="cold inside" x={-330} y={-465} color={C.cold} size={36} />
      <Label text="warm outside" x={-330} y={470} color={C.heat} size={36} />
      <Title text={'Why does your fridge\nheat up to keep\nfood cold?'} x={560} y={0} size={70} lineHeight={92} />
    </Node>
  ),
  S02: () => (
    <Node>
      <Img src="/src/p1/renders/S02.png" width={1920} height={1080} />
      <Hand x={90} y={-60} s={0.9} rotation={-8} />
      <Small text="(3D: intact side panel, warm to the touch; grille glows)" y={-470} color={C.chalk} />
    </Node>
  ),
  S03: () => (
    <Node>
      <FridgeSide x={-480} y={20} />
      <Rect x={-330} y={20} width={14} height={600} fill={C.heat} opacity={0.85} radius={7} />
      <Line points={[[-322, -40], [-150, -40]]} stroke={C.chalk} lineWidth={LW.structure} />
      <Thermometer x={-90} y={-20} level={0.78} color={C.heat_peak} />
      <Num text="> 50 °C" x={140} y={-150} size={110} color={C.heat_peak} offset={[-1, 0]} />
      <Num text="≈ 120 °F" x={140} y={-30} size={70} offset={[-1, 0]} />
      <Label text="some models, in a hot room" x={140} y={80} size={T.label} offset={[-1, 0]} />
    </Node>
  ),
  S04: () => (
    <Node>
      <FridgeCut x={-560} y={20} s={0.75} heater="on" />
      <Rect x={-560} y={-290} width={420} height={230} stroke={C.chalk} lineWidth={LW.hairline} radius={12} />
      <Line points={[[-350, -290], [40, -260]]} stroke={C.chalk} lineWidth={LW.hairline} />
      <CoilAssembly x={420} y={-60} w={620} h={260} heater="on" />
      <Label text="COLD COIL" x={420} y={-260} color={C.cold} />
      <Label text="HEATER" x={420} y={210} color={C.heat} />
    </Node>
  ),
  // ---------------------------------------------------------------- 2. cold is not a thing
  S05: () => (
    <Node>
      <FridgeCut x={-420} y={30} s={0.85} />
      <Line points={[[-215, -330], [60, -470]]} stroke={C.chalk} lineWidth={LW.structure} />
      <HeatArrows from={[260, 60]} to={[-160, 60]} n={3} gap={90} />
      <Title text="“Let the cold out.”" x={420} y={-300} size={64} />
      <Line points={[[160, -300], [680, -300]]} stroke={C.chalk} lineWidth={LW.emphasis} />
      <Label text="heat gets in" x={420} y={230} color={C.heat} />
    </Node>
  ),
  S06: () => (
    <Node>
      <Rect x={-280} y={20} width={400} height={300} radius={20} fill={C.heat_soft} stroke={C.heat} lineWidth={LW.structure} />
      <Rect x={280} y={20} width={400} height={300} radius={20} fill={C.cold_soft} stroke={C.cold} lineWidth={LW.structure} />
      <HeatArrows from={[-170, 20]} to={[170, 20]} n={3} gap={80} />
      <Thermometer x={-280} y={-260} h={200} level={0.85} color={C.heat} scale={0.8} />
      <Thermometer x={280} y={-260} h={200} level={0.25} color={C.cold} scale={0.8} />
      <Label text="hotter" x={-280} y={230} color={C.heat} />
      <Label text="colder" x={280} y={230} color={C.cold} />
      <Label text="On its own: hotter to colder" y={380} />
    </Node>
  ),
  S07: () => (
    <Node>
      <Hand x={0} y={20} s={1.2} />
      <Node x={-520} y={40}>
        <Rect width={180} height={220} radius={[0, 0, 30, 30]} stroke={C.chalk} lineWidth={LW.structure} fill={C.heat_soft} />
        <Circle x={-120} size={120} startAngle={90} endAngle={270} stroke={C.chalk} lineWidth={LW.structure} />
        <Shimmer y={-190} n={3} h={90} />
        <Small text="hot mug" y={170} color={C.chalk} />
      </Node>
      <HeatArrows from={[-400, 40]} to={[-150, 40]} n={2} gap={70} />
      <Node x={520} y={40}>
        <Rect width={160} height={250} radius={[0, 0, 16, 16]} stroke={C.cold} lineWidth={LW.structure} fill={C.cold_soft} />
        <Small text="cold drink" y={180} color={C.chalk} />
      </Node>
      <HeatArrows from={[150, 40]} to={[410, 40]} n={2} gap={70} />
      <Label text="the hand is losing heat to the drink" y={-380} size={40} />
    </Node>
  ),
  S08: () => (
    <Node>
      <FridgeCut x={0} y={20} />
      <HeatArrow from={[-110, -50]} to={[-60, -260]} />
      <HeatArrow from={[60, 20]} to={[40, -260]} />
      <Label text="removes heat" x={560} y={-300} color={C.heat} />
      <Small text="heat goes to the cold coil" x={560} y={-240} color={C.chalk} />
    </Node>
  ),
  S09: () => (
    <Node>
      <Rect x={-520} y={-250} width={700} height={330} radius={30} fill={C.heat_soft} opacity={0.4} />
      <Label text="KITCHEN · warmer" x={-520} y={-370} color={C.heat} />
      <Line points={[[-760, -100], [500, 300]]} stroke={C.chalk} lineWidth={LW.structure} />
      <FridgeCut x={680} y={150} s={0.5} />
      <Label text="INSIDE · colder" x={680} y={-140} color={C.cold} />
      <Circle x={420} y={230} size={70} fill={C.heat} />
      <Small text="heat won't climb back up on its own" x={-80} y={240} color={C.chalk} />
      <Small text="Clausius statement · second law of thermodynamics" x={-500} y={430} color={C.muted} offset={[-1, 0]} />
    </Node>
  ),
  S10: () => (
    <Node>
      <Rect x={-520} y={-250} width={700} height={330} radius={30} fill={C.heat_soft} opacity={0.4} />
      <Label text="KITCHEN" x={-520} y={-370} color={C.heat} />
      <Line points={[[-760, -100], [500, 300]]} stroke={C.chalk} lineWidth={LW.structure} />
      <FridgeCut x={680} y={150} s={0.5} />
      <Rect x={60} y={120} width={190} height={130} radius={30} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} rotation={17} />
      <Bolt x={60} y={290} s={1} />
      <Circle x={-300} y={-60} size={70} fill={C.heat} />
      <HeatArrow from={[380, 220]} to={[-230, -30]} />
      <Label text="HEAT PUMP" x={60} y={-20} />
    </Node>
  ),
  // ---------------------------------------------------------------- 3. the loop
  S11: () => (
    <Node>
      <LoopDiagram zones labels={false} bolt={false} lit={[]} />
      <Particles points={loopPts(1).map(() => [-250, -280] as P)} size={34} />
      <Label text="REFRIGERANT" y={-40} color={C.refrigerant} />
      <Small text="one sealed loop, one drop to follow" y={20} />
    </Node>
  ),
  S12: () => (
    <Node>
      {[-440, 440].map((x, i) => (
        <Node x={x}>
          <Pipe y={140} w={600} h={110} liquid={1} bubbles={i ? [[-180, -10], [-60, 15], [60, -12], [170, 10], [0, -20]] as P[] : []} />
          <Gauge y={-120} v={i ? 0.15 : 0.85} />
          <Thermometer x={230} y={-150} h={240} level={i ? 0.2 : 0.75} color={i ? C.cold : C.heat} scale={0.7} />
          <Label text={i ? 'LOW PRESSURE' : 'HIGH PRESSURE'} y={-330} size={36} />
          <Label text={i ? 'lower boiling temperature' : 'higher boiling temperature'} y={300} size={36} color={i ? C.cold : C.heat} />
          <Small text="boiling temperature" x={230} y={40} color={C.chalk} />
        </Node>
      ))}
      <Line points={[[0, -380], [0, 380]]} stroke={C.grid} lineWidth={LW.hairline} />
    </Node>
  ),
  S13: () => (
    <Node>
      <Thermometer x={-420} y={-20} level={0.28} color={C.cold} />
      <Line points={[[-520, -60], [-320, -60]]} stroke={C.chalk} lineWidth={LW.structure} />
      <Num text="32 °F (0 °C) water freezes" x={-280} y={-60} size={36} offset={[-1, 0]} />
      <Line points={[[-500, 60], [-340, 60]]} stroke={C.refrigerant} lineWidth={LW.emphasis} />
      <Num text="≈ 11 °F (−12 °C)" x={-280} y={50} size={50} color={C.refrigerant} offset={[-1, 0]} />
      <Label text="ISOBUTANE BOILS" x={-280} y={120} color={C.refrigerant} size={36} offset={[-1, 0]} />
      <Label text="at ordinary air pressure" x={-280} y={175} size={36} offset={[-1, 0]} />
      <Node x={600} y={100}>
        <Line points={[[-90, -170], [-90, 60], [-120, 150], [120, 150], [90, 60], [90, -170]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Rect y={95} width={220} height={100} fill={C.refrigerant} />
        {[[-40, 80], [30, 110], [0, 60], [50, 70]].map(([bx, by]) => <Circle x={bx} y={by} size={26} fill={C.refrigerant_soft} stroke={C.chalk} lineWidth={2} />)}
        <Particles points={[[-20, -10], [25, -70], [-30, -130]]} size={18} />
      </Node>
    </Node>
  ),
  S14: () => (
    <Node>
      <MiniLoop focus="evaporator" />
      <Rect x={-80} y={0} width={1200} height={560} radius={30} fill={C.cold_soft} opacity={0.35} />
      <Pipe x={-80} y={40} w={1000} h={150} liquid={0.62}
        bubbles={[[-380, 40], [-250, 30], [-120, 45], [40, 25], [130, 40]] as P[]}
        vapor={[[260, 0], [330, 20], [400, -10], [450, 15]] as P[]} />
      <Line points={[[-520, 250], [360, 250], [360, 280], [-520, 280]]} stroke={C.muted} lineWidth={6} lineDash={[14, 12]} radius={14} />
      <Small text="defrost heater (off)" x={-80} y={330} color={C.muted} />
      <HeatArrows from={[-200, -320]} to={[-200, -50]} n={3} gap={200} axis="x" />
      <Rect x={-620} y={-460} width={110} height={70} radius={12} stroke={C.chalk} lineWidth={LW.structure} />
      <Small text="heat from leftovers, air, walls and door" x={-480} y={-460} color={C.chalk} offset={[-1, 0]} />
      <Label text="EVAPORATOR: low pressure, so it boils" x={-80} y={-360} color={C.cold} size={36} />
      <Small text="liquid" x={-560} y={150} color={C.refrigerant} />
      <Small text="vapor" x={400} y={150} color={C.refrigerant} />
    </Node>
  ),
  S15: () => (
    <Node>
      <MiniLoop focus="compressor" />
      <Rect x={-80} y={20} width={520} height={360} radius={40} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} />
      <Rect x={-80} y={20} width={300} height={200} radius={10} stroke={C.chalk} lineWidth={LW.structure} />
      <Rect x={20} y={20} width={30} height={196} fill={C.chalk} />
      <Particles points={[[-200, -40], [-150, 40], [-200, 80], [-130, -10], [-170, 10]]} size={18} />
      <Particles points={[[-720, -60], [-620, 30], [-520, -40], [-680, 60]]} size={18} />
      <Pipe x={-620} y={0} w={300} h={160} liquid={0} />
      <Particles points={[[-720, -40], [-620, 30], [-520, -30], [-690, 40]]} size={18} />
      <Line points={[[200, -60], [560, -60]]} stroke={C.heat} lineWidth={40} opacity={0.35} lineCap="round" />
      <Pipe x={380} y={-60} w={360} h={70} liquid={0} vapor={[[-120, 0], [-90, 0], [-60, 0], [-30, 0], [0, 0], [30, 0]] as P[]} />
      <Bolt x={-80} y={300} s={1} />
      <Label text="COMPRESSOR squeezes vapor" x={-80} y={-260} />
      <Small text="still vapor, now high pressure and hot" x={420} y={60} color={C.chalk} />
    </Node>
  ),
  S16: () => (
    <Node>
      {[-560, 0, 560].map((x, i) => (
        <Node x={x} y={-20}>
          <FridgeSide w={260} h={560} />
          {i === 0 ? <Line points={[[140, -200], [160, -150], [140, -100], [160, -50], [140, 0], [160, 50], [140, 100], [160, 150]]} stroke={C.heat} lineWidth={LW.structure} /> : null}
          {i === 1 ? <Node><Line points={[[-120, -240], [-120, 160]]} stroke={C.heat} lineWidth={LW.emphasis} /><Line points={[[120, -240], [120, 160]]} stroke={C.heat} lineWidth={LW.emphasis} /></Node> : null}
          {i === 2 ? <Node><Coil x={-40} y={220} w={120} h={70} turns={2} color={C.heat} fill={C.heat_soft} /><Circle x={70} y={220} size={60} stroke={C.chalk} lineWidth={LW.hairline} /></Node> : null}
          <Small text={['back coil', 'in the side walls', 'bottom, fan-cooled'][i]} y={340} color={C.chalk} />
        </Node>
      ))}
      <Label text="CONDENSER: three common places" y={-400} color={C.heat} />
    </Node>
  ),
  S17: () => (
    <Node>
      <MiniLoop focus="condenser" />
      <Coil x={-120} y={40} w={380} h={560} turns={0} color={C.heat} fill={C.heat_soft} />
      <Pipe x={-120} y={200} w={300} h={70} liquid={0} vapor={[[-80, 0], [0, 0], [80, 0]] as P[]} />
      <Pipe x={-120} y={20} w={300} h={70} liquid={0.45} vapor={[[60, 0], [110, 0]] as P[]} />
      <Pipe x={-120} y={-160} w={300} h={70} liquid={1} />
      <Small text="in from the compressor" x={-120} y={370} color={C.chalk} />
      <Small text="out to the capillary tube" x={-120} y={-300} color={C.chalk} />
      <HeatArrows from={[90, 20]} to={[420, 20]} n={3} gap={150} />
      <Label text="CONDENSER" x={-120} y={-400} color={C.heat} />
      <Label text="vapor turns to liquid" x={-560} y={20} size={36} offset={[0, 0]} />
      <Small text="hotter than the room, so heat leaves" x={560} y={240} color={C.heat} />
    </Node>
  ),
  S18: () => (
    <Node>
      <MiniLoop focus="capillary" />
      <Pipe x={560} y={0} w={560} h={150} liquid={1} />
      <Rect x={0} y={0} width={620} height={40} radius={20} fill={C.refrigerant} stroke={C.chalk} lineWidth={LW.structure} />
      <Pipe x={-560} y={0} w={560} h={150} liquid={0.75} bubbles={[[-60, 0], [40, -20], [120, 10], [180, -15]] as P[]} />
      <Label text="CAPILLARY TUBE: a long, very narrow bore" y={-200} />
      <Label text="HIGH PRESSURE" x={560} y={140} size={36} />
      <Label text="LOW PRESSURE" x={-560} y={140} size={36} />
      <Small text="to the evaporator" x={-560} y={190} color={C.chalk} />
      <Gauge x={560} y={330} v={0.85} />
      <Gauge x={-560} y={330} v={0.15} />
    </Node>
  ),
  S19: () => (
    <Node>
      <MiniLoop focus="capillary" focus2="compressor" />
      <Pipe x={0} y={60} w={1500} h={110} liquid={0} vapor={[[-500, 30], [-250, 30], [0, 30], [250, 30], [500, 30]] as P[]} />
      <Pipe x={0} y={-15} w={1500} h={40} liquid={1} />
      <Rect x={0} y={5} width={1400} height={10} radius={5} fill={C.chalk} />
      <Small text="solder joint" x={760} y={5} color={C.chalk} offset={[-1, 0]} />
      {[-450, -150, 150, 450].map(x => <HeatArrow from={[x, -20]} to={[x, 45]} width={LW.structure} />)}
      <Small text="capillary tube: warm liquid" x={-750} y={-80} color={C.chalk} offset={[-1, 0]} />
      <Small text="suction line to the compressor: cold vapor" x={-750} y={160} color={C.chalk} offset={[-1, 0]} />
    </Node>
  ),
  S20: () => (
    <Node>
      <LoopDiagram zones heatIn heatOut />
      <Particles points={loopPts(14)} size={18} />
    </Node>
  ),
  S21: () => (
    <Node>
      <MiniLoop focus="evaporator" focus2="compressor" />
      <Bar x={-560} h={300} color={C.heat} label="heat removed from inside" />
      <Label text="+" x={-360} y={230} size={80} />
      <Bar x={-160} h={170} color={C.electric} label="electricity in" />
      <Label text="=" x={60} y={230} size={80} />
      <Node x={380}>
        <Rect y={380 - 150} width={160} height={300} fill={C.heat} />
        <Rect y={380 - 300 - 85} width={160} height={170} fill={C.heat} stroke={C.electric} lineWidth={LW.structure} />
        <Small text="heat into the kitchen" y={420} color={C.chalk} />
      </Node>
      <Label text="Energy is conserved" x={-200} y={-380} />
    </Node>
  ),
  S22: () => (
    <Node>
      <Small text="per unit of electricity, on a standard compressor test" y={-380} color={C.chalk} />
      <Node y={-150}>
        <Label text="electricity in" x={-760} offset={[-1, 0]} size={36} />
        <Rect x={-200 + 160} width={320} height={80} radius={8} fill={C.electric} />
      </Node>
      <Node y={80}>
        <Label text="heat removed from inside" x={-760} offset={[-1, 0]} size={36} color={C.heat} />
        <Rect x={-200 + 224} width={448} height={80} radius={8} fill={C.heat} />
        <Rect x={-200 + 448 + 96} width={192} height={80} radius={8} fill={C.heat} opacity={0.35} />
        <Line points={[[248, 70], [248, 110], [440, 110], [440, 70]]} stroke={C.chalk} lineWidth={LW.structure} />
        <Num text="≈ 1.4 to 2" x={344} y={160} size={44} />
      </Node>
      {[0, 1, 2].map(i => (
        <Node x={-200 + i * 320}>
          <Line points={[[0, -220], [0, 150]]} stroke={C.grid} lineWidth={LW.hairline} />
          <Num text={`${i}`} y={-250} size={34} color={C.muted} />
        </Node>
      ))}
    </Node>
  ),
  // ---------------------------------------------------------------- 4. why it must run hot
  S23: () => (
    <Node>
      <LoopDiagram zones x={-280} scale={0.7} lit={['condenser']} heatOut />
      <Thermometer x={500} y={-60} h={360} level={0.85} color={C.heat} scale={0.8} />
      <Thermometer x={720} y={-60} h={360} level={0.45} color={C.chalk} scale={0.8} />
      <Small text="condenser" x={500} y={230} color={C.heat} />
      <Small text="kitchen air" x={720} y={230} color={C.chalk} />
      <Label text="the condenser must be hotter than the room" x={0} y={-430} size={40} />
    </Node>
  ),
  S24: () => (
    <Node>
      <Coil x={-320} y={-20} w={460} h={460} color={C.heat} fill={C.heat_soft} turns={8} />
      {[[-480, -150], [-330, -60], [-420, 80], [-230, 130], [-370, -200], [-260, 10]].map(([x, y]) => <Rect x={x} y={y} width={120} height={22} radius={11} fill={C.muted} opacity={0.75} />)}
      <AirLine from={[-800, -40]} to={[-560, -40]} opacity={0.5} />
      <AirLine from={[-80, -40]} to={[60, -40]} opacity={0.25} />
      <Node x={480} y={-200}>
        <Small text="compressor run time" y={-50} color={C.chalk} />
        <Rect x={-170} width={320} height={34} radius={17} fill={C.electric} offset={[-1, 0]} />
        <Rect x={150} width={180} height={34} radius={17} fill={C.electric} opacity={0.45} offset={[-1, 0]} />
        <Small text="longer" x={250} y={50} color={C.chalk} />
      </Node>
      <Card x={480} y={180} w={780} h={220}>
        <Label text="Hotpoint: clean the coils" y={-50} size={36} />
        <Label text="at least once a year" y={0} size={36} />
        <Small text="some models don't need routine cleaning" y={60} color={C.chalk} />
      </Card>
    </Node>
  ),
  S25: () => (
    <Node>
      {[-460, 460].map((x, i) => (
        <Node x={x} y={20}>
          <Line points={[[-300, 220], [-300, -220], [300, -220], [300, 220]]} stroke={C.muted} lineWidth={LW.emphasis} />
          <Rect y={i ? 30 : -10} width={i ? 440 : 570} height={i ? 300 : 380} fill={C.panel} stroke={C.chalk} lineWidth={LW.structure} radius={10} />
          <Small text="FRONT (door)" y={i ? 210 : 210} color={C.chalk} />
          <Small text="wall" y={-250} color={C.muted} />
          <Line points={[[-300, -10], [i ? -220 : -285, -10]]} stroke={C.chalk} lineWidth={LW.structure} />
          <Line points={[[300, -10], [i ? 220 : 285, -10]]} stroke={C.chalk} lineWidth={LW.structure} />
          {i ? <Line points={[[0, -220], [0, -120]]} stroke={C.chalk} lineWidth={LW.structure} /> : null}
          <Label text={i ? 'Samsung: 5 cm ≈ 2 in, sides and back' : 'GE side-by-side: 1/8 in, sides only'} y={-340} size={32} />
        </Node>
      ))}
      <Label text="top view · air gaps vary by model" y={430} size={36} />
    </Node>
  ),
  S26: () => (
    <Node>
      <FridgeCut x={0} y={40} s={0.8} />
      <Rect x={-480} y={210} width={300} height={320} stroke={C.chalk} lineWidth={LW.structure} radius={10} />
      <Small text="oven" x={-480} y={410} color={C.chalk} />
      <HeatArrow from={[-330, 260]} to={[-120, 300]} />
      <Rect x={480} y={210} width={300} height={320} stroke={C.chalk} lineWidth={LW.structure} radius={10} />
      <Small text="dishwasher" x={480} y={410} color={C.chalk} />
      <HeatArrow from={[330, 260]} to={[120, 300]} />
      <Circle x={680} y={-330} size={110} fill={C.heat} opacity={0.9} />
      <Small text="sunlight" x={680} y={-240} color={C.chalk} />
      <HeatArrow from={[600, -280]} to={[260, -100]} />
      <Node x={-760} y={330}>
        {[0, 1, 2, 3].map(i => <Line points={[[-70, -30 + i * 18], [70, -30 + i * 18]]} stroke={C.chalk} lineWidth={LW.structure} />)}
        <Small text="heating vent" y={70} color={C.chalk} />
      </Node>
      <HeatArrow from={[-680, 270]} to={[-250, 320]} />
      <Label text="heat around the fridge makes shedding heat harder" y={-450} size={36} />
      <Thermometer x={-700} y={-200} h={260} level={0.85} color={C.heat} scale={0.6} />
      <Thermometer x={-580} y={-200} h={260} level={0.7} color={C.chalk} scale={0.6} />
      <Small text="condenser · kitchen air" x={-640} y={-30} color={C.chalk} />
    </Node>
  ),
  // ---------------------------------------------------------------- 5. the second heater
  S27: () => (
    <Node>
      <FridgeCut x={-560} y={20} s={0.7} frost={0.3} />
      <Line points={[[-728, -280], [-880, -380]]} stroke={C.chalk} lineWidth={LW.structure} />
      <CoilAssembly x={360} y={-40} w={700} h={300} frost={0.35} heater="outline" />
      <Moisture points={[[-60, -260], [20, -200], [-40, -120], [60, -60], [-20, 40], [80, 100]]} />
      <Small text="moisture from food and from humid air when the door opens" x={360} y={300} color={C.chalk} />
      <Label text="FROST" x={360} y={-290} color={C.cold} />
    </Node>
  ),
  S28: () => (
    <Node>
      <CoilAssembly x={0} y={-20} w={760} h={340} frost={0.9} heater="outline" />
      <HeatArrow from={[-900, -80]} to={[-470, -80]} width={LW.structure} />
      <HeatArrow from={[-900, 60]} to={[-470, 60]} width={LW.hairline + 1} />
      <AirLine from={[860, 0]} to={[500, 0]} opacity={0.25} />
      <Label text="frost insulates the coil and clogs the gaps" y={-330} color={C.cold} size={40} />
      <Small text="less heat gets in" x={-680} y={170} color={C.heat} />
      <Small text="less air gets through" x={680} y={80} color={C.chalk} />
    </Node>
  ),
  S29: () => (
    <Node>
      <Img src="/src/p1/renders/S29.png" width={1920} height={1080} />
      <Small text="(3D: same coil, frost melting back, heater on, refrigerant flow paused)" y={-470} color={C.chalk} />
    </Node>
  ),
  S30: () => (
    <Node>
      <Label text="POWER WHILE ON" y={-420} />
      <Label text="two service-manual examples" y={-360} size={36} color={C.chalk} />
      <Bar x={-640} h={450 * 0.6} w={130} color={C.electric} value="≈ 450 W" label="heater, ex. 1" />
      <Bar x={-380} h={470 * 0.6} w={130} color={C.electric} value="≈ 470 W" label="heater, ex. 2" />
      <Bar x={-90} h={160 * 0.6} w={130} color={C.electric} value="120–160 W" label="compressor" />
      <Node x={500} y={40}>
        <Circle size={240} stroke={C.chalk} lineWidth={LW.structure} />
        <Circle size={240} stroke={C.heat} lineWidth={LW.emphasis} startAngle={-90} endAngle={-40} />
        <Line points={[[0, 0], [0, -90]]} stroke={C.chalk} lineWidth={LW.structure} lineCap="round" />
        <Label text="runs for minutes, then off" y={190} size={36} />
      </Node>
    </Node>
  ),
  S31: () => (
    <Node>
      <Label text="compressor running time (hours)" x={-760} y={-330} size={36} offset={[-1, 0]} />
      {[0, 25, 50, 75, 100].map(h => <Num text={`${h}`} x={-760 + h * 15} y={-260} size={34} color={C.muted} />)}
      <Line points={[[-760, -130], [760, -130]]} stroke={C.muted} lineWidth={LW.structure} />
      {Array.from({length: 13}, (_, i) => <Rect x={-760 + i * 8 * 15} y={-130} width={14} height={60} fill={C.heat} radius={4} />)}
      <Label text="older timer: about every 8 h of running" x={-760} y={-50} size={34} offset={[-1, 0]} />
      <Line points={[[-760, 170], [760, 170]]} stroke={C.muted} lineWidth={LW.structure} />
      <Line points={[[-760 + 100 * 15, 130], [-760 + 100 * 15, 210]]} stroke={C.chalk} lineWidth={LW.emphasis} />
      <Line points={[[-760 + 100 * 15 - 30, 130], [-760 + 100 * 15, 130]]} stroke={C.chalk} lineWidth={LW.emphasis} />
      <Line points={[[-760 + 100 * 15 - 30, 210], [-760 + 100 * 15, 210]]} stroke={C.chalk} lineWidth={LW.emphasis} />
      <Label text="adaptive control: up to 100+ h, with the doors shut" x={-760} y={250} size={34} offset={[-1, 0]} />
    </Node>
  ),
  S32: () => (
    <Node>
      <FridgeSide x={-120} y={0} w={420} h={780} />
      <CoilAssembly x={20} y={-230} w={120} h={110} frost={0} heater="none" s={0.9} />
      <Line points={[[80, -150], [170, -100], [170, 300], [120, 320]]} stroke={C.chalk} lineWidth={LW.structure} radius={20} />
      {[[170, -40], [170, 80], [170, 200]].map(([x, y]) => <Circle x={x} y={y} size={20} fill={C.chalk} />)}
      <Rect x={60} y={345} width={190} height={34} stroke={C.chalk} lineWidth={LW.structure} radius={[0, 0, 8, 8]} />
      <Rect x={60} y={355} width={176} height={14} fill={C.chalk} opacity={0.5} />
      <Coil x={-150} y={330} w={140} h={60} turns={2} color={C.heat} fill={C.heat_soft} />
      <HeatArrow from={[-70, 330]} to={[-10, 345]} width={LW.structure} />
      <Moisture points={[[40, 290], [80, 250], [50, 210]]} opacity={0.6} />
      <Small text="drain tube" x={300} y={60} color={C.chalk} offset={[-1, 0]} />
      <Small text="drain pan" x={300} y={360} color={C.chalk} offset={[-1, 0]} />
      <Small text="condenser" x={-150} y={430} color={C.heat} />
    </Node>
  ),
  S33: () => (
    <Node>
      <Label text="where the door seals, up close" y={-460} />
      {[-460, 460].map((x, i) => (
        <Node x={x} y={20}>
          <Rect width={620} height={560} radius={20} fill={C.panel} stroke={C.grid} lineWidth={LW.hairline} />
          <Rect x={-170} width={160} height={560} fill={C.cold_soft} opacity={0.5} />
          <Small text="inside" x={-190} y={-310} color={C.cold} />
          <Rect x={40} width={70} height={560} fill={C.bg} stroke={C.chalk} lineWidth={LW.structure} />
          <Small text="cabinet face" x={30} y={-310} color={C.chalk} />
          <Rect x={150} width={40} height={560} fill={C.muted} opacity={0.6} />
          <Small text="door seal" x={160} y={-310} color={C.chalk} offset={[-1, 0]} />
          {i
            ? <Node><Line points={[[-40, -230], [-40, 230]]} stroke={C.heat} lineWidth={10} lineCap="round" /><Bolt x={-40} y={-200} s={0.5} /></Node>
            : <Line points={[[-40, -230], [-40, 230]]} stroke={C.refrigerant} lineWidth={18} lineCap="round" />}
          <HeatArrows from={[-25, 0]} to={[30, 0]} n={3} gap={140} />
          <Moisture points={[[40, -180], [55, -150], [30, 160]]} opacity={0.25} />
          <Small text="stays dry: no condensation" x={40} y={315} color={C.chalk} />
          <Label text={i ? 'small electric heater' : 'warm refrigerant tube'} y={375} size={34} />
          {i ? <Node><Rect x={-200} y={150} width={110} height={50} radius={25} stroke={C.chalk} lineWidth={LW.structure} /><Circle x={-175} y={150} size={36} fill={C.chalk} /><Small text="energy saver switch" x={-200} y={205} color={C.chalk} /></Node> : null}
        </Node>
      ))}
    </Node>
  ),
  S34: () => (
    <Node>
      <FridgeCut x={-200} y={20} heater="on" doorEdges condenserHot />
      {[[1, -520, -340, 'defrost heater'], [2, -520, 0, 'door edges'], [3, -520, 340, 'condenser']].map(([n, x, y, t]) => (
        <Node>
          <Circle x={x as number} y={y as number} size={64} fill={C.heat} />
          <Num text={`${n}`} x={x as number} y={y as number} size={36} color={C.bg} />
          <Small text={t as string} x={(x as number) - 60} y={(y as number) + 60} color={C.chalk} />
        </Node>
      ))}
      <Label text="where the heat is" x={540} y={0} />
    </Node>
  ),
  // ---------------------------------------------------------------- 6. the bill
  S35: () => (
    <Node>
      <Label text="ENERGY STAR example" x={-200} y={-420} />
      <Label text="18 cu ft top-freezer" x={-200} y={-360} size={36} color={C.chalk} />
      <Bar x={-200} h={363 * 0.8} w={170} color={C.electric} value="" label="" />
      <Num text="363 kWh/yr" x={-310} y={380 - 363 * 0.4} size={44} offset={[1, 0]} />
      <Line points={[[-420, 380 - 404 * 0.8], [420, 380 - 404 * 0.8]]} stroke={C.chalk} lineWidth={LW.structure} lineDash={[16, 12]} />
      <Small text="federal limit 404 kWh/yr" x={250} y={380 - 404 * 0.8 - 30} color={C.chalk} />
      <Num text="≈ 10% under" x={200} y={150} size={44} />
    </Node>
  ),
  S36: () => (
    <Node>
      <Bar x={-260} h={680} w={200} color={C.electric} value="> 1,800 kWh/yr" label="1974, average new fridge" />
      <Bar x={260} h={170} w={200} color={C.electric} value="a few hundred" label="today" />
      <Num text="≈ ¼ the energy" x={260} y={0} size={52} />
    </Node>
  ),
  S37: () => (
    <Node>
      <Rect width={1600} height={820} radius={20} stroke={C.chalk} lineWidth={LW.structure} fill={C.heat_soft} opacity={0.22} />
      <Small text="one closed kitchen" x={-760} y={-370} color={C.chalk} offset={[-1, 0]} />
      <FridgeCut x={-200} y={30} s={0.75} />
      <Line points={[[-380, -290], [-560, -150]]} stroke={C.chalk} lineWidth={LW.structure} />
      <Rect x={-470} y={-60} width={120} height={180} fill={C.cold_soft} opacity={0.5} radius={40} />
      <HeatArrow from={[-640, -260]} to={[-260, -260]} />
      <HeatArrows from={[-60, 290]} to={[260, 290]} n={2} gap={60} />
      <Bolt x={-290} y={380} s={0.5} />
      <Thermometer x={620} y={-40} h={420} level={0.7} color={C.heat} />
      <Label text="room gets warmer" x={560} y={-360} color={C.heat} size={36} />
    </Node>
  ),
  // ---------------------------------------------------------------- 7. close
  S38: () => (
    <Node>
      <LoopDiagram zones heatIn heatOut extraOut labels={false} scale={0.8} />
      <Particles points={loopPts(12).map(([x, y]) => [x * 0.8, y * 0.8] as P)} size={16} />
      <Title text="It moves heat." y={-430} size={72} />
      <Small text="plus a little extra from the electricity" x={600} y={360} color={C.heat} />
    </Node>
  ),
  S39: () => (
    <Node>
      <LoopDiagram zones labels={false} scale={0.55} x={-420} y={0} lit={['condenser']} heatOut />
      <FridgeSide x={420} y={20} />
      <Line points={[[290, -240], [290, 260]]} stroke={C.heat} lineWidth={LW.emphasis} />
      <Shimmer x={230} y={-60} n={3} h={160} />
      <Label text="Much of that warmth came from inside." x={300} y={-430} color={C.heat} />
    </Node>
  ),
  S40: () => (
    <Node>
      <FridgeCut x={0} y={-60} s={0.8} warmSides />
      <Shimmer x={-240} y={-160} n={2} h={120} opacity={0.6} />
      <Shimmer x={240} y={-160} n={2} h={120} opacity={0.6} />
      <Label text="THE HIDDEN MECHANISM" y={430} size={44} spacing={10} />
      <Small text="Next time" x={620} y={430} />
    </Node>
  ),
};
