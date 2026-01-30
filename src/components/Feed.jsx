import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Newspaper, Music, Search, Heart, Play, User, Sparkles } from 'lucide-react';
import './Feed.css';
import { useLanguage } from '../context/LanguageContext';
import MagicBento from './ui/MagicBento';
import TrueFocus from './ui/TrueFocus';

const Feed = ({ onRate }) => {
    const { t } = useLanguage();

    const tracks = [
        {
            id: 1,
            title: "Cybernetic Soul",
            artist: "EON",
            label: "Trending Now",
            description: "Deep atmospheric synths with neural-link rhythm. Experience the next evolution of soundscapes.",
            color: "rgba(0, 242, 255, 0.05)",
            glowColor: "0, 242, 255",
            spotlightRadius: 400
        },
        {
            id: 2,
            title: "Neon Dreamz",
            artist: "AVA",
            label: "Premium",
            description: "Cyberpunk vocals meeting aggressive basslines. A journey through the illuminated streets of the future.",
            color: "rgba(132, 0, 255, 0.05)",
            glowColor: "132, 0, 255",
            spotlightRadius: 350
        },
        {
            id: 3,
            title: "Obsidian Pulse",
            artist: "Vortex",
            label: "Editor's Choice",
            description: "Dark techno that pulses with the heartbeat of the void. Minimalist, driving, and hypnotic.",
            color: "rgba(255, 0, 128, 0.05)",
            glowColor: "255, 0, 128",
            spotlightRadius: 300
        },
        {
            id: 4,
            title: "Evolution of Soul",
            artist: "Origin",
            label: "Classic Synth",
            description: "The track that started the neural-music movement. Remastered for high-fidelity neural interfaces.",
            color: "rgba(255, 215, 0, 0.05)",
            glowColor: "255, 215, 0",
            spotlightRadius: 450
        },
        {
            id: 5,
            title: "Liquid Frequencies",
            artist: "Hydro",
            label: "New Release",
            description: "Fluid melodies that adapt to your emotional state in real-time.",
            color: "rgba(0, 255, 128, 0.05)",
            glowColor: "0, 255, 128",
            spotlightRadius: 320
        },
        {
            id: 6,
            title: "Solar Flare",
            artist: "Helios",
            label: "Rising Star",
            description: "Explosive energy and uplifting rhythms to power your digital day.",
            color: "rgba(255, 87, 34, 0.05)",
            glowColor: "255, 87, 34",
            spotlightRadius: 380
        }
    ];

    return (
        <div className="feed-container animate-fade">
            <header className="px-12 pt-16 pb-8 flex flex-col items-start gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <Sparkles size={14} className="text-yellow-400" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">Neural Recommended</span>
                </div>

                <div className="flex flex-col">
                    <TrueFocus
                        sentence="The Future of Sound"
                        blurAmount={8}
                        borderColor="var(--primary)"
                        glowColor="rgba(43, 108, 238, 0.8)"
                    />
                    <p className="text-[var(--text-muted)] text-lg mt-2 font-medium tracking-wide opacity-80">
                        Curated frequencies for your digital consciousness
                    </p>
                </div>
            </header>

            <div className="px-8 pb-32">
                <MagicBento
                    data={tracks}
                    enableStars={true}
                    glowColor="43, 108, 238"
                    enableTilt={true}
                    enableMagnetism={true}
                    spotlightRadius={350}
                />
            </div>

            {/* Floating Action Button for Rate (Keeping logic) */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRate}
                className="fixed bottom-32 right-12 z-50 p-6 bg-white text-black rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] group"
            >
                <Trophy className="transition-transform group-hover:scale-110" size={32} />
                <div className="absolute -top-12 right-0 bg-black text-white text-[10px] px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    Leaderboard
                </div>
            </motion.button>
        </div>
    );
};

export default Feed;
