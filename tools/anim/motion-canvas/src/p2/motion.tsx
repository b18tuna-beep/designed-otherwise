// P2 scene runner: the shared play() bound to episodes/p2-ear/scenes/scenes.json, plus the board-still wrapper.
import {Node, Rect, View2D} from '@motion-canvas/2d';
import {ThreadGenerator} from '@motion-canvas/core';
import SCENES from '../../../../../episodes/p2-ear/scenes/scenes.json';
import {Built, play, PlayOpts, sceneMeta} from '../lib/motion';
import {C, LW, Small} from '../lib/parts';

export const meta = (id: string) => sceneMeta(id, SCENES);
export const cue = (id: string, i: number) => meta(id).cues[i] as number;
export const dur = (id: string) => meta(id).end - meta(id).start;

export function* play2(view: View2D, id: string, build: () => Built, opts: PlayOpts = {}): ThreadGenerator {
  yield* play(view, id, build, {...opts, scenes: SCENES});
}

// Board still: the scene's key pose = last cue + 1.6 s (or an override), on the slate background.
const KEY: Record<string, number> = {S05: 2.6, S08: 2.2};
export const keyTime = (id: string) => {
  if (KEY[id] !== undefined) return KEY[id];
  const m = meta(id);
  return Math.min(Math.max(...m.cues) + 1.6, m.end - m.start - 0.1);
};
const HERO: Record<string, string> = {S13: 'HERO 1', S16: 'HERO 2', S20: 'HERO 3', S27: 'HERO 4', S32: 'HERO 5', S36: 'HERO 6', S40: 'HERO 7'};

export function* board(view: View2D, id: string, build: () => Built): ThreadGenerator {
  view.fill(C.bg);
  const m = meta(id);
  if (m.tool === 'blender') {
    view.add(<Node>
      <Rect width={1700} height={900} radius={20} stroke={C.grid} lineWidth={LW.hairline} lineDash={[16, 12]} />
      <Small text={`${HERO[id]} (3D) renders underneath this 2D overlay`} y={40} color={C.muted} />
    </Node>);
  }
  view.add(<Small text={`${id}  ·  ${m.tool}  ·  t = ${keyTime(id).toFixed(1)} s`} x={-930} y={512} color={C.muted} size={26} offset={[-1, 0]} />);
  yield* play2(view, id, build, {until: keyTime(id), transparent: true});
}
