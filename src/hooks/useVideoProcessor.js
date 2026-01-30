import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

/**
 * useVideoProcessor Hook - Provides FFmpeg-based video processing capabilities (loading, compression).
 * Requires SharedArrayBuffer for multi-threading if using modern browsers.
 * @returns {{ready: boolean, load: Function, compress: Function, processing: boolean}} Video processor state and methods.
 */
export const useVideoProcessor = () => {
    const [ready, setReady] = useState(false);
    const [processing, setProcessing] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef(null);

    const load = async () => {
        if (ready) return;

        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on('log', ({ message }) => {
            messageRef.current = message;
            console.log(message);
        });

        // Load ffmpeg.wasm from CDN
        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setReady(true);
        } catch (e) {
            console.error('FFmpeg load failed:', e);
            // Fallback or alert user about headers if needed
        }
    };

    const compress = async (file) => {
        if (!ready) await load();
        setProcessing(true);

        const ffmpeg = ffmpegRef.current;
        const inputName = 'input.mp4';
        const outputName = 'output.mp4';

        await ffmpeg.writeFile(inputName, await fetchFile(file));

        // Compress: Scale to 720p height, Preset ultrafast (for speed in browser)
        await ffmpeg.exec(['-i', inputName, '-vf', 'scale=-1:720', '-c:v', 'libx264', '-preset', 'ultrafast', outputName]);

        const data = await ffmpeg.readFile(outputName);
        setProcessing(false);

        return new Blob([data.buffer], { type: 'video/mp4' });
    };

    return { ready, load, compress, processing };
};
