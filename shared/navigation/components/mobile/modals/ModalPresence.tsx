"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ModalPresence({ modal }: { modal: React.ReactNode }) {

  if (!modal) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {modal}
      </motion.div>
    </AnimatePresence>
  );
}
