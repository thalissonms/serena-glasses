import { SparklesIcon, StarIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function Y2KBadge({
  text,
  size = "default",
}: {
  text: string;
  size?: "default" | "mobile";
}) {
  const isMobile = size === "mobile";
  const clipPath = isMobile
    ? "[clip-path:polygon(0%_0%,calc(100%-6px)_0%,100%_6px,100%_100%,calc(0%+6px)_100%,0%_calc(100%-6px))]"
    : "[clip-path:polygon(0%_0%,calc(100%-10px)_0%,100%_10px,100%_100%,calc(0%+10px)_100%,0%_calc(100%-10px))]";

  return (
    <div
      className={clsx(
        "transition-all duration-150 relative justify-center",
        "bg-brand-black dark:bg-brand-purple flex",
        isMobile ? "pr-0.5 pb-0.5 mt-1" : "pr-0.75 pb-0.75 mt-2",
        clipPath,
      )}
    >
      <div
        className={clsx(
          "transition-all duration-150 w-full relative justify-center",
          "bg-brand-pink dark:bg-brand-pink-light flex",
          isMobile ? "p-px" : "p-0.5",
          clipPath,
        )}
      >
        <div
          className={clsx(
            "transition-all duration-150 w-full relative isolate bg-brand-blue/90 justify-center",
            "dark:bg-brand-dark-surface-1/90 flex",
            isMobile ? "h-4" : "h-6",
            clipPath,
          )}
        >
          <SparklesIcon
            className={clsx(
              "text-brand-pink dark:text-brand-blue absolute top-1/4",
              isMobile ? "w-2 h-2 left-1.5" : "w-3 h-3 left-2",
            )}
          />
          <span
            className={clsx(
              "transition-all duration-150",
              isMobile
                ? "px-6 font-family-mono italic font-bold text-[12px] text-brand-black dark:text-brand-pink-light"
                : "px-10 font-family-mono font-black italic text-base text-brand-black dark:text-brand-pink-light",
            )}
          >
            {text}
          </span>
          <StarIcon
            className={clsx(
              "text-brand-pink dark:text-brand-blue absolute top-1/4",
              isMobile ? "w-2 h-2 right-1.5" : "w-3 h-3 right-2",
            )}
          />
          <div
            className={clsx(
              "w-full absolute bottom-0 left-0 -z-1 transition-all duration-150 bg-brand-blue dark:bg-brand-dark-surface-1",
              isMobile ? "h-1" : "h-2",
            )}
          />
        </div>
      </div>
    </div>
  );
}
