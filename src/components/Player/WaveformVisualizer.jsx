import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { usePlayerStore } from '../../store/usePlayerStore';

const WaveformVisualizer = ({ height = 40, color = '#bc59ff' }) => {
    const containerRef = useRef(null);
    const wavesurfer = useRef(null);
    const { currentTrack, isPlaying } = usePlayerStore();

    useEffect(() => {
        if (!containerRef.current) return;

        wavesurfer.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor: 'rgba(255, 255, 255, 0.3)',
            progressColor: color,
            cursorColor: 'transparent',
            barWidth: 2,
            barGap: 3,
            barRadius: 3,
            height: height,
            responsive: true,
            normalize: true,
            // Use a dummy audio buffer or generated peaks if no actual audio url for analysis
            // For now, we might need the actual audio file URL to render meaningful waves
            // If currentTrack has a 'previewUrl' or similar
        });

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        };
    }, [color, height]);

    // Update waveform when track changes
    useEffect(() => {
        if (wavesurfer.current && currentTrack?.audioUrl) {
            wavesurfer.current.load(currentTrack.audioUrl);
        }
    }, [currentTrack]);

    // Sync Play/Pause
    useEffect(() => {
        if (wavesurfer.current) {
            isPlaying ? wavesurfer.current.play() : wavesurfer.current.pause();
        }
    }, [isPlaying]);

    return <div ref={containerRef} className="w-full" />;
};

export default WaveformVisualizer;
