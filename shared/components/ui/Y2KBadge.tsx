import { SparklesIcon, StarIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function Y2KBadge({ text }: { text: string }) {
  return (
    <div
      className={clsx(
        "transition-all duration-150 pr-0.75 pb-0.75 relative justify-center mt-2",
        "bg-brand-black dark:bg-brand-purple flex",
        "[clip-path:polygon(0%_0%,calc(100%-10px)_0%,100%_10px,100%_100%,calc(0%+10px)_100%,0%_calc(100%-10px))]",
      )}
    >
      <div
        className={clsx(
          "transition-all duration-150 w-50 p-0.5 relative justify-center",
          "bg-brand-pink dark:bg-brand-pink-light flex",
          "[clip-path:polygon(0%_0%,calc(100%-10px)_0%,100%_10px,100%_100%,calc(0%+10px)_100%,0%_calc(100%-10px))]",
        )}
      >
        <div
          className={clsx(
            "transition-all duration-150 w-50 h-6 relative isolate bg-brand-blue/90 justify-center",
            " dark:bg-brand-dark-surface-1/90 flex",
            "[clip-path:polygon(0%_0%,calc(100%-10px)_0%,100%_10px,100%_100%,calc(0%+10px)_100%,0%_calc(100%-10px))]",
          )}
        >
          <SparklesIcon className="w-3 h-3 text-brand-pink dark:text-brand-blue absolute left-2 top-1/4" />
          <span className="transition-all duration-150 font-family-mono font-black italic text-base text-brand-black dark:text-brand-pink-light">
            {text}
          </span>
          <StarIcon className="w-3 h-3 text-brand-pink dark:text-brand-blue absolute right-2 top-1/4" />
          <div className="w-full h-2 bg-brand-blue dark:bg-brand-dark-surface-1 absolute bottom-0 left-0 -z-1 transition-all duration-150" />
        </div>
      </div>
    </div>
  );
}
