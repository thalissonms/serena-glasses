interface SectionHeaderProps {
  step: number;
  title: string;
}

export function SectionHeader({ step, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-7 h-7 flex items-center justify-center bg-brand-pink text-white font-poppins font-black text-xs border-2 border-black dark:border-white shrink-0">
        {step}
      </span>
      <h2 className="font-poppins font-black text-base uppercase tracking-wider">{title}</h2>
    </div>
  );
}
