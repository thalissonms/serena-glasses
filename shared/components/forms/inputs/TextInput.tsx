"use client";
import clsx from "clsx";
import { InputError, InputLabel, inputCls, type InputVariant } from "./_shared";

export interface TextInputProps {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
  autoComplete?: string;
  className?: string;
  variant?: InputVariant;
}

export function TextInput({
  label,
  placeholder,
  type = "text",
  value = "",
  onChange,
  onBlur,
  disabled,
  required,
  error,
  id,
  autoComplete,
  className,
  variant,
}: TextInputProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} variant={variant} />}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={inputCls(error, undefined, variant)}
      />
      <InputError message={error} variant={variant} />
    </div>
  );
}
