import { AnimatePresence, m, Variants } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@shared/providers/ThemeProvider";

const slideDown: Variants = {
  initial: { opacity: 0, y: -60, scaleY: 0.8 },
  animate: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { type: "spring", stiffness: 280, damping: 22, delay: 0.25 },
  },
  exit: {
    opacity: 0,
    y: -40,
    scaleY: 0.9,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const BannerPromo = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          variants={slideDown}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ originY: 0 }}
          className="relative isolate mt-5 flex h-16 w-full items-center justify-center"
        >
          <m.button
            className="absolute top-1 left-1 z-50 text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.55 } }}
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </m.button>
          <Image
            src={
              currentTheme === "dark" ?
                "/backgrounds/bg-sale-dark.png" :
                "/backgrounds/bg-sale.png"
            }
            alt={"sale"}
            width={1920}
            height={1080}
            priority
            quality={100}
            role="img"
            className="-mt-5 -ml-1 drop-shadow-[2px_-2px_0px] drop-shadow-brand-purple dark:drop-shadow-brand-dark-surface-2"
          />
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default BannerPromo;
