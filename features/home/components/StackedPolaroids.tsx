"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function StackedPolaroids({ productImages }: { productImages: string[] }) {
  if (!productImages || productImages.length === 0) return null;


  const polaroids = Array.from({ length: 43 }).map((_, i) => ({
    id: `polaroid-${i}`,
    product: productImages[i % productImages.length],
    zIndex: i,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      <style>{`
        @keyframes polaroid-cycle-optimized {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(calc(var(--scale) * 0.8)) rotate(calc(var(--rotation) - 10deg)); }
          5% { opacity: 0.9; transform: translate(-50%, -50%) scale(var(--scale)) rotate(var(--rotation)); }
          95% { opacity: 0.9; transform: translate(-50%, -50%) scale(var(--scale)) rotate(var(--rotation)); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(calc(var(--scale) * 0.8)) rotate(calc(var(--rotation) + 10deg)); }
        }
      `}</style>

      {polaroids.map((polaroid, i) => (
        <PolaroidWithLifecycle
          key={polaroid.id}
          product={polaroid.product}
          zIndex={polaroid.zIndex}
          index={i}
        />
      ))}
    </div>
  );
}

function PolaroidWithLifecycle({ product, zIndex, index }: { product: string; zIndex: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: NodeJS.Timeout;

    const cycle = () => {
      const scaleValue = Math.random() * 0.6 + 0.4;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const rotation = Math.round((Math.random() - 0.5) * 120);
      const lifespan = 25 + Math.random() * 15;

      el.style.setProperty('--scale', scaleValue.toString());
      el.style.setProperty('--rotation', `${rotation}deg`);
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;

      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = `polaroid-cycle-optimized ${lifespan}s ease-in-out forwards`;

      timeoutId = setTimeout(cycle, lifespan * 1000);
    };

    const baseDelay = (index / 43) * 20;
    let finalDelay = baseDelay;

    if (Math.random() < 0.2 && index > 0) {
      finalDelay = Math.max(0, baseDelay - Math.random() * 2);
    }

    const initialTimeout = setTimeout(cycle, finalDelay * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
    };
  }, [index]);

  return (
    <div
      ref={ref}
      className="pointer-events-auto absolute opacity-0"
      style={{ zIndex }}
    >
      <PolaroidCard product={product} />
    </div>
  );
}

function PolaroidCard({ product }: { product: string }) {
  return (
    <div className="noise-overlay-white dark:noise-overlay-black noise-overlay-blend flex h-32 w-24 cursor-pointer flex-col items-center rounded-sm pt-2 shadow-lg transition-all duration-300 ease-out select-none hover:z-50 hover:scale-110 hover:rotate-0 sm:h-36 sm:w-28 md:h-48 md:w-36 md:pt-3 lg:h-52 lg:w-40 xl:h-56 xl:w-44">
      <div className="bg-linear relative flex h-[70%] w-[87.5%] justify-center overflow-hidden border border-brand-black/30 from-brand-white via-brand-pink-light to-brand-white dark:border-brand-black/10">
        <Image
          src={product}
          alt=""
          role="presentation"
          fill
          sizes="(max-width: 640px) 84px, (max-width: 768px) 98px, (max-width: 1024px) 126px, 154px"
          className="object-contain sepia-50"
          draggable={false}
          loading="lazy"
        />
      </div>

      <div className="flex w-[87.5%] flex-1 items-center justify-center">
        <div className="h-0.5 w-10 rounded-full bg-gray-300 opacity-40 sm:w-12 md:w-16 lg:w-18 xl:w-20 dark:bg-black"></div>
      </div>

      <div className="pointer-events-none absolute inset-1 rounded-sm border border-gray-100 opacity-30 md:inset-1.5"></div>
    </div>
  );
}
