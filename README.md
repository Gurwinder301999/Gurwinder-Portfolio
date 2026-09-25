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

**One-time repo setup**

1. Create an empty GitHub repository (no README, no `.gitignore`).
2. Point this folder at it and push:

   ```bash
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

3. In the repo go to **Settings → Pages → Build and deployment** and set
   **Source** to **GitHub Actions**.

The live site will be at `https://<user>.github.io/<repo>/`.

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

**Swapping the résumé or photo:** replace `public/Gurwinder-Singh-Resume.pdf`
and `public/profile-pic.jpeg`. The loose copies in the project root are
gitignored working files.

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
