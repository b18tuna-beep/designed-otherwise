import {Circle, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, linear, loop, sequence, waitFor} from '@motion-canvas/core';
import tokens from '../../../../../style/tokens.json';

// 5 second toolchain test: refrigerant loop, evaporator (cold), condenser (heat),
// heat-flow arrows. Uses the fixed color meanings from style/style-bible.md.
export default makeScene2D(function* (view) {
  const C = tokens.color;
  const L = tokens.line_px_1080p;
  view.fill(C.bg);

  const loopPath = createRef<Rect>();
  const evap = createRef<Rect>();
  const cond = createRef<Rect>();
  const title = createRef<Txt>();
  const clock = createRef<Txt>();
  const p = createSignal(0);

  view.add(
    <>
      <Txt ref={title} text="MOTION CANVAS · TOOLCHAIN TEST" y={-440} fontFamily="Archivo" fontWeight={600}
        fontSize={tokens.type_px_1080p.label} letterSpacing={6} fill={C.chalk} opacity={0} />
      <Rect ref={loopPath} width={1080} height={500} radius={70} stroke={C.refrigerant} lineWidth={L.emphasis} end={0} />
      <Rect ref={evap} x={-540} width={190} height={330} radius={18} fill={C.cold_soft} stroke={C.cold} lineWidth={L.structure} scale={0} />
      <Rect ref={cond} x={540} width={190} height={330} radius={18} fill={C.heat_soft} stroke={C.heat} lineWidth={L.structure} scale={0} />
      <Txt text="EVAPORATOR" x={-540} y={300} fontFamily="Archivo" fontWeight={600} fontSize={tokens.type_px_1080p.small_label} fill={C.cold} />
      <Txt text="CONDENSER" x={540} y={300} fontFamily="Archivo" fontWeight={600} fontSize={tokens.type_px_1080p.small_label} fill={C.heat} />
      <Circle size={30} fill={C.refrigerant} position={() => loopPath().getPointAtPercentage(p() % 1).position} opacity={() => (loopPath().end() > 0.99 ? 1 : 0)} />
      <Txt ref={clock} x={820} y={470} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={30} fill={C.muted} text="t = 0.00 s" />
    </>,
  );

  // heat flows IN to the evaporator (from food) and OUT of the condenser (to the kitchen)
  const arrowsIn = [-110, 0, 110].map(y => (
    <Line points={[[-860, y], [-660, y]]} stroke={C.heat} lineWidth={L.flow} endArrow arrowSize={22} end={0} lineCap="round" />
  ));
  const arrowsOut = [-110, 0, 110].map(y => (
    <Line points={[[660, y], [860, y]]} stroke={C.heat} lineWidth={L.flow} endArrow arrowSize={22} end={0} lineCap="round" />
  ));
  arrowsIn.forEach(a => view.add(a));
  arrowsOut.forEach(a => view.add(a));

  // frame clock, updated imperatively (reactive Txt text breaks in Revideo's renderer)
  yield (function* () {
    for (let f = 0; ; f++) {
      clock().text(`t = ${(f / 30).toFixed(2)} s`);
      yield;
    }
  })();
  yield* all(
    title().opacity(1, 0.5),
    loopPath().end(1, 1.0, easeInOutCubic),
    evap().scale(1, 0.6, easeInOutCubic),
    cond().scale(1, 0.6, easeInOutCubic),
  );
  yield p(4, 4, linear); // refrigerant keeps circulating while arrows pulse
  yield* loop(3, () =>
    all(
      sequence(0.12, ...arrowsIn.map(a => a.end(1, 0.7).to(0, 0).wait(0.3))),
      sequence(0.12, ...arrowsOut.map(a => a.end(1, 0.7).to(0, 0).wait(0.3))),
    ),
  );
  yield* waitFor(0.25);
});
