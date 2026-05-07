"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface StoryViewerShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}


export function StoryViewerShell({ isOpen, onClose, children }: StoryViewerShellProps) {
  const { t } = useTranslation("home");
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Inert: isola todo conteúdo de body fora do overlay para leitores de tela e foco
  useEffect(() => {
    if (!isOpen) return;
    const siblings = Array.from(document.body.children).filter(
      (el) => !el.hasAttribute("data-story-overlay"),
    ) as HTMLElement[];
    siblings.forEach((el) => el.setAttribute("inert", ""));
    return () => siblings.forEach((el) => el.removeAttribute("inert"));
  }, [isOpen]);

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!portalTarget) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            data-story-overlay=""
            key="story-backdrop"
            className="fixed inset-0 z-60 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />

          {/* Painel principal */}
          <motion.div
            data-story-overlay=""
            key="story-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t("storyViewer.title")}
            className="fixed inset-0 z-61 bg-black touch-none overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragMomentum={false}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    portalTarget,
  );
}
