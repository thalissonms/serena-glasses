"use client";
import clsx from "clsx";
import { ArrowRight, Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface MobileStepButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  variant?: "primary" | "ghost";
}

export function MobileStepButton({
  onClick,
  disabled,
  loading,
  children,
  variant = "primary",
}: MobileStepButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "w-full flex items-center justify-center gap-2 py-4 font-poppins font-black text-sm uppercase tracking-widest border-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary"
          ? "border-black dark:border-brand-pink bg-brand-pink text-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] active:translate-y-0.5 active:shadow-[1px_1px_0_#000] dark:active:shadow-[1px_1px_0_#FF00B6]"
          : "border-black dark:border-brand-pink bg-white dark:bg-[#1a1a1a] text-black dark:text-white",
      )}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          {children}
          {variant === "primary" && <ArrowRight size={16} strokeWidth={3} />}
        </>
      )}
    </button>
  );
}
