/**
 * Pre-commit gates (run by .husky/pre-commit). lint-staged hides unstaged
 * edits while these run, so every check sees exactly what is being committed.
 *
 * ESLint gets the staged files; the project-wide checks are functions so they
 * run once, without the file list, when a matching file is staged.
 */
export default {
  // --no-warn-ignored: a staged file under an ESLint ignore (scripts/) would
  // otherwise raise a warning and trip --max-warnings=0.
  '*.{js,mjs,cjs,jsx,ts,tsx,astro,css}': 'eslint --max-warnings=0 --no-warn-ignored',
  // `astro build` strips types unchecked, so `astro check` is the only type
  // gate; a component can orphan a dictionary key as easily as a locale edit.
  'src/**/*.{ts,tsx,astro}': () => ['astro check', 'node scripts/copy-check.mjs'],
  'src/domain/i18n/locales/*.ts': () => 'node scripts/cv-check.mjs',
};
