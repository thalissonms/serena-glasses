"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export const useSmartBack = (fallback: string) => {
  const router = useRouter();

  return useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }, [router, fallback]);
};
