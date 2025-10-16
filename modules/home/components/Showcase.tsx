"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StackedPolaroids } from "./StackedPolaroids";
import { HeaderButton } from "./buttons";
import { useGeneratedStars } from "../utils";

const productImages = [
  "/products/1.png",
  "/products/2.png",
  "/products/3.png",
  "/products/4.png",
  "/products/5.png",
  "/products/6.png",
];


const Showcase = () => {
  const { stars, mounted } = useGeneratedStars(25);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-pink bg-[url('/backgrounds/bg-clipper-gradient.png')] bg-no-repeat bg-cover bg-blend-multiply bg-center to-white/90 min-h-[600px] md:min-h-[900px] w-full -mt-24">
      <div className="absolute bottom-0 z-10 w-full noise-overlay-blend" />

      <div className="absolute inset-0 z-0 opacity-75">
        <StackedPolaroids productImages={productImages} />
      </div>

      <div className="absolute bottom-0 z-30 w-full h-10 md:h-14 lg:h-18 xl:h-24 bg-gradient-to-t from-white via-white/40 to-transparent" />

      {mounted && (
        <div className="absolute inset-0 z-15">
          {stars.map((star, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.3, 1, 0] }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                repeatType: "loop",
                delay: star.delay,
                ease: "easeInOut",
              }}
              className="absolute bg-pink-200/80 rounded-full blur-[1.5px]"
              style={{
                top: `${star.y}%`,
                left: `${star.x}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                ["--size" as string]: `${star.size}`,
              }}
              data-size
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center z-40 backdrop-blur-[1px] px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 md:pt-28 lg:pt-36 pb-10 sm:pb-14 md:pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.98, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:w-[50%] flex flex-col items-center gap-y-12 sm:gap-y-16 md:gap-y-20 lg:gap-y-24"
        >
          <motion.div
            initial={{ y: -30, opacity: 0, rotate: -10 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Image
              src="/logos/logo-stick-gradient-main.png"
              alt="Logo da Serena Glasses"
              width={575}
              height={575}
              priority
              className="w-52 sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[32rem] object-contain drop-shadow-lg -rotate-4"
              role="img"
            />
          </motion.div>
          {/* <HeaderButton /> */}
        </motion.div>
      </div>
    </section>
  );
};

export default Showcase;
