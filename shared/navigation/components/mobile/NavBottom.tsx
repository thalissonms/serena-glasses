"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@features/cart/store/cart.store";
import { useWishlist } from "@features/wishlist/hooks/useWishlist";
import { useEffect } from "react";
import BadgeCounter from "../BadgeCounter";

const NAV_ITEMS = [
  { href: "/", secHref: "/products", icon: Home, labelKey: "home", badge: false },
  { href: "/search", secHref: "", icon: Search, labelKey: "search", badge: false },
  { href: "/wishlist", secHref: "", icon: Heart, labelKey: "wishlist", badge: true },
  { href: "/cart", secHref: "/checkout", icon: ShoppingBag, labelKey: "cart", badge: true },
] as const;

export default function NavBottom() {
  const pathname = usePathname();
  const { t } = useTranslation("nav");
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { data: wishlist = [] } = useWishlist();

  const isProductPage = pathname.startsWith("/products/") && pathname.split("/").length >= 3;

  useEffect(() => {
    if (isProductPage) {
      document.body.classList.remove("has-nav-bottom");
      return;
    }
    document.body.classList.add("has-nav-bottom");
    return () => document.body.classList.remove("has-nav-bottom");
  }, [isProductPage]);

  if (isProductPage) return null;

  const counts: Record<string, number> = {
    "/cart": cartCount,
    "/wishlist": wishlist.length,
  };

  return (
    <nav
      aria-label={t("mainNavigation")}
      className="fixed bottom-0 left-0 right-0 z-200 md:hidden bg-brand-light-surface-2 dark:bg-brand-dark-surface-1 border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map(({ href, secHref, icon: Icon, labelKey }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href)) || pathname === secHref
          const count = counts[href] ?? 0;

          return (
            <Link
              key={href}
              href={href}
              aria-label={`${t(labelKey, { defaultValue: labelKey })}${count > 0 ? ` (${count})` : ""}`}
              className="flex flex-1 items-center justify-center h-full"
            >
              <div className="relative">
                <Icon
                  size={26}
                  strokeWidth={active ? 2.25 : 1.75}
                  className={clsx(
                    "transition-colors",
                    active ? "text-brand-pink" : "text-brand-black/60 dark:text-brand-white/60",
                  )}
                />
                <BadgeCounter count={count} />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
