"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useWishlist, useToggleWishlist } from "@features/wishlist/hooks/useWishlist";
import clsx from "clsx";

interface WishlistButtonProps {
  productId: string;
  tooltip?: boolean;
  size?: "default" | "mobile";
}

const PARTICLES: { x: number; y: number; rotate: number; scale: number }[] = [
  { x: -28, y: -44, rotate: -25, scale: 0.7 },
  { x: 12, y: -52, rotate: 10, scale: 0.9 },
  { x: 42, y: -22, rotate: 35, scale: 0.55 },
  { x: -46, y: -10, rotate: -40, scale: 0.65 },
  { x: 38, y: 16, rotate: 20, scale: 0.6 },
  { x: -18, y: 28, rotate: -12, scale: 0.5 },
  { x: 2, y: -58, rotate: 5, scale: 0.8 },
  { x: -34, y: 10, rotate: -30, scale: 0.45 },
  { x: 24, y: 38, rotate: 28, scale: 0.55 },
];

export function WishlistButtonY2K({
  productId,
  tooltip = false,
  size = "default",
}: WishlistButtonProps) {
  const { t } = useTranslation("wishlist");
  const { data: items = [] } = useWishlist();
  const { mutate: toggle, isPending } = useToggleWishlist();
  const [burst, setBurst] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const isMobile = size === "mobile";
  const isWishlisted = items.some((item) => item.product_id === productId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    setPressed(true);
    setTimeout(() => setPressed(false), 150);

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
            <m.div
              className="absolute -top-9 left-1/2 -translate-x-1/2 bg-brand-pink border-2 border-black dark:border-brand-pink-light text-white text-[11px] font-black uppercase tracking-wide px-2.5 py-1 shadow-[2px_4px_0px] shadow-black dark:shadow-brand-blue whitespace-nowrap pointer-events-none z-50"
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              ♥ {t("button.added")}!!!
            </m.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {burst &&
          PARTICLES.map((p, i) => (
            <m.div
              key={i}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
              initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
              animate={{ opacity: 0, x: p.x, y: p.y, scale: p.scale, rotate: p.rotate }}
              exit={{}}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.025 }}
            >
              <Heart size={isMobile ? 9 : 11} className="fill-brand-pink text-brand-pink" strokeWidth={0} />
            </m.div>
          ))}
      </AnimatePresence>

      <button
        aria-label={isWishlisted ? t("button.removeLabel") : t("button.addLabel")}
        onClick={handleClick}
        disabled={isPending}
        className="cursor-pointer"
      >
        <div
          className={clsx(
            "relative isolate rounded-md transition-all duration-150",
            isMobile ? "w-7 h-7" : "w-10 h-10",
            pressed
              ? [
                isMobile ? "border-[2.5px] border-brand-black/80" : "border-4 border-brand-black/80",
                "dark:border-brand-dark-surface-0",
                "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.35)]",
                "dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]",
                isWishlisted
                  ? "bg-brand-pink dark:bg-brand-purple/80"
                  : "bg-brand-pink-light/80 dark:bg-brand-purple/80",
              ]
              : [
                isMobile ? "border-[2.5px] border-brand-black/80 hover:border-brand-black" : "border-4 border-brand-black/80 hover:border-brand-black",
                "dark:border-brand-dark-surface-0",
                isWishlisted
                  ? "bg-brand-pink-light dark:bg-brand-purple"
                  : "bg-brand-pink-light dark:bg-brand-purple",
              ],
          )}
        >
          <div className={clsx("z-3 absolute flex justify-center items-center", isMobile ? "inset-0" : "w-7 h-7 top-0.5 left-0.5")}>
            <m.div
              animate={burst ? { scale: [1, 1.4, 0.9, 1.1, 1] } : {}}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Heart
                className={clsx(
                  "transition-all duration-300",
                  isMobile ? "w-3.5 h-3.5 stroke-3" : "w-4.25 h-4.25 stroke-4",
                  isWishlisted
                    ? "fill-brand-pink text-brand-pink dark:fill-brand-blue/90 dark:text-brand-blue/90"
                    : "text-brand-black/90 dark:text-brand-dark-surface-1/90 group-hover:text-brand-pink dark:group-hover:text-brand-blue/90",
                )}
              />
            </m.div>
          </div>

          <div className={clsx("z-3 absolute flex justify-center items-center", isMobile ? "inset-0" : "w-7 h-7 top-0.5 left-0.5")}>
            <Heart
              className={clsx(
                "blur-lg transition-all duration-300",
                isMobile ? "w-3.5 h-3.5 stroke-3" : "w-4.25 h-4.25 stroke-4",
                isWishlisted
                  ? "text-white dark:text-brand-blue/90"
                  : "text-transparent",
              )}
            />
          </div>

          <div
            className={clsx(
              "z-2 absolute rounded-tl-[3px] rounded-bl-sx rounded-tr-xs rounded-br-sm",
              "bg-brand-light-surface-0/35",
              isMobile ? "w-[85%] h-[85%] left-[1px] top-[1px]" : "w-7 h-7",
              pressed ? "opacity-0" : "opacity-100",
            )}
          />

          <div
            className={clsx(
              "z-1 w-full h-full absolute rounded-[3.25px] transition-all duration-150",
              isMobile ? "border-2" : "border-3",
              pressed
                ? "border-t-brand-black/40 border-l-brand-black/40 border-b-brand-black/10 border-r-brand-black/10"
                : "border-b-brand-black/20 border-r-brand-black/40 border-t-brand-black/20 border-l-brand-black/40",
            )}
          />
        </div>
      </button>
    </div>
  );
}