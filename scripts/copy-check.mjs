// Locale dictionary gate — the check `pnpm build` does not do (it strips types
// without checking them):
//   1. parity: en and pt have the same key paths and the same array lengths;
//   2. orphans: every second-level key (dict.<section>.<key>) is read somewhere
//      outside src/domain/i18n — as `.key` (property access) or as a registry
//      entry `label: 'key'` (indexed access, e.g. nav[section.nav.label]).
//
//   pnpm copy:check
//
// Imports the locale files directly; relies on Node's built-in TypeScript
// type stripping (the locales only use type-only imports).
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const SOURCE_DIR = 'src';
const DICTIONARY_DIR = path.join('src', 'domain', 'i18n');

const load = async (locale) => (await import(`../src/domain/i18n/locales/${locale}.ts`)).default;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// Key paths, with array lengths recorded so a missing resume entry or bullet shows up.
const shape = (value, prefix = '') => {
  if (Array.isArray(value)) {
    return [`${prefix}[length=${value.length}]`, ...value.flatMap((item, index) => shape(item, `${prefix}[${index}]`))];
  }
  if (isObject(value)) {
    return Object.entries(value).flatMap(([key, child]) => shape(child, prefix ? `${prefix}.${key}` : key));
  }
  return [prefix];
};

const listSources = async () => {
  const entries = await readdir(path.join(root, SOURCE_DIR), { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && /\.(astro|tsx?|mjs)$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter((file) => !path.relative(root, file).startsWith(DICTIONARY_DIR));
};

const isRead = (key, sources) => new RegExp(`\\.${key}\\b|\\blabel:\\s*['"\`]${key}['"\`]`).test(sources);

const parityProblems = (en, pt) => {
  const enPaths = new Set(shape(en));
  const ptPaths = new Set(shape(pt));
  return [
    ...[...enPaths].filter((p) => !ptPaths.has(p)).map((p) => `only in en: ${p}`),
    ...[...ptPaths].filter((p) => !enPaths.has(p)).map((p) => `only in pt: ${p}`),
  ];
};

const orphanProblems = async (en) => {
  const files = await listSources();
  const sources = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
  return Object.entries(en)
    .filter(([, section]) => isObject(section))
    .flatMap(([section, keys]) =>
      Object.keys(keys)
        .filter((key) => !isRead(key, sources))
        .map((key) => `unused key: ${section}.${key} (neither ".${key}" nor "label: '${key}'" outside src/domain/i18n)`),
    );
};

const [en, pt] = await Promise.all([load('en'), load('pt')]);
const problems = [...parityProblems(en, pt), ...(await orphanProblems(en))];

if (problems.length === 0) {
  console.log('Locales in parity; every dictionary key is read.');
} else {
  for (const problem of problems) console.log(`  ✗ ${problem}`);
  console.log(`\n${problems.length} problem(s).`);
  process.exit(1);
}
