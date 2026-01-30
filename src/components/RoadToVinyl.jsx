import React, { useMemo } from 'react';
import { useVibePoints } from '../hooks/useVibePoints';
import { useLanguage } from '../context/LanguageContext';
import { Trophy, Disc, Star, Lock, Zap, Gift, Users, ChevronRight, CheckCircle2, Headphones, Clock } from 'lucide-react';
import './RoadToVinyl.css';

// Badges & Assets
import badgeBronze from '../assets/images/bronze_badge.jpg';
import badgeSilver from '../assets/images/silver_badge.jpg';
import badgeGold from '../assets/images/gold_badge.jpg';
import badgeVinyl from '../assets/images/vinyl_gold_record.png'; // Fallback
import vinylMockup from '../assets/images/vinyl_mockup.png';

const RoadToVinyl = () => {
    const { t } = useLanguage();
    const { silverCoins: points = 0 } = useVibePoints({
        id: 'alex_vibe',
        name: 'Age of Vanity',
        vibePoints: 850
    });

    // Define data arrays inside component to access translation function
    const MILESTONES = [
        { id: 'bronze', points: 1000, label: t('bronzeLabel'), img: badgeBronze, reward: t('bronzeReward') },
        { id: 'silver', points: 10000, label: t('silverLabel'), img: badgeSilver, reward: t('silverReward') },
        { id: 'gold', points: 25000, label: t('goldLabel'), img: badgeGold, reward: t('goldReward') },
        { id: 'vinyl', points: 50000, label: t('vinylLabel'), img: vinylMockup, reward: t('vinylReward') },
    ];

    const EARN_METHODS = [
        { title: t('earnMethod1Title'), points: 50, desc: t('earnMethod1Desc'), icon: <Star size={20} /> },
        { title: t('earnMethod2Title'), points: 100, desc: t('earnMethod2Desc'), icon: <Zap size={20} /> },
        { title: t('earnMethod3Title'), points: 500, desc: t('earnMethod3Desc'), icon: <Users size={20} /> },
        { title: t('earnMethod4Title'), points: 1000, desc: t('earnMethod4Desc'), icon: <Trophy size={20} /> },
        { title: t('earnMethod5Title'), points: 200, desc: t('earnMethod5Desc'), icon: <Clock size={20} /> },
        { title: t('earnMethod6Title'), points: 1000, desc: t('earnMethod6Desc'), icon: <Headphones size={20} /> },
    ];

    const maxPoints = 50000;
    const progress = Math.min((points / maxPoints) * 100, 100);
    const remaining = Math.max(maxPoints - points, 0);

    const currentMilestone = useMemo(() => {
        return [...MILESTONES].reverse().find(m => points >= m.points) || { label: t('rookieLabel'), img: badgeBronze };
    }, [points, MILESTONES, t]); // Added dependencies

    const nextMilestone = useMemo(() => {
        return MILESTONES.find(m => points < m.points) || MILESTONES[MILESTONES.length - 1];
    }, [points, MILESTONES]);

    return (
        <div className="rtv-container animate-fade">
            <header className="rtv-header">
                <h1 className="glitch-font text-5xl mb-4">{t('rtvTitle')}</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    {t('rtvSubtitle')} <strong>{t('rtvFreeVinyl')}</strong>
                </p>
            </header>

            <section className="rtv-main-card glass border-cyan-500/20 p-8 mb-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="badge-showcase relative">
                        <div className="badge-glow-ring"></div>
                        <img
                            src={currentMilestone.img}
                            alt="Current Level"
                            className="current-badge-large w-48 h-48 rounded-full border-4 border-cyan-400 shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                        />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 border border-cyan-400/50 px-4 py-1 rounded-full whitespace-nowrap">
                            <span className="text-cyan-400 font-bold uppercase tracking-widest">{currentMilestone.label}</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left">
                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-medium text-gray-400">{t('totalProgress')}</span>
                                <span className="text-2xl font-bold text-white">{points.toLocaleString()} / 50,000 VP</span>
                            </div>
                            <div className="progress-bar-container h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                <div
                                    className="progress-fill-gradient h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {remaining > 0 ? (
                            <p className="text-cyan-400 flex items-center gap-2 justify-center md:justify-start">
                                <Zap size={18} /> <strong>{remaining.toLocaleString()} {t('pointsAway')}</strong> {nextMilestone.label}
                            </p>
                        ) : (
                            <p className="text-green-400 flex items-center gap-2 justify-center md:justify-start">
                                <Trophy size={18} /> <strong>{t('vinylReached')}</strong>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <div className="lg:col-span-2 space-y-8">
                    {/* Roadmap Section */}
                    <div className="rtv-roadmap-new glass p-6">
                        <h2 className="glitch-font text-2xl mb-6">{t('questJourney')}</h2>
                        <div className="roadmap-timeline flex flex-col gap-6 relative">
                            <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-white/10"></div>
                            {MILESTONES.map((m, idx) => {
                                const isUnlocked = points >= m.points;
                                return (
                                    <div key={m.id} className={`roadmap-step flex items-center gap-6 ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                        <div className={`step-circle w-20 h-20 flex-shrink-0 rounded-full border-2 flex items-center justify-center relative z-10 transition-all ${isUnlocked ? 'bg-cyan-500/20 border-cyan-400' : 'bg-black border-white/10'}`}>
                                            <img src={m.img} alt={m.label} className={`w-14 h-14 rounded-full ${isUnlocked ? '' : 'grayscale opacity-30 animate-pulse'}`} />
                                            {!isUnlocked && <Lock className="absolute text-white/50" size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{m.label}</h3>
                                                {isUnlocked && <CheckCircle2 size={16} className="text-cyan-400" />}
                                            </div>
                                            <p className="text-sm text-gray-400">{m.points.toLocaleString()} VP • {t('reward')}: {m.reward}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* How to Earn */}
                    <div className="earn-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {EARN_METHODS.map((method, idx) => (
                            <div key={idx} className="earn-card glass p-4 flex items-start gap-4 hover:border-cyan-400/50 transition-all cursor-pointer group">
                                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                                    {method.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">{method.title}</h4>
                                    <p className="text-xs text-gray-500 mb-2">{method.desc}</p>
                                    <span className="text-xs font-bold text-cyan-400">+{method.points} VP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vinyl Showcase Card */}
                <div className="lg:col-span-1">
                    <div className="vinyl-showcase-card glass p-6 sticky top-24 border-yellow-500/20">
                        <div className="mb-6 relative group">
                            <div className="absolute -inset-2 bg-yellow-500/10 blur-xl group-hover:bg-yellow-500/20 transition-all"></div>
                            <img
                                src={vinylMockup}
                                alt="Final Vinyl Preview"
                                className="relative w-full aspect-square object-cover rounded-xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                        <h2 className="glitch-font text-xl text-yellow-400 mb-2 flex items-center gap-2">
                            <Gift size={20} /> {t('ultimatePrize')}
                        </h2>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            {t('prizeDesc')}
                        </p>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                <span>{t('physicalRelease')}</span>
                                <span className="text-cyan-400">{t('included')}</span>
                            </div>
                            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                <span>{t('globalShipping')}</span>
                                <span className="text-cyan-400">{t('worldwide')}</span>
                            </div>
                            <div className="flex justify-between text-xs pb-2 font-bold text-yellow-400">
                                <span>{t('totalCost')}</span>
                                <span>{t('freeCost')}</span>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center gap-2">
                            {t('shareProgress')} <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadToVinyl;
