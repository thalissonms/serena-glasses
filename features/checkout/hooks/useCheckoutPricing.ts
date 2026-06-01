"use client";

import { useCartStore } from "@features/cart/store/cart.store";
import { useSiteSetting } from "@shared/hooks/useSiteSettings";
import { computeEffectiveInstallments } from "@shared/utils/effectiveInstallments";

/**
 * Derived state de preços do checkout a partir do `useCartStore`.
 *
 * `total = max(0, subtotal - discount + shippingPrice)`. Cupom `free_shipping`
 * zera o frete (mas a flag `isFreeShippingCoupon` continua exposta porque o
 * payload de `/api/checkout` precisa diferenciar "zero por cupom" de "zero por
 * frete grátis nativo"). `cartMaxInstallments` aplica o teto efetivo via
 * `site_settings.installments_bulk` (vide CLAUDE.md).
 *
 * Hook puro: só deriva, não dispara efeitos.
 */
export function useCheckoutPricing() {
  const { items, appliedCoupon, selectedShipping } = useCartStore();
  const { data: installmentsBulk } = useSiteSetting("installments_bulk");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartMaxInstallments = computeEffectiveInstallments(
    items.map((i) => ({ price: i.price, quantity: i.quantity, maxInstallments: i.maxInstallments ?? 1 })),
    installmentsBulk ?? null,
  );
  const discount = appliedCoupon?.discount_applied_cents ?? 0;
  const isFreeShippingCoupon = appliedCoupon?.discount_type === "free_shipping";
  const shippingPrice = isFreeShippingCoupon ? 0 : (selectedShipping?.price ?? 0);
  const total = Math.max(0, subtotal - discount + shippingPrice);

  return { subtotal, discount, isFreeShippingCoupon, shippingPrice, total, cartMaxInstallments };
}
