"use client";
import { useSmartBack } from "@features/navigation/hooks/useBackIntercept";
import clsx from "clsx";
import { ArrowLeft, Share2Icon } from "lucide-react";

export default function ModalNavHeader({
  pageToBack,
  isSharedButton = false,
  handleShared = () => {},
  display,
  subtitle,
  buttons = { labelBack: "", labelShared: "" },
  onBack,
}: {
  pageToBack: string;
  isSharedButton?: boolean;
  handleShared?: () => void;
  display: string;
  subtitle?: string;
  buttons: { labelBack: string; labelShared?: string };
  onBack?: () => void;
}) {
  const smartBack = useSmartBack(pageToBack);
  const handleBack = onBack ?? smartBack;

  return (
    <header className="w-full h-16 flex items-center bg-brand-pink/25 backdrop-blur-3xl sticky top-0 py-2 px-0.5 border-b-2 border-brand-pink/40 border-dashed z-50">
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
      <div className="w-full h-[56] flex flex-col items-center justify-center pt-1 -mt-1">
        <h1 className="text-white w-full text-center text-shadow-[2px_2px_0px] text-shadow-brand-black text-[28px] font-family-jocham font-light tracking-wide truncate">
          {display}
        </h1>
        {subtitle && (
          <span className="w-fit h-fit inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black dark:text-brand-pink-light dark:border-brand-pink-light">
            {subtitle}
          </span>
        )}
      </div>
      {isSharedButton && (
        <div className="px-2 pt-2 mr-1">
          <button
            type="button"
            aria-label={buttons.labelShared}
            onClick={() => handleShared}
            className="text-white transition-all duration-300 cursor-pointer"
          >
            <Share2Icon size={22} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      )}
    </header>
  );
}
