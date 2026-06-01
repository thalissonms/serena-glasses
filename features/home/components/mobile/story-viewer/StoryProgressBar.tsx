"use client";

import type { RefObject } from "react";
import { useTranslation } from "react-i18next";

interface StoryProgressBarProps {
  count: number;
  activeIndex: number;
  progressRef: RefObject<HTMLDivElement | null>;
}

export function StoryProgressBar({ count, activeIndex, progressRef }: StoryProgressBarProps) {
  const { t } = useTranslation("home");

  return (
    <div
      className="flex gap-1 px-3 pt-3 pb-1 w-full shrink-0"
      role="progressbar"
      aria-valuenow={activeIndex + 1}
      aria-valuemax={count}
      aria-label={t("storyViewer.story", { current: activeIndex + 1, total: count })}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
          <div
            ref={i === activeIndex ? progressRef : undefined}
            className="h-full bg-white rounded-full"
            style={{
              width:
                i < activeIndex
                  ? "100%"
                  : i === activeIndex
                    ? "var(--progress, 0%)"
                    : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
}
