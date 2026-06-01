"use client";

import { useMounted } from "@shared/hooks/useMounted";
import { useIsDesktop } from "@shared/hooks/useIsDesktop";
import CartModalContent from "@features/cart/components/mobile/CartModalContent";

export default function CartModal() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  if (!mounted || isDesktop) return null;
  return <CartModalContent />;
}
