"use client";
import Image from "next/image";
import { SmartLink } from "@shared/components/SmartLink";
import { Heart, X, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useWishlist, useToggleWishlist } from "@features/wishlist/hooks/useWishlist";
import { formatPrice } from "@features/products/utils/formatPrice";

export function WishlistDropdown() {
  const { data: items = [], isLoading } = useWishlist();
  const { mutate: toggle } = useToggleWishlist();
  const { t } = useTranslation("nav");

  return (
    <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-[#1a1a1a] border-4 border-black dark:border-brand-pink-light shadow-[6px_6px_0px] shadow-brand-pink-light z-50">
      <div className="p-4 border-b-2 border-black dark:border-brand-pink-light flex items-center justify-between">
        <p className="font-poppins font-black text-sm uppercase tracking-wider dark:text-white">
          {t("wishlist")}
        </p>
        <span className="font-poppins text-xs text-gray-400 dark:text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500 font-poppins">
          Carregando...
        </div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center">
          <Heart size={32} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
          <p className="font-poppins text-sm text-gray-400 dark:text-gray-500">Nenhum favorito ainda</p>
          <p className="font-inter text-xs text-gray-300 dark:text-gray-600 mt-1">Clique no ♡ nos produtos</p>
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-brand-pink/20">
          {items.map((item) => {
            const product = item.products;
            if (!product) return null;
            const image = [...(product.product_images ?? [])]
              .sort((a, b) => a.position - b.position)[0];

            return (
              <div key={item.id} className="flex gap-3 p-3 hover:bg-pink-50/40 dark:hover:bg-brand-pink/10 transition-colors">
                <SmartLink href={`/products/${product.slug}`} className="shrink-0">
                  <div className="relative w-14 h-14 border-2 border-black dark:border-brand-pink/50 bg-pink-50 dark:bg-[#0a0a0a] overflow-hidden">
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

                <div className="flex-1 min-w-0">
                  <SmartLink href={`/products/${product.slug}`}>
                    <p className="font-poppins font-bold text-xs truncate hover:text-brand-pink transition-colors">
                      {product.name}
                    </p>
                  </SmartLink>
                  <p className="font-poppins font-semibold text-lg text-brand-pink leading-none mt-0.5">
                    {formatPrice(Math.round(product.price))}
                  </p>
                </div>

                <button
                  onClick={() => toggle({ productId: item.product_id, isWishlisted: true })}
                  className="shrink-0 p-1 text-gray-400 dark:text-gray-500 hover:text-brand-pink transition-colors self-start mt-1"
                  aria-label="Remover favorito"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="p-3 border-t-2 border-black dark:border-brand-pink/50">
          <a
            href="/products"
            className="flex items-center justify-center gap-2 w-full py-3 font-poppins text-xs font-black uppercase tracking-wider border-2 border-black dark:border-brand-pink bg-brand-pink text-white hover:shadow-[4px_4px_0px_#000] transition-all"
          >
            <ShoppingBag size={14} />
            Ver todos os produtos
          </a>
        </div>
      )}
    </div>
  );
}
