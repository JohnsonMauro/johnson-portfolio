import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import { readdirSync } from 'node:fs';

export default tseslint.config(
  {
    ignores: ['dist/', '.astro/', 'node_modules/', 'public/', 'scripts/'],
  },

  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    files: ['**/*.{jsx,tsx}'],
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y-x': jsxA11y,
    },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.strict.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },

  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],

  {
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  {
    files: ['eslint.config.js', 'astro.config.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },

  ...layerBoundaries()
);

/*
 * FSD layer direction: pages → app / widgets → features → domain → shared.
 * Each layer may import only the layers below it; a widget or feature may not
 * import a sibling slice. Specifiers are matched as written (relative or the
 * @/ alias):
 * - upward: any `../` chain or `@/` that lands on a higher layer;
 * - sibling through the layer: `../../features/other`, `@/features/other`;
 * - sibling by climbing: from a file d folders below its slice root, exactly
 *   d + 1 `../` followed by another slice name.
 * Slices are read from disk, so a new one is covered without editing this.
 * Not covered: dynamic import(), which no-restricted-imports does not see.
 */
function layerBoundaries() {
  const MAX_DEPTH = 3;
  const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reach = (layers) => `^(?:(?:\\.\\./)+|@/)(?:${layers.join('|')})(?:/|$)`;
  const upward = (layers, where) => ({
    regex: reach(layers),
    message: `${where} may not import ${layers.join(', ')}: imports only point down the layers (see CLAUDE.md → Architecture).`,
  });
  const rule = (files, patterns) => ({
    files,
    rules: { 'no-restricted-imports': ['error', { patterns }] },
  });
  const slicesOf = (layer) =>
    readdirSync(new URL(`./src/${layer}/`, import.meta.url), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

  // One config object per slice and depth: flat config replaces a rule's
  // options when two objects match the same file, so each object carries
  // every pattern its files need, and the depth globs never overlap.
  const sliceRules = (layer, above, extractTo) =>
    slicesOf(layer).flatMap((slice) => {
      const self = escape(slice);
      const siblingMessage = `A ${layer.slice(0, -1)} may not import another ${layer.slice(0, -1)}: extract the shared part to ${extractTo}.`;
      const common = [
        upward(above, `${layer}/`),
        { regex: `^(?:(?:\\.\\./)+|@/)${layer}/(?!${self}(?:/|$))`, message: siblingMessage },
      ];
      const byDepth = Array.from({ length: MAX_DEPTH + 1 }, (_, depth) =>
        rule([`src/${layer}/${slice}/${'*/'.repeat(depth)}*`], [
          ...common,
          { regex: `^(?:\\.\\./){${depth + 1}}(?!(?:${self}|\\.\\.)(?:/|$))[^/]+`, message: siblingMessage },
        ])
      );
      return [...byDepth, rule([`src/${layer}/${slice}/${'*/'.repeat(MAX_DEPTH + 1)}**`], common)];
    });

  return [
    rule(['src/shared/**'], [upward(['app', 'pages', 'widgets', 'features', 'domain'], 'shared/')]),
    rule(['src/domain/**'], [upward(['app', 'pages', 'widgets', 'features'], 'domain/')]),
    ...sliceRules('features', ['app', 'pages', 'widgets'], 'shared/ or domain/'),
    ...sliceRules('widgets', ['app', 'pages'], 'shared/ui or domain/'),
    rule(['src/app/**'], [upward(['pages', 'widgets', 'features'], 'app/')]),
  ];
}
