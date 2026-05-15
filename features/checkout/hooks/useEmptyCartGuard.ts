"use client";

import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@features/cart/store/cart.store";

/**
 * Dispara `onEmpty` quando o carrinho fica vazio durante o checkout — exceto
 * quando o esvaziamento foi causado pelo próprio fluxo de sucesso (que chama
 * `clearCart()` antes de navegar pro `/checkout/success`).
 *
 * Espera a hidratação do `persist` antes de avaliar. Sem isso, o estado inicial
 * (`items: []` do default) dispara o redirect antes do `sessionStorage` ser
 * carregado — causa loop quando o usuário entra via full reload no desktop.
 *
 * O consumer chama `markCompleting()` imediatamente antes do `clearCart()` pra
 * silenciar o guard. O callback fica em ref interno, então o consumer pode
 * passar uma arrow inline sem se preocupar com estabilidade.
 *
 * @example
 * const { markCompleting } = useEmptyCartGuard(() => router.push("/cart"));
 * if (approved) { markCompleting(); clearCart(); router.push("/success"); }
 */
export function useEmptyCartGuard(onEmpty: () => void) {
  const { items } = useCartStore();
  const completingRef = useRef(false);
  const onEmptyRef = useRef(onEmpty);
  onEmptyRef.current = onEmpty;

  const [hasHydrated, setHasHydrated] = useState(() =>
    useCartStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hasHydrated) return;
    const unsub = useCartStore.persist.onFinishHydration(() =>
      setHasHydrated(true),
    );
    if (useCartStore.persist.hasHydrated()) setHasHydrated(true);
    return unsub;
  }, [hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (completingRef.current) return;
    if (items.length <= 0) onEmptyRef.current();
  }, [items, hasHydrated]);

  return {
    hasHydrated,
    markCompleting: () => {
      completingRef.current = true;
    },
  };
}
