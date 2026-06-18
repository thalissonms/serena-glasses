"use client";

import { CheckoutFormProvider } from "@features/checkout/providers/checkout.rhf";
import { useMounted } from "@shared/hooks/useMounted";
import CheckoutModalContent from "@features/checkout/components/mobile/CheckoutModalContent";
import { useIsDesktop } from "@shared/hooks/useIsDesktop";

export default function CheckoutModal() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();

  if (!mounted || isDesktop) return null;

  return (
    <CheckoutFormProvider>
      <CheckoutModalContent />
    </CheckoutFormProvider>
  );
}
