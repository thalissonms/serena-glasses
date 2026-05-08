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
import { y2kToast } from "@shared/lib/y2kToast";

const DRAFT_KEY = "serena.checkout-draft";

type CheckoutPhase =
  | { status: "form" }
  | { status: "pix"; orderNumber: string; orderId: string; qrCodeBase64: string; pixCopyPaste: string; totalBRL: string }
  | { status: "boleto"; orderNumber: string; orderId: string; boletoUrl: string; barcode: string; totalBRL: string };

function CheckoutContent() {
  const { handleSubmit, watch, setValue } = useCheckoutForm();
  const { t } = useTranslation("checkout");
  const router = useRouter();
  const { items, appliedCoupon, selectedShipping, clearCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = appliedCoupon?.discount_applied_cents ?? 0;
  const isFreeShippingCoupon = appliedCoupon?.discount_type === "free_shipping";
  const shippingPrice = isFreeShippingCoupon ? 0 : (selectedShipping?.price ?? 0);
  const total = Math.max(0, subtotal - discount + shippingPrice);
  const paymentMethod = watch("payment.method");

  const { isReady, createCardToken } = useMpCardToken();

  const [phase, setPhase] = useState<CheckoutPhase>({ status: "form" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const completingRef = useRef(false);

  // orderId do pedido em retry (null = criar novo)
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  // Número da tentativa atual (null = não houve falha ainda)
  const [cardRetryCount, setCardRetryCount] = useState<number | null>(null);

  // Restaura rascunho do sessionStorage ao montar
  useEffect(() => {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as {
        identification?: Partial<CheckoutFormData["identification"]>;
        address?: Partial<CheckoutFormData["address"]>;
      };
      if (draft.identification) {
        const id = draft.identification;
        if (id.fullName) setValue("identification.fullName", id.fullName);
        if (id.cpf)      setValue("identification.cpf", id.cpf);
        if (id.email)    setValue("identification.email", id.email);
        if (id.phone)    setValue("identification.phone", id.phone);
      }
      if (draft.address) {
        const a = draft.address;
        if (a.cep)          setValue("address.cep", a.cep);
        if (a.street)       setValue("address.street", a.street);
        if (a.number)       setValue("address.number", a.number);
        if (a.complement)   setValue("address.complement", a.complement);
        if (a.neighborhood) setValue("address.neighborhood", a.neighborhood);
        if (a.city)         setValue("address.city", a.city);
        if (a.state)        setValue("address.state", a.state);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salva rascunho sempre que identificação ou endereço mudam
  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      if (!values.identification && !values.address) return;
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ identification: values.identification, address: values.address }),
      );
    });
    return () => unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!completingRef.current && items.length <= 0) {
      router.push("/cart");
    }
  }, [items, router]);

  function clearCardFields() {
    setValue("payment.cardNumber", "");
    setValue("payment.cardName", "");
    setValue("payment.cardExpiry", "");
    setValue("payment.cardCvv", "");
    setCardRetryCount(null);
  }

  async function onSubmit(formData: CheckoutFormData) {
    setIsSubmitting(true);
    setSubmitError(null);

    if (!selectedShipping) {
      setSubmitError("Selecione uma opção de frete antes de continuar.");
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

      // Erros antes do MP (stock, preço, frete, etc.)
      if (!res.ok && !result.kind) {
        y2kToast.error(result.error ?? "Erro ao processar pedido. Tente novamente.");
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === PaymentMethod.Card) {
        const kind = result.kind as string | undefined;

        if (kind === "approved" || result.payment?.status === "approved") {
          completingRef.current = true;
          sessionStorage.removeItem(DRAFT_KEY);
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

        // Fallback (in_process, etc.)
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
          <PaymentModule
            subtotal={total}
            retryCount={cardRetryCount}
            onRetry={clearCardFields}
          />

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
