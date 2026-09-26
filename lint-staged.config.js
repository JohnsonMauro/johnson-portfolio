/**
 * Pre-commit gates (run by .husky/pre-commit). The hook passes --hide-all, so
 * unstaged edits and untracked files are stashed while these run and every
 * check sees exactly what is being committed (by default lint-staged hides
 * only the unstaged part of partially staged files).
 *
 * Prettier formats the staged files first (lint-staged re-stages what it
 * writes), then ESLint checks them; the project-wide checks are functions so
 * they run once, without the file list, when a matching file is staged. The
 * hook also passes --concurrent false: tasks run one after another, so no
 * check reads a file while Prettier is rewriting it.
 */
export default {
  // --no-warn-ignored: a staged file under an ESLint ignore (scripts/) would
  // otherwise raise a warning and trip --max-warnings=0.
  '*.{js,mjs,cjs,jsx,ts,tsx,astro,css}': [
    'prettier --write',
    'eslint --max-warnings=0 --no-warn-ignored',
  ],
  '*.{json,yml,yaml}': 'prettier --write',
  // `astro build` strips types unchecked, so `astro check` is the only type
  // gate; a component can orphan a dictionary key as easily as a locale edit.
  'src/**/*.{ts,tsx,astro}': () => ['astro check', 'node scripts/copy-check.mjs'],
  'src/domain/i18n/locales/*.ts': () => 'node scripts/cv-check.mjs',
};
