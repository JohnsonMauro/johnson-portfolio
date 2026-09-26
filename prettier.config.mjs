/**
 * Prettier config. The goal is code that people and coding agents read the
 * same way every time: one canonical layout, so a diff shows only what
 * changed and the shape of the code carries no noise.
 *
 * - Prettier's defaults are kept wherever the codebase allows, so the layout
 *   is the stock Prettier one rather than a local variant.
 * - printWidth 100: room for typed signatures and Tailwind class lists
 *   without folding every call over several lines.
 * - singleQuote: the convention the codebase already had.
 * - Tabular constants (one row per case, many numeric columns) opt out with
 *   `// prettier-ignore`: a table reads better as a table.
 * - No Tailwind class sorting yet: prettier-plugin-tailwindcss does not see
 *   classes through prettier-plugin-astro 1.x (hold in tooling-guide).
 * - Markdown is not formatted (.prettierignore): Prettier pads table columns
 *   to align them, which grew CLAUDE.md by 28% in spaces that agents read on
 *   every session.
 *
 * @type {import('prettier').Config}
 */
export default {
  printWidth: 100,
  singleQuote: true,
  plugins: ['prettier-plugin-astro'],
  // Must match `compressHTML` in astro.config.mjs (unset there, so Astro's
  // default 'jsx'): the formatter then only moves whitespace the compiler
  // drops, and reformatting never changes the rendered text.
  astroCompressHTML: 'jsx',
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
