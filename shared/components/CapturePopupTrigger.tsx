"use client";

import { useEffect, useState } from "react";
import { CapturePopup } from "./CapturePopup";
import { useSiteSetting } from "@shared/hooks/useSiteSettings";

const STORAGE_KEY = "popup_capture_dismissed_at";

function readDismissedAt(): number | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}

export function CapturePopupTrigger() {
  const { data: cfg } = useSiteSetting("popup_capture");
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!cfg?.enabled) return;
    const at = readDismissedAt();
    if (at == null) return;
    const days = (Date.now() - at) / 86_400_000;
    if (days < cfg.show_once_per_days) setDismissed(true);
  }, [cfg]);

  useEffect(() => {
    if (!cfg?.enabled || dismissed) return;

    if (cfg.trigger === "delay") {
      const t = setTimeout(() => setOpen(true), cfg.delay_ms);
      return () => clearTimeout(t);
    }

    if (cfg.trigger === "exit_intent") {
      const handler = (e: MouseEvent) => {
        if (e.clientY < 10) setOpen(true);
      };
      document.addEventListener("mouseleave", handler);
      return () => document.removeEventListener("mouseleave", handler);
    }

    if (cfg.trigger === "scroll") {
      const handler = () => {
        if (window.scrollY > window.innerHeight * 0.5) setOpen(true);
      };
      window.addEventListener("scroll", handler, { once: true });
      return () => window.removeEventListener("scroll", handler);
    }
  }, [cfg, dismissed]);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
    setDismissed(true);
    setOpen(false);
  }

  if (!cfg?.enabled || dismissed) return null;

  return (
    <CapturePopup
      isOpen={open}
      onClose={dismiss}
      title={cfg.title_pt}
      description={cfg.description_pt}
      primaryButton={{
        label: cfg.primary_label_pt,
        onClick: () => {
          if (cfg.coupon_code) {
            navigator.clipboard.writeText(cfg.coupon_code).catch(() => {});
          }
          dismiss();
        },
      }}
      secondaryButton={
        cfg.secondary_label_pt
          ? { label: cfg.secondary_label_pt, onClick: dismiss }
          : undefined
      }
    />
  );
}
