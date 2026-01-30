import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, KeyboardControls, Text, useProgress, Loader } from '@react-three/drei'; // ensure useProgress is imported or remove if unused, wait - separate component for loader
import * as THREE from 'three';
import { Users } from 'lucide-react';
import ErrorBoundary from '../ErrorBoundary';
import { Physics } from '@react-three/rapier';
import Scene from './Scene';

console.log('WorldCanvas module loaded');

const LoadingScreen = () => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 text-cyan-400 font-mono">
            <div className="text-center">
                <div className="text-2xl mb-4 animate-pulse">LOADING METAVERSE...</div>
                {/* Simple loader */}
                <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 animate-progress origin-left w-full"></div>
                </div>
            </div>
        </div>
    );
};

const AvatarSelection = ({ onSelect }) => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white font-sans backdrop-blur-sm animate-fade-in">
            <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center drop-shadow-lg">
                CHOOSE YOUR AVATAR
            </h2>

            <div className="flex flex-col md:flex-row gap-10 mb-12">
                {/* Male Option */}
                <div
                    onClick={() => onSelect('male')}
                    className="group cursor-pointer flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all transform hover:scale-105"
                >
                    <div className="w-40 h-60 bg-gray-800/50 rounded-xl overflow-hidden relative border-2 border-transparent group-hover:border-cyan-400 transition-colors flex items-center justify-center">
                        <Users size={80} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-2xl uppercase tracking-widest text-white/20 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">SELECT</div>
                    </div>
                    <span className="text-xl font-bold text-gray-400 group-hover:text-cyan-400 uppercase tracking-wider">Male</span>
                </div>

                {/* Female Option */}
                <div
                    onClick={() => onSelect('female')}
                    className="group cursor-pointer flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400 hover:bg-purple-500/10 transition-all transform hover:scale-105"
                >
                    <div className="w-40 h-60 bg-gray-800/50 rounded-xl overflow-hidden relative border-2 border-transparent group-hover:border-purple-400 transition-colors flex items-center justify-center">
                        <Users size={80} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-2xl uppercase tracking-widest text-white/20 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">SELECT</div>
                    </div>
                    <span className="text-xl font-bold text-gray-400 group-hover:text-purple-400 uppercase tracking-wider">Female</span>
                </div>
            </div>

            <p className="text-gray-400 text-sm bg-black/50 px-4 py-2 rounded-full border border-white/10">
                Use <span className="text-cyan-400 font-bold">WASD</span> or <span className="text-cyan-400 font-bold">Arrows</span> to move • <span className="text-purple-400 font-bold">SHIFT</span> to Run • <span className="text-purple-400 font-bold">SPACE</span> to Jump
            </p>
        </div>
    );
};

const WorldCanvas = () => {
    const [avatarType, setAvatarType] = useState(null); // 'male' | 'female' | null

    const keyboardMap = [
        { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
        { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
        { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
        { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
        { name: 'jump', keys: ['Space'] },
        { name: 'run', keys: ['Shift'] },
    ];

    return (
        <div className="w-full h-full relative bg-indigo-900">
            {/* Avatar Selection Overlay */}
            {!avatarType && <AvatarSelection onSelect={setAvatarType} />}

            {/* ErrorBoundary to catch Canvas crashes */}
            <ErrorBoundary fallback={<div className="text-red-500 p-10 font-bold bg-white h-full">3D World Fatal Error</div>}>
                <KeyboardControls map={keyboardMap}>
                    <Canvas
                        shadows
                        camera={{ position: [0, 5, 10], fov: 50 }}
                        gl={{ preserveDrawingBuffer: true }}
                    >
                        <color attach="background" args={['#87CEEB']} />
                        <fog attach="fog" args={['#87CEEB', 20, 100]} />

                        {/* Debug Cube - If you see this but nothing else, Suspense is stuck */}
                        <mesh position={[2, 1, 0]}>
                            <boxGeometry />
                            <meshStandardMaterial color="red" />
                        </mesh>

                        <Suspense fallback={<mesh position={[0, 0, 0]}><sphereGeometry args={[0.5]} /><meshStandardMaterial color="white" wireframe /></mesh>}>
                            <Physics gravity={[0, -9.81, 0]}>
                                {avatarType && <Scene avatarType={avatarType} />}
                            </Physics>
                            {/* Simple lighting instead of Environment for reliability */}
                            <hemisphereLight intensity={0.5} groundColor="#444" color="#fff" />
                        </Suspense>
                        <OrbitControls makeDefault />
                    </Canvas>
                </KeyboardControls>
            </ErrorBoundary>

            {/* Debug Overlay */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <div className="bg-black/70 backdrop-blur-md p-4 rounded-xl border border-cyan-500/50 shadow-lg">
                    <h2 className="text-cyan-400 font-black text-lg">VIBE WORLD</h2>
                    <p className="text-white/70 text-xs text-green-400">● ONLINE</p>
                    <p className="text-white/50 text-[10px] mt-1">Controls: WASD / Arrows</p>
                </div>
            </div>

            {/* Loading Overlay */}
            <Loader containerStyles={{ background: 'rgba(0,0,0,0.9)' }} innerStyles={{ width: '300px' }} barStyles={{ background: '#06b6d4' }} dataStyles={{ color: '#06b6d4', fontFamily: 'monospace' }} />
        </div>
    );
};

export default WorldCanvas;
