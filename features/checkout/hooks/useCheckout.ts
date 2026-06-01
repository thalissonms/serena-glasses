"use client";

import { useCheckoutDraft } from "./useCheckoutDraft";
import { useCheckoutPricing } from "./useCheckoutPricing";
import { useCheckoutSubmission } from "./useCheckoutSubmission";
import { useEmptyCartGuard } from "./useEmptyCartGuard";

type Options = {
  /**
   * Disparado quando o carrinho fica vazio fora do fluxo de sucesso (ex.: usuário
   * abriu /checkout direto sem itens, ou outra aba esvaziou o carrinho).
   * Desktop normalmente navega pra `/cart`; modal mobile fecha a si mesmo.
   */
  onEmptyCart: () => void;
};

/**
 * Hook composto que orquestra todo o fluxo de checkout — draft persistido,
 * derived pricing, guard de carrinho vazio e submissão (cartão/PIX/boleto).
 *
 * Compõe e expõe o retorno de:
 * - `useCheckoutDraft` → `clearDraft`
 * - `useCheckoutPricing` → `subtotal`, `discount`, `isFreeShippingCoupon`,
 *   `shippingPrice`, `total`, `cartMaxInstallments`
 * - `useCheckoutSubmission` → `phase`, `isSubmitting`, `cardRetryCount`,
 *   `clearCardFields`, `submitCheckout`
 *
 * O `useEmptyCartGuard` é plumbado internamente: o consumer só configura o
 * `onEmptyCart`; o `markCompleting` é injetado no submission automaticamente.
 *
 * @requires Estar dentro de `<CheckoutFormProvider>` — vários hooks internos
 * dependem de `useCheckoutForm()`.
 *
 * @example
 * // Desktop
 * const checkout = useCheckout({ onEmptyCart: () => router.push("/cart") });
 *
 * // Modal mobile
 * const checkout = useCheckout({ onEmptyCart: () => closeModal() });
 */
export default function useCheckout({ onEmptyCart }: Options) {
  const draft = useCheckoutDraft();
  const pricing = useCheckoutPricing();
  const { markCompleting } = useEmptyCartGuard(onEmptyCart);
  const submission = useCheckoutSubmission({
    total: pricing.total,
    isFreeShippingCoupon: pricing.isFreeShippingCoupon,
    clearDraft: draft.clearDraft,
    onComplete: markCompleting,
  });

  return { ...draft, ...pricing, ...submission };
}
