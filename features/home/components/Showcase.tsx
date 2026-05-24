"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { StackedPolaroids } from "./StackedPolaroids";
import { useGeneratedStars } from "../utils/generatedStars";
import { useTranslation } from "react-i18next";
import { useTheme } from "@shared/providers/ThemeProvider";

const polaroidImages = [
  "/img/polaroid-1.png",
  "/img/polaroid-2.png",
  "/img/polaroid-3.png",
  "/img/polaroid-4.png",
  "/img/polaroid-5.png",
  "/img/polaroid-6.png",
  "/img/polaroid-7.png",
  "/img/polaroid-8.png",
  "/img/polaroid-9.png",
  "/img/polaroid-10.png",
  "/img/polaroid-11.png",
  "/img/polaroid-12.png",
  "/img/polaroid-13.png",
  "/img/polaroid-14.png",
  "/img/polaroid-15.png",
  "/img/polaroid-16.png",
  "/img/polaroid-17.png",
];
const Showcase = () => {
  const { stars, mounted } = useGeneratedStars(25);
  const { t } = useTranslation("home");
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const { scrollYProgress } = useScroll();

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.075, 0.4],
    [0, 0, 1],
  );

  return (
    <section className="relative overflow-hidden h-[72.4vh] w-full -mt-24">
      <motion.div
        className="w-full absolute top-0 left-0 h-[72.4vh] bg-brand-light-surface-0 dark:bg-brand-dark-surface-0 z-50"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 z-0 opacity-45 dark:opacity-40 transition-all duration-150">
        <StackedPolaroids productImages={polaroidImages} />
      </div>
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
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-brand-pink dark:bg-brand-purple/70 rounded-full scale-75" />
        </motion.div>
      </div>
    </section>
  );
};

export default Showcase;
