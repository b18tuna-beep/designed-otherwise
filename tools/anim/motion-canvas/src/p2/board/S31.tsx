import {makeScene2D} from '@motion-canvas/2d';
import {board} from '../motion';
import {ANIM} from '../anim';

// Board still for S31: the scene runs to its key pose; the last frame is the still.
export default makeScene2D(function* (view) {
  yield* board(view, 'S31', ANIM.S31);
});
