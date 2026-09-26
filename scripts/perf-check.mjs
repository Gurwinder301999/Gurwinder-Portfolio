/**
 * Measures real user-facing paint metrics against a running site.
 *
 * Uses the browser's own PerformanceObserver for LCP and paint timing rather
 * than guessing from bundle size, because those are the numbers a visitor
 * actually feels.
 *
 * Usage: node scripts/perf-check.mjs [url]
 */
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const url = process.argv[2] ?? 'http://localhost:4180/';
const PORT = 9222;

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
    `--remote-debugging-port=${PORT}`,
    '--window-size=1440,900',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

async function target() {
  for (let i = 0; i < 40; i += 1) {
    await new Promise((r) => setTimeout(r, 250));
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const t = list.find((x) => x.type === 'page');
      if (t) return t;
    } catch {
      /* not up yet */
    }
  }
  throw new Error('DevTools did not start.');
}

const t = await target();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const logs = [];
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
  // Collect anything the browser refused to execute. A CSP this strict either
  // works or breaks the app silently, so these lines are the whole point.
  if (m.method === 'Log.entryAdded' && ['error', 'warning'].includes(m.params.entry.level)) {
    logs.push(`[${m.params.entry.level}] ${m.params.entry.text}`);
  }
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
    logs.push(`[console] ${m.params.args.map((a) => a.value ?? a.description ?? '').join(' ')}`);
  }
  if (m.method === 'Runtime.exceptionThrown') {
    logs.push(`[exception] ${m.params.exceptionDetails.text} ${m.params.exceptionDetails.exception?.description ?? ''}`);
  }
};
await new Promise((r) => (ws.onopen = r));

// Start recording before any navigation so no entry is missed.
await send('Page.enable');
await send('Network.enable');
await send('Performance.enable');
await send('Log.enable');
await send('Runtime.enable');

const script = `
  (() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const paints = {};
    for (const p of performance.getEntriesByType('paint')) paints[p.name] = Math.round(p.startTime);
    const res = performance.getEntriesByType('resource') || [];
    const by = {};
    let transfer = 0, count = 0, third = 0;
    for (const r of res) {
      const kind = r.initiatorType || 'other';
      by[kind] = (by[kind] || 0) + (r.transferSize || 0);
      transfer += r.transferSize || 0;
      count++;
      if (!r.name.includes(location.origin)) third++;
    }
    return {
      fcp: paints['first-contentful-paint'] ?? null,
      lcp: Math.round(window.__lcp || 0),
      cls: Number((window.__cls || 0).toFixed(4)),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
      load: Math.round(nav.loadEventEnd || 0),
      transfer,
      requests: count,
      thirdPartyRequests: third,
      byType: by,
      slowest: res
        .map((r) => ({ n: r.name.split('/').pop(), d: Math.round(r.duration), t: r.initiatorType }))
        .sort((a, b) => b.d - a.d)
        .slice(0, 5),
    };
  })()
`;

// Register the LCP and CLS observers before any document exists, otherwise
// the entries are gone by the time we evaluate.
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `
    window.__lcp = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  `,
});

await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

// Measure a COLD visit. A warm re-run reports transferSize 0 for every cached
// resource, which hides exactly the weight we are trying to reduce.
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Page.navigate', { url });
await new Promise((r) => setTimeout(r, 6000));

const { result } = await send('Runtime.evaluate', { expression: script, returnByValue: true });
const m = result.value;

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(`URL            ${url}`);
console.log(`FCP            ${m.fcp} ms`);
console.log(`LCP            ${m.lcp} ms`);
console.log(`CLS            ${m.cls}`);
console.log(`DOMContentLoad ${m.domContentLoaded} ms`);
console.log(`load           ${m.load} ms`);
console.log(`requests       ${m.requests} (${m.thirdPartyRequests} third-party)`);
console.log(`transfer       ${kb(m.transfer)}`);
console.log('by type:');
for (const [k, v] of Object.entries(m.byType).sort((a, b) => b[1] - a[1])) {
  console.log(`   ${k.padEnd(14)} ${kb(v)}`);
}
console.log('slowest:');
for (const s of m.slowest) console.log(`   ${String(s.d).padStart(6)} ms  ${s.n} (${s.t})`);

// A policy this strict either works or breaks the app silently, so prove the
// React tree actually mounted and surface anything the browser refused to run.
const health = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    rootChildren: document.getElementById('root') ? document.getElementById('root').childElementCount : -1,
    headings: document.querySelectorAll('h1,h2').length,
    navLinks: document.querySelectorAll('nav a').length,
    kanitLoaded: document.fonts ? document.fonts.check('16px Kanit') : null
  })`,
  returnByValue: true,
});
const h = JSON.parse(health.result.value);
console.log('\nHEALTH');
console.log(`  #root children : ${h.rootChildren} (0 means the app did not mount)`);
console.log(`  headings       : ${h.headings}`);
console.log(`  nav links      : ${h.navLinks}`);
console.log(`  Kanit loaded   : ${h.kanitLoaded}`);

console.log('\nCONSOLE');
if (!logs.length) console.log('  clean - no errors or CSP violations');
for (const l of logs) console.log(`  ${l}`);

ws.close();
browser.kill();
process.exit(0);
