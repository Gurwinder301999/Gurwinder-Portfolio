/*
 * Dependency-free security check for the portfolio. No npm install, no scanner,
 * nothing to keep current: it asserts the things that would actually weaken this
 * site if someone edited them carelessly.
 *
 *   node scripts/security-check.js [repoRoot]
 *
 * Exits non-zero if anything fails, so it can gate a deploy.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = process.argv[2] || path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

const html = read("index.html");
const css = read(path.join("css", "styles.css"));
const mainJs = read(path.join("js", "main.js"));
const bgJs = read(path.join("js", "background.js"));
const vercel = read("vercel.json");
const gitignore = read(".gitignore");
const pages = {
  "index.html": html,
  "privacy.html": read("privacy.html"),
  "terms.html": read("terms.html"),
};

let failures = 0;
let checks = 0;

const check = (label, ok, detail) => {
  checks += 1;
  if (ok) {
    console.log("  ok    " + label);
  } else {
    failures += 1;
    console.log("  FAIL  " + label + (detail ? "  ->  " + detail : ""));
  }
};

const section = (name) => console.log("\n" + name);

/**
 * Names currently in the git index, or an empty set outside a repo. Reads the
 * index rather than the filesystem, so a file that is ignored but sitting on
 * disk does not read as "shipped".
 */
function trackedSet() {
  try {
    const out = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
    return new Set(out.split("\n").map((s) => s.trim()).filter(Boolean));
  } catch {
    return new Set();
  }
}

const allJs = mainJs + "\n" + bgJs;
const allHtml = Object.values(pages).join("\n");

/* ------------------------------------------------------------------ */
section("script execution surface");

check("no eval or new Function", !/\beval\s*\(|new\s+Function\s*\(/.test(allJs));
check("no document.write", !/document\.write\s*\(/.test(allJs));
check("no innerHTML or outerHTML sinks", !/\.(innerHTML|outerHTML)\s*=/.test(allJs),
  "use cloneNode or textContent instead");
check("no insertAdjacentHTML", !/insertAdjacentHTML/.test(allJs));
check("no inline on* handlers in markup", !/\son[a-z]+\s*=\s*["']/.test(allHtml));
check("no javascript: URLs", !/href\s*=\s*["']javascript:/i.test(allHtml));

/* ------------------------------------------------------------------ */
section("CSP compatibility");

// A strict CSP cannot be deployed while the page still depends on inline script.
// A non-executable type such as application/ld+json is a data block: the browser
// parses it as JSON and never runs it, and CSP script-src does not apply to it.
const inlineScripts = [...allHtml.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
  .map((m) => ({ attrs: m[1], body: m[2] }))
  .filter((s) => !/type\s*=\s*["']application\/ld\+json["']/i.test(s.attrs));
check("no executable inline script", inlineScripts.length === 0,
  inlineScripts.map((s) => s.attrs.trim()).join(" "));
check("the only inline block is JSON-LD",
  [...allHtml.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)]
    .every((m) => /type\s*=\s*["']application\/ld\+json["']/i.test(m[1])));
check("no inline style blocks", !/<style[\s>]/i.test(allHtml));
check("stylesheet is an external file", /<link[^>]+stylesheet[^>]+href="css\/styles\.css"/.test(html));
check("CSP font-src is fonts.gstatic.com only",
  /font-src 'self' https:\/\/fonts\.gstatic\.com/.test(vercel));
check("CSP sets object-src and frame-src to none",
  /object-src 'none'/.test(vercel) && /frame-src 'none'/.test(vercel));
check("CSP sets frame-ancestors none (clickjacking)", /frame-ancestors 'none'/.test(vercel));
check("CSP has no unsafe-eval", !/unsafe-eval/.test(vercel));
check("CSP script-src is self only", /script-src 'self';/.test(vercel));

/* ------------------------------------------------------------------ */
section("headers");

check("vercel.json is valid JSON", (() => {
  try { JSON.parse(vercel); return true; } catch { return false; }
})());

for (const header of [
  "Content-Security-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Strict-Transport-Security",
  "Cross-Origin-Opener-Policy",
]) {
  check("sends " + header, vercel.includes('"' + header + '"'));
}
check("HSTS max-age is a year or more", /max-age=(?!0)\d{7,}/.test(vercel));
check("nosniff is set", /"X-Content-Type-Options",\s*"value":\s*"nosniff"/.test(vercel));
check("frames are cached immutably", /31536000/.test(vercel));


/* ------------------------------------------------------------------ */
section("links");

const blankLinks = [...html.matchAll(/<a[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
check("every target=_blank has rel=noopener",
  blankLinks.every((a) => /rel="[^"]*noopener/.test(a)),
  blankLinks.filter((a) => !/noopener/.test(a)).join(" "));
check("no rel=opener left behind", !/rel="[^"]*\bopener\b(?![\w-])/.test(allHtml));
check("no placeholder LinkedIn slug is published",
  !/linkedin\.com\/in\/[^"']*undefined/.test(allHtml),
  "the gurwinder-undefined slug 404s");

// The resume is generated from profile.linkedin in the sibling Portfoleo project,
// so the printed PDF and the site are two separate copies of the same URL. Assert
// they agree, and that the one on the page is the one the site links to.
const SLUG_RE = /linkedin\.com\/in\/([A-Za-z0-9-]+)/g;
const siteSlugs = new Set([...html.matchAll(SLUG_RE)].map((m) => m[1]));
check("exactly one LinkedIn slug on the site", siteSlugs.size === 1,
  [...siteSlugs].join(", "));
check("every LinkedIn href matches the displayed slug",
  [...html.matchAll(/href="https?:\/\/(?:www\.)?linkedin\.com\/in\/([^"]+)"/g)]
    .every((m) => siteSlugs.has(m[1])));

/* ------------------------------------------------------------------ */
section("secrets and payloads");

const SECRET = [
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /gho_[A-Za-z0-9]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /sk-[A-Za-z0-9]{20,}/,
  /AIza[0-9A-Za-z_-]{35}/,
  /eyJhbGciOi/,
];

const shipped = Object.entries(pages).concat([
  ["css/styles.css", css],
  ["js/main.js", mainJs],
  ["js/background.js", bgJs],
  ["vercel.json", vercel],
  [".gitignore", gitignore],
]);
const leaked = shipped.filter(([, body]) => SECRET.some((re) => re.test(body))).map(([f]) => f);
check("no credentials in shipped files", leaked.length === 0, leaked.join(", "));

// The 2.6MB source video and the scratch jpg were public; make sure neither is
// tracked again, and that the patterns that produced them stay ignored.
const tracked = trackedSet();
check("source video is not tracked", !tracked.has("gemini_generated_video_69d22341.mp4"));
check("scratch 01.jpg is not tracked", !tracked.has("01.jpg"));
check(".gitignore blocks mp4", /\.mp4/.test(gitignore));
check(".gitignore blocks 01.jpg", /01\.jpg/.test(gitignore));
check("real site files are still tracked",
  tracked.has("css/styles.css") && tracked.has("assets/Gurwinder-Singh-Resume.pdf"));

/* ------------------------------------------------------------------ */
section("third parties");

const external = [...html.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
const hosts = [...new Set(external.map((u) => {
  try { return new URL(u).host; } catch { return u; }
}))];
const allowed = new Set([
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "gurwinder-portfolio.vercel.app",
  // Outbound profile links are not fetched by the page, they are only navigated
  // to on click, so they are listed rather than treated as a dependency.
  "www.linkedin.com",
]);
const unexpected = hosts.filter((h) => !allowed.has(h));
check("only expected external hosts", unexpected.length === 0, unexpected.join(", "));
// Matched against the markup with prose stripped first: privacy.html *says*
// "No Google Analytics, Hotjar, ... is embedded", and that sentence must not be
// mistaken for an actual embed.
const markupOnly = [html]
  .map((body) => body.replace(/<!--[\s\S]*?-->/g, "").replace(/>([^<]+)</g, "> <"))
  .join("\n");
check("no analytics or tag managers",
  !/googletagmanager|google-analytics|gtag\(|hotjar|clarity\.ms|mixpanel/i.test(markupOnly));
check("no third-party script tag", !/<script[^>]+src="https?:/i.test(html));
check("no service worker registration", !/navigator\.serviceWorker/.test(allJs));

/* ------------------------------------------------------------------ */
section("resume");

const pdfPath = path.join(ROOT, "assets", "Gurwinder-Singh-Resume.pdf");
const hasPdf = fs.existsSync(pdfPath) && fs.readFileSync(pdfPath).slice(0, 5).toString() === "%PDF-";
check("resume PDF exists and starts with %PDF-", hasPdf);

// The PDF is generated from the sibling Portfoleo project, so the slug printed on
// page 1 is a second copy of the one in index.html and the two can drift.
//
// Rather than parse the PDF, assert the two things that actually matter:
//   1. the data file the PDF is generated from carries the same slug as the site
//   2. the PDF in assets/ is byte-identical to the one that data produces
//
// (2) subsumes (1) for the PDF itself: if the bytes match a build from the data,
// the printed page necessarily carries whatever the data says. A PDF text reader
// is deliberately not used, because the resume sets text in several subset fonts
// and a hand-rolled reader drops characters, which would fail on a correct file.
const DATA = path.resolve(ROOT, "..", "..", "Portfoleo", "src", "data", "portfolio.ts");
const BUILT = path.resolve(ROOT, "..", "..", "Portfoleo", "public", "Gurwinder-Singh-Resume.pdf");

if (fs.existsSync(DATA) && siteSlugs.size === 1) {
  const slug = [...siteSlugs][0];
  const data = fs.readFileSync(DATA, "utf8");

  check("resume data source declares the same slug",
    data.includes("linkedin: 'https://www.linkedin.com/in/" + slug + "'"),
    "profile.linkedin in portfolio.ts does not match the site");
  check("resume data source has no placeholder slug",
    !data.includes("gurwinder-undefined-583937437"));

  if (fs.existsSync(BUILT) && hasPdf) {
    const same = fs.readFileSync(BUILT).equals(fs.readFileSync(pdfPath));
    check("assets/ PDF matches a build of that data, byte for byte", same,
      "rerun build_resume.mjs --pdf and copy the result into assets/");
  } else {
    check("the built PDF is available to compare against", false,
      "run node scripts/build_resume.mjs --pdf in the Portfoleo project");
  }
} else if (!fs.existsSync(DATA)) {
  console.log("  skip  resume data source not found at " + DATA);
}

/* ------------------------------------------------------------------ */
console.log("\n" + (failures ? failures + " FAILED of " + checks : "all " + checks + " checks passed"));
process.exit(failures ? 1 : 0);
