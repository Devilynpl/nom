import React from 'react';
import { Users, Globe, Play, MoreHorizontal, Gamepad2, Wrench, Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Explore = ({ onNavigate }) => {
    const { t } = useLanguage();

    // Mock Data for Explore Page (Simulating public uploads) - Titles remain untranslated as they are user content
    const PUBLIC_TRACKS = [

        { id: 1, title: 'Summer Vibes', artist: 'The Weeknd', plays: '1.2M', duration: '3:45', image: '/img/3.jpg' },
        { id: 2, title: 'Neon Lights', artist: 'Dua Lipa', plays: '850K', duration: '2:30', image: '/img/3.jpg' },
        { id: 3, title: 'Late Night', artist: 'Tame Impala', plays: '2.3M', duration: '4:15', image: '/img/3.jpg' },
        { id: 4, title: 'Cyber Funk', artist: 'Daft Punk', plays: '5M', duration: '3:20', image: '/img/3.jpg' },
        { id: 5, title: 'Lo-Fi Study', artist: 'ChilledCow', plays: '10M+', duration: '24:00', image: '/img/3.jpg' },
        { id: 6, title: 'Synthwave Mix', artist: 'Retro', plays: '500K', duration: '1:15:00', image: '/img/3.jpg' },
    ];

    const TRENDING_ARTISTS = [
        { id: 1, name: 'The Weeknd', genre: 'R&B / Pop', followers: '50M', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=60' },
        { id: 2, name: 'Dua Lipa', genre: 'Pop', followers: '45M', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60' },
        { id: 3, name: 'Tame Impala', genre: 'Psychedelic Rock', followers: '12M', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60' },
        { id: 4, name: 'Daft Punk', genre: 'Electronic', followers: '30M', image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&auto=format&fit=crop&q=60' },
    ];

    return (
        <div className="explore-container animate-fade w-full max-w-[1200px] mx-auto p-6 text-white font-sans">
            <header className="explore-hero glass mb-10 p-8 rounded-3xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-white/10 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 uppercase tracking-tight">{t('expTitle')}</h1>
                    <p className="text-gray-300 max-w-xl text-lg">{t('expSubtitle')}</p>
                </div>
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl rounded-full"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl rounded-full"></div>
            </header>

            <div className="explore-content flex flex-col gap-12">

                {/* Section 1: Trending Artists */}
                <section>
                    <div className="section-header flex items-center gap-3 mb-6">
                        <Users size={24} className="text-pink-400" />
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-200">{t('trendingArtists')}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {TRENDING_ARTISTS.map(artist => (
                            <div key={artist.id} className="artist-card bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center hover:bg-white/10 transition-all hover:-translate-y-1 hover:border-pink-500/50 cursor-pointer group">
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-pink-500 transition-colors shadow-lg">
                                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="font-bold text-lg text-center mb-1 group-hover:text-pink-300">{artist.name}</h3>
                                <span className="text-xs text-gray-400 mb-3 uppercase tracking-wide">{artist.genre}</span>
                                <div className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/5">
                                    {artist.followers} {t('followers')}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Global Music Feed */}
                <section>
                    <div className="section-header flex items-center gap-3 mb-6">
                        <Globe size={24} className="text-cyan-400" />
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-200">{t('globalWaves')}</h2>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-2">
                        {PUBLIC_TRACKS.map((track, i) => (
                            <div key={track.id} className="group flex items-center gap-6 p-4 hover:bg-white/5 rounded-xl transition-all cursor-pointer border-b border-white/5 last:border-0 hover:pl-6">
                                <span className="text-gray-500 font-mono w-6 text-center group-hover:text-cyan-400 font-bold">{i + 1}</span>
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-cyan-500/20 transition-shadow">
                                    <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play size={24} fill="currentColor" className="text-cyan-400" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-lg text-gray-100 group-hover:text-cyan-400 transition-colors truncate">{track.title}</h4>
                                    <span className="text-sm text-gray-400 block truncate">{track.artist}</span>
                                </div>
                                <div className="text-sm text-gray-500 hidden sm:block font-mono">{track.plays} {t('plays')}</div>
                                <div className="text-sm text-gray-500 font-mono">{track.duration}</div>
                                <button className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Tools & Games (Legacy Explore Content) */}
                <section>
                    <div className="section-header flex items-center gap-3 mb-6">
                        <Gamepad2 size={24} className="text-yellow-400" />
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-200">{t('creativeArena')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: t('toolRapTitle'), icon: Gamepad2, color: 'text-red-400', desc: t('toolRapDesc') },
                            { title: t('toolChordTitle'), icon: Wrench, color: 'text-cyan-400', desc: t('toolChordDesc') },
                            { title: t('toolBeatTitle'), icon: Briefcase, color: 'text-green-400', desc: t('toolBeatDesc') },
                        ].map((item, i) => (
                            <div key={i} className="glass p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:bg-white/5 group cursor-pointer" onClick={() => onNavigate && onNavigate('game')}>
                                <div className={`mb-4 ${item.color}`}>
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Explore;
