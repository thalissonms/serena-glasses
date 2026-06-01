"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { HomeStory } from "@features/home/types/homeStory.types";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import { useReviewsOverlay } from "@features/products/hooks/useReviewsOverlay";

async function shareStory(url: string, title: string) {
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}` : url;
  if (navigator.share) {
    try { await navigator.share({ title, url: fullUrl }); return; } catch {}
  }
  await navigator.clipboard.writeText(fullUrl).catch(() => {});
}

interface StoryActionBarProps {
  story: HomeStory;
  onClose: () => void;
}

export function StoryActionBar({ story, onClose }: StoryActionBarProps) {
  const { t } = useTranslation("home");
  const router = useRouter();
  const openReviews = useReviewsOverlay((s) => s.openFor);

  const isProduct = story.kind === "product" && !!story.productId;

  function handleReviews() {
    if (!isProduct || !story.productId) return;
    onClose();
    requestAnimationFrame(() => {
      openReviews(story.productId!, story.productName ?? story.title);
    });
  }

  return (
    <div className="h-30 flex items-center justify-between px-4 gap-6 shrink-0 bg-linear-to-t from-brand-pink-bg-dark/80 via-brand-pink-bg-dark/60 to-brand-pink-bg-dark/0">
      <div className="flex items-center pt-5 h-full gap-3">
        {isProduct && story.productId && (
          <WishlistButton
            productId={story.productId}
            size={28}
            className="text-white hover:text-brand-pink transition-colors cursor-pointer"
          />
        )}

        {isProduct && (
          <button
            aria-label={t("storyViewer.reviews")}
            onClick={handleReviews}
            className="text-white/80 hover:text-brand-pink transition-colors cursor-pointer ml-1"
          >
            <MessageCircle size={28} strokeWidth={2} />
          </button>
        )}

        <button
          aria-label={t("storyViewer.share")}
          onClick={() => shareStory(story.ctaUrl, story.title)}
          className="text-white/80 hover:text-brand-pink transition-colors cursor-pointer"
        >
          <Share2 size={28} strokeWidth={2} />
        </button>
      </div>

      <div className="w-full pl-2">
        <button
          type="button"
          onClick={() => {
            router.push(story.ctaUrl);
            requestAnimationFrame(onClose);
          }}
          className="flex items-center justify-center gap-2 w-full py-3 bg-brand-pink border-2 border-black shadow-[4px_4px_0] shadow-brand-blue font-poppins font-bold uppercase tracking-wide text-white text-sm active:shadow-[2px_2px_0] transition-all cursor-pointer"
        >
          {story.ctaLabel} →
        </button>
      </div>
    </div>
  );
}
