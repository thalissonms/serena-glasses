"use client";

import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@features/cart/store/cart.store";
import { useWishlist } from "@features/wishlist/hooks/useWishlist";
import { WishlistDropdown } from "@features/wishlist/components/WishlistDropdown";
import { ThemeToggle } from "@shared/components/ThemeToggle";
import { MobileNav } from "./mobile/MobileNav";
import { useMounted } from "@shared/hooks/useMounted";
import ButtonIconY2K, { ButtonNavActionProps } from "../../components/ui/ButtonIconY2K";






// ─── NavActions ──────────────────────────────────────────────────────────────

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
      if (wishlistRef.current && !wishlistRef.current.contains(e.target as Node)) {
        setIsWishlistOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const simpleButtons: ButtonNavActionProps[] = [
    {
      icon: ShoppingCart,
      label: t("cart"),
      badge: mounted ? itemCount : 0,
      href: "/cart",
    },
  ];

  return (
    <>
      <div className="gap-3 hidden md:flex items-center ml-4">

        {/* Wishlist — caso especial: tem dropdown + ref */}
        <div ref={wishlistRef} className="relative flex items-center">
          <ButtonIconY2K
            icon={Heart}
            label={t("wishlist")}
            badge={mounted ? wishlistCount : 0}
            isActive={isWishlistOpen}
            onClick={() => setIsWishlistOpen((v) => !v)}
          />
          {isWishlistOpen && <WishlistDropdown />}
        </div>

        {/* Demais botões sem dropdown */}
        {simpleButtons.map((btn) => (
          <ButtonIconY2K key={btn.label} {...btn} />
        ))}

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