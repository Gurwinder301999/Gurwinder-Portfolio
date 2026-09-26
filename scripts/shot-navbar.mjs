/**
 * Screenshots the navbar at several widths and reports whether the wordmark
 * overflows its row, which matters because the name is now the full surname.
 *
 * Usage: node scripts/shot-navbar.mjs [url]
 */
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const url = process.argv[2] ?? 'http://localhost:4182/';
const PORT = 9224;

const WIDTHS = [
  { w: 360, h: 120, label: '360 (small phone)' },
  { w: 414, h: 120, label: '414 (phone)' },
  { w: 768, h: 120, label: '768 (tablet)' },
  { w: 1280, h: 120, label: '1280 (laptop)' },
];

function findChrome() {
  const roots = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean);
  const rels = ['Google\\Chrome\\Application\\chrome.exe', 'Microsoft\\Edge\\Application\\msedge.exe'];
  for (const root of roots) {
    for (const rel of rels) {
      const p = `${root}\\${rel}`;
      if (fs.existsSync(p)) return p;
    }
  }
  throw new Error('No Chrome or Edge found.');
}

const browser = spawn(
  findChrome(),
  ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, 'about:blank'],
  { stdio: 'ignore' }
);

let target = null;
for (let i = 0; i < 40 && !target; i += 1) {
  await new Promise((r) => setTimeout(r, 250));
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === 'page');
  } catch {
    /* not up yet */
  }
}

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result);
    pending.delete(m.id);
  }
};
await new Promise((r) => (ws.onopen = r));
await send('Page.enable');

for (const { w, h, label } of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
  await send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 2500));

  const { result } = await send('Runtime.evaluate', {
    expression: `(() => {
      const a = document.querySelector('nav a[aria-label*="home"], nav a[href="#home"]');
      const name = a ? a.innerText.split('\\n')[0].trim() : '(not found)';
      const nav = document.querySelector('nav');
      const doc = document.documentElement;
      return JSON.stringify({
        name,
        navWidth: nav ? Math.round(nav.getBoundingClientRect().width) : 0,
        scrollW: doc.scrollWidth,
        clientW: doc.clientWidth,
        overflow: doc.scrollWidth > doc.clientWidth + 1
      });
    })()`,
    returnByValue: true,
  });
  const d = JSON.parse(result.value);
  console.log(
    `${String(w).padStart(5)}px  name="${d.name}"  h-overflow=${d.overflow ? 'YES (' + d.scrollW + '>' + d.clientW + ')' : 'no'}`
  );

  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`_nav-${w}.png`, Buffer.from(data, 'base64'));
}

ws.close();
browser.kill();
process.exit(0);
