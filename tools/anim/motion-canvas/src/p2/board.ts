import {makeProject} from '@motion-canvas/core';
import '../fonts.css';
import S01 from './board/S01?scene';
import S02 from './board/S02?scene';
import S03 from './board/S03?scene';
import S04 from './board/S04?scene';
import S05 from './board/S05?scene';
import S06 from './board/S06?scene';
import S07 from './board/S07?scene';
import S08 from './board/S08?scene';
import S09 from './board/S09?scene';
import S10 from './board/S10?scene';
import S11 from './board/S11?scene';
import S12 from './board/S12?scene';
import S13 from './board/S13?scene';
import S14 from './board/S14?scene';
import S15 from './board/S15?scene';
import S16 from './board/S16?scene';
import S17 from './board/S17?scene';
import S18 from './board/S18?scene';
import S19 from './board/S19?scene';
import S20 from './board/S20?scene';
import S21 from './board/S21?scene';
import S22 from './board/S22?scene';
import S23 from './board/S23?scene';
import S24 from './board/S24?scene';
import S25 from './board/S25?scene';
import S26 from './board/S26?scene';
import S27 from './board/S27?scene';
import S28 from './board/S28?scene';
import S29 from './board/S29?scene';
import S30 from './board/S30?scene';
import S31 from './board/S31?scene';
import S32 from './board/S32?scene';
import S33 from './board/S33?scene';
import S34 from './board/S34?scene';
import S35 from './board/S35?scene';
import S36 from './board/S36?scene';
import S37 from './board/S37?scene';
import S38 from './board/S38?scene';
import S39 from './board/S39?scene';
import S40 from './board/S40?scene';
import S41 from './board/S41?scene';

await Promise.all(['600 44px Archivo', '500 30px Archivo', '500 30px "IBM Plex Mono"'].map(f => document.fonts.load(f)));

export default makeProject({
  name: 'p2-board',
  scenes: [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39, S40, S41],
});
