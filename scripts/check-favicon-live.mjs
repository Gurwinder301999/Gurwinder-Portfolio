/**
 * Confirms the icon set is actually being served, and that the live HTML
 * references it. check-live.mjs proves the build shipped; this proves the
 * favicon specifically landed, which is the part browsers silently 404 on.
 *
 * Usage: node scripts/check-favicon-live.mjs [url]
 */
import https from 'node:https';

const base =
  process.argv[2] ?? 'https://gurwinder301999.github.io/Gurwinder-Portfolio/';

const FILES = [
  'favicon.svg',
  'favicon.ico',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'site.webmanifest',
];

function head(url) {
  return new Promise((resolve) => {
    https
      .request(url, { method: 'HEAD' }, (res) => {
        res.resume();
        resolve({ status: res.statusCode, type: res.headers['content-type'] ?? '' });
      })
      .on('error', (e) => resolve({ status: 0, type: e.message }))
      .end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

let failures = 0;

console.log('ICON ASSETS');
for (const file of FILES) {
  const r = await head(new URL(file, base).href);
  const ok = r.status === 200;
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? 'OK  ' : 'FAIL'} ${String(r.status).padEnd(4)} ${file.padEnd(24)} ${r.type}`
  );
}

const html = await get(base);
const links = [
  ...html.matchAll(/<link rel="icon"[^>]*>/g),
  ...html.matchAll(/<link rel="apple-touch-icon"[^>]*>/g),
  ...html.matchAll(/<link rel="manifest"[^>]*>/g),
].map((m) => m[0]);

console.log('\nREFERENCED IN <head>');
if (!links.length) {
  console.log('  FAIL no icon links found in the served HTML');
  failures += 1;
} else {
  for (const l of links) console.log(`  ${l}`);
}

// Every declared icon must also resolve, otherwise the browser logs a 404.
for (const l of links) {
  const href = l.match(/href="([^"]+)"/)?.[1];
  if (!href) continue;
  const r = await head(new URL(href, base).href);
  if (r.status !== 200) {
    console.log(`  FAIL ${href} -> ${r.status}`);
    failures += 1;
  }
}

console.log(`\nVERDICT: ${failures ? `${failures} PROBLEM(S)` : 'icon set is live'}`);
process.exit(failures ? 1 : 0);
