/**
 * Pulls every user-visible string out of the source so the copy can be
 * proof-read. Focuses on portfolio.ts (all content) plus literal JSX text and
 * string props in components and sections.
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(import.meta.dirname, '..', 'src');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const found = new Set();

for (const file of walk(SRC)) {
  const raw = fs.readFileSync(file, 'utf8');

  // Single/double quoted strings and JSX string props that hold prose.
  for (const m of raw.matchAll(/>([^<>{}\n]{3,})</g)) {
    const t = m[1].trim();
    if (t && /[a-zA-Z]{3}/.test(t)) found.add(t);
  }
  for (const m of raw.matchAll(/\b(?:label|title|tagline|summary|description|alt|placeholder|detail|overview|challenge|solution|period|location|name|value)=\{?'([^']{3,})'/g)) {
    found.add(m[1].trim());
  }
  // Array entries in portfolio.ts data files
  for (const m of raw.matchAll(/^\s*'([^']{12,})',?\s*$/gm)) {
    const t = m[1].trim();
    if (/[a-z] [a-z]/i.test(t)) found.add(t);
  }
}

const rel = (f) => path.relative(path.join(SRC, '..'), f);
const out = [...found].sort((a, b) => a.localeCompare(b));

console.log(`Extracted ${out.length} distinct strings:\n`);
out.forEach((s) => console.log('  ' + s));
console.log('\n(sourced from ' + rel(SRC) + ')');
