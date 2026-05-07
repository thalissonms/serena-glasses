import { Glasses, Stars } from "lucide-react";

const HeaderDivider = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center gap-1 px-4">
      <div className="flex items-center justify-center gap-2 w-full">
        <div className="flex-1 h-px bg-brand-pink/50 dark:bg-brand-yellow/50" />
        <Stars
          className="text-brand-pink dark:text-brand-yellow -mr-1"
          size={16}
        />
        <h2 className="text-brand-pink dark:text-brand-yellow text-xl tracking-wide font-shrikhand shrink-0 capitalize">
          {title}
        </h2>
        <Glasses
          className="text-brand-pink dark:text-brand-yellow -ml-1"
          size={16}
        />
        <div className="flex-1 h-px bg-brand-pink/50 dark:bg-brand-yellow/50" />
      </div>
    </div>
  );
};
export default HeaderDivider;
