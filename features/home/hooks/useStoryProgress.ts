import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface UseStoryProgressOptions {
  count: number;
  currentIndex: number;
  isVisible: boolean;
  paused: boolean;
  onNext: () => void;
  duration?: number;
}

export function useStoryProgress({
  count,
  currentIndex,
  isVisible,
  paused,
  onNext,
  duration = 5000,
}: UseStoryProgressOptions): { progressRef: RefObject<HTMLDivElement | null> } {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const elapsedRef = useRef<number>(0);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  // Reset ao trocar story
  useEffect(() => {
    elapsedRef.current = 0;
    progressRef.current?.style.setProperty("--progress", "0%");
  }, [currentIndex]);

  useEffect(() => {
    if (!isVisible || count === 0) return;
    let raf = 0;
    let lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = ts - lastTs;
      lastTs = ts;
      if (!paused) {
        elapsedRef.current += dt;
        const pct = Math.min(100, (elapsedRef.current / duration) * 100);
        progressRef.current?.style.setProperty("--progress", `${pct}%`);
        if (pct >= 100) {
          elapsedRef.current = 0;
          onNextRef.current();
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, count, duration, paused, currentIndex]);

  return { progressRef };
}
