import {makeProject} from '@motion-canvas/core';
import '../fonts.css';
import O13 from './overlays/O13?scene';
import O16 from './overlays/O16?scene';
import O20 from './overlays/O20?scene';
import O27 from './overlays/O27?scene';
import O32 from './overlays/O32?scene';
import O36 from './overlays/O36?scene';
import O40 from './overlays/O40?scene';

await Promise.all(['600 44px Archivo', '500 30px Archivo', '500 30px "IBM Plex Mono"'].map(f => document.fonts.load(f)));

export default makeProject({
  name: 'p2-overlays',
  scenes: [O13, O16, O20, O27, O32, O36, O40],
});
