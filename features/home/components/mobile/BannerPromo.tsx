import { AnimatePresence, m, Variants } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

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
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          variants={slideDown}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ originY: 0 }}
          className="w-full h-20 relative bg-brand-light-surface-2 dark:bg-brand-dark-surface-2 flex items-center shadow-[4px_4px_0px] shadow-brand-black dark:shadow-brand-yellow border-2 border-brand-black justify-center"
        >
          <m.button
            className="absolute right-1 top-1 text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.55 } }}
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </m.button>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default BannerPromo;
