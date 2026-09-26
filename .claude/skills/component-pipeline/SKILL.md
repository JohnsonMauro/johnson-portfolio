---
name: component-pipeline
description: Runs the component pipeline on this site, one unit at a time — refactor an existing component, add a new one, or remove one — through audit, plan, approval, baseline, structure commits, behavior commits, verification against the expected rendered-text drift, review and close. Invoke as /component-pipeline [inventory | next | refactor <path> | add <name> <intent> | remove <path>].
disable-model-invocation: true
---

# Component pipeline

One skeleton for the three kinds of component work. What changes between them is the audit question and the drift the plan expects.

| Mode | Audit question | Expected `text:diff` drift |
|---|---|---|
| `refactor <path>` | Does it follow the skills, and does it live in the right place? | **None.** Any drift is a bug. |
| `add <name> <intent>` | Where does it go, what does it reuse, what must be registered, does it earn its place? | Exactly the new copy, on the pages the plan lists. |
| `remove <path>` | Who depends on it, and what would be left orphaned? | Exactly the removed copy, nothing else. |

`$ARGUMENTS`:
- `inventory`: build or refresh the unit list (step 1), then stop.
- `next` or empty: take the top `todo` unit from the inventory and run `refactor` on it.
- `refactor <path>` / `add <name> <intent>` / `remove <path>`: run steps 2–11.

Working files go outside the repo, in the sibling folder `../johnson-portfolio.local-context/pipeline/` (create it if missing; nothing to gitignore): `inventory.md` plus one `<unit-slug>.md` per unit (audit, plan, status). Never reference that folder from committed code.

## Ground rules

- **Load skills before editing**, from the CLAUDE.md table. `component-guide` is always on; `refactor-guide` for `refactor` and `remove`.
- **Stops are hard.** Steps 4 and 11 end the turn and wait for the user.
- **Commits** only for an approved plan: one move per commit, structure (`refactor(...)`) separate from behavior (`feat`/`fix`/`style`/`chore`). No `Co-Authored-By`. **Never push.**
- **One unit at a time.** Anything outside the unit goes under "Noticed, out of scope" in the unit file.
- **Copy is the user's.** New or changed text is drafted in EN and PT-BR in the plan and approved with it. Never invent a metric (`cv-content-guide`).

## 1. Inventory (`inventory`)

Units: each folder in `src/widgets/` and `src/features/`, each file in `src/shared/ui/` (icons as one unit), and `src/app/layouts/`.

One row per unit in `inventory.md`: `unit | lines | churn (3 months) | importers | lint | status`.
- lines: `wc -l` over its files
- churn: `git log --since='3 months ago' --oneline -- <unit> | wc -l`
- importers: files that import it, counted with `grep -rln` on its path outside itself
- lint: `pnpm exec eslint <unit> --max-warnings=0` clean or not
- status: `todo` | `audited` | `planned` | `in progress` | `done` | `skipped (<why>)`

Also run `pnpm copy:check` and list what it reports under "Dictionary". Sort `todo` by churn, then size; lint failures first. Show the list and **stop**. Keep existing statuses on a refresh.

## 2. Audit

Spawn `component-auditor` with the mode and the target. Save its report verbatim in `<unit-slug>.md`. Set the status to `audited`. List its "Skill drift" and "Skill gap" sections separately: they are fixes to the skills, not to the unit.

## 3. Plan

In `<unit-slug>.md`:

| # | finding / step | move | S/B | commit message |
|---|---|---|---|---|

Also:
- **Touch-points** (`add` / `remove`): every row of the `component-guide` tables that applies, and which commit covers it.
- **Copy** (`add`, or `remove` that changes text): EN and PT-BR strings, side by side.
- **Expected drift**: per page (`en/index.html`, `pt/index.html`, `en/cv/index.html`, `pt/cv/index.html`), the lines that should appear or disappear. `refactor`: "none".
- **Order**: preparatory S first, then B.
- **Out of plan**: what was deliberately left, and why.

Set the status to `planned`.

## 4. Approval — stop

Show the plan table, the copy and the expected drift. **End the turn.** Continue only on the user's ok; apply their cuts and reorders to the plan first.

## 5. Baseline

On a clean tree: `pnpm build && pnpm text:save`. This is the net for every later step. Status `in progress`.

## 6. Structure commits

One S row per commit. After each: `pnpm lint`, `pnpm check`, `pnpm build`, `pnpm text:diff` → **unchanged**. Drift on an S commit means it was not structure: fix or revert that step before the next one. Never stack changes on red.

## 7. Behavior commits

One B row per commit. After each: `pnpm lint`, `pnpm check`, `pnpm build`, `pnpm copy:check`, `pnpm text:diff`, and compare the drift with the plan's expected drift. Unexpected lines are a bug; missing lines are an unfinished step.

## 8. Final verification

- `pnpm lint`, `pnpm check`, `pnpm build`, `pnpm copy:check`, `pnpm text:diff` (matches the plan), `pnpm cv:check` if CV copy changed.
- `text:diff` does not see CSS, attributes (`src`, `hreflang`, `aria-pressed`) or island behavior after hydration. For an S change to styles or islands, compare screenshots of the built pages before and after (both themes, `xl` and mobile) and drive the island in a browser; say which of these ran.
- `pnpm dev`: `/en/`, `/pt/`, `/en/cv`, `/pt/cv`; both themes; `xl` and mobile (drawer); keyboard tab through anything interactive; sidebar nav and scroll-spy if the section is navigable.
- Print `/cv` to PDF if the CV changed.
- Say what was checked by hand and what was not.

## 9. Review

Spawn `component-reviewer` with the unit, the mode and the commit range (first commit of step 6 to HEAD). Fix every **blocking** item, then run it again. Put the final report in the unit file.

## 10. Inventory

Set the unit to `done` (for `add`, add its row; for `remove`, mark it `removed`). Re-run `pnpm copy:check`.

## 11. Close — stop

Summarize for the user: commits, S vs B, touch-points covered, drift observed vs expected, manual checks done and not done, out of plan, skill drift. **End the turn.** The next unit starts only when the user asks.

## Feedback (after any unit)

- A finding no skill covered → propose the skill edit here, and raise the generic part to `~/develop/global-context` in the same session.
- The same finding in 3+ units → propose a lint rule or a script check instead of repeating it by hand.
