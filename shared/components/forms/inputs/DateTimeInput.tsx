"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { InputError, InputLabel, inputCls, type InputVariant } from "./_shared";

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function parseISO(iso: string | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function formatDisplay(iso: string | undefined): string {
  const d = parseISO(iso);
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function buildDayCells(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export interface DateTimeInputProps {
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
  variant?: InputVariant;
}

export function DateTimeInput({
  label,
  placeholder = "DD/MM/AAAA HH:MM",
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
  variant = "checkout",
}: DateTimeInputProps) {
  const today = new Date();
  const parsed = parseISO(value);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"days" | "months" | "years">("days");
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth());
  const [hour, setHour] = useState(parsed?.getHours() ?? 0);
  const [minute, setMinute] = useState(parsed?.getMinutes() ?? 0);

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

  useEffect(() => {
    if (parsed) {
      setHour(parsed.getHours());
      setMinute(parsed.getMinutes());
    }
  }, [value]);

  function open() {
    if (disabled) return;
    setMode("days");
    setIsOpen((v) => !v);
  }

  function commit(year: number, month: number, day: number, h: number, m: number) {
    const d = new Date(year, month, day, h, m, 0, 0);
    onChange?.(d.toISOString());
  }

  function selectDay(day: number) {
    commit(viewYear, viewMonth, day, hour, minute);
  }

  function changeHour(h: number) {
    setHour(h);
    if (parsed) commit(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), h, minute);
  }

  function changeMinute(m: number) {
    setMinute(m);
    if (parsed) commit(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), hour, m);
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

  const isAdmin = variant === "admin";

  const popupCls = isAdmin
    ? "absolute z-50 bg-[#1a1a1a] border-2 border-brand-pink/40 shadow-[0_8px_32px_rgba(255,0,182,0.2)] w-72 p-4"
    : "absolute z-50 bg-white border-4 border-black shadow-[6px_6px_0_#FF00B6] w-72 p-4";

  const navHeaderTextCls = isAdmin
    ? "font-poppins font-black text-xs uppercase tracking-wider text-white"
    : "font-poppins font-black text-xs uppercase tracking-wider";

  const cellSelectedCls = isAdmin
    ? "bg-brand-pink text-white border-brand-pink shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
    : "bg-brand-pink text-white border-black shadow-[2px_2px_0_#000]";

  const cellHoverCls = isAdmin
    ? "border-transparent hover:bg-brand-pink/20 hover:text-brand-pink"
    : "border-transparent hover:bg-brand-pink/10 hover:text-brand-pink";

  const navBtnCls = isAdmin
    ? "p-1 border-2 border-white/20 text-white hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-all"
    : "p-1 border-2 border-black hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-all";

  const dividerCls = isAdmin ? "mt-3 pt-2 border-t border-white/10" : "mt-3 pt-2 border-t-2 border-black";

  const timeSelectCls = isAdmin
    ? "bg-[#0a0a0a] border-2 border-white/10 text-white font-mono text-sm px-2 py-1 outline-none focus:border-brand-pink"
    : "bg-white border-2 border-black font-mono text-sm px-2 py-1 outline-none focus:border-brand-pink";

  return (
    <div ref={containerRef} className={clsx("flex flex-col relative", className)}>
      {label && <InputLabel htmlFor={id} label={label} required={required} variant={variant} />}

      <button
        id={id}
        type="button"
        onClick={open}
        disabled={disabled}
        className={clsx(
          inputCls(error, "flex items-center justify-between text-left", variant),
          isOpen && !error && "border-brand-pink",
        )}
      >
        <span className={clsx("font-inter text-sm", !value && (isAdmin ? "text-gray-500" : "text-gray-400"))}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Calendar size={15} className={clsx("flex-shrink-0 ml-2", isAdmin ? "text-gray-500" : "text-gray-400")} />
      </button>

      {isOpen && (
        <div className={clsx(popupCls, openUpward ? "bottom-full mb-2" : "top-full mt-2")}>
          {mode === "years" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setMode("months")}
                  className={clsx(navHeaderTextCls, "hover:text-brand-pink transition-colors")}
                >
                  ←
                </button>
                <span className={navHeaderTextCls}>Selecione o ano</span>
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
                      isAdmin ? "text-white" : "",
                      y === viewYear ? cellSelectedCls : cellHoverCls,
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === "months" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setMode("years")}
                  className={clsx(navHeaderTextCls, "hover:text-brand-pink transition-colors")}
                >
                  ← {viewYear}
                </button>
                <span className={navHeaderTextCls}>Mês</span>
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
                      isAdmin ? "text-white" : "",
                      i === viewMonth ? cellSelectedCls : cellHoverCls,
                    )}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === "days" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button type="button" onClick={prevMonth} className={navBtnCls}>
                  <ChevronLeft size={14} />
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("months")}
                    className={clsx(navHeaderTextCls, "hover:text-brand-pink transition-colors")}
                  >
                    {MONTHS[viewMonth].slice(0, 3)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("years")}
                    className={clsx(navHeaderTextCls, "hover:text-brand-pink transition-colors")}
                  >
                    {viewYear}
                  </button>
                </div>
                <button type="button" onClick={nextMonth} className={navBtnCls}>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((d, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "text-center font-poppins font-black text-[10px] py-1",
                      isAdmin ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px">
                {cells.map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!day}
                    onClick={() => day && selectDay(day)}
                    className={clsx(
                      "h-8 w-full font-poppins text-xs font-semibold border-2 transition-all",
                      isAdmin && day && !isSelected(day) && "text-white",
                      !day && "invisible",
                      day && isSelected(day) && cellSelectedCls,
                      day && !isSelected(day) && isToday(day) && "border-brand-pink text-brand-pink",
                      day && !isSelected(day) && !isToday(day) && cellHoverCls,
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Time picker */}
              <div className={clsx(dividerCls, "flex items-center justify-center gap-2 mt-3")}>
                <Clock size={13} className={isAdmin ? "text-gray-500" : "text-gray-400"} />
                <select
                  value={hour}
                  onChange={(e) => changeHour(parseInt(e.target.value, 10))}
                  className={timeSelectCls}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span className={isAdmin ? "text-white font-bold" : "font-bold"}>:</span>
                <select
                  value={minute}
                  onChange={(e) => changeMinute(parseInt(e.target.value, 10))}
                  className={timeSelectCls}
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      )}

      <InputError message={error} variant={variant} />
    </div>
  );
}
