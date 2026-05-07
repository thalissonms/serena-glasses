import { create } from "zustand";
import type { Product } from "@features/products/types";

interface StoryViewerState {
  isOpen: boolean;
  products: Product[];
  initialIndex: number;
}

interface StoryViewerActions {
  open: (products: Product[], initialIndex: number) => void;
  close: () => void;
}

export const useStoryViewer = create<StoryViewerState & StoryViewerActions>((set) => ({
  isOpen: false,
  products: [],
  initialIndex: 0,
  open: (products, initialIndex) =>
    set({ isOpen: true, products, initialIndex: Math.max(0, Math.min(initialIndex, products.length - 1)) }),
  close: () => set({ isOpen: false, products: [] }),
}));
