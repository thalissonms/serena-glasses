import { create } from 'zustand';
import { Product } from '../types/product.types';

interface ProductModalState {
  isOpen: boolean;
  selectedProduct: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
}

export const useProductModal = create<ProductModalState>((set) => ({
  isOpen: false,
  selectedProduct: null,
  openModal: (product) => set({ isOpen: true, selectedProduct: product }),
  closeModal: () => set({ isOpen: false, selectedProduct: null }),
}));
