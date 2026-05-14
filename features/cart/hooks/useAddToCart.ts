"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@features/cart/store/cart.store";
import type { Product, ProductVariant } from "@features/products/types/product.types";

const ADDED_FEEDBACK_MS = 2000;

interface UseAddToCartResult {
  activeVariant: ProductVariant | undefined;
  inStock: boolean;
  added: boolean;
  addToCart: () => void;
  buyNow: () => void;
}

export function useAddToCart(
  product: Product,
  selectedColorIndex: number,
): UseAddToCartResult {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const uniqueColors = useMemo(
    () =>
      product.variants.filter(
        (v, i, arr) => arr.findIndex((x) => x.color.slug === v.color.slug) === i,
      ),
    [product.variants],
  );

  const activeVariant = uniqueColors[selectedColorIndex] ?? uniqueColors[0];

  const image = useMemo(() => {
    const primaryImage =
      product.images.find((img) => img.isPrimary) ?? product.images[0];
    return activeVariant?.images[0] ?? primaryImage?.url ?? "";
  }, [product.images, activeVariant]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const addToCartSilent = useCallback(() => {
    if (!activeVariant?.inStock) return false;
    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: activeVariant.price ?? product.price,
      compareAtPrice: activeVariant.compareAtPrice ?? product.compareAtPrice,
      quantity: 1,
      image,
      color: activeVariant.color,
    });
    return true;
  }, [activeVariant, addItem, image, product]);

  const addToCart = useCallback(() => {
    if (!addToCartSilent()) return;
    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
  }, [addToCartSilent]);

  const buyNow = useCallback(() => {
    if (!addToCartSilent()) return;
    router.push("/cart");
  }, [addToCartSilent, router]);

  return {
    activeVariant,
    inStock: Boolean(activeVariant?.inStock),
    added,
    addToCart,
    buyNow,
  };
}
