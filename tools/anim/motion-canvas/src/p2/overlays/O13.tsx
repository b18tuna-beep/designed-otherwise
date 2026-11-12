import {makeScene2D} from '@motion-canvas/2d';
import {play2} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S13.
export default makeScene2D(function* (view) {
  yield* play2(view, 'S13', ANIM.S13, {transparent: true});
});
