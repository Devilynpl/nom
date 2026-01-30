import React from 'react';
import { Mic, Music, Wand2, Zap, Upload, Disc } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ToolCard = ({ title, desc, icon, onClick, color }) => (
    <div
        onClick={onClick}
        className={`glass p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group border border-white/5 hover:border-${color}-400/50`}
    >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-${color}-400/50 transition-all`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </div>
);

/**
 * CreatePage Component - Hub for music creation tools and track uploading.
 * @param {Object} props - Component props.
 * @param {Function} props.onNavigate - Function to handle navigation between tools.
 * @returns {JSX.Element} The CreatePage component.
 */
const CreatePage = ({ onNavigate }) => {
    const { t } = useLanguage();

    const tools = [
        {
            id: 'lyric-assistant',
            title: t('toolLyricTitle'),
            desc: t('toolLyricDesc'),
            icon: <Mic className="text-white" size={24} />,
            color: 'from-pink-500 to-rose-500' // pink
        },
        {
            id: 'beat-matcher',
            title: t('toolBeatTitle'),
            desc: t('toolBeatDesc'),
            icon: <Music className="text-white" size={24} />,
            color: 'from-cyan-500 to-blue-500' // cyan
        },
        {
            id: 'chord-wizard',
            title: t('toolChordTitle'),
            desc: t('toolChordDesc'),
            icon: <Wand2 className="text-white" size={24} />,
            color: 'from-purple-500 to-indigo-500' // purple
        },
        {
            id: 'voice-fx',
            title: t('toolVoiceTitle'),
            desc: t('toolVoiceDesc'),
            icon: <Zap className="text-white" size={24} />,
            color: 'from-yellow-400 to-orange-500' // orange
        },
        {
            id: 'rap-battle',
            title: t('toolRapTitle'),
            desc: t('toolRapDesc'),
            icon: <Upload className="text-white" size={24} />,
            color: 'from-red-500 to-red-700' // red
        },
        {
            id: 'road-to-vinyl',
            title: t('toolRtvTitle'),
            desc: t('toolRtvDesc'),
            icon: <Disc className="text-white" size={24} />,
            color: 'from-emerald-400 to-teal-500' // green
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{t('createPageTitle')}</h1>
                <p className="text-xl text-white/50">{t('createPageSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upload Card - Primary Action */}
                <div
                    onClick={() => alert("Upload Flow Coming Soon!")}
                    className="col-span-1 md:col-span-2 lg:col-span-3 glass p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 cursor-pointer hover:bg-white/10 border border-cyan-400/30 hover:border-cyan-400 transition-all group"
                >
                    <div className="w-20 h-20 rounded-full bg-cyan-400/20 flex items-center justify-center border border-cyan-400/50 group-hover:scale-110 transition-transform">
                        <Upload size={32} className="text-cyan-400" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">{t('uploadTrackTitle')}</h2>
                        <p className="text-white/60">{t('uploadTrackDesc')}</p>
                    </div>
                    <button className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-3 px-8 rounded-full transition-colors">
                        {t('uploadNow')}
                    </button>
                </div>

                {/* Generator Tools */}
                {tools.map(tool => (
                    <ToolCard
                        key={tool.id}
                        {...tool}
                        onClick={() => onNavigate(tool.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CreatePage;
