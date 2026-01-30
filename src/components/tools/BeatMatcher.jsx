import React, { useState, useEffect, useRef } from 'react';
import './BeatMatcher.css';
import { Play, Square, Zap, Activity } from 'lucide-react';

// Web Audio API Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const BeatMatcher = () => {
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [tapTimes, setTapTimes] = useState([]);

    // Refs for timing to avoid re-renders breaking the groove
    const nextNoteTime = useRef(0);
    const timerID = useRef(null);
    const lookahead = 25.0; // ms
    const scheduleAheadTime = 0.1; // s

    // Sound Synthesis (Simple Beep)
    const playClick = (time) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.frequency.value = 1000;
        osc.type = 'square'; // Aggressive click

        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(time);
        osc.stop(time + 0.1);

        // Visual Pulse trigger (via DOM for performance or state)
        const visual = document.getElementById('metronome-visual');
        if (visual) {
            visual.style.transform = 'scale(1.2)';
            visual.style.boxShadow = '0 0 50px #00f2ff';
            setTimeout(() => {
                visual.style.transform = 'scale(1)';
                visual.style.boxShadow = '0 0 20px rgba(0,242,255,0.2)';
            }, 50);
        }
    };

    const scheduler = () => {
        while (nextNoteTime.current < audioCtx.currentTime + scheduleAheadTime) {
            playClick(nextNoteTime.current);
            const secondsPerBeat = 60.0 / bpm;
            nextNoteTime.current += secondsPerBeat;
        }
        timerID.current = window.setTimeout(scheduler, lookahead);
    };

    const togglePlay = () => {
        if (isPlaying) {
            window.clearTimeout(timerID.current);
            setIsPlaying(false);
        } else {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            nextNoteTime.current = audioCtx.currentTime + 0.05;
            scheduler();
            setIsPlaying(true);
        }
    };

    const handleTap = () => {
        const now = Date.now();
        const newTaps = [...tapTimes, now].filter(t => now - t < 2000); // Keep last 2s

        if (newTaps.length > 1) {
            const intervals = [];
            for (let i = 1; i < newTaps.length; i++) {
                intervals.push(newTaps[i] - newTaps[i - 1]);
            }
            const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const newBpm = Math.round(60000 / avgInterval);
            if (newBpm > 30 && newBpm < 300) setBpm(newBpm);
        }
        setTapTimes(newTaps);
    };

    // Cleanup
    useEffect(() => {
        return () => window.clearTimeout(timerID.current);
    }, []);

    return (
        <div className="metronome-container animate-fade">
            <div className="metronome-card glass">
                <div className="display-section">
                    <div id="metronome-visual" className="visual-pulse">
                        <Activity size={48} />
                    </div>
                    <h1 className="bpm-display">{bpm} <span className="label">BPM</span></h1>
                </div>

                <div className="controls-section">
                    <input
                        type="range"
                        min="40"
                        max="240"
                        value={bpm}
                        onChange={(e) => setBpm(Number(e.target.value))}
                        className="bpm-slider"
                    />

                    <div className="action-buttons">
                        <button className="tap-btn" onClick={handleTap}>
                            TAP TEMPO
                        </button>
                        <button className={`play-btn ${isPlaying ? 'active' : ''}`} onClick={togglePlay}>
                            {isPlaying ? <Square size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>
                    </div>

                    <div className="presets">
                        {[90, 120, 140, 174].map(p => (
                            <button key={p} className="preset-btn" onClick={() => setBpm(p)}>{p}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="tool-info">
                <Zap className="accent-gold" />
                <p>Pro Tip: Use Tap Tempo to discover the BPM of samples.</p>
            </div>
        </div>
    );
};

export default BeatMatcher;
