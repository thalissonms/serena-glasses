import { useMutation } from "@tanstack/react-query";
import { createProduct } from "../../services/product/productCreate.service";
import { mapProductCreateFormDataToPayload } from "../../mappers/productCreate.mapper";
import type { ProductCreateFormData } from "../../types/product/productCreateFormData.type";

export function useProductCreate() {
  return useMutation({
    mutationFn: async (data: ProductCreateFormData) => {
      const payloads = mapProductCreateFormDataToPayload(data);
      return createProduct(payloads);
    },
  });
}
