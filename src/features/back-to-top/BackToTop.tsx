import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '../../shared/ui/icons';
import { scrollBehavior } from '../../shared/lib/motion';

interface BackToTopProps {
  label: string;
}

export default function BackToTop({ label }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: scrollBehavior() });

  return (
    <button
      type="button"
      aria-label={label}
      onClick={scrollUp}
      className={
        'fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-lg transition hover:bg-accent-hover ' +
        (visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2')
      }
    >
      <ArrowUpIcon />
    </button>
  );
}
