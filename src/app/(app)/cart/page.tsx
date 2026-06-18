"use client";

import { useCartStore } from "@features/cart/store/cart.store";
import CartPageContent from "@features/cart/components/CartPageContent";
import CartModalContent from "@features/cart/components/mobile/CartModalContent";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();

  function changeQty(variantId: string, delta: number) {
    const item = items.find((i) => i.variantId === variantId);
    if (item) updateQuantity(variantId, item.quantity + delta);
  }

  return (
    <>
      <div className="hidden md:block">
        <CartPageContent
          items={items}
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
