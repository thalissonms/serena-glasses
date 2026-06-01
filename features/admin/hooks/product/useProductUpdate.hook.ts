import { useMutation } from "@tanstack/react-query";
import { mapProductDetailsPayload } from "../../mappers/productDetails.mapper";
import { ProductDetailsFormData } from "../../types/product/productDetailsFormData.type";
import { updateProduct } from "../../services/product/productDetails.service";

export function useUpdateProduct(
  productId: string,
) {
  return useMutation({
    mutationFn: async (
      formData: ProductDetailsFormData,
    ) => {
      const payload =
        mapProductDetailsPayload(formData);

      return updateProduct(
        productId,
        payload,
      );
    },
  });
}