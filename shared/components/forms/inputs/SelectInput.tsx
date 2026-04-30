"use client";
import clsx from "clsx";
import { InputError, InputLabel, inputCls } from "./_shared";

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
}: SelectInputProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} />}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={inputCls(error, "cursor-pointer appearance-none")}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <InputError message={error} />
    </div>
  );
}
