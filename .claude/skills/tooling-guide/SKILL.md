---
name: tooling-guide
description: Use when touching eslint.config.js, writing an eslint-disable comment, considering, adding, removing or bumping a dependency, changing pnpm-workspace.yaml, the Node engines range, or a GitHub Actions workflow. Covers the a11y plugin naming (jsx-a11y-x), the eslint-plugin-react peer hold, pnpm supply-chain settings, and which files move together on a Node or CI change.
---

# Tooling guide

Versions live in `package.json` and the lockfile only. Read the installed one (`node -p "require('<pkg>/package.json').version"`) before trusting a note here, and never write a version number into a skill or `CLAUDE.md` (a deliberate hold's own lines are the only exception).

## Should a dependency exist?

An agent writes 30–50 lines of own code in minutes, but they still cost review and maintenance. So for every package: **does it solve a problem that is hard to get right, or does it only save typing?**

- Keep: edge-case-heavy problems (image processing, parsing, time zones), security, heavy accessibility widgets, the framework and its integrations.
- Replace with the platform or own code: `IntersectionObserver`, `Intl.*`, `<dialog>`, CSS `scroll-behavior`, a thin wrapper, one function out of a big kit.
- Anything imported by an island ships to every visitor: it has to earn its bytes. Check last publish and deprecation (`pnpm view <pkg> time deprecated --json`) and install scripts before adding.
- Say in the commit why this package and not the platform or own code.

## Bumping

1. `pnpm outdated`; a release younger than the cooldown is skipped, never forced.
2. Read the release notes of **every** version between installed and target.
3. `grep -rl '<pkg>' .claude CLAUDE.md` for rules that teach it, and its importers.
4. Report and stop before a major or anything that changes behavior under existing code.
5. Bump, fix the affected skills in the same change (the rule, not a version), then `pnpm lint`, `pnpm build`, `pnpm text:diff` against a baseline saved before the bump.
6. Commit split: `chore(deps)` for `package.json` + lockfile, `docs(claude)` for skills.

## ESLint

- Flat config in `eslint.config.js`: `@eslint/js` recommended, `typescript-eslint` strict + stylistic (no type-aware rules), React + hooks, jsx-a11y strict, Astro recommended + jsx-a11y strict.
- `pnpm lint` runs with `--max-warnings=0`. A warning fails CI like an error.
- **Layer direction is a lint rule** (`layerBoundaries()` at the end of `eslint.config.js`): an upward import, or a widget/feature importing a sibling slice, fails. Specifiers are matched as written — relative or `@/` — at any nesting depth inside a slice; slices are read from `src/features/` and `src/widgets/` at config load, so a new slice is covered. Dynamic `import()` is not seen by `no-restricted-imports`. After changing the rule, re-prove it with probe files (forbidden and allowed forms per layer).
- The config is wrapped in ESLint's own `defineConfig()` (`eslint/config`); `tseslint.config()` is deprecated upstream in its favor. `typescript-eslint` stays for its parser and rule sets.
- **The a11y plugin is `eslint-plugin-jsx-a11y-x`.** Disable comments use `jsx-a11y-x/<rule>` in `.tsx` and `astro/jsx-a11y/<rule>` in `.astro`.
- **Keep legacy `eslint-plugin-jsx-a11y` out of the tree.** `eslint-plugin-astro` prefers it when present, which silently swaps the rule set under the `.astro` files.
- `scripts/` is ignored by ESLint. Scripts there are plain Node ESM (`.mjs`).

## Deliberate hold: eslint-plugin-react peer

`eslint-plugin-react` has not declared support for the current ESLint major. `pnpm-workspace.yaml` → `peerDependencyRules.allowedVersions` allows it explicitly, and lint is verified green with it.

- Retest signal: `pnpm view eslint-plugin-react peerDependencies` lists the ESLint major in use.
- When it does: remove the `peerDependencyRules` entry, `pnpm install`, `pnpm lint`.
- Re-checked 2026-09-26: latest `eslint-plugin-react` is 7.37.5 (published 2025-04), peer range still ends at `^9.7`. Hold stays.

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

## Node and CI move together

The Node range is declared in three places. Change them in one commit:

| Place | What |
|---|---|
| `package.json` → `engines.node` | Supported range |
| `.github/workflows/ci.yml` → `setup-node` `node-version` | Runs lint, `pnpm check`, `pnpm copy:check` and build on PRs to `main` |
| `.github/workflows/deploy.yml` → `setup-node` `node-version` | Builds and deploys to GitHub Pages on push to `main` |

Before moving CI to a new Node major: run `pnpm install`, `pnpm lint`, `pnpm build` and `pnpm text:diff` locally on that major (nvm is installed). Native dependencies (`sharp`, `esbuild`) need a prebuilt binary for the new ABI.

Scripts in `scripts/` that import `.ts` files (`cv-check.mjs`) depend on Node's built-in type stripping, so the Node floor must keep it enabled by default.
