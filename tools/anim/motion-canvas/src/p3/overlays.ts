import {makeProject} from '@motion-canvas/core';
import '../fonts.css';
import O03 from './overlays/O03?scene';
import O20 from './overlays/O20?scene';
import O26 from './overlays/O26?scene';
import O27 from './overlays/O27?scene';
import O35 from './overlays/O35?scene';
import O41 from './overlays/O41?scene';
import O43 from './overlays/O43?scene';
import O44 from './overlays/O44?scene';
import O45 from './overlays/O45?scene';
import O46 from './overlays/O46?scene';

await Promise.all(['600 44px Archivo', '500 30px Archivo', '500 30px "IBM Plex Mono"'].map(f => document.fonts.load(f)));

export default makeProject({
  name: 'p3-overlays',
  scenes: [O03, O20, O26, O27, O35, O41, O43, O44, O45, O46],
});
