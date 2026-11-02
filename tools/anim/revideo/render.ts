// Headless Revideo render.  npx tsx render.ts [outDir]
import path from 'node:path';
import {renderVideo} from '@revideo/renderer';

const outDir = path.resolve(process.argv[2] ?? 'out');
const file = await renderVideo({
  projectFile: './src/project.ts',
  settings: {
    outFile: 'revideo-test.mp4',
    outDir,
    logProgress: true,
    workers: 1,
    puppeteer: {
      executablePath: new URL('./chrome-wrapper.sh', import.meta.url).pathname,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
    viteConfig: {server: {fs: {allow: ['../../..']}}},
  },
});
console.log('revideo: wrote', file);
process.exit(0);
