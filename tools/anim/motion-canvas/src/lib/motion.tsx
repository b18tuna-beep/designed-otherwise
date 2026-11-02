// Scene runner for FPI P1 production scenes.
// Every scene: base layer at t=0, then each storyboard change revealed (or run)
// exactly at its cue from scenes.json, with ambient motion throughout.
import {Node, View2D} from '@motion-canvas/2d';
import {all, createRef, delay, easeInOutCubic, linear, ThreadGenerator, waitFor} from '@motion-canvas/core';
import SCENES from '../../../../../episodes/p1-refrigerator/scenes/scenes.json';
import {C} from './parts';

import {T} from './clock';
export {T, wave, cycle} from './clock';

export type Step = any | (() => ThreadGenerator);
export interface Built {
  base: any;
  steps: Step[];
  ambient?: () => ThreadGenerator;
  drift?: boolean; // slow camera push (default true)
  overlay?: boolean; // 2D layer composited over external footage
}

export const sceneMeta = (id: string) => (SCENES as any).scenes.find((s: any) => s.id === id);

function* reveal(node: Node): ThreadGenerator {
  const y0 = node.y();
  node.y(y0 + 18);
  yield* all(node.opacity(1, 0.55, easeInOutCubic), node.y(y0, 0.6, easeInOutCubic));
}

export function* play(view: View2D, id: string, build: () => Built, opts: {transparent?: boolean} = {}): ThreadGenerator {
  const meta = sceneMeta(id);
  // Exact frame budget from the narration clock: scene boundaries land on round(t * fps),
  // so cuts never drift. Motion Canvas floors waits to whole frames, hence the +0.5 frame.
  const FPS = 30;
  const frames = Math.round(meta.end * FPS) - Math.round(meta.start * FPS);
  const dur: number = (frames + 0.5) / FPS;
  const cues: number[] = meta.cues;
  if (!opts.transparent) view.fill(C.bg);
  T(0);
  const stage = createRef<Node>();
  const b = build();
  view.add(<Node ref={stage}>{b.base}</Node>);

  // steps: nodes are added hidden and revealed at their cue; functions run at their cue
  const plan = b.steps.map((st, i) => {
    const at = cues[i] ?? (dur * (i + 1)) / (b.steps.length + 1);
    if (typeof st === 'function') return {at, run: st as () => ThreadGenerator};
    const wrap = (<Node opacity={0}>{st}</Node>) as Node;
    stage().add(wrap);
    return {at, run: () => reveal(wrap)};
  });

  yield T(dur + 2, dur + 2, linear);
  if (b.ambient) yield b.ambient();
  if (b.drift !== false) {
    // slow push, plus a small reframe at the midpoint of any gap longer than 6 s between changes
    yield stage().scale(1.04, dur, linear);
    const marks = [0, ...plan.map(p => p.at), dur].sort((a, c) => a - c);
    for (let k = 1; k < marks.length; k++) {
      if (marks[k] - marks[k - 1] > 6) {
        const mid = (marks[k] + marks[k - 1]) / 2;
        yield delay(Math.max(mid - 0.8, 0), stage().position([k % 2 ? -20 : 20, k % 2 ? -10 : 10], 1.6, easeInOutCubic));
      }
    }
  }
  for (const p of plan) yield delay(p.at, p.run());
  yield* waitFor(dur);
}

