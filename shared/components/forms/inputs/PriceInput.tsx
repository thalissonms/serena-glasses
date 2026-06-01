"use client";
import clsx from "clsx";
import { useRef } from "react";
import { InputError, InputLabel, inputCls, type InputVariant } from "./_shared";

function formatCents(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const reais = Math.floor(abs / 100);
  const centavos = abs % 100;
  const reaisStr = reais.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}R$ ${reaisStr},${String(centavos).padStart(2, "0")}`;
}

function digitsToCents(digits: string): number {
  if (!digits) return 0;
  const n = parseInt(digits, 10);
  return isNaN(n) ? 0 : n;
}

export interface PriceInputProps {
  label?: string;
  placeholder?: string;
  value?: number | null;
  onChange?: (cents: number) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  id?: string;
  className?: string;
  variant?: InputVariant;
}

export function PriceInput({
  label,
  placeholder = "R$ 0,00",
  value,
  onChange,
  onBlur,
  disabled,
  required,
  error,
  hint,
  id,
  className,
  variant,
}: PriceInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cents = value ?? 0;
  const display = value == null ? "" : formatCents(cents);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const next = digitsToCents(digits);
    onChange?.(next);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const digits = String(cents);
      const next = digitsToCents(digits.slice(0, -1));
      onChange?.(next);
    }
  }

  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} variant={variant} />}
      <input
        id={id}
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputCls(error, undefined, variant)}
      />
      {hint && !error && (
        <p
          className={
            variant === "admin"
              ? "font-inter text-[11px] text-gray-500 mt-1"
              : "font-inter text-xs text-gray-500 mt-1"
          }
        >
          {hint}
        </p>
      )}
      <InputError message={error} variant={variant} />
    </div>
  );
}
