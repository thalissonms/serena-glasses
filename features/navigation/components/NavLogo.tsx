import Link from "next/link";
import { Glasses, Sparkles, Star } from "lucide-react";
import { Sublogo } from "@shared/components/layout/Logos/Sublogo";

export const NavLogo = () => {
  return (
    <div className="relative flex items-center">
      <div className="relative">
        <Link href="/" className="flex items-center group">
          <Sublogo className="h-8 md:h-12 text-brand-black/90 dark:text-brand-pink-light hover:drop-shadow-sm dark:hover:drop-shadow-brand-pink hover:drop-shadow-brand-purple" />
        </Link>
      </div>
      <div className="absolute -top-1 -right-1 text-brand-pink-light dark:text-brand-blue fill-brand-pink-light  dark:fill-brand-blue hidden md:block">
        <Sparkles
          size={16}
          fill="currentColor"
          className="animate-[pulse_1.75s_cubic-bezier(0.4,0,0.6,1)_infinite] drop-shadow-sm drop-shadow-brand-white/80 dark:drop-shadow-brand-blue/60"
        />
      </div>
      <div className="absolute -bottom-2.5 -left-1 text-brand-pink-light dark:text-brand-blue fill-brand-pink-light  dark:fill-brand-blue hidden md:block">
        <Glasses
          size={12}
          fill="h-4 currentColor"
          className="animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] drop-shadow-sm drop-shadow-brand-white/80 dark:drop-shadow-brand-blue/60"
        />
      </div>
      <div className="absolute -top-1 -left-4 text-brand-pink-light dark:text-brand-blue fill-brand-pink-light  dark:fill-brand-blue hidden md:block">
        <Star
          size={12}
          fill="h-4 currentColor"
          className="animate-[pulse_2.1s_cubic-bezier(0.4,0,0.6,1)_infinite] drop-shadow-sm drop-shadow-brand-white/80 dark:drop-shadow-brand-blue/60"
        />
      </div>
    </div>
  );
};
