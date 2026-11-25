// P4 (the pin tumbler lock) production scenes: merged from the part files. Scenes not yet built fall back to a labelled placeholder.
import {Node} from '@motion-canvas/2d';
import type {Built} from '../lib/motion';
import {Lab} from '../lib/lock';
import {A1} from './anim1';
import {A2} from './anim2';
import {A3} from './anim3';
import {A4} from './anim4';

const REGISTRY: Record<string, () => Built> = {...A1, ...A2, ...A3, ...A4};
export const ANIM: Record<string, () => Built> = new Proxy(REGISTRY, {
  get: (t, k: string) => t[k] ?? (() => ({base: <Node><Lab text={k + ' (todo)'} /></Node>, steps: [] as any[]})),
});
