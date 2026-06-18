"use client";

import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Pill } from "@shared/components/ui/Pills";

export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  const { t } = useTranslation("search");
  return (
    <Pill onClick={() => null} active={false}>
      <div className="flex items-center justify-between gap-2">
        {label}
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("removeFilter", { label })}
          className="cursor-pointer z-999"
        >
          <X size={14} aria-hidden="true" className="mb-0.5" />
        </button>
      </div>
    </Pill>
  );
}
