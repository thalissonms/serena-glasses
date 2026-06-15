"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { ReactNode } from "react";

export function AnimationProvider({ children }: { children: ReactNode }) {
  return (
    // strict mode throws an error if motion is imported directly instead of m
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
