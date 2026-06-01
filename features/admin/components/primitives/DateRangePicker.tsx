"use client";
/**
 * Component: DateRangePicker — seletor de intervalo de datas com estética Y2K Chrome.
 *
 * Dois inputs de data nativos estilizados com border pink e fonte mono.
 * Emite onChange com { from, to } em strings ISO (YYYY-MM-DD). Sem dependência externa.
 *
 * Usado em: filtros de período em dashboard, pedidos e relatórios do /admin.
 */
import { type ChangeEvent } from "react";

export interface DateRange {
  from: string;
  to: string;
}

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
  label?: string;
  className?: string;
}

const dateInputClass = [
  "bg-[#1a1a1a] border-2 border-[#FF00B6]/20 px-3 py-2.5",
  "font-mono text-[11px] text-white outline-none transition-all duration-150",
  "focus:border-[#FF00B6] focus:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
  "[color-scheme:dark]",
].join(" ");

export function DateRangePicker({ value, onChange, label, className }: Props) {
  function handleFrom(e: ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, from: e.target.value });
  }

  function handleTo(e: ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, to: e.target.value });
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      {label && (
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 select-none">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value.from}
          onChange={handleFrom}
          className={dateInputClass}
        />
        <span className="font-mono text-[10px] text-white/20 select-none">›</span>
        <input
          type="date"
          value={value.to}
          onChange={handleTo}
          className={dateInputClass}
        />
      </div>
    </div>
  );
}
