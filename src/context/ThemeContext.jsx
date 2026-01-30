import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('vibe-theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    });

    const [effectsEnabled, setEffectsEnabled] = useState(() => {
        const saved = localStorage.getItem('vibe-effects');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('vibe-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('vibe-effects', JSON.stringify(effectsEnabled));
    }, [effectsEnabled]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const toggleEffects = () => {
        setEffectsEnabled(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, effectsEnabled, toggleEffects }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
