/**
 * Downloads the Kanit latin subset so the site stops depending on a
 * render-blocking third-party request to Google Fonts.
 *
 * Only the latin subset is fetched, and only the weights the code actually
 * uses, which keeps the payload to a fraction of the full family.
 *
 * Usage: node scripts/fetch_fonts.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Deliberately src/assets, not public/. Files in public/ are copied verbatim,
// so a CSS url() pointing at them must be absolute and would break the moment
// the site is served from a sub-path such as /Gurwinder-Portfolio/. Letting
// Vite process the files from src/ makes it emit hashed assets and rewrite the
// url() with the correct base, which is what `base: './'` depends on.
const FONT_DIR = path.join(ROOT, 'src', 'assets', 'fonts');

/** Weights present in the markup; 800 is deliberately absent. */
const WEIGHTS = [300, 400, 500, 600, 700, 900];

// Google serves woff2 only to browsers that advertise support. A modern UA is
// required or it hands back a legacy ttf.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const CSS_URL =
  'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap';

fs.mkdirSync(FONT_DIR, { recursive: true });

const css = await (
  await fetch(CSS_URL, { headers: { 'User-Agent': UA } })
).text();

/**
 * Google emits one @font-face per weight per subset, preceded by a
 * `/* subset *\/` comment. Split on those so each block can be matched to its
 * subset, and keep only the latin one.
 */
const blocks = css.split('/*').slice(1);
const latin = new Map();

for (const block of blocks) {
  const subset = block.slice(0, block.indexOf('*/')).trim();
  if (subset !== 'latin') continue;

  const weight = Number(block.match(/font-weight:\s*(\d+)/)?.[1]);
  const url = block.match(/src:\s*url\(([^)]+)\)/)?.[1];
  const range = block.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim();
  if (weight && url && WEIGHTS.includes(weight)) latin.set(weight, { url, range });
}

if (!latin.size) throw new Error('No latin @font-face blocks found in the Google CSS.');

const faces = [];
let total = 0;

for (const weight of WEIGHTS) {
  const entry = latin.get(weight);
  if (!entry) {
    console.warn(`  weight ${weight} not offered by Google, skipping`);
    continue;
  }

  const file = `kanit-latin-${weight}.woff2`;
  const bytes = Buffer.from(await (await fetch(entry.url)).arrayBuffer());
  fs.writeFileSync(path.join(FONT_DIR, file), bytes);
  total += bytes.length;
  console.log(`  ${file.padEnd(26)} ${(bytes.length / 1024).toFixed(1)} KB`);

  faces.push(
    `@font-face {\n` +
      `  font-family: 'Kanit';\n` +
      `  font-style: normal;\n` +
      `  font-weight: ${weight};\n` +
      `  font-display: swap;\n` +
      `  /* Relative to this file, which sits one level above fonts/. Vite resolves\n` +
      `     it, emits a hashed copy, and rewrites the path for the deploy base. */\n` +
      `  src: url('./fonts/${file}') format('woff2');\n` +
      `  unicode-range: ${entry.range};\n` +
      `}`
  );
}

// Written next to the woff2 files so the relative url() below resolves.
fs.writeFileSync(path.join(ROOT, 'src', 'assets', 'fonts.css'), `${faces.join('\n\n')}\n`);
console.log(
  `\nWrote src/assets/fonts.css (${faces.length} faces) and ${(total / 1024).toFixed(1)} KB of woff2`
);
