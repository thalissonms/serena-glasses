function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-white/5" />
      <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
        {label}
      </span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}
export default SectionDivider;
