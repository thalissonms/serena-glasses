"use client";
/**
 * Component: Input — campo de texto com estética Cyber HUD.
 *
 * Label monospace uppercase; border cyan em focus; estado de erro com border vermelha + glow.
 * Suporta prefix/suffix icon e mensagem de hint/erro inline.
 *
 * Usado em: formulários do /admin.
 */
import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { clsx } from "clsx";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, hint, prefix, suffix, className, id, ...props },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 select-none"
        >
          {label}
        </label>
      )}
      <div
        className={clsx(
          "flex items-center bg-[#0a0a0a] border transition-all duration-150 rounded-none relative",
          error
            ? "border-red-500/60 shadow-[inset_0_0_10px_rgba(255,0,0,0.1)]"
            : "border-brand-pink/20 focus-within:border-brand-pink focus-within:shadow-[inset_0_0_15px_rgba(255,0,182,0.05)]",
        )}
      >
        {/* Decorative corner accent on focus */}
        <div className={clsx("absolute -left-px -top-px h-1.5 w-1.5 border-l border-t transition-colors", error ? "border-red-500" : "border-transparent focus-within:border-brand-pink")}></div>

        {prefix && (
          <span className="pl-3 text-white/25 shrink-0 flex items-center">{prefix}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={clsx(
            "flex-1 bg-transparent px-3 py-2.5 font-mono text-[14px] text-white",
            "placeholder:text-white/20 outline-none min-w-0",
            className,
          )}
        />
        {suffix && (
          <span className="pr-3 text-white/25 shrink-0 flex items-center">{suffix}</span>
        )}
      </div>
      {error && (
        <p className="font-mono text-[11px] uppercase tracking-wider text-red-500">// {error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-[11px] uppercase tracking-wider text-white/25">{hint}</p>
      )}
    </div>
  );
});
