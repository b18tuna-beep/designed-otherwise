import {makeProject} from '@motion-canvas/core';
import '../fonts.css';
import E01 from './episode/E01?scene';
import E02 from './episode/E02?scene';
import E03 from './episode/E03?scene';
import E04 from './episode/E04?scene';
import E05 from './episode/E05?scene';
import E06 from './episode/E06?scene';
import E07 from './episode/E07?scene';
import E08 from './episode/E08?scene';
import E09 from './episode/E09?scene';
import E10 from './episode/E10?scene';
import E11 from './episode/E11?scene';
import E12 from './episode/E12?scene';
import E13 from './episode/E13?scene';
import E14 from './episode/E14?scene';
import E15 from './episode/E15?scene';
import E16 from './episode/E16?scene';
import E17 from './episode/E17?scene';
import E18 from './episode/E18?scene';
import E19 from './episode/E19?scene';
import E20 from './episode/E20?scene';
import E21 from './episode/E21?scene';
import E22 from './episode/E22?scene';
import E23 from './episode/E23?scene';
import E24 from './episode/E24?scene';
import E25 from './episode/E25?scene';
import E26 from './episode/E26?scene';
import E27 from './episode/E27?scene';
import E28 from './episode/E28?scene';
import E29 from './episode/E29?scene';
import E30 from './episode/E30?scene';
import E31 from './episode/E31?scene';
import E32 from './episode/E32?scene';
import E33 from './episode/E33?scene';
import E34 from './episode/E34?scene';
import E35 from './episode/E35?scene';
import E36 from './episode/E36?scene';
import E37 from './episode/E37?scene';
import E38 from './episode/E38?scene';
import E39 from './episode/E39?scene';
import E40 from './episode/E40?scene';
import E41 from './episode/E41?scene';

await Promise.all(['600 44px Archivo', '500 30px Archivo', '500 30px "IBM Plex Mono"'].map(f => document.fonts.load(f)));

export default makeProject({
  name: 'p2-episode',
  scenes: [E01, E02, E03, E04, E05, E06, E07, E08, E09, E10, E11, E12, E13, E14, E15, E16, E17, E18, E19, E20, E21, E22, E23, E24, E25, E26, E27, E28, E29, E30, E31, E32, E33, E34, E35, E36, E37, E38, E39, E40, E41],
});
