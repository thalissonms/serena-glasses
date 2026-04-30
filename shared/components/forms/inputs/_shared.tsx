import clsx from "clsx";

export function InputLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-poppins font-semibold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5"
    >
      {label}
      {required && <span className="text-brand-pink ml-0.5">*</span>}
    </label>
  );
}

export function InputError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="font-poppins text-xs text-red-500 dark:text-red-400 mt-1">{message}</p>;
}

export function inputCls(error?: string, extra?: string) {
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
