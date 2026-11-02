import {makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BOARD, stamp} from '../poses';
import {C} from '../../lib/parts';

export default makeScene2D(function* (view) {
  view.fill(C.bg);
  view.add(BOARD.S11());
  view.add(stamp('S11', 'board'));
  yield* waitFor(1);
});
