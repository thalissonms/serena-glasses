"use client";

import { AnimatePresence, m } from "framer-motion";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@features/products/utils/formatPrice";
import { useSmartBack } from "@shared/navigation/hooks/useBackIntercept";
import PageInterceptTransition from "@shared/navigation/components/mobile/modals/PageInterceptTransition";
import { CartItem } from "../../types/cart.types";
import ModalNavHeader from "@shared/navigation/components/mobile/modals/ModalNavHeader";

import { useCartStore } from "@features/cart/store/cart.store";
import { ListItemMobile } from "@/shared/components/ui/ListItemMobile";
import ButtonIconY2K from "@/shared/components/ui/ButtonIconY2K";
import clsx from "clsx";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { EmptyListMobile } from "@shared/components/ui/EmptyListMobile";

export default function CartMobileContent() {
  const { t } = useTranslation("checkout");
  const handleBack = useSmartBack("/products");
  const router = useRouter();

  const { items, removeItem, updateQuantity } = useCartStore();

  function changeQty(variantId: string, delta: number) {
    const item = items.find((i) => i.variantId === variantId);
    if (item) updateQuantity(variantId, item.quantity + delta);
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div
      className={clsx("min-h-screen text-brand-black dark:text-brand-white",
        "bg-brand-pink-light/60 dark:bg-brand-dark-surface-0"
      )}
      role="dialog"
      aria-modal="true"
      aria-label={t("cart.title")}
    >
      <ModalNavHeader
        pageToBack={"/products"}
        display={t("cart.title")}
        buttons={{ labelBack: t("cart.back") }}
        Icon={ShoppingCartIcon}
        counter={items.length > 0 ? items.length : undefined}
      />
      <div className="flex flex-col gap-3 p-3 pb-36">
        {items.length === 0 ? (
          <EmptyListMobile
            mainText={t("cart.emptyTitle")}
            subText={t("cart.emptyDesc")}
            icon={<ShoppingBag className="w-16 h-16 text-brand-pink dark:text-brand-pink-light" />}
          />
        ) : (
          <ul
            className="flex flex-col gap-3 list-none p-0 m-0"
            aria-label={t("cart.title")}
          >
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <ListItemMobile
                  key={item.variantId}
                  name={item.name}
                  price={item.price}
                  href={`/products/${item.slug}`}
                  compareAtPrice={item.compareAtPrice}
                  image={{ url: item.image, alt: item.name }}
                  color={item.color}
                  quantity={item.quantity}
                  onChangeQty={(delta) => changeQty(item.variantId, delta)}
                  onSwipeAction={() => removeItem(item.variantId)}
                  icon={
                    <ButtonIconY2K
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.variantId);
                      }}
                      label={`Remover ${item.name} dos favoritos`}
                      icon={Trash2}
                      variant="sm"
                    />
                  }
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <footer className="fixed rounded-t-md bottom-(--nav-bottom-height) left-0 right-0 bg-brand-light-surface-0 dark:bg-brand-dark-surface-1 border-t-2 border-black dark:border-brand-pink shadow-[4px_4px_6px] shadow-black/20 px-3 py-3 z-50 transition-[bottom] duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-3">
            <span className="font-poppins text-xl text-brand-black/75 dark:text-brand-white/75 font-semibold">
              {t("cart.total")}
            </span>
            <span className={clsx("font-jocham text-2xl text-brand-pink dark:text-brand-yellow leading-none",
              "[-webkit-text-stroke:0.5px_rgba(18,18,18,1)] [text-stroke:0.5px_rgba(18,18,18,1)] dark:[-webkit-text-stroke:0.5px_rgba(155,0,255,0.75)] dark:[text-stroke:1.5px_rgba(155,0,255,0.75)]",
            )}>
              {formatPrice(subtotal)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className={clsx(
              "group relative isolate w-full rounded-md border-2 border-brand-pink/90 bg-brand-black/90 py-1.5",
              "dark:border-brand-black/50 dark:bg-brand-pink-light/90 dark:active:border-brand-purple",
              "transition-all duration-300 active:bg-brand-black"
            )}>
            <div className="relative flex h-full w-full items-center justify-center">
              <p className="font-poppins text-lg flex items-center gap-2 font-extrabold tracking-wider text-brand-white/90 uppercase transition-all duration-300 group-active:text-brand-pink dark:text-brand-black/90 dark:group-active:dark:text-brand-purple/90">
                {t("cart.checkout")} <ArrowRight size={16} aria-hidden="true" />
              </p>
            </div>
            <div className="absolute top-0 left-0 -z-1 h-[75%] w-[96%] rounded-t-sm rounded-br-lg bg-brand-white/15" />
            <div className="absolute top-0 left-0 -z-1 h-full w-full rounded-sm border border-t-brand-white/10 border-r-brand-white/25 border-b-brand-white/10 border-l-brand-white/25" />
          </button>
        </footer>
      )}
    </div>
  );
}

