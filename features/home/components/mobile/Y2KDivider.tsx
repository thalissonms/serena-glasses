export const Y2KDivider = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3${className ? ` ${className}` : ""}`}>
    <div className="min-w-[30vw] flex-1 border-t border-dashed border-brand-pink-dark dark:border-brand-pink-light" />
    <span className="text-brand-pink-dark dark:text-brand-pink-light text-xs">✦</span>
    <div className="min-w-[30vw] flex-1 border-t border-dashed border-brand-pink-dark dark:border-brand-pink-light" />
  </div>
);
