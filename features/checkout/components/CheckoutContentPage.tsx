"use client";
import { Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import CheckoutHeader from "@features/checkout/components/CheckoutHeader";
import OrderSummarySidebar from "@features/checkout/components/OrderSummarySidebar";
import { IdentificationModule } from "@features/checkout/components/IdentificationModule";
import { AddressModule } from "@features/checkout/components/AddressModule";
import { PaymentModule } from "@features/checkout/components/PaymentModule";
import { PixPaymentScreen } from "@features/checkout/components/PixPaymentScreen";
import { BoletoPaymentScreen } from "@features/checkout/components/BoletoPaymentScreen";
import useCheckout from "@features/checkout/hooks/useCheckout";

const bagSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fce7f3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z"/><path d="M8 11V6a4 4 0 0 1 8 0v5"/></svg>`,
);

export default function CheckoutContentPage() {
  const { t } = useTranslation("checkout");
  const router = useRouter();
  const {
    phase,
    total,
    cartMaxInstallments,
    isSubmitting,
    cardRetryCount,
    clearCardFields,
    submitCheckout,
  } = useCheckout({ onEmptyCart: () => router.push("/cart") });

  if (phase.status === "pix") {
    return (
      <main className="w-full min-h-screen bg-[#FFF0FA] dark:bg-[#0a0a0a] text-black dark:text-white py-12 px-4 sm:px-8 lg:px-20 transition-colors">
        <CheckoutHeader
          breadcrumb={{
            isActive: true,
            items: [{ navs: t("breadcrumb.checkout"), url: "" }],
          }}
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
          breadcrumb={{
            isActive: true,
            items: [{ navs: t("breadcrumb.checkout"), url: "" }],
          }}
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
          onSubmit={submitCheckout}
        >
          <IdentificationModule />
          <AddressModule />
          <PaymentModule
            subtotal={total}
            retryCount={cardRetryCount}
            onRetry={clearCardFields}
            maxInstallments={cartMaxInstallments}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex lg:hidden items-center justify-center gap-2 w-full py-5 font-poppins text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink bg-brand-pink text-white shadow-[6px_6px_0_#000] hover:translate-y-0.5 hover:shadow-[4px_4px_0_#000] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0_#000]"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Lock size={14} />
            )}
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
