"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnonymousId } from "@shared/utils/anonymousId";

export type WishlistItem = {
  id: string;
  product_id: string;
  products: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compare_at_price: number | null;
    product_images: { url: string; alt: string | null; position: number }[];
  } | null;
};

const KEY = "wishlist";

export function useWishlist() {
  const anonymousId = getAnonymousId();

  return useQuery<WishlistItem[]>({
    queryKey: [KEY, anonymousId],
    queryFn: async () => {
      if (!anonymousId) return [];
      const res = await fetch(`/api/wishlist?anonymous_id=${anonymousId}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!anonymousId,
    staleTime: 30_000,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const anonymousId = getAnonymousId();
  const queryKey = [KEY, anonymousId];

  return useMutation({
    mutationFn: async ({
      productId,
      isWishlisted,
    }: {
      productId: string;
      isWishlisted: boolean;
    }) => {
      const res = await fetch("/api/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonymous_id: anonymousId, product_id: productId }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar favoritos");
    },
    onMutate: async ({ productId, isWishlisted }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<WishlistItem[]>(queryKey);

      queryClient.setQueryData<WishlistItem[]>(queryKey, (old = []) =>
        isWishlisted
          ? old.filter((i) => i.product_id !== productId)
          : [...old, { id: "optimistic", product_id: productId, products: null }],
      );

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
