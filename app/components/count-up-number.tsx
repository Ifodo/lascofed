"use client";

import { useEffect, useRef, useState } from "react";

type CountUpNumberProps = {
  end: number;
  durationMs?: number;
  suffix?: string;
  className?: string;
};

export default function CountUpNumber({
  end,
  durationMs = 1400,
  suffix = "",
  className,
}: CountUpNumberProps) {
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasStarted) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const timeoutId = window.setTimeout(() => setValue(end), 0);
      return () => window.clearTimeout(timeoutId);
    }

    let animationFrameId = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      setValue(Math.round(progress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [durationMs, end, hasStarted]);

  return (
    <span ref={elementRef} className={className}>
      {new Intl.NumberFormat().format(value)}
      {suffix}
    </span>
  );
}