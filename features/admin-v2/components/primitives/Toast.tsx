"use client";
/**
 * Component: AdminV2Toaster — wrapper do Sonner com estética Y2K Chrome.
 *
 * Toasts com bg dark, border pink, hard shadow e fonte monospace.
 * Variantes de sucesso (cyan), erro (red) e warning (gold) com shadows respectivas.
 *
 * Usado em: src/app/admin-v2/layout.tsx.
 */
import { Toaster } from "sonner";

export function AdminV2Toaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: [
            "!bg-[#1a1a1a] !border !border-[#FF00B6]/30 !rounded-none",
            "!shadow-[4px_4px_0_#FF00B6] !font-mono !text-xs !text-white",
          ].join(" "),
          title: "!font-mono !text-[10px] !uppercase !tracking-widest !text-white",
          description: "!font-mono !text-[9px] !text-white/40",
          success: "!border-[#00F0FF]/30 !shadow-[4px_4px_0_#00F0FF]",
          error: "!border-red-500/30 !shadow-[4px_4px_0_#ff3344]",
          warning: "!border-[#FFD700]/30 !shadow-[4px_4px_0_#FFD700]",
          closeButton: "!bg-transparent !border-0 !text-white/25 hover:!text-[#FF00B6]",
          actionButton: [
            "!bg-[#FF00B6] !text-black !font-mono !text-[9px]",
            "!uppercase !tracking-widest !rounded-none",
          ].join(" "),
        },
      }}
    />
  );
}
