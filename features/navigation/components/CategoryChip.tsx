"use client";
import Link from "next/link";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export interface CategoryChipItem {
  href?: string;
  label: string;
}

interface CategoryChipProps {
  item: CategoryChipItem;
  active: boolean;
  allChip?: boolean;
  width?: string;
  height?: string;
  icon?: LucideIcon;
  iconSize?: number;
  showLabel?: boolean;
}

export function CategoryChip({
  item,
  active,
  width = "w-16",
  height = "h-16",
  allChip = false,
  icon: ExplicitIcon,
  iconSize = 24,
  showLabel = true,
}: CategoryChipProps) {
  const Icon = allChip ? null : (ExplicitIcon ?? null);

  const inner = (
    <>
      <div
        className={clsx(
          "relative flex items-center justify-center rounded-full transition-all duration-300",
          active
            ? [
                `${width} ${height}`,
                "border-4 border-brand-yellow",
                "dark:ring-offset-brand-pink-light ring-offset-brand-pink-dark ring-offset-4",
                "shadow-[2px_2px_0px_4px] shadow-brand-blue",
              ]
            : [
                `${width} ${height}`,
                "border-[3px] border-neutral-300 dark:border-neutral-600",
              ],
        )}
      >
        <div
          className={clsx(
            "absolute inset-0 rounded-full",
            active ? "bg-brand-pink" : "bg-neutral-100 dark:bg-neutral-800",
          )}
        />

        {allChip ? (
          <span
            className={clsx(
              "relative z-10 font-jersey text-[22px] leading-none transition-colors duration-300",
              active
                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                : "text-neutral-400 dark:text-neutral-500",
            )}
          >
            ALL
          </span>
        ) : Icon ? (
          <Icon
            size={iconSize}
            strokeWidth={active ? 2 : 1.5}
            className={clsx(
              "relative z-10 transition-colors duration-300",
              active
                ? "text-brand-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                : "text-neutral-400 dark:text-neutral-500",
            )}
          />
        ) : null}
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className={clsx(
            "font-jersey text-[14px] leading-tight text-center max-w-16 mt-0.5 truncate transition-colors duration-300",
            active
              ? "text-brand-pink dark:text-brand-pink"
              : "text-neutral-400 dark:text-neutral-500",
          )}
        >
          {item.label}
        </span>
      )}
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className="flex shrink-0 flex-col items-center gap-1.5 px-1"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5 px-1">
      {inner}
    </div>
  );
}
