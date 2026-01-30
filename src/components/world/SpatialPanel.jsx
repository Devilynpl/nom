import React from 'react';
import { Html } from '@react-three/drei';

/**
 * A reusable 3D UI panel that uses Drei's Html component
 */
const SpatialPanel = ({ children, position, rotation, title = "Panel" }) => {
    return (
        <group position={position} rotation={rotation}>
            <Html
                transform
                occlude
                distanceFactor={1.5}
                position={[0, 0, 0.05]}
                style={{
                    userSelect: 'none',
                    width: '320px',
                    perspective: '1000px'
                }}
            >
                <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl text-white">
                    {/* Header */}
                    <div className="bg-white/10 p-3 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-bold text-sm tracking-widest uppercase text-cyan-400">{title}</h3>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </Html>
        </group>
    );
};

export default SpatialPanel;
