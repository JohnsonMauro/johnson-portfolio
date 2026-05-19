import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type Variant = 'fade-in' | 'fade-up' | 'fade-right' | 'fade-left';

interface FadeInProps {
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
}

const ANIM: Record<Variant, string> = {
  'fade-in': 'animate-fade-in',
  'fade-up': 'animate-fade-up',
  'fade-right': 'animate-fade-right',
  'fade-left': 'animate-fade-left',
};

export default function FadeIn({
  variant = 'fade-up',
  delay = 0,
  className = '',
  as = 'div',
  children,
}: FadeInProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const Tag = as as keyof JSX.IntrinsicElements;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: CSSProperties = {
    animationDelay: visible ? `${delay}ms` : undefined,
    opacity: visible ? undefined : 0,
  };

  return (
    <Tag
      // @ts-expect-error generic ref via JSX.IntrinsicElements
      ref={ref}
      className={(visible ? ANIM[variant] + ' ' : '') + className}
      style={style}
    >
      {children}
    </Tag>
  );
}
