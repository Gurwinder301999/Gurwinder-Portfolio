/**
 * Verifies every nav link actually navigates.
 *
 * On mobile this drives the hamburger sheet the way a user does, which is the
 * only way to catch the failure where tapping a link unmounts the anchor
 * before the browser follows its href. On desktop there is no sheet, so the
 * links in the nav row are driven directly.
 *
 * Usage:
 *   node scripts/check-mobile-nav.mjs [url]          # 390x844, via the sheet
 *   VIEWPORT=desktop node scripts/check-mobile-nav.mjs [url]
 *
 * Env: SHOT=<prefix> writes a PNG per link; VIEWPORT=desktop|tablet|phone.
 */
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const url = process.argv[2] ?? 'http://localhost:4182/';
const PORT = 9225;
const LABELS = ['Home', 'About', 'Skills', 'Services', 'Projects', 'Contact'];

const VIEWPORTS = {
  phone: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 2, mobile: true },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
};
const viewportName = process.env.VIEWPORT ?? 'phone';
const viewport = VIEWPORTS[viewportName] ?? VIEWPORTS.phone;
// The sheet only exists below the lg breakpoint.
const usesSheet = viewport.width < 1024;

function findChrome() {
  const roots = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean);
  const rels = ['Google\\Chrome\\Application\\chrome.exe', 'Microsoft\\Edge\\Application\\msedge.exe'];
  for (const root of roots) {
    for (const rel of rels) {
      const p = `${root}\\${rel}`;
      if (fs.existsSync(p)) return p;
    }
  }
  throw new Error('No Chrome or Edge found.');
}

const browser = spawn(
  findChrome(),
  ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, 'about:blank'],
  { stdio: 'ignore' }
);

let target = null;
for (let i = 0; i < 40 && !target; i += 1) {
  await new Promise((r) => setTimeout(r, 250));
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === 'page');
  } catch {
    /* not up yet */
  }
}

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
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { ...viewport });

/**
 * Finds a nav link by its visible text.
 *
 * Two traps here, both of which produced false passes:
 *
 * 1. The desktop row and the mobile sheet render the same labels, and the
 *    inactive one is display:none but still in the DOM. A plain
 *    querySelectorAll returns the hidden copy first, and clicking that never
 *    runs the sheet's onClick — so the menu appears not to close.
 * 2. The sheet's link text is "Home01", label plus its index badge, so an
 *    exact equality match misses it entirely.
 *
 * Match on the rendered box and the label prefix.
 */
const findLink = `((l) => [...document.querySelectorAll('header a')]
  .filter((a) => a.getClientRects().length > 0)
  .find((n) => n.textContent.trim().toLowerCase().startsWith(l.toLowerCase())))`;

async function evaluate(expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (exceptionDetails) {
    const detail = exceptionDetails.exception?.description ?? exceptionDetails.text ?? 'eval failed';
    throw new Error(`${detail}\n--- expression ---\n${expression.slice(0, 300)}`);
  }
  return result.value;
}

async function settle(ms = 900) {
  await new Promise((r) => setTimeout(r, ms));
}

/**
 * Waits until scrolling has stopped moving.
 *
 * A fixed timeout is wrong here: these are smooth scrolls over several
 * thousand pixels, and how long that takes depends on distance and viewport.
 * A 1200ms wait is generous for a short jump and far too short for the last
 * section, which made the result depend on the viewport rather than on the code.
 */
async function waitForScrollSettled(timeout = 6000) {
  const started = Date.now();
  let last = null;
  let stableFor = 0;
  while (Date.now() - started < timeout) {
    const y = await evaluate('Math.round(window.scrollY)');
    if (y === last) {
      stableFor += 150;
      if (stableFor >= 450) return y;
    } else {
      stableFor = 0;
      last = y;
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  return last;
}

await send('Page.navigate', { url });
await settle(3000);

// Each evaluated snippet gets `find` in scope, which resolves a label to the
// link the user can actually see and tap.
const evalJs = (fn, ...args) =>
  evaluate(`(() => { const find = ${findLink}; return (${fn})(${args.map((a) => JSON.stringify(a)).join(',')}); })()`);

let failures = 0;

for (const label of LABELS) {
  // Return to the top so every link is measured from the same starting point.
  // Must be 'instant': the page sets scroll-behavior: smooth in CSS, so a
  // default scrollTo animates and the still-running animation cancels the
  // navigation under test, which shows up as a random subset of links failing.
  await evalJs(() => {
    window.location.hash = '';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return true;
  });
  await settle(700);

  // On mobile, open the sheet the way a user does. The button's label flips to
  // "Close" while it is open, so close first to make this idempotent.
  //
  // Above the lg breakpoint there is no sheet and the toggle is display:none.
  // Skipping it matters: calling .click() on a hidden element still runs its
  // handler, which would open a sheet no user can see and skew every reading.
  if (usesSheet) {
    await evalJs(() => {
      const open = document.querySelector('button[aria-label="Open navigation"]');
      if (open) {
        open.click();
        return true;
      }
      const close = document.querySelector('button[aria-label="Close navigation"]');
      if (close) close.click();
      return true;
    });
    await settle(500);
    await evalJs(() => {
      const open = document.querySelector('button[aria-label="Open navigation"]');
      if (open) open.click();
      return true;
    });
    await settle(500);
  }

  const locked = await evalJs(() => document.body.style.overflow);
  const navH = await evalJs(() => {
    const nav = document.querySelector('header nav');
    const cs = getComputedStyle(document.documentElement);
    return {
      measured: nav ? Math.round(nav.getBoundingClientRect().height) : null,
      varUsed: cs.getPropertyValue('--nav-height').trim(),
      scrollPad: cs.scrollPaddingTop,
    };
  });

  // Capture the section id while the link is still visible; after the sheet
  // closes the anchor is display:none and cannot be found again.
  const before = await evalJs((l) => {
    const a = find(l);
    const id = a ? a.getAttribute('href').replace('#', '') : null;
    const el = id ? document.getElementById(id) : null;
    return {
      id,
      hash: location.hash,
      y: Math.round(window.scrollY),
      targetTop: el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null,
    };
  }, label);

  // Measure the target AFTER the sheet has closed.
  //
  // The open sheet is part of the document flow, so it pushes every section
  // below it further down. Reading getBoundingClientRect() while the menu is
  // open measures a layout that no longer exists a frame later, and the
  // resulting "expected" position is wrong by roughly the sheet's height.
  await evalJs((l) => {
    const a = find(l);
    a.click();
    return true;
  }, label);
  await waitForScrollSettled();

  const after = await evalJs((id) => {
    const el = id ? document.getElementById(id) : null;
    const nav = document.querySelector('header nav');
    return {
      hash: location.hash,
      y: Math.round(window.scrollY),
      topInViewport: el ? Math.round(el.getBoundingClientRect().top) : null,
      navBottom: nav ? Math.round(nav.getBoundingClientRect().bottom) : 0,
      navBottom: nav ? Math.round(nav.getBoundingClientRect().bottom) : 0,
      viewportH: window.innerHeight,
      // Detect the mobile sheet, which is the header's link list *outside* the
      // <nav>. The desktop row is inside the <nav> and is legitimately tall,
      // so testing every header <ul> flags the desktop layout as "menu open".
      menuStillOpen: Boolean(
        document.querySelector('button[aria-label="Close navigation"]') ||
        [...document.querySelectorAll('header ul')].some(
          (u) => !u.closest('nav') && u.getBoundingClientRect().height > 100
        )
      ),
      bodyLocked: document.body.style.overflow === 'hidden',
      // How much further the page can scroll. At the very bottom this is 0 and
      // the last section simply cannot reach the top of the viewport, which is
      // correct behaviour rather than a broken link.
      scrollableLeft: Math.max(0, Math.round(document.documentElement.scrollHeight - window.innerHeight - window.scrollY)),
      docHeight: Math.round(document.documentElement.scrollHeight),
    };
  }, before.id);

  // The real assertion: after the tap, the target section must be sitting in
  // the viewport, clear of the navbar.
  //
  // Checking only "top >= navbar bottom" is not enough — an unscrolled page
  // leaves every section thousands of pixels below the fold, which satisfies
  // that test trivially. The section also has to be above the fold.
  //
  // "Home" is exempt: the hero is the top of the document, so scrolling it in
  // correctly yields y=0 and its top sits at 0 by definition.
  const isHome = label.toLowerCase() === 'home';
  // "Home" is exempt throughout: the hero is the top of the document, so
  // scrolling it into view correctly yields y=0 with its top at 0, which by
  // definition does not clear the fixed navbar. Asserting otherwise would
  // flag the one link that is behaving perfectly.
  //
  // A section near the page end is also exempt from the top-of-viewport rule:
  // once the document is scrolled out, the last section physically cannot
  // reach the top. What matters there is that it is revealed, not hidden.
  const atBottom = after.scrollableLeft <= 2;
  const visibleEnough = isHome
    ? true
    : after.topInViewport !== null && after.topInViewport >= after.navBottom - 2 && (after.topInViewport < after.viewportH || atBottom);
  const scrolled = isHome || after.y > 100;
  // Only meaningful where a sheet exists to be closed.
  const closed = !usesSheet || (!after.menuStillOpen && !after.bodyLocked);
  const ok = after.hash === `#${label.toLowerCase()}` && visibleEnough && scrolled && closed;

  const why = !closed
    ? 'menu stayed open / scroll locked'
    : !scrolled
      ? 'page never scrolled'
      : !after.hash.startsWith('#')
        ? 'hash not set'
        : 'section not in view';
  console.log(
    `${label.padEnd(9)} y=${String(before.y).padStart(5)}->${String(after.y).padEnd(5)} ` +
      `sectionTop=${String(after.topInViewport).padStart(5)} navBottom=${String(after.navBottom).padEnd(4)} ` +
      `left=${String(after.scrollableLeft).padStart(5)} ` +
      `menu=${after.menuStillOpen ? 'OPEN ' : 'closed'} ${ok ? 'OK' : 'BROKEN: ' + why}`
  );

  if (process.env.SHOT) {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${process.env.SHOT}-${label.toLowerCase()}.png`, Buffer.from(data, 'base64'));
  }

  if (!ok) failures += 1;
}

console.log(`\n${viewportName} (${viewport.width}x${viewport.height})${usesSheet ? ' via sheet' : ' via nav row'}`);
ws.close();
browser.kill();
console.log(failures ? `\n${failures} link(s) failed` : '\nAll links navigate correctly');
process.exit(failures ? 1 : 0);

