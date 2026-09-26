---
name: cv-content-guide
description: Use when writing or editing CV / career copy — about.summary, about.current, resume[] bullets, meta.keywords, stats — tailoring the CV to a job description, or checking the printable /cv route. Applies Jeff Su's resume rules (LinkedIn surfaced, JD keywords, XYZ bullets, 475–600 words, no buzzwords), the bullet checklist and verb bank, section order, and the pnpm cv:check gate.
---

# CV content guide

Full rationale and sources: `docs/RESUME_GUIDELINES.md`. This is the operating checklist.

References:
- [5 Golden Rules](https://www.jeffsu.org/5-golden-rules-for-an-incredible-resume/)
- [Biggest mistake: missing metrics](https://www.jeffsu.org/heres-the-biggest-mistake-found-on-resumes/)
- [Job-search hub](https://www.jeffsu.org/job-search/)

## The 5 rules

1. **LinkedIn surfaced.** `profile.social.linkedin` renders in the print header. Canonical URL, no UTM.
2. **Keyword alignment.** Pull keywords from the target job description into `meta.keywords`, `about.summary`, `about.current` and `resume[].bullets`. Balance hard and soft skills.
3. **XYZ bullets.** *Accomplished [X] as measured by [Y], by doing [Z].* Every bullet answers at least one of: how many, how long, how often. With no metric, tie it to a downstream business outcome.
4. **475–600 words.** Union of `about.summary` + `about.current` + all `resume[].bullets`, per locale.
5. **No buzzwords.** Banned: *results-driven, team player, synergy, go-getter, think outside the box, passionate, rockstar*. Replace with a measurable achievement.

## Bullet checklist

- Starts with a strong action verb. Banned openers: *Responsible for, In charge of, Worked on, Helped with*.
- Has at least one number (count, %, currency, time, headcount), or rule 3's business outcome.
- At most 25 words.
- Tech stack at the end, in parentheses, not at the start.
- EN and PT-BR translate intent; numbers identical (`locale-copy-guide`).

**Never invent a metric.** A number with no source is worse than no number: ask the user for the real figure, or use the outcome.

## Action verb bank

- Build / Ship: Built, Shipped, Launched, Delivered, Implemented, Released
- Improve: Reduced, Increased, Accelerated, Optimized, Streamlined, Refactored
- Lead: Led, Mentored, Coordinated, Owned, Drove, Championed
- Discover: Investigated, Diagnosed, Identified, Prototyped, Proved out
- Automate: Automated, Eliminated, Replaced, Migrated, Consolidated

## Section order (web and print)

1. Header: name, role, location, LinkedIn, GitHub, email, phone, portfolio.
2. Summary: `about.summary` (2–3 sentences, keyword-dense).
3. Skills: categorized; no progress bars or percentages on print.
4. Experience: `resume[]`, reverse chronological, XYZ bullets.
5. Education / certifications: relevant only.
6. Optional: selected projects or publications when they add signal.

## Workflow

1. Get the target JD and extract the top 10–15 keywords.
2. Edit `en.ts` and `pt.ts` together.
3. Rewrite each touched bullet through the XYZ filter.
4. `pnpm cv:check`. It fails on a word count outside 475–600, a bullet over 25 words, a banned opener or a buzzword, in either locale. It warns (no failure) on a bullet with no number: read each warning and decide whether it carries an outcome instead.
5. `pnpm build && pnpm text:diff` (baseline saved before step 2): read the drift on `/en/cv` and `/pt/cv`.
6. `pnpm dev`, open `/en/`, `/en/cv`, `/pt/`, `/pt/cv`.
7. Print to PDF from `/cv`: A4, exactly 2 full pages in both locales (count on the production build, not the dev server), no orphan headings, contact line intact.
8. `pnpm lint`.

`cv:check` covers the mechanical rules only. XYZ shape, keyword fit and whether a number is true still need a human read.
