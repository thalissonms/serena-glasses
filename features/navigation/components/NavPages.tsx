"use client";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { isActive } from "../utils/isActive";
import { useNavPages } from "../hooks/useNavPages";

type Page = ReturnType<typeof useNavPages>[number];

export const NavPages = () => {
  const pages = useNavPages();
  return <NavPagesClient pages={pages} />;
};

function NavPagesClient({ pages }: { pages: Page[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegação principal" className="hidden lg:block">
      <ul className="flex items-center gap-6">
        {pages.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="relative group list-none">
              <div
                className={clsx(
                  "absolute inset-0 bg-brand-pink-light border-2 border-black transition-transform duration-300",
                  "shadow-[3px_3px_0px_#000] rotate-1",
                  !active && "group-hover:rotate-2 group-hover:shadow-[5px_5px_0px_#000]",
                  active && "rotate-2 shadow-[5px_5px_0px_#000]"
                )}
              />
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                prefetch
                className={clsx(
                  "relative font-black block px-4 py-2 text-black font-inter uppercase text-sm tracking-wider border-2 border-black",
                  "transform -rotate-1 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500",
                  active ? "text-brand-pink rotate-0" : "hover:text-brand-pink group-hover:rotate-0"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
