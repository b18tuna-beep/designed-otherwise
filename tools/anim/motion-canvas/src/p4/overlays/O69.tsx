import {makeScene2D} from '@motion-canvas/2d';
import {play4} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S69.
export default makeScene2D(function* (view) {
  yield* play4(view, 'S69', ANIM.S69, {transparent: true});
});
