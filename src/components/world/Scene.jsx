import React, { useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useWorldStore } from '../../stores/useWorldStore';
import CharacterController from './CharacterController';
import Avatar from './Avatar';
import VibeStation from './VibeStation';
import Portal from './Portal';

const Scene = ({ avatarType }) => {
    const connect = useWorldStore((state) => state.connect);
    const players = useWorldStore((state) => state.players);
    const socket = useWorldStore((state) => state.socket);

    useEffect(() => {
        connect();
    }, [connect]);

    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1.5}
                castShadow
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={20}
            />

            {/* Helpers */}
            <gridHelper args={[100, 100, "#444", "#222"]} position={[0, 0.01, 0]} />

            {/* Grass Ground - Using a BOX for better physics stability */}
            <RigidBody type="fixed" colliders="cuboid">
                <mesh position={[0, -2.5, 0]} receiveShadow>
                    <boxGeometry args={[200, 5, 200]} />
                    <meshStandardMaterial color="#1a3317" roughness={1} />
                </mesh>
            </RigidBody>

            {/* Environment */}
            <VibeStation />

            {/* The Portal */}
            <Portal position={[-10, 1.5, -10]} destination="VIBE CITY" />

            {/* Local Player */}
            <CharacterController avatarType={avatarType} />

            {/* Remote Players */}
            {Object.entries(players).map(([id, data]) => {
                // Skip rendering self if we are in the list
                if (socket && id === socket.id) return null;

                const { x, y, z } = data;
                // Ensure valid positions
                if (x === undefined || y === undefined || z === undefined) return null;

                return (
                    <group key={id} position={[x, y, z]}>
                        <Avatar />
                    </group>
                );
            })}
        </>
    );
};

export default Scene;
