import { rgba, type Sprite } from './networkSprites';
import type { Rgb } from './palette';
import { shortestTour, type Point } from './tsp';

/** Copy for the easter egg, from the locale dictionary; `checked` holds a `{count}` slot. */
export interface EggCopy {
  checked: string;
  locale: string;
}

/** Where a tour may go: the visible part of the canvas, minus the area behind the hero copy. */
export interface EggArea {
  left: number;
  top: number;
  right: number;
  bottom: number;
  blocked: (point: Point) => boolean;
}

/** What the egg needs from a network node. `frozen` stops its drift while a tour runs through it. */
export interface TourNode {
  px: number;
  py: number;
  fade: number;
  layer: number;
  frozen: boolean;
}

/** 8 stops → 7! = 5,040 tours to measure. */
const STOPS = 8;
const MIN_STOPS = 5;
/** Stops are the people within this radius of the tour's centre. */
const SPREAD = 300;
/** Samples per edge when checking a tour against the blocked area. */
const EDGE_SAMPLES = 12;
/** Only people clearly on screen. */
const MIN_FADE = 0.6;
/** Near layers first; the blurred far layer only when they give no clear tour (small screens). */
const LAYER_FLOORS = [1, 0];
const SEARCH_MS = 1800;
const REVEAL_MS = 900;
const HOLD_MS = 3400;
const FADE_MS = 900;
const TOTAL_MS = SEARCH_MS + REVEAL_MS + HOLD_MS + FADE_MS;
/** Time for the signal to go once around the solved tour. */
const LAP_MS = 2400;
const STOP_RING = 13;
const CAPTION_SIZE = 12;
/** Room under the caption's baseline for descenders. */
const CAPTION_DESCENT = 4;
const CAPTION_GAP = 12;

/** Caption placement: which side of the tour, and how far it slides sideways to stay on screen. */
interface Caption {
  below: boolean;
  shift: number;
}

interface Run {
  stops: TourNode[];
  order: number[];
  checked: number;
  caption: Caption;
  start: number;
}

const distance = (a: TourNode, b: Point) => Math.hypot(a.px - b.x, a.py - b.y);

const inside = (area: EggArea, point: Point) =>
  point.x >= area.left && point.x <= area.right && point.y >= area.top && point.y <= area.bottom;

/** The tour's legs in visiting order, closing back to the first stop. */
const legs = (stops: TourNode[], order: number[]) => {
  const points = order.map((i) => stops[i]);
  const lengths = points.map((a, i) => {
    const b = points[(i + 1) % points.length];
    return Math.hypot(b.px - a.px, b.py - a.py);
  });
  return { points, lengths, total: lengths.reduce((sum, length) => sum + length, 0) };
};

const tourIsClear = (stops: TourNode[], order: number[], area: EggArea) =>
  order.every((from, i) => {
    const a = stops[from];
    const b = stops[order[(i + 1) % order.length]];
    for (let k = 0; k <= EDGE_SAMPLES; k++) {
      const t = k / EDGE_SAMPLES;
      if (area.blocked({ x: a.px + (b.px - a.px) * t, y: a.py + (b.py - a.py) * t })) return false;
    }
    return true;
  });

const centreX = (stops: TourNode[]) => {
  const xs = stops.map((stop) => stop.px);
  return (Math.min(...xs) + Math.max(...xs)) / 2;
};

/** Caption baseline, just above the tour's highest stop or below its lowest. */
const captionY = (stops: TourNode[], below: boolean) =>
  below
    ? Math.max(...stops.map((stop) => stop.py)) + STOP_RING + CAPTION_GAP + CAPTION_SIZE
    : Math.min(...stops.map((stop) => stop.py)) - STOP_RING - CAPTION_GAP - CAPTION_DESCENT;

/**
 * Puts the caption above the tour, or below it, centred on the tour but slid
 * sideways as far as needed to stay on screen. Null when neither side keeps
 * it on screen and clear of the hero copy.
 */
const placeCaption = (stops: TourNode[], area: EggArea, halfWidth: number): Caption | null => {
  if (area.right - area.left < halfWidth * 2) return null;
  const centre = centreX(stops);
  const x = Math.min(area.right - halfWidth, Math.max(area.left + halfWidth, centre));
  for (const below of [false, true]) {
    const y = captionY(stops, below);
    const box = [y - CAPTION_SIZE, y + CAPTION_DESCENT].flatMap((edge) =>
      [x - halfWidth, x, x + halfWidth].map((px) => ({ x: px, y: edge }))
    );
    if (box.every((point) => inside(area, point) && !area.blocked(point))) return { below, shift: x - centre };
  }
  return null;
};

const shuffled = (length: number) => {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 1; i--) {
    const j = 1 + Math.floor(Math.random() * i);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};

/**
 * The P vs NP easter egg: a handful of people freeze, the network tries every
 * closed route through them (candidates flicker while a counter climbs), then
 * draws the shortest one and sends a signal around it, captioned with how many
 * routes it took. Verifying the answer is one lap; finding it was 5,040. The
 * P vs NP framing itself lives only in the console hint.
 */
export function createTspEgg(copy: EggCopy, colors: { glint: Rgb }, fontFamily: string) {
  const numbers = new Intl.NumberFormat(copy.locale);
  const captionFont = `400 ${CAPTION_SIZE}px ${fontFamily}`;
  const checkedText = (count: number) => copy.checked.replace('{count}', numbers.format(count));
  let run: Run | null = null;

  /** Half the caption's width, measured with the loaded font (the widest count it can show). */
  const captionHalfWidth = () => {
    const measure = document.createElement('canvas').getContext('2d');
    if (!measure) return Infinity;
    measure.font = captionFont;
    return measure.measureText(checkedText(5040)).width / 2 + 4;
  };

  const cancel = () => {
    if (run) for (const stop of run.stops) stop.frozen = false;
    run = null;
  };

  const tourPath = (ctx: CanvasRenderingContext2D, stops: TourNode[], order: number[], share: number) => {
    const { points, lengths, total } = legs(stops, order);
    let budget = total * share;
    ctx.beginPath();
    ctx.moveTo(points[0].px, points[0].py);
    for (let i = 0; i < points.length && budget > 0; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      const t = Math.min(1, budget / lengths[i]);
      ctx.lineTo(a.px + (b.px - a.px) * t, a.py + (b.py - a.py) * t);
      budget -= lengths[i];
    }
  };

  const pointOnTour = (stops: TourNode[], order: number[], share: number): Point => {
    const { points, lengths, total } = legs(stops, order);
    let budget = total * share;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      if (budget <= lengths[i]) {
        const t = lengths[i] ? budget / lengths[i] : 0;
        return { x: a.px + (b.px - a.px) * t, y: a.py + (b.py - a.py) * t };
      }
      budget -= lengths[i];
    }
    return { x: points[0].px, y: points[0].py };
  };

  const drawCaption = (ctx: CanvasRenderingContext2D, stops: TourNode[], caption: Caption, count: number, alpha: number) => {
    const x = centreX(stops) + caption.shift;
    const y = captionY(stops, caption.below);
    ctx.globalAlpha = alpha * 0.85;
    ctx.fillStyle = rgba(colors.glint, 1);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = captionFont;
    ctx.fillText(checkedText(count), x, y);
  };

  /** The clear cluster with the most stops among `usable` (`at` first, then the densest centres). */
  const bestCluster = (usable: TourNode[], area: EggArea, at: Point | null, halfWidth: number) => {
    const neighbours = (node: TourNode) =>
      usable.filter((other) => distance(other, { x: node.px, y: node.py }) < SPREAD).length;
    const densest = [...usable]
      .sort((a, b) => neighbours(b) - neighbours(a))
      .map((node) => ({ x: node.px, y: node.py }));
    // One solve is ~5k tours, well under a millisecond, so every centre can be
    // tried; a full cluster ends the search early.
    let best: Omit<Run, 'start'> | null = null;
    for (const center of [...(at ? [at] : []), ...densest]) {
      const stops = usable
        .filter((node) => distance(node, center) < SPREAD)
        .sort((a, b) => distance(a, center) - distance(b, center))
        .slice(0, STOPS);
      if (stops.length < MIN_STOPS || (best && stops.length <= best.stops.length)) continue;
      const caption = placeCaption(stops, area, halfWidth);
      if (!caption) continue;
      const { order, checked } = shortestTour(stops.map((stop) => ({ x: stop.px, y: stop.py })));
      if (!tourIsClear(stops, order, area)) continue;
      best = { stops, order, checked, caption };
      if (stops.length === STOPS) break;
    }
    return best;
  };

  return {
    get active() {
      return run !== null;
    },

    /**
     * Freezes the visible people around `at` (the densest cluster when null,
     * or when `at` gives no clear tour) and solves their tour. `still`
     * (reduced motion) skips straight to the solved frame. Returns false
     * when a run is on or no cluster yields a tour and caption clear of the
     * hero copy.
     */
    start(nodes: readonly TourNode[], area: EggArea, at: Point | null, now: number, still: boolean): boolean {
      if (run) return false;
      const halfWidth = captionHalfWidth();
      let best: Omit<Run, 'start'> | null = null;
      for (const floor of LAYER_FLOORS) {
        const usable = nodes.filter(
          (node) => node.layer >= floor && node.fade > MIN_FADE && inside(area, { x: node.px, y: node.py })
        );
        best = usable.length >= MIN_STOPS ? bestCluster(usable, area, at, halfWidth) : null;
        if (best) break;
      }
      if (!best) return false;
      for (const stop of best.stops) stop.frozen = true;
      run = { ...best, start: still ? now - SEARCH_MS - REVEAL_MS : now };
      return true;
    },

    cancel,

    /** How long a reduced-motion run stays on screen before its closing redraw. */
    stillMs: HOLD_MS + FADE_MS,

    draw(ctx: CanvasRenderingContext2D, signal: Sprite | null, now: number) {
      if (!run) return;
      const elapsed = now - run.start;
      if (elapsed >= TOTAL_MS) {
        cancel();
        return;
      }
      const { stops, order, checked, caption } = run;
      const alpha = Math.min(1, (TOTAL_MS - elapsed) / FADE_MS);
      ctx.strokeStyle = rgba(colors.glint, 1);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (elapsed < SEARCH_MS) {
        const progress = elapsed / SEARCH_MS;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1;
        tourPath(ctx, stops, shuffled(stops.length), 1);
        ctx.closePath();
        ctx.stroke();
        drawCaption(ctx, stops, caption, Math.round(progress * progress * checked), 1);
      } else {
        const reveal = Math.min(1, (elapsed - SEARCH_MS) / REVEAL_MS);
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 2;
        tourPath(ctx, stops, order, reveal);
        if (reveal === 1) ctx.closePath();
        ctx.stroke();
        if (reveal === 1 && signal) {
          const lap = ((elapsed - SEARCH_MS - REVEAL_MS) % LAP_MS) / LAP_MS;
          const { x, y } = pointOnTour(stops, order, lap);
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(signal.image, x - signal.half, y - signal.half, signal.half * 2, signal.half * 2);
          ctx.globalCompositeOperation = 'source-over';
        }
        drawCaption(ctx, stops, caption, checked, alpha);
      }

      ctx.globalAlpha = alpha * 0.6;
      ctx.lineWidth = 1;
      for (const stop of stops) {
        ctx.beginPath();
        ctx.arc(stop.px, stop.py, STOP_RING, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
  };
}
