import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [motionCanvas({project: ['./src/project.ts', './src/p1/board.ts', './src/p1/episode.ts', './src/p1/overlays.ts']}), ffmpeg()],
  server: {fs: {allow: ['../../..']}},
});
