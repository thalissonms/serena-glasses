import { useMutation } from "@tanstack/react-query";
import { toggleProductVariantInStock, updateProductVariantStock } from "../../services/product/productVariantStock.service";

export const useUpdateVariantStock = (variantId: string) => {
  return useMutation({
    mutationFn: async (formData: number) => {
      const qty = formData;
      return updateProductVariantStock(variantId, qty);
    },
  });
};

export const useToggleInVariantStock = (variantId: string) => {
  return useMutation({
    mutationFn: async (formData: boolean) => {
      const next = formData;
      return toggleProductVariantInStock(variantId, next);
    },
  });
};
