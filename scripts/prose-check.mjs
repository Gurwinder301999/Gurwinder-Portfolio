/**
 * Runs a real prose check over the user-visible copy in the data files.
 *
 * Complements `spellcheck.mjs` (which only covers spelling and brand casing)
 * with write-good's readability and passive-voice heuristics plus alex's
 * insensitive-language rules.
 *
 * Usage: node scripts/prose-check.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const writeGood = require('write-good');
// alex ships as an ES module with a default export, so it needs a dynamic
// import rather than createRequire.
const alex = (await import('alex')).default;

const SRC = path.join(import.meta.dirname, '..', 'src');
const FILES = ['data/portfolio.ts', 'sections/projectVisuals.tsx'];

/** Pulls single-quoted prose strings out of a source file. */
function stringsFrom(raw) {
  return [...raw.matchAll(/'([^'\n]{25,})'/g)]
    .map((m) => m[1])
    // Skip class names, Tailwind fragments, paths and CSS-ish tokens.
    .filter((s) => /[a-z] [a-z]/i.test(s) && !/className|rgba?\(|linear-gradient|[{}<>]/.test(s));
}

let flagged = 0;
let total = 0;

for (const rel of FILES) {
  const file = path.join(SRC, rel);
  if (!fs.existsSync(file)) continue;
  const strings = [...new Set(stringsFrom(fs.readFileSync(file, 'utf8')))];

  for (const s of strings) {
    total += 1;
    const issues = [
      ...writeGood(s).map((i) => ({ kind: i.reason, text: i.text })),
      // This build of alex returns a VFile: the findings live on `messages`.
      ...(alex(s).messages ?? []).map((i) => ({ kind: i.name, text: i.reason })),
    ];
    if (!issues.length) continue;
    flagged += 1;
    console.log(`\n  ${rel}\n  "${s.slice(0, 100)}${s.length > 100 ? '…' : ''}"`);
    for (const i of issues) console.log(`      [${i.kind}] ${i.text}`);
  }
}

console.log(`\nProse check: ${flagged} of ${total} strings flagged.`);
