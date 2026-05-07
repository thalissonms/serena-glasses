import Link from "next/link";
import { Glasses, Sparkles, Star } from "lucide-react";
import { Sublogo } from "@shared/components/layout/Logos/Sublogo";

export const NavLogo = () => {
  return (
    <div className="relative flex items-center">
      <div className="relative">
        <Link href="/" className="flex items-center group">
          <Sublogo className="h-8 md:h-12 text-brand-black-dark dark:text-brand-pink-light hover:drop-shadow-sm dark:hover:drop-shadow-brand-pink hover:drop-shadow-white" />
        </Link>
      </div>
      <div className="absolute -top-1 -right-1 text-white dark:text-brand-blue hidden md:block">
        <Sparkles size={16} fill="currentColor" className="animate-pulse" />
      </div>
      <div className="absolute -bottom-3 -left-1 text-white dark:text-brand-blue hidden md:block">
        <Glasses size={12} fill="h-4 currentColor" className="animate-pulse" />
      </div>
      <div className="absolute -top-1 -left-4 text-white dark:text-brand-blue hidden md:block">
        <Star size={12} fill="h-4 currentColor" className="animate-pulse" />
      </div>
    </div>
  );
};
