/**
 * Computes WCAG 2.1 contrast ratios for the palette actually used in the
 * codebase, so colour decisions are measured rather than eyeballed.
 *
 * Opacity modifiers like text-[#D7E2EA]/62 are resolved by alpha-compositing
 * over the #0C0C0C canvas, which is what the browser actually paints.
 *
 * Usage: node scripts/check-contrast.mjs
 */

// WCAG 2.1 relative luminance
function luminance(hex) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/** Composites `fg` at `alpha` over opaque `bg`, the way the browser paints it. */
function over(fg, bg, alpha) {
  const n = (h) => h.replace('#', '');
  const f = n(fg);
  const b = n(bg);
  const out = [0, 2, 4].map((i) => {
    const fc = parseInt(f.slice(i, i + 2), 16);
    const bc = parseInt(b.slice(i, i + 2), 16);
    return Math.round(fc * alpha + bc * (1 - alpha));
  });
  return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const BG = '#0C0C0C'; // --bg, the page canvas
const BG_RAISED = '#101013'; // the photo card sits on this

// Every text-[#D7E2EA]/N in the components, with the tier it is used for.
const USES = [
  { token: 'text-[#D7E2EA]', alpha: 1.0, use: 'body copy, headings' },
  { token: 'text-[#D7E2EA]/80', alpha: 0.8, use: 'card body copy' },
  { token: 'text-[#D7E2EA]/70', alpha: 0.7, use: 'links, secondary' },
  { token: 'text-[#D7E2EA]/68', alpha: 0.68, use: 'footer intro' },
  { token: 'text-[#D7E2EA]/65', alpha: 0.65, use: 'paragraphs' },
  { token: 'text-[#D7E2EA]/62', alpha: 0.62, use: 'meta, labels' },
  { token: 'text-[#D7E2EA]/60', alpha: 0.6, use: 'smallest meta' },
];

// WCAG minimums: 4.5 normal, 3.0 for large text (>=24px, or >=18.66px bold).
const AA = 4.5;
const AA_LARGE = 3.0;

console.log(`Contrast over ${BG}\n`);
console.log('token                     composited  ratio   AA-normal  AA-large');

let anyFail = false;
for (const { token, alpha, use } of USES) {
  const composited = alpha === 1 ? '#D7E2EA' : over('#D7E2EA', BG, alpha);
  const r = ratio(composited, BG);
  const passNormal = r >= AA;
  const passLarge = r >= AA_LARGE;
  if (!passNormal && !passLarge) anyFail = true;
  console.log(
    `${token.padEnd(24)}  ${composited.padEnd(10)}  ${r.toFixed(2).padStart(5)}  ` +
      `${(passNormal ? 'pass' : 'FAIL').padEnd(9)}  ${passLarge ? 'pass' : 'FAIL'}   (${use})`
  );
}

// Non-text contrast: the focus ring must be distinguishable from both the
// canvas and the adjacent control it outlines (WCAG 1.4.11, 3:1).
console.log('\nNon-text / UI contrast');
const uiChecks = [
  { name: 'focus ring #b600a8 vs canvas', fg: '#b600a8', bg: BG },
  { name: 'focus ring #b600a8 vs white text', fg: '#b600a8', bg: '#FFFFFF' },
  { name: 'accent #b600a8 vs canvas', fg: '#b600a8', bg: BG },
  { name: 'accent #D14AC0 vs canvas', fg: '#D14AC0', bg: BG },
  // Card/control borders. These were white/14 and composited to 1.44:1, which
  // is invisible; index.css now overrides them to white/40.
  { name: 'control border white/40 vs canvas', fg: over('#FFFFFF', BG, 0.4), bg: BG },
  { name: 'control border #D7E2EA/40 vs canvas', fg: over('#D7E2EA', BG, 0.4), bg: BG },
];
for (const { name, fg, bg } of uiChecks) {
  const r = ratio(fg, bg);
  const pass = r >= 3.0;
  if (!pass) anyFail = true;
  console.log(`  ${name.padEnd(38)} ${r.toFixed(2).padStart(5)}  ${pass ? 'pass' : 'FAIL'} (needs 3.0)`);
}

// Raised surface used behind the photo and terminal panels.
console.log('\nOn the raised card surface #101013');
for (const { token, alpha, use } of USES) {
  const composited = alpha === 1 ? '#D7E2EA' : over('#D7E2EA', BG_RAISED, alpha);
  const r = ratio(composited, BG_RAISED);
  if (r < AA && r < AA_LARGE) anyFail = true;
  console.log(`  ${token.padEnd(24)} ${r.toFixed(2).padStart(5)}  ${r >= AA ? 'pass' : r >= AA_LARGE ? 'large only' : 'FAIL'}`);
}

console.log(
  anyFail
    ? '\nSome combinations fall below WCAG AA. Raise the opacity or lighten the colour.'
    : '\nAll measured combinations meet WCAG AA for their size tier.'
);
process.exit(anyFail ? 1 : 0);

