export type Rgb = [number, number, number];

const hexToRgb = (value: string): Rgb | null => {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * Reads palette.css custom properties (hex values) into 0–255 RGB triples, so
 * the canvas backdrops follow the brand instead of repeating its colours.
 * Returns null when any token is missing or not a plain hex colour.
 */
export function readPalette<K extends string>(tokens: Record<K, string>): Record<K, Rgb> | null {
  const styles = getComputedStyle(document.documentElement);
  const entries = Object.entries(tokens) as [K, string][];
  const colors = entries.map(
    ([key, token]) => [key, hexToRgb(styles.getPropertyValue(token))] as const,
  );
  if (colors.some(([, rgb]) => !rgb)) return null;
  return Object.fromEntries(colors) as Record<K, Rgb>;
}

/** `rgb` moved `amount` (0–1) of the way to white: a highlight derived from a brand colour. */
export const lighten = ([r, g, b]: Rgb, amount: number): Rgb => [
  Math.round(r + (255 - r) * amount),
  Math.round(g + (255 - g) * amount),
  Math.round(b + (255 - b) * amount),
];
