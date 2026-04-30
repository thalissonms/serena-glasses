"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StackedPolaroids } from "./StackedPolaroids";
import { useGeneratedStars } from "../utils/generatedStars";
import { useTranslation } from "react-i18next";
import { useTheme } from "@shared/providers/ThemeProvider";

const polaroidImages = [
  "/products/1.png",
  "/products/2.png",
  "/products/3.png",
  "/products/4.png",
  "/products/5.png",
  "/products/6.png",
];

const Showcase = () => {
  const { stars, mounted } = useGeneratedStars(25);
  const { t } = useTranslation("home");
  const { theme, resolvedTheme } = useTheme();

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-brand-pink bg-[url('/backgrounds/bg-clipper-gradient.png')] dark:bg-[url('/backgrounds/bg-clipper-gradient-dark.png')] bg-no-repeat bg-cover bg-blend-multiply dark:bg-blend-screen bg-center to-white/90 dark:to-brand-pink-bg-dark/10 h-[72.4vh] w-full -mt-24">
      {/* Background polaroids (subdued) */}
      <div className="absolute inset-0 z-0 opacity-50 dark:opacity-40">
        <StackedPolaroids productImages={polaroidImages} />
      </div>

      {/* Bottom fade to background */}
      <div className="absolute bottom-0 z-30 w-full h-2 md:h-4 lg:h-6 xl:h-8 bg-linear-to-t from-white dark:from-brand-pink-bg-dark via-white/40 dark:via-brand-pink-bg-dark/40 to-transparent" />

      {/* Sparkle stars */}
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

      {/* Hero content — Logo centralizada */}
      <div className="absolute inset-0 z-40 flex items-center justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <Image
            src={
              currentTheme === "dark"
                ? "/logos/logo-stick-pink-main-dark.png"
                : "/logos/logo-stick-gradient-main.png"
            }
            alt={t("showcase.logoAlt")}
            width={900}
            height={900}
            priority
            className="w-60 sm:w-68 md:w-80 lg:w-96 xl:w-md 2xl:w-32rem object-contain drop-shadow-2xl"
            role="img"
          />
          {/* Glow behind logo */}
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-brand-pink dark:bg-brand-pink-dark rounded-full scale-75" />
        </motion.div>
      </div>
    </section>
  );
};

export default Showcase;
