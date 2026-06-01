import { useRef, useCallback } from "react";

const SWIPE_THRESHOLD_PX = 40;

export function useSwipe(
  onNext: () => void,
  onPrev: () => void,
  threshold = SWIPE_THRESHOLD_PX,
) {
  const swipeStartXRef = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      swipeStartXRef.current = null; // cancel swipe if pinch starts
    } else if (e.touches.length === 1) {
      swipeStartXRef.current = e.touches[0].clientX;
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (swipeStartXRef.current === null || e.changedTouches.length === 0) return;
    const diff = e.changedTouches[0].clientX - swipeStartXRef.current;
    if (Math.abs(diff) > threshold) {
      if (diff < 0) onNext();
      else onPrev();
    }
    swipeStartXRef.current = null;
  }, [onNext, onPrev, threshold]);

  return { onTouchStart, onTouchEnd };
}
