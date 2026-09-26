// Social preview images (og:image), one per locale, for the link cards
// LinkedIn, WhatsApp, Slack and others build from a shared URL. LinkedIn
// requires og:image: at least 1200x627, ratio 1.91:1, up to 5 MB.
//
//   pnpm og:images
//
// Copy comes from the locale dictionaries and profile.ts, colors from
// palette.css, the URL from astro.config.mjs, so the card never drifts from
// the site. The card is rendered by headless Chrome (CHROME_PATH, default
// `google-chrome`) because the brand fonts are web fonts that sharp cannot
// see; sharp only recompresses the result. The PNGs are committed, like the
// favicons: run this again after changing the name, the job title or the
// first stat.
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import astroConfig from '../astro.config.mjs';
import en from '../src/domain/i18n/locales/en.ts';
import pt from '../src/domain/i18n/locales/pt.ts';
import { profile } from '../src/domain/profile/profile.ts';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const outDir = path.join(root, 'public/assets/img');
const WIDTH = 1200;
const HEIGHT = 630;
const PORT = 9360;
const DICTS = { en, pt };

const palette = Object.fromEntries(
  [
    ...(await readFile(path.join(root, 'src/styles/palette.css'), 'utf8')).matchAll(
      /--palette-([\w-]+):\s*(#[0-9a-f]{6})/gi,
    ),
  ].map(([, name, hex]) => [name, hex]),
);
const siteLabel = `${new URL(astroConfig.site).host}${astroConfig.base}`;

const escape = (text) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Seeded PRNG, so the network is the same on every run. */
const random = (() => {
  let seed = 20260926;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

/** People and links on the right of the card, the hero's network in miniature. */
const network = (() => {
  const people = Array.from({ length: 26 }, () => ({
    x: 560 + random() * 660,
    y: -20 + random() * 670,
    size: 14 + random() * 20,
  }));
  const links = people.flatMap((a, i) =>
    people
      .slice(i + 1)
      .filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < 190)
      .map((b) => ({ a, b, alpha: 1 - Math.hypot(a.x - b.x, a.y - b.y) / 190 })),
  );
  // Head over rounded shoulders, as in widgets/hero/networkSprites.ts.
  const person = ({ x, y, size }) =>
    `<circle cx="${x}" cy="${y}" r="${0.19 * size}"/>` +
    `<path d="M${x - 0.36 * size} ${y + 0.62 * size}a${0.36 * size} ${0.3 * size} 0 0 1 ${0.72 * size} 0z"/>`;
  return [
    `<g stroke="${palette['accent-light']}" stroke-width="1.2">`,
    ...links.map(
      ({ a, b, alpha }) =>
        `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke-opacity="${(alpha * 0.5).toFixed(2)}"/>`,
    ),
    `</g><g fill="${palette['accent-light']}">`,
    ...people.map((p) => `<g fill-opacity="${(0.35 + p.size / 60).toFixed(2)}">${person(p)}</g>`),
    '</g>',
  ].join('');
})();

const cardHtml = (dict) => {
  const [stat] = dict.about.stats;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Poppins:wght@700&display=block">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; position: relative;
    background:
      radial-gradient(circle at 80% 30%, ${palette['accent']}33, transparent 55%),
      radial-gradient(circle at 20% 110%, ${palette['ink-deep']}cc, transparent 60%),
      ${palette['ink-dark']};
    font-family: 'Open Sans', sans-serif; color: #fff;
  }
  svg { position: absolute; inset: 0;
    -webkit-mask-image: linear-gradient(90deg, transparent 38%, #000 75%);
            mask-image: linear-gradient(90deg, transparent 38%, #000 75%); }
  main { position: absolute; left: 88px; top: 0; bottom: 0; width: 700px;
    display: flex; flex-direction: column; justify-content: center; }
  h1 { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 92px;
    line-height: 1; letter-spacing: -0.02em; }
  .rule { width: 72px; height: 6px; border-radius: 3px; background: ${palette['accent']}; margin: 28px 0; }
  .role { font-size: 38px; font-weight: 600; color: ${palette['accent-light']}; }
  .stat { margin-top: 18px; font-size: 26px; color: rgba(255,255,255,.72); }
  .stat b { font-family: 'Poppins', sans-serif; color: #fff; margin-right: 8px; }
  .site { position: absolute; left: 88px; bottom: 56px; font-size: 22px; color: rgba(255,255,255,.55); }
</style></head><body>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${network}</svg>
<main>
  <h1>${escape(profile.name)}</h1>
  <div class="rule"></div>
  <p class="role">${escape(dict.meta.jobTitle)}</p>
  <p class="stat"><b>${escape(stat.value)}</b>${escape(stat.label)}</p>
</main>
<p class="site">${escape(siteLabel)}</p>
</body></html>`;
};

/** Minimal Chrome DevTools Protocol session: one tab, screenshots of HTML strings. */
async function withChrome(run) {
  const chrome = spawn(
    process.env.CHROME_PATH ?? 'google-chrome',
    [
      '--headless=new',
      '--no-sandbox',
      '--hide-scrollbars',
      `--remote-debugging-port=${PORT}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  try {
    let target;
    for (let i = 0; i < 60 && !target; i++) {
      await new Promise((r) => setTimeout(r, 250));
      target = await fetch(`http://127.0.0.1:${PORT}/json`)
        .then((res) => res.json())
        .then((list) => list.find((t) => t.type === 'page'))
        .catch(() => undefined);
    }
    if (!target) throw new Error('Chrome did not start; set CHROME_PATH.');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });
    let id = 0;
    const pending = new Map();
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      pending.get(message.id)?.(message);
      pending.delete(message.id);
    };
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const callId = ++id;
        pending.set(callId, (m) =>
          m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result),
        );
        ws.send(JSON.stringify({ id: callId, method, params }));
      });
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await run(send);
    ws.close();
  } finally {
    chrome.kill();
  }
}

await withChrome(async (send) => {
  for (const [lang, dict] of Object.entries(DICTS)) {
    const frameId = (await send('Page.getFrameTree')).frameTree.frame.id;
    await send('Page.setDocumentContent', { frameId, html: cardHtml(dict) });
    // document.fonts.check() is true when a family was never declared, so it
    // cannot tell a missing stylesheet from a loaded font: wait for the
    // stylesheet, load each face for the card's own text, then list what
    // actually loaded.
    const loaded = await send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const sheet = document.querySelector('link[rel=stylesheet]');
        if (!sheet.sheet) await new Promise((ok, fail) => { sheet.onload = ok; sheet.onerror = fail; });
        const text = document.body.innerText;
        await Promise.all(['700 92px Poppins', '600 38px "Open Sans"', '400 26px "Open Sans"']
          .map((font) => document.fonts.load(font, text)));
        await document.fonts.ready;
        await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
        return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replaceAll('"', '') + ' ' + f.weight);
      })()`,
    });
    const faces = new Set(loaded.result.value);
    for (const face of ['Poppins 700', 'Open Sans 600', 'Open Sans 400']) {
      if (!faces.has(face)) throw new Error(`Web font ${face} did not load; check the network.`);
    }
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const file = path.join(outDir, `og-${lang}.png`);
    const info = await sharp(Buffer.from(data, 'base64')).png({ compressionLevel: 9 }).toFile(file);
    console.log(
      `✓ og-${lang}.png (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`,
    );
  }
});
