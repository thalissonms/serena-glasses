import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/cart.types";
import type { AppliedCouponInterface } from "@features/coupons/types/coupon.interface";
import type { ShippingQuoteOption } from "@shared/lib/melhor-envio/types";

interface CartStore {
  items: CartItem[];
  appliedCoupon: AppliedCouponInterface | null;
  selectedShipping: ShippingQuoteOption | null;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCouponInterface) => void;
  removeCoupon: () => void;
  setSelectedShipping: (shipping: ShippingQuoteOption | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      appliedCoupon: null,
      selectedShipping: null,

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
          return { items: newItems, appliedCoupon: null, selectedShipping: null };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
          appliedCoupon: null,
          selectedShipping: null,
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
          appliedCoupon: null,
          selectedShipping: null,
        })),

      clearCart: () => set({ items: [], appliedCoupon: null, selectedShipping: null }),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),

      removeCoupon: () => set({ appliedCoupon: null }),

      setSelectedShipping: (shipping) => set({ selectedShipping: shipping }),
    }),
    { name: "serena-cart" },
  ),
);
