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

**Optional — absolute canonical/social URLs**

Create a repository variable named `VITE_SITE_URL` under
**Settings → Secrets and variables → Actions → Variables**, e.g.
`https://user.github.io/repo`. The build substitutes it into the
`canonical` and `og:image` tags. Without it the build stays fully relative,
which still works — it just gives social platforms a relative image URL.

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
| `projects` | The three case studies and their landing-page content |
| `services` | The five service rows |
| `skills` | Skill bars and proficiency levels |
| `timeline` | Career and education entries |
| `contactChannels` | The contact card grid |
| `marqueeTiles` / `heroTech` | Scrolling toolkit and hero tech strip |

**Adding a project:** append an object to `projects`. Give it a unique `id`
(used in the URL) and pick the three `visuals` kinds — `terminal`, `logs`,
`chart`, `topology`, `devices`, or `console`. The card, the landing page, and
the prev/next navigator all pick it up automatically.

**Swapping the résumé or photo:** replace `public/Gurwinder-Singh-Resume.pdf`.
For the photo, drop the new image in the project root and run:

```bash
python scripts/make_profile_photo.py <source-image> public/profile-pic.jpeg
```

It centre-crops to the `4:5` frame the portrait card uses, resizes to 800px
wide, and writes an optimised progressive JPEG. Raw photo sources are
gitignored — only the optimised version is committed.

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

## Project structure

```
src/
├─ App.tsx                 shell + hash router
├─ data/portfolio.ts       all editable content
├─ sections/               page sections
├─ pages/ProjectLandingPage.tsx
├─ components/             buttons, badges, 3D helpers
├─ hooks/useMediaQuery.ts  responsive breakpoint hook
└─ utils/navigation.ts     section ids + smooth scrolling
```
