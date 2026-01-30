import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { X, Play, Music } from 'lucide-react';
import './PlaylistOverlay.css';

const PlaylistOverlay = ({ isOpen, onClose }) => {
    const { playlist, currentTrack, playTrack, isPlaying } = usePlayerStore();

    if (!isOpen) return null;

    return (
        <div className="playlist-overlay glass animate-slide-up">
            <div className="playlist-header">
                <div>
                    <h3>My 10 Favorite Songs</h3>
                    <p className="subtitle">{playlist.length} tracks in queue</p>
                </div>
                <button onClick={onClose} className="close-btn">
                    <X size={20} />
                </button>
            </div>

            <div className="playlist-content">
                {playlist.map((track, index) => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                        <div
                            key={track.id}
                            className={`playlist-item ${isActive ? 'active' : ''}`}
                            onClick={() => playTrack(track)}
                        >
                            <div className="item-index">
                                {isActive && isPlaying ? (
                                    <div className="playing-bars">
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                    </div>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <div className="item-art">
                                <Music size={16} />
                            </div>
                            <div className="item-info">
                                <h4>{track.title}</h4>
                                <p>{track.artist}</p>
                            </div>
                            {isActive && (
                                <div className="active-indicator">
                                    <Play size={14} fill="currentColor" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlaylistOverlay;
