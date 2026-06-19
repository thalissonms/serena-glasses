"use client";

import { useCartStore } from "@features/cart/store/cart.store";
import CartPageContent from "@features/cart/components/CartPageContent";
import CartModalContent from "@features/cart/components/mobile/CartModalContent";
import { useMounted } from "@shared/hooks/useMounted";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const mounted = useMounted();

  const currentItems = mounted ? items : [];

  function changeQty(variantId: string, delta: number) {
    const item = currentItems.find((i) => i.variantId === variantId);
    if (item) updateQuantity(variantId, item.quantity + delta);
  }

  return (
    <>
      <div className="hidden md:block">
        <CartPageContent
          items={currentItems}
          removeItem={removeItem}
          changeQty={changeQty}
        />
      </div>
      <div className="md:hidden">
        <CartModalContent />
      </div>
    </>
  );
}
