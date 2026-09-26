/**
 * Generates the resume HTML from src/data/portfolio.ts so the PDF and the
 * website can never disagree. The same data that renders the case studies
 * also renders the resume, so a change to a project description is picked up
 * by both.
 *
 * Usage:
 *   node scripts/build_resume.mjs           # writes _resume/resume.html
 *   node scripts/build_resume.mjs --pdf     # also prints public/Gurwinder-Singh-Resume.pdf
 *
 * The PDF step drives headless Chrome, which is already required to preview
 * the site, so it needs no new dependency.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, '_resume');
const PDF_OUT = path.join(ROOT, 'public', 'Gurwinder-Singh-Resume.pdf');

const wantPdf = process.argv.includes('--pdf');

/**
 * Loads the real data module rather than duplicating the copy. portfolio.ts
 * imports lucide-react for its icon fields and reads import.meta.env, neither
 * of which exists under plain Node, so both are stubbed: the resume only ever
 * reads the text fields.
 */
async function loadData() {
  const esbuild = await import('esbuild');
  const entry = path.join(ROOT, 'src', 'data', 'portfolio.ts');
  const out = path.join(OUT_DIR, 'portfolio.generated.mjs');

  fs.mkdirSync(OUT_DIR, { recursive: true });
  await esbuild.build({
    entryPoints: [entry],
    outfile: out,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
    define: { 'import.meta.env.BASE_URL': '"/"' },
    external: ['lucide-react'],
  });

  // Rewrite the bare lucide-react import to a local stub, then generate that
  // stub from the exact named imports the bundle ended up using.
  const code = fs.readFileSync(out, 'utf8');
  const names = [...code.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']/g)]
    .flatMap((m) => m[1].split(','))
    .map((n) => n.trim().split(/\s+as\s+/).pop())
    .filter(Boolean);

  const stub = path.join(OUT_DIR, 'lucide-stub.mjs');
  fs.writeFileSync(
    stub,
    `const icon = () => null;\n${[...new Set(names)].map((n) => `export const ${n} = icon;`).join('\n')}\n`
  );
  fs.writeFileSync(out, code.replace(/from\s*["']lucide-react["']/g, 'from "./lucide-stub.mjs"'));

  return import(pathToFileURL(out).href);
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Strips a leading bullet marker so resume lines are not double-bulleted. */
const line = (s) => esc(s).replace(/^[•\-–—]\s*/, '');

const bulletList = (items) =>
  `<ul class="bullets">${items.map((i) => `<li>${line(i)}</li>`).join('')}</ul>`;

/**
 * Project block. Each case study gets its outcome bullets plus the opening
 * moves of the how-it-works walkthrough, which is what carries the "here is
 * how the thing actually works" signal onto paper without bloating the page.
 */
function projectBlock(p) {
  const mechanics = p.howItWorks.slice(0, 2).join(' ');
  return `
  <article class="entry">
    <header class="entry-head">
      <h3>${esc(p.name)} <span class="dash">—</span> <span class="entry-sub">${esc(p.tagline)}</span></h3>
      <p class="meta">${esc(p.period)} &nbsp;|&nbsp; ${esc(p.location)}</p>
    </header>
    <p class="lede">${esc(p.overview)}</p>
    <p class="mini"><strong>How it works:</strong> ${esc(mechanics)}</p>
    ${bulletList(p.highlights)}
  </article>`;
}

/** Timeline entries carry the employment record; education is the BCA entry. */
function entryBlock(t, kind) {
  const sub = t.place ? ` <span class="dash">—</span> <span class="entry-sub">${esc(t.place)}</span>` : '';
  return `
  <article class="entry">
    <header class="entry-head">
      <h3>${esc(t.title)}${sub}</h3>
      <p class="meta">${esc(t.period)}</p>
    </header>
    <p class="mini">${esc(t.detail)}</p>
  </article>`;
}



function renderResume({ profile, projects, timeline, skills }) {
  // `kind` is the declared discriminator, so the BCA entry cannot leak into the
  // employment section the way a title regex would let it.
  const work = timeline.filter((t) => t.kind === 'work');
  const education = timeline.filter((t) => t.kind === 'education');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(profile.name)} — Resume</title>
<style>
  @page { size: A4; margin: 13mm 14mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Kanit', 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #16161a; font-size: 9.4pt; line-height: 1.42;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .name { font-size: 20pt; font-weight: 800; letter-spacing: -0.01em; text-transform: uppercase; }
  .role { font-size: 10.2pt; color: #6d2130; font-weight: 600; margin-top: 2px; }
  header.top { border-bottom: 2pt solid #b600a8; padding-bottom: 7px; margin-bottom: 11px; }
  .contact { font-size: 8.4pt; color: #3c3c44; margin-top: 4px; }
  h2 {
    font-size: 9.4pt; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700;
    color: #b600a8; border-bottom: 0.7pt solid #dcc3d9; padding-bottom: 2.5px;
    margin: 13px 0 7px; page-break-after: avoid;
  }
  h3 { font-size: 9.9pt; font-weight: 700; }
  .entry { margin-bottom: 9px; page-break-inside: avoid; }
  .entry-head { margin-bottom: 3px; }
  .dash { color: #9a9aa2; font-weight: 400; }
  .entry-sub { font-weight: 500; color: #38383f; font-size: 9pt; }
  .meta { font-size: 8.2pt; color: #6a6a73; }
  .lede { margin-top: 2px; }
  .mini { margin-top: 3px; font-size: 8.7pt; color: #33333a; }
  .bullets { list-style: none; margin-top: 3px; }
  .bullets li { position: relative; padding-left: 11px; margin-bottom: 1.6px; }
  .bullets li::before { content: "\\2022"; position: absolute; left: 2px; color: #b600a8; }
  .skills { font-size: 8.8pt; line-height: 1.6; color: #2b2b31; }
  .summary { font-size: 9.2pt; }
  footer { margin-top: 12px; border-top: 0.7pt solid #d8d8de; padding-top: 5px; font-size: 7.7pt; color: #74747c; text-align: center; }
</style>
</head>
<body>
  <header class="top">
    <p class="name">${esc(profile.name)}</p>
    <p class="role">${esc(profile.role)}</p>
    <p class="contact">
      ${esc(profile.phone)} &nbsp;&bull;&nbsp; ${esc(profile.email)} &nbsp;&bull;&nbsp;
      ${esc(profile.linkedin.replace(/^https?:\/\//, ''))} &nbsp;&bull;&nbsp; ${esc(profile.location)}
    </p>
  </header>

  <h2>Professional Summary</h2>
  <p class="summary">${esc(profile.summary)}</p>

  <h2>Technical Skills</h2>
  <p class="skills">${skills.map((s) => esc(s.name)).join(' &nbsp;&bull;&nbsp; ')}</p>

  <h2>Professional Experience</h2>
  ${work.map((t) => entryBlock(t)).join('')}

  <h2>Projects</h2>
  ${projects.map(projectBlock).join('')}

  <h2>Education</h2>
  ${education.map((t) => entryBlock(t)).join('')}

  <footer>Portfolio and case studies: ${esc(profile.linkedin.replace(/^https?:\/\//, ''))}</footer>
</body>
</html>`;
}

/** Locates a Chromium-based browser for headless printing. */
function findChrome() {
  const roots = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean);
  const rels = ['Google\\Chrome\\Application\\chrome.exe', 'Microsoft\\Edge\\Application\\msedge.exe'];
  for (const root of roots) {
    for (const rel of rels) {
      const p = path.join(root, rel);
      if (fs.existsSync(p)) return p;
    }
  }
  throw new Error('No Chrome or Edge found for PDF printing.');
}

const data = await loadData();
const html = renderResume(data);

fs.mkdirSync(OUT_DIR, { recursive: true });
const htmlPath = path.join(OUT_DIR, 'resume.html');
fs.writeFileSync(htmlPath, html);
console.log(`Wrote ${path.relative(ROOT, htmlPath)}`);

if (wantPdf) {
  const browser = findChrome();
  // Page size comes from the @page rule in the stylesheet; the flag below only
  // suppresses the browser's default header and footer.
  execFileSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=10000',
      `--print-to-pdf=${PDF_OUT}`,
      pathToFileURL(htmlPath).href,
    ],
    { stdio: 'ignore' }
  );
  console.log(`Wrote ${path.relative(ROOT, PDF_OUT)} (${(fs.statSync(PDF_OUT).size / 1024).toFixed(0)} KB)`);
}
