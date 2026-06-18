"use client";

import PageInterceptTransition from "@shared/navigation/components/mobile/modals/PageInterceptTransition";
import CheckoutMobileContent from "./CheckoutMobileContent";

export default function CheckoutModalContent() {
  return (
    <PageInterceptTransition>
      <CheckoutMobileContent />
    </PageInterceptTransition>
  );
}
