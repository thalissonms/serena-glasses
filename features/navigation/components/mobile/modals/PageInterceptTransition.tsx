"use client";

import { motion, PanInfo, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { useMounted } from "@shared/hooks/useMounted";
import { useIsDesktop } from "@shared/hooks/useIsDesktop";

type Props = {
  children: ReactNode;
};

export default function PageInterceptTransition({ children }: Props) {
  const router = useRouter();
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const enabled = mounted && !isDesktop;

  useEffect(() => {
    if (!enabled) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    controls.start({
      x: 0,
      transition: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 },
    });
  }, [controls, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const focusableSelectors =
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const initial = getFocusable();
    if (initial.length > 0) initial[0].focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        router.back();
        return;
      }
      if (e.key === "Tab") {
        const items = getFocusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [router, enabled]);

  const handleDragEnd = async (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = window.innerWidth * 0.4;
    const { x: draggedDistance } = info.offset;
    const { x: velocity } = info.velocity;

    if (draggedDistance > threshold || velocity > 900) {
      await controls.start({
        x: "100%",
        transition: { duration: 0.2, ease: "easeOut" },
      });
      router.back();
      return;
    }

    controls.start({
      x: 0,
      transition: { type: "spring", stiffness: 400, damping: 40 },
    });
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-100 bg-brand-pink-light dark:bg-brand-pink-bg-dark overflow-y-auto min-h-screen touch-pan-y"
      initial={{ x: "100%" }}
      animate={controls}
      exit={{ x: "100%" }}
      drag="x"
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.08 }}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onDrag={(_, info) => {
        if (info.offset.x < 0) controls.set({ x: 0 });
      }}
    >
      {children}
    </motion.div>
  );
}
