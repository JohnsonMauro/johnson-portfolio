---
name: astro-guide
description: Use before editing any .astro file, markup inside a React island, astro.config.mjs, an Astro integration or a route under src/pages. Covers the JSX whitespace trap (words merging after compressHTML), the strict compiler, reserved entrypoints, where custom transforms go, and how to prove a markup edit did not change the rendered text.
---

# Astro guide

Read the installed Astro version (`node -p "require('astro/package.json').version"`) before trusting a rule here against a new API. Rules are written as the current behavior, not tied to a version.

## Whitespace between inline elements

`compressHTML` defaults to `'jsx'`: a newline between two inline elements is **dropped**, not collapsed to a space.

```astro
<!-- renders "Agent context design.40+ Claude Code skills" -->
<strong>{practice.title}.</strong>
{practice.proof}

<!-- renders "Agent context design. 40+ Claude Code skills" -->
<strong>{practice.title}.</strong>{' '}
{practice.proof}
```

- Adjacent inline items (CTA pairs, locale links, footer spans, label + value) sit in a flex/gap container or carry an explicit `{' '}`.
- Visual spacing from `gap` does not put a space in the text. Screen readers, copy-paste and the print CV read the text, so prefer `{' '}` when the words form a sentence.

## Comments ship unless they are Astro comments

`compressHTML` collapses whitespace but keeps HTML comments: `<!-- … -->` in a template reaches every visitor. Write template comments as `{/* … */}`, which the compiler drops. The `<!--astro:end-->` markers in the output are island boundaries and must stay. Comments inside JS strings (a GLSL shader, for example) also ship, since the minifier never touches string contents.

## Strict compiler

- Close every non-void tag.
- No block elements inside `<p>` (`<div>`, `<ul>`, headings). The build fails instead of auto-correcting.

## Reserved and removed options

- `src/fetch.ts` is the Advanced Routing entrypoint. Do not create a file with that name.
- `@astrojs/react` compiles with Oxc and has no `babel` option. A custom transform goes in `vite.plugins` through `@rolldown/plugin-babel`.
- Markdown renders with Sätteri (Rust), the default processor. remark/rehype plugins need `@astrojs/markdown-remark` and `markdown: { processor: unified() }`; the old top-level plugin options are deprecated. The repo has no Markdown pages today.

## CSS minifier folds `animation-timeline` into an invalid shorthand

The build minifies CSS with lightningcss (through Vite); `pnpm dev` does not. `animation: x linear both; animation-timeline: --h` comes out as `animation: linear both x --h`, which browsers reject whole, so a scroll-driven animation works in dev and silently disappears in the build. Write longhands only (`animation-name`, `-timing-function`, `-fill-mode`, `-timeline`, `-range`), as `widgets/hero/Hero.astro` does, and grep the rule in `dist/_astro/*.css` after `pnpm build`.

## Routes and i18n

- Routes: `src/pages/[lang]/index.astro` (portfolio) and `src/pages/[lang]/cv.astro` (printable CV). `src/pages/index.astro` is the root entry.
- `astro.config.mjs` sets `base: '/johnson-portfolio'` and `prefixDefaultLocale: true`. Public assets resolve through `asset()` in `src/shared/lib/asset.ts`, which strips the trailing slash from `import.meta.env.BASE_URL`. Never hardcode the base path.
- Every visible string comes from a locale dictionary (`locale-copy-guide`).

## Prove the rendered text did not change

For any markup, component or layout edit that should not change the copy:

```bash
pnpm build && pnpm text:save    # before the edit
# … edit …
pnpm build && pnpm text:diff    # exits 1 and prints the drift
```

`text:diff` extracts the visible text, title/meta copy, `alt` and `aria-label` from every built page. Inline tags are dropped without a space, so merged words show as a diff line. A copy edit is expected to show drift; read it line by line.

The baseline lives in `node_modules/.cache/rendered-text/`, so it survives across edits but not a clean install.
