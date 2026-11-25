import {makeScene2D} from '@motion-canvas/2d';
import {play4} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S00b.
export default makeScene2D(function* (view) {
  yield* play4(view, 'S00b', ANIM.S00b, {transparent: true});
});
