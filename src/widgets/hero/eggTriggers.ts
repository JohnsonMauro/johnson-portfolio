/** Typed anywhere on the page (outside form fields). */
const SEQUENCE = 'pnp';
/** Three presses within this window, close together, count as a triple click or tap. */
const TAP_WINDOW_MS = 700;
const TAP_SLOP = 40;

interface Press {
  time: number;
  x: number;
  y: number;
}

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/**
 * Listens for the two explicit easter-egg gestures: typing "pnp", and a
 * triple click or tap on `area` (which also works on touch screens, where
 * there is no keyboard or resting cursor). `onTrigger` gets the client point
 * of a triple press, or null for the keyboard. Returns the teardown.
 */
export function listenForEgg(
  area: HTMLElement,
  onTrigger: (at: { clientX: number; clientY: number } | null) => void,
): () => void {
  let typed = '';
  let presses: Press[] = [];

  const onKeyDown = (event: KeyboardEvent) => {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.key.length !== 1 ||
      isEditable(event.target)
    )
      return;
    typed = (typed + event.key.toLowerCase()).slice(-SEQUENCE.length);
    if (typed !== SEQUENCE) return;
    typed = '';
    onTrigger(null);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    const press = { time: event.timeStamp, x: event.clientX, y: event.clientY };
    presses = [
      ...presses.filter(
        (earlier) =>
          press.time - earlier.time < TAP_WINDOW_MS &&
          Math.hypot(earlier.x - press.x, earlier.y - press.y) < TAP_SLOP,
      ),
      press,
    ];
    if (presses.length < 3) return;
    presses = [];
    // A triple click also selects the hero heading (on the mousedown that
    // follows this event); the gesture is ours, so drop it a frame later.
    requestAnimationFrame(() => window.getSelection()?.removeAllRanges());
    onTrigger({ clientX: press.x, clientY: press.y });
  };

  window.addEventListener('keydown', onKeyDown);
  area.addEventListener('pointerdown', onPointerDown);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    area.removeEventListener('pointerdown', onPointerDown);
  };
}
