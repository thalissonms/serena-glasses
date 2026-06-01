import { NavLogo } from "./NavLogo";
import { NavPages } from "./NavPages";
import { NavSearch } from "./NavSearch";
import { NavActions } from "./NavActions";
import { getActiveCategoriesWithSubs } from "@features/admin/services/categoriesList.service";
import clsx from "clsx";

export const Nav = async () => {
  const categories = await getActiveCategoriesWithSubs();

  return (
    <>
      <header className="relative isolate h-14 md:h-auto bg-brand-pink dark:bg-brand-dark-surface-1 py-4 px-14 border-b-3 border-brand-black dark:border-brand-black shadow-[6px_6px_0px] shadow-brand-black transition-all duration-300">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between">
            <NavLogo />
            {categories && <NavPages categories={categories} />}
            <div className="flex items-center gap-4">
              <NavSearch />
              <NavActions />
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "w-[calc(100vw-10px)] h-full inset-0 left-0 absolute -z-1 border-4",
            "border-t-brand-light-surface-2/40 border-r-brand-light-surface-2/50 border-b-brand-light-surface-2/50 border-l-brand-light-surface-2/40",
            "dark:border-t-brand-dark-surface-0/50 dark:border-r-brand-dark-surface-0/75 dark:border-b-brand-dark-surface-0/75 dark:border-l-brand-dark-surface-0/50",
          )}
        />
        <div
          className={clsx(
            "w-[calc(100vw-10px)] h-6 absolute bottom-1 left-0",
            "bg-linear-0 -z-2",
            "from-brand-black/20 via-brand-black/10 dark:from-brand-black/20 dark:via-brand-black/10 to-transparent "
          )}
        />
      </header> 
    </>
  );
};
