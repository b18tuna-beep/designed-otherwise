import {makeScene2D} from '@motion-canvas/2d';
import {play5} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S07.
export default makeScene2D(function* (view) {
  yield* play5(view, 'S07', ANIM.S07, {transparent: true});
});
