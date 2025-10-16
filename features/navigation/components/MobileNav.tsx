"use client";
import { useNavPages } from "../hooks/useNavPages";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { isActive } from "../utils/isActive";
import { Search } from "lucide-react";

export const MobileNav = () => {
  const pages = useNavPages();
  const pathname = usePathname();
  return (
    <div className="lg:hidden mt-6 pb-4">
      <div className="flex flex-col gap-3">
        {pages.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <div key={item.href} className="relative">
              <div
                className={clsx(
                  "absolute inset-0 bg-[#FEB6DE] transform rotate-1 border-2 border-black transition-transform duration-300",
                  "shadow-[3px_3px_0px_#000]",
                  active && "rotate-2 shadow-[5px_5px_0px_#000]"
                )}
              ></div>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "relative block px-4 py-2 bg-white text-black font-inter uppercase text-sm tracking-wider transform -rotate-1 border-2 border-black transition-colors duration-200",
                  active ? "text-brand-pink" : "hover:text-brand-pink"
                )}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
        <div className="relative mt-2">
          <div className="absolute inset-0 bg-[#FEB6DE] transform rotate-1 border-2 border-black shadow-[3px_3px_0px_#000]"></div>
            <div className="relative flex items-center bg-white border-2 border-black transform -rotate-1">
              <Search className="ml-3 text-[#FF00B6]" size={18} />
              <input
                type="text"
                placeholder="BUSCAR ÓCULOS..."
                className="w-full px-2 py-2 font-inter uppercase text-xs text-black placeholder-gray-500 bg-transparent outline-none"
              />
            </div>
        </div>
      </div>
    </div>
  );
};
