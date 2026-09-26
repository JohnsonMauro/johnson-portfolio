---
name: tooling-guide
description: Use when touching eslint.config.js (including CSS lint), writing an eslint-disable comment, the pre-commit hook (.husky/, lint-staged.config.js), considering, adding, removing or bumping a dependency, changing pnpm-workspace.yaml, the Node version (.nvmrc, engines), or a GitHub Actions workflow. Covers the a11y plugin naming (jsx-a11y-x), CSS lint with Tailwind syntax, what the hook runs, the eslint-plugin-react and tailwind-csstree holds, pnpm supply-chain settings, and which files move together on a Node or CI change.
---

# Tooling guide

Versions live in `package.json` and the lockfile only. Read the installed one (`node -p "require('<pkg>/package.json').version"`) before trusting a note here, and never write a version number into a skill or `CLAUDE.md` (a deliberate hold's own lines are the only exception).

## Should a dependency exist?

An agent writes 30–50 lines of own code in minutes, but they still cost review and maintenance. So for every package: **does it solve a problem that is hard to get right, or does it only save typing?**

- Keep: edge-case-heavy problems (image processing, parsing, time zones), security, heavy accessibility widgets, the framework and its integrations.
- Replace with the platform or own code: `IntersectionObserver`, `Intl.*`, `<dialog>`, CSS `scroll-behavior`, a thin wrapper, one function out of a big kit.
- Anything imported by an island ships to every visitor: it has to earn its bytes. Check last publish and deprecation (`pnpm view <pkg> time deprecated --json`) and install scripts before adding.
- Say in the commit why this package and not the platform or own code.
- After `pnpm add` / `remove` / a bump, restart the dev server (`pnpm astro dev stop`, then `pnpm dev`; Astro runs it in the background). A server started before the install mixes re-optimized Vite deps with old ones: every React island throws `_jsxDEV is not a function` and the sidebar disappears, while the build is fine.

## Bumping

1. `pnpm outdated`; a release younger than the cooldown is skipped, never forced.
2. Read the release notes of **every** version between installed and target.
3. `grep -rl '<pkg>' .claude CLAUDE.md` for rules that teach it, and its importers.
4. Report and stop before a major or anything that changes behavior under existing code.
5. Bump, fix the affected skills in the same change (the rule, not a version), then `pnpm lint`, `pnpm build`, `pnpm text:diff` against a baseline saved before the bump.
6. Commit split: `chore(deps)` for `package.json` + lockfile, `docs(claude)` for skills.

## ESLint

- Flat config in `eslint.config.js`: `@eslint/js` recommended, `typescript-eslint` strict + stylistic (no type-aware rules), React + hooks, jsx-a11y strict, Astro recommended + jsx-a11y strict, and `@eslint/css` recommended for `**/*.css`.
- **The JS/TS rule sets are scoped with `files`** (`**/*.{js,mjs,cjs,jsx,ts,tsx,astro}`). Unscoped they also run on the CSS language and crash (`sourceCode.getAllComments is not a function`). Any new rule set without its own `files` goes inside that scoped block.
- **CSS lint knows Tailwind 4** through `languageOptions.customSyntax: tailwind4` (`tailwind-csstree`), so `@theme`, `@apply` and `@custom-variant` parse. Only `.css` files are covered: `<style>` blocks inside `.astro` are not CSS-linted.
- `css/use-baseline` allows `::selection` (cosmetic, degrades to the default highlight). `css/no-important` is disabled only around the reduced-motion block in `global.css`, which must beat inline animation delays.
- VS Code: `.vscode/settings.json` adds `css` to `eslint.validate` and sets `css.validate: false`, so the editor shows ESLint's Tailwind-aware CSS diagnostics instead of the built-in validator's false "Unknown at rule @theme".
- A class warning in the editor that `pnpm lint` does not report comes from the Tailwind CSS IntelliSense extension (`suggestCanonicalClasses`). Use no `theme()` in arbitrary values (`var(--spacing-sidebar)`, `--spacing(6)` instead). Its px → scale suggestions (`h-[120px]` → `h-30`) switch px to rem, so they only match at a 16px root: judge each one, do not apply them blindly.
- `pnpm lint` runs with `--max-warnings=0`. A warning fails CI like an error.
- **Layer direction is a lint rule** (`layerBoundaries()` at the end of `eslint.config.js`): an upward import, or a widget/feature importing a sibling slice, fails. Specifiers are matched as written — relative or `@/` — at any nesting depth inside a slice; slices are read from `src/features/` and `src/widgets/` at config load, so a new slice is covered. Dynamic `import()` is not seen by `no-restricted-imports`. After changing the rule, re-prove it with probe files (forbidden and allowed forms per layer).
- The config is wrapped in ESLint's own `defineConfig()` (`eslint/config`); `tseslint.config()` is deprecated upstream in its favor. `typescript-eslint` stays for its parser and rule sets.
- **The a11y plugin is `eslint-plugin-jsx-a11y-x`.** Disable comments use `jsx-a11y-x/<rule>` in `.tsx` and `astro/jsx-a11y/<rule>` in `.astro`.
- **Keep legacy `eslint-plugin-jsx-a11y` out of the tree.** `eslint-plugin-astro` prefers it when present, which silently swaps the rule set under the `.astro` files.
- `scripts/` is ignored by ESLint. Scripts there are plain Node ESM (`.mjs`).

## Prettier

Prettier owns layout, ESLint owns correctness. `prettier.config.mjs` explains each choice in its header; the short version:

- Stock Prettier except `printWidth: 100` and `singleQuote: true`. One canonical layout, so diffs show only what changed, for people and coding agents alike.
- `prettier-plugin-astro` with `astroCompressHTML: 'jsx'`, which must mirror `compressHTML` in `astro.config.mjs` (unset there, so Astro's default). That is what lets the formatter move whitespace without changing the rendered text: after a mass format, `pnpm text:diff` against a baseline saved before it must say "unchanged".
- `*.md` is in `.prettierignore` on purpose: Prettier pads Markdown table columns to align them, which grew `CLAUDE.md` by 28% in spaces agents read every session. Prose and skills stay as written.
- A table of constants (one row per case) opts out with `// prettier-ignore` on the line above it (`LAYERS` in `peopleNetwork.ts`); keep that for real tables, not to dodge a layout you dislike.
- No `eslint-config-prettier`: its CLI (`npx eslint-config-prettier <file>`) found no conflicting rule in this config, only the "special" `no-unexpected-multiline`, which is safe with semicolons. Re-run it when a new ESLint plugin or rule set is added.
- Long strings (Tailwind class lists, template literals) are never broken by Prettier; `printWidth` is a target, not a limit. Do not add `max-len` on top: it is deprecated in core and would fight the formatter over those strings.

## Deliberate hold: Tailwind class sorting

`prettier-plugin-tailwindcss` 0.8.1 sorts classes in `.tsx` but not in `.astro`: its Astro transform walks the pre-1.0 `prettier-plugin-astro` AST (`element` nodes under `children`), and 1.x parses templates into a JSX tree (`AstroRoot` → `template`). Sorting half the files would be worse than none, so the plugin is not installed.

- Retest signal: a `prettier-plugin-tailwindcss` release that mentions prettier-plugin-astro 1.x, or upstream [issue #451](https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/451) closing.
- Probe: `printf -- '---\n---\n<p class="uppercase p-4 flex">x</p>\n' | pnpm exec prettier --stdin-filepath src/probe.astro` must print the classes reordered (`flex p-4 uppercase`).
- When it does: add the plugin **last** in `plugins`, set `tailwindStylesheet: './src/styles/global.css'`, format in its own `style:` commit and check `text:diff`.
- Opened 2026-09-26 with prettier-plugin-astro 1.1.0.

## Pre-commit hook

`husky` installs the hooks through the `prepare` script (every `pnpm install`, which sets `core.hooksPath` to `.husky/_`). `.husky/pre-commit` runs `lint-staged --hide-all --concurrent false`, configured in `lint-staged.config.js`:

| Staged | Runs |
|---|---|
| `*.{js,mjs,cjs,jsx,ts,tsx,astro,css}` | `prettier --write`, then `eslint --max-warnings=0 --no-warn-ignored` on those files |
| `*.{json,yml,yaml}` | `prettier --write` |
| `src/**/*.{ts,tsx,astro}` | `astro check`, `copy-check.mjs` (project-wide, once) |
| `src/domain/i18n/locales/*.ts` | `cv-check.mjs` |

- `--no-warn-ignored` is required: a staged file under an ESLint ignore (`scripts/`) otherwise raises "File ignored" as a warning and fails `--max-warnings=0`.
- Project-wide checks are functions in the config so lint-staged does not append the file list.
- Prettier writes, lint-staged re-stages the result: the commit holds the formatted file (proven with a deliberately misformatted staged file). `--concurrent false` runs the tasks one after another, so `astro check` never reads a file Prettier is rewriting.
- `--hide-all` stashes unstaged edits **and untracked files** while the checks run, so `astro check` sees exactly what is being committed. Without it lint-staged hides only the unstaged part of partially staged files, and a commit missing a new, untracked module still passes. Proven: staging `Hero.astro` alone, without its untracked imports, fails `astro check`.
- The hook is a fast local gate, not a replacement for CI: `build` and `text:diff` stay manual (CLAUDE.md → Verification) and CI still runs format check, lint, check, copy check and build.
- Bypassing with `--no-verify` is for a message-only amend (lint-staged has nothing staged then), never to get failing code in.

## Deliberate hold: keyframes outside `@theme`

`tailwind-csstree` cannot parse an `@theme` block that mixes declarations with nested `@keyframes` ([issue #79](https://github.com/humanwhocodes/tailwind-csstree/issues/79)), so the keyframes for the `--animate-*` tokens live at the top level of `global.css`. The generated CSS was verified identical (same keyframes, same tokens) before and after the move.

- Retest signal: issue #79 closed and a `tailwind-csstree` release after it.
- When it is: move the keyframes back inside `@theme`, `pnpm lint`, compare the `@keyframes` in `dist/_astro/*.css` before and after.
- Opened 2026-09-26 with `tailwind-csstree` 0.4.0.

## Deliberate hold: eslint-plugin-react peer

`eslint-plugin-react` has not declared support for the current ESLint major. `pnpm-workspace.yaml` → `peerDependencyRules.allowedVersions` allows it explicitly, and lint is verified green with it.

- Retest signal: `pnpm view eslint-plugin-react peerDependencies` lists the ESLint major in use.
- When it does: remove the `peerDependencyRules` entry, `pnpm install`, `pnpm lint`.
- Re-checked 2026-09-26: latest `eslint-plugin-react` is 7.37.5 (published 2025-04), peer range still ends at `^9.7`. Hold stays.

## TypeScript config

`tsconfig.json` extends Astro's `strict` preset (which already sets include/exclude) and adds only checks that were at zero errors when enabled: `exactOptionalPropertyTypes`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `allowUnreachableCode: false`, `noUncheckedSideEffectImports`, and `erasableSyntaxOnly` (the scripts import `.ts` through Node's type stripping, which cannot run enums or namespaces).

- Left off on purpose: `noUnusedLocals`/`noUnusedParameters` (ESLint's `no-unused-vars` owns unused code), `noUncheckedIndexedAccess` (38 findings, 34 of them bounded loop indices in the hero animation), `noPropertyAccessFromIndexSignature` (style only).
- To weigh a new option, probe it without touching the file: a throwaway `tsconfig.probe.json` that extends `./tsconfig.json` with the option, `pnpm astro check --tsconfig tsconfig.probe.json`, count the errors, delete the probe.
- After editing include/exclude, compare `tsc --listFilesOnly` before and after; `--showConfig` stops expanding the file list once include is inherited.

## Deliberate hold: typescript 6 line

`@astrojs/check` declares `typescript` as a peer with `^5 || ^6`, so `typescript` stays on the 6 line although a newer major exists.

- Retest signal: `pnpm view @astrojs/check peerDependencies` includes the current typescript major.
- When it does: bump `typescript`, run `pnpm check`.
- Re-checked 2026-09-26: `@astrojs/check` 0.9.10, peer `^5.0.0 || ^6.0.0`; typescript latest 7.0.2.

## pnpm and supply chain

- `packageManager` in `package.json` pins pnpm. Bump it only when asked.
- `pnpm-workspace.yaml`:
  - `allowBuilds` lists the only packages allowed to run install scripts (`esbuild`, `sharp`). A new native dependency needs an entry, and a reason in the PR.
  - `minimumReleaseAgeExclude` names exact `pkg@version` exceptions to the release-age cooldown. Add one only for a release the user asked for, and remove it once the version ages past the cooldown.
- Never relax the release-age policy to get a package in. Relax the version range instead.

## Node: always the latest LTS

Policy: the project runs on the newest **LTS** line (recent and stable), never on a Current (odd or not-yet-LTS) release.

| Place | What |
|---|---|
| `.nvmrc` → `lts/*` | The single source. `nvm use` resolves it locally |
| `.github/workflows/ci.yml` and `deploy.yml` → `setup-node` `node-version-file: .nvmrc` | `setup-node` resolves `lts/*` against the official manifest on every run, so CI and the deploy move to a new LTS line the day Node promotes it |
| `package.json` → `engines.node` | Only the floor (lowest version known to work). Raise it when the code starts needing something newer, not on every LTS |

Verified 2026-09-26 in the sources, not assumed: `setup-node` v7 reads a plain `.nvmrc` value as-is and resolves `lts/*` to the highest manifest entry with an `lts` codename (`official_builds.ts`, `resolveLtsAliasFromManifest`); nvm 0.40 resolves the same file to the latest LTS.

Because the switch is automatic, a new LTS line reaches CI without a commit. When one is announced (Node's release schedule: new even major goes LTS in late October), run `pnpm install`, `pnpm lint`, `pnpm check`, `pnpm build` and `pnpm text:diff` locally on it first (`nvm install --lts`). Native dependencies (`sharp`, `esbuild`) need a prebuilt binary for the new ABI. If it breaks, pin `.nvmrc` to the previous major until it is fixed.

Scripts in `scripts/` that import `.ts` files (`cv-check.mjs`) depend on Node's built-in type stripping, so the Node floor must keep it enabled by default.
