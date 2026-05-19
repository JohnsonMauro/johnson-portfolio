import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const svgPath = path.join(root, 'public/assets/img/favicon.svg');
const outDir = path.join(root, 'public/assets/img');

const svg = await readFile(svgPath);

const sizes = [
  { file: 'favicon.png', size: 32 },
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon-192x192.png', size: 192 },
  { file: 'apple-touch-icon.png', size: 180 },
];

for (const { file, size } of sizes) {
  const out = path.join(outDir, file);
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(out);
  console.log(`✓ ${file} (${size}x${size})`);
}
