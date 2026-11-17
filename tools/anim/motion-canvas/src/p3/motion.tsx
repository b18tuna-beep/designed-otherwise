// P3 scene runner: the shared play() bound to episodes/p3-trees/scenes/scenes.json, plus the board-still wrapper.
import {Node, Rect, View2D} from '@motion-canvas/2d';
import {ThreadGenerator} from '@motion-canvas/core';
import SCENES from '../../../../../episodes/p3-trees/scenes/scenes.json';
import {Built, play, PlayOpts, sceneMeta} from '../lib/motion';
import {C, LW, Small} from '../lib/parts';

export const meta = (id: string) => sceneMeta(id, SCENES);
export const cue = (id: string, i: number) => meta(id).cues[i] as number;
export const dur = (id: string) => meta(id).end - meta(id).start;

export function* play3(view: View2D, id: string, build: () => Built, opts: PlayOpts = {}): ThreadGenerator {
  yield* play(view, id, build, {...opts, scenes: SCENES});
}

// Board still: the scene's key pose = last cue + 1.6 s (or an override), on the slate background.
const KEY: Record<string, number> = {S45: 4.0, S04: 6.3, S00d: 4.1, S00a: 3.0, S30: 7.6, S34: 7.0, S24: 13.0};
export const keyTime = (id: string) => {
  if (KEY[id] !== undefined) return KEY[id];
  const m = meta(id);
  return Math.min(Math.max(...m.cues) + 1.6, m.end - m.start - 0.1);
};
const UNDER: Record<string, string> = {
  S00a: 'HERO 8 (3D)',
  S03: 'HERO 1 (3D)', S20: 'HERO 2 (3D)', S26: 'HERO 3 (3D)', S27: 'HERO 4 (3D)', S35: 'HERO 5 (3D)', S43: 'HERO 6 (3D)', S46: 'HERO 7 (3D)',
  S41: 'NPS footage V1', S44: 'NPS footage V4', S45: 'NPS footage V2',
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
  yield* play3(view, id, build, {until: keyTime(id), transparent: true});
}
