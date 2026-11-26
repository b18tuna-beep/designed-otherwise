// P5 (the four-stroke engine) production scenes: merged from the part files. Every scene gets the clock and crank-angle dial.
import {Node} from '@motion-canvas/2d';
import type {Built} from './motion';
import {Clk, ClockDial, Locator, makeClk, num} from './shared';
import {A1} from './anim1';
import {A2} from './anim2';
import {A3} from './anim3';

const REGISTRY: Record<string, (k: Clk) => Built> = {...A1, ...A2, ...A3};
// 2D asides that take the screen get the small cylinder locator (look.md vocabulary 10): the cutaway itself is not on screen
const LOC: Record<string, number> = {S08: 0, S09: 180, S10: 180, S11: 180, S13: 90, S18: 360, S19: 360, S20: 360, S21: 360, S22: 360, S23: 360, S24: 360, S25: 360, S26: 360, S27: 360, S28: 360, S29: 360, S30: 360, S31: 360,
  S39: 380, S40: 380, S41: 380, S42: 380, S43: 380, S47: 540, S48: 540, S49: 540, S50: 540, S51: 540, S53: 540, S54: 540, S72: 720, S73: 720, S74: 720, S75: 720, S76: 720};
export const ANIM: Record<string, () => Built> = new Proxy({} as Record<string, () => Built>, {
  get: (_t, id: string) => () => {
    const k = makeClk(id);
    const b = (REGISTRY[id] ?? (() => ({base: <Node />, steps: []})))(k);
    return {
      ...b,
      drift: false, // the clock and dial stay put
      base: <Node>{b.base}{LOC[id] !== undefined ? <Locator th={LOC[id]} /> : null}<ClockDial k={k} /></Node>,
    };
  },
});
