/**
 * @typedef {Object} Track
 * @property {string} id - Unique identifier
 * @property {string} title - Track title
 * @property {string} artist - Artist name
 * @property {string} [cover] - Cover image URL
 * @property {string} src - Audio source URL
 */

/**
 * @typedef {Object} PlayerState
 * @property {Track|null} currentTrack
 * @property {Track[]} playlist
 * @property {boolean} isPlaying
 * @property {number} volume
 * @property {boolean} isExpanded
 * @property {(track: Track) => void} playTrack
 * @property {(tracks: Track[]) => void} setPlaylist
 * @property {() => void} nextTrack
 * @property {() => void} prevTrack
 * @property {() => void} pause
 * @property {() => void} togglePlay
 * @property {(volume: number) => void} setVolume
 * @property {(isExpanded: boolean) => void} setExpanded
 */

import { create } from 'zustand';

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<PlayerState>>} */
export const usePlayerStore = create((set, get) => ({
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    volume: 0.5,
    bass: 50,
    isExpanded: false, // For mobile player expansion

    // Actions
    playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
    setPlaylist: (tracks) => set({ playlist: tracks }),

    nextTrack: () => {
        const { currentTrack, playlist } = get();
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        set({ currentTrack: playlist[nextIndex], isPlaying: true });
    },

    prevTrack: () => {
        const { currentTrack, playlist } = get();
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        set({ currentTrack: playlist[prevIndex], isPlaying: true });
    },

    pause: () => set({ isPlaying: false }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setVolume: (volume) => set({ volume }),
    setBass: (bass) => set({ bass }),
    setExpanded: (isExpanded) => set({ isExpanded }),

    // Helper to stop playback
    stop: () => set({ isPlaying: false }),
}));
