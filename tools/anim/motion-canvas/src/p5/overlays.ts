import {makeProject} from '@motion-canvas/core';
import '../fonts.css';
import O07 from './overlays/O07?scene';
import O17 from './overlays/O17?scene';
import O38 from './overlays/O38?scene';
import O45 from './overlays/O45?scene';
import O52 from './overlays/O52?scene';
import O68 from './overlays/O68?scene';

await Promise.all(['600 44px Archivo', '500 30px Archivo', '500 30px "IBM Plex Mono"'].map(f => document.fonts.load(f)));

export default makeProject({
  name: 'p5-overlays',
  scenes: [O07, O17, O38, O45, O52, O68],
});
