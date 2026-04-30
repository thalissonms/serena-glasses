"use client";
import { Lock, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CheckoutHeader from "@features/checkout/components/CheckoutHeader";
import OrderSummarySidebar from "@features/checkout/components/OrderSummarySidebar";
import {
  CheckoutFormProvider,
  useCheckoutForm,
} from "@features/checkout/providers/checkout.rhf";
import { IdentificationModule } from "@features/checkout/components/IdentificationModule";
import { AddressModule } from "@features/checkout/components/AddressModule";
import { PaymentModule } from "@features/checkout/components/PaymentModule";
import { PixPaymentScreen } from "@features/checkout/components/PixPaymentScreen";
import { BoletoPaymentScreen } from "@features/checkout/components/BoletoPaymentScreen";
import { useRouter } from "next/navigation";
import { useCartStore } from "@features/cart/store/cart.store";
import type { CheckoutFormData } from "@features/checkout/types/checkout.types";
import { PaymentMethod } from "@features/checkout/enums/checkout.enum";
import { useMpCardToken } from "@features/checkout/hooks/useMpCardToken";
import { getAnonymousId } from "@shared/utils/anonymousId";
import { formatPrice } from "@features/products/utils/formatPrice";

type CheckoutPhase =
  | { status: "form" }
  | { status: "pix"; orderNumber: string; orderId: string; qrCodeBase64: string; pixCopyPaste: string; totalBRL: string }
  | { status: "boleto"; orderNumber: string; orderId: string; boletoUrl: string; barcode: string; totalBRL: string };

function CheckoutContent() {
  const { handleSubmit, watch } = useCheckoutForm();
  const { t } = useTranslation("checkout");
  const router = useRouter();
  const { items, appliedCoupon, clearCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = appliedCoupon?.discount_applied_cents ?? 0;
  const total = Math.max(0, subtotal - discount);
  const paymentMethod = watch("payment.method");

  const { isReady, createCardToken } = useMpCardToken();

  const [phase, setPhase] = useState<CheckoutPhase>({ status: "form" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const completingRef = useRef(false);

  useEffect(() => {
    if (!completingRef.current && items.length <= 0) {
      router.push("/cart");
    }
  }, [items, router]);

  async function onSubmit(formData: CheckoutFormData) {
    setIsSubmitting(true);
    setSubmitError(null);
    setCardError(null);

    try {
      let cardToken: string | undefined;
      let cardPaymentMethodId: string | undefined;

      // Tokenizar cartão client-side (dados nunca chegam ao nosso backend)
      if (paymentMethod === PaymentMethod.Card) {
        if (!isReady) {
          setSubmitError("Serviço de pagamento não carregado. Recarregue a página.");
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
          setCardError(err?.message ?? "Dados do cartão inválidos. Verifique e tente novamente.");
          setIsSubmitting(false);
          return;
        }
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Strip campos sensíveis de cartão — nunca enviamos para o servidor
          formData: {
            ...formData,
            payment: { method: formData.payment.method, installments: formData.payment.installments },
          },
          items,
          couponCode: appliedCoupon?.code ?? null,
          anonymousId: getAnonymousId(),
          ...(cardToken && {
            cardToken,
            cardPaymentMethodId,
            cardInstallments: Number(formData.payment.installments ?? 1),
          }),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setSubmitError(result.error ?? "Erro ao processar pedido. Tente novamente.");
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === PaymentMethod.Card) {
        if (result.payment?.status === "approved") {
          completingRef.current = true;
          clearCart();
          router.push(`/checkout/success?order=${result.orderNumber}`);
        } else {
          setCardError(result.error ?? "Pagamento não aprovado. Tente outro cartão.");
          setIsSubmitting(false);
        }
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
      setSubmitError("Não foi possível finalizar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const bagSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fce7f3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z"/><path d="M8 11V6a4 4 0 0 1 8 0v5"/></svg>`,
  );

  if (phase.status === "pix") {
    return (
      <main className="w-full min-h-screen bg-[#FFF0FA] dark:bg-[#0a0a0a] text-black dark:text-white py-12 px-4 sm:px-8 lg:px-20 transition-colors">
        <CheckoutHeader
          breadcrumb={{ isActive: true, items: [{ navs: t("breadcrumb.checkout"), url: "" }] }}
          finishingOrder={false}
        />
        <PixPaymentScreen
          orderNumber={phase.orderNumber}
          orderId={phase.orderId}
          qrCodeBase64={phase.qrCodeBase64}
          pixCopyPaste={phase.pixCopyPaste}
          totalBRL={phase.totalBRL}
        />
      </main>
    );
  }

  if (phase.status === "boleto") {
    return (
      <main className="w-full min-h-screen bg-[#FFF0FA] dark:bg-[#0a0a0a] text-black dark:text-white py-12 px-4 sm:px-8 lg:px-20 transition-colors">
        <CheckoutHeader
          breadcrumb={{ isActive: true, items: [{ navs: t("breadcrumb.checkout"), url: "" }] }}
          finishingOrder={false}
        />
        <BoletoPaymentScreen
          orderNumber={phase.orderNumber}
          orderId={phase.orderId}
          boletoUrl={phase.boletoUrl}
          barcode={phase.barcode}
          totalBRL={phase.totalBRL}
        />
      </main>
    );
  }

  return (
    <main
      className="w-full min-h-screen bg-[#FFF0FA] dark:bg-[#0a0a0a] text-black dark:text-white py-12 px-4 sm:px-8 lg:px-20 transition-colors"
      style={{
        backgroundImage: `url("data:image/svg+xml,${bagSvg}")`,
        backgroundSize: "60px 50px",
        backgroundRepeat: "repeat",
      }}
    >
      <CheckoutHeader
        breadcrumb={{
          isActive: true,
          items: [
            { navs: t("breadcrumb.cart"), url: "/cart" },
            { navs: t("breadcrumb.checkout"), url: "" },
          ],
        }}
        finishingOrder={true}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        <form
          id="checkout-form"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit, () =>
            setSubmitError("Por favor, preencha todos os campos obrigatórios.")
          )}
        >
          <IdentificationModule />
          <AddressModule />
          <PaymentModule subtotal={total} cardError={cardError} />

          {submitError && (
            <p className="text-red-600 dark:text-red-400 font-poppins text-sm font-semibold border-2 border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950/30 px-4 py-3">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex lg:hidden items-center justify-center gap-2 w-full py-5 font-poppins text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink bg-brand-pink text-white shadow-[6px_6px_0_#000] hover:translate-y-0.5 hover:shadow-[4px_4px_0_#000] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0_#000]"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            {isSubmitting ? "Processando..." : t("sidebar.confirmOrder")}
          </button>
        </form>

        <div className="flex flex-col gap-4 sticky top-28">
          <OrderSummarySidebar isFinished={true} isSubmitting={isSubmitting} />
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutFormProvider>
      <CheckoutContent />
    </CheckoutFormProvider>
  );
}
