import { SmartLink } from "@shared/components/SmartLink";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

type Y2KIconButton = "lg" | "sm";

const BUTTON_SIZE: Record<Y2KIconButton, string> = {
  lg: "w-14 h-14",
  sm: "w-10 h-10",
};
const BUTTON_ATTRIBUTES_SIZE: Record<Y2KIconButton, string> = {
  lg: "w-10 h-10 top-1 left-1",
  sm: "w-7 h-7 top-0.5 left-0.5",
};
const BUTTON_ATTRIBUTES_STYLES: Record<Y2KIconButton, string> = {
  lg: "w-10 h-10 rounded-tl-[3px] rounded-bl-sm rounded-tr-sm rounded-br-xl",
  sm: "w-7 h-7 rounded-tl-[3px] rounded-bl-sx rounded-tr-xs rounded-br-sm",
};
const BUTTON_ICON_SIZE: Record<Y2KIconButton, string> = {
  lg: "w-6 h-6",
  sm: "w-4.25 h-4.25",
};

export interface ButtonNavActionProps {
  icon: LucideIcon;
  label: string;
  badge?: number;
  isActive?: boolean;
  href?: string;
  variant?: Y2KIconButton;
  onClick?: () => void;
}

const ButtonIconY2K = ({
  icon: Icon,
  label,
  badge,
  isActive = false,
  href,
  variant = "lg",
  onClick,
}: ButtonNavActionProps) => {
  const showBadge = typeof badge === "number" && badge > 0;

  const content = (
    <div
      className={clsx(
        BUTTON_SIZE[variant],
        "relative isolate bg-brand-pink-light rounded-md group transition-all duration-300",
        "border-4 border-brand-black/80 hover:border-brand-black cursor-pointer",
        "dark:bg-brand-purple dark:border-brand-dark-surface-0",
      )}
    >
      <div
        className={clsx(
          BUTTON_ATTRIBUTES_SIZE[variant],
          "z-3 absolute flex justify-center items-center",
        )}
      >
        <Icon
          className={clsx(
            BUTTON_ICON_SIZE[variant],
            "stroke-4 transition-all duration-300",
            isActive
              ? "text-brand-pink dark:text-brand-blue/90"
              : "text-brand-black/90 dark:text-brand-dark-surface-1/90 group-hover:text-brand-pink dark:group-hover:text-brand-blue/90",
          )}
        />
      </div>
      <div
        className={clsx(
          BUTTON_ATTRIBUTES_SIZE[variant],
          "z-3 absolute flex justify-center items-center",
        )}
      >
        <Icon
          className={clsx(
            BUTTON_ICON_SIZE[variant],
            "stroke-4 group-hover:text-brand-pink dark:group-hover:text-brand-blue/90  blur-lg transition-all duration-300",
            isActive
              ? "text-brand-pink dark:text-brand-blue/90"
              : "text-transparent",
          )}
        />
      </div>
      <div
        className={clsx(
          BUTTON_ATTRIBUTES_STYLES[variant],
          "z-2 absolute bg-brand-light-surface-0/35",
        )}
      />
      <div className="z-1 w-full h-full absolute rounded-[3.25px] border-3 border-b-brand-black/20 border-r-brand-black/40 border-t-brand-black/20 border-l-brand-black/40" />
      <div
        className={clsx(
          "z-5 absolute -top-2.5 -right-2 w-6.5 h-6.5 bg-brand-blue dark:bg-brand-pink border-2 border-brand-black rounded-full flex items-center justify-center shadow-[2px_2px_0px] shadow-brand-black dark:shadow-brand-blue transition-opacity duration-300",
          showBadge && variant === "lg" ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-xs font-poppins text-brand-black dark:text-brand-white font-bold">
          {badge! > 99 ? "99+" : badge}
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <SmartLink href={href} aria-label={label}>
        {content}
      </SmartLink>
    );
  }

  return (
    <button onClick={onClick} aria-label={label}>
      {content}
    </button>
  );
};

export default ButtonIconY2K;
