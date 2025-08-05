import { useEffect, useRef, useState } from "react";
import { useCounterContext } from "@/contexts/CounterContext";

interface AnimatedCounterProps {
  id: string;
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  id,
  from = 0,
  to,
  duration = 2000,
  prefix = "",
  suffix = "",
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { counters, setCounter } = useCounterContext();
  const [current, setCurrent] = useState(() => counters[id] ?? from);

  useEffect(() => {
    if (counters[id] !== undefined) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCount();
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasAnimated, counters[id]]);

  const animateCount = () => {
    const start = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(from + progress * (to - from));
      setCurrent(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCounter(id, to);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <span ref={ref} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
