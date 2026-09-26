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

- Colors come from `src/styles/palette.css` (light brand palette and the CV's print grays, plain custom properties); `global.css` maps the Tailwind tokens onto it and holds the dark overrides. Spacing and type sizes are Tailwind tokens in `global.css`. Never hardcode any of them, including in the CV's scoped styles. Because the theme tokens are `var()` references, Tailwind's opacity modifiers (`text-ink/60`, `bg-accent/10`) render only through `color-mix()`; the static fallback is the opaque color. That is within Tailwind 4's own floor (it requires `color-mix()`: Chrome 111, Safari 16.4, Firefox 128).
- Animate only `transform`, `opacity` and `clip-path`. Never width, height, top/left, margin or padding.
- Hero backdrop (`src/widgets/hero/`): a WebGL "tide" of brand blues (`tideShader.ts`) under a canvas-2D network of people in three depth layers (`peopleNetwork.ts`), over a CSS gradient fallback. Both read their colours from `palette.css` (`palette.ts`; highlights are the brand blue mixed towards white, never a new hex), run through `frameLoop.ts` (on screen only, still frame under reduced motion) and keep the area behind the hero copy empty. Blur and glow are baked into sprites once (`networkSprites.ts`); never set `ctx.filter` or `shadowBlur` per frame.
- Hero easter egg (`tspEgg.ts`, `tsp.ts`, `eggTriggers.ts`): typing "pnp", a triple click or tap on the hero, or a mouse resting 8s on the network freezes up to 8 visible people, brute-forces their shortest closed tour (7! = 5,040 tours, counted for real) and captions it with that count only; the P vs NP framing lives in the console hint. The tour and caption stay inside the hero's padding box and never over the hero copy (`eggArea()` in `peopleNetwork.ts`); a run that finds no clear cluster retries for 3s while people drift. Reduced motion shows the solved tour as a still frame. Its copy is `hero.egg*` in both locales; the console hint is the one deliberate `console.info` in the codebase.
- Motion must respect `prefers-reduced-motion`. `global.css` collapses animation/transition time and smooth scrolling under `reduce`; JS scrolls call `scrollBehavior()` and JS-driven motion reads `useReducedMotion()` from `src/shared/lib/motion.ts` (the typed roles stop on the first one). Entrance animations go through `src/shared/ui/FadeIn.tsx` and the `--animate-*` tokens.

## Verify

`pnpm lint` (jsx-a11y strict), `pnpm build`, and `pnpm text:diff` when the change should not touch copy (`astro-guide`). Check both themes and the `xl` / mobile breakpoints in `pnpm dev`.
