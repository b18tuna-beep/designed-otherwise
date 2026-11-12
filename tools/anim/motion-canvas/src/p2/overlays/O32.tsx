import {makeScene2D} from '@motion-canvas/2d';
import {play2} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S32.
export default makeScene2D(function* (view) {
  yield* play2(view, 'S32', ANIM.S32, {transparent: true});
});
