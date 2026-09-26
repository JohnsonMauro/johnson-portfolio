# CLAUDE.md — johnson-portfolio

Project-level instructions for Claude Code. Read before editing.

## What this is

Personal portfolio + printable CV for Johnson Mauro. Astro + React islands +
Tailwind, ESLint flat config, pnpm. Bilingual (EN / PT-BR). Deploys to GitHub
Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
Versions live in `package.json` and the lockfile only; read the installed one
before trusting any note about an API.

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
| Type check (`astro check`) | `pnpm check` |
| Preview build | `pnpm preview` |
| Lint (zero warnings) | `pnpm lint` |
| Lint + autofix | `pnpm lint:fix` |
| Save rendered-text baseline (after a build) | `pnpm text:save` |
| Diff rendered text against the baseline | `pnpm text:diff` |
| CV content rules (words, bullets, buzzwords) | `pnpm cv:check` |
| Locale parity EN/PT + unused dictionary keys | `pnpm copy:check` |
| Regenerate favicons | `pnpm favicons` |

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
│   ├── sections/      ← page section registry (nav + scroll-spy)
│   └── seo/
└── shared/     # ui primitives, icons, lib helpers
```

Dependency direction: `pages → app / widgets → features → domain → shared`.
Never reach upward. Widgets do not import from other widgets, nor features
from other features — extract to `shared/ui` or `domain/*` first. `pnpm lint`
fails on an upward or sibling-slice import (relative or `@/`, at any nesting
depth); dynamic `import()` is not covered. Sections, their order and their
nav entries are listed in `src/domain/sections/sections.ts` — each widget's
`<section id>` must match it and `index.astro` renders them in that order.
Colors live in `src/styles/palette.css`. Ask before introducing a new
top-level folder.

## Skills — which to load for which change

Skills live in `.claude/skills/<name>/SKILL.md`. The project is self-contained:
every skill it needs is in this repo. Each skill's `description` says when it
applies. This table is the other direction: **before editing, find the row
for the change and load every skill in it with the Skill tool.** A change that
fits several rows loads the union. Don't write the code first and check the
skill after.

| Change | Load |
|---|---|
| **Add, remove or reshape a component** (section, island, UI primitive, icon) | `component-guide` + the rows below for what it contains; the full cycle runs through `/component-pipeline` |
| Any `.astro` file, island markup, route, `astro.config.mjs` | `astro-guide` |
| Any user-visible string, alt / aria-label, meta / SEO, contact data | `locale-copy-guide` |
| CV or career copy (summary, current, bullets, keywords, stats), tailoring to a JD | `cv-content-guide`, `locale-copy-guide` |
| New or reshaped section, layout, styling, tokens, icons, motion, print layout | `visual-design-guide`, `astro-guide` |
| React island (`.tsx`) component or hook, or deciding whether something needs one | `react-island-guide` + the rows above for what it renders |
| `eslint.config.js`, an eslint-disable comment, `pnpm-workspace.yaml`, `lint-staged.config.js`, `.husky/` | `tooling-guide` |
| New, removed or bumped dependency | `tooling-guide` |
| Node version, GitHub Actions workflow | `tooling-guide` |
| Restructure, move, rename, split across files, dead code | `refactor-guide`, `component-guide` + the rows for what is being moved |

## Component pipeline

`/component-pipeline [inventory | next | refactor <path> | add <name> <intent> | remove <path>]`
runs one unit at a time: audit (`component-auditor` agent) → plan with the
expected rendered-text drift → **stop for approval** → baseline → structure
commits → behavior commits → verification → review (`component-reviewer`
agent) → **stop**. Working files live in `.dev.debug/pipeline/` (gitignored);
never reference them from committed code.

## Verification

Before declaring any change done (the pre-commit hook already runs lint,
`astro check` and the copy checks on staged files — `tooling-guide`; the
steps below still apply, since build and `text:diff` are not in it):

1. `pnpm lint` — a11y (jsx-a11y strict), React and CSS rules; zero warnings.
2. `pnpm check` — types (`astro check`); the build alone strips them unchecked.
3. `pnpm build`.
4. `pnpm copy:check` — EN/PT array parity and no orphan dictionary keys.
5. `pnpm text:diff` against a baseline saved before the change — for markup,
   layout or refactor work the expected result is "unchanged".
6. `pnpm cv:check` when CV copy changed.

## Commits

Conventional Commits (`feat`, `fix`, `refactor`, `docs`, `chore`, `build`,
`ci`, `perf`), scoped when it helps (`feat(hero):`). Split structure from
behavior; dependency bumps go in their own `chore(deps)` (`tooling-guide`).

## Things to never do

- Duplicate copy into the CV route, or inline a string in a component.
- Add progress bars or skill % to web or print.
- Translate metrics word-for-word (numbers match across locales).
- Invent a metric for a CV bullet.
- Animate layout-bound CSS properties (use `transform`, `opacity`, `clip-path`).
- Hardcode palette, spacing, or type sizes — colors come from
  [`src/styles/palette.css`](src/styles/palette.css), the rest from the tokens
  in [`src/styles/global.css`](src/styles/global.css).
- Mutate locale objects in place — content is read-only at runtime.
- Create `src/fetch.ts` (reserved Astro entrypoint).
