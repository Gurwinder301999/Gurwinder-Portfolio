/**
 * Keyboard and accessibility audit of the rendered page.
 *
 * Reports document structure, alt text, accessible names, and then walks the
 * real tab order checking that every focused element shows a focus indicator.
 *
 * Usage: node scripts/check-a11y.mjs [url] [hash]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const url = process.argv[2] ?? 'http://localhost:4183/';
const hash = process.argv[3] ?? '';
const PORT = 9311;

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
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    // An isolated profile. Without it, a Chrome that is already running
    // swallows the launch: chrome.exe hands the request to the existing
    // instance and exits, so the debugging port never opens and the script
    // hangs forever waiting for a target.
    `--user-data-dir=${path.join(os.tmpdir(), `cdp-${PORT}`)}`,
    `--remote-debugging-port=${PORT}`,
    'about:blank',
  ],
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

await send('Page.navigate', { url: `${url}${hash}` });
await new Promise((r) => setTimeout(r, 3500));
process.on('unhandledRejection', (e) => {
  process.stderr.write(`[a11y] FAILED: ${e && e.stack ? e.stack : e}\n`);
  process.exit(1);
});

const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? 'eval failed');
  return result.value;
};

const audit = JSON.parse(
  await evaluate(`(() => {
    const imgs = [...document.querySelectorAll('img')];
    const interactive = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')];
    const visible = (el) => el.getClientRects().length > 0;
    const name = (el) => el.innerText.trim() || el.getAttribute('aria-label') || el.title || '';

    return JSON.stringify({
      images: imgs.map((i) => ({ src: i.currentSrc.split('/').pop(), alt: i.getAttribute('alt'), hasAlt: i.hasAttribute('alt') })),
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      landmarks: {
        header: document.querySelectorAll('header').length,
        nav: document.querySelectorAll('nav').length,
        main: document.querySelectorAll('main').length,
        footer: document.querySelectorAll('footer').length,
      },
      unlabelled: interactive
        .filter(visible)
        .filter((el) => (el.tagName === 'A' || el.tagName === 'BUTTON') && !name(el) && !el.querySelector('img[alt]:not([alt=""])'))
        .map((el) => el.outerHTML.slice(0, 90)),
      tabbables: interactive.filter(visible).length,
      langAttr: document.documentElement.getAttribute('lang'),
      title: document.title,
    });
  })()`),
);

console.log('STRUCTURE');
console.log(`  <html lang>        ${audit.langAttr ?? '(missing)'}   ${audit.langAttr ? 'OK' : 'FAIL'}`);
console.log(`  title              "${(audit.title ?? '').slice(0, 52)}"`);
console.log(`  headings           h1=${audit.h1} h2=${audit.h2}   ${audit.h1 === 1 ? 'OK' : 'FAIL (need exactly one h1)'}`);
console.log(
  `  landmarks          header=${audit.landmarks.header} nav=${audit.landmarks.nav} main=${audit.landmarks.main} footer=${audit.landmarks.footer}   ` +
    `${audit.landmarks.main === 1 ? 'OK' : 'FAIL'}`
);
console.log(`  focusable elements ${audit.tabbables}`);

console.log('\nIMAGES (alt text)');
if (!audit.images.length) console.log('  (none)');
for (const img of audit.images) {
  console.log(`  ${img.hasAlt ? 'OK  ' : 'FAIL'} ${String(img.src).padEnd(24)} alt="${img.alt ?? '(none)'}"`);
}

console.log('\nACCESSIBLE NAMES');
if (!audit.unlabelled.length) console.log('  OK   every visible link and button has an accessible name');
else for (const el of audit.unlabelled) console.log(`  FAIL ${el}`);

console.log('\nTAB ORDER (first 14 stops)');
const stops = [];
for (let i = 0; i < 14; i += 1) {
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', windowsVirtualKeyCode: 9, key: 'Tab' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 9, key: 'Tab' });
  await new Promise((r) => setTimeout(r, 60));
  const s = JSON.parse(
    await evaluate(`(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return JSON.stringify({ tag: 'BODY', label: '(left the page)', ring: null });
      const cs = getComputedStyle(el);
      const hasRing = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none';
      return JSON.stringify({
        tag: el.tagName,
        label: (el.innerText || el.getAttribute('aria-label') || '').trim().split('\\n')[0].slice(0, 40),
        ring: hasRing,
      });
    })()`),
  );
  stops.push(s);
  console.log(`  ${String(i + 1).padStart(2)}. ${s.tag.padEnd(7)} ${String(s.label).padEnd(42)} ring=${s.ring === null ? '-' : s.ring ? 'y' : 'N'}`);
}

const noRing = stops.filter((s) => s.ring === false);
console.log(
  `\n  ${noRing.length ? `${noRing.length} stop(s) had no visible focus indicator` : 'Every focused element showed a focus indicator'}`
);

ws.close();
browser.kill();
process.exit(noRing.length ? 1 : 0);
