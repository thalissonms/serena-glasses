"use client";

import { AnimatePresence, m } from "framer-motion";
import { usePathname } from "next/navigation";

const INTERCEPTED_ROUTES = ["/wishlist", "/search", "/cart", "/checkout", "/products/"];

export default function ModalPresence({ modal }: { modal: React.ReactNode }) {
  const pathname = usePathname();

  const isInterceptedRoute = INTERCEPTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <AnimatePresence mode="wait">
      {isInterceptedRoute && modal ? (
        <m.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {modal}
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
