---
name: component-guide
description: Use before adding, removing or reshaping a component of this site — a page section (widget), an interactive island (feature), a shared UI primitive or an icon. Gives the anatomy of each kind, which layer it belongs to, every place a new section must be registered (page, sidebar nav, scroll-spy, Dict, both locales, CV) and the matching removal checklist so nothing is left orphaned, plus the accessibility checklist a component must pass.
---

# Component guide

The *what* of a component here. The order of work lives in `/component-pipeline`; the moves of a refactor in `refactor-guide`.

## Which kind, which layer

| Kind | Layer | Example | Rule |
|---|---|---|---|
| Page section | `src/widgets/<name>/<Name>.astro` | `About`, `Skills`, `Resume` | Static `.astro`. Composes shared UI and domain data. Never imports another widget. |
| Section part | same widget folder | `ResumeColumn.astro` | Private to its widget. Moves to `shared/ui` only when a second widget needs it. |
| Interactive unit | `src/features/<name>/` | `Sidebar`, `BackToTop` | React island (`react-island-guide`). Owns its own state. |
| UI primitive | `src/shared/ui/` | `FadeIn`, `Typed`, `icons/` | No copy, no domain data: everything arrives as props. |
| Content / data | `src/domain/` | locales, `profile.ts`, `expertise.ts` | No markup. |

Direction: `pages → app / widgets → features → domain → shared`. Nothing imports upward.

## Section anatomy

Copy the shape of an existing section (`About.astro` is the reference):

```astro
<section
  id="<anchor>"
  class="section-anchor bg-surface py-20 px-6 xl:pl-[calc(theme(spacing.sidebar)+theme(spacing.6))]"
>
  <div class="mx-auto max-w-page">
    <header class="mb-12">
      <h2 class="font-display text-4xl font-bold text-ink-deep">{dict.sections.<name>Title}</h2>
      <div class="mt-2 h-1 w-12 rounded-full bg-accent"></div>
    </header>
    …
  </div>
</section>
```

- `id` must match the section's entry in `src/domain/sections/sections.ts`; the sidebar nav and scroll-spy read it from there. `section-anchor` handles the scroll offset.
- The `xl:pl-[…sidebar…]` padding keeps content clear of the fixed sidebar. Hero and Footer carry their own variant.
- Alternate `bg-surface` / `bg-surface-alt` with the neighbouring sections so the rhythm holds.
- Props: `dict: Dict` (plus `lang: Locale` when it builds URLs). The widget never picks a locale itself.
- Content rules (depth, CTA at the end, no duplicated identity assets): `visual-design-guide`.

## Adding a section: every touch-point

| # | Where | What |
|---|---|---|
| 1 | `src/widgets/<name>/<Name>.astro` | The section (anatomy above) |
| 2 | `src/domain/i18n/content.ts` | New keys in `Dict` (`sections.<name>Title`, a `<name>` block, `nav.<name>` if it gets a nav item) |
| 3 | `src/domain/i18n/locales/en.ts` + `pt.ts` | The copy, both locales in the same commit (`locale-copy-guide`) |
| 4 | `src/pages/[lang]/index.astro` | Import and render inside `<main>`, in reading order |
| 5 | `src/domain/sections/sections.ts` | One entry in render order: `{ id }`, plus `nav: { label, icon }` if it belongs in the sidebar nav. Nav and scroll-spy derive from it; a new icon key also needs its component in `NAV_ICONS` (`Sidebar.tsx`) |
| 6 | `src/shared/ui/icons/index.tsx` (if a new icon) | Inline SVG component, same `IconProps` shape |
| 7 | `src/widgets/cv/CvDocument.astro` (if the content belongs on the CV) | The CV renders its own markup from the same dict keys; no second copy of text |
| 8 | `public/assets/…` (if media) | Referenced through `asset()` |

Not every section is navigable: today `#skills` renders with no `nav` entry. Decide it explicitly in the plan.

## Removing a component: nothing left behind

Work the add table backwards, then prove it:

1. **Fan-in first**: `grep -rn "<Name>" src` and the import path. Every importer changes in the same commit.
2. Page render and import, and the entry in `domain/sections/sections.ts` (plus its `NAV_ICONS` component if no other section uses that icon).
3. Dict keys: remove from `content.ts`, `en.ts` and `pt.ts` together. `pnpm copy:check` fails on a key left in one locale or a key nobody reads.
4. Icons, assets and helpers used only by the removed component: grep each; delete the ones with zero remaining consumers.
5. CV: if `CvDocument` read the same keys, decide whether the CV loses the block too.
6. Links to the anchor (`#<id>`) elsewhere, in both locales.

## Accessibility checklist (every component)

- One `h1` per page. Sections start at `h2`; no skipped levels. Known gap: the portfolio page renders two, the name in `Sidebar.tsx` and the title in `Hero.astro`; don't add a third.
- Landmarks: sections inside `<main>`; nav stays in the sidebar `<nav>`.
- Interactive elements are `<a>` (navigation) or `<button>` (action), with visible `focus-visible` styles matching the existing ring (`ring-accent`).
- Every icon-only control has an `aria-label` from the dictionary; decorative images `alt=""`, meaningful ones a real alt.
- Both themes: text meets contrast on `bg-surface`, `bg-surface-alt` and the dark variants.
- Motion: entrance animation goes through `FadeIn`, and new motion must not ignore `prefers-reduced-motion`.
- Print (`/cv`): nothing interactive, no progress bars, no dark backgrounds.

`pnpm lint` (jsx-a11y strict) catches part of this. Heading order, contrast and focus order need a look in `pnpm dev`.

## Verify

`pnpm lint` (also enforces the layer direction) · `pnpm check` · `pnpm build` · `pnpm copy:check` · `pnpm text:diff` against a baseline saved before the change: the drift must be exactly what the plan said, nothing else.
