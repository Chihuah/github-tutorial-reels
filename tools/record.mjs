// Usage:
//   node record.mjs <page.html> preview <outdir> t1 t2 ...   -> PNG stills
//   node record.mjs <page.html> video <out.mp4> [fps]       -> silent MP4 + <out>.json (sound events, cues)
// The page must expose window.DURATION, window.render(t), window.soundEvents() and window.cues().
// Use the project's playwright if installed (npm install), else a global copy.
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/opt/node-tools/node_modules/playwright/index.mjs')); }
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , page_, mode, out, ...rest] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve(page_), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
const duration = await page.evaluate(() => window.DURATION);
console.log('duration', duration.toFixed(2));

if (mode === 'preview') {
  mkdirSync(out, { recursive: true });
  for (const t of rest.map(Number)) {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: `${out}/t${t.toFixed(1)}.png` });
  }
} else {
  const fps = Number(rest[0] || 30);
  const frames = Math.ceil(duration * fps);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  const meta = await page.evaluate(() => ({ duration: window.DURATION, sounds: window.soundEvents(), cues: window.cues() }));
  writeFileSync(out.replace(/\.mp4$/, '.json'), JSON.stringify(meta, null, 1));
}
await browser.close();
