import React, { useRef, useEffect } from 'react';
import { PositionalAudio, Float, MeshDistortMaterial, Text } from '@react-three/drei';
import SpatialPanel from './SpatialPanel';
import { usePlayerStore } from '../../store/usePlayerStore';

const VibeStation = ({ position = [5, 2, 5], rotation = [0, -Math.PI / 4, 0] }) => {
    const audioRef = useRef();
    const { currentTrack, isPlaying } = usePlayerStore();

    useEffect(() => {
        if (audioRef.current && currentTrack?.src) {
            // In a real app, we'd load the track here if not already loaded
            // PositionalAudio works best with an AudioBuffer or a URL
        }
    }, [currentTrack]);

    return (
        <group position={position} rotation={rotation}>
            {/* Floating Visualizer / Core */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <MeshDistortMaterial
                        color="#00f2ff"
                        speed={2}
                        distort={0.4}
                        radius={0.8}
                        emissive="#00f2ff"
                        emissiveIntensity={2}
                    />
                </mesh>

                {/* Decorative Rings */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.2, 0.02, 16, 100]} />
                    <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} />
                </mesh>
                <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                    <torusGeometry args={[1.4, 0.02, 16, 100]} />
                    <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={5} />
                </mesh>
            </Float>

            {/* Platform / Pedestal */}
            <mesh position={[0, -2, 0]}>
                <cylinderGeometry args={[1.5, 2, 0.2, 32]} />
                <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Under-glow */}
            <pointLight position={[0, -1.8, 0]} intensity={2} color="#00f2ff" distance={5} />

            {/* Spatial UI Panel */}
            <group position={[1.5, 0.5, 0]} rotation={[0, -Math.PI / 6, 0]}>
                <SpatialPanel title="VIBE STATION">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/10">
                            <div className="w-10 h-10 rounded bg-cyan-500/20 flex items-center justify-center">
                                <span className="text-xl">🎵</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[10px] text-cyan-400 font-bold tracking-tighter uppercase">Now Playing</p>
                                <p className="text-xs font-bold truncate">{currentTrack?.title || "No Track Selected"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button className="py-2 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold transition-all border border-white/5 hover:border-cyan-500/50">
                                ⏭ NEXT
                            </button>
                            <button className="py-2 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold transition-all border border-white/5 hover:border-purple-500/50">
                                📋 QUEUE
                            </button>
                        </div>

                        <button
                            className={`w-full py-2.5 rounded text-xs font-black tracking-widest uppercase transition-all shadow-lg ${isPlaying
                                ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-[1.02] active:scale-95 shadow-cyan-500/20'
                                }`}
                        >
                            {isPlaying ? 'PAUSE TRACK' : 'BOOT VIBE ENGINE'}
                        </button>
                    </div>
                </SpatialPanel>
            </group>

            {/* Floating text for atmosphere */}
            {/* <Text
                position={[0, 2, 0]}
                fontSize={0.2}
                color="white"
                font="https://fonts.gstatic.com/s/russoone/v14/ZnuqByFId9V-p9y7C23l4vAt7A.woff"
                anchorX="center"
                anchorY="middle"
            >
                PROTOCOL: VIBE_SYNC
            </Text> */}

            {/* Positional Audio Hookup */}
            {/* {isPlaying && currentTrack?.src && (
                <PositionalAudio
                    ref={audioRef}
                    url={currentTrack.src}
                    distance={10}
                    loop
                />
            )} */}
        </group>
    );
};

export default VibeStation;
