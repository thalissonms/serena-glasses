import { useRef, useCallback } from "react";

const DOUBLE_TAP_MS = 350;

export function useDoubleTap(onDouble: () => void, windowMs = DOUBLE_TAP_MS) {
  const lastTapRef = useRef<number>(0);

  const onTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < windowMs) onDouble();
    lastTapRef.current = now;
  }, [onDouble, windowMs]);

  return onTap;
}
