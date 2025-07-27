"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface Polaroid {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  product: string;
  zIndex: number;
  createdAt: number;
  lifespan: number;
  phase: "appearing" | "visible" | "disappearing";
}

export function StackedPolaroids({
  productImages,
}: {
  productImages: string[];
}) {
  const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
  const [mounted, setMounted] = useState(false);

  const createPolaroid = useCallback(
    (index: number, delay: number = 0): Polaroid => {
      const scaleValue = Math.random() * 0.6 + 0.4;
      const lifespan = 25 + Math.random() * 15;

      return {
        id: `polaroid-${index}-${Date.now()}-${Math.random()}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.round((Math.random() - 0.5) * 120),
        scale: Math.round(scaleValue * 100) / 100,
        product:
          productImages[Math.floor(Math.random() * productImages.length)],
        zIndex: index,
        createdAt: Date.now() + delay * 1000,
        lifespan,
        phase: "appearing",
      };
    },
    [productImages]
  );

  useEffect(() => {
    if (!mounted || !productImages || productImages.length === 0) return;

    const interval = setInterval(() => {
      setPolaroids((current) => {
        const now = Date.now();
        const updated: Polaroid[] = [];

        current.forEach((polaroid) => {
          const age = (now - polaroid.createdAt) / 1000;

          if (age < 2) {
            updated.push({ ...polaroid, phase: "appearing" });
          } else if (age < polaroid.lifespan - 2) {
            updated.push({ ...polaroid, phase: "visible" });
          } else if (age < polaroid.lifespan) {
            updated.push({ ...polaroid, phase: "disappearing" });
          }
        });

        const needed = 43 - updated.length;
        for (let i = 0; i < needed; i++) {
          const groupDelay =
            Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0;
          updated.push(createPolaroid(updated.length + i, groupDelay));
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [mounted, productImages, createPolaroid]);

  useEffect(() => {
    if (!productImages || productImages.length === 0) return;

    setMounted(true);

    const initialPolaroids: Polaroid[] = Array.from({ length: 43 }, (_, i) => {
      const baseDelay = (i / 43) * 20;
      const groupChance = Math.random();
      let finalDelay = baseDelay;

      if (groupChance < 0.2 && i > 0) {
        finalDelay = baseDelay - Math.random() * 2;
      }

      return createPolaroid(i, Math.max(0, finalDelay));
    });

    setPolaroids(initialPolaroids);
  }, [productImages, createPolaroid]);

  if (!mounted || polaroids.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {polaroids.map((polaroid) => (
        <PolaroidWithLifecycle key={polaroid.id} polaroid={polaroid} />
      ))}
    </div>
  );
}

function PolaroidWithLifecycle({ polaroid }: { polaroid: Polaroid }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const delay = Math.max(0, polaroid.createdAt - now);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [polaroid.createdAt]);

  if (!isVisible) return null;

  const getAnimationClass = () => {
    switch (polaroid.phase) {
      case "appearing":
        return "animate-polaroid-appear";
      case "visible":
        return "animate-polaroid-visible opacity-90";
      case "disappearing":
        return "animate-polaroid-disappear";
      default:
        return "";
    }
  };

  return (
    <div
      className={`absolute ${getAnimationClass()}`}
      style={
        {
          left: `${polaroid.x}%`,
          top: `${polaroid.y}%`,
          transform: `translate(-50%, -50%) rotate(${polaroid.rotation}deg) scale(${polaroid.scale})`,
          zIndex: polaroid.zIndex,
          "--rotation": `${polaroid.rotation}deg`,
          "--scale": polaroid.scale,
        } as React.CSSProperties & { "--rotation": string; "--scale": number }
      }
    >
      <PolaroidCard product={polaroid.product} />
    </div>
  );
}

function PolaroidCard({ product }: { product: string }) {
  return (
    <div className="w-24 h-32 sm:w-28 sm:h-36 md:w-36 md:h-48 lg:w-40 lg:h-52 xl:w-44 xl:h-56 bg-gray-50 flex flex-col items-center pt-2 md:pt-3 rounded-sm shadow-lg cursor-pointer select-none hover:scale-110 hover:z-50 hover:rotate-0 transition-all duration-300 ease-out">
      <div className="w-[87.5%] h-[70%] bg-pink-200 rounded-sm overflow-hidden relative border border-gray-100">
        <Image
          src={product}
          alt="Óculos"
          fill
          className="object-contain p-1 md:p-1.5 sepia-50"
          draggable={false}
          loading="lazy"
        />
      </div>

      <div className="flex-1 w-[87.5%] flex items-center justify-center">
        <div className="w-10 sm:w-12 md:w-16 lg:w-18 xl:w-20 h-0.5 bg-gray-300 rounded-full opacity-40"></div>
      </div>

      <div className="absolute inset-1 md:inset-1.5 border border-gray-100 rounded-sm pointer-events-none opacity-30"></div>
    </div>
  );
}
