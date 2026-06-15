"use client";

import { AnimatePresence, m } from "framer-motion";

export default function ModalPresence({ modal }: { modal: React.ReactNode }) {

  if (!modal) return null;

  return (
    <AnimatePresence mode="wait">
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {modal}
      </m.div>
    </AnimatePresence>
  );
}
