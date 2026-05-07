"use client";
import Link from "next/link";
import { Menu, Search, ShoppingCart, X, Heart, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLogo } from "./NavLogo";
import { NavPages } from "./NavPages";
import { MobileNav } from "./mobile/MobileNav";
import { useCartStore } from "@features/cart/store/cart.store";
import { useWishlist } from "@features/wishlist/hooks/useWishlist";
import { WishlistDropdown } from "@features/wishlist/components/WishlistDropdown";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@shared/components/ThemeToggle";
import Logo from "@shared/components/layout/Logos/Logo";

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("nav");

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

  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <>
      <div className="h-14 md:h-auto bg-brand-pink dark:bg-brand-black-dark py-4 px-14 border-b-3 border-black dark:border-brand-pink-dark shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_#FF00B6] sticky top-0 z-50 hidden md:block">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between">
            <NavLogo />
            <NavPages />
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block group">
                <div className="absolute inset-0 bg-brand-pink-light transform rotate-2 border-2 border-black shadow-[4px_4px_0px_#000]"></div>
                <div className="relative flex items-center bg-brand-pink-light dark:bg-brand-pink-dark border-2 border-black/80 dark:border-brand-pink-light group-focus-within:border-brand-black-dark group-focus-within:dark:border-brand-pink transform -rotate-2 focus-within:rotate-0 transition-all duration-300">
                  <Search
                    className="ml-3 text-black dark:text-brand-pink-light group-focus-within:dark:text-brand-pink group-focus-within:text-brand-pink-dark"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    className="w-32 md:w-48 px-2 py-2 font-poppins uppercase text-xs text-var(--color-foreground) dark:text-var(--color-foreground) placeholder-brand-pink/60 placeholder:font-semibold dark:placeholder:text-brand-pink-light/20 bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="gap-4 hidden md:flex">
                {/* Wishlist */}
                <div ref={wishlistRef} className="relative">
                  <button
                    onClick={() => setIsWishlistOpen((v) => !v)}
                    className="relative group cursor-pointer"
                    aria-label="Favoritos"
                  >
                    <div className="absolute inset-0 bg-brand-pink transform rotate-2 group-hover:rotate-3 transition-transform duration-300 border-2 border-black dark:border-brand-pink-light shadow-[4px_4px_0px] shadow-brand-pink-light group-hover:shadow-[6px_6px_0px_#000]"></div>
                    <div className="relative w-12 h-12 bg-brand-pink-light dark:bg-brand-pink-dark border-2 border-black dark:border-brand-pink-light flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                      <Heart
                        size={20}
                        className={`text-black group-hover:text-brand-pink dark:text-brand-pink-light dark:group-hover:text-brand-pink transition-all duration-300 ${isWishlistOpen ? "fill-brand-pink text-brand-pink dark:text-brand-pink-light" : "text-var(--color-foreground) dark:text-brand-pink-light group-hover:text-brand-pink"}`}
                      />
                      {wishlistCount > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-blue dark:bg-brand-pink border-2 border-var(--color-card) dark:border-brand-black-dark rounded-full flex items-center justify-center shadow-[2px_2px_0px] shadow-brand-black-dark dark:shadow-brand-blue">
                          <span className="text-xs font-poppins text-brand-black-dark dark:text-brand-pink-dark font-bold">
                            {wishlistCount > 99 ? "99+" : wishlistCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                  {isWishlistOpen && <WishlistDropdown />}
                </div>

                {/* Cart */}
                <Link href="/cart" className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-brand-pink transform rotate-2 group-hover:rotate-3 transition-transform duration-300 border-2 border-black dark:border-brand-pink-light shadow-[4px_4px_0px] shadow-brand-pink-light group-hover:shadow-[6px_6px_0px_#000]"></div>
                  <div className="relative w-12 h-12 bg-brand-pink-light dark:bg-brand-pink-dark border-2 border-black dark:border-brand-pink-light flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                    <ShoppingCart
                      size={20}
                      className="text-black group-hover:text-brand-pink dark:text-brand-pink-light dark:group-hover:text-brand-pink transition-all duration-300"
                    />
                    {itemCount > 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-blue dark:bg-brand-pink border-2 border-var(--color-card) dark:border-brand-black-dark rounded-full flex items-center justify-center shadow-[2px_2px_0px] shadow-brand-black-dark dark:shadow-brand-blue">
                        <span className="text-xs font-poppins text-brand-black-dark dark:text-brand-pink-dark font-bold">
                          {itemCount > 99 ? "99+" : itemCount}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <ThemeToggle />
              </div>

              <button
                className="lg:hidden relative"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X
                    size={38}
                    className="text-brand-black-dark dark:text-brand-pink-light"
                  />
                ) : (
                  <Menu
                    size={38}
                    className="text-brand-black-dark dark:text-brand-pink-light"
                  />
                )}
              </button>
            </div>
          </div>
          {isMenuOpen && <MobileNav />}
        </div>
      </div>
      <nav className="w-full text-black dark:text-white transition-colors transition-duration-300 md:hidden absolute top-0 bg-brand-pink-light dark:bg-brand-pink-bg-dark z-50">
        <div className="grid grid-cols-3 items-center justify-center h-fit py-2">
          <div />
          <div className="flex items-center justify-center">
            <Logo className="h-16 text-brand-black-dark dark:text-brand-pink" />
          </div>
          <div className="flex justify-end pr-4">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
};
