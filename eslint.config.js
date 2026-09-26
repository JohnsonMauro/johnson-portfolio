import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

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
 * Each layer may import only the layers below it; widgets and features may
 * not import a sibling slice. Imports are relative (or the @/ alias), so the
 * patterns match the specifier: `../../domain/x` reaches domain/, `../other/x`
 * from a slice root reaches a sibling slice.
 */
function layerBoundaries() {
  const reach = (layers) => `^(?:(?:\\.\\./)+|@/)(?:${layers.join('|')})(?:/|$)`;
  const sibling = '^\\.\\./[^./][^/]*(?:/|$)';
  const rule = (files, patterns) => ({
    files,
    rules: { 'no-restricted-imports': ['error', { patterns }] },
  });
  const upward = (layers, where) => ({
    regex: reach(layers),
    message: `${where} may not import ${layers.join(', ')}: imports only point down the layers (see CLAUDE.md → Architecture).`,
  });

  return [
    rule(['src/shared/**'], [upward(['app', 'pages', 'widgets', 'features', 'domain'], 'shared/')]),
    rule(['src/domain/**'], [upward(['app', 'pages', 'widgets', 'features'], 'domain/')]),
    rule(['src/features/*/*'], [
      upward(['app', 'pages', 'widgets'], 'features/'),
      { regex: sibling, message: 'A feature may not import another feature: extract the shared part to shared/ or domain/.' },
    ]),
    rule(['src/widgets/*/*'], [
      upward(['app', 'pages'], 'widgets/'),
      { regex: sibling, message: 'A widget may not import another widget: extract the shared part to shared/ui or domain/.' },
    ]),
    rule(['src/app/**'], [upward(['pages', 'widgets', 'features'], 'app/')]),
  ];
}
