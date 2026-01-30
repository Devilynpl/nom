import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Mic, Volume2, Sliders, Zap, Power } from 'lucide-react';
import './VoiceFX.css';

const VoiceFX = () => {
    const [isReady, setIsReady] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // FX Parameters
    const [pitch, setPitch] = useState(0); // -12 to +12
    const [reverbWet, setReverbWet] = useState(0); // 0 to 1
    const [distortion, setDistortion] = useState(0); // 0 to 1
    const [delayTime, setDelayTime] = useState(0); // 0 to 1 (s)

    // Refs for Tone objects
    const micRef = useRef(null);
    const pitchShiftRef = useRef(null);
    const reverbRef = useRef(null);
    const distRef = useRef(null);
    const delayRef = useRef(null);
    const analyserRef = useRef(null);
    const canvasRef = useRef(null);

    const initializeAudio = async () => {
        await Tone.start();

        micRef.current = new Tone.UserMedia();
        pitchShiftRef.current = new Tone.PitchShift({ pitch: 0 }).toDestination();
        reverbRef.current = new Tone.Reverb({ decay: 2, wet: 0 }).toDestination();
        distRef.current = new Tone.Distortion({ distortion: 0, wet: 0 }).toDestination();
        delayRef.current = new Tone.FeedbackDelay({ delayTime: 0, feedback: 0.2, wet: 0 }).toDestination();
        analyserRef.current = new Tone.Analyser('waveform', 256);

        // Chain: Mic -> Pitch -> Distortion -> Delay -> Reverb -> Analyser -> Output
        // Note: We fan out to destinations or chain them. Ideally:
        // Mic -> Splits -> Effects -> Destination
        // Simple chain:
        micRef.current.connect(pitchShiftRef.current);
        pitchShiftRef.current.connect(distRef.current);
        distRef.current.connect(delayRef.current);
        delayRef.current.connect(reverbRef.current);
        reverbRef.current.connect(analyserRef.current);
        // Each effect also needs to connect to the next or handle mix carefully. 
        // Tone.js effects often pass through dry signal if wet > 0.
        // Connecting all straight to destination might double signal, so we standard chain.

        // Re-routing for serial chain
        micRef.current.disconnect();
        pitchShiftRef.current.disconnect();
        distRef.current.disconnect();
        delayRef.current.disconnect();
        reverbRef.current.disconnect();

        micRef.current.chain(
            pitchShiftRef.current,
            distRef.current,
            delayRef.current,
            reverbRef.current,
            analyserRef.current,
            Tone.Destination
        );

        setIsReady(true);
    };

    const toggleMic = async () => {
        if (!isReady) await initializeAudio();

        if (isActive) {
            micRef.current.close();
            setIsActive(false);
        } else {
            try {
                await micRef.current.open();
                setIsActive(true);
                drawVisualizer();
            } catch (e) {
                alert('Mic access denied or error');
                console.error(e);
            }
        }
    };

    // Effect Update Listeners
    useEffect(() => {
        if (pitchShiftRef.current) pitchShiftRef.current.pitch = pitch;
    }, [pitch]);

    useEffect(() => {
        if (reverbRef.current) reverbRef.current.wet.value = reverbWet;
    }, [reverbWet]);

    useEffect(() => {
        if (distRef.current) {
            distRef.current.distortion = distortion;
            distRef.current.wet.value = distortion > 0 ? 1 : 0;
        }
    }, [distortion]);

    useEffect(() => {
        if (delayRef.current) {
            delayRef.current.delayTime.value = delayTime;
            delayRef.current.wet.value = delayTime > 0 ? 0.5 : 0;
        }
    }, [delayTime]);

    const drawVisualizer = () => {
        if (!isActive || !canvasRef.current || !analyserRef.current) return;

        requestAnimationFrame(drawVisualizer);
        const buffer = analyserRef.current.getValue();
        const ctx = canvasRef.current.getContext('2d');
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;

        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00f2ff';
        ctx.beginPath();

        const sliceWidth = w / buffer.length;
        let x = 0;

        for (let i = 0; i < buffer.length; i++) {
            const v = (buffer[i] + 1) / 2; // Normalize -1..1 to 0..1
            const y = v * h;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            x += sliceWidth;
        }
        ctx.stroke();
    };

    return (
        <div className="voice-fx-container animate-fade">
            <div className="fx-header">
                <h1>Voice FX Lab <span className="beta-tag">BETA</span></h1>
                <p>Real-time vocal processing provided by Tone.js</p>
            </div>

            <div className="main-stage glass">
                <canvas ref={canvasRef} width="600" height="150" className="visualizer"></canvas>

                <button
                    className={`power-btn ${isActive ? 'active' : ''}`}
                    onClick={toggleMic}
                >
                    <Power size={32} />
                    {isActive ? 'LIVE' : 'ACTIVATE MIC'}
                </button>
            </div>

            <div className="controls-grid glass">
                <div className="control-slider">
                    <label><Zap size={16} /> Pitch Shift ({pitch > 0 ? '+' : ''}{pitch} st)</label>
                    <input
                        type="range" min="-12" max="12" step="1"
                        value={pitch} onChange={e => setPitch(Number(e.target.value))}
                    />
                </div>

                <div className="control-slider">
                    <label><Volume2 size={16} /> Reverb ({(reverbWet * 100).toFixed(0)}%)</label>
                    <input
                        type="range" min="0" max="1" step="0.1"
                        value={reverbWet} onChange={e => setReverbWet(Number(e.target.value))}
                    />
                </div>

                <div className="control-slider">
                    <label><Sliders size={16} /> Distortion ({(distortion * 100).toFixed(0)}%)</label>
                    <input
                        type="range" min="0" max="1" step="0.1"
                        value={distortion} onChange={e => setDistortion(Number(e.target.value))}
                    />
                </div>

                <div className="control-slider">
                    <label><ActivityIcon /> Delay ({delayTime}s)</label>
                    <input
                        type="range" min="0" max="1" step="0.1"
                        value={delayTime} onChange={e => setDelayTime(Number(e.target.value))}
                    />
                </div>
            </div>

            <div className="warning-box">
                ⚠️ Use headphones to prevent feedback loops!
            </div>
        </div>
    );
};

const ActivityIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

export default VoiceFX;
