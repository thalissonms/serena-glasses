import { create } from "zustand";

interface ReviewsOverlayState {
  open: boolean;
  productId: string | null;
  productName: string | null;
}

interface ReviewsOverlayActions {
  openFor: (productId: string, productName: string) => void;
  close: () => void;
}

export const useReviewsOverlay = create<ReviewsOverlayState & ReviewsOverlayActions>((set) => ({
  open: false,
  productId: null,
  productName: null,
  openFor: (productId, productName) => set({ open: true, productId, productName }),
  close: () => set({ open: false }),
}));
