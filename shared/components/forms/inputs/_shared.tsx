import clsx from "clsx";

export type InputVariant = "checkout" | "admin" | "search";

export function InputLabel({
  htmlFor,
  label,
  required,
  variant = "checkout",
}: {
  htmlFor?: string;
  label: string;
  required?: boolean;
  variant?: InputVariant;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={
        variant === "admin"
          ? "block font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1"
          : "block font-poppins font-semibold text-xs uppercase tracking-wider text-brand-pink md:text-gray-600 dark:text-gray-300 mb-1.5"
      }
    >
      {label}
      {required && <span className="text-brand-pink-dark md:text-brand-pink ml-0.5">*</span>}
    </label>
  );
}

export function InputError({ message, variant = "checkout" }: { message?: string; variant?: InputVariant }) {
  if (!message) return null;
  return (
    <p
      className={
        variant === "admin"
          ? "font-inter text-xs text-red-400 mt-1"
          : "font-poppins text-xs text-red-500 dark:text-red-400 mt-1"
      }
    >
      {message}
    </p>
  );
}

export function InputHint({ message, variant = "checkout" }: { message?: string; variant?: InputVariant }) {
  if (!message) return null;
  return (
    <p
      className={
        variant === "admin"
          ? "font-inter text-[11px] text-gray-500 mt-1"
          : "font-inter text-xs text-gray-500 dark:text-gray-400 mt-1"
      }
    >
      {message}
    </p>
  );
}

export function inputCls(error?: string, extra?: string, variant: InputVariant = "checkout") {
  if (variant === "admin") {
    return clsx(
      "w-full px-3 py-2 border-2 font-inter text-sm bg-[#1a1a1a] text-white placeholder:text-gray-500",
      "outline-none transition-colors duration-150",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      error
        ? "border-red-500 focus:border-red-500"
        : "border-white/10 focus:border-brand-pink",
      extra,
    );
  }
  if (variant === "search") {
    return clsx(
      "w-full px-2 py-2 border-2 border-black dark:border-brand-pink-light",
      "bg-brand-pink-light dark:bg-brand-pink-dark",
      "font-poppins uppercase text-xs",
      "placeholder-brand-pink/60 placeholder:font-semibold dark:placeholder:text-brand-pink-light/20",
      "outline-none transition-colors duration-150",
      extra,
    );
  }
  return clsx(
    "w-full px-3 py-2.5 border-2 font-inter text-sm bg-white dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-gray-500",
    "focus:outline-none transition-colors duration-150",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    error
      ? "border-red-500 focus:border-red-500"
      : "border-black dark:border-brand-pink focus:border-brand-pink",
    extra,
  );
}

export function applyMask(value: string, pattern: string): string {
  const digits = value.replace(/\D/g, "");
  let result = "";
  let di = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (di >= digits.length) break;
    result += pattern[i] === "#" ? digits[di++] : pattern[i];
  }
  return result;
}
