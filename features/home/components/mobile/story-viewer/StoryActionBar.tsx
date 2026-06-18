"use client";

import { useRouter } from "next/navigation";
import { ArrowRightIcon, MessageCircle, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { HomeStory } from "@features/home/types/homeStory.types";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import { useReviewsOverlay } from "@features/products/hooks/useReviewsOverlay";
import clsx from "clsx";

import { smartShare } from "@shared/utils/smartShare";

async function shareStory(url: string, title: string) {
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}` : url;
  await smartShare(fullUrl, title);
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
    <div className="h-30 flex relative isolate items-end shrink-0 bg-linear-to-t from-brand-pink-bg-dark/80 via-brand-pink-bg-dark/60 to-brand-pink-bg-dark/0">
      <div className="w-full flex items-center justify-between gap-4 px-2 pb-4">
        <div className="flex items-end h-full pt-4 gap-4 pl-4">
          {isProduct && story.productId && (
            <WishlistButton
              productId={story.productId}
              size={28}
              className="text-white hover:text-brand-pink transition-colors cursor-pointer"
            />
          )}

          {/* {isProduct && (
            <button
              aria-label={t("storyViewer.reviews")}
              onClick={handleReviews}
              className="text-white/80 hover:text-brand-pink transition-colors cursor-pointer ml-1"
            >
              <MessageCircle size={28} strokeWidth={2} />
            </button>
          )} */}

          <button
            aria-label={t("storyViewer.share")}
            onClick={() => shareStory(story.ctaUrl, story.title)}
            className="text-white/80 hover:text-brand-pink transition-colors cursor-pointer"
          >
            <Share2 size={28} strokeWidth={2} />
          </button>
        </div>

        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => {
              router.push(story.ctaUrl);
              requestAnimationFrame(onClose);
            }}
            className={clsx(
              "group relative isolate w-[95%] rounded-md border-2 border-brand-white/90 bg-brand-pink/90 py-1",
              "transition-all duration-300 active:bg-brand-black mt-4"
            )}
          >
            <div className="relative flex h-full w-full items-center justify-center gap-2">
              <p className="font-mono text-xl font-extrabold tracking-wider text-brand-white/90 uppercase transition-all duration-300 group-active:text-brand-pink dark:group-active:dark:text-brand-purple/90">
                {story.ctaLabel}
              </p>
              <ArrowRightIcon className="text-white/80 stroke-3" size={20} />
            </div>
            <div className="absolute top-0 left-0 -z-1 h-[75%] w-[96%] rounded-t-sm rounded-br-lg bg-brand-white/15" />
            <div className="absolute top-0 left-0 -z-1 h-full w-full rounded-sm border border-t-brand-white/10 border-r-brand-white/25 border-b-brand-white/10 border-l-brand-white/25" />
          </button>
        </div>
      </div>
      <div className="-z-1 absolute bg-linear-to-t from-brand-black via-brand-black/75 to-transparent h-[80%] w-full" />
    </div>
  );
}
