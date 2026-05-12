"use client";

import { motion, PanInfo, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};

export default function PageInterceptTransition({ children }: Props) {
  const router = useRouter();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: 0,
      transition: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 },
    });
  }, [controls]);

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
      className="fixed inset-0 z-[100] bg-white overflow-y-auto touch-pan-y"
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