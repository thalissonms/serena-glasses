"use client";
import clsx from "clsx";
import { InputError, InputLabel, inputCls } from "./_shared";

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
  className?: string;
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
  className,
}: NumberInputProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} />}
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputCls(
          error,
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        )}
      />
      <InputError message={error} />
    </div>
  );
}
