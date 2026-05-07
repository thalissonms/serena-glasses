"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import { useReviewsOverlay } from "@features/products/hooks/useReviewsOverlay";
import { shareProduct } from "@features/products/utils/polaroidCard.utils";

interface StoryActionBarProps {
  product: Product;
  /** Fecha o StoryViewer — necessário antes de abrir outros overlays (ReviewsOverlay é z-50, viewer é z-61). */
  onClose: () => void;
}

/**
 * Barra de ações do StoryViewer — equivalente às ações abaixo do vídeo no Instagram.
 *
 * ♥ WishlistButton — reutiliza burst + tooltip já implementados
 * 💬 Reviews — fecha o viewer e abre o ReviewsOverlay (já montado em layout.tsx)
 * Share — Web Share API com fallback para clipboard
 * CTA "Comentar" — navega para /products/[slug] e fecha o viewer
 */
export function StoryActionBar({ product, onClose }: StoryActionBarProps) {
  const { t } = useTranslation("home");
  const router = useRouter();
  const openReviews = useReviewsOverlay((s) => s.openFor);

  function handleReviews() {
    onClose();
    requestAnimationFrame(() => {
      openReviews(product.id, product.name);
    });
  }

  return (
    <div className="h-30 flex items-center justify-between px-4 gap-6 shrink-0 bg-linear-to-t from-brand-pink-bg-dark/80 via-brand-pink-bg-dark/60 to-brand-pink-bg-dark/0">
      <div className="flex items-center pt-5 h-full gap-3">
        <WishlistButton
          productId={product.id}
          size={28}
          className="text-white hover:text-brand-pink transition-colors cursor-pointer"
        />

        <button
          aria-label={t("storyViewer.reviews")}
          onClick={handleReviews}
          className="text-white/80 hover:text-brand-pink transition-colors cursor-pointer ml-1"
        >
          <MessageCircle size={28} strokeWidth={2} />
        </button>

        <button
          aria-label={t("storyViewer.share")}
          onClick={() => shareProduct(product.slug, product.name)}
          className="text-white/80 hover:text-brand-pink transition-colors cursor-pointer"
        >
          <Share2 size={28} strokeWidth={2} />
        </button>
      </div>
      <div className="w-full pl-2">
        <button
          type="button"
          onClick={() => {
            router.push(`/products/${product.slug}`);
            requestAnimationFrame(onClose);
          }}
          className="flex items-center justify-center gap-2 w-full py-3 bg-brand-pink border-2 border-black shadow-[4px_4px_0] shadow-brand-blue font-poppins font-bold uppercase tracking-wide text-white text-sm active:shadow-[2px_2px_0] transition-all cursor-pointer"
        >
          {t("storyViewer.comment")} →
        </button>
      </div>
    </div>
  );
}
