import clsx from "clsx";

type BadgeVariant = "new" | "sale" | "outlet" | "soldOut";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  new: "bg-brand-pink text-white border-brand-black shadow-brand-black",
  sale: "bg-brand-black text-white border-brand-pink shadow-brand-pink",
  outlet:
    "bg-brand-blue text-brand-black border-brand-black shadow-brand-black",
  soldOut: "bg-brand-danger text-white border-brand-black shadow-brand-black",
};
const BADGEY2K_STYLES: Record<BadgeVariant, string> = {
  new: "bg-brand-purple text-brand-white/90",
  sale: "bg-brand-blue text-brand-black/80",
  outlet: "bg-brand-yellow text-brand-black/80",
  soldOut: "bg-brand-danger text-white",
};
const BADGEY2K_GLASS_STYLES: Record<BadgeVariant, string> = {
  new: "bg-brand-white/35",
  sale: "bg-brand-white/70",
  outlet: "bg-brand-white/70",
  soldOut: "bg-brand-white/50",
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export function ProductBadgeY2K({ variant, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        "text-[12px] isolate relative font-black font-poppins uppercase py-0.75 px-2 rounded-sm rounded-br-lg border-2 border-brand-black/80",

        BADGEY2K_STYLES[variant],
      )}
    >
      <div className={clsx("-z-1 absolute w-[95%] h-[75%] left-0 top-0 rounded-br-lg", BADGEY2K_GLASS_STYLES[variant])} />
      {children}
    </span>
  );
}
function ProductBadge({ variant, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        "text-[9px] sm:text-[10px] font-black font-poppins uppercase px-2 py-0.75 border shadow-[2px_2px_0px]",
        BADGE_STYLES[variant],
      )}
    >
      {children}
    </span>
  );
}

export default ProductBadge;
