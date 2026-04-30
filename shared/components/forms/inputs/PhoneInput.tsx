"use client";
import clsx from "clsx";
import { useState } from "react";
import { InputError, InputLabel, applyMask, inputCls } from "./_shared";

interface Country {
  code: string;
  flag: string;
  label: string;
  mask: string;
  placeholder: string;
}

const COUNTRIES: Country[] = [
  { code: "+55",  flag: "🇧🇷", label: "Brasil",      mask: "(##) #####-####", placeholder: "(11) 99999-9999" },
  { code: "+1",   flag: "🇺🇸", label: "EUA",         mask: "(###) ###-####",  placeholder: "(555) 123-4567" },
  { code: "+44",  flag: "🇬🇧", label: "Reino Unido", mask: "#### ### ####",   placeholder: "7700 900 123"   },
  { code: "+351", flag: "🇵🇹", label: "Portugal",    mask: "### ### ###",     placeholder: "912 345 678"    },
  { code: "+54",  flag: "🇦🇷", label: "Argentina",   mask: "## ####-####",    placeholder: "11 1234-5678"   },
  { code: "+52",  flag: "🇲🇽", label: "México",      mask: "## #### ####",    placeholder: "55 1234 5678"   },
];

export interface PhoneInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
  defaultCountryCode?: string;
  className?: string;
}

export function PhoneInput({
  label,
  value = "",
  onChange,
  onBlur,
  disabled,
  required,
  error,
  id,
  defaultCountryCode = "+55",
  className,
}: PhoneInputProps) {
  const [country, setCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === defaultCountryCode) ?? COUNTRIES[0],
  );

  function handleCountryChange(code: string) {
    const next = COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
    setCountry(next);
    onChange?.("");
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(applyMask(e.target.value, country.mask));
  }

  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} />}

      <div className="flex gap-2">
        {/* Country code selector */}
        <select
          value={country.code}
          onChange={(e) => handleCountryChange(e.target.value)}
          disabled={disabled}
          aria-label="Código do país"
          className={clsx(
            "border-2 border-black px-2 py-2.5 font-inter text-sm bg-white",
            "focus:outline-none focus:border-brand-pink transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
            "w-24 flex-shrink-0",
          )}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>

        {/* Phone number */}
        <input
          id={id}
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          onBlur={onBlur}
          placeholder={country.placeholder}
          disabled={disabled}
          maxLength={country.mask.length}
          className={inputCls(error)}
        />
      </div>

      <InputError message={error} />
    </div>
  );
}
