import { ThemeToggle } from "@shared/components/ThemeToggle";
import Logo from "@shared/components/layout/Logos/Logo";

export const NavMobileTopBar = () => {
  return (
    <nav className="w-full text-brand-black dark:text-brand-white transition-colors transition-duration-300 md:hidden bg-brand-pink-light/60 backdrop-blur-lg dark:bg-brand-dark-surface-0/75 z-50">
        <div className="grid grid-cols-3 items-center justify-center h-fit py-2">
          <div />
          <div className="flex items-center justify-center">
            <Logo className="h-16 text-brand-black dark:text-brand-pink-light" />
          </div>
          <div className="flex justify-end pr-4">
            <ThemeToggle />
          </div>
        </div>
    </nav>
  );
};
