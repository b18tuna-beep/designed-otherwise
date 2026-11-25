import {makeScene2D} from '@motion-canvas/2d';
import {play4} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S19.
export default makeScene2D(function* (view) {
  yield* play4(view, 'S19', ANIM.S19, {transparent: true});
});
