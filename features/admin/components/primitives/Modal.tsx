"use client";
/**
 * Component: Modal — dialog chrome com Radix UI e estética Y2K Chrome.
 * Component: Modal — Dialog base com estética Cyber HUD.
 */
import { type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { clsx } from "clsx";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={clsx(
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-0",
            "border border-brand-pink/30 bg-[#050505] shadow-[0_0_30px_rgba(255,0,182,0.1),inset_0_0_20px_rgba(255,0,182,0.02)]",
            "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            sizeClasses[size],
          )}
        >
          {/* Cyber accents */}
          <div className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-brand-pink"></div>
          <div className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-brand-pink"></div>
          <div className="absolute -left-1 -bottom-1 h-3 w-3 border-l-2 border-b-2 border-brand-pink"></div>
          <div className="absolute -right-1 -bottom-1 h-3 w-3 border-r-2 border-b-2 border-brand-pink"></div>

          <div className="flex flex-col space-y-1 border-b border-brand-pink/20 px-6 py-4 bg-brand-pink/5">
            <div className="flex items-center justify-between">
              <Dialog.Title className="font-poppins text-lg font-bold text-brand-pink uppercase tracking-wide">
                {title}
              </Dialog.Title>
              <Dialog.Close className="rounded-none opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2 focus:ring-offset-[#050505] disabled:pointer-events-none data-[state=open]:bg-white/10 data-[state=open]:text-white/50">
                <X className="h-4 w-4 text-brand-pink" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>
            {description && (
              <Dialog.Description className="font-mono text-[12px] uppercase tracking-widest text-white/40">
                // {description}
              </Dialog.Description>
            )}
          </div>

          <div className="px-6 py-6 overflow-y-auto max-h-[70vh] bg-[#0a0a0a]">
            {children}
          </div>

          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-brand-pink/20 bg-[#050505] px-6 py-4">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
