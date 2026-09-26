import { frameLoop } from './frameLoop';
import { glowSprite, personSprite, rgba, type Sprite } from './networkSprites';
import { lighten, readPalette } from './palette';

/**
 * Depth layers, far to near. Farther people are smaller, dimmer, blurred and
 * drift and parallax less; links only join a layer to itself or a neighbour.
 */
const LAYERS = [
  { share: 0.45, size: 13, alpha: 0.45, blur: 1.4, glow: 0, speed: 4, parallax: 6, link: 150, line: 0.6 },
  { share: 0.35, size: 20, alpha: 0.75, blur: 0.3, glow: 8, speed: 7, parallax: 14, link: 190, line: 0.9 },
  { share: 0.2, size: 30, alpha: 1, blur: 0, glow: 16, speed: 10, parallax: 26, link: 230, line: 1.2 },
] as const;

/** One person per this many CSS px² of hero, within the bounds below. */
const AREA_PER_NODE = 12000;
const MIN_NODES = 26;
const MAX_NODES = 110;
/** Nodes wrap this far outside the canvas, so they never pop in on screen. */
const WRAP_MARGIN = 60;
const MAX_DPR = 2;
/** Signals travelling along links: spawn interval, cap, and travel time. */
const PULSE_EVERY_MS = 650;
const MAX_PULSES = 6;
const PULSE_SECONDS = 1.6;
/** Reach of the cursor's own links, and of its highlight on nearby people. */
const CURSOR_LINK = 170;
const CURSOR_GLOW = 220;
const POINTER_EASE = 0.06;

const PALETTE = { light: '--palette-accent-light', mid: '--palette-accent', deep: '--palette-accent-dark' };

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  layer: 0 | 1 | 2;
  phase: number;
  /** Drawn position (after parallax) and visibility, refreshed every frame. */
  px: number;
  py: number;
  fade: number;
}

interface Pulse {
  a: Node;
  b: Node;
  t: number;
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const pickLayer = (): 0 | 1 | 2 => {
  const roll = Math.random();
  if (roll < LAYERS[0].share) return 0;
  return roll < LAYERS[0].share + LAYERS[1].share ? 1 : 2;
};

const createNode = (width: number, height: number): Node => {
  const layer = pickLayer();
  const angle = Math.random() * Math.PI * 2;
  const speed = LAYERS[layer].speed * (0.6 + Math.random() * 0.8);
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    layer,
    phase: Math.random() * Math.PI * 2,
    px: 0,
    py: 0,
    fade: 1,
  };
};

/**
 * Starts the people network on `canvas`: people in three depth layers drift
 * and connect to whoever is near, signals travel along the links, and the
 * cursor joins the network as one more node. The area behind `anchor` (the
 * hero copy) stays empty so the name reads cleanly. Returns the teardown.
 *
 * The canvas gets `data-ready` after its first frame so CSS can fade it in.
 */
export function mountPeopleNetwork(canvas: HTMLCanvasElement, anchor: HTMLElement): () => void {
  const noop = () => undefined;
  const ctx = canvas.getContext('2d');
  const brand = readPalette(PALETTE);
  if (!ctx || !brand) return noop;
  // People and links read as light over the tide, so they sit a step above
  // the brand blues rather than on them.
  const colors = { ...brand, glint: lighten(brand.light, 0.55), line: lighten(brand.light, 0.25) };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes: Node[] = [];
  let people: (Sprite | null)[] = [];
  let signal: Sprite | null = null;
  const pool = { x: 0, y: 0, rx: 1, ry: 1 };
  const pulses: Pulse[] = [];
  const parallaxTarget = { x: 0, y: 0 };
  const parallax = { x: 0, y: 0 };
  const cursor = { x: 0, y: 0, active: false };
  let needsResize = true;
  let lastDraw = 0;
  let lastPulse = 0;

  const resize = () => {
    const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    if (nextDpr !== dpr || people.length === 0) {
      dpr = nextDpr;
      people = LAYERS.map((layer) =>
        personSprite({ ...layer, top: colors.glint, bottom: colors.light }, dpr)
      );
      signal = glowSprite(10, colors.glint, colors.light, dpr);
    }
    canvas.width = Math.max(1, Math.floor(nextWidth * dpr));
    canvas.height = Math.max(1, Math.floor(nextHeight * dpr));

    // Keep the people already on screen: rescale their positions, then add or
    // drop some so the density holds.
    const sx = width ? nextWidth / width : 1;
    const sy = height ? nextHeight / height : 1;
    width = nextWidth;
    height = nextHeight;
    const count = Math.round(Math.min(MAX_NODES, Math.max(MIN_NODES, (width * height) / AREA_PER_NODE)));
    nodes = nodes.slice(0, count).map((node) => ({ ...node, x: node.x * sx, y: node.y * sy }));
    while (nodes.length < count) nodes.push(createNode(width, height));
    nodes.sort((a, b) => a.layer - b.layer);
    pulses.length = 0;

    // Offsets, not client rects: the hero's scroll-linked transforms must not
    // move the pool. Assumes the canvas covers the anchor's offset parent.
    pool.x = anchor.offsetLeft + anchor.offsetWidth / 2;
    pool.y = anchor.offsetTop + anchor.offsetHeight / 2;
    pool.rx = Math.max(anchor.offsetWidth * 0.55, 120) + 30;
    pool.ry = Math.max(anchor.offsetHeight * 0.9, 60) + 40;
    needsResize = false;
  };

  const move = (dt: number, time: number) => {
    const ease = Math.min(1, dt * 60 * POINTER_EASE);
    parallax.x += (parallaxTarget.x - parallax.x) * ease;
    parallax.y += (parallaxTarget.y - parallax.y) * ease;
    for (const node of nodes) {
      const layer = LAYERS[node.layer];
      node.x += node.vx * dt;
      node.y += node.vy * dt;
      if (node.x < -WRAP_MARGIN) node.x += width + WRAP_MARGIN * 2;
      else if (node.x > width + WRAP_MARGIN) node.x -= width + WRAP_MARGIN * 2;
      if (node.y < -WRAP_MARGIN) node.y += height + WRAP_MARGIN * 2;
      else if (node.y > height + WRAP_MARGIN) node.y -= height + WRAP_MARGIN * 2;
      node.px = node.x - parallax.x * layer.parallax;
      node.py = node.y - parallax.y * layer.parallax;
      const dx = (node.px - pool.x) / pool.rx;
      const dy = (node.py - pool.y) / pool.ry;
      const twinkle = 0.85 + 0.15 * Math.sin(time * 0.8 + node.phase);
      node.fade = smoothstep(0.75, 1.35, Math.hypot(dx, dy)) * twinkle;
    }
  };

  const cursorBoost = (node: Node) =>
    cursor.active ? 1 + 0.8 * (1 - smoothstep(0, CURSOR_GLOW, Math.hypot(node.px - cursor.x, node.py - cursor.y))) : 1;

  const drawLinks = () => {
    const links: [Node, Node][] = [];
    ctx.strokeStyle = rgba(colors.line, 1);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (a.fade <= 0) continue;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        if (b.fade <= 0 || b.layer - a.layer > 1) continue;
        const layer = LAYERS[Math.min(a.layer, b.layer)];
        const distance = Math.hypot(a.px - b.px, a.py - b.py);
        if (distance >= layer.link) continue;
        const strength = (1 - distance / layer.link) ** 1.4;
        ctx.globalAlpha = Math.min(1, strength * layer.alpha * 0.7 * Math.min(a.fade, b.fade) * cursorBoost(a));
        ctx.lineWidth = layer.line;
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.stroke();
        if (a.layer > 0) links.push([a, b]);
      }
    }
    return links;
  };

  const drawCursor = () => {
    if (!cursor.active) return;
    ctx.strokeStyle = rgba(colors.line, 1);
    ctx.lineWidth = 0.8;
    for (const node of nodes) {
      if (node.layer === 0 || node.fade <= 0) continue;
      const distance = Math.hypot(node.px - cursor.x, node.py - cursor.y);
      if (distance >= CURSOR_LINK) continue;
      ctx.globalAlpha = (1 - distance / CURSOR_LINK) ** 1.3 * 0.5 * node.fade;
      ctx.beginPath();
      ctx.moveTo(cursor.x, cursor.y);
      ctx.lineTo(node.px, node.py);
      ctx.stroke();
    }
    if (signal) {
      ctx.globalAlpha = 0.7;
      ctx.drawImage(signal.image, cursor.x - signal.half, cursor.y - signal.half, signal.half * 2, signal.half * 2);
    }
  };

  const drawPulses = (links: [Node, Node][], dt: number, now: number) => {
    if (dt > 0 && links.length > 0 && pulses.length < MAX_PULSES && now - lastPulse > PULSE_EVERY_MS) {
      const [a, b] = links[Math.floor(Math.random() * links.length)];
      pulses.push(Math.random() < 0.5 ? { a, b, t: 0 } : { a: b, b: a, t: 0 });
      lastPulse = now;
    }
    if (!signal) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pulse = pulses[i];
      pulse.t += dt / PULSE_SECONDS;
      const { a, b } = pulse;
      const reach = LAYERS[Math.min(a.layer, b.layer)].link * 1.05;
      if (pulse.t >= 1 || Math.hypot(a.px - b.px, a.py - b.py) > reach) {
        pulses.splice(i, 1);
        continue;
      }
      const t = pulse.t * pulse.t * (3 - 2 * pulse.t);
      const x = a.px + (b.px - a.px) * t;
      const y = a.py + (b.py - a.py) * t;
      ctx.globalAlpha = Math.sin(Math.PI * pulse.t) * Math.min(a.fade, b.fade);
      ctx.drawImage(signal.image, x - signal.half, y - signal.half, signal.half * 2, signal.half * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  const drawPeople = () => {
    for (const node of nodes) {
      const sprite = people[node.layer];
      if (!sprite || node.fade <= 0) continue;
      ctx.globalAlpha = Math.min(1, LAYERS[node.layer].alpha * node.fade * cursorBoost(node));
      ctx.drawImage(sprite.image, node.px - sprite.half, node.py - sprite.half, sprite.half * 2, sprite.half * 2);
    }
  };

  const draw = (now: number, still: boolean) => {
    if (needsResize) resize();
    // Still frames (reduced motion): nothing moves and no signals start.
    const dt = still || lastDraw === 0 ? 0 : Math.min(0.05, (now - lastDraw) / 1000);
    lastDraw = now;
    move(dt, still ? 0 : now / 1000);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const links = drawLinks();
    drawCursor();
    drawPulses(links, dt, now);
    drawPeople();
    ctx.globalAlpha = 1;
    canvas.dataset.ready = '';
  };

  const loop = frameLoop(canvas, draw);

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || loop.reduced) return;
    parallaxTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
    parallaxTarget.y = (event.clientY / window.innerHeight) * 2 - 1;
    const box = canvas.getBoundingClientRect();
    cursor.x = event.clientX - box.left;
    cursor.y = event.clientY - box.top;
    cursor.active = cursor.x >= 0 && cursor.y >= 0 && cursor.x <= box.width && cursor.y <= box.height;
  };

  const onPointerLeave = () => {
    cursor.active = false;
  };

  const resizeObserver = new ResizeObserver(() => {
    needsResize = true;
    loop.redraw();
  });
  resizeObserver.observe(canvas);
  resizeObserver.observe(anchor);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);

  return () => {
    loop.stop();
    resizeObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
  };
}
