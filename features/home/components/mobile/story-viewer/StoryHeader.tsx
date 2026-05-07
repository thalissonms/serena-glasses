"use client";

import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { HomeStory } from "@features/home/types/homeStory.types";
import { DynamicLucideIcon } from "@shared/components/DynamicLucideIcon";
import { CategoryChip } from "@/features/navigation/components";
import clsx from "clsx";

interface StoryHeaderProps {
  story: HomeStory;
  onClose: () => void;
}

export function StoryHeader({ story, onClose }: StoryHeaderProps) {
  const { t } = useTranslation("home");

  return (
    <div className="relative flex flex-col gap-0.5 px-3 pb-2 shrink-0 mt-2">
      <div className="absolute -top-10 left-0 w-full h-24 bg-linear-to-b from-brand-pink-bg-dark/80 to-brand-pink-bg-dark/0" />
      <div className="relative flex items-center gap-2">
        {/* Avatar */}
        {story.avatarKind === "icon" ? (
          <div className="w-12 h-12 relative flex items-center justify-center rounded-full transition-all duration-300 border-4 border-brand-yellow dark:ring-offset-brand-pink-light ring-offset-brand-pink-dark ring-offset-4shadow-[2px_2px_0px_4px] shadow-brand-blue">
            <div
              className={clsx(
                "flex items-center justify-center absolute inset-0 rounded-full bg-brand-pink",
              )}
            >
              <DynamicLucideIcon
                name={story.avatarIconName ?? "Glasses"}
                size={22}
                className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 relative flex items-center justify-center rounded-full transition-all duration-300 border-4 border-brand-yellow dark:ring-offset-brand-pink-light ring-offset-brand-pink-dark ring-offset-4shadow-[2px_2px_0px_4px] shadow-brand-blue">
            <div
              className={clsx(
                "flex items-center justify-center absolute inset-0 rounded-full bg-brand-pink",
              )}
            >
              <span className="relative z-10 font-jersey text-[18px] leading-none transition-colors duration-300 text-brand-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                {story.avatarLabel ?? "NEW"}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1 ml-0.5 mt-1">
          <span className="text-white font-poppins text-lg font-bold italic leading-4 text-shadow-[2px_2px_0px] text-shadow-brand-pink">
            {story.title}
          </span>
          {story.subtitle && (
            <span className="text-white/60 text-xs font-family-inter italic truncate">
              {story.subtitle}
            </span>
          )}
        </div>

        <div className="absolute -top-1 right-1">
          <button
            onClick={onClose}
            aria-label={t("storyViewer.close")}
            className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
