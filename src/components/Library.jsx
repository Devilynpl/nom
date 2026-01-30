import React, { useState } from 'react';
import { Music, Mic2, Play, Heart, MoreHorizontal, User } from 'lucide-react';
import './Library.css'; // We'll create this or reuse styles

// Mock Data
const USER_TRACKS = [
    { id: 1, title: 'Summer Vibes', artist: 'You', plays: 1205, duration: '3:45', image: '/img/3.jpg' },
    { id: 2, title: 'Neon Lights Demo', artist: 'You', plays: 850, duration: '2:30', image: '/img/3.jpg' },
    { id: 3, title: 'Late Night Coding', artist: 'You', plays: 2300, duration: '4:15', image: '/img/3.jpg' },
];

const OTHER_ARTISTS = [
    { id: 1, name: 'The Weeknd', genre: 'R&B / Pop', followers: '50M', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Dua Lipa', genre: 'Pop', followers: '45M', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Tame Impala', genre: 'Psychedelic Rock', followers: '12M', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Daft Punk', genre: 'Electronic', followers: '30M', image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&auto=format&fit=crop&q=60' },
];

const Library = () => {
    return (
        <div className="library-container w-full max-w-[1200px] mx-auto p-6 text-white font-sans">

            {/* SECTION 1: MUZYKA UŻYTKOWNIKA */}
            <div className="section mb-10">
                <div className="section-header flex items-center gap-3 mb-6">
                    <Music size={24} className="text-cyan-400" />
                    <h2 className="text-xl font-bold uppercase tracking-wider text-gray-200">Muzyka Użytkownika</h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6">
                    {USER_TRACKS.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {USER_TRACKS.map(track => (
                                <div key={track.id} className="group flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-800">
                                        <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={16} fill="white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-100 group-hover:text-cyan-400 transition-colors">{track.title}</h4>
                                        <span className="text-xs text-gray-400">{track.artist}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 hidden sm:block">{track.plays.toLocaleString()} plays</div>
                                    <div className="text-xs text-gray-500">{track.duration}</div>
                                    <button className="text-gray-400 hover:text-white p-2">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <p>You haven't uploaded any music yet.</p>
                            <button className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full text-sm font-bold">Upload Track</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Library;
