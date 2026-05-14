"use client";

import { MessageCircle } from "lucide-react";
import { useSiteSetting } from "@shared/hooks/useSiteSettings";
import { useTranslation } from "react-i18next";

export function WhatsAppFloat() {
  const { data } = useSiteSetting("whatsapp");
  const { t } = useTranslation("nav");
  if (!data?.enabled) return null;

  const url = `https://wa.me/${data.phone}?text=${encodeURIComponent(data.message_pt)}`;
  const positionClass = data.position === "bottom-left" ? "left-4" : "right-4";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className={`fixed bottom-20 ${positionClass} z-40 w-14 h-14 bg-[#25D366] border-2 border-black shadow-[4px_4px_0_#000] flex items-center justify-center hover:scale-110 transition-transform`}
    >
      <MessageCircle size={28} className="text-white" fill="currentColor" />
    </a>
  );
}
