"use client";
import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";
import type { StepDirection } from "../../hooks/useCheckoutSteps";

const variants: Variants = {
  enter: (dir: StepDirection) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: StepDirection) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const transition = {
  x: { type: "spring" as const, stiffness: 320, damping: 34, mass: 0.9 },
  opacity: { duration: 0.18 },
};

interface StepSlideProps {
  direction: StepDirection;
  children: ReactNode;
}

/**
 * Wrapper de slide entre steps do checkout mobile.
 *
 * Precisa estar dentro de `<AnimatePresence mode="wait" custom={direction} initial={false}>`
 * no parent, e cada uso precisa de uma `key` única (geralmente o nome do step).
 */
export function StepSlide({ direction, children }: StepSlideProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
