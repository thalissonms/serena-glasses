"use client";

import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Retorna `true` quando o viewport está acima de `md` (768px). Inicializa como
 * `false` no SSR e no primeiro render do cliente, atualizando após o mount —
 * use em conjunto com `useMounted` quando precisar evitar flash de mobile UI.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}
