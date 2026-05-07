"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { SiteBannerRow } from "@features/home/types/siteBanner.types";

const STORAGE_KEY = (id: string) => `dismissed_banner_${id}`;

function isDismissed(id: string): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY(id));
  } catch {
    return false;
  }
}

function dismiss(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY(id), "1");
  } catch {}
}

export function TopBanner() {
  const { i18n } = useTranslation();
  const lang = i18n.language ?? "pt";

  const { data: banners = [] } = useQuery<SiteBannerRow[]>({
    queryKey: ["site-banners-active", lang],
    queryFn: async () => {
      const res = await fetch(`/api/site-banners/active?lang=${lang}`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 5 * 60_000,
  });

  const [sessionDismissed, setSessionDismissed] = useState<Set<string>>(new Set());

  const banner =
    banners.find((b) => !sessionDismissed.has(b.id) && !isDismissed(b.id)) ?? null;

  function handleDismiss() {
    if (!banner) return;
    dismiss(banner.id);
    setSessionDismissed((prev) => {
      const next = new Set(prev);
      next.add(banner.id);
      return next;
    });
  }

  const message =
    lang.startsWith("en")
      ? (banner?.message_en ?? banner?.message_pt ?? "")
      : lang.startsWith("es")
      ? (banner?.message_es ?? banner?.message_pt ?? "")
      : (banner?.message_pt ?? "");

  const inner = (
    <div
      className="relative w-full flex items-center justify-center min-h-9 px-10 py-2 text-sm font-poppins font-bold tracking-wide text-center"
      style={{ backgroundColor: banner?.bg_color ?? "#FF00B6", color: banner?.text_color ?? "#FFFFFF" }}
    >
      <span>{message}</span>

      {banner?.dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fechar banner"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {banner && (
        <motion.div
          key={banner.id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden sticky top-0 z-50 w-full"
        >
          {banner.link_url ? (
            <a href={banner.link_url} className="block hover:opacity-90 transition-opacity">
              {inner}
            </a>
          ) : (
            inner
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
