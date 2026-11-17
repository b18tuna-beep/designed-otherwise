import {makeScene2D} from '@motion-canvas/2d';
import {play3} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S03.
export default makeScene2D(function* (view) {
  yield* play3(view, 'S03', ANIM.S03, {transparent: true});
});
