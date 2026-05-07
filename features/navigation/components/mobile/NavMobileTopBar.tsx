import { ThemeToggle } from "@shared/components/ThemeToggle";
import Logo from "@shared/components/layout/Logos/Logo";

export const NavMobileTopBar = () => {
  return (
    <nav className="w-full text-black dark:text-white transition-colors transition-duration-300 md:hidden absolute top-0 bg-brand-pink-light dark:bg-brand-pink-bg-dark z-50">
      <div className="grid grid-cols-3 items-center justify-center h-fit py-2">
        <div />
        <div className="flex items-center justify-center">
          <Logo className="h-16 text-brand-black-dark dark:text-brand-pink" />
        </div>
        <div className="flex justify-end pr-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
