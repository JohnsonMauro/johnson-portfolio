---
name: refactor-guide
description: Use when restructuring code without meaning to change what the site shows — moving files between FSD layers, splitting a widget or island, renaming across files, extracting shared UI, deleting dead code, or backing out of a component that grew mode flags. Covers structure-vs-behavior commits, the rendered-text safety net, choosing the scale, where code lives in the FSD layout, and anti-patterns.
---

# Refactor guide — change the structure, keep the output

Sources (read 2026-09): [refactoring.com catalog](https://refactoring.com/catalog/) · [DefinitionOfRefactoring](https://martinfowler.com/bliki/DefinitionOfRefactoring.html) · [Preparatory refactoring](https://martinfowler.com/articles/preparatory-refactoring-example.html) · [ParallelChange](https://martinfowler.com/bliki/ParallelChange.html) · Kent Beck, *Tidy First?* · Michael Feathers, *Working Effectively with Legacy Code* · [The Wrong Abstraction](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction) · [Colocation](https://kentcdodds.com/blog/colocation) · [FSD layers](https://feature-sliced.design/docs/reference/layers).

This guide is the *how*. The target shape comes from `component-guide`, `astro-guide`, `react-island-guide`, `visual-design-guide` and the architecture section of `CLAUDE.md`. A planned refactor of a component runs through `/component-pipeline refactor <path>`, which applies this guide step by step.

## 1. What counts as a refactor

*"A change made to the internal structure of software … without changing its observable behavior"* (Fowler).

Observable here: rendered text in both locales, meta/SEO copy, `alt` and `aria-label`, URLs and anchors, the print CV layout, what an island does after hydration. Changing any of these is a behavior change, even when it feels like cleanup. It can be the right change; it goes in its own commit.

## 2. Structure and behavior in separate commits

- One hat at a time: refactor with the output unchanged, or change behavior. Never both in one step.
- Structure (S) → `refactor(<scope>): …`. Behavior (B) → `feat`/`fix`/`perf`/`style`. Name the catalog move when it fits: *Extract Function*, *Move Function*, *Inline Function*, *Remove Dead Code*.
- Already tangled? Split with `git add -p`, or throw it away and redo it in order. Redoing is often faster.

## 3. Safety net: the rendered text

This project has no unit tests. Its observable output is the built HTML, so that is the net:

```bash
pnpm build && pnpm text:save    # before the first step
# … one move …
pnpm build && pnpm text:diff    # expected: "Rendered text unchanged across N pages."
```

- A structure commit with any `text:diff` drift is not a structure commit. Find out why before moving on.
- `text:diff` does not see CSS, layout or island behavior. For those, compare `/en/`, `/en/cv`, `/pt/`, `/pt/cv` in `pnpm dev` (both themes, `xl` and mobile) and print the CV to PDF.
- Prove the net once per session if in doubt: remove an explicit `{' '}`, rebuild, watch `text:diff` fail, restore.

## 4. Pick the scale

| Situation | Approach |
|---|---|
| Small mess where you're working | **Tidying**: guard clause, explaining variable, delete dead code, reorder for reading. Own commit. |
| A feature is hard because of the current shape | **Preparatory**: make the change easy, then make the easy change. S first, B after. |
| Changing a prop or export used in many places | **Parallel change**: add the new form, migrate callers, delete the old. The delete is mandatory. |
| Goal too big to see the steps | **Mikado**: try it in a short timebox; if it breaks, revert, note the prerequisite, do that first. Commit each leaf. |

## 5. Where code lives

Direction: `pages → app / widgets → features → domain → shared`. Never import upward, and widgets never import other widgets.

- **Closest common ancestor.** One consumer → next to it. Used by several widgets → `shared/ui` (presentational) or `domain/*` (content, data, rules).
- **`shared/` is not a parking lot.** Something only one widget uses stays in that widget.
- `pnpm lint` fails on an upward import or a sibling-slice import, so a wrong move is caught before commit.
- **Measure consumers before moving**: grep the import path, not the name.
- **One move per commit**, updating every importer in the same commit.
- An import that points upward (shared → widget, domain → feature) means the code sits on the wrong floor.

## 6. Wrong abstraction: go back

A shared component accumulating `variant`/`mode` flags that branch behavior is the sign (Sandi Metz). Inline it back into each caller, delete what each caller does not use, then re-extract only what is truly common. Duplication is cheaper than the wrong abstraction.

## 7. Per-step checklist

1. `pnpm lint` on a clean tree (zero warnings).
2. `pnpm check` and `pnpm build`.
3. `pnpm text:diff` → unchanged.
4. `pnpm copy:check` when dictionary keys moved or were deleted.
5. Commit: one move per commit.

## 8. Anti-patterns

- Big-bang rewrite in one commit.
- A "refactor" that fixes a bug on the way: split into S, then B.
- Refactoring on red (lint or build already failing).
- Expand without contract.
- Silencing a lint rule to get a move through.
- Moving copy into a component while restructuring it (`locale-copy-guide`).
