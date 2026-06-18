"use client";
import { useSmartBack } from "@shared/navigation/hooks/useBackIntercept";
import clsx from "clsx";
import {
  ArrowLeft,
  LucideIcon,
  Share2Icon,
} from "lucide-react";
import { smartShare } from "@shared/utils/smartShare";

export default function ModalNavHeader({
  pageToBack,
  isSharedButton = false,
  handleShared,
  display,
  Icon,
  subtitle,
  buttons = { labelBack: "", labelShared: "" },
  counter,
  onBack,
}: {
  pageToBack: string;
  isSharedButton?: boolean;
  handleShared?: () => void;
  display: string;
  Icon?: LucideIcon;
  subtitle?: string;
  buttons: { labelBack: string; labelShared?: string };
  counter?: number;
  onBack?: () => void;
}) {
  const smartBack = useSmartBack(pageToBack);
  const handleBack = onBack ?? smartBack;

  return (
    <header className={clsx("w-full h-16 grid grid-cols-3 items-center bg-brand-pink-light/60 backdrop-blur-3xl sticky top-0 py-2 px-0.5 border-b-2 border-brand-pink/20 border-dashed z-50",
      "dark:bg-brand-dark-surface-0 dark:border-brand-dark-surface-1"
    )}>
      <div className="flex justify-start">
        <button
          type="button"
          aria-label={buttons.labelBack}
          onClick={handleBack}
          className="p-2 cursor-pointer focus:outline-0"
        >
          <ArrowLeft
            className="w-6.5 h-6.5 text-brand-black/80 dark:text-brand-pink-light"
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
        <div className="flex items-center justify-center min-w-90 gap-0.5">
          {Icon && (
            <Icon
              className={clsx("text-brand-pink/75 mb-0.5 drop-shadow-[0.5px_0.5px_0px] drop-shadow-brand-black/75", subtitle ? "w-5.5 h-5.5" : "w-6 h-6",
                "stroke-[0.5px] stroke-brand-black/80 dark:text-brand-blue/75 dark:stroke-brand-black"
              )}
            />
          )}
          <div className="flex flex-col items-center justify-center">
            <h1
              className={clsx(
                "text-brand-pink px-1 text-center text-shadow-[2px_2px_0px] text-shadow-brand-black/75 font-family-jocham font-light tracking-wide truncate",
                "dark:text-brand-purple",
                "[-webkit-text-stroke:0.75px_rgba(18,18,18,0.8)] [text-stroke:0.75px_rgba(18,18,18,0.8)] dark:[-webkit-text-stroke:0.5px_rgba(18,18,18,1)] dark:[text-stroke:0.75px_rgba(18,18,18,1)]",
                subtitle ? "text-[28px] leading-7" : "text-[32px] leading-8",
              )}
            >
              {display}
            </h1>
            {subtitle && (
              <span className="w-fit h-fit inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black dark:text-brand-pink-light dark:border-brand-pink-light">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        {isSharedButton && (
          <button
            type="button"
            aria-label={buttons.labelShared}
            onClick={handleShared || (() => smartShare(window.location.href, display))}
            className="p-2 cursor-pointer focus:outline-0"
          >
            <Share2Icon
              size={22}
              strokeWidth={2.5}
              aria-hidden="true"
              className="text-brand-black/80 dark:text-brand-pink-light"
            />
          </button>
        )}
        {counter !== undefined && counter > 0 && !isSharedButton && (

          <span
            className={clsx("w-6 h-6 mr-2 rounded-full bg-brand-pink text-brand-white text-xs font-bold flex items-center justify-center border border-brand-black",
              "shadow-[2px_2px_0px] shadow-brand-black/80 font-family-poppins text-shadow-[1px_1px_0px] text-shadow-brand-black/80",
              "dark:bg-brand-pink-light dark:text-brand-white",
              "[-webkit-text-stroke:0.75px_rgba(18,18,18,0.8)] [text-stroke:0.75px_rgba(18,18,18,0.8)] dark:[-webkit-text-stroke:0.5px_rgba(18,18,18,1)] dark:[text-stroke:0.75px_rgba(18,18,18,1)]",

            )}
            aria-label={`${counter} itens`}
          >
            {counter > 9 ? "9+" : counter}
          </span>
        )}
      </div>
    </header>
  );
}
