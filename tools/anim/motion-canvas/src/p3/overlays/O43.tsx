import {makeScene2D} from '@motion-canvas/2d';
import {play3} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S43.
export default makeScene2D(function* (view) {
  yield* play3(view, 'S43', ANIM.S43, {transparent: true});
});
