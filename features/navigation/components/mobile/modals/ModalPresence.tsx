"use client";

import { AnimatePresence } from "framer-motion";

export default function ModalPresence({ modal }: { modal: React.ReactNode }) {
  return <AnimatePresence>{modal}</AnimatePresence>;
}
