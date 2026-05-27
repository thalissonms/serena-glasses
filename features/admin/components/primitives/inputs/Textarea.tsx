import clsx from "clsx";
import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className, ...props }, ref) {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          className={clsx(
            "w-full bg-[#1a1a1a] border-2 px-3 py-2.5",
            "font-mono text-[12px] text-white placeholder:text-white/20",
            "focus:outline-none transition-all duration-150 resize-y",
            error
              ? "border-red-500/60 shadow-[0_0_8px_rgba(255,0,0,0.15)]"
              : "border-[#FF00B6]/20 focus:border-[#FF00B6] focus:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
            className,
          )}
        />
        {error && (
          <p className="font-mono text-[9px] uppercase tracking-wider text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export default Textarea;
