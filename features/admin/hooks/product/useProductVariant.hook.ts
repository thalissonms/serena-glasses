import { useMutation } from "@tanstack/react-query";
import { addVariant, deleteVariant } from "../../services/product/productVariant.service";
import type { VariantAddData } from "../../types/product/productVariantAdd.type";

export function useAddVariant(productId: string) {
  return useMutation({
    mutationFn: async (data: VariantAddData) => {
      return addVariant(productId, data);
    },
  });
}

export function useDeleteVariant() {
  return useMutation({
    mutationFn: async (variantId: string) => {
      return deleteVariant(variantId);
    },
  });
}
