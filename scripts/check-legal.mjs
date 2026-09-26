/**
 * Verifies the legal pages render, are reachable, and carry the required
 * structure: one h1, labelled sections, and no console errors.
 *
 * Usage: node scripts/check-legal.mjs [url]
 */
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const base = process.argv[2] ?? 'http://localhost:4183/';
const PORT = 9250;
const SLUGS = ['privacy', 'terms', 'cookies', 'refunds', 'not-a-real-page'];

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
  ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${PORT}`, 'about:blank'],
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
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });

const problems = [];
let failures = 0;

for (const slug of SLUGS) {
  await send('Page.navigate', { url: `${base}#/legal/${slug}` });
  await new Promise((r) => setTimeout(r, 2200));

  const { result, exceptionDetails } = await send('Runtime.evaluate', {
    expression: `(() => {
      const h1s = [...document.querySelectorAll('h1')];
      return JSON.stringify({
        title: document.title,
        hash: location.hash,
        h1Count: h1s.length,
        h1: h1s[0] ? h1s[0].innerText.trim().slice(0, 60) : null,
        h2Count: document.querySelectorAll('h2').length,
        sections: document.querySelectorAll('main section').length,
        words: document.body.innerText.split(/\\s+/).filter(Boolean).length,
        skipLink: Boolean(document.querySelector('.skip-link')),
        mainTarget: Boolean(document.getElementById('main-content')),
        // The contact email must be a real mailto, not decorative text.
        mailtos: [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.getAttribute('href')),
        notFound: /page not found/i.test(document.body.innerText),
      });
    })()`,
    returnByValue: true,
  });

  if (exceptionDetails) {
    problems.push(`${slug}: eval failed`);
    failures += 1;
    continue;
  }

  const d = JSON.parse(result.value);
  const isUnknown = slug === 'not-a-real-page';
  const bad = isUnknown
    ? !d.notFound
    : d.h1Count !== 1 || !d.h1 || d.words < 120 || !d.skipLink || !d.mainTarget || d.notFound;

  if (bad) failures += 1;

  console.log(
    `${slug.padEnd(16)} h1=${d.h1Count} (${String(d.h1).slice(0, 32).padEnd(32)}) ` +
      `h2=${String(d.h2Count).padStart(2)} words=${String(d.words).padStart(4)} ` +
      `skip=${d.skipLink ? 'y' : 'N'} main=${d.mainTarget ? 'y' : 'N'} ` +
      `${isUnknown ? (d.notFound ? '404 shown  ' : 'NO 404!     ') : ''}${bad ? 'FAIL' : 'OK'}`
  );
}

console.log(
  failures ? `\n${failures} legal page check(s) failed` : '\nAll legal pages render correctly'
);
ws.close();
browser.kill();
process.exit(failures ? 1 : 0);

