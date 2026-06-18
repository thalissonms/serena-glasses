export function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-brand-pink/10 animate-pulse">
      <div className="w-16 h-16 shrink-0 bg-brand-pink/10 border border-black/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-brand-pink/10 rounded w-3/4" />
        <div className="h-2 bg-brand-pink/10 rounded w-1/3" />
        <div className="h-3 bg-brand-pink/15 rounded w-1/4" />
      </div>
    </div>
  );
}
