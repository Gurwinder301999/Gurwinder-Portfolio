/**
 * End-to-end check of the deployed site: fetches the page, then every asset it
 * references, and reports the HTTP status of each.
 *
 * Usage: node scripts/check-live.mjs [url]
 */
import https from 'node:https';

const base =
  process.argv[2] ?? 'https://gurwinder301999.github.io/Gurwinder-Portfolio/';
const origin = new URL(base).origin;

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', reject);
  });
}

function head(url) {
  return new Promise((resolve) => {
    https
      .request(url, { method: 'HEAD' }, (res) => {
        res.resume();
        resolve({ status: res.statusCode, type: res.headers['content-type'] });
      })
      .on('error', (e) => resolve({ status: 0, type: e.message }))
      .end();
  });
}

const page = await fetchText(base);
const script = page.body.match(/<script[^>]*src="([^"]+)"/)?.[1];
const css = page.body.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/)?.[1];
const canonical = page.body.match(/rel="canonical" href="([^"]+)"/)?.[1];
const ogImage = page.body.match(/property="og:image" content="([^"]+)"/)?.[1];

console.log('PAGE');
console.log('  url        :', base);
console.log('  status     :', page.status);
console.log('  script src :', script ?? '(NONE)');
console.log('  css href   :', css ?? '(NONE)');
console.log('  #root div  :', page.body.includes('id="root"') ? 'present' : 'MISSING');
console.log(
  '  build clean:',
  page.body.includes('__SITE_URL__') || page.body.includes('/src/main.tsx')
    ? 'NO - serving unbuilt source'
    : 'yes',
);

console.log('\nSEO');
console.log('  canonical  :', canonical ?? '(NONE)');
console.log('  og:image   :', ogImage ?? '(NONE)');

const assets = [script, css].filter(Boolean).map((p) => new URL(p, base).href);
assets.push(new URL('Gurwinder-Singh-Resume.pdf', base).href);
assets.push(new URL('profile-pic.jpeg', base).href);

console.log('\nASSETS');
for (const url of assets) {
  const r = await head(url);
  const name = url.split('/').pop();
  const ok = r.status === 200;
  console.log(
    `  ${ok ? 'OK  ' : 'FAIL'} ${String(r.status).padEnd(4)} ${name.padEnd(34)} ${r.type ?? ''}`,
  );
}

const allOk =
  page.status === 200 && assets.every(Boolean) && script && css;
console.log(
  '\n' + (script && css ? 'VERDICT: built output is being served' : 'VERDICT: STILL BROKEN'),
);

