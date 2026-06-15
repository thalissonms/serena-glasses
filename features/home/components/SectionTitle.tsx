import clsx from "clsx";
import { m } from "framer-motion";

export default function SectionTitle({ title }: { title: string }) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
        >
            <div className="grid *:[grid-area:1/1] text-center">
                <h1 className="ml-0.5 font-poppins text-lg sm:text-2xl font-semibold tracking-[0.3em] text-brand-blue dark:text-brand-pink text-shadow-[1px_1px_0px] text-shadow-brand-black uppercase">
                    {title}
                </h1>
                <h1 className={clsx("ml-0.5 font-poppins text-lg sm:text-2xl font-semibold tracking-[0.3em] text-gray-500 uppercase dark:text-brand-pink-light",
                    "text-transparent [-webkit-text-stroke:1.5px_rgba(255,0,182,1)] [text-stroke:1.5px_rgba(255,0,182,1)] dark:[-webkit-text-stroke:1.5px_rgba(155,0,255,0.75)] dark:[text-stroke:1.5px_rgba(155,0,255,0.75)]"
                )}>
                    {title}
                </h1>
            </div>
            <div className="-mt-2 flex items-center justify-center gap-2">
                <div className="h-0.5 w-[30vw] bg-brand-pink/40 dark:bg-brand-purple/40 pt-px" />
                <div className="grid *:[grid-area:1/1]">
                    <span className="text-2xl text-brand-pink dark:text-brand-purple/75 sm:text-3xl text-shadow-[1px_1px_0px] text-shadow-brand-black">✦</span>
                    <span className="text-base text-brand-white/30 dark:text-brand-white/25 sm:text-lg ml-[3.25px] mt-[4.25px] sm:ml-1.25 sm:mt-1.25">✦</span>
                </div>
                <div className="h-0.5 w-[30vw] bg-brand-pink/40 dark:bg-brand-purple/40 pt-px" />
            </div>
        </m.div>
    )
}