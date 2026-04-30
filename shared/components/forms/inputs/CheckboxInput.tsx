"use client";
import clsx from "clsx";
import { InputError } from "./_shared";

export interface CheckboxInputProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function CheckboxInput({
  label,
  checked = false,
  onChange,
  onBlur,
  disabled,
  error,
  className,
}: CheckboxInputProps) {
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            onChange?.(!checked);
            onBlur?.();
          }
        }}
        className={clsx(
          "flex items-center gap-2.5 text-left group",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        )}
      >
        {/* Y2K checkbox box */}
        <span
          className={clsx(
            "w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150",
            checked
              ? "bg-brand-pink border-brand-pink shadow-[2px_2px_0_#000]"
              : "bg-white border-black group-hover:border-brand-pink",
          )}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>

        <span
          className={clsx(
            "font-poppins text-sm transition-colors",
            checked ? "text-brand-pink font-semibold" : "text-gray-700 group-hover:text-brand-pink",
          )}
        >
          {label}
        </span>
      </button>

      <InputError message={error} />
    </div>
  );
}
