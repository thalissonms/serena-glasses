"use client";
/**
 * Component: Modal — dialog chrome com Radix UI e estética Y2K Chrome.
 *
 * Overlay dark + frame com hard shadow pink + header com gradient pink→cyan.
 * Fecha no overlay, no X e via ESC. Suporta title, description, body e footer.
 *
 * Usado em: confirmações destrutivas e formulários modais do /admin.
 */
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode } from "react";
import { clsx } from "clsx";

type ModalSize = "sm" | "md" | "lg";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
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
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content
          className={clsx(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[calc(100vw-2rem)]",
            sizeMap[size],
            "bg-[#141414] border-2 border-[#FF00B6]/40 shadow-[8px_8px_0_#FF00B6] outline-none",
          )}
        >
          <div className="flex items-center justify-between px-5 py-3 bg-linear-to-r from-[#FF00B6]/15 via-[#00F0FF]/8 to-transparent border-b border-white/6">
            <Dialog.Title className="font-shrikhand text-white text-xl tracking-wide">
              {title}
            </Dialog.Title>
            <Dialog.Close className="flex items-center justify-center w-6 h-6 text-white/25 hover:text-[#FF00B6] transition-all duration-150 hover:shadow-[0_0_8px_#FF00B6]">
              <X size={13} />
            </Dialog.Close>
          </div>

          <div className="p-5">
            {description && (
              <Dialog.Description className="font-mono text-[10px] uppercase tracking-wider text-white/35 mb-4">
                {description}
              </Dialog.Description>
            )}
            {children}
          </div>

          {footer && (
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/6">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
