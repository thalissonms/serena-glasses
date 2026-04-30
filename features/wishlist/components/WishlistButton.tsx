"use client";
import { Heart } from "lucide-react";
import { useWishlist, useToggleWishlist } from "@features/wishlist/hooks/useWishlist";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: number;
}

export function WishlistButton({ productId, className, size = 16 }: WishlistButtonProps) {
  const { data: items = [] } = useWishlist();
  const { mutate: toggle, isPending } = useToggleWishlist();

  const isWishlisted = items.some((item) => item.product_id === productId);

  return (
    <button
      aria-label={isWishlisted ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ productId, isWishlisted });
      }}
      disabled={isPending}
      className={className}
    >
      <Heart
        size={size}
        strokeWidth={2.5}
        className={isWishlisted ? "fill-brand-pink text-brand-pink" : ""}
      />
    </button>
  );
}
