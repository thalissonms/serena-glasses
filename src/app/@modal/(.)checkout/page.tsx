"use client";

import PageInterceptTransition from "@features/navigation/components/mobile/modals/PageInterceptTransition";
import { CheckoutFormProvider } from "@features/checkout/providers/checkout.rhf";
import { useMounted } from "@shared/hooks/useMounted";
import CheckoutPageContentMobile from "@features/checkout/components/mobile/CheckoutContentPageMobile";
import { useIsDesktop } from "@/shared/hooks/useIsDesktop";

export default function CheckoutModal() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();

  if (!mounted || isDesktop) return null;

  return (
    <CheckoutFormProvider>
      <CheckoutPageContentMobile />
    </CheckoutFormProvider>
  );
}
