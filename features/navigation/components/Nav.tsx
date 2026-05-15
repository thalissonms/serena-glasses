import { NavLogo } from "./NavLogo";
import { NavPages } from "./NavPages";
import { NavSearch } from "./NavSearch";
import { NavActions } from "./NavActions";
import { TopBanner } from "@shared/components/layout/TopBanner";
import { getActiveCategoriesWithSubs } from "@features/admin/services/categoriesList.service";

export const Nav = async () => {
  const categories = await getActiveCategoriesWithSubs();

  return (
    <>
      <header className="h-14 md:h-auto bg-brand-pink dark:bg-brand-black-dark py-4 px-14 border-b-3 border-black dark:border-brand-pink-dark shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_#FF00B6]">
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
      </header>
    </>
  );
};
