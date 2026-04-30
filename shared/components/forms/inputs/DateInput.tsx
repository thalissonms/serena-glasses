"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { InputError, InputLabel, inputCls } from "./_shared";

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function parseISO(iso: string | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplay(iso: string | undefined): string {
  const d = parseISO(iso);
  if (!d) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function buildDayCells(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export interface DateInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
  minYear?: number;
  maxYear?: number;
  openUpward?: boolean;
  className?: string;
}

export function DateInput({
  label,
  placeholder = "DD/MM/AAAA",
  value,
  onChange,
  onBlur,
  disabled,
  required,
  error,
  id,
  minYear = 1900,
  maxYear = new Date().getFullYear() + 10,
  openUpward = false,
  className,
}: DateInputProps) {
  const today = new Date();
  const parsed = parseISO(value);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"days" | "months" | "years">("days");
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onBlur]);

  function open() {
    if (disabled) return;
    setMode("days");
    setIsOpen((v) => !v);
  }

  function selectDay(day: number) {
    onChange?.(toISO(new Date(viewYear, viewMonth, day)));
    setIsOpen(false);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const cells = buildDayCells(viewYear, viewMonth);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  const isSelected = (day: number) =>
    !!parsed &&
    parsed.getFullYear() === viewYear &&
    parsed.getMonth() === viewMonth &&
    parsed.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  return (
    <div ref={containerRef} className={clsx("flex flex-col relative", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} />}

      {/* Trigger button */}
      <button
        id={id}
        type="button"
        onClick={open}
        disabled={disabled}
        className={clsx(
          inputCls(error, "flex items-center justify-between text-left"),
          isOpen && !error && "border-brand-pink",
        )}
      >
        <span className={clsx("font-inter text-sm", !value && "text-gray-400")}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Calendar size={15} className="text-gray-400 flex-shrink-0 ml-2" />
      </button>

      {/* Popup */}
      {isOpen && (
        <div
          className={clsx(
            "absolute z-50 bg-white border-4 border-black shadow-[6px_6px_0_#FF00B6]",
            "w-72 p-4",
            openUpward ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {/* ── Year selector ── */}
          {mode === "years" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setMode("months")}
                  className="font-poppins text-xs font-black uppercase tracking-wider hover:text-brand-pink transition-colors"
                >
                  ←
                </button>
                <span className="font-poppins font-black text-xs uppercase tracking-wider">
                  Selecione o ano
                </span>
                <div className="w-14" />
              </div>

              <div className="grid grid-cols-4 gap-1 max-h-52 overflow-y-auto">
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => { setViewYear(y); setMode("months"); }}
                    className={clsx(
                      "py-1.5 text-xs font-poppins font-semibold border-2 transition-all",
                      y === viewYear
                        ? "bg-brand-pink text-white border-black shadow-[2px_2px_0_#000]"
                        : "border-transparent hover:bg-brand-pink/10 hover:text-brand-pink hover:border-brand-pink/30",
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Month selector ── */}
          {mode === "months" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setMode("years")}
                  className="font-poppins text-xs font-black uppercase tracking-wider hover:text-brand-pink transition-colors"
                >
                  ← {viewYear}
                </button>
                <span className="font-poppins font-black text-xs uppercase tracking-wider">Mês</span>
                <div className="w-14" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setViewMonth(i); setMode("days"); }}
                    className={clsx(
                      "py-2 text-xs font-poppins font-semibold border-2 transition-all",
                      i === viewMonth
                        ? "bg-brand-pink text-white border-black shadow-[2px_2px_0_#000]"
                        : "border-transparent hover:border-black hover:bg-brand-pink/10",
                    )}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Day calendar ── */}
          {mode === "days" && (
            <>
              {/* Navigation */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1 border-2 border-black hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-all"
                >
                  <ChevronLeft size={14} />
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("months")}
                    className="font-poppins font-black text-xs uppercase tracking-wide hover:text-brand-pink transition-colors"
                  >
                    {MONTHS[viewMonth].slice(0, 3)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("years")}
                    className="font-poppins font-black text-xs uppercase tracking-wide hover:text-brand-pink transition-colors"
                  >
                    {viewYear}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1 border-2 border-black hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((d, i) => (
                  <div
                    key={i}
                    className="text-center font-poppins font-black text-[10px] text-gray-400 py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-px">
                {cells.map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!day}
                    onClick={() => day && selectDay(day)}
                    className={clsx(
                      "h-8 w-full font-poppins text-xs font-semibold border-2 transition-all",
                      !day && "invisible",
                      day && isSelected(day) &&
                        "bg-brand-pink text-white border-black shadow-[2px_2px_0_#000]",
                      day && !isSelected(day) && isToday(day) &&
                        "border-brand-pink text-brand-pink",
                      day && !isSelected(day) && !isToday(day) &&
                        "border-transparent hover:bg-brand-pink/10 hover:text-brand-pink",
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Today shortcut */}
              <div className="mt-3 pt-2 border-t-2 border-black text-center">
                <button
                  type="button"
                  onClick={() => {
                    const iso = toISO(today);
                    onChange?.(iso);
                    setViewYear(today.getFullYear());
                    setViewMonth(today.getMonth());
                    setIsOpen(false);
                  }}
                  className="font-poppins text-xs font-black uppercase tracking-wider text-gray-400 hover:text-brand-pink transition-colors"
                >
                  Hoje
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <InputError message={error} />
    </div>
  );
}
