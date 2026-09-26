export interface Point {
  x: number;
  y: number;
}

export interface Tour {
  /** Indices into the input points, in visiting order; the tour closes back to the first. */
  order: number[];
  /** How many complete tours were measured to find it. */
  checked: number;
}

const closedLength = (points: readonly Point[], order: readonly number[]) => {
  let total = 0;
  for (let i = 0; i < order.length; i++) {
    const a = points[order[i]];
    const b = points[order[(i + 1) % order.length]];
    total += Math.hypot(a.x - b.x, a.y - b.y);
  }
  return total;
};

/**
 * Shortest closed tour through `points` by brute force: the first point is
 * fixed and every ordering of the rest is measured, so n points cost (n - 1)!
 * tours — 5,040 for 8. That growth is the point of the easter egg: checking a
 * tour is one pass, finding the best one is not. Keep n small (≤ 9).
 */
export function shortestTour(points: readonly Point[]): Tour {
  const rest = points.map((_, i) => i).slice(1);
  let best = [0, ...rest];
  let bestLength = closedLength(points, best);
  let checked = 0;

  // Heap's algorithm: every permutation of `rest`, one swap apart.
  const counters = rest.map(() => 0);
  const visit = () => {
    checked += 1;
    const order = [0, ...rest];
    const length = closedLength(points, order);
    if (length < bestLength) {
      bestLength = length;
      best = order;
    }
  };
  visit();
  let i = 0;
  while (i < rest.length) {
    if (counters[i] < i) {
      const j = i % 2 === 0 ? 0 : counters[i];
      [rest[j], rest[i]] = [rest[i], rest[j]];
      visit();
      counters[i] += 1;
      i = 0;
    } else {
      counters[i] = 0;
      i += 1;
    }
  }
  return { order: best, checked };
}
