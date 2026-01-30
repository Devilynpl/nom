import React, { useEffect, useState } from 'react';
import './Community.css';
import { Trophy, TrendingUp, Music, Globe, List } from 'lucide-react';
import WorldCanvas from './world/WorldCanvas';
import ErrorBoundary from './ErrorBoundary';
import { getGroupById } from '../constants/groups';

const Community = ({ fetchLeaderboard }) => {
    const [leaders, setLeaders] = useState([]);
    const [viewMode, setViewMode] = useState('world'); // 'world' or 'list'

    useEffect(() => {
        if (fetchLeaderboard) {
            fetchLeaderboard().then(data => setLeaders(data));
        }
    }, [fetchLeaderboard]);

    return (
        <div className="community-container animate-fade h-full flex flex-col">
            <div className="community-header flex justify-between items-center p-4">
                <div>
                    <h1>Community Metaverse</h1>
                    <p>Explore the Vibe World or check the charts.</p>
                </div>
                <div className="view-toggle flex gap-2 bg-black/30 p-1 rounded-lg">
                    <button
                        className={`p-2 rounded ${viewMode === 'world' ? 'bg-cyan-500 text-black' : 'text-white'}`}
                        onClick={() => setViewMode('world')}
                        title="3D World"
                    >
                        <Globe size={20} />
                    </button>
                    <button
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-500 text-black' : 'text-white'}`}
                        onClick={() => setViewMode('list')}
                        title="Leaderboard"
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                {viewMode === 'world' ? (
                    <div className="w-full h-full absolute inset-0">
                        <ErrorBoundary>
                            <WorldCanvas />
                        </ErrorBoundary>
                    </div>
                ) : (
                    <div className="community-grid p-6 overflow-y-auto h-full">
                        <section className="leaderboard glass">
                            <div className="section-title">
                                <Trophy className="accent-gold" size={24} />
                                <h3>Top Vibes</h3>
                            </div>
                            <div className="leader-list" data-testid="trending-artists">
                                {leaders.length === 0 ? <p className="loading-text">Loading Leaderboard...</p> :
                                    leaders.map((leader, index) => (
                                        <div key={leader.id || leader.username} className={`leader-item ${index < 3 ? 'top-tier' : ''}`}>
                                            <span className="rank">#{index + 1}</span>
                                            <div className="leader-info">
                                                <div className="flex items-center gap-2">
                                                    <span className="name">{leader.username}</span>
                                                    <span
                                                        className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest border"
                                                        style={{
                                                            backgroundColor: `${getGroupById(leader.group_id).color}20`,
                                                            color: getGroupById(leader.group_id).color,
                                                            borderColor: `${getGroupById(leader.group_id).color}40`
                                                        }}
                                                    >
                                                        {getGroupById(leader.group_id).name}
                                                    </span>
                                                </div>
                                                {index === 0 && <span className="badge">👑 King</span>}
                                                {index === 1 && <span className="badge">🥈 Prince</span>}
                                            </div>
                                            <span className="points">{leader.points} pts</span>
                                        </div>
                                    ))}
                            </div>
                        </section>

                        <section className="rating-rules glass">
                            <div className="section-title">
                                <TrendingUp className="accent-cyan" size={24} />
                                <h3>How it Works</h3>
                            </div>
                            <ul>
                                <li><Music size={16} /> Rate tracks to earn <strong>Vibe Points</strong>.</li>
                                <li><Trophy size={16} /> Top 10 users get boosted exposure.</li>
                                <li><div className="vinyl-icon">💿</div> Reach <strong>50,000 Points</strong> for Vinyl Release.</li>
                            </ul>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
