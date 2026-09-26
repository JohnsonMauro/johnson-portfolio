// Locale dictionary gate — the check `pnpm build` does not do (it strips types
// without checking them):
//   1. parity: en and pt have the same key paths and the same array lengths;
//   2. orphans: every second-level key (dict.<section>.<key>) is read somewhere
//      outside src/domain/i18n.
//
//   pnpm copy:check
//
// Imports the locale files directly; relies on Node's built-in TypeScript
// type stripping (the locales only use type-only imports).
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const CONSUMER_DIRS = ['src/app', 'src/pages', 'src/widgets', 'src/features', 'src/shared', 'src/domain/profile', 'src/domain/seo'];

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

const listSources = async (dir) => {
  const entries = await readdir(path.join(root, dir), { withFileTypes: true, recursive: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && /\.(astro|tsx?|mjs)$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));
};

const parityProblems = (en, pt) => {
  const enPaths = new Set(shape(en));
  const ptPaths = new Set(shape(pt));
  return [
    ...[...enPaths].filter((p) => !ptPaths.has(p)).map((p) => `only in en: ${p}`),
    ...[...ptPaths].filter((p) => !enPaths.has(p)).map((p) => `only in pt: ${p}`),
  ];
};

const orphanProblems = async (en) => {
  const files = (await Promise.all(CONSUMER_DIRS.map(listSources))).flat();
  const sources = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
  return Object.entries(en)
    .filter(([, section]) => isObject(section))
    .flatMap(([section, keys]) =>
      Object.keys(keys)
        .filter((key) => !new RegExp(`\\.${key}\\b`).test(sources))
        .map((key) => `unused key: ${section}.${key} (no ".${key}" read outside src/domain/i18n)`),
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
