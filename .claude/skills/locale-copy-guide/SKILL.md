---
name: locale-copy-guide
description: Use whenever a user-visible string is added, changed or removed — any text in a component, a new field in a section, alt text, aria-label, meta or SEO copy, contact or social data. Explains where copy lives (the en/pt locale dictionaries and profile.ts), the Dict type, how to keep EN and PT-BR in lockstep, and why copy is never inlined in .astro or .tsx files.
---

# Locale copy guide

Two surfaces share one content source: `/<lang>/` (interactive portfolio) and `/<lang>/cv` (printable CV). If a string appears in either, it lives in a dictionary. There is no second copy.

## Where things live

| What | File |
|---|---|
| All visible copy (sections, nav, CV labels, meta, SEO) | `src/domain/i18n/locales/en.ts`, `src/domain/i18n/locales/pt.ts` |
| Shape of that copy | `Dict` and its entry types in `src/domain/i18n/content.ts` |
| Contact, social links, identity | `src/domain/profile/profile.ts` |
| Expertise and skills metadata | `src/domain/profile/expertise.ts` |
| Structured data (JSON-LD) | `src/domain/seo/jsonld.ts` |

## Rules

- **Never inline copy in a component.** A hardcoded string in `.astro` or `.tsx` is a bug: lift it to the locale files. That includes `aria-label`, `alt` and `title` attributes. Exceptions, because they read the same in every locale: brand names (LinkedIn, GitHub, Medium, WhatsApp) and locale endonyms (`LOCALE_NAMES`, `LOCALE_LABELS` in `domain/i18n/config.ts`).
- **Edit `en.ts` and `pt.ts` in the same change.** A new key goes into `Dict` first, then into both locales.
- **Translate intent, not words.** PT-BR reads as native Portuguese, not a calque.
- **Numbers are identical across locales.** Years, counts, percentages and dates match exactly; only the formatting follows the locale (`1,300+` in EN, `1.300+` in PT).
- **Content is read-only at runtime.** Never mutate a locale object or an entry array; derive a new value instead.
- Contact and social data live only in `profile.ts`. Canonical URLs, no UTM or tracking parameters.

## Verify

- **`pnpm check`** — the build strips types without checking them; `astro check` fails on a key missing from a locale or a wrong prop.
- **`pnpm copy:check`** — what types cannot see: an array (resume entries, bullets) with a different length in each locale, and a `dict.<section>.<key>` nobody reads (read as `.key`, or as a quoted `'key'` through a registry).
- `pnpm text:diff` (see `astro-guide`): shows exactly which pages and lines the copy change reached, in both locales.
- CV copy also goes through `cv-content-guide` and `pnpm cv:check`.
