import {makeScene2D} from '@motion-canvas/2d';
import {play2} from '../motion';
import {ANIM} from '../anim';

export default makeScene2D(function* (view) {
  yield* play2(view, 'S06', ANIM.S06);
});
