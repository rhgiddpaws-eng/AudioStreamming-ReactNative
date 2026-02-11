import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
  };
  album: {
    id: string;
    title: string;
    coverImage: string;
  };
  duration: number;
  price?: number;
  isPremium?: boolean;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  queue: Track[];
  currentIndex: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
  
  setCurrentTrack: (track: Track) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  setCurrentTime: (time: number) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'off' | 'one' | 'all') => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  queue: [],
  currentIndex: 0,
  volume: 1,
  isShuffled: false,
  repeatMode: 'off',

  setCurrentTrack: (track: Track) => {
    set({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
    });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  togglePlayPause: () => {
    const { isPlaying } = get();
    set({ isPlaying: !isPlaying });
  },

  setCurrentTime: (time: number) => set({ currentTime: time }),

  setQueue: (tracks: Track[]) => set({ queue: tracks, currentIndex: 0 }),

  addToQueue: (track: Track) => {
    const { queue } = get();
    set({ queue: [...queue, track] });
  },

  removeFromQueue: (index: number) => {
    const { queue } = get();
    set({ queue: queue.filter((_, i) => i !== index) });
  },

  nextTrack: () => {
    const { queue, currentIndex, repeatMode, isShuffled } = get();
    
    if (queue.length === 0) return;

    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    set({
      currentIndex: nextIndex,
      currentTrack: queue[nextIndex],
      currentTime: 0,
    });
  },

  previousTrack: () => {
    const { queue, currentIndex, currentTime } = get();
    
    if (queue.length === 0) return;

    // 현재 곡이 3초 이상 진행되었으면 처음부터 재생
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }

    const previousIndex = currentIndex - 1;
    if (previousIndex < 0) return;

    set({
      currentIndex: previousIndex,
      currentTrack: queue[previousIndex],
      currentTime: 0,
    });
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  toggleShuffle: () => {
    const { isShuffled } = get();
    set({ isShuffled: !isShuffled });
  },

  setRepeatMode: (mode: 'off' | 'one' | 'all') => {
    set({ repeatMode: mode });
  },
}));
