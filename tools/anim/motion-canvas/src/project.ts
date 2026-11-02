import {makeProject} from '@motion-canvas/core';
import './fonts.css';
import test from './scenes/test?scene';

// Make sure brand fonts are ready before the first frame is drawn.
await Promise.all(['600 44px Archivo', '500 30px "IBM Plex Mono"'].map(f => document.fonts.load(f)));

export default makeProject({
  scenes: [test],
});
