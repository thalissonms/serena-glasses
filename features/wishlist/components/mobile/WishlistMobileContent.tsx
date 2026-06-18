"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, HeartCrack, HeartMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWishlist, useToggleWishlist } from "@features/wishlist/hooks/useWishlist";
import { useTranslation } from "react-i18next";
import { useSmartBack } from "@shared/navigation/hooks/useBackIntercept";
import { HeartIcon } from "@heroicons/react/24/solid";
import ModalNavHeader from "@shared/navigation/components/mobile/modals/ModalNavHeader";
import { ListItemMobile } from "@shared/components/ui/ListItemMobile";
import ButtonIconY2K from "@shared/components/ui/ButtonIconY2K";
import { EmptyListMobile } from "@shared/components/ui/EmptyListMobile";

function SkeletonCard() {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 bg-white dark:bg-[#1a1a1a] border-2 border-black/10 dark:border-brand-pink/10 p-3 animate-pulse">
      <div className="aspect-square bg-brand-pink/10" />
      <div className="flex flex-col gap-2 py-1">
        <div className="h-3 bg-brand-pink/10 rounded-none w-3/4" />
        <div className="h-4 bg-brand-pink/15 rounded-none w-1/3" />
        <div className="h-8 bg-brand-pink/10 rounded-none mt-auto" />
      </div>
    </div>
  );
}

export default function WishlistMobileContent() {
  const { t } = useTranslation("wishlist");
  const handleBack = useSmartBack("/");
  const router = useRouter();
  const { data: items = [], isLoading } = useWishlist();
  const { mutate: toggle } = useToggleWishlist();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const validItems = items.filter((item) => item.products !== null);

  return (
    <div
      className="min-h-screen bg-brand-pink-light/60 dark:bg-brand-dark-surface-0 text-black dark:text-white"
      role="region"
      aria-label={t("ariaLabel")}
    >
      <ModalNavHeader
        pageToBack="/"
        onBack={handleBack}
        display={t("title")}
        Icon={HeartIcon}
        counter={validItems.length}
        buttons={{ labelBack: t("back") }}
      />

      {/* Content */}
      <div className="flex flex-col gap-3 p-3 pb-24">
        {!mounted || isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : validItems.length === 0 ? (
          <EmptyListMobile
            mainText={t("empty.title")}
            icon={<HeartCrack className="w-16 h-16 text-brand-pink dark:text-brand-pink-light" />}
            subText={t("empty.description")}
          />
        ) : (
          <ul className="flex flex-col gap-3 list-none p-0 m-0" aria-label={t("listAriaLabel")}>
            <AnimatePresence initial={false}>
              {validItems.map((item, idx) => {
                const product = item.products!;
                const img = [...product.product_images]
                  .sort((a, b) => a.position - b.position)[0];

                return (
                  <ListItemMobile
                    key={item.id}
                    href={`/products/${product.slug}`}
                    name={product.name}
                    price={product.price}
                    compareAtPrice={product.compare_at_price}
                    image={img ? { url: img.url, alt: img.alt } : null}
                    index={idx}
                    onSwipeAction={() => toggle({ productId: item.product_id, isWishlisted: true })}
                    icon={
                      <ButtonIconY2K
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggle({ productId: item.product_id, isWishlisted: true });
                        }}
                        label={t("removeAriaLabel", { name: product.name })}
                        icon={HeartMinus}
                        variant="sm"
                      />
                    }
                  />
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
