// Shared helpers and drawings for the P4 scenes (the pin tumbler lock).
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createSignal, delay, easeInOutCubic, easeOutCubic, linear, waitFor} from '@motion-canvas/core';
import {C, LW, T as TY} from '../lib/parts';
import {T} from '../lib/clock';
import {val} from '../lib/clock';
import {clamp, Lab, lerp, Locator, ACT, M, rgba, Sm, V, Mono, Backed, Silhouette, PANEL} from '../lib/lock';
import {cue, dur} from './motion';

export {all, delay, easeInOutCubic, easeOutCubic, linear, waitFor, createSignal, C, LW, TY, T, val, clamp, Lab, lerp, M, rgba, Sm, V, Mono, Backed, PANEL};
export type P = [number, number];
export const sig = createSignal;
export const ease = easeInOutCubic;
export const sigs = (n: number, v = 0) => Array.from({length: n}, () => createSignal(v));
// signal tween as a step function
export const to = (s: any, v: number, d = 0.6) => function* () { yield* s(v, d, ease); };
// time left in the scene after cue i, so a short scene still finishes its move
export const D = (id: string, i: number, want: number) => Math.max(0.25, Math.min(want, dur(id) - cue(id, i) - 0.1));
export const Loc = ({act}: {act: string}) => <Locator act={ACT[act]} />;
export {cue, dur};

// ------------------------------------------------------------------ padlock (closed/open), muted or chalk
export const Padlock = ({x = 0, y = 0, s = 1, open = 0, color = C.chalk, flash = 0, opacity = 1}: any) => (
  <Node x={x} y={y} scale={s} opacity={opacity}>
    <Line points={() => {
      const o = clamp(val(open));
      return [[-34, -44], [-34, -84 - 26 * o], [34, -84 - 26 * o], [34, -44 + 28 * o]];
    }} stroke={color} lineWidth={LW.emphasis} lineCap="round" lineJoin="round" radius={34}
      shadowColor={V} shadowBlur={() => 30 * val(flash)} />
    <Rect y={0} width={130} height={104} radius={14} stroke={color} lineWidth={LW.structure} fill={C.panel} />
    <Circle y={-8} size={22} fill={color} />
    <Line points={[[0, 0], [0, 26]]} stroke={color} lineWidth={LW.emphasis} lineCap="round" />
  </Node>
);

// ------------------------------------------------------------------ the London shop window (S00d, S40, S41, S46, S48)
// draw: frame draw-on 0..1; card: card opacity; big: 0..1 enlarges the notice; open: shackle; flash: violet flash;
// light: 0..1 day/night greys; sign: 'PICCADILLY, LONDON' plate opacity; stamp: 'unpicked'
export const WIN = {w: 900, h: 560};
export const ShopWindow = ({x = -120, y = 30, draw = 1, card = 1, big = 0, lift = 0, open = 0, flash = 0, light = 0, sign = 0, pad = 1, children = null as any}: any) => (
  <Node x={x} y={y}>
    <Rect width={WIN.w} height={WIN.h} radius={10} stroke={C.chalk} lineWidth={LW.structure} end={draw}
      fill={() => rgba(C.chalk, 0.02 + 0.07 * val(light))} />
    <Rect width={WIN.w - 60} height={WIN.h - 60} radius={4} stroke={C.chalk} lineWidth={LW.hairline} opacity={() => 0.5 * clamp(val(draw) * 2 - 1)} />
    <Line points={[[-WIN.w / 2 - 20, 214], [WIN.w / 2 + 20, 214]]} stroke={C.chalk} lineWidth={LW.emphasis} lineCap="round" end={draw} />
    {/* sign above the window */}
    <Node y={-WIN.h / 2 - 56} opacity={sign}>
      <Rect width={680} height={78} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
      <Txt text="PICCADILLY, LONDON" fontFamily="Archivo" fontWeight={600} fontSize={TY.label} letterSpacing={5} fill={C.chalk} />
    </Node>
    <Node opacity={pad}>
      <Rect x={-150} y={192} width={250} height={44} radius={20} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
      <Padlock x={-150} y={104} open={open} flash={flash} />
    </Node>
    <Node opacity={card} x={170} y={120} rotation={() => -5 - 9 * val(lift)} scale={() => 1 + 0.0 * val(big)}>
      <Rect width={270} height={180} radius={8} stroke={C.chalk} lineWidth={LW.structure} fill={C.panel} />
      <Txt text="200" y={-34} fontFamily="IBM Plex Mono" fontWeight={500} fontSize={64} fill={C.chalk} />
      <Txt text="guineas" y={34} fontFamily="Archivo" fontWeight={600} fontSize={TY.label} fill={C.chalk} />
    </Node>
    {/* a slow glint sweeps the glass */}
    <Rect width={WIN.w - 12} height={WIN.h - 12} clip>
      <Line points={[[-60, 300], [60, -300]]} x={() => -700 + ((T() * 150) % 1700)} stroke={C.chalk} lineWidth={LW.structure + 4} opacity={0.12} />
      <Line points={[[-10, 300], [110, -300]]} x={() => -700 + ((T() * 150) % 1700)} stroke={C.chalk} lineWidth={LW.hairline} opacity={0.18} />
    </Rect>
    {children}
  </Node>
);

// piecewise-linear lookup for labels that follow a moving 3D hero: keys = [[t, value], ...]
export const interp = (ks: [number, number][], t: number) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) return ks[i - 1][1] + ((ks[i][1] - ks[i - 1][1]) * (t - ks[i - 1][0])) / (ks[i][0] - ks[i - 1][0]);
  return ks[ks.length - 1][1];
};
