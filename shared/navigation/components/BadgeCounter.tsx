export default function BadgeCounter({ count }: { count: number }) {
    if (count === 0) return null;
    return (
        <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-pink dark:bg-brand-purple text-brand-white text-[9px] font-black flex items-center justify-center border-[1.5px] shadow-[1px_1px_0px] shadow-brand-black dark:shadow-brand-blue border-brand-black"
        >
            {count > 9 ? "9+" : count}
        </span>
    );
}