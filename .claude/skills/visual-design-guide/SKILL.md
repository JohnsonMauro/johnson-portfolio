---
name: visual-design-guide
description: Use when adding or reshaping a section, changing layout, styling, spacing, typography, colors, icons, motion or the print layout of the portfolio. Covers the sidebar layering rule (no duplicated identity assets), section depth, the About and Skills compositions, editorial typography, CTA placement, design tokens and compositor-only animation.
---

# Visual design guide

Direction: editorial portfolio, 4–5 deep sections. General web rules (anti-template, Core Web Vitals, motion) come from the global rules under `~/.claude/rules/ecc/web/`; this guide is what is particular to this site.

References that informed it:
- [myseera — developer portfolio templates](https://myseera.com/blog/best-developer-portfolio-templates-2026)
- [Awwwards — editorial layout](https://www.awwwards.com/inspiration/editorial-layout)
- [Tilda — web design trends](https://tilda.education/en/web-design-trends-2026)
- [Wavespace — website design examples](https://www.wavespace.agency/blog/best-website-design-examples)
- [format.com — portfolio about page](https://www.format.com/magazine/resources/photography/online-portfolio-about-page-step-by-step-guide)

## Layering: no duplicated identity assets

On `xl` viewports the sidebar (`src/features/sidebar`) is fixed and already carries the profile photo (120×120), name, social icons (LinkedIn, GitHub, Medium, WhatsApp, Mail), locale switcher, theme toggle and CV CTA.

- Main sections never repeat any of these. The main column spends its space on stats, prose, CTAs and skills.
- On mobile the sidebar collapses into a drawer that still owns photo and socials. Hero may show the photo once on mobile; About never does.

## Section depth over section count

4–5 deep sections, not 8 shallow ones. A section that answers fewer than 2 recruiter questions (who is this, what did they ship, what stack, how do I contact them) gets merged or deleted.

## About composition, in order

1. Section header: `h2` plus accent rule.
2. Stat anchors: 3–5 numbers (years, companies, sectors, remote-first). Number oversized, label small uppercase. No stat that fails a fact-check.
3. Prose: `about.summary`, then a kicker label (e.g. `→ Current focus`), then `about.current`.
4. CTA pair: primary "Download CV", secondary LinkedIn.

Skills do not belong inside About.

## Skills composition: three tiers

| Tier | Contents | Treatment |
|---|---|---|
| Primary | Stack you'd ship tomorrow (Angular, React, TypeScript, Node.js, .NET Core) | Larger tiles, full-color icons |
| Secondary | Real production exposure, not current focus | Medium tiles, slightly muted |
| Tools & methods | Azure DevOps, AWS, Scrum, Jira, Power BI, BI/AI tooling | Compact chips, smallest |

No single-icon category: if one icon is left, fold it into Tools & methods. No progress bars or skill percentages, on web or print.

## Typography in editorial blocks

- Stat number: `font-display`, oversized (clamp ~3rem → ~5rem).
- Stat label: `text-xs`/`text-sm`, uppercase, muted.
- Kicker: `text-sm`, accent color, sentence case.
- Body prose: `text-base`/`text-lg`, ink/80.

## CTA placement

Every section that explains who you are ends with a navigable next step (CV download, contact, resume jump). No dead ends.

## Tokens and motion

- Colors come from `src/styles/palette.css` (light brand palette and the CV's print grays, plain custom properties); `global.css` maps the Tailwind tokens onto it and holds the dark overrides. Spacing and type sizes are Tailwind tokens in `global.css`. Never hardcode any of them, including in the CV's scoped styles.
- Animate only `transform`, `opacity` and `clip-path`. Never width, height, top/left, margin or padding.
- Motion must respect `prefers-reduced-motion`. Entrance animations go through `src/shared/ui/FadeIn.tsx` and the `--animate-*` tokens in `global.css`. That path does not check `prefers-reduced-motion` yet, so new motion must not add to the gap.

## Verify

`pnpm lint` (jsx-a11y strict), `pnpm build`, and `pnpm text:diff` when the change should not touch copy (`astro-guide`). Check both themes and the `xl` / mobile breakpoints in `pnpm dev`.
