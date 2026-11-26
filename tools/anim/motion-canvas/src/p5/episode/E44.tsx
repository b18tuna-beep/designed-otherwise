import {makeScene2D} from '@motion-canvas/2d';
import {play5} from '../motion';
import {ANIM} from '../anim';

export default makeScene2D(function* (view) {
  yield* play5(view, 'S44', ANIM.S44);
});
