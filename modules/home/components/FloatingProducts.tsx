"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Polaroid {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  product: string;
  zIndex: number;
  delay: number;
}

export function StackedPolaroids({
  productImages,
}: {
  productImages: string[];
}) {
  const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!productImages || productImages.length === 0) return;

    const generatePolaroids = () => {
      const generatedPolaroids: Polaroid[] = Array.from(
        { length: 60 },
        (_, i) => {
          const scaleValue = Math.random() * 0.6 + 0.4; // 0.4 a 1.0

          return {
            id: `polaroid-${i}-${Date.now()}`,
            x: Math.random() * 100, // 0-100% da largura
            y: Math.random() * 100, // 0-100% da altura
            rotation: Math.round((Math.random() - 0.5) * 120), // -60° a +60°
            scale: Math.round(scaleValue * 100) / 100,
            product: productImages[i % productImages.length],
            zIndex: i,
            delay: i * 0.3 + Math.random() * 2, // Delay escalonado: cada polaroid aparece depois do anterior
          };
        }
      );
      setPolaroids(generatedPolaroids);
    };

    setMounted(true);
    generatePolaroids();
  }, [productImages]);

  if (!mounted || polaroids.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {polaroids.map((polaroid) => (
        <div
          key={polaroid.id}
          className="absolute animate-polaroid-fall"
          style={
            {
              left: `${polaroid.x}%`,
              top: `${polaroid.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: polaroid.zIndex,
              animationDelay: `${polaroid.delay}s`,
              "--rotation": `${polaroid.rotation}deg`,
              "--scale": polaroid.scale,
            } as React.CSSProperties & {
              "--rotation": string;
              "--scale": number;
            }
          }
        >
          <PolaroidCard product={polaroid.product} />
        </div>
      ))}
    </div>
  );
}

function PolaroidCard({ product }: { product: string }) {
  return (
    <div className="flex flex-col items-center w-24 h-32 pt-2 transition-all duration-300 ease-out bg-white rounded-sm shadow-lg cursor-pointer select-none sm:w-28 sm:h-36 md:w-36 md:h-48 lg:w-40 lg:h-52 xl:w-44 xl:h-56 md:pt-3 hover:scale-110 hover:z-50 hover:rotate-0">
      <div className="w-[87.5%] h-[70%] bg-gray-50 rounded-sm overflow-hidden relative border border-gray-100">
        <Image
          src={product}
          alt="Óculos"
          fill
          className="object-contain p-1 md:p-1.5"
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
