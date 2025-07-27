"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StackedPolaroids } from "./StackedPolaroids";

const productImages = [
  "/products/1.png",
  "/products/2.png",
  "/products/3.png",
  "/products/4.png",
  "/products/5.png",
  "/products/6.png",
];

const useGeneratedStars = (count: number) => {
  const [stars, setStars] = useState<
    Array<{
      size: number;
      x: number;
      y: number;
      duration: number;
      delay: number;
    }>
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStars(
      Array.from({ length: count }).map(() => ({
        size: Math.random() * 6 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 2 + 1.5,
        delay: Math.random() * 5,
      }))
    );
  }, [count]);

  return { stars, mounted };
};

const Showcase = () => {
  const { stars, mounted } = useGeneratedStars(30);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary to-pink-light/80 min-h-[560px] w-full">
      <div className="absolute inset-0 z-0">
        <StackedPolaroids productImages={productImages} />
      </div>

      {mounted && (
        <div className="absolute inset-0 z-5">
          {stars.map((star, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.2, 1, 0] }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                repeatType: "loop",
                delay: star.delay,
              }}
              className="absolute bg-pink-200 rounded-full blur-[2px]"
              style={{
                width: star.size,
                height: star.size,
                top: `${star.y}%`,
                left: `${star.x}%`,
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-center items-center z-20 bg-white/5 backdrop-blur-[0.8px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
          animate={{ opacity: 0.95, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          whileHover={{ scale: 1.02, rotate: 1, opacity: 1 }}
          className="relative w-[300px] md:w-[475px] h-[220px] md:h-[350px] mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
        >
          <Image
            src="/logos/logo-adesive.svg"
            alt="Logo da Serena Glasses"
            fill
            aria-hidden="true"
            className="opacity-95"
          />
        </motion.div>
        <motion.button
          className="group flex items-center justify-center w-full sm:w-auto px-1 sm:px-2 md:p-3 rounded-xs bg-primary shadow-[6px_4px_0px_1px_rgba(0,0,0,0.9)] active:shadow-none hover:bg-pink-500 transition-all duration-200"
          whileTap={{ scale: 0.95 }}
          transition={{ type: "inertia" }}
        >
          <span className="border-2 border-pink-light/80 rounded-xs text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-pink-50/90 group-hover:text-white transition-all duration-200 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-center">
            Explorar Coleção
          </span>
        </motion.button>
      </div>
    </section>
  );
};

export default Showcase;
