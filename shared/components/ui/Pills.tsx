import clsx from "clsx";

interface PillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}


export function Pill({ active, onClick, children }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex relative items-center gap-1.5 font-poppins font-bold text-xs uppercase tracking-wider",
        "px-3 py-2 border-2 border-black dark:border-brand-pink transition-all cursor-pointer",
        active
          ? "bg-brand-pink dark:bg-brand-dark-surface-0 text-brand-white shadow-[3px_3px_0px] dark:shadow-[3px_3px_0px] shadow-brand-black dark:shadow-brand-purple -translate-y-0.5"
          : [
              "bg-bg-brand-light-surface-2 dark:bg-brand-dark-surface-2",
              "text-brand-black dark:text-brand-white",
              "shadow-[2px_2px_0px] shadow-brand-black dark:shadow-brand-purple",
              "hover:bg-brand-pink hover:text-brand-white dark:hover:bg-brand-dark-surface-0",
              "hover:shadow-[3px_3px_0_#000] hover:-translate-y-0.5",
            ],
      )}
    >
      {children}
      <div className="w-full h-2 absolute bg-linear-0 from-brand-black/30 to-brand-black/0 dark:from-brand-black/25 dark:to-brand-black/0 bottom-0 right-0" />
      <div className="w-full h-8 absolute left-0 top-0 bg-linear-270 from-brand-black/10 to-transparent dark:from-brand-black/10 dark:to-transparent" />
      <div className="w-full h-full absolute inset-0 border-[1.5px] border-brand-black/40" />
    </button>
  );
}

export function PillY2K({ active, onClick, children }: PillProps) {
  return (
    <div className="relative bg-brand-pink-light/20 dark:bg-brand-purple/10 p-0.5 border-2 border-brand-black/5 shadow-[1px_1px_0px] shadow-brand-black/20 dark:shadow-brand-white/20 mt-1">
      <button
        onClick={onClick}
        className={clsx(
          "flex relative items-center gap-1.5 font-poppins font-bold text-xs uppercase tracking-wider",
          "px-3 py-2 border-3 transition-all duration-300 cursor-pointer",
          active
            ? [
                "bg-brand-pink dark:bg-brand-dark-surface-1 text-brand-white",
                "border-t-black/60 border-l-black/60 border-r-black/20 border-b-black/20 shadow-inner-[0px_0px_1px_1px]x",
                "dark:border-t-brand-black dark:border-brand-black dark:border-r-brand-white/40 dark:border-b-brand-white/40 shadow-brand-black/50",
              ]
            : [
                "bg-brand-pink-light dark:bg-brand-dark-surface-2",
                "text-brand-black/75 dark:text-brand-white",
                "shadow-[0px_0px_1px_1px] shadow-brand-black/40",
                "text-shadow-[1px_1px_1px] text-shadow-brand-black/20",
                "hover:bg-brand-pink hover:text-brand-white dark:hover:bg-brand-dark-surface-0",
                "border-t-black/25 border-l-black/25 border-r-black/60 border-b-black/60",
                "dark:border-t-white/40 dark:border-l-white/40 dark:border-r-white/5 dark:border-b-white/5",
              ],
        )}
      >
        <div
          className={clsx(
            "w-full h-full absolute inset-0 border",
            active
              ? "border-t-brand-black/40 border-brand-black/40 border-r-brand-white/25 border-b-brand-white/25 shadow-brand-black/50"
              : "border-brand-black/25",
          )}
        />
        {children}
      </button>
    </div>
  );
}