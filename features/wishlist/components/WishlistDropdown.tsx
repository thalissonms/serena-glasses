"use client";
import Image from "next/image";
import { SmartLink } from "@shared/components/SmartLink";
import { Heart, X, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useWishlist,
  useToggleWishlist,
} from "@features/wishlist/hooks/useWishlist";
import { formatPrice } from "@features/products/utils/formatPrice";

export function WishlistDropdown() {
  const { data: items = [], isLoading } = useWishlist();
  const { mutate: toggle } = useToggleWishlist();
  const { t } = useTranslation("nav");

  return (
    <div className="absolute right-0 top-full mt-3 w-80 bg-brand-light-surface-1 dark:bg-brand-dark-surface-1 border-4 border-brand-black shadow-[6px_6px_0px] shadow-brand-black z-50">
      <div className="px-4 pt-4 pb-3 border-b-2 border-brand-black dark:border-brand-white/60 flex items-center justify-between">
        <p className="font-poppins font-black text-base uppercase tracking-wider text-brand-black dark:text-brand-white">
          {t("wishlist")}
        </p>
        <span className="font-poppins text-xs text-brand-black/75 dark:text-brand-white/60">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-brand-black/75 dark:text-brand-white/75 font-poppins">
          Carregando...
        </div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center">
          <Heart
            size={32}
            className="mx-auto mb-3 text-brand-pink/50 dark:text-brand-pink-light/50"
          />
          <p className="font-poppins text-sm text-brand-black/75 dark:text-brand-white/75">
            Nenhum favorito ainda
          </p>
          <p className="font-inter text-xs text-brand-black/60 dark:text-brand-white/40 mt-1">
            Clique no ♡ nos produtos
          </p>
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto divide-y divide-brand-black/20 dark:divide-brand-white/20">
          {items.map((item) => {
            const product = item.products;
            if (!product) return null;
            const image = [...(product.product_images ?? [])].sort(
              (a, b) => a.position - b.position,
            )[0];

            return (
              <div
                key={item.id}
                className="flex gap-3 p-3 hover:bg-brand-pink/10 dark:hover:bg-brand-pink/10 transition-colors duration-300 brand-white/60 group"
              >
                <SmartLink
                  href={`/products/${product.slug}`}
                  className="shrink-0"
                >
                  <div className="relative w-14 h-14 border-2 border-black dark:border-brand-pink/50 bg-brand-pink-light/20 dark:bg-brand-black/50 drop-shadow overflow-hidden">
                    {image && (
                      <Image
                        src={image.url}
                        alt={image.alt ?? product.name}
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    )}
                  </div>
                </SmartLink>

                <SmartLink href={`/products/${product.slug}`} className="w-full flex">
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5 justify-center cursor-pointer">
                    <p className="h-6 font-poppins font-bold text-sm truncate group-hover:text-brand-pink transition-colors duration-300">
                      {product.name}
                    </p>
                    <p className="font-poppins font-semibold text-base text-brand-black/75 group-hover:text-brand-black dark:text-brand-white/75 dark:group-hover:text-brand-white leading-none mt-0.5 transition-colors duration-300">
                      {formatPrice(Math.round(product.price))}
                    </p>
                  </div>
                </SmartLink>

                <button
                  onClick={() =>
                    toggle({ productId: item.product_id, isWishlisted: true })
                  }
                  className="shrink-0 p-1 text-brand-black/80 dark:text-brand-white/80 bg-brand-black/5 dark:bg-brand-black/10 hover:bg-brand-black/15 dark:hover:bg-brand-black/20 hover:text-brand-danger dark:hover:text-brand-danger transition-colors self-start -mt-1 -mr-1 cursor-pointer"
                  aria-label="Remover favorito"
                >
                  <X strokeWidth={2.5} size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="p-3 border-t-2 border-brand-black dark:border-brand-white/60 ">
          <SmartLink
            href="/products"
            className="flex items-center justify-center gap-2 w-full py-3 font-poppins text-xs font-black uppercase tracking-wider border-2 border-brand-black bg-brand-pink/90 hover:bg-brand-pink text-brand-white hover:shadow-[4px_4px_0px] shadow-brand-black transition-all dutarion-300"
          >
            <ShoppingBag size={18} strokeWidth={2.5} />
            Ver todos os produtos
          </SmartLink>
        </div>
      )}
    </div>
  );
}
