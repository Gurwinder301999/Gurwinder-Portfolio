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

## Layout

| Path | What it is |
|---|---|
| `index.html` | The single page: hero, about, skills, portfolio, highlights, how-it-works, services, contact |
| `privacy.html`, `terms.html` | Privacy policy and terms of use (plain-English, no trackers — see below) |
| `css/styles.css` | Design tokens + every component. Sections are numbered in comments |
| `js/background.js` | Scroll-scrubbed background: 240 frames mapped to whole-page scroll progress, with a frame-rate-independent lerp |
| `js/main.js` | Sticky header, scroll spy, reveal-on-scroll, stat counters, portfolio filters, notes slider, radial-reveal buttons, name colour sweep, contact form |
| `frames/` | 240 JPEGs used by the background animation (~34 MB) |
| `assets/` | `Gurwinder-Singh-Resume.pdf` |

## Things worth knowing before you edit

- **Tuning the background animation** lives at the top of `js/background.js`:
  `SMOOTHING` (0.12 — lower is smoother), `NEARBY_RADIUS`, `MAX_CONCURRENT`,
  `LOADER_MAX_WAIT`.
- **The contact form has no backend.** With `data-endpoint=""` it validates the fields and
  opens the visitor's own mail app via `data-mailto`. Set `data-endpoint="https://…"` to
  POST to a real service instead. If you do, update privacy.html section 1.
- **Privacy claims must stay true.** The site sets no cookies and loads no analytics; the
  only third-party request is Google Fonts. If you add a tracker or a form backend, add a
  consent banner and update `privacy.html`.
- **Add a skill or tool without duplicating.** `Skills & Expertise` lists capabilities;
  `Systems & Tools` lists the products behind them. Nothing should appear in both columns
  — the test that enforces it is described in the commit history.
- **Before publishing**, fill in the two placeholders marked with HTML comments:
  `<HOSTING PROVIDER>` in `privacy.html` and the governing law in `terms.html`.
- **Still to verify:** the LinkedIn slug in the resume
  (`gurwinder-undefined-583937437`) looks auto-generated, and the github.io portfolio URL
  is from an earlier version of the site.

## Browser support

Modern evergreen browsers. Uses `clip-path`, Web Animations, `IntersectionObserver`,
`ResizeObserver`-free layout, and CSS custom properties. Respects
`prefers-reduced-motion`. Touch devices get simplified hover behaviour and no radial
reveal on buttons.
