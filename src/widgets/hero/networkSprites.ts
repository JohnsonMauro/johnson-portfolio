import type { Rgb } from './palette';

/** A pre-rendered image drawn centred on a point; `half` is its half-size in CSS px. */
export interface Sprite {
  image: HTMLCanvasElement;
  half: number;
}

export const rgba = ([r, g, b]: Rgb, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

const canvasFor = (half: number, dpr: number) => {
  const image = document.createElement('canvas');
  image.width = image.height = Math.ceil(half * 2 * dpr);
  const ctx = image.getContext('2d');
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  ctx.translate(half, half);
  return { image, ctx };
};

/** Person glyph `size` px tall: head over rounded shoulders, head centre at the origin. */
const personPath = (size: number) => {
  const path = new Path2D();
  path.arc(0, 0, 0.19 * size, 0, Math.PI * 2);
  path.moveTo(-0.36 * size, 0.62 * size);
  path.ellipse(0, 0.62 * size, 0.36 * size, 0.3 * size, 0, Math.PI, 0);
  path.closePath();
  return path;
};

interface PersonStyle {
  size: number;
  /** Out-of-focus blur in CSS px (depth of field for the far layers). */
  blur: number;
  /** Glow radius in CSS px. */
  glow: number;
  top: Rgb;
  bottom: Rgb;
}

/**
 * Draws one person glyph with its blur and glow baked in. Blur and shadow are
 * the expensive part of canvas drawing, so they are paid once here and every
 * frame only stamps the result.
 */
export function personSprite(
  { size, blur, glow, top, bottom }: PersonStyle,
  dpr: number,
): Sprite | null {
  const half = 0.92 * size + glow + blur * 2 + 2;
  const target = canvasFor(half, dpr);
  if (!target) return null;
  const { image, ctx } = target;
  const fill = ctx.createLinearGradient(0, -0.2 * size, 0, 0.92 * size);
  fill.addColorStop(0, rgba(top, 1));
  fill.addColorStop(1, rgba(bottom, 0.85));
  if (blur > 0) ctx.filter = `blur(${blur}px)`;
  if (glow > 0) {
    ctx.shadowColor = rgba(top, 0.9);
    ctx.shadowBlur = glow * dpr;
  }
  ctx.fillStyle = fill;
  ctx.fill(personPath(size));
  return { image, half };
}

/** Soft round light for the signals travelling along the links, and the cursor. */
export function glowSprite(radius: number, core: Rgb, halo: Rgb, dpr: number): Sprite | null {
  const target = canvasFor(radius, dpr);
  if (!target) return null;
  const { image, ctx } = target;
  const light = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  light.addColorStop(0, rgba(core, 1));
  light.addColorStop(0.25, rgba(core, 0.8));
  light.addColorStop(1, rgba(halo, 0));
  ctx.fillStyle = light;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
  return { image, half: radius };
}
