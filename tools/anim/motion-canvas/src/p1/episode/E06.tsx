import {makeScene2D} from '@motion-canvas/2d';
import {play} from '../../lib/motion';
import {ANIM} from '../anim';

export default makeScene2D(function* (view) {
  yield* play(view, 'S06', ANIM.S06);
});
