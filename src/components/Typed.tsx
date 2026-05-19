import { useEffect, useRef, useState } from 'react';

interface TypedProps {
  words: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
}

export default function Typed({
  words,
  typeSpeed = 90,
  backSpeed = 45,
  backDelay = 1600,
}: TypedProps) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing');
  const timer = useRef<number>();

  useEffect(() => {
    const current = words[wordIndex % words.length];

    if (phase === 'typing') {
      if (text === current) {
        timer.current = window.setTimeout(() => setPhase('deleting'), backDelay);
      } else {
        timer.current = window.setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          typeSpeed
        );
      }
    } else if (phase === 'deleting') {
      if (text === '') {
        setWordIndex((i) => i + 1);
        setPhase('typing');
      } else {
        timer.current = window.setTimeout(
          () => setText(current.slice(0, text.length - 1)),
          backSpeed
        );
      }
    }

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [text, phase, wordIndex, words, typeSpeed, backSpeed, backDelay]);

  return (
    <span>
      <span>{text}</span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[1em] w-0.5 -translate-y-[-2px] bg-current animate-blink"
      />
    </span>
  );
}
