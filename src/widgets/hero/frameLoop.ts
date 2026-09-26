import { onReducedMotionChange, prefersReducedMotion } from '../../shared/lib/motion';

export interface FrameLoop {
  /** True while the user prefers reduced motion: only still frames are drawn. */
  readonly reduced: boolean;
  /** Draws one frame now if the loop is idle (reduced motion) and on screen. */
  redraw(): void;
  stop(): void;
}

/**
 * Animation loop for a hero backdrop layer. It runs only while `target` is on
 * screen and the tab is visible; under reduced motion it draws a single still
 * frame instead (`still` is true), and follows the preference if it changes.
 * `frameMs` caps the frame rate (0 = every animation frame). The first frame is
 * drawn during this call, so `draw` must not depend on the returned object.
 */
export function frameLoop(
  target: Element,
  draw: (now: number, still: boolean) => void,
  frameMs = 0,
): FrameLoop {
  let reduced = prefersReducedMotion();
  let visible = true;
  let lastFrame = 0;
  let raf = 0;

  const cancel = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (now - lastFrame < frameMs) return;
    lastFrame = now;
    draw(now, false);
  };

  const sync = () => {
    cancel();
    if (!visible || document.hidden) return;
    if (reduced) draw(performance.now(), true);
    else raf = requestAnimationFrame(loop);
  };

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  intersection.observe(target);

  const offMotion = onReducedMotionChange(() => {
    reduced = prefersReducedMotion();
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  sync();

  return {
    get reduced() {
      return reduced;
    },
    redraw() {
      if (reduced && visible && !document.hidden) draw(performance.now(), true);
    },
    stop() {
      cancel();
      intersection.disconnect();
      offMotion();
      document.removeEventListener('visibilitychange', sync);
    },
  };
}
