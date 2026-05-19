import { useEffect, useRef, useState } from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
}

export default function ProgressBar({ label, value }: ProgressBarProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFilled(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="mb-5">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-display text-sm font-semibold uppercase tracking-wide text-ink-deep">
          {label}
        </span>
        <span className="text-xs italic text-ink/70">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bar-track">
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full rounded-full bg-accent transition-[width] duration-[1500ms] ease-out"
          style={{ width: filled ? `${value}%` : '0%' }}
        />
      </div>
    </div>
  );
}
