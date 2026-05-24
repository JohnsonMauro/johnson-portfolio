# CLAUDE.md — johnson-portfolio

Project-level instructions for Claude Code. Read before editing.

## What this is

Personal portfolio + printable CV for Johnson Mauro. Astro 6 + React 19 +
Tailwind 4. Bilingual (EN / PT-BR). Deploys to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Two surfaces share one content source:

- `/<lang>/` — interactive portfolio (hero, about, skills, resume, sidebar).
- `/<lang>/cv` — printable / PDF-friendly CV route.

If a string appears in either surface, it lives in a locale dictionary. There
is no second copy.

## Commands

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` |
| Production build | `pnpm build` |
| Preview build | `pnpm preview` |
| Lint (zero warnings) | `pnpm lint` |
| Lint + autofix | `pnpm lint:fix` |
| Regenerate favicons | `pnpm favicons` |

Always run `pnpm lint` and `pnpm build` before declaring CV / content edits
done. Build catches locale-shape regressions; lint catches a11y / React rules.

## Architecture (FSD-inspired)

```
src/
├── app/        # layouts, root wiring
├── pages/      # Astro routes ([lang]/index, [lang]/cv)
├── widgets/    # composed sections (hero, about, skills, resume, cv, footer)
├── features/   # interactive units (sidebar, back-to-top)
├── domain/     # source-of-truth content + i18n + seo
│   ├── i18n/locales/  ← en.ts, pt.ts  (ALL copy lives here)
│   ├── profile/       ← contact, social, expertise, skills meta
│   └── seo/
└── shared/     # ui primitives, icons, lib helpers
```

Dependency direction: `pages → widgets → features → domain → shared`.
Never reach upward. Widgets do not import from other widgets — extract to
`shared/ui` or `domain/*` first.

## Content source of truth

All visible text comes from:

- [`src/domain/i18n/locales/en.ts`](src/domain/i18n/locales/en.ts)
- [`src/domain/i18n/locales/pt.ts`](src/domain/i18n/locales/pt.ts)

All contact / social / identity from:

- [`src/domain/profile/profile.ts`](src/domain/profile/profile.ts)

Hard rule: **never inline copy in components**. If a string is hardcoded in a
`.astro` / `.tsx`, that is a bug — lift it to the locale file.

## Jeff Su mentorship — compact rules

Full version in [`docs/RESUME_GUIDELINES.md`](docs/RESUME_GUIDELINES.md).
Below is the operating checklist Claude must apply when touching CV content.

References:
- 5 Golden Rules — https://www.jeffsu.org/5-golden-rules-for-an-incredible-resume/
- Biggest mistake (missing metrics) — https://www.jeffsu.org/heres-the-biggest-mistake-found-on-resumes/
- Job-search hub — https://www.jeffsu.org/job-search/

### The 5 rules (apply to every CV edit)

1. **LinkedIn surfaced.** `profile.social.linkedin` must render in the print
   header. Keep the URL canonical (no UTM, no tracking).
2. **Keyword alignment.** Pull keywords from the target job description into
   `meta.keywords`, `about.summary`, `about.current`, `resume[].bullets`.
   Balance hard + soft skills.
3. **XYZ bullets.** `Accomplished [X] as measured by [Y], by doing [Z]`. Every
   bullet must answer at least one of: how many? how long? how often? If no
   metric exists, tie to a downstream business outcome.
4. **475–600 words total.** Union of `about.summary` + `about.current` +
   all `resume[].bullets` per locale stays in that window. Verify before
   shipping a content PR.
5. **No buzzwords.** Ban: *results-driven*, *team player*, *synergy*,
   *go-getter*, *think outside the box*, *passionate*, *rockstar*. Replace
   with a measurable achievement.

### Bullet checklist (must all be true)

- [ ] Starts with a strong action verb. Banned openers: *Responsible for*,
      *In charge of*, *Worked on*, *Helped with*.
- [ ] Has at least one number (count, %, currency, time, headcount).
- [ ] ≤ 25 words.
- [ ] Tech stack at the end of the bullet, not the start.
- [ ] EN and PT-BR translate intent, not word-for-word. Numbers identical
      across locales.

### Action verb bank

- Build / Ship — Built, Shipped, Launched, Delivered, Implemented, Released
- Improve — Reduced, Increased, Accelerated, Optimized, Streamlined, Refactored
- Lead — Led, Mentored, Coordinated, Owned, Drove, Championed
- Discover — Investigated, Diagnosed, Identified, Prototyped, Proved out
- Automate — Automated, Eliminated, Replaced, Migrated, Consolidated

### Section order (web + print)

1. Header — name, role, location, LinkedIn, GitHub, email, phone, portfolio.
2. Summary — `about.summary` (2–3 sentences, keyword-dense).
3. Skills — categorized; no progress bars on print.
4. Experience — `resume[]`, reverse chronological, XYZ bullets.
5. Education / Certifications — relevant only.
6. Optional — selected projects / publications when they add signal.

## Edit workflow for CV content

1. Gather target JD; extract top 10–15 keywords.
2. Edit `en.ts` and `pt.ts` **together** in the same change — never let
   locales drift.
3. Rewrite each bullet through the XYZ filter; add ≥ 1 metric.
4. Word-count EN union: target 475–600.
5. Strip buzzwords.
6. `pnpm dev` → check `/en/`, `/en/cv`, `/pt/`, `/pt/cv`.
7. Browser print-to-PDF from `/cv` → verify A4, no orphan headings, contact
   line intact.
8. `pnpm lint && pnpm build`.

## Things to never do

- Duplicate copy into the CV route. Lift it into a locale file.
- Add progress bars or skill % to the print layout (recruiters distrust them).
- Translate metrics word-for-word (numbers must match across locales).
- Animate layout-bound CSS properties (use `transform`, `opacity`, `clip-path`).
- Hardcode palette, spacing, or type sizes — use the tokens in
  [`src/styles/`](src/styles/).
- Mutate locale objects in place — content is read-only at runtime.

## Visual design rules (2026 portfolio direction)

References that informed these rules:
- [myseera — best developer portfolio templates 2026](https://myseera.com/blog/best-developer-portfolio-templates-2026)
- [Awwwards — editorial layout](https://www.awwwards.com/inspiration/editorial-layout)
- [Tilda — web design trends 2026](https://tilda.education/en/web-design-trends-2026)
- [Wavespace — best website design examples 2026](https://www.wavespace.agency/blog/best-website-design-examples)
- [format.com — portfolio about page guide](https://www.format.com/magazine/resources/photography/online-portfolio-about-page-step-by-step-guide)

### Layering rule (no duplicated assets)

The sidebar is fixed on `xl` viewports and already carries:

- profile photo (120×120)
- name
- social icons (LinkedIn, GitHub, Medium, WhatsApp, Mail)
- locale switcher + theme toggle
- CV CTA

Main sections (About, Resume, etc.) must **not** repeat any of these. If a
piece of identity content already lives in the sidebar, the main column
spends its real estate on something else (stats, prose, CTA, skills).

This rule also applies to mobile: when the sidebar collapses into a drawer,
the drawer still owns photo + socials. Hero may show the photo *once* on
mobile, but never About.

### Section depth over section count

Aim for 4–5 deep sections, not 8 shallow ones. If a section answers fewer
than 2 recruiter questions ("who is this", "what did they ship", "what stack",
"how do I contact them"), merge it or delete it.

### About section composition

Required blocks, in order:

1. **Section header** — `h2` + accent rule.
2. **Stat anchors** — 3–5 numbers (years, companies, sectors, remote-first
   flag). Editorial typography: number oversized, label small uppercase.
   No stat unless it survives a fact-check.
3. **Prose** — `about.summary` (career positioning) + `about.current`
   (present focus) with a small kicker label between them
   (e.g., `→ Current focus`).
4. **CTA pair** — primary "Download CV", secondary LinkedIn.

Skills do **not** belong inside About. They get their own section.

### Skills section composition

Three tiers, never six flat categories:

| Tier | Contents | Visual treatment |
|------|----------|------------------|
| **Primary** | Stack you'd ship tomorrow (Angular, React, TypeScript, Node.js, .NET Core). | Larger tiles, full color icons. |
| **Secondary** | Stack with real production exposure but not current focus. | Medium tiles, slightly muted. |
| **Tools & methods** | Azure DevOps, AWS, Scrum, Jira, Power BI, BI/AI tooling. | Compact chips, smallest. |

Banned: single-icon categories. If only one icon survives a category,
absorb it into Tools & methods.

### Typography hierarchy in editorial blocks

- Stat number — `font-display`, oversized (clamp ~3rem → ~5rem).
- Stat label — `text-xs` or `text-sm`, uppercase, muted.
- Kicker label (`→ Current focus`) — `text-sm`, accent color, sentence case.
- Body prose — `text-base` or `text-lg`, ink/80.

### CTA placement

Every editorial section that explains *who you are* must end with at least
one navigable next step (CV download, contact, resume jump). No dead-end
sections.

## When in doubt

- Content question → re-read [`docs/RESUME_GUIDELINES.md`](docs/RESUME_GUIDELINES.md).
- Architecture question → respect FSD direction; ask before introducing a new
  top-level folder.
- Visual / motion question → see global rules under
  `~/.claude/rules/ecc/web/` (design-quality, performance).
