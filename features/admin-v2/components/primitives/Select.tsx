"use client";
/**
 * Component: Select — dropdown de seleção Y2K Chrome via Radix UI.
 *
 * Trigger estilizado com border pink; Content dark com border pink + hard shadow.
 * Item com hover pink, check indicator à direita. Suporta label e estado de erro.
 *
 * Usado em: formulários do /admin-v2.
 */
import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { clsx } from "clsx";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Selecione...",
  label,
  error,
  disabled,
  className,
}: Props) {
  return (
    <div className={clsx("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 select-none">
          {label}
        </span>
      )}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={clsx(
            "flex items-center justify-between w-full bg-[#1a1a1a] border-2 px-3 py-2.5",
            "font-mono text-[12px] text-white outline-none transition-all duration-150",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "data-[placeholder]:text-white/25",
            error
              ? "border-red-500/60 shadow-[0_0_8px_rgba(255,0,0,0.15)]"
              : "border-[#FF00B6]/20 hover:border-[#FF00B6]/40 focus:border-[#FF00B6] focus:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon asChild>
            <ChevronDown size={12} className="text-white/30 flex-shrink-0" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 w-[var(--radix-select-trigger-width)] bg-[#1a1a1a] border-2 border-[#FF00B6]/30 shadow-[4px_4px_0_#FF00B6] overflow-hidden"
          >
            <RadixSelect.Viewport className="p-1 max-h-60 overflow-y-auto scrollbar-admin">
              {options.filter((opt) => opt.value !== "").map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="flex items-center justify-between px-3 py-2 font-mono text-[11px] text-white/50 cursor-pointer outline-none select-none transition-colors data-[highlighted]:bg-[#FF00B6]/10 data-[highlighted]:text-white data-[state=checked]:text-[#FF00B6]"
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check size={10} className="text-[#FF00B6]" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && (
        <p className="font-mono text-[9px] uppercase tracking-wider text-red-400">{error}</p>
      )}
    </div>
  );
}
