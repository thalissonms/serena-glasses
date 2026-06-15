"use client";
/**
 * Component: AdminV2Toaster — wrapper do Sonner com estética Y2K Chrome.
 *
 * Toasts com bg dark, border pink, hard shadow e fonte monospace.
 * Variantes de sucesso (cyan), erro (red) e warning (gold) com shadows respectivas.
 *
 * Usado em: src/app/admin/layout.tsx.
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
            "!bg-[#0a0a0a] !border !border-brand-pink/30 !rounded-none",
            "!shadow-[4px_4px_0_var(--brand-pink)] !font-mono !text-base !text-white",
          ].join(" "),
          title: "!font-mono !text-[12px] !uppercase !tracking-widest !text-white",
          description: "!font-mono !text-[11px] !text-white/40",
          success: "!border-brand-pink/30 !shadow-[4px_4px_0_brand-pink]",
          error: "!border-red-500/30 !shadow-[4px_4px_0_#ff3344]",
          warning: "!border-[#FFD700]/30 !shadow-[4px_4px_0_#FFD700]",
          closeButton: "!bg-transparent !border-0 !text-white/25 hover:!text-brand-pink",
          actionButton: [
            "!bg-brand-pink !text-black !font-mono !text-[11px]",
            "!uppercase !tracking-widest !rounded-none",
          ].join(" "),
        },
      }}
    />
  );
}
