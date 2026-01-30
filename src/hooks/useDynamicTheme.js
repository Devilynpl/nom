import { useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useTheme } from '../context/ThemeContext';

const MOOD_PALETTES = {
    cyberpunk: {
        '--primary': '#00f2ff',
        '--primary-glow': 'rgba(0, 242, 255, 0.5)',
        '--accent-cyan': '#7000ff',
        '--bg-deep': '#050510'
    },
    chill: {
        '--primary': '#10b981',
        '--primary-glow': 'rgba(16, 185, 129, 0.4)',
        '--accent-cyan': '#34d399',
        '--bg-deep': '#0f172a'
    },
    energy: {
        '--primary': '#ff0055',
        '--primary-glow': 'rgba(255, 0, 85, 0.5)',
        '--accent-cyan': '#ff7700',
        '--bg-deep': '#1a0505'
    },
    default: {
        // Fallback handled by CSS
    }
};

export const useDynamicTheme = () => {
    const { currentTrack } = usePlayerStore();
    const { theme } = useTheme();

    useEffect(() => {
        const root = document.documentElement;

        // Clean up function to remove manual overrides
        const cleanup = () => {
            Object.values(MOOD_PALETTES).forEach(palette => {
                Object.keys(palette).forEach(key => {
                    root.style.removeProperty(key);
                });
            });
        };

        // If Light Mode or No Track, Reset overrides and let CSS handle it
        if (theme === 'light' || !currentTrack || !currentTrack.mood) {
            cleanup();
            return;
        }

        const mood = currentTrack.mood.toLowerCase();
        const palette = MOOD_PALETTES[mood] || MOOD_PALETTES.default;

        if (palette === MOOD_PALETTES.default) {
            cleanup();
            return;
        }

        // Apply new palette only if Dark Mode + Track has Mood
        Object.entries(palette).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

    }, [currentTrack, theme]); // Re-run when Theme or Track changes
};
