"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string; // ex: "#"
}

export function TableSearch({
  value,
  onChange,
  placeholder = "ABCD1EFG",
  prefix="#SRN-",
}: Props) {
  return (
    <div className="relative flex group">
      {prefix && (
        <span className="absolute left-9 top-1/2 -translate-y-1/2 text-brand-white/60 pointer-events-none group-focus-within:text-brand-pink-light">
          {prefix}
        </span>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-2 border-white/20 px-3 py-2 text-xs text-white outline-none focus:border-brand-pink pl-21 uppercase placeholder:text-white/30"
      />

      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white/60 transition-colors group-focus-within:text-brand-blue"
      />
    </div>
  );
}
