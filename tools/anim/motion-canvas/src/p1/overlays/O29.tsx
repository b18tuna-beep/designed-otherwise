import {makeScene2D} from '@motion-canvas/2d';
import {play} from '../../lib/motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S29.
export default makeScene2D(function* (view) {
  yield* play(view, 'S29', ANIM.S29, {transparent: true});
});
