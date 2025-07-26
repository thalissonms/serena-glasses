"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const productImages = [
  "/products/1.png",
  "/products/2.png",
  "/products/3.png",
  "/products/4.png",
  "/products/5.png",
  "/products/6.png",
];

const useGeneratedBlocks = (columns: number, blocksPerColumn: number) => {
  const [mounted, setMounted] = useState(false);
  const [columnsData, setColumnsData] = useState<
    Array<
      Array<{
        height: number;
        product: string;
        key: string;
      }>
    >
  >([]);

  useEffect(() => {
    setMounted(true);

    const minHeight = 150;
    const maxHeight = 300;

    const generatedColumns = Array.from({ length: columns }).map(
      (_, colIndex) => {
        return Array.from({ length: blocksPerColumn }).map((_, i) => {
          const height =
            Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
          const product = productImages[(colIndex + i) % productImages.length];

          return {
            height,
            product,
            key: `${colIndex}-${i}`,
          };
        });
      }
    );

    setColumnsData(generatedColumns);
  }, [columns, blocksPerColumn]);

  return { mounted, columnsData };
};

export function FloatingProductGrid() {
  const columns = 6;
  const blocksPerColumn = 6;
  const duration = 30;

  const { mounted, columnsData } = useGeneratedBlocks(columns, blocksPerColumn);

  if (!mounted) return null; 

  return (
    <div className="w-full h-full grid grid-cols-6 gap-4 overflow-hidden relative z-0">
      {columnsData.map((blocks, colIndex) => {
        const animatedBlocks = [...blocks, ...blocks]; 

        return (
          <div
            key={colIndex}
            className="relative w-full h-full overflow-hidden"
          >
            <motion.div
              className="absolute w-full top-0"
              animate={{ y: "-50%" }}
              transition={{
                duration,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              <div>
                {animatedBlocks.map((block, i) => (
                  <div
                    key={block.key + "-copy-" + i}
                    className="w-full overflow-hidden shadow-lg mb-4 glass-container opacity-80"
                    style={{ height: block.height }}
                  >
                    <Image
                      src={block.product}
                      alt={`Produto`}
                      fill
                      className="object-contain opacity-40"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
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
      <div className="relative h-[560px] flex items-center justify-center">
        <FloatingProductGrid />
      </div>

      {mounted && (
        <div className="absolute inset-0 z-0">
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

      <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
          animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
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
          className="glass-btn glass-text-mask"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          Explorar Coleção
        </motion.button>
      </div>
    </section>
  );
};

export default Showcase;
