"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWishlist, useToggleWishlist } from "@features/wishlist/hooks/useWishlist";
import { formatPrice } from "@features/products/utils/formatPrice";
import { useSmartBack } from "@features/navigation/hooks/useBackIntercept";

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
  const handleBack = useSmartBack("/products");
  const router = useRouter();
  const { data: items = [], isLoading } = useWishlist();
  const { mutate: toggle } = useToggleWishlist();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const validItems = items.filter((item) => item.products !== null);

  return (
    <div
      className="min-h-screen bg-[#FFF0FA] dark:bg-[#0a0a0a] text-black dark:text-white"
      role="region"
      aria-label="Seus favoritos"
    >
      {/* Sticky header */}
      <header className="w-full h-16 flex items-center bg-brand-pink/25 backdrop-blur-3xl sticky top-0 py-2 px-0.5 border-b-2 border-brand-pink/40 border-dashed z-50">
        <button
          type="button"
          className="p-2 cursor-pointer"
          onClick={handleBack}
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-black dark:text-white" strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-2">
          <Heart size={16} fill="currentColor" className="text-brand-pink" aria-hidden="true" />
          <h1 className="font-jocham text-[26px] tracking-wide text-black dark:text-white leading-none">
            FAVORITOS
          </h1>
          <Heart size={16} fill="currentColor" className="text-brand-pink" aria-hidden="true" />
        </div>

        <div className="w-12 flex items-center justify-center">
          {validItems.length > 0 && (
            <span
              className="w-6 h-6 rounded-full bg-brand-pink text-white text-xs font-black flex items-center justify-center border-2 border-white/40"
              aria-label={`${validItems.length} favoritos`}
            >
              {validItems.length > 9 ? "9+" : validItems.length}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col gap-3 p-3 pb-24">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : validItems.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center">
            <div className="relative">
              {/* Decorative rotated back layer */}
              <div className="absolute inset-0 bg-brand-pink transform rotate-[3deg] border-4 border-black" />
              <div className="absolute inset-0 bg-brand-pink-light transform rotate-[1.5deg] border-4 border-black" />
              {/* Main box */}
              <div className="relative border-4 border-black shadow-[6px_6px_0_#000] bg-white dark:bg-[#1a1a1a] px-10 py-8">
                <Heart
                  size={56}
                  strokeWidth={1.5}
                  className="text-brand-pink/40 mx-auto"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div>
              <p className="font-poppins text-[10px] uppercase tracking-[0.4em] text-brand-pink/60 mb-2">
                ✦ Serena Glasses ✦
              </p>
              <h2 className="font-jocham text-3xl uppercase text-black dark:text-white leading-none mb-3">
                Lista Vazia
              </h2>
              <p className="font-poppins text-sm text-black/50 dark:text-white/40 max-w-xs">
                Salve os óculos que você adorou enquanto explora nossa coleção.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/products")}
              className="flex items-center gap-2 font-poppins font-black text-xs uppercase tracking-widest text-white bg-brand-pink border-2 border-black px-6 py-3 shadow-[4px_4px_0_#000] active:shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all cursor-pointer"
            >
              Explorar coleção <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        ) : (
          /* Item list */
          <ul className="flex flex-col gap-3 list-none p-0 m-0" aria-label="Produtos favoritos">
            <AnimatePresence initial={false}>
              {validItems.map((item) => {
                const product = item.products!;
                const img = [...product.product_images]
                  .sort((a, b) => a.position - b.position)[0];

                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
                    className="grid grid-cols-[80px_1fr] gap-3 bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#FF00B6] p-3"
                  >
                    {/* Product image */}
                    <a
                      href={`/products/${product.slug}`}
                      aria-label={`Ver ${product.name}`}
                      tabIndex={-1}
                    >
                      <div className="relative aspect-square border-2 border-black dark:border-brand-pink/50 overflow-hidden bg-pink-50 dark:bg-[#0a0a0a]">
                        {img ? (
                          <Image
                            src={img.url}
                            alt={img.alt ?? product.name}
                            fill
                            sizes="80px"
                            className="object-contain p-1.5"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center font-jocham text-brand-pink/20 text-2xl">
                            ✦
                          </span>
                        )}
                      </div>
                    </a>

                    {/* Info + actions */}
                    <div className="flex flex-col justify-between gap-2 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <a href={`/products/${product.slug}`}>
                            <p className="font-poppins font-bold text-sm text-black dark:text-white line-clamp-2 leading-snug hover:text-brand-pink transition-colors">
                              {product.name}
                            </p>
                          </a>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-yellowtail text-xl text-brand-pink leading-none">
                              {formatPrice(product.price)}
                            </span>
                            {product.compare_at_price && (
                              <span className="text-[10px] text-gray-400 font-inter line-through leading-none">
                                {formatPrice(product.compare_at_price)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove from wishlist */}
                        <button
                          type="button"
                          onClick={() =>
                            toggle({ productId: item.product_id, isWishlisted: true })
                          }
                          aria-label={`Remover ${product.name} dos favoritos`}
                          className="p-1.5 border border-black dark:border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-colors shrink-0 cursor-pointer"
                        >
                          <Heart size={12} fill="currentColor" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Ver produto CTA */}
                      <a
                        href={`/products/${product.slug}`}
                        className="flex items-center justify-center gap-1.5 w-full py-2 font-poppins text-[11px] font-black uppercase tracking-wider border-2 border-black dark:border-brand-pink text-black dark:text-white hover:bg-brand-pink hover:text-white hover:border-brand-pink shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#FF00B6] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      >
                        Ver produto <ArrowRight size={10} aria-hidden="true" />
                      </a>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
