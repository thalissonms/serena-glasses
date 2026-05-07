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
  const { isOpen, stories, initialIndex, close } = useStoryViewer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(5000);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    setDuration(5000);
  }, [currentIndex]);

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const goNext = useCallback(() => {
    if (currentIndexRef.current >= stories.length - 1) {
      close();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [stories.length, close]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + stories.length) % stories.length);
  }, [stories.length]);

  const onPauseChange = useCallback((p: boolean) => setPaused(p), []);
  const onDurationChange = useCallback((ms: number) => setDuration(ms), []);

  const { progressRef } = useStoryProgress({
    count: stories.length,
    currentIndex,
    isVisible: isOpen,
    paused,
    duration,
    onNext: goNext,
  });

  const story = stories[currentIndex];
  const nextStory = stories[(currentIndex + 1) % stories.length];

  if (!story) return null;

  return (
    <StoryViewerShell isOpen={isOpen} onClose={close}>
      {nextStory?.mediaType === "video" && nextStory.id !== story.id && (
        <link rel="prefetch" href={nextStory.mediaUrl} as="video" />
      )}

      <StoryMedia
        story={story}
        onPrev={goPrev}
        onNext={goNext}
        onPauseChange={onPauseChange}
        onDurationChange={onDurationChange}
      />

      <div className="absolute top-0 inset-x-0 z-30 flex flex-col">
        <StoryProgressBar
          count={stories.length}
          activeIndex={currentIndex}
          progressRef={progressRef}
        />
        <StoryHeader story={story} onClose={close} />
      </div>

      <div className="absolute bottom-0 inset-x-0 z-30">
        <StoryActionBar story={story} onClose={close} />
      </div>
    </StoryViewerShell>
  );
}
