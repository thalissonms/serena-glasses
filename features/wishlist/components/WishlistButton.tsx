"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useWishlist, useToggleWishlist } from "@features/wishlist/hooks/useWishlist";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: number;
  tooltip?: boolean;
}

const PARTICLES: { x: number; y: number; rotate: number; scale: number }[] = [
  { x: -28, y: -44, rotate: -25, scale: 0.7 },
  { x: 12,  y: -52, rotate: 10,  scale: 0.9 },
  { x: 42,  y: -22, rotate: 35,  scale: 0.55 },
  { x: -46, y: -10, rotate: -40, scale: 0.65 },
  { x: 38,  y: 16,  rotate: 20,  scale: 0.6 },
  { x: -18, y: 28,  rotate: -12, scale: 0.5 },
  { x: 2,   y: -58, rotate: 5,   scale: 0.8 },
  { x: -34, y: 10,  rotate: -30, scale: 0.45 },
  { x: 24,  y: 38,  rotate: 28,  scale: 0.55 },
];

export function WishlistButton({ productId, className, size = 16, tooltip = true }: WishlistButtonProps) {
  const { t } = useTranslation("wishlist");
  const { data: items = [] } = useWishlist();
  const { mutate: toggle, isPending } = useToggleWishlist();
  const [burst, setBurst] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const isWishlisted = items.some((item) => item.product_id === productId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isWishlisted) {
      setBurst(true);
      setShowTooltip(true);
      setTimeout(() => setBurst(false), 700);
      setTimeout(() => setShowTooltip(false), 2000);
    }
    toggle({ productId, isWishlisted });
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {tooltip && (
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute -top-9 left-1/2 -translate-x-1/2 bg-brand-pink border-2 border-black dark:border-brand-pink-light text-white text-[11px] font-black uppercase tracking-wide px-2.5 py-1 shadow-[2px_4px_0px] shadow-black dark:shadow-brand-blue  whitespace-nowrap pointer-events-none z-50"
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              ♥ {t("button.added")}!!!
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {burst &&
          PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
              initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
              animate={{ opacity: 0, x: p.x, y: p.y, scale: p.scale, rotate: p.rotate }}
              exit={{}}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.025 }}
            >
              <Heart size={11} className="fill-brand-pink text-brand-pink" strokeWidth={0} />
            </motion.div>
          ))}
      </AnimatePresence>

      <button
        aria-label={isWishlisted ? t("button.removeLabel") : t("button.addLabel")}
        onClick={handleClick}
        disabled={isPending}
        className={className}
      >
        <motion.div
          animate={burst ? { scale: [1, 1.4, 0.9, 1.1, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Heart
            size={size}
            strokeWidth={2.5}
            className={isWishlisted ? "fill-brand-pink text-brand-pink" : ""}
          />
        </motion.div>
      </button>
    </div>
  );
}
