// Safety net for markup and copy edits: extracts the text a visitor sees from
// every built page and diffs it against a saved baseline.
//
//   pnpm build && pnpm text:save    # baseline, before the change
//   pnpm build && pnpm text:diff    # after the change; exits 1 on any drift
//
// Inline tags are dropped without inserting a space, so words glued together by
// `compressHTML` whitespace removal show up as merged words in the diff.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const distDir = path.join(root, 'dist');
const baselineDir = path.join(root, 'node_modules/.cache/rendered-text');
const CONTEXT_LINES = 2;

const BLOCK_TAGS = [
  'address', 'article', 'aside', 'blockquote', 'br', 'dd', 'details', 'div', 'dl', 'dt',
  'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
  'hr', 'li', 'main', 'nav', 'ol', 'p', 'section', 'summary', 'table', 'td', 'th', 'tr', 'ul',
];

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

const decode = (text) =>
  text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] !== '#') return ENTITIES[code.toLowerCase()] ?? match;
    const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return String.fromCodePoint(point);
  });

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];

// Meta copy (title, description, social cards) is text too, even if no one sees it on the page.
const metaLines = (html) => {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => [attr(tag, 'name') ?? attr(tag, 'property'), attr(tag, 'content')])
    .filter(([key, content]) => key && content && /description|title|keywords/i.test(key))
    .map(([key, content]) => `[meta ${key}] ${decode(content)}`);
  return [title && `[title] ${decode(title)}`, ...metas].filter(Boolean);
};

const bodyLines = (html) => {
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  const blockTag = new RegExp(`<\\/?(?:${BLOCK_TAGS.join('|')})\\b[^>]*>`, 'gi');
  return body
    .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<img\b[^>]*>/gi, (tag) => `\n[img alt] ${attr(tag, 'alt') ?? '(missing)'}\n`)
    .replace(/<[^>]*\saria-label="([^"]*)"[^>]*>/gi, (_, label) => `\n[aria-label] ${label}\n`)
    .replace(blockTag, '\n')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map((line) => decode(line).replace(/\s+/g, ' ').trim())
    .filter(Boolean);
};

const extract = (html) => [...metaLines(html), ...bodyLines(html)].join('\n') + '\n';

const listPages = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)))
    .sort();
};

const snapshotName = (page) => page.replaceAll(path.sep, '__').replace(/\.html$/, '.txt');

// Line diff via longest common subsequence; pages are a few hundred lines, so O(n·m) is fine.
const diffLines = (before, after) => {
  const lcs = Array.from({ length: before.length + 1 }, () => new Array(after.length + 1).fill(0));
  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      lcs[i][j] = before[i] === after[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < before.length || j < after.length) {
    if (i < before.length && j < after.length && before[i] === after[j]) {
      ops.push({ sign: ' ', line: before[i++] });
      j++;
    } else if (i < before.length && (j === after.length || lcs[i + 1][j] >= lcs[i][j + 1])) {
      ops.push({ sign: '-', line: before[i++] });
    } else {
      ops.push({ sign: '+', line: after[j++] });
    }
  }
  return ops;
};

const formatHunks = (ops) => {
  const changed = ops.map((op, index) => (op.sign === ' ' ? -1 : index)).filter((index) => index >= 0);
  const visible = new Set(
    changed.flatMap((index) =>
      Array.from({ length: CONTEXT_LINES * 2 + 1 }, (_, k) => index - CONTEXT_LINES + k),
    ),
  );
  return ops
    .map((op, index) => (visible.has(index) ? `${op.sign} ${op.line}` : visible.has(index - 1) ? '  …' : null))
    .filter((line) => line !== null)
    .join('\n');
};

const readPages = async () => {
  const pages = await listPages(distDir).catch(() => []);
  if (pages.length === 0) {
    console.error('No built pages in dist/. Run `pnpm build` first.');
    process.exit(2);
  }
  return Promise.all(
    pages.map(async (page) => ({ page, text: extract(await readFile(path.join(distDir, page), 'utf8')) })),
  );
};

const save = async () => {
  const pages = await readPages();
  await mkdir(baselineDir, { recursive: true });
  await Promise.all(pages.map(({ page, text }) => writeFile(path.join(baselineDir, snapshotName(page)), text)));
  console.log(`Baseline saved: ${pages.length} pages → ${path.relative(root, baselineDir)}`);
};

const diff = async () => {
  const pages = await readPages();
  const baseline = await readdir(baselineDir).catch(() => []);
  if (baseline.length === 0) {
    console.error('No baseline. Run `pnpm build && pnpm text:save` before the change.');
    process.exit(2);
  }
  const current = new Set(pages.map(({ page }) => snapshotName(page)));
  let drift = 0;

  for (const { page, text } of pages) {
    const before = await readFile(path.join(baselineDir, snapshotName(page)), 'utf8').catch(() => null);
    if (before === null) {
      console.log(`\n+++ ${page} (new page)`);
      drift++;
      continue;
    }
    if (before === text) continue;
    console.log(`\n~~~ ${page}\n${formatHunks(diffLines(before.split('\n'), text.split('\n')))}`);
    drift++;
  }
  for (const name of baseline.filter((file) => !current.has(file))) {
    console.log(`\n--- ${name} (page removed)`);
    drift++;
  }

  if (drift === 0) {
    console.log(`Rendered text unchanged across ${pages.length} pages.`);
    return;
  }
  console.log(`\n${drift} page(s) changed. Expected for a copy edit; a bug for a pure markup/refactor change.`);
  process.exit(1);
};

const commands = { save, diff };
const command = commands[process.argv[2]];
if (!command) {
  console.error('Usage: node scripts/rendered-text.mjs <save|diff>');
  process.exit(2);
}
await command();
