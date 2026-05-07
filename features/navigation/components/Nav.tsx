import { headers } from "next/headers";
import { NavLogo } from "./NavLogo";
import { NavPages } from "./NavPages";
import { NavSearch } from "./NavSearch";
import { NavActions } from "./NavActions";
import { NavMobileTopBar } from "./mobile/NavMobileTopBar";

export const Nav = async () => {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <>
      <header className="h-14 md:h-auto bg-brand-pink dark:bg-brand-black-dark py-4 px-14 border-b-3 border-black dark:border-brand-pink-dark shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_#FF00B6] sticky top-0 z-50 hidden md:block">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between">
            <NavLogo />
            <NavPages />
            <div className="flex items-center gap-4">
              <NavSearch />
              <NavActions />
            </div>
          </div>
        </div>
      </header>
      <NavMobileTopBar />
    </>
  );
};
