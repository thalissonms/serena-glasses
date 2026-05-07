"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/products", icon: Search, label: "Buscar" },
  { href: "/wishlist", icon: Heart, label: "Favoritos" },
  { href: "/cart", icon: ShoppingBag, label: "Sacola" },
  { href: "/account", icon: User, label: "Perfil" },
];

export default function NavBottom() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-[#030213] border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
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
