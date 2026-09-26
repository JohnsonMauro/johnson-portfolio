import { useSyncExternalStore } from 'react';
import { SunIcon, MoonIcon } from '../../shared/ui/icons';
import { THEME_STORAGE_KEY } from '../../shared/lib/storage-keys';

// The inline script in BaseLayout sets the `dark` class before paint. The
// server has no document and renders the light state; useSyncExternalStore
// hydrates with that server snapshot, then switches to the real class, so
// the first client render matches the HTML (no hydration mismatch).
const readThemeClass = () => document.documentElement.classList.contains('dark');

const subscribeToThemeClass = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};

interface ThemeToggleProps {
  label: string;
  toDarkLabel: string;
  toLightLabel: string;
}

export default function ThemeToggle({ label, toDarkLabel, toLightLabel }: ThemeToggleProps) {
  const isDark = useSyncExternalStore(subscribeToThemeClass, readThemeClass, () => false);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    root.classList.toggle('dark', next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      /* localStorage unavailable — ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={isDark ? toLightLabel : toDarkLabel}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-sidebar-social text-white/80 transition hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span aria-hidden="true">
        {isDark ? <SunIcon width={16} height={16} /> : <MoonIcon width={16} height={16} />}
      </span>
    </button>
  );
}
