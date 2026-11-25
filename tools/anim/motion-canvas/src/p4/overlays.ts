import {makeProject} from '@motion-canvas/core';
import '../fonts.css';
import O00b from './overlays/O00b?scene';
import O07 from './overlays/O07?scene';
import O12 from './overlays/O12?scene';
import O19 from './overlays/O19?scene';
import O57 from './overlays/O57?scene';
import O59 from './overlays/O59?scene';
import O69 from './overlays/O69?scene';

await Promise.all(['600 44px Archivo', '500 30px Archivo', '500 30px "IBM Plex Mono"'].map(f => document.fonts.load(f)));

export default makeProject({
  name: 'p4-overlays',
  scenes: [O00b, O07, O12, O19, O57, O59, O69],
});
