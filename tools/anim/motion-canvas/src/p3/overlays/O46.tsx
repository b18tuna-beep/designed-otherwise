import {makeScene2D} from '@motion-canvas/2d';
import {play3} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S46.
export default makeScene2D(function* (view) {
  yield* play3(view, 'S46', ANIM.S46, {transparent: true});
});
