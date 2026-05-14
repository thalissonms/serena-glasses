"use client";

import Link from "next/link";
import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@features/cart/store/cart.store";
import { useWishlist } from "@features/wishlist/hooks/useWishlist";
import { WishlistDropdown } from "@features/wishlist/components/WishlistDropdown";
import { ThemeToggle } from "@shared/components/ThemeToggle";
import { MobileNav } from "./mobile/MobileNav";
import { useMounted } from "@shared/hooks/useMounted";

export const NavActions = () => {
  const mounted = useMounted();
  const { t } = useTranslation("nav");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const wishlistRef = useRef<HTMLDivElement>(null);

  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const { data: wishlistItems = [] } = useWishlist();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wishlistRef.current &&
        !wishlistRef.current.contains(e.target as Node)
      ) {
        setIsWishlistOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showWishlistBadge = mounted && wishlistCount > 0;
  const showCartBadge = mounted && itemCount > 0;

  return (
    <>
      <div className="gap-4 hidden md:flex">
        {/* Wishlist */}
        <div ref={wishlistRef} className="relative">
          <button
            onClick={() => setIsWishlistOpen((v) => !v)}
            className="relative group cursor-pointer"
            aria-label={t("wishlist")}
          >
            <div className="absolute inset-0 bg-brand-pink transform rotate-2 group-hover:rotate-3 transition-transform duration-300 border-2 border-black dark:border-brand-pink-light shadow-[4px_4px_0px] shadow-brand-pink-light group-hover:shadow-[6px_6px_0px_#000]" />
            <div className="relative w-12 h-12 bg-brand-pink-light dark:bg-brand-pink-dark border-2 border-black dark:border-brand-pink-light flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
              <Heart
                size={20}
                className={clsx(
                  "text-black group-hover:text-brand-pink dark:text-brand-pink-light dark:group-hover:text-brand-pink transition-all duration-300",
                  isWishlistOpen
                    ? "fill-brand-pink text-brand-pink dark:text-brand-pink-light"
                    : "text-var(--color-foreground) dark:text-brand-pink-light group-hover:text-brand-pink",
                )}
              />
              <div
                className={clsx(
                  "absolute -top-2 -right-2 w-6 h-6 bg-brand-blue dark:bg-brand-pink border-2 border-var(--color-card) dark:border-brand-black-dark rounded-full flex items-center justify-center shadow-[2px_2px_0px] shadow-brand-black-dark dark:shadow-brand-blue transition-opacity duration-300",
                  showWishlistBadge ? "opacity-100" : "opacity-0",
                )}
              >
                <span className="text-xs font-poppins text-brand-black-dark dark:text-brand-pink-dark font-bold">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              </div>
            </div>
          </button>
          {isWishlistOpen && <WishlistDropdown />}
        </div>

        {/* Cart */}
        <Link href="/cart" className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-brand-pink transform rotate-2 group-hover:rotate-3 transition-transform duration-300 border-2 border-black dark:border-brand-pink-light shadow-[4px_4px_0px] shadow-brand-pink-light group-hover:shadow-[6px_6px_0px_#000]" />
          <div className="relative w-12 h-12 bg-brand-pink-light dark:bg-brand-pink-dark border-2 border-black dark:border-brand-pink-light flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
            <ShoppingCart
              size={20}
              className="text-black group-hover:text-brand-pink dark:text-brand-pink-light dark:group-hover:text-brand-pink transition-all duration-300"
            />
            <div
              className={clsx(
                "absolute -top-2 -right-2 w-6 h-6 bg-brand-blue dark:bg-brand-pink border-2 border-var(--color-card) dark:border-brand-black-dark rounded-full flex items-center justify-center shadow-[2px_2px_0px] shadow-brand-black-dark dark:shadow-brand-blue transition-opacity duration-300",
                showCartBadge ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="text-xs font-poppins text-brand-black-dark dark:text-brand-pink-dark font-bold">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </div>
          </div>
        </Link>

        <ThemeToggle />
      </div>

      <button
        className="lg:hidden relative"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={t("menu")}
      >
        {isMenuOpen ? (
          <X size={38} className="text-brand-black-dark dark:text-brand-pink-light" />
        ) : (
          <Menu size={38} className="text-brand-black-dark dark:text-brand-pink-light" />
        )}
      </button>

      {isMenuOpen && <MobileNav />}
    </>
  );
};
