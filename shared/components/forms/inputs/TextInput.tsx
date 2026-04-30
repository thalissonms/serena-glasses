"use client";
import clsx from "clsx";
import { InputError, InputLabel, inputCls } from "./_shared";

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
}: TextInputProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} />}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={inputCls(error)}
      />
      <InputError message={error} />
    </div>
  );
}
