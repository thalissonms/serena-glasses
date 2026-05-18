"use client";
import { useSmartBack } from "@features/navigation/hooks/useBackIntercept";
import clsx from "clsx";
import {
  ArrowLeft,
  BaggageClaim,
  LucideIcon,
  Share2Icon,
  ShoppingBag,
} from "lucide-react";

export default function ModalNavHeader({
  pageToBack,
  isSharedButton = false,
  handleShared = () => {},
  display,
  Icon,
  subtitle,
  buttons = { labelBack: "", labelShared: "" },
  onBack,
}: {
  pageToBack: string;
  isSharedButton?: boolean;
  handleShared?: () => void;
  display: string;
  Icon?: LucideIcon;
  subtitle?: string;
  buttons: { labelBack: string; labelShared?: string };
  onBack?: () => void;
}) {
  const smartBack = useSmartBack(pageToBack);
  const handleBack = onBack ?? smartBack;

  return (
    <header className="w-full h-16 grid grid-cols-3 items-center bg-brand-pink/25 backdrop-blur-3xl sticky top-0 py-2 px-0.5 border-b-2 border-brand-pink/40 border-dashed z-50">
      <div className="flex justify-start">
        <button
          type="button"
          aria-label={buttons.labelBack}
          onClick={handleBack}
          className="p-2 cursor-pointer"
        >
          <ArrowLeft
            className="w-6.5 h-6.5 text-white"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </button>
      </div>
      <div
        className={clsx(
          "h-[56] flex flex-col items-center justify-center pt-1 -mt-1",
        )}
      >
        <div className="flex items-center justify-center min-w-90">
          {Icon && (
            <Icon
              size={subtitle ? 24 : 26}
              strokeWidth={2.5}
              className="text-brand-blue drop-shadow-[2px_2px_0] drop-shadow-black mb-1"
            />
          )}
          <h1
            className={clsx(
              "text-white px-2 text-center text-shadow-[2px_2px_0px] text-shadow-brand-black font-family-jocham font-light tracking-wide truncate",
              subtitle ? "text-[28px]" : "text-[32px]",
            )}
          >
            {display}
          </h1>
        </div>
        {subtitle && (
          <span className="w-fit h-fit inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black dark:text-brand-pink-light dark:border-brand-pink-light">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex justify-end">
        {isSharedButton && (
          <button
            type="button"
            aria-label={buttons.labelShared}
            onClick={() => handleShared}
            className="p-2 cursor-pointer"
          >
            <Share2Icon
              size={22}
              strokeWidth={2.5}
              aria-hidden="true"
              className="text-white"
            />
          </button>
        )}
      </div>
    </header>
  );
}
