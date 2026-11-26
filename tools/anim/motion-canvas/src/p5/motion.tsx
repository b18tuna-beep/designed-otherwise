// P5 scene runner: the shared play() bound to episodes/p5-engine/scenes/scenes.json, with the clock and dial added to every scene.
import {Node, View2D} from '@motion-canvas/2d';
import {ThreadGenerator} from '@motion-canvas/core';
import RAW from '../../../../../episodes/p5-engine/scenes/scenes.json';
import {Built, play, PlayOpts, sceneMeta} from '../lib/motion';

// Scene boundaries snap to whole frames with round-half-to-even (same rule as composite_heroes.py and the assembly scripts).
const FPS = 30;
const rhe = (x: number) => {
  const f = Math.floor(x);
  return Math.abs(x - f - 0.5) < 1e-6 ? (f % 2 === 0 ? f : f + 1) : Math.round(x);
};
export const SCENES = {...RAW, scenes: (RAW as any).scenes.map((s: any) => ({...s, start: rhe(s.start * FPS) / FPS, end: rhe(s.end * FPS) / FPS}))};
export const meta = (id: string) => sceneMeta(id, SCENES);
export const cue = (id: string, i: number) => meta(id).cues[i] as number;
export const dur = (id: string) => meta(id).end - meta(id).start;

export function* play5(view: View2D, id: string, build: () => Built, opts: PlayOpts = {}): ThreadGenerator {
  yield* play(view, id, build, {...opts, scenes: SCENES, keep: true});
}
export type {Built};
export {Node};
