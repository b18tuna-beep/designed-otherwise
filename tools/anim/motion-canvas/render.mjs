// Headless Motion Canvas render: start the editor, press Render, wait for the
// image-sequence exporter to finish, then stitch frames with FFmpeg.
//   node render.mjs [outDir] [project=project] [--frames | --last-per-scene]
// --frames copies the PNG frames to outDir instead of encoding a video (storyboard stills).
// --last-per-scene (projects exported with groupByScene, e.g. p2-board) copies the last frame of
// each scene folder to outDir/<scene>.png: the board still at the scene's key pose.
// Uses the system Chrome when CHROME_PATH is set, otherwise Playwright's Chromium.
// RENDER_TIMEOUT_MIN (default 15) caps how long the exporter may run.
import {spawn, execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const outDir = path.resolve(process.argv[2] ?? 'out');
const project = process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3] : 'project';
const framesOnly = process.argv.includes('--frames');
const lastPerScene = process.argv.includes('--last-per-scene');
const framesDir = path.resolve('output', project);
const PROJECT_URL = {project: 'src/project', board: 'src/p1/board', episode: 'src/p1/episode', overlays: 'src/p1/overlays',
  'p2-board': 'src/p2/board', 'p2-episode': 'src/p2/episode', 'p2-overlays': 'src/p2/overlays'};
const PORT = 9000;

// RANGE="start,end" (seconds) renders only part of the project; the meta file is restored afterwards.
const META = {project: 'src/project.meta', board: 'src/p1/board.meta', episode: 'src/p1/episode.meta', overlays: 'src/p1/overlays.meta',
  'p2-board': 'src/p2/board.meta', 'p2-episode': 'src/p2/episode.meta', 'p2-overlays': 'src/p2/overlays.meta'}[project];
// all PNGs under a folder (scene subfolders when the exporter groups by scene)
const pngs = dir => !fs.existsSync(dir) ? [] : fs.readdirSync(dir, {withFileTypes: true}).flatMap(e =>
  e.isDirectory() ? pngs(path.join(dir, e.name)) : e.name.endsWith('.png') ? [path.join(dir, e.name)] : []);
let metaBackup = null;
if (process.env.RANGE && META) {
  metaBackup = fs.readFileSync(META, 'utf8');
  const m = JSON.parse(metaBackup);
  m.shared.range = process.env.RANGE.split(',').map(Number);
  fs.writeFileSync(META, JSON.stringify(m, null, 2));
}
const restoreMeta = () => { if (metaBackup) fs.writeFileSync(META, metaBackup); };
process.on('exit', restoreMeta);

fs.rmSync('output', {recursive: true, force: true});
fs.mkdirSync(outDir, {recursive: true});

const vite = spawn('node_modules/.bin/vite', ['--port', String(PORT), '--strictPort'], {stdio: 'pipe'});
const ready = new Promise((res, rej) => {
  vite.stdout.on('data', d => /ready in/.test(String(d)) && res());
  vite.on('exit', c => rej(new Error('vite exited ' + c)));
  setTimeout(() => rej(new Error('vite start timeout')), 60000);
});
await ready;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  const page = await browser.newPage({viewport: {width: 1600, height: 1000}});
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(`http://localhost:${PORT}/${PROJECT_URL[project] ?? project}`, {waitUntil: 'networkidle'});
  // The Rendering settings tab holds the Render button.
  await page.getByRole('button', {name: /^render$/i}).first().click({timeout: 30000});

  let last = -1, still = 0;
  const deadline = Date.now() + Number(process.env.RENDER_TIMEOUT_MIN || 15) * 60_000;
  while (Date.now() < deadline) {
    await page.waitForTimeout(1000);
    const n = pngs(framesDir).length;
    if (n > 0 && n === last) still++; else still = 0;
    last = n;
    if (n > 0 && still >= 20) break; // exporter idle for 20 s
  }
  console.log(`motion-canvas: ${last} frames`);
  if (last < 1) throw new Error('no frames rendered');
} finally {
  await browser.close();
  vite.kill();
}

if (lastPerScene) {
  for (const d of fs.readdirSync(framesDir, {withFileTypes: true}).filter(e => e.isDirectory())) {
    const files = pngs(path.join(framesDir, d.name)).sort();
    if (files.length) fs.copyFileSync(files.at(-1), path.join(outDir, `${d.name}.png`));
  }
  console.log('motion-canvas: copied last frame per scene to', outDir);
  process.exit(0);
}
if (framesOnly) {
  for (const f of fs.readdirSync(framesDir).filter(f => f.endsWith('.png')).sort())
    fs.copyFileSync(path.join(framesDir, f), path.join(outDir, f));
  console.log('motion-canvas: copied frames to', outDir);
  process.exit(0);
}
const mp4 = path.join(outDir, project === 'project' ? 'motion-canvas-test.mp4' : `${project}.mp4`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-pattern_type', 'glob',
  '-i', path.join(framesDir, '*.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', mp4]);
console.log('motion-canvas: wrote', mp4);
process.exit(0);
