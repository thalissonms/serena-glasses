"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types";
import { shuffle } from "@shared/utils/shuffle";
import { useStoryViewer } from "@features/home/hooks/useStoryViewer";
import { Glasses, Sparkles, Stars } from "lucide-react";
import HeaderDivider from "./HeaderDivider";

interface VideoReelsMobileProps {
  products: Product[];
}

const VideoReelsMobile = ({ products }: VideoReelsMobileProps) => {
  const { t } = useTranslation("home");
  const filtered = products.filter((p) => !!p.videoUrl);
  const openStoryViewer = useStoryViewer((s) => s.open);

  const [videoProducts, setVideoProducts] = useState<Product[]>(filtered);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const playedSet = useRef<Set<string>>(new Set());

  useEffect(() => {
    setVideoProducts(shuffle(filtered));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setIsVisible(e.isIntersecting),
      { threshold: 0.5 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (videoProducts.length === 0) return;

    videoRefs.current.forEach((v, i) => {
      if (v && i !== activeIndex) v.pause();
    });

    const activeVideo = videoRefs.current[activeIndex];
    if (!activeVideo) return;

    if (!isVisible) {
      activeVideo.pause();
      return;
    }

    const activeProductId = videoProducts[activeIndex].id;

    if (playedSet.current.has(activeProductId)) {
      activeVideo.pause();
      return;
    }

    activeVideo.currentTime = 0;
    activeVideo.play().catch(() => {});
    playedSet.current.add(activeProductId);

    const advanceId = setTimeout(() => {
      setActiveIndex((prev) =>
        prev + 1 < videoProducts.length ? prev + 1 : prev,
      );
    }, 10000);

    return () => clearTimeout(advanceId);
  }, [activeIndex, isVisible, videoProducts]);

  useEffect(() => {
    if (videoProducts.length === 0) return;
    const card = cardRefs.current[activeIndex];
    if (card && containerRef.current) {
      const container = containerRef.current;
      container.scrollTo({
        left:
          card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeIndex, videoProducts.length]);

  if (videoProducts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col gap-3 py-4 -mt-4"
    >
      <HeaderDivider title={t("reels.title")} />

      {/* Carrossel */}
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-1"
      >
        {videoProducts.map((product, i) => {
          const isActive = i === activeIndex;
          const primaryImage =
            product.images.find((img) => img.isPrimary) ?? product.images[0];
          const shouldLoad = isActive || Math.abs(i - activeIndex) <= 1;

          return (
            <button
              key={product.id}
              type="button"
              ref={(el) => {
                cardRefs.current[i] = el as unknown as HTMLAnchorElement;
                return () => {
                  cardRefs.current[i] = null;
                };
              }}
              onClick={() => openStoryViewer(videoProducts, i)}
              className={[
                "snap-center shrink-0 w-[32vw] aspect-9/16 relative overflow-hidden cursor-pointer transition-all duration-300",
                "border-2 border-black shadow-brand-pink dark:shadow-brand-blue dark:border-brand-pink-light",
                isActive ? "shadow-[4px_6px_0px]" : "shadow-[3px_5px_0px]",
              ].join(" ")}
            >
              {/* Fundo fallback */}
              <div className="absolute inset-0 bg-brand-pink-light dark:bg-brand-black-dark" />

              {/* Imagem de poster */}
              {primaryImage && (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt}
                  fill
                  sizes="32vw"
                  className="object-cover"
                />
              )}

              {/* Vídeo */}
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                  return () => {
                    videoRefs.current[i] = null;
                  };
                }}
                src={shouldLoad ? product.videoUrl : undefined}
                preload={shouldLoad ? "metadata" : "none"}
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

              {/* Overlay SOLD OUT */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center z-20">
                  <span className="text-white font-bold text-xs tracking-widest font-shrikhand -rotate-6">
                    SOLD OUT
                  </span>
                </div>
              )}

              {/* Badge NEW! — top-left */}
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-brand-pink text-white text-[10px] font-bold px-1.5 py-0.5 -rotate-3 z-10 leading-tight">
                  NEW!
                </span>
              )}

              {/* Nome do produto — bottom */}
              <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs px-1 z-10 truncate font-shrikhand">
                {product.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* <div className="flex items-center justify-center gap-1.5">
        {videoProducts.map((_, i) => (
          <button
            key={i}
            aria-label={t("reels.dotLabel", { number: i + 1 })}
            onClick={() => setActiveIndex(i)}
            className={[
              "rounded-full border-2 border-black transition-all duration-300",
              i === activeIndex
                ? "bg-brand-pink w-3 h-3"
                : "bg-brand-pink/30 w-2 h-2",
            ].join(" ")}
          />
        ))}
      </div> */}
    </motion.div>
  );
};

export default VideoReelsMobile;
