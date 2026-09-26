# Gurwinder Singh — Portfolio

Personal portfolio for **Gurwinder Singh**, IT Support Engineer (desktop support, network administration, VoIP / IP telephony).

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Framer Motion · lucide-react

---

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` only |
| `npm run spellcheck` | Misspellings, brand casing, US/UK consistency |
| `npm run prose` | Readability and passive-voice pass over the copy |
| `npm run resume` | Rebuild `_resume/resume.html` from the data file |
| `npm run resume:pdf` | Also print `public/Gurwinder-Singh-Resume.pdf` |
| `npm run favicon` | Re-render the favicon rasters from `public/favicon.svg` |
| `npm run favicon:check` | Assert the generated icons are well-formed |

### Prose checking

`spellcheck` catches typos. `prose` runs [write-good](https://github.com/write-good/write-good)
and [alex](https://github.com/Krukow/alex) over the strings in
`src/data/portfolio.ts` and reports weakeners, passive voice, and wordiness.

Expect a fair number of hits and judge them rather than chasing them to zero.
Both tools are tuned for consumer prose, so in *explanatory* technical writing a
passive construction is often the accurate one — "voice traffic is separated onto
its own VLAN" describes a system behaviour, not a weak sentence. Read each
finding against the intent before changing the copy.

---

## Deploying to GitHub Pages

Deployment runs automatically from GitHub Actions on every push to `main`.

### 1. Set the Pages source (required)

Go to **Settings → Pages → Build and deployment → Source** and choose
**GitHub Actions**.

> **Why this step matters.** If the source is left on *"Deploy from a branch"*
> (pointing at `main` / root), GitHub publishes the repository **as-is** with no
> build. The raw `index.html` ships with its unrecompiled
> `<script src="/src/main.tsx">` reference, the browser 404s on that path, and
> you get a **blank page**. A green tick next to the deploy workflow does *not*
> mean the site is live — check the Source setting, not just the Actions tab.

### 2. One-time repo setup

1. Create an empty GitHub repository (no README, no `.gitignore`).
2. Point this folder at it and push:

   ```bash
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

The live site will be at `https://<user>.github.io/<repo>/`.

### 3. Verify

```bash
node scripts/check-live.mjs
```

Prints the script and stylesheet URLs that are actually being served. If the
script path ends in `/src/main.tsx`, the build step is not being used.

**Optional — override the canonical/social URL**

Canonical and `og:image` tags are built as absolute URLs, defaulting to
`https://gurwinder301999.github.io/Gurwinder-Portfolio`. This matters: search
engines ignore a relative canonical and most social scrapers drop a relative
`og:image` outright, so a relative fallback would emit markup that does
nothing.

Create a repository variable named `VITE_SITE_URL` under
**Settings → Secrets and variables → Actions → Variables** to override the
default — required if you move to a custom domain.

---

## Security headers

The page ships a Content-Security-Policy as a `<meta>` tag in `index.html`.

**A meta tag is a compromise forced by the host.** GitHub Pages cannot send
arbitrary response headers, and `<meta http-equiv>` is the only way to attach a
policy from a static build. It is weaker than a real header in two ways worth
knowing before you rely on it:

- It applies only after the `<meta>` is parsed, so anything requested before
  that point is not covered.
- `frame-ancestors`, `report-uri`, and `sandbox` are **ignored** in meta form.
  `frame-ancestors` in particular is the directive that stops clickjacking, and
  it silently does nothing here.

If you move to a host that can set headers — Cloudflare Pages, Netlify, Vercel,
or CloudFront in front of the bucket — send the policy as a real header instead
and delete the meta tag. The equivalent, tightened:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
Referrer-Policy: strict-origin-when-cross-origin
```

`style-src` needs `'unsafe-inline'` because the app sets element styles inline
throughout; it is a real weakening and the next thing to remove if the styling
ever moves to a static stylesheet. `script-src` stays strict — the build's
safety-net script was moved out of an inline `<script>` block specifically so
this could remain `'self'`.

To confirm the policy is live and not just present in the source:

```bash
node scripts/perf-check.mjs https://gurwinder301999.github.io/Gurwinder-Portfolio/
```

The CONSOLE section reports any violation, and the request count shows the
third-party origins still being contacted.

---

## How routing works

This is a single-page app that uses **hash routing** (`#/project/<id>`), so no
server-side rewrite rules or `404.html` shim are required — GitHub Pages serves
`index.html` for every request.

```bash
/#/project/tdi-ip-phone     → project landing page
/#/project/lg-house-voip   → project landing page
/#contact                   → contact section on the home page
```

`vite.config.ts` sets `base: './'`, so a single build works unchanged on user
sites, project sites, and custom domains.

---

## Updating content

Almost everything lives in **`src/data/portfolio.ts`**:

| Export | Controls |
| --- | --- |
| `profile` | Name, role, contact details, résumé link, hero copy |
| `navLinks` | Navbar and footer links |
| `projects` | The case studies and their landing-page content |
| `services` | The five service rows |
| `skills` | Skill bars and proficiency levels |
| `timeline` | Career and education entries |
| `contactChannels` | The contact card grid |
| `marqueeTiles` / `heroTech` | Scrolling toolkit and hero tech strip |

**Adding a project:** append an object to `projects`. Give it a unique `id`
(used in the URL) and pick the three `visuals` kinds — `terminal`, `logs`,
`chart`, `topology`, `devices`, or `console`. The card, the landing page, and
the prev/next navigator all pick it up automatically.

Each project also carries a `howItWorks` array: a numbered, plain-language
walkthrough of the mechanics, shown on the landing page and summarised on the
résumé. Write it for a technical reader who does not know this particular
stack — explain *why* the mechanism exists and what breaks without it, rather
than restating the tech list.

**Regenerating the résumé:** the PDF is generated from `src/data/portfolio.ts`
rather than edited by hand, so it can never drift from the website.

```bash
npm run resume        # writes _resume/resume.html for review
npm run resume:pdf    # prints public/Gurwinder-Singh-Resume.pdf
```

It loads the data module through esbuild and stubs `lucide-react`, so the
icons cost nothing in a printed document, then prints through headless Chrome
or Edge. Edit the content in `portfolio.ts`, never in the HTML.

**Swapping the résumé or photo by hand:** replace `public/Gurwinder-Singh-Resume.pdf`.
For the photo, drop the new image in the project root and run:

```bash
python scripts/make_profile_photo.py <source-image> public/profile-pic.jpeg
```

It centre-crops to the `4:5` frame the portrait card uses, resizes to 800px
wide, and writes an optimised progressive JPEG. Raw photo sources are
gitignored — only the optimised version is committed.

---

## Favicon

`public/favicon.svg` is the canonical mark: a **G** monogram in the site's
accent gradient with a satellite orbiting it on a 3.6s SMIL loop, which
Chrome, Edge, and Firefox animate directly in the tab. The rounded dark plate
is baked in so the mark stays legible on light and dark tab strips.

Because Safari and most bookmark bars will not animate an SVG, the stills are
generated from the same file rather than redrawn:

```bash
npm run favicon        # favicon.ico, apple-touch-icon.png, icon-192/512.png
npm run favicon:check  # asserts alpha handling and .ico structure
```

`build_favicon.mjs` drives headless Chrome, seeks the SMIL clock to freeze the
satellite mid-orbit, and packs the rasters into a multi-size `.ico`. Two
details it handles that are easy to get wrong:

- Chrome paints an opaque white backdrop unless the default background is
  explicitly overridden, so the rounded corners would come out white. The
  script sets `Emulation.setDefaultBackgroundColorOverride` to keep them
  transparent.
- iOS ignores an alpha channel and renders transparency as black, so
  `apple-touch-icon.png` is drawn full-bleed on the plate colour instead.

Edit `public/favicon.svg` and re-run the command; never hand-edit the PNGs.

---

## Design system

Dark-only theme built on a single canvas colour.

| Token | Value | Role |
| --- | --- | --- |
| Canvas | `#0C0C0C` | Page background |
| Surface | `#101013` | Raised cards and panels |
| Frost | `#D7E2EA` | Primary text |
| Magenta | `#B600A8` | Fills, gradients, borders |
| Magenta bright | `#D14AC0` | Icons and small text (5.1:1 contrast) |

Muted text sits at `/62`–`/80` opacity, which keeps every element above the
WCAG AA 4.5:1 contrast ratio against the canvas. Hierarchy comes from size and
weight rather than from fading text out.

---

## Fonts

Kanit is self-hosted in `src/assets/fonts/` — six latin weights, ~19 KB each.
The site's only typeface is the one thing a visitor sees on every pixel, so it
is served from the same origin rather than trusting a third party's stylesheet.

Regenerate with:

```bash
node scripts/fetch_fonts.mjs
```

It pins a version and writes only the latin subset. Do not add a weight to
`src/assets/fonts.css` without adding the file too — a `@font-face` pointing at
a missing file is a silent failure that only shows up as a flash of fallback
type. Only the weights the page actually renders get fetched, so unused faces
cost nothing at load time.

---

## Project structure

```
src/
├─ App.tsx                 shell + hash router
├─ data/portfolio.ts       all editable content
├─ sections/               page sections
├─ pages/ProjectLandingPage.tsx
├─ components/             buttons, badges, 3D helpers
├─ hooks/useMediaQuery.ts  responsive breakpoint hook
├─ assets/                 self-hosted fonts + @font-face rules
└─ utils/navigation.ts     section ids + smooth scrolling

scripts/
├─ check-live.mjs          verify the deployed bundle is real
├─ check-favicon-live.mjs  verify the icons are served
├─ perf-check.mjs          FCP/LCP/CLS, third-party requests, CSP console
├─ shot-navbar.mjs         wordmark + overflow at four widths
├─ fetch_fonts.mjs         regenerate the self-hosted subset
├─ spellcheck.mjs          project vocabulary
└─ prose-check.mjs         wordy phrasing
```
