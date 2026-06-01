"use client";

import { useMounted } from "@shared/hooks/useMounted";
import { useIsDesktop } from "@shared/hooks/useIsDesktop";
import WishlistModalContent from "@features/wishlist/components/mobile/WishlistModalContent";

export default function WishlistModal() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  if (!mounted || isDesktop) return null;
  return <WishlistModalContent />;
}
