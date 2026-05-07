import clsx from "clsx";

export function PolaroidProductCardSkeleton({ className }: { className?: string }) {
  return (
    <article
      aria-hidden
      className={clsx(
        "w-full bg-white border-2 border-black dark:border-brand-pink-light dark:bg-brand-pink-dark",
        "shadow-[2px_4px_0px] shadow-black dark:shadow-brand-blue animate-pulse",
        className,
      )}
    >
      {/* Photo area */}
      <div className="px-3 pt-3">
        <div className="relative aspect-square bg-brand-black/80 dark:bg-brand-black-dark overflow-hidden">
          <div className="absolute inset-6 bg-neutral-700/40 dark:bg-neutral-800/60" />
        </div>
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between mx-3 mt-4">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-40 bg-brand-pink/30 rounded-sm" />
          <div className="h-3 w-20 bg-brand-pink/20 rounded-sm" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
          <span className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
          <span className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
        </div>
      </div>

      {/* Description */}
      <div className="px-3 mt-3 space-y-1.5">
        <div className="h-3 w-11/12 bg-neutral-200 dark:bg-neutral-700 rounded-sm" />
        <div className="h-3 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded-sm" />
      </div>

      {/* Price + CTA */}
      <div className="px-3 pb-4 mt-4 flex items-end justify-between gap-3">
        <div className="h-7 w-24 bg-brand-pink/30 rounded-sm" />
        <div className="h-9 flex-1 bg-brand-pink/30 dark:bg-brand-blue/30 border-2 border-black dark:border-brand-pink-light shadow-[4px_3px_0] shadow-brand-black-dark dark:shadow-brand-pink" />
      </div>
    </article>
  );
}

export function ProductFeedSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="max-w-md mx-auto flex flex-col gap-6 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <PolaroidProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
