"use client";

import { forwardRef } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onClear?: () => void;
  loading?: boolean;
  autoFocus?: boolean;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  rotated?: boolean;
  id?: string;
  ariaLabel?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  size?: "sm" | "lg";
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      value,
      onChange,
      placeholder,
      onClear,
      loading = false,
      autoFocus = false,
      leftIcon,
      rightSlot,
      rotated = false,
      id,
      ariaLabel,
      onKeyDown,
      onFocus,
      className,
      size = "sm",
    },
    ref,
  ) {
    const isLg = size === "lg";

    const inputEl = (
      <div
        className={clsx(
          "relative flex items-center bg-brand-pink-light dark:bg-brand-pink-dark transition-all duration-200",
          isLg
            ? "border-4 border-black dark:border-brand-pink"
            : "border-2 border-black/60 dark:border-brand-pink",
          !isLg && rotated && "-rotate-1 focus-within:rotate-0",
          // className só vai no inputEl quando NÃO há wrapper externo
          (!rotated || isLg) && className,
        )}
      >
        <span
          className={clsx(
            "shrink-0",
            isLg
              ? "ml-5 text-brand-pink text-2xl font-jocham leading-none select-none"
              : "ml-2 text-black/50 dark:text-brand-pink-light",
          )}
          aria-hidden="true"
        >
          {leftIcon ?? (isLg ? "✦" : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          ))}
        </span>

        <input
          ref={ref}
          id={id}
          type="text"
          role="searchbox"
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus={autoFocus}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          aria-label={ariaLabel ?? placeholder}
          placeholder={placeholder}
          className={clsx(
            "flex-1 bg-transparent outline-none font-poppins uppercase placeholder-brand-pink/60 placeholder:font-semibold dark:placeholder:text-brand-pink-light/20 text-black dark:text-white",
            isLg
              ? "px-5 py-5 text-sm tracking-[0.2em]"
              : "px-2 py-2 text-xs",
          )}
        />

        {loading && (
          isLg ? (
            <span
              className="mr-5 shrink-0 text-brand-pink text-xl font-jocham leading-none animate-spin"
              style={{ animationDuration: "1.5s" }}
              aria-hidden="true"
            >
              ✦
            </span>
          ) : (
            <span
              className="mr-2 w-3 h-3 shrink-0 rounded-full border-2 border-brand-pink border-t-transparent animate-spin"
              aria-hidden="true"
            />
          )
        )}

        {!loading && value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpar busca"
            className={clsx("shrink-0 cursor-pointer", isLg ? "mr-4 p-1.5" : "p-1 mr-1")}
          >
            <X
              size={isLg ? 20 : 14}
              className="text-black/50 dark:text-brand-pink"
              aria-hidden="true"
            />
          </button>
        )}

        {rightSlot}
      </div>
    );

    if (!rotated || isLg) return inputEl;

    // wrapper externo recebe className (ex: "flex-1") e overflow-hidden
    // que impede os cantos rotacionados do inputEl de causarem overflow em X
    return (
      <div className={clsx("relative group overflow-hidden", className)}>
        <div className="absolute inset-0 bg-brand-pink-light transform rotate-1 border border-black/40" />
        {inputEl}
      </div>
    );
  },
);
