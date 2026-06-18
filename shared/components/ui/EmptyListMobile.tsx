import { ReactNode } from "react";
import Logo from "@shared/components/layout/Logos/Logo";

export interface EmptyListMobileProps {
  mainText: string;
  subText: string;
  icon: ReactNode;
}

export function EmptyListMobile({ mainText, subText, icon }: EmptyListMobileProps) {
  return (
    <div className="flex h-[calc(100vh-200px)] overflow-hidden flex-col items-center justify-center gap-4 p-2 px-6 text-center">
      <div className="relative">
        <Logo className="w-30 text-brand-pink/20 dark:text-brand-pink-light/20" />
      </div>
      <div>
        <h1 className="font-mono font-bold text-3xl uppercase text-brand-black/80 dark:text-white leading-none mb-3">
          {mainText}
        </h1>
        <div className="flex items-center justify-center py-1">
          {icon}
        </div>
        <p className="font-poppins text-sm italic text-brand-black/50 dark:text-brand-white/40 max-w-xs mx-auto">
          {subText}
        </p>
      </div>
    </div>
  );
}
