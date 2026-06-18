"use client";

import PageInterceptTransition from "@shared/navigation/components/mobile/modals/PageInterceptTransition";
import WishlistMobileContent from "./WishlistMobileContent";

export default function WishlistModalContent() {
  return (
    <PageInterceptTransition>
      <WishlistMobileContent />
    </PageInterceptTransition>
  );
}
