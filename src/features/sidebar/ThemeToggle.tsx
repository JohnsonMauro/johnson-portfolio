import { useState } from 'react';
import { SunIcon, MoonIcon } from '../../shared/ui/icons';
import { THEME_STORAGE_KEY } from '../../shared/lib/storage-keys';

interface ThemeToggleProps {
  label: string;
  toDarkLabel: string;
  toLightLabel: string;
}

export default function ThemeToggle({ label, toDarkLabel, toLightLabel }: ThemeToggleProps) {
  // Reads the class the inline script in BaseLayout set before paint. On the
  // server there is no document, so the static HTML renders the light state.
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    root.classList.toggle('dark', next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      /* localStorage unavailable — ignore */
    }
    setIsDark(next);
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
