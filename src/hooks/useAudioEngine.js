import { useRef, useEffect, useState } from 'react';
import * as Tone from 'tone';

export const useAudioEngine = () => {
    const [isReady, setIsReady] = useState(false);
    const audioContext = useRef(null);

    const startAudio = async () => {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        audioContext.current = Tone.context;
        setIsReady(true);
        console.log('Audio Engine Started');
    };

    useEffect(() => {
        // Cleanup on unmount if needed, though usually context persists
        return () => {
            // Tone.Transport.stop();
        };
    }, []);

    return {
        isReady,
        startAudio,
        Tone
    };
};
