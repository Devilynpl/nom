import React, { useRef, useEffect, useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import WaveformVisualizer from './Player/WaveformVisualizer';
import PlaylistOverlay from './Player/PlaylistOverlay';
import { Play, Pause, SkipBack, SkipForward, ListMusic, Music } from 'lucide-react';
import './Player.css';

const Player = () => {
    const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, volume, setVolume, bass, setBass } = usePlayerStore();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying && currentTrack) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const displayTrack = currentTrack || {
        title: "Select a track",
        artist: "Vibe Player Ready",
        cover: null,
        src: null
    };

    return (
        <div className="player-container glass">
            <audio
                ref={audioRef}
                src={displayTrack.src}
                onEnded={nextTrack}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
            />

            <PlaylistOverlay
                isOpen={isPlaylistOpen}
                onClose={() => setIsPlaylistOpen(false)}
            />

            <div className="track-display relative group">
                <div className="track-art cursor-pointer transition-transform group-hover:scale-105">
                    {displayTrack.cover ? (
                        <img src={displayTrack.cover} alt="Cover" className="w-full h-full object-cover rounded-md shadow-md" />
                    ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-md">
                            <Music size={24} className="text-cyan-400" />
                        </div>
                    )}
                </div>

                {/* HOVER POPUP: Large Cover & Info */}
                <div className="absolute bottom-full left-0 mb-6 w-72 p-4 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-2xl transform translate-y-4 group-hover:translate-y-0 pointer-events-none">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 shadow-lg border border-white/5">
                        {displayTrack.cover ? (
                            <img src={displayTrack.cover} alt="Large Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-indigo-900 flex items-center justify-center">
                                <Music size={64} className="text-white/20" />
                            </div>
                        )}
                        {/* Shimmer Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-white font-black text-xl leading-tight line-clamp-2">{displayTrack.title}</h3>
                        <p className="text-cyan-400 text-sm font-medium">{displayTrack.artist}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-mono">
                        <span className="flex items-center gap-1.5">
                            <Music size={10} /> {displayTrack.id ? 'TRACK ID: ' + displayTrack.id.toString().slice(-4).toUpperCase() : 'NO ID'}
                        </span>
                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>
                </div>

                <div className="track-meta">
                    <p className="now-playing">Now Playing</p>
                    <h4>{displayTrack.title}</h4>
                    <p className="artist">{displayTrack.artist}</p>
                </div>
            </div>

            <div className="player-center-group">
                <div className="player-controls">
                    <button className="control-btn" onClick={prevTrack}><SkipBack size={24} fill="currentColor" /></button>
                    <button className="play-btn" onClick={togglePlay}>
                        {isPlaying ? <Pause size={30} fill="#C0C0C0" /> : <Play size={30} fill="#C0C0C0" />}
                    </button>
                    <button className="control-btn" onClick={nextTrack}><SkipForward size={24} fill="currentColor" /></button>
                </div>

                <div className="progress-bar-container">
                    <span className="time-text">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="vibe-range progress-range"
                    />
                    <span className="time-text">{formatTime(duration)}</span>
                </div>
            </div>

            <div className="sound-controls">
                <div className="control-group">
                    <span className="control-label">VOL</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="vibe-range volume-slider"
                    />
                </div>
                <div className="control-group">
                    <span className="control-label">BASS</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={bass}
                        onChange={(e) => setBass(parseInt(e.target.value))}
                        className="vibe-range bass-slider"
                    />
                </div>
            </div>

            <div className="extra-controls ml-4 flex items-center">
                <button
                    className={`control-btn ${isPlaylistOpen ? 'text-cyan-400' : ''}`}
                    onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                    title="Playlist"
                >
                    <ListMusic size={24} />
                </button>
            </div>
        </div>
    );
};

export default Player;
