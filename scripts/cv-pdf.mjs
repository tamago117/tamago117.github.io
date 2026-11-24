// dist/ を一時サーバで配信し、/cv/print をヘッドレス Chrome で A4 PDF に印刷して
// public/Michikuni_Eguchi_CV.pdf に保存する。`npm run cv:pdf`（ビルド込み）から呼ぶ。
// Chrome / Edge の場所は自動で探す。見つからないときは CHROME_PATH で指定する。
import { createServer } from 'node:http';
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, extname, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'public', 'Michikuni_Eguchi_CV.pdf');

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);
const chrome = CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chrome が見つからない。CHROME_PATH=<chrome の実行ファイル> を指定して再実行してください。');
  process.exit(1);
}
if (!existsSync(join(DIST, 'cv', 'print', 'index.html'))) {
  console.error('dist/cv/print が無い。先に `npm run build` してください（`npm run cv:pdf` ならビルド込み）。');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};
const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(DIST, path);
  if (!file.startsWith(DIST)) return res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const target = `http://127.0.0.1:${server.address().port}/cv/print/`;

const code = await new Promise((done) => {
  const p = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-pdf-header-footer',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=15000', // Web フォントの読み込みを待つ
      `--print-to-pdf=${OUT}`,
      target,
    ],
    { stdio: 'inherit' },
  );
  p.on('close', done);
});
server.close();

if (code !== 0 || !existsSync(OUT)) {
  console.error(`PDF の生成に失敗した（exit ${code}）`);
  process.exit(1);
}
console.log(`✓ ${OUT}`);
