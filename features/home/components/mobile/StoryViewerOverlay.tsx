"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStoryViewer } from "@features/home/hooks/useStoryViewer";
import { useStoryProgress } from "@features/home/hooks/useStoryProgress";
import { StoryViewerShell } from "@features/home/components/mobile/story-viewer/StoryViewerShell";
import { StoryProgressBar } from "@features/home/components/mobile/story-viewer/StoryProgressBar";
import { StoryHeader } from "@features/home/components/mobile/story-viewer/StoryHeader";
import { StoryMedia } from "@features/home/components/mobile/story-viewer/StoryMedia";
import { StoryActionBar } from "@features/home/components/mobile/story-viewer/StoryActionBar";

export function StoryViewerOverlay() {
  const { isOpen, products, initialIndex, close } = useStoryViewer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(5000);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  // Reset duration ao trocar story; onDurationChange do vídeo sobrescreve com o valor real
  useEffect(() => {
    setDuration(5000);
  }, [currentIndex]);

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const goNext = useCallback(() => {
    if (currentIndexRef.current >= products.length - 1) {
      close();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [products.length, close]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + products.length) % products.length);
  }, [products.length]);

  const onPauseChange = useCallback((p: boolean) => setPaused(p), []);
  const onDurationChange = useCallback((ms: number) => setDuration(ms), []);

  const { progressRef } = useStoryProgress({
    count: products.length,
    currentIndex,
    isVisible: isOpen,
    paused,
    duration,
    onNext: goNext,
  });

  const product = products[currentIndex];
  const nextProduct = products[(currentIndex + 1) % products.length];

  if (!product) return null;

  return (
    <StoryViewerShell isOpen={isOpen} onClose={close}>
      {nextProduct?.videoUrl && nextProduct.id !== product.id && (
        <link rel="prefetch" href={nextProduct.videoUrl} as="video" />
      )}

      <StoryMedia
        product={product}
        onPrev={goPrev}
        onNext={goNext}
        onPauseChange={onPauseChange}
        onDurationChange={onDurationChange}
      />

      <div className="absolute top-0 inset-x-0 z-30 flex flex-col">
        <StoryProgressBar
          count={products.length}
          activeIndex={currentIndex}
          progressRef={progressRef}
        />
        <StoryHeader product={product} onClose={close} />
      </div>

      <div className="absolute bottom-0 inset-x-0 z-30">
        <StoryActionBar product={product} onClose={close} />
      </div>
    </StoryViewerShell>
  );
}
