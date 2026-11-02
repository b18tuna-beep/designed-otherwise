import {makeScene2D} from '@motion-canvas/2d';
import {play} from '../../lib/motion';
import {ANIM} from '../anim';

// Transparent 2D layer for the Blender hero in S02.
export default makeScene2D(function* (view) {
  yield* play(view, 'S02', ANIM.S02, {transparent: true});
});
