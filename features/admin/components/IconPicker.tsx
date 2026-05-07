"use client";
import { ALLOWED_CATEGORY_ICONS } from "@features/admin/consts/categoryIcons";
import { DynamicLucideIcon } from "@shared/components/DynamicLucideIcon";

interface Props {
  value: string;
  onChange: (icon: string) => void;
}

export default function IconPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {ALLOWED_CATEGORY_ICONS.map((icon) => (
        <button
          key={icon}
          type="button"
          title={icon}
          onClick={() => onChange(icon)}
          className={`flex flex-col items-center gap-1 p-2 border-2 transition-colors ${
            value === icon
              ? "border-brand-pink bg-brand-pink/10 text-brand-pink"
              : "border-white/10 bg-[#1a1a1a] text-gray-400 hover:border-white/30 hover:text-white"
          }`}
        >
          <DynamicLucideIcon name={icon} size={20} />
          <span className="font-inter text-[9px] truncate w-full text-center">{icon}</span>
        </button>
      ))}
    </div>
  );
}
