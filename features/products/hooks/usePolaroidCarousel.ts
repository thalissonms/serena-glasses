import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { ProductImage } from "@features/products/types/product.types";
import { useWishlist, useToggleWishlist } from "@features/wishlist/hooks/useWishlist";
import { useSwipe } from "./useSwipe";
import { usePinchZoom } from "./usePinchZoom";
import { useDoubleTap } from "./useDoubleTap";

const WISHLIST_BURST_MS = 700;

export interface UsePolaroidCarouselReturn {
  sortedImages: ProductImage[];
  currentIndex: number;
  currentImage: ProductImage | undefined;
  swipeDirection: number;
  zoomScale: number;
  isZooming: boolean;
  wishlistBurst: boolean;
  isWishlisted: boolean;
  imageContainerRef: React.RefObject<HTMLDivElement | null>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  handleDoubleTap: () => void;
}

export function usePolaroidCarousel(images: ProductImage[], productId: string): UsePolaroidCarouselReturn {
  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.order - b.order),
    [images],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(0);

  // --- Swipe ---
  const onNext = useCallback(() => {
    setSwipeDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, sortedImages.length - 1));
  }, [sortedImages.length]);

  const onPrev = useCallback(() => {
    setSwipeDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const swipe = useSwipe(onNext, onPrev);

  // --- Pinch Zoom ---
  const zoom = usePinchZoom();

  // --- Double-tap wishlist ---
  const { data: wishlistItems = [] } = useWishlist();
  const { mutate: toggleWishlist } = useToggleWishlist();
  const isWishlisted = wishlistItems.some((item) => item.product_id === productId);
  const [wishlistBurst, setWishlistBurst] = useState(false);
  const burstTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doWishlistToggle = useCallback(() => {
    if (!isWishlisted) {
      setWishlistBurst(true);
      if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
      burstTimeoutRef.current = setTimeout(() => setWishlistBurst(false), WISHLIST_BURST_MS);
    }
    toggleWishlist({ productId, isWishlisted });
  }, [isWishlisted, productId, toggleWishlist]);

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    };
  }, []);

  const handleDoubleTap = useDoubleTap(doWishlistToggle);

  // Compose touch handlers from swipe and zoom
  const { onTouchStart: swipeTouchStart, onTouchEnd: swipeTouchEnd } = swipe;
  const { onTouchStart: zoomTouchStart, onTouchEnd: zoomTouchEnd } = zoom;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    swipeTouchStart(e);
    zoomTouchStart(e);
  }, [swipeTouchStart, zoomTouchStart]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    swipeTouchEnd(e);
    zoomTouchEnd(e);
  }, [swipeTouchEnd, zoomTouchEnd]);

  return {
    sortedImages,
    currentIndex,
    currentImage: sortedImages[currentIndex] ?? sortedImages[0],
    swipeDirection,
    zoomScale: zoom.scale,
    isZooming: zoom.isZooming,
    wishlistBurst,
    isWishlisted,
    imageContainerRef: zoom.containerRef,
    handleTouchStart,
    handleTouchEnd,
    handleDoubleTap,
  };
}
