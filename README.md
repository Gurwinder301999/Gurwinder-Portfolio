# Gurwinder Singh — Portfolio

Personal portfolio for **Gurwinder Singh, IT Support Engineer & Developer** (Paharganj,
New Delhi). Every detail on the site — experience, education, skills, the twelve project
case studies and contact information — comes from the resume PDF in `assets/`.

No frameworks, no build step, no dependencies, no tracking, no cookies.

## Run it locally

```bash
python -m http.server 8123      # → http://localhost:8123
```

or `npm start` (which shells out to `npx serve`). Any static server works; opening
`index.html` straight off disk will not, because browsers block the frame requests on
`file://`.

## Security

```bash
npm run check          # 40 assertions, no dependencies, exits non-zero on failure
```

### What this site is exposed to

It is a **static site**: no server-side code, no database, no authentication, no file
uploads, no user input stored anywhere. There is no application to compromise and no
attack surface for traditional malware, so "malware protection" here means hardening
what does exist, not running an antivirus.

The genuine risks for a site like this are: a script injected into the markup running
in a visitor's browser, the page being framed for clickjacking, a secret committed to
git, and a third-party host being compromised. Those are what the controls below cover.

### Controls in place

| Control | Where | What it stops |
|---|---|---|
| Content-Security-Policy | `vercel.json` | Any injected script. `script-src 'self'`, no `unsafe-inline`, no `unsafe-eval` |
| `X-Frame-Options` + `frame-ancestors 'none'` | `vercel.json` | Clickjacking |
| `X-Content-Type-Options: nosniff` | `vercel.json` | MIME confusion |
| `Referrer-Policy` | `vercel.json` | Leaking the URL to third parties |
| `Permissions-Policy` | `vercel.json` | Camera, mic, geolocation, payment |
| `Cross-Origin-Opener-Policy` / `-Resource-Policy` | `vercel.json` | Cross-origin tab takeover, asset embedding |
| HSTS (2 years, preload) | `vercel.json` | Downgrade to plain HTTP |
| `rel="noopener"` on every `target="_blank"` | `index.html` | The opened page reaching back via `window.opener` |

The CSP is deliberately strict and was verified in headless Chrome against the real
header set: the sweep, radial reveal, counters, quote slider, canvas background and
Google Fonts all still work, and an injected inline script is refused. `style-src`
carries `'unsafe-inline'` because the reveal and sweep effects write `element.style`
at runtime; `script-src` does not need it, since there is no inline script and the
`application/ld+json` block is data the browser never executes.

### What `vercel.json` does *not* cover

**GitHub Pages ignores it.** Pages supports neither `vercel.json` nor `.htaccess`, so
the `gurwinder301999.github.io` deployment sends no CSP at all. Vercel is the
hardened host; giving Pages the same headers needs a proxy in front (Cloudflare or
similar). Treat the Vercel URL as canonical for that reason.

### Adding anything third-party

A new external script, font, or analytics tag will be **blocked by the CSP** until
`vercel.json` is updated to allow it. That is the policy working, not a bug. Before
adding a third party, ask whether the site needs it: each one is a supply-chain risk,
and `privacy.html` states exactly what is loaded.

If you do add one, re-run `npm run check`. It asserts that only the Google Fonts hosts
are contacted and that no analytics or tag manager is present, so the privacy policy
stays true.

## Layout

| Path | What it is |
|---|---|
| `index.html` | The single page: hero, about, skills, portfolio, highlights, how-it-works, services, contact |
| `privacy.html`, `terms.html` | Privacy policy and terms of use (plain-English, no trackers — see below) |
| `css/styles.css` | Design tokens + every component. Sections are numbered in comments |
| `js/background.js` | Scroll-scrubbed background: 240 frames mapped to whole-page scroll progress, with a frame-rate-independent lerp |
| `js/main.js` | Sticky header, scroll spy, reveal-on-scroll, stat counters, portfolio filters, notes slider, radial-reveal buttons, name colour sweep, contact form |
| `vercel.json` | Security headers and cache policy for the Vercel deployment |
| `scripts/security-check.js` | The `npm run check` assertions |
| `frames/` | 240 JPEGs used by the background animation (~34 MB) |
| `assets/` | `Gurwinder-Singh-Resume.pdf` |

## Things worth knowing before you edit

This section used to live in comments inside the code. The code is now comment-free, so
everything that used to be documented in-file is collected here instead.

### `js/background.js` — scroll-scrubbed background

240 JPGs (`frames/frame_000000.jpg` … `frame_000239.jpg`) are drawn on a fixed,
full-viewport canvas. Scroll progress over the *whole page* maps to a frame index, and a
time-based lerp keeps playback smooth even though the source frames are only 30 fps.

Tuning lives at the top of the file:

| Setting | Default | Effect |
|---|---|---|
| `SMOOTHING` | `0.12` | 0–1, lower = smoother/slower catch-up |
| `NEARBY_RADIUS` | `12` | frames kept hot around the playhead |
| `MAX_CONCURRENT` | `6` | parallel image downloads |
| `LOADER_MAX_WAIT` | `2200` | ms before the preloader gives up and hides |

The loader is deliberately non-blocking: it never stops the page from being read.

### Background video opacity

The video's strength is one knob: `--bg-video-opacity` in the `:root` block of
`css/styles.css` (currently `0.62`). Three layers stack behind the content:

| Layer | Value | Purpose |
|---|---|---|
| `#frame-canvas` | `opacity: var(--bg-video-opacity)` | how much of the video shows through |
| `filter` on the canvas | `saturate(0.85) contrast(1.05) brightness(0.78)` | tames bright frames |
| `.bg-scrim` | `0.90` top, `0.58` / `0.66` middle, `0.94` bottom | keeps the header, footer and body copy readable |

Raising the knob without darkening the scrim is what makes the video brighter, but it also
eats into text contrast. Measured against the brightest pixels in the real frames, the hero
lead text (`#a8a8a8`) sits at **5.06:1** — above the 4.5:1 WCAG AA threshold. If you push
the knob much past `0.7`, darken the scrim's middle stops at the same time, or raise the
hero text colours.

### `js/main.js` — what each block does

1. Sticky header · 2. Mobile navigation · 3. Scroll progress + sticky state ·
4. Active nav link (position-based scroll spy) · 5. Reveal on scroll ·
6. Animated stat counters (supports decimals via `data-decimals`) ·
7. Portfolio filtering · 8. "How it works" slider ·
9. Contact form · 10. Dynamic footer year ·
11. Radial reveal on buttons · 12. Name colour sweep (portrait)

Two of those are ports of React/framer-motion components into vanilla JS, kept
dependency-free:

- **Radial reveal** — a clipped copy of each button's own content sits on top, and a
  circle growing from the pointer uncovers it. `useAnimate()` + `stagger()` became a
  small rAF tween (0.45s easeInOut) driving `clip-path`. Two custom properties,
  `--btn-reveal-bg` / `--btn-reveal-fg`, control the reveal colour per variant. Faces are
  only built when the device reports `(hover: hover)`; on touch they are skipped and the
  CSS hides them too.
- **Name colour sweep** — the portrait name is split into per-character spans; each
  character starts in the wave colour and settles into its own colour, staggered.
  Tunable on the element: `data-sweep-wave` (start colour), `data-sweep-stagger`
  (seconds between characters), `data-sweep-duration`, `data-sweep-y` (start offset in
  `em`) and `data-sweep-spread` (% of characters in the coloured band). Fires once via
  `IntersectionObserver`, and is skipped under `prefers-reduced-motion`.

### The resume PDF is generated — do not hand-edit it

`assets/Gurwinder-Singh-Resume.pdf` is built from a single source of truth in a
*sibling* project, so the file in `assets/` is a copy and editing it directly would be
overwritten on the next build:

```powershell
cd "C:\Users\Lenovo\Desktop\Gurwinder Singh\Portfoleo"
# edit src\data\portfolio.ts  (profile.summary, profile.website, skills, timeline, projects)
node scripts/build_resume.mjs --pdf
Copy-Item public\Gurwinder-Singh-Resume.pdf "C:\Users\Lenovo\Desktop\Gurwinder Singh\omniroute\portfolio\assets\" -Force
```

- `profile.website` drives **both** the QR code and the footer URL on the printed page, so
  it must match the live site. It is currently the Vercel URL; Vercel and GitHub Pages
  serve identical files, and the QR points at Vercel.
- `profile.linkedin` is rendered into the resume header. See the note below.
- The generator is self-contained: `build_resume.mjs` bundles the TypeScript data with
  esbuild, generates the QR with a dependency-free encoder, and prints with headless
  Chrome. It needs no extra tooling. `node scripts/check-qr.mjs` validates the encoder
  (75 assertions) if the QR ever changes.
- After copying, confirm the two files match by hash, not by size alone:
  `Get-FileHash` on both paths should report the same SHA256.

### Editing content

- **Swapping a project thumbnail:** drop an `<img class="project__img" src="assets/project-1.jpg" alt="" />`
  in place of the gradient thumb block.
- **Resume buttons** point at `assets/Gurwinder-Singh-Resume.pdf` from four places: the
  hero, the Services panel, the Portfolio footer and the contact note. It is deliberately
  *not* in the site footer.
- **Adding a skill or tool without duplicating.** `Skills & Expertise` lists capabilities;
  `Systems & Tools` lists the products behind them. Nothing should appear in both columns.
  These two lists are hand-maintained in `index.html`; the same skills are declared a third
  time in `portfolio.ts` for the PDF. Change all three together or the site and the printed
  resume will drift.
- **Contact form:** `data-endpoint=""` means it opens the visitor's mail app pre-filled to
  `data-mailto`. Set `data-endpoint="https://…"` to POST real submissions instead. If you
  do, update `privacy.html` section 1.
- **Before publishing**, fill in the two placeholders that are still marked in the text
  itself:
  - `<HOSTING PROVIDER>` in `privacy.html` section 5 — name whoever serves the files and
    check their log-retention period.
  - Governing law in `terms.html` section 9 is currently set to India / courts of New Delhi.

### Privacy claims must stay true

The site sets no cookies and loads no analytics; the only third-party request is Google
Fonts. If you add a tracker or connect the form to a backend, add a consent banner and
update `privacy.html` first — otherwise the policy becomes untrue.

### Still to verify

The LinkedIn slug carried over from the resume
(`gurwinder-undefined-583937437`) looks auto-generated and will 404; it appears in three
places in `index.html`.

## Browser support

Modern evergreen browsers. Uses `clip-path`, Web Animations, `IntersectionObserver`,
`ResizeObserver`-free layout, and CSS custom properties. Respects
`prefers-reduced-motion`. Touch devices get simplified hover behaviour and no radial
reveal on buttons.
