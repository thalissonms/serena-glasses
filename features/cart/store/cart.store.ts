import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/cart.types";
import type { AppliedCouponInterface } from "@features/coupons/types/coupon.interface";

interface CartStore {
  items: CartItem[];
  appliedCoupon: AppliedCouponInterface | null;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCouponInterface) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      appliedCoupon: null,

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === newItem.variantId);
          const newItems = existing
            ? state.items.map((i) =>
                i.variantId === newItem.variantId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i,
              )
            : [...state.items, newItem];
          // Cupom limpo quando carrinho muda — usuário re-aplica
          return { items: newItems, appliedCoupon: null };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
          appliedCoupon: null,
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
          appliedCoupon: null,
        })),

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),

      removeCoupon: () => set({ appliedCoupon: null }),
    }),
    { name: "serena-cart" },
  ),
);
