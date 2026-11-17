import {makeScene2D} from '@motion-canvas/2d';
import {play3} from '../motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S35.
export default makeScene2D(function* (view) {
  yield* play3(view, 'S35', ANIM.S35, {transparent: true});
});
