import {makeProject} from '@revideo/core';
import './fonts.css';
import test from './scenes/test';

await Promise.all(['600 44px Archivo', '500 30px "IBM Plex Mono"'].map(f => document.fonts.load(f)));

export default makeProject({
  scenes: [test],
  settings: {shared: {size: {x: 1920, y: 1080}}, rendering: {fps: 30}},
});
