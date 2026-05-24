interface SectionHeaderProps {
  step: number;
  title: string;
}

export function SectionHeaderMobile({ step, title }: SectionHeaderProps) {
  return (
    <div className="w-82 flex items-start gap-3 mb-5">
      <span className="flex flex-col">
        <h2 className="text-brand-black/80 font-family-poppins font-bold text-2xl tracking-wider">
          {title}
        </h2>
        <p className="text-sm text-fuchsia-950/60">Diga onde você deseja que entregamos seus produtos</p>
      </span>
    </div>
  );
}
