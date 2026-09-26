/**
 * Flags suspicious words in user-visible copy: common misspellings, wrong
 * casing of brand names, and mixed British/American spellings.
 *
 * Usage: node scripts/spellcheck.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(import.meta.dirname, '..', 'src');

/** Common misspellings, wrong casing, and locale-inconsistent forms. */
const SUSPECT = {
  recieve: 'receive',
  seperate: 'separate',
  occured: 'occurred',
  definately: 'definitely',
  succesful: 'successful',
  sucessful: 'successful',
  becuase: 'because',
  enviroment: 'environment',
  managment: 'management',
  responce: 'response',
  orgnisation: 'organization',
  organisation: 'organization',
  optimise: 'optimize',
  optimised: 'optimized',
  colour: 'color',
  colours: 'colors',
  centre: 'center',
  licence: 'license',
  whilst: 'while',
  learnt: 'learned',
  speciality: 'specialty',
  utilise: 'utilize',
  initialise: 'initialize',
  organise: 'organize',
  analyse: 'analyze',
  behaviour: 'behavior',
  neighbour: 'neighbor',
  favour: 'favor',
  hight: 'height',
  widht: 'width',
  postion: 'position',
  reponsive: 'responsive',
  backgroud: 'background',
  avaliable: 'available',
  accessable: 'accessible',
  adress: 'address',
  commited: 'committed',
  begining: 'beginning',
  existant: 'existence',
  independant: 'independent',
  occurence: 'occurrence',
  persistant: 'persistent',
  refering: 'referring',
  sucess: 'success',
  thier: 'their',
  wierd: 'weird',
  youre: "you're",
  grammer: 'grammar',
  neccessary: 'necessary',
  responsiv: 'responsive',
  advandage: 'advantage',
  benifit: 'benefit',
  knowlege: 'knowledge',
  langauge: 'language',
  lenght: 'length',
  techincal: 'technical',
  verison: 'version',
};

/** Brand and technology names with required casing. */
const BRAND = {
  voip: 'VoIP',
  wifi: 'Wi-Fi',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  iphone: 'iPhone',
};

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const issues = [];
const seen = new Set();

for (const file of walk(SRC)) {
  const raw = fs.readFileSync(file, 'utf8');
  const rel = path.relative(path.join(SRC, '..'), file);

  // Only inspect quoted strings - never class names, JSX attributes or code.
  const strings = [
    ...raw.matchAll(/'([^'\n]{4,})'/g),
    ...raw.matchAll(/"([^"\n]{4,})"/g),
  ].map((m) => m[1]);

  for (const s of strings) {
    if (/^[\s\d#.:(),/-]+$/.test(s)) continue;
    if (/[{}=<>;()#]|className|rgba?\(|linear-gradient/.test(s)) continue;
    // URLs, emails and phone numbers legitimately contain lowercase brand words.
    if (/https?:|@|\.com|\.in\/|tel:/.test(s)) continue;

    for (const word of s.split(/[^A-Za-z'-]+/)) {
      const clean = word.replace(/^['-]+|['-]+$/g, '');
      if (clean.length < 3) continue;
      const key = clean.toLowerCase();

      // Report brand/tech casing only when the source uses the wrong casing.
      // Hyphenated tokens (systemd units, CLI flags, CSS-ish names) are left
      // alone because lowercase is the conventional form there.
      if (BRAND[key] && clean !== BRAND[key] && !word.includes('-')) {
        if (seen.has('b:' + key)) continue;
        seen.add('b:' + key);
        issues.push({ word: clean, fix: BRAND[key], file: rel });
        continue;
      }

      if (seen.has(key)) continue;
      seen.add(key);
      if (SUSPECT[key]) issues.push({ word: clean, fix: SUSPECT[key], file: rel });
    }
  }
}

console.log(`Issues found: ${issues.length}\n`);
for (const i of issues) {
  console.log(`  "${i.word}"  ->  "${i.fix}"   (${i.file})`);
  if (process.env.DEBUG) {
    const raw = fs.readFileSync(path.join(SRC, '..', i.file), 'utf8');
    raw.split('\n').forEach((l, n) => {
      if (l.toLowerCase().includes('voip')) console.log(`      line ${n + 1}: ${l.trim()}`);
    });
  }
}
