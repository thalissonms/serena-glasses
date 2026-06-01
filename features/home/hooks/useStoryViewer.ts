import { create } from "zustand";
import type { HomeStory } from "@features/home/types/homeStory.types";

interface StoryViewerState {
  isOpen: boolean;
  stories: HomeStory[];
  initialIndex: number;
}

interface StoryViewerActions {
  open: (stories: HomeStory[], initialIndex: number) => void;
  close: () => void;
}

export const useStoryViewer = create<StoryViewerState & StoryViewerActions>((set) => ({
  isOpen: false,
  stories: [],
  initialIndex: 0,
  open: (stories, initialIndex) =>
    set({ isOpen: true, stories, initialIndex: Math.max(0, Math.min(initialIndex, stories.length - 1)) }),
  close: () => set({ isOpen: false, stories: [] }),
}));
