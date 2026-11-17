import {makeScene2D} from '@motion-canvas/2d';
import {play3} from '../motion';
import {ANIM} from '../anim';

export default makeScene2D(function* (view) {
  yield* play3(view, 'S03', ANIM.S03);
});
