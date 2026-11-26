import {makeScene2D} from '@motion-canvas/2d';
import {play5} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S17.
export default makeScene2D(function* (view) {
  yield* play5(view, 'S17', ANIM.S17, {transparent: true});
});
