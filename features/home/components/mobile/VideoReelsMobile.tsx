"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useStoryViewer } from "@features/home/hooks/useStoryViewer";
import { useHomeStories } from "@features/home/hooks/useHomeStories";
import HeaderDivider from "./HeaderDivider";

const VideoReelsMobile = () => {
  const { t, i18n } = useTranslation("home");
  const lang = i18n.language ?? "pt";
  const { data: allStories = [] } = useHomeStories(lang);
  const openStoryViewer = useStoryViewer((s) => s.open);

  const stories = useMemo(
    () => allStories.filter((s) => s.mediaType === "video"),
    [allStories],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (stories.length === 0) return;
    const target = containerRef.current;
    if (!target) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsVisible(e.isIntersecting),
      { threshold: 0.5 },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [stories.length]);

  useEffect(() => {
    if (stories.length > 0 && activeIndex >= stories.length) {
      setActiveIndex(0);
    }
  }, [stories.length, activeIndex]);

  useEffect(() => {
    if (stories.length === 0) return;

    videoRefs.current.forEach((v, i) => {
      if (v && i !== activeIndex) v.pause();
    });

    const activeVideo = videoRefs.current[activeIndex];

    if (!isVisible) {
      activeVideo?.pause();
      return;
    }

    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(() => {});
    }

    const advanceId = setTimeout(() => {
      setActiveIndex((prev) =>
        prev + 1 < stories.length ? prev + 1 : prev,
      );
    }, 10000);

    return () => clearTimeout(advanceId);
  }, [activeIndex, isVisible, stories.length]);

  useEffect(() => {
    if (stories.length === 0) return;
    const card = cardRefs.current[activeIndex];
    if (card && containerRef.current) {
      const container = containerRef.current;
      container.scrollTo({
        left:
          card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeIndex, stories.length]);

  if (stories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col gap-3 py-4 -mt-4"
    >
      <HeaderDivider title={t("reels.title")} />

      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-1"
      >
        {stories.map((story, i) => {
          const isActive = i === activeIndex;
          const shouldLoad = isActive || Math.abs(i - activeIndex) <= 1;

          return (
            <button
              key={story.id}
              type="button"
              ref={(el) => {
                cardRefs.current[i] = el as unknown as HTMLDivElement;
                return () => { cardRefs.current[i] = null; };
              }}
              onClick={() => openStoryViewer(stories, i)}
              className={[
                "snap-center shrink-0 w-[32vw] aspect-9/16 relative overflow-hidden cursor-pointer transition-all duration-300",
                "border-2 border-black shadow-brand-pink dark:shadow-brand-blue dark:border-brand-pink-light",
                isActive ? "shadow-[4px_6px_0px]" : "shadow-[3px_5px_0px]",
              ].join(" ")}
            >
              <div className="absolute inset-0 bg-brand-pink-light dark:bg-brand-black-dark" />

              {story.posterUrl && (
                <Image
                  src={story.posterUrl}
                  alt={story.title}
                  fill
                  sizes="32vw"
                  className="object-cover"
                />
              )}

              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                  return () => { videoRefs.current[i] = null; };
                }}
                src={shouldLoad ? story.mediaUrl : undefined}
                preload={shouldLoad ? "metadata" : "none"}
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

              {story.kind === "product" && !story.productInStock && (
                <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center z-20">
                  <span className="text-white font-bold text-xs tracking-widest font-shrikhand -rotate-6">
                    SOLD OUT
                  </span>
                </div>
              )}

              {story.avatarKind === "label" && story.avatarLabel && (
                <span className="absolute top-2 left-2 bg-brand-pink text-white text-[10px] font-bold px-1.5 py-0.5 -rotate-3 z-10 leading-tight">
                  {story.avatarLabel}
                </span>
              )}

              <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs px-1 z-10 truncate font-shrikhand">
                {story.title}
              </p>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default VideoReelsMobile;
