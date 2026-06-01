"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@features/cart/store/cart.store";
import { useCheckoutForm } from "../providers/checkout.rhf";
import { useMpCardToken } from "./useMpCardToken";
import { getAnonymousId } from "@shared/utils/anonymousId";
import { formatPrice } from "@features/products/utils/formatPrice";
import { y2kToast } from "@shared/lib/y2kToast";
import { PaymentMethod } from "../enums/checkout.enum";
import type { CheckoutFormData, CheckoutPhase } from "../types/checkout.types";

type Props = {
  /** Total final em centavos — usado pra montar `totalBRL` nas telas de PIX/Boleto. */
  total: number;
  /** Vindo de `useCheckoutPricing`. Necessário pro payload diferenciar frete zerado por cupom. */
  isFreeShippingCoupon: boolean;
  /** Limpa o rascunho do sessionStorage após pedido aprovado. */
  clearDraft: () => void;
  /** Sinaliza ao `useEmptyCartGuard` que o `clearCart()` que vem a seguir é esperado. */
  onComplete: () => void;
};

/**
 * Núcleo do checkout: tokeniza cartão (MP), faz POST em `/api/checkout`, e
 * gerencia transições de fase (`form` → `pix` | `boleto` | sucesso/retry).
 *
 * Casos cobertos pelo retorno do `/api/checkout`:
 * - `kind: "approved"` → limpa rascunho/carrinho, navega pra success.
 * - `kind: "cancelled"` → toast + reseta retry (cartão excedeu tentativas).
 * - `kind: "data_error"` → toast + guarda `orderId` pra retry no mesmo pedido,
 *   incrementa `cardRetryCount` pro `PaymentModule` renderizar feedback.
 * - PIX/Boleto → muda `phase` pra renderizar a tela respectiva.
 *
 * Erros pré-submissão (frete não escolhido, RHF validation, token MP) vão pra
 * `y2kToast`. Não há mais estado de erro inline.
 *
 * @requires Estar dentro de `<CheckoutFormProvider>`.
 */
export function useCheckoutSubmission({ total, isFreeShippingCoupon, clearDraft, onComplete }: Props) {
  const { handleSubmit, watch, setValue } = useCheckoutForm();
  const { items, appliedCoupon, selectedShipping, clearCart } = useCartStore();
  const { isReady, createCardToken } = useMpCardToken();
  const router = useRouter();
  const paymentMethod = watch("payment.method");

  const [phase, setPhase] = useState<CheckoutPhase>({ status: "form" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [cardRetryCount, setCardRetryCount] = useState<number | null>(null);

  function clearCardFields() {
    setValue("payment.cardNumber", "");
    setValue("payment.cardName", "");
    setValue("payment.cardExpiry", "");
    setValue("payment.cardCvv", "");
    setCardRetryCount(null);
  }

  async function onSubmit(formData: CheckoutFormData) {
    setIsSubmitting(true);

    if (!selectedShipping) {
      y2kToast.error("Selecione uma opção de frete antes de continuar.");
      setIsSubmitting(false);
      return;
    }

    try {
      let cardToken: string | undefined;
      let cardPaymentMethodId: string | undefined;

      if (paymentMethod === PaymentMethod.Card) {
        if (!isReady) {
          y2kToast.error("Serviço de pagamento não carregado. Recarregue a página.");
          setIsSubmitting(false);
          return;
        }

        const [month, shortYear] = (formData.payment.cardExpiry ?? "").split("/");
        const year = (shortYear ?? "").length === 2 ? `20${shortYear}` : (shortYear ?? "");

        try {
          const tokenResult = await createCardToken({
            cardNumber: (formData.payment.cardNumber ?? "").replace(/\s/g, ""),
            cardholderName: formData.payment.cardName ?? "",
            cardExpirationMonth: month ?? "",
            cardExpirationYear: year,
            securityCode: formData.payment.cardCvv ?? "",
            identificationType: "CPF",
            identificationNumber: formData.identification.cpf.replace(/\D/g, ""),
          });
          cardToken = tokenResult.token;
          cardPaymentMethodId = tokenResult.paymentMethodId;
        } catch (err: any) {
          y2kToast.error(err?.message ?? "Dados do cartão inválidos. Verifique e tente novamente.");
          setIsSubmitting(false);
          return;
        }
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(pendingOrderId && { orderId: pendingOrderId }),
          formData: {
            ...formData,
            payment: { method: formData.payment.method, installments: formData.payment.installments },
          },
          items,
          couponCode: appliedCoupon?.code ?? null,
          anonymousId: getAnonymousId(),
          shippingServiceId: selectedShipping.id,
          shippingServiceName: selectedShipping.name,
          shippingPrice: isFreeShippingCoupon ? 0 : selectedShipping.price,
          ...(cardToken && {
            cardToken,
            cardPaymentMethodId,
            cardInstallments: Number(formData.payment.installments ?? 1),
          }),
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok && !result.kind) {
        y2kToast.error(result.error ?? "Erro ao processar pedido. Tente novamente.");
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === PaymentMethod.Card) {
        const kind = result.kind as string | undefined;

        if (kind === "approved" || result.payment?.status === "approved") {
          onComplete();
          clearDraft();
          clearCart();
          router.push(`/checkout/success?order=${result.orderNumber}`);
          return;
        }

        if (kind === "cancelled") {
          y2kToast.error(
            result.errorMessage ??
              "Pedido cancelado após múltiplas falhas de pagamento. Você pode criar um novo pedido com outro cartão.",
          );
          setPendingOrderId(null);
          setCardRetryCount(null);
          setIsSubmitting(false);
          return;
        }

        if (kind === "data_error") {
          y2kToast.error(result.errorMessage ?? "Pagamento recusado. Verifique os dados do cartão.");
          setPendingOrderId(result.orderId);
          setCardRetryCount(result.attempts);
          setIsSubmitting(false);
          return;
        }

        y2kToast.error(result.error ?? "Pagamento não aprovado. Tente outro cartão.");
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === PaymentMethod.PIX) {
        setPhase({
          status: "pix",
          orderNumber: result.orderNumber,
          orderId: result.orderId ?? "",
          qrCodeBase64: result.payment?.qrCodeBase64 ?? "",
          pixCopyPaste: result.payment?.pixCopyPaste ?? "",
          totalBRL: formatPrice(total),
        });
        return;
      }

      if (paymentMethod === PaymentMethod.Boleto) {
        setPhase({
          status: "boleto",
          orderNumber: result.orderNumber,
          orderId: result.orderId ?? "",
          boletoUrl: result.payment?.boletoUrl ?? "",
          barcode: result.payment?.barcode ?? "",
          totalBRL: formatPrice(total),
        });
        return;
      }
    } catch {
      y2kToast.error("Não foi possível finalizar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const submitCheckout = handleSubmit(
    onSubmit,
    () => y2kToast.error("Por favor, preencha todos os campos obrigatórios."),
  );

  return {
    phase,
    isSubmitting,
    cardRetryCount,
    clearCardFields,
    submitCheckout,
  };
}
