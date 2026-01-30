import React, { useState } from 'react';
import './ChordWizard.css';
import { Music, PlayCircle, RefreshCw, Sliders } from 'lucide-react';

const ChordWizard = () => {
    const [root, setRoot] = useState('C');
    const [scaleType, setScaleType] = useState('Major');
    const [progression, setProgression] = useState([]);
    const [playing, setPlaying] = useState(-1); // Index of currently playing chord

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const scales = {
        'Major': [0, 2, 4, 5, 7, 9, 11], // Semitones from root
        'Minor': [0, 2, 3, 5, 7, 8, 10],
        'Dorian': [0, 2, 3, 5, 7, 9, 10],
        'Lydian': [0, 2, 4, 6, 7, 9, 11]
    };

    // Simple lookup for "Moods" to progressions
    const patterns = {
        'Pop Hit': [1, 5, 6, 4], // I-V-vi-IV
        'Sad Ballad': [6, 4, 1, 5], // vi-IV-I-V
        'Jazz Vibe': [2, 5, 1, 6], // ii-V-I-vi
        'Dark Trap': [1, 6, 3, 7]  // i-VI-III-VII
    };

    const getNote = (rootIdx, interval) => {
        return keys[(rootIdx + interval) % 12];
    };

    const generate = (patternName) => {
        const rootIdx = keys.indexOf(root);
        const currentScale = scales[scaleType] || scales['Major'];
        const patternIndices = patterns[patternName] || patterns['Pop Hit'];

        const chords = patternIndices.map(degree => {
            // Very simplified triad generation
            // In a real app, this would handle 7ths, inversions, etc.
            const baseInterval = currentScale[degree - 1]; // 0-indexed scale degree
            const rootNote = getNote(rootIdx, baseInterval);

            // Generate basic triad names
            let type = '';
            if (scaleType === 'Major') {
                if ([2, 3, 6].includes(degree)) type = 'm';
                if (degree === 7) type = 'dim';
            } else {
                if ([1, 4, 5].includes(degree)) type = 'm'; // Correcting for minor scale roughly
            }

            return { name: rootNote + type, degree: degree };
        });

        setProgression(chords);
    };

    const playChord = (chord, index) => {
        setPlaying(index);
        // Oscillator logic would go here
        // For prototype, we just animate visual
        setTimeout(() => setPlaying(-1), 500);
    };

    return (
        <div className="chord-container animate-fade">
            <div className="wizard-header">
                <div className="icon-box gold">
                    <Music size={32} />
                </div>
                <h1>Chord Wizard</h1>
                <p>Generate hit progressions instantly.</p>
            </div>

            <div className="wizard-controls glass">
                <div className="control-group">
                    <label>Key</label>
                    <select value={root} onChange={(e) => setRoot(e.target.value)}>
                        {keys.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>

                <div className="control-group">
                    <label>Scale</label>
                    <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
                        {Object.keys(scales).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="mood-grid">
                    {Object.keys(patterns).map(p => (
                        <button key={p} className="mood-btn" onClick={() => generate(p)}>
                            <SparklesIco /> {p}
                        </button>
                    ))}
                </div>
            </div>

            {progression.length > 0 && (
                <div className="progression-display">
                    {progression.map((chord, i) => (
                        <div
                            key={i}
                            className={`chord-card glass ${playing === i ? 'playing' : ''}`}
                            onClick={() => playChord(chord, i)}
                        >
                            <span className="degree">{'I II III IV V VI VII'.split(' ')[chord.degree - 1]}</span>
                            <h2>{chord.name}</h2>
                            <PlayCircle size={24} className="play-icon" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SparklesIco = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

export default ChordWizard;
