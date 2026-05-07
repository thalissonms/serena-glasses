import clsx from "clsx";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx(
        "relative bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink-light shadow-[4px_4px_0px] shadow-brand-black-dark dark:shadow-brand-blue animate-pulse",
        className,
      )}
    >
      {/* Image area */}
      <div className="relative aspect-square bg-pink-50/60 dark:bg-[#0a0a0a] overflow-hidden border-b-2 border-black dark:border-brand-pink-light/60">
        <div className="absolute inset-6 bg-pink-100/70 dark:bg-neutral-800" />
      </div>

      {/* Info */}
      <div className="relative min-h-56 p-3 sm:p-4 space-y-2">
        <div className="h-3 w-1/3 bg-brand-pink/30 rounded-sm" />
        <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
        <div className="h-3 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded-sm hidden sm:block" />

        <div className="flex items-center gap-1 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="w-3 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-sm"
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="w-3.5 h-3.5 rounded-full bg-neutral-200 dark:bg-neutral-700"
            />
          ))}
        </div>

        <div className="absolute bottom-4 right-5">
          <div className="h-6 w-20 bg-brand-pink/30 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
