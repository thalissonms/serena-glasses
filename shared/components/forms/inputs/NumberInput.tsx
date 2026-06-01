"use client";
import clsx from "clsx";
import { InputError, InputLabel, inputCls, type InputVariant } from "./_shared";

export interface NumberInputProps {
  label?: string;
  placeholder?: string;
  value?: number | string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
  min?: number;
  max?: number;
  step?: number | string;
  className?: string;
  variant?: InputVariant;
}

export function NumberInput({
  label,
  placeholder = "0",
  value = "",
  onChange,
  onBlur,
  disabled,
  required,
  error,
  id,
  min,
  max,
  step,
  className,
  variant,
}: NumberInputProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} variant={variant} />}
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputCls(
          error,
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          variant,
        )}
      />
      <InputError message={error} variant={variant} />
    </div>
  );
}
