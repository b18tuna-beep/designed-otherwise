import {makeScene2D} from '@motion-canvas/2d';
import {play2} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S36.
export default makeScene2D(function* (view) {
  yield* play2(view, 'S36', ANIM.S36, {transparent: true});
});
