"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const NAV_ITEMS = [
  { href: "/", icon: Home, labelKey: "home" },
  { href: "/products", icon: Search, labelKey: "search" },
  { href: "/cart", icon: ShoppingBag, labelKey: "cart" },
] as const;

export default function NavBottom() {
  const pathname = usePathname();
  const { t } = useTranslation("nav");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-[#030213] border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-label={t(labelKey)}
              className="flex flex-1 items-center justify-center h-full"
            >
              <Icon
                size={26}
                strokeWidth={active ? 2.25 : 1.75}
                className={clsx(
                  "transition-colors currentColor",
                  active
                    ? "text-brand-pink"
                    : "text-neutral-500 dark:text-neutral-400"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
