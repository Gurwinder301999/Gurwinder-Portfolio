/**
 * Renders the animated SVG favicon to static PNG and .ico fallbacks.
 *
 * Chrome will not rasterise an SVG favicon into .ico on its own, and browsers
 * that refuse animated SVG (Safari, and most bookmark bars) still need real
 * raster icons. The same mark is therefore re-rendered here, frozen at one
 * point in its orbit, so the stills match the animation exactly.
 *
 * Usage: node scripts/build_favicon.mjs
 * Requires: headless Chrome or Edge, already needed to preview the site.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const SVG = path.join(PUBLIC, 'favicon.svg');

/** Sizes an .ico should carry: tab strip, bookmarks bar, and classic desktop. */
const ICO_SIZES = [16, 32, 48];

/** PNG icons: iOS home screen plus the PWA/Android sizes. */
const PNG_TARGETS = [
  // iOS masks the icon itself and renders transparency as black, so this one
  // is drawn full-bleed on the plate colour instead.
  { name: 'apple-touch-icon.png', size: 180, opaque: true },
  { name: 'icon-192.png', size: 192, opaque: false },
  { name: 'icon-512.png', size: 512, opaque: false },
];

function findChrome() {
  const roots = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean);
  const rels = ['Google\\Chrome\\Application\\chrome.exe', 'Microsoft\\Edge\\Application\\msedge.exe'];
  for (const root of roots) {
    for (const rel of rels) {
      const p = path.join(root, rel);
      if (fs.existsSync(p)) return p;
    }
  }
  throw new Error('No Chrome or Edge found.');
}

/** Packs PNG buffers into a single .ico container (PNG-compressed entries). */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = [];
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0); // width (0 encodes 256)
    e.writeUInt8(size === 256 ? 0 : size, 1); // height
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

/**
 * Freezes the mark mid-orbit by seeking the SMIL clock, so the still frames
 * are the same artwork as the animation rather than a separate redraw.
 *
 * iOS rejects transparency and renders an icon with an alpha channel on a
 * black square, so the Apple touch icon is rendered on the plate colour and
 * fills the frame. Everything else keeps transparent rounded corners.
 */
function pageHtml(size, opaque) {
  return `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:${opaque ? '#0C0C0C' : 'transparent'}}
svg{display:block;width:${size}px;height:${size}px}</style>
${fs.readFileSync(SVG, 'utf8')}
<script>
  const s = document.querySelector('svg');
  s.setCurrentTime(0.75);
  s.pauseAnimations();
</script>`;
}


/** Drives one headless browser over CDP for the whole render pass. */
async function withPage(fn) {
  const browser = spawn(
    findChrome(),
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--remote-debugging-port=9333',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  try {
    // Poll until DevTools is listening.
    let target = null;
    for (let i = 0; i < 40 && !target; i += 1) {
      await new Promise((r) => setTimeout(r, 250));
      try {
        const list = await (await fetch('http://127.0.0.1:9333/json/list')).json();
        target = list.find((t) => t.type === 'page');
      } catch {
        /* not up yet */
      }
    }
    if (!target) throw new Error('DevTools did not start.');

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
    // Without this override Chrome paints an opaque white backdrop and
    // `omitBackground` has nothing to remove, so the rounded corners come out
    // white instead of transparent.
    await send('Emulation.setDefaultBackgroundColorOverride', {
      color: { r: 0, g: 0, b: 0, a: 0 },
    });
    return await fn(send);
  } finally {
    browser.kill();
  }
}

const rendered = await withPage(async (send) => {
  const out = new Map();

  // Every distinct size, each with a flag for whether it must fill the frame.
  const jobs = [
    ...ICO_SIZES.map((size) => ({ size, opaque: false, key: size })),
    ...PNG_TARGETS.map((t) => ({ size: t.size, opaque: t.opaque === true, key: t.size })),
  ];

  for (const { size, opaque, key } of jobs) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: size,
      height: size,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', {
      url: `data:text/html;charset=utf-8,${encodeURIComponent(pageHtml(size, opaque))}`,
    });
    await new Promise((r) => setTimeout(r, 500));
    const { data } = await send('Page.captureScreenshot', {
      format: 'png',
      omitBackground: !opaque,
    });
    out.set(key, Buffer.from(data, 'base64'));
    console.log(`  rendered ${size}x${size}${opaque ? ' (opaque)' : ''}`);
  }

  return out;
});

// --- write the .ico -------------------------------------------------------
const ico = buildIco(ICO_SIZES.map((size) => ({ size, data: rendered.get(size) })));
fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), ico);
console.log(`Wrote public/favicon.ico (${(ico.length / 1024).toFixed(1)} KB, ${ICO_SIZES.join('/')})`);

// --- write the PNGs ------------------------------------------------------
for (const { name, size } of PNG_TARGETS) {
  const buf = rendered.get(size);
  fs.writeFileSync(path.join(PUBLIC, name), buf);
  console.log(`Wrote public/${name} (${(buf.length / 1024).toFixed(1)} KB, ${size}px)`);
}

console.log('Animated mark stays canonical at public/favicon.svg');
