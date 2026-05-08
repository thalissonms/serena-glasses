"use client";
import clsx from "clsx";
import { InputError, InputLabel, inputCls, type InputVariant } from "./_shared";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
  className?: string;
  variant?: InputVariant;
}

export function SelectInput({
  label,
  placeholder,
  options,
  value = "",
  onChange,
  onBlur,
  disabled,
  required,
  error,
  id,
  className,
  variant,
}: SelectInputProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} variant={variant} />}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={inputCls(error, "cursor-pointer appearance-none", variant)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <InputError message={error} variant={variant} />
    </div>
  );
}
