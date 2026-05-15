"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ModalNavHeader from "@features/navigation/components/mobile/modals/ModalNavHeader";
import { AddressModuleMobile } from "@features/checkout/components/mobile/AddressModuleMobile";
import { IdentificationModuleMobile } from "@features/checkout/components/mobile/IdentificationModuleMobile";
import { PaymentModuleMobile } from "@features/checkout/components/mobile/PaymentModuleMobile";
import { CouponModuleMobile } from "@features/checkout/components/mobile/CouponModuleMobile";
import { InstallmentsModuleMobile } from "@features/checkout/components/mobile/InstallmentsModuleMobile";
import { OrderReviewModuleMobile } from "@features/checkout/components/mobile/OrderReviewModuleMobile";
import { StepSlide } from "@features/checkout/components/mobile/StepSlide";
import { AnimatePresence } from "framer-motion";
import { PixPaymentScreen } from "@features/checkout/components/PixPaymentScreen";
import { BoletoPaymentScreen } from "@features/checkout/components/BoletoPaymentScreen";
import { useCheckoutSteps } from "@features/checkout/hooks/useCheckoutSteps";
import { useCheckoutDraft } from "@features/checkout/hooks/useCheckoutDraft";
import { useCheckoutPricing } from "@features/checkout/hooks/useCheckoutPricing";
import { useCheckoutSubmission } from "@features/checkout/hooks/useCheckoutSubmission";
import { useEmptyCartGuard } from "@features/checkout/hooks/useEmptyCartGuard";
import clsx from "clsx";
import PageInterceptTransition from "@/features/navigation/components/mobile/modals/PageInterceptTransition";

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-3 px-6">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={clsx(
            "h-1.5 rounded-full transition-all",
            i === current
              ? "w-6 bg-brand-pink"
              : i < current
                ? "w-3 bg-brand-pink/60"
                : "w-3 bg-white/30",
          )}
        />
      ))}
    </div>
  );
}

const CheckoutModalContent = () => {
  const { t } = useTranslation("checkout");
  const router = useRouter();
  const {
    subtotal,
    discount,
    isFreeShippingCoupon,
    shippingPrice,
    total,
    cartMaxInstallments,
  } = useCheckoutPricing();

  const {
    step,
    direction,
    currentIndex,
    totalSteps,
    isFirst,
    goNext,
    goPrev,
    goTo,
  } = useCheckoutSteps({ maxInstallments: cartMaxInstallments });

  const { clearDraft } = useCheckoutDraft({ step, onRestoreStep: goTo });

  const { markCompleting } = useEmptyCartGuard(() =>
    router.replace("/products"),
  );

  const {
    phase,
    isSubmitting,
    cardRetryCount,
    clearCardFields,
    submitCheckout,
  } = useCheckoutSubmission({
    total,
    isFreeShippingCoupon,
    clearDraft,
    onComplete: markCompleting,
  });

  if (phase.status === "pix") {
    return <PixPaymentScreen {...phase} />;
  }
  if (phase.status === "boleto") {
    return <BoletoPaymentScreen {...phase} />;
  }

  const handleBack = () => {
    if (isFirst) router.back();
    else goPrev();
  };

  return (
    <div
      className="min-h-screen text-black dark:text-white"
      role="dialog"
      aria-modal="true"
      aria-label={t("checkout.title")}
    >
      <ModalNavHeader
        pageToBack="/products"
        onBack={handleBack}
        display={t("checkout.title")}
        buttons={{ labelBack: t("cart.back") }}
      />
      <StepIndicator current={currentIndex} total={totalSteps} />

      <div className="relative overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {step === "address" && (
            <StepSlide key="address" direction={direction}>
              <AddressModuleMobile nextStep={goNext} />
            </StepSlide>
          )}
          {step === "identification" && (
            <StepSlide key="identification" direction={direction}>
              <IdentificationModuleMobile nextStep={goNext} />
            </StepSlide>
          )}
          {step === "payment" && (
            <StepSlide key="payment" direction={direction}>
              <PaymentModuleMobile
                nextStep={goNext}
                retryCount={cardRetryCount}
                onRetry={clearCardFields}
              />
            </StepSlide>
          )}
          {step === "coupon" && (
            <StepSlide key="coupon" direction={direction}>
              <CouponModuleMobile nextStep={goNext} />
            </StepSlide>
          )}
          {step === "installments" && (
            <StepSlide key="installments" direction={direction}>
              <InstallmentsModuleMobile
                nextStep={goNext}
                subtotal={subtotal}
                maxInstallments={cartMaxInstallments}
              />
            </StepSlide>
          )}
          {step === "review" && (
            <StepSlide key="review" direction={direction}>
              <OrderReviewModuleMobile
                subtotal={subtotal}
                discount={discount}
                shippingPrice={shippingPrice}
                total={total}
                onSubmit={submitCheckout}
                isSubmitting={isSubmitting}
              />
            </StepSlide>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function CheckoutPageContentMobile() {
  return (
    <PageInterceptTransition>
      <CheckoutModalContent></CheckoutModalContent>
    </PageInterceptTransition>
  );
}
