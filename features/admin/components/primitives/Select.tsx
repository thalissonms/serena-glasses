"use client";
/**
 * Component: Select — Radix UI Select com estética Cyber HUD.
 */
import { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const Select = forwardRef<HTMLButtonElement, Props>(function Select(
  { label, value, onValueChange, options, placeholder = "Selecione...", disabled, className, error },
  ref,
) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase select-none">
          {label}
        </label>
      )}

      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          ref={ref}
          className={clsx(
            "group relative flex w-full items-center justify-between rounded-none bg-[#0a0a0a] px-3 py-2.5 transition-all duration-150 outline-none",
            "border",
            error
              ? "border-red-500/60 shadow-[inset_0_0_10px_rgba(255,0,0,0.1)]"
              : "border-brand-pink/20 focus:border-brand-pink focus:shadow-[inset_0_0_15px_rgba(255,0,182,0.05)]",
            "font-mono text-[14px] text-white data-[placeholder]:text-white/20",
            "disabled:cursor-not-allowed disabled:opacity-40",
            className,
          )}
        >
          {/* Decorative corner accent on focus */}
          <div className={clsx("absolute -top-px -left-px h-1.5 w-1.5 border-t border-l transition-colors", error ? "border-red-500" : "border-transparent group-focus:border-brand-pink")}></div>

          <span className="truncate flex-1 text-left min-w-0 mr-2">
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 text-brand-pink/60 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-brand-pink" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={clsx(
              "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-none",
              "border border-brand-pink/30 bg-[#050505] shadow-[0_0_20px_rgba(255,0,182,0.1)]",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] p-1">
              {options.filter((opt) => opt.value !== "").map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className={clsx(
                    "relative flex w-full cursor-default items-center rounded-none py-2 pr-2 pl-8 select-none",
                    "font-mono text-[13px] text-white/80 transition-colors outline-none",
                    "focus:bg-brand-pink/15 focus:text-brand-pink data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-3 w-3 text-brand-pink" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {error && (
        <p className="font-mono text-[11px] tracking-wider text-red-500 uppercase">{`//${error}`}</p>
      )}
    </div>
  );
});
