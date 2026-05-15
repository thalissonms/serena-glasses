"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { goldenAngle, goldenOffsetX } from "../utils/goldenRatioAngles";

interface PolaroidProduct {
  image: string;
  name: string;
  price: string;
}

interface HeroPolaroidsProps {
  products: PolaroidProduct[];
}

/** How many polaroids are visible in the stack at once */
const STACK_SIZE = 4;

/**
 * Falling-polaroid slide.
 *
 * - Cycles through the `products` array infinitely.
 * - Every interval a new polaroid "falls" onto the stack from above.
 * - The newest (top) polaroid is the featured one → bigger.
 * - Each polaroid is rotated using golden-ratio angles for organic feel.
 * - Oldest polaroid in the stack fades out as new ones arrive.
 * - Name + price appear as handwritten annotations (Yellowtail).
 */
export function HeroPolaroids({ products }: HeroPolaroidsProps) {
  const [stack, setStack] = useState<number[]>(() =>
    Array.from({ length: STACK_SIZE }, (_, i) => i % products.length)
  );
  const [counter, setCounter] = useState(STACK_SIZE);

  const dropNext = useCallback(() => {
    setStack((prev) => {
      const next = [...prev, counter % products.length];
      // Keep only the last STACK_SIZE + 1 so AnimatePresence can animate exit
      if (next.length > STACK_SIZE + 1) next.shift();
      return next;
    });
    setCounter((c) => c + 1);
  }, [counter, products.length]);

  // Auto-advance every 3s
  useEffect(() => {
    const timer = setInterval(dropNext, 3000);
    return () => clearInterval(timer);
  }, [dropNext]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence initial={false}>
        {stack.map((productIdx, stackPos) => {
          const isTop = stackPos === stack.length - 1;
          const depthFromTop = stack.length - 1 - stackPos;
          const rotation = goldenAngle(stackPos, 15);
          const offsetX = goldenOffsetX(stackPos, 25);

          // Deeper cards are smaller, less opaque
          const scale = isTop ? 1 : Math.max(0.78, 1 - depthFromTop * 0.06);
          const opacity = isTop ? 1 : Math.max(0.3, 1 - depthFromTop * 0.2);

          return (
            <motion.div
              key={`${counter - stack.length + stackPos}-${productIdx}`}
              initial={{
                y: -350,
                rotate: rotation * 2,
                opacity: 0,
                scale: 0.7,
                x: offsetX,
              }}
              animate={{
                y: depthFromTop * 6,
                rotate: isTop ? 0 : rotation,
                opacity,
                scale,
                x: isTop ? 0 : offsetX,
              }}
              exit={{
                opacity: 0,
                scale: 0.6,
                y: 30,
                transition: { duration: 0.4 },
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                mass: 1.2,
              }}
              className="absolute cursor-pointer"
              style={{ zIndex: stackPos + 1 }}
            >
              <PolaroidCard
                product={products[productIdx]}
                isFeatured={isTop}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function PolaroidCard({
  product,
  isFeatured,
}: {
  product: PolaroidProduct;
  isFeatured: boolean;
}) {
  return (
    <div
      className={`
        bg-white rounded-sm shadow-xl transition-shadow duration-300
        noise-overlay-white noise-overlay-blend
        ${isFeatured
          ? "w-44 sm:w-52 md:w-62 lg:w-72 xl:w-80 shadow-[0_8px_40px_rgba(255,0,182,0.3)]"
          : "w-36 sm:w-40 md:w-48 lg:w-52 xl:w-58 shadow-lg"
        }
      `}
    >
      {/* Photo area */}
      <div className={isFeatured ? "p-2 sm:p-2.5 md:p-3" : "p-1.5 sm:p-2"}>
        <div className="relative w-full aspect-square bg-pink-50/80 rounded-sm overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 80vw, 400px"
            className="object-contain p-2 sm:p-3"
            draggable={false}
          />
        </div>
      </div>

      {/* Handwritten annotation — name + price (Yellowtail) */}
      <div className={`px-2 text-center ${isFeatured ? "pb-3 sm:pb-4" : "pb-2 sm:pb-2.5"}`}>
        <p
          className={`
            font-yellowtail text-gray-600 leading-tight
            ${isFeatured
              ? "text-sm sm:text-base md:text-lg -rotate-1"
              : "text-xs sm:text-sm -rotate-2"
            }
          `}
        >
          {product.name}
        </p>
        <p
          className={`
            font-yellowtail text-brand-pink leading-tight mt-0.5
            ${isFeatured
              ? "text-lg sm:text-xl md:text-2xl -rotate-1"
              : "text-base sm:text-lg -rotate-2"
            }
          `}
        >
          {product.price}
        </p>
      </div>
    </div>
  );
}
