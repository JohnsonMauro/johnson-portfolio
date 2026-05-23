# Resume / CV Content Guidelines

How to write the content that powers both the on-screen portfolio and the
printable / PDF CV. Source of truth lives in
[`src/domain/i18n/locales/`](../src/domain/i18n/locales/) — every word shown on
`/<lang>/` and `/<lang>/cv` comes from those dictionaries, so changes here
propagate to every output (web, print, PDF) automatically.

## Source

Principles adapted from Jeff Su's job-search content, which analyzes thousands
of resumes and distills what actually moves recruiters and ATS scoring:

- 5 Golden Rules — https://www.jeffsu.org/5-golden-rules-for-an-incredible-resume/
- Biggest Resume Mistake (missing metrics) — https://www.jeffsu.org/heres-the-biggest-mistake-found-on-resumes/
- Job-search hub — https://www.jeffsu.org/job-search/

When in doubt, default to what Jeff Su recommends below.

---

## The 5 Golden Rules

### 1. Link to a complete LinkedIn profile

Resume should always link to a polished LinkedIn (photo, banner, full history).
Comprehensive profiles correlate with higher interview rates — only ~48% of
candidates include one, so it is cheap differentiation.

**Where it lives in this repo:** `profile.social.linkedin` in
[`src/domain/profile/profile.ts`](../src/domain/profile/profile.ts).
The print layout must surface LinkedIn (and other channels) in the header.

### 2. Use keywords from the target job description

ATS systems rank by keyword overlap with the JD. Pull a job description through
a free word-cloud tool, identify the dominant terms, weave them into:

- `meta.keywords` (SEO + ATS for the public page)
- `about.summary`, `about.current`
- `resume[].bullets`

Balance hard skills with soft skills — soft skills are the most under-represented
category on real-world resumes.

### 3. Quantify every achievement — the XYZ formula

> Accomplished **[X]** as measured by **[Y]**, by doing **[Z]**

**Bad bullet (responsibility, no impact):**
> Fostered a strong community within the team to encourage best-practice sharing.

**Good bullet (XYZ applied):**
> Successfully secured **US$ 1,200** in training budget to host **weekly**
> Lunch & Learn sessions for **12 weeks**, raising internal NPS by **18 pts**.

If you cannot find a hard metric, attach the work to a downstream business
outcome (e.g. *"...feeding a 33% productivity increase for the sales team"*).

Ask yourself three questions for every bullet:

- **How many?** (people, dollars, requests, deploys, repos…)
- **How long?** (weeks, sprints, quarters)
- **How often?** (per day, per release, per incident)

Only ~26% of resumes include five or more metrics. Be the other 74%.

### 4. Target 475 – 600 words total

Bigger is not better. Resumes outside this range under-perform. 77% of real
resumes fail this rule. Use the word-count tool in Google Docs / Word to verify.

For this portfolio: the union of `about.summary` + `about.current` +
`resume[].bullets` should land in that window per locale.

### 5. Kill buzzwords and clichés

Phrases like *"results-driven team player"*, *"synergy"*, *"go-getter"*,
*"think outside the box"* are filler. Replace with concrete achievements
(rule 3). Search for "resume cliches" lists and delete on sight.

---

## The biggest mistake — missing metrics

Restating rule 3 because Jeff Su flags it as **the single most common defect**
across resumes: bullets describe responsibilities instead of outcomes.

If a bullet starts with *"Responsible for…"*, *"In charge of…"*, or
*"Worked on…"*, rewrite it. Lead with the action verb + the measurable result.

---

## Writing bullets — checklist

For every `resume[].bullets[]` entry, confirm:

- [ ] Starts with a strong action verb (Built, Shipped, Led, Reduced, Migrated,
      Automated, Negotiated, Mentored — *not* "Helped with").
- [ ] Contains at least one number (volume, %, currency, time, headcount).
- [ ] Names the technology / stack only when relevant; tech-stack dumps belong
      at the end of the bullet, not the start.
- [ ] Reads correctly in **both** locales (EN + PT-BR). Translate the *intent*,
      not word-for-word.
- [ ] Is under ~25 words. Long bullets get skimmed past.

### Action verb bank

| Domain | Verbs |
|--------|-------|
| Build / Ship | Built, Shipped, Launched, Delivered, Implemented, Released |
| Improve | Reduced, Increased, Accelerated, Optimized, Streamlined, Refactored |
| Lead | Led, Mentored, Coordinated, Owned, Drove, Championed |
| Discover | Investigated, Diagnosed, Identified, Prototyped, Proved out |
| Automate | Automated, Eliminated, Replaced, Migrated, Consolidated |

---

## Resume section order (recommended)

1. **Header** — name, role headline, location, contact (LinkedIn, GitHub,
   email, phone/WhatsApp), portfolio URL.
2. **Summary** — 2-3 sentences, keyword-rich, role-targeted (`about.summary`).
3. **Skills** — categorized, no progress bars on print (recruiters distrust them).
4. **Experience** — reverse chronological, XYZ bullets (`resume[]`).
5. **Education / Certifications** — concise, only relevant items.
6. **(Optional)** Selected projects / publications when they add signal.

---

## Mapping content → outputs

| Dict key | Web page | Print / PDF |
|----------|----------|-------------|
| `meta.title`, `meta.description`, `meta.keywords` | `<head>` SEO | PDF metadata |
| `hero.typedRoles` | Hero typing animation | Role headline (static) |
| `about.summary` | About section paragraph | CV summary |
| `about.current` | About section paragraph | CV summary (continued) |
| `about.expertise` | Tech-icon clusters | Skills grid (text + icons) |
| `softSkills` | Skills section | Optional skills row |
| `resume[]` | Experience timeline | Experience block |
| `profile.social.*` | Sidebar icons | Header contact line |

Single source of truth means: **never duplicate text into the print route**.
If it's worth showing on the CV, lift it into a locale file.

---

## Process for refreshing CV content

1. Pull the target role's job description; extract top 10–15 keywords.
2. Edit `src/domain/i18n/locales/en.ts` and `pt.ts` together — never let
   locales drift.
3. Rewrite each bullet through the XYZ filter; add at least one metric.
4. Word-count: paste rendered EN content into Google Docs, target 475-600.
5. Strip buzzwords / clichés.
6. Preview `/en/` and `/en/cv` (same for `pt`) in the browser.
7. Print to PDF from the `/cv` route — verify A4 layout, no orphaned headings.
