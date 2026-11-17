import {makeScene2D} from '@motion-canvas/2d';
import {play3} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S00a (the hook).
export default makeScene2D(function* (view) {
  yield* play3(view, 'S00a', ANIM.S00a, {transparent: true});
});
