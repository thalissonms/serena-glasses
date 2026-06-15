import { useMutation } from "@tanstack/react-query";
import { type SeoPayload, updateSeo } from "../../services/product/productSeo.service";

export function useUpdateSeo(productId: string) {
  return useMutation({
    mutationFn: async (payload: SeoPayload) => {
      return updateSeo(productId, payload);
    },
  });
}
