import { useSyncExternalStore } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Read at event time (click handlers); never during render. */
export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

/** Scroll behavior that honors the user's motion preference. */
export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/**
 * Live motion preference for rendering. The server snapshot is `false` (full
 * motion), so hydration matches the static HTML before the real value applies.
 */
export const useReducedMotion = () => useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
