import {makeScene2D} from '@motion-canvas/2d';
import {play4} from '../motion';
import {ANIM} from '../anim';

export default makeScene2D(function* (view) {
  yield* play4(view, 'S56', ANIM.S56);
});
