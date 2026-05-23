# johnson-portfolio

Personal portfolio + printable CV. Astro 6 · React 19 · Tailwind 4. Bilingual
(EN / PT-BR). Static build deployed to GitHub Pages.

Live: <https://johnsonmauro.github.io/johnson-portfolio/>

## Surfaces

| Route | Purpose |
|-------|---------|
| `/en/`, `/pt/` | Interactive portfolio (hero, about, skills, resume, sidebar) |
| `/en/cv`, `/pt/cv` | Printable / PDF-friendly CV (A4) |

Both surfaces read from the same dictionaries — content is never duplicated.

## Stack

- **Astro 6** — static output, file-based routing, native i18n (`/en/`, `/pt/`).
- **React 19** — interactive islands only (sidebar, back-to-top).
- **Tailwind 4** — via `@tailwindcss/vite`; design tokens in `src/styles/`.
- **TypeScript** strict.
- **ESLint** flat config + `eslint-plugin-astro`, `react`, `jsx-a11y`.
- **pnpm** as the package manager.

## Quick start

```bash
pnpm install
pnpm dev          # local dev at http://localhost:4321/johnson-portfolio/
pnpm build        # static build to dist/
pnpm preview      # serve dist/
pnpm lint         # zero-warning lint
pnpm lint:fix     # autofix
pnpm favicons     # regenerate favicons from source
```

## Project layout

FSD-inspired layered architecture:

```
src/
├── app/            # layouts, root wiring
├── pages/          # Astro routes ([lang]/index.astro, [lang]/cv.astro)
├── widgets/        # hero, about, skills, resume, cv, footer
├── features/       # sidebar, back-to-top
├── domain/
│   ├── i18n/locales/   # en.ts, pt.ts — all visible copy
│   ├── profile/        # contact, social, expertise, skills meta
│   └── seo/
└── shared/         # ui primitives, icons, lib helpers
```

Dependency direction: `pages → widgets → features → domain → shared`. No
upward imports. No widget-to-widget imports.

## Content source of truth

All visible text → `src/domain/i18n/locales/{en,pt}.ts`.
All contact / identity → `src/domain/profile/profile.ts`.

If a string is hardcoded inside a component, that is a bug — lift it to the
dictionary.

## Editing the CV

CV content follows Jeff Su's resume rules. Full mentorship in
[`docs/RESUME_GUIDELINES.md`](docs/RESUME_GUIDELINES.md). Compact operating
checklist for AI / contributors in [`CLAUDE.md`](CLAUDE.md).

Workflow:

1. Pull target job description → extract 10–15 keywords.
2. Edit `en.ts` and `pt.ts` **together** (locales must not drift).
3. Rewrite each bullet through the XYZ formula
   (`Accomplished [X] as measured by [Y], by doing [Z]`); ≥ 1 metric per bullet.
4. Verify EN word count: 475 – 600 across `about.summary` + `about.current`
   + all `resume[].bullets`.
5. Strip buzzwords (*results-driven*, *team player*, *synergy*, *rockstar*, …).
6. `pnpm dev` → verify `/en/`, `/en/cv`, `/pt/`, `/pt/cv`.
7. Browser print-to-PDF from `/cv` → verify A4, no orphan headings.
8. `pnpm lint && pnpm build`.

## Deployment

GitHub Actions: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
Pushes to `main` build with Node 24 + pnpm, then publish `dist/` to GitHub
Pages. `astro.config.mjs` sets `base: '/johnson-portfolio'` — keep relative
asset URLs.

## Conventions

- **Commits** — Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`,
  `chore:`, `ci:`, `perf:`).
- **Animation** — compositor-friendly only (`transform`, `opacity`,
  `clip-path`). Never animate layout properties.
- **Styling** — use tokens in `src/styles/`; no hardcoded palette or spacing.
- **A11y** — semantic HTML first; lint enforces `jsx-a11y` rules.

## Docs

- [`CLAUDE.md`](CLAUDE.md) — AI-agent operating rules (project map + Jeff Su
  compact checklist).
- [`docs/RESUME_GUIDELINES.md`](docs/RESUME_GUIDELINES.md) — full CV writing
  guide.

## License

Personal portfolio — content (CV text, photos) is © Johnson Mauro. Code is
available under MIT terms unless a `LICENSE` file says otherwise.
