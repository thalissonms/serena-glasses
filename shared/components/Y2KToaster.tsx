"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { y2kToast, type Y2KToastItem } from "@shared/lib/y2kToast";
import clsx from "clsx";

const DURATION = 5000;

export function Y2KToaster() {
  const [toasts, setToasts] = useState<Y2KToastItem[]>([]);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    const timers = new Map<string, ReturnType<typeof setTimeout>>();

    const unsubscribe = y2kToast._subscribe((item) => {
      setToasts((prev) => [...prev, item]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id));
        timers.delete(item.id);
      }, DURATION);
      timers.set(item.id, timer);
    });

    return () => {
      unsubscribe();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-3 pointer-events-none w-[min(20rem,calc(100vw-2rem))]"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className={clsx(
              "pointer-events-auto relative overflow-hidden border-[3px] border-black font-poppins",
              t.type === "error"
                ? "bg-[#FFF0FA] shadow-[5px_5px_0_0_#FF00B6]"
                : "bg-white shadow-[5px_5px_0_0_#000] border-brand-pink",
            )}
          >
            <div className="px-4 pt-3 pb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 text-brand-pink font-mono">
                {t.type === "error" ? "// erro !!" : ">> ok !"}
              </p>
              <p className="text-black text-[13px] font-semibold leading-snug pr-5">
                {t.message}
              </p>
            </div>

            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: DURATION / 1000, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className="absolute bottom-0 left-0 h-[3px] w-full bg-brand-pink"
            />

            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Fechar"
              className="absolute top-2 right-2 text-black/40 hover:text-black transition-colors cursor-pointer"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
