import {makeProject} from '@motion-canvas/core';
import '../fonts.css';
import O02 from './overlays/O02?scene';
import O29 from './overlays/O29?scene';

await Promise.all(['600 44px Archivo', '500 30px Archivo', '500 30px "IBM Plex Mono"'].map(f => document.fonts.load(f)));

export default makeProject({
  name: 'overlays',
  scenes: [O02, O29],
});
