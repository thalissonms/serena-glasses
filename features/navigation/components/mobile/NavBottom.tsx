"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@features/cart/store/cart.store";
import { useWishlist } from "@features/wishlist/hooks/useWishlist";

const NAV_ITEMS = [
  { href: "/", icon: Home, labelKey: "home", badge: false },
  { href: "/search", icon: Search, labelKey: "search", badge: false },
  { href: "/wishlist", icon: Heart, labelKey: "wishlist", badge: true },
  { href: "/cart", icon: ShoppingBag, labelKey: "cart", badge: true },
] as const;

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-pink text-white text-[9px] font-black flex items-center justify-center border border-white dark:border-[#030213]"
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export default function NavBottom() {
  const pathname = usePathname();
  const { t } = useTranslation("nav");
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { data: wishlist = [] } = useWishlist();

  const counts: Record<string, number> = {
    "/cart": cartCount,
    "/wishlist": wishlist.length,
  };

  return (
    <nav
      aria-label={t("mainNavigation")}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-[#030213] border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
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
                    active ? "text-brand-pink" : "text-neutral-500 dark:text-neutral-400",
                  )}
                />
                <Badge count={count} />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
