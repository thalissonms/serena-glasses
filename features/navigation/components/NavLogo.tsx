"use client";
import Link from "next/link";
import { Glasses, Sparkles, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@shared/providers/ThemeProvider";
import { Sublogo } from "@shared/components/layout/Logos/Sublogo";

// export const NavLogo = () => {
//   const { t } = useTranslation("nav");

//   return (
//     <div className="flex items-center">
//       <div className="relative">
//         <div className="absolute inset-0 bg-brand-pink-light dark:bg-brand-pink-dark transform rotate-2 border-3 border-black dark:border-brand-pink-light shadow-[6px_6px_0px] shadow-black dark:shadow-brand-pink-light"></div>
//         <div className="relative px-4 py-3 border-3 border-black dark:border-brand-pink-light transform -rotate-2 flex items-center gap-3">
//           <Link href="/" className="flex items-center group">
//             <Sublogo className="h-8 text-brand-black-dark  dark:text-brand-pink-light" />
//           </Link>
//         </div>
//         <div className="absolute -top-2 -right-2 text-white dark:text-brand-blue">
//           <Sparkles size={16} fill="currentColor" className="animate-pulse" />
//         </div>
//         <div className="absolute -bottom-1 -left-1 text-white dark:text-brand-blue">
//           <Glasses size={12} fill="currentColor" className="animate-pulse" />
//         </div>
//       </div>
//     </div>
//   );
// };
export const NavLogo = () => {

  return (
    <div className="relative flex items-center">
      <div className="relative">
          <Link href="/" className="flex items-center group">
            <Sublogo className="h-8 md:h-12 text-brand-black-dark  dark:text-brand-pink-light hover:drop-shadow-sm dark:hover:drop-shadow-brand-pink hover:drop-shadow-white" />
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
