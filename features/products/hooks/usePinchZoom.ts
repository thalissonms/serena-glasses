import { useState, useRef, useEffect, useCallback } from "react";

const MAX_ZOOM = 3;

export function usePinchZoom(max = MAX_ZOOM) {
  const [scale, setScale] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const pinchDistanceRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // passive: false required — browser drops preventDefault on passive listeners, which would let native scroll override pinch zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 2 && pinchDistanceRef.current !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setScale(Math.min(max, Math.max(1, dist / pinchDistanceRef.current)));
      }
    }

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [max]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
      setIsZooming(true);
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2 && isZooming) {
      setIsZooming(false);
      setScale(1);
      pinchDistanceRef.current = null;
    }
  }, [isZooming]);

  return { scale, isZooming, containerRef, onTouchStart, onTouchEnd };
}
