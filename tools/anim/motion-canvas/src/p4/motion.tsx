// P4 scene runner: the shared play() bound to episodes/p4-lock/scenes/scenes.json, plus the board-still wrapper.
import {Node, Rect, View2D} from '@motion-canvas/2d';
import {ThreadGenerator} from '@motion-canvas/core';
import RAW from '../../../../../episodes/p4-lock/scenes/scenes.json';
import {Built, play, PlayOpts, sceneMeta} from '../lib/motion';
import {C, LW, Small} from '../lib/parts';

// Scene boundaries snap to whole frames with round-half-to-even, the rule Python's round() uses in
// tools/anim/composite_heroes.py and the assembly scripts. play() rounds with Math.round (halves up), which put
// S03 and S20 one frame off when their end time fell on exactly half a frame. Cues are relative and unchanged.
const FPS = 30;
const rhe = (x: number) => {
  const f = Math.floor(x);
  return Math.abs(x - f - 0.5) < 1e-6 ? (f % 2 === 0 ? f : f + 1) : Math.round(x);
};
const SCENES = {...RAW, scenes: (RAW as any).scenes.map((s: any) => ({...s, start: rhe(s.start * FPS) / FPS, end: rhe(s.end * FPS) / FPS}))};

export const meta = (id: string) => sceneMeta(id, SCENES);
export const cue = (id: string, i: number) => meta(id).cues[i] as number;
export const dur = (id: string) => meta(id).end - meta(id).start;

export function* play4(view: View2D, id: string, build: () => Built, opts: PlayOpts = {}): ThreadGenerator {
  yield* play(view, id, build, {...opts, scenes: SCENES, keep: true});
}

// Board still: the scene's key pose = last cue + 1.6 s (or an override), on the slate background.
const KEY: Record<string, number> = {S16: 7.4, S19: 4.4, S12: 6.5};
export const keyTime = (id: string) => {
  if (KEY[id] !== undefined) return KEY[id];
  const m = meta(id);
  return Math.min(Math.max(...m.cues) + 1.6, m.end - m.start - 0.1);
};
const UNDER: Record<string, string> = {
  S00b: 'HERO L1 hook (3D)', S07: 'HERO L1 hook (3D)', S12: 'HERO L1 wrong (3D)', S19: 'HERO L1 master (3D)',
  S57: 'HERO L1 tolerance (3D)', S59: 'HERO L1 spool (3D)', S69: 'HERO L1 hook (3D)',
};

export function* board(view: View2D, id: string, build: () => Built): ThreadGenerator {
  view.fill(C.bg);
  const m = meta(id);
  if (m.tool === 'blender' || m.tool === 'footage') {
    view.add(<Node>
      <Rect width={1700} height={900} radius={20} stroke={C.grid} lineWidth={LW.hairline} lineDash={[16, 12]} />
      <Small text={`${UNDER[id]} plays underneath this 2D overlay`} y={40} color={C.muted} />
    </Node>);
  }
  view.add(<Small text={`${id}  ·  ${m.tool}  ·  t = ${keyTime(id).toFixed(1)} s`} x={-930} y={512} color={C.muted} size={26} offset={[-1, 0]} />);
  yield* play4(view, id, build, {until: keyTime(id), transparent: true});
}
