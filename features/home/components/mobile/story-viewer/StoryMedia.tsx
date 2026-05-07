"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { HomeStory } from "@features/home/types/homeStory.types";
import { useDoubleTap } from "@features/products/hooks/useDoubleTap";
import { useSwipe } from "@features/products/hooks/useSwipe";
import { useWishlist, useToggleWishlist } from "@features/wishlist/hooks/useWishlist";

interface StoryMediaProps {
  story: HomeStory;
  onPrev: () => void;
  onNext: () => void;
  onPauseChange: (paused: boolean) => void;
  onDurationChange?: (ms: number) => void;
}

export function StoryMedia({ story, onPrev, onNext, onPauseChange, onDurationChange }: StoryMediaProps) {
  const { t } = useTranslation("home");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showBurst, setShowBurst] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { data: wishlistItems = [] } = useWishlist();
  const { mutate: toggle } = useToggleWishlist();

  const isProduct = story.kind === "product" && !!story.productId;
  const isWishlisted = wishlistItems.some((item) => item.product_id === story.productId);

  useEffect(() => {
    setHasError(false);
  }, [story.id]);

  function handleWishlist() {
    if (!isProduct || !story.productId) return;
    toggle({ productId: story.productId, isWishlisted });
    if (!isWishlisted) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 700);
    }
  }

  const tapForWishlist = useDoubleTap(handleWishlist);
  const { onTouchStart, onTouchEnd } = useSwipe(onNext, onPrev, 60);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(longPressRef.current), []);

  const handlePointerDown = () => {
    onPauseChange(true);
    longPressRef.current = setTimeout(() => {
      videoRef.current?.pause();
    }, 200);
  };

  const handlePointerRelease = () => {
    clearTimeout(longPressRef.current);
    onPauseChange(false);
    const v = videoRef.current;
    if (v?.paused) v.play().catch(() => {});
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v || story.mediaType !== "video") return;
    let cancelled = false;
    const tryPlay = async () => {
      try {
        await v.play();
      } catch (err) {
        if (cancelled) return;
        if ((err as DOMException).name !== "AbortError") setHasError(true);
      }
    };
    tryPlay();
    return () => {
      cancelled = true;
      v.pause();
    };
  }, [story.mediaType, story.mediaUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onWaiting = () => onPauseChange(true);
    const onPlaying = () => onPauseChange(false);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("stalled", onWaiting);
    v.addEventListener("playing", onPlaying);
    return () => {
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("stalled", onWaiting);
      v.removeEventListener("playing", onPlaying);
    };
  }, [onPauseChange]);

  return (
    <div
      className="absolute inset-0 bg-black overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerRelease}
      onPointerLeave={handlePointerRelease}
      onPointerCancel={handlePointerRelease}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Poster / imagem base */}
      {(story.posterUrl ?? (story.mediaType === "image" ? story.mediaUrl : null)) && (
        <Image
          src={(story.posterUrl ?? story.mediaUrl)!}
          alt={story.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}

      {story.mediaType === "video" && !hasError && (
        <video
          ref={videoRef}
          src={story.mediaUrl}
          preload="metadata"
          muted
          playsInline
          loop
          onLoadedMetadata={(e) => onDurationChange?.((e.currentTarget.duration || 5) * 1000)}
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {isProduct && !story.productInStock && (
        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center z-10 pointer-events-none">
          <span className="text-white text-xl font-shrikhand -rotate-6 tracking-widest drop-shadow-lg">
            {t("storyViewer.soldOut")}
          </span>
        </div>
      )}

      <div className="absolute bottom-4 inset-x-0 px-4 z-10 pointer-events-none">
        <p className="text-white font-shrikhand text-lg text-center drop-shadow-lg truncate">
          {story.title}
        </p>
        {story.subtitle && (
          <p className="text-white/70 text-xs text-center font-aisha italic mt-0.5 line-clamp-2">
            {story.subtitle}
          </p>
        )}
      </div>

      {/* Tap zone — prev (30%) */}
      <button
        type="button"
        aria-label={t("storyViewer.tapLeft")}
        onClick={() => { tapForWishlist(); onPrev(); }}
        className="absolute inset-y-0 left-0 w-[30%] z-20 bg-transparent cursor-default"
      />

      {/* Tap zone — next (70%) */}
      <button
        type="button"
        aria-label={t("storyViewer.tapRight")}
        onClick={() => { tapForWishlist(); onNext(); }}
        className="absolute inset-y-0 right-0 w-[70%] z-20 bg-transparent cursor-default"
      />

      <AnimatePresence>
        {showBurst && (
          <motion.div
            key="burst"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 1 }}
            exit={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <Heart
              size={120}
              className="text-brand-pink fill-brand-pink drop-shadow-[0_4px_12px_rgba(255,0,182,0.6)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
