"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface PopupButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

interface CapturePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  primaryButton: PopupButton;
  secondaryButton?: PopupButton;
  showOverlay?: boolean;
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
}

export function CapturePopup({
  isOpen,
  onClose,
  title,
  description,
  primaryButton,
  secondaryButton,
  showOverlay = true,
  closeOnOverlay = true,
  showCloseButton = true,
}: CapturePopupProps) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => setTarget(document.body), []);

  useEffect(() => {
    if (!isOpen) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!target) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {showOverlay && (
            <motion.div
              key="popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeOnOverlay ? onClose : undefined}
              className="fixed inset-0 z-[70] bg-black/70"
              aria-hidden="true"
            />
          )}
          <motion.div
            key="popup-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-white dark:bg-brand-black-dark border-2 border-black dark:border-brand-pink-light shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#FF00B6] max-w-md w-full p-6 pointer-events-auto">
              {showCloseButton && (
                <button
                  onClick={onClose}
                  aria-label="Fechar"
                  className="absolute top-2 right-2 p-1 hover:text-brand-pink"
                >
                  <X size={20} />
                </button>
              )}
              <h3 className="font-shrikhand text-2xl text-brand-pink mb-2">{title}</h3>
              {description && (
                <p className="font-poppins text-sm text-foreground/80 mb-5">{description}</p>
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={primaryButton.onClick}
                  className="w-full py-3 bg-brand-pink border-2 border-black shadow-[4px_4px_0] shadow-brand-blue font-poppins font-bold uppercase tracking-wide text-white text-sm active:shadow-[2px_2px_0] transition-all cursor-pointer"
                >
                  {primaryButton.label}
                </button>
                {secondaryButton && (
                  <button
                    type="button"
                    onClick={secondaryButton.onClick}
                    className="w-full py-2 font-poppins text-xs uppercase tracking-wide text-foreground/60 hover:text-foreground"
                  >
                    {secondaryButton.label}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    target,
  );
}
