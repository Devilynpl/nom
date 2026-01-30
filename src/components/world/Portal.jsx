import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

const Portal = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, destination = "Unknown" }) => {
    const portalRef = useRef();
    const coreRef = useRef();
    const ringRef1 = useRef();
    const ringRef2 = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (coreRef.current) {
            coreRef.current.rotation.y = time * 0.5;
            coreRef.current.rotation.z = time * 0.3;
        }

        if (ringRef1.current) {
            ringRef1.current.rotation.z = time * 0.8;
            ringRef1.current.rotation.x = time * 0.2;
        }

        if (ringRef2.current) {
            ringRef2.current.rotation.z = -time * 1.2;
            ringRef2.current.rotation.y = time * 0.4;
        }
    });

    return (
        <group position={position} rotation={rotation} scale={scale} ref={portalRef}>
            {/* Swirling Core */}
            <Float speed={5} rotationIntensity={2} floatIntensity={1}>
                <mesh ref={coreRef}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <MeshDistortMaterial
                        color="#a855f7"
                        speed={4}
                        distort={0.6}
                        radius={1}
                        emissive="#7e22ce"
                        emissiveIntensity={4}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            </Float>

            {/* Outer Rings */}
            <mesh ref={ringRef1} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.5, 0.05, 16, 100]} />
                <meshStandardMaterial
                    color="#ec4899"
                    emissive="#ec4899"
                    emissiveIntensity={10}
                    toneMapped={false}
                />
            </mesh>

            <mesh ref={ringRef2} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                <torusGeometry args={[1.8, 0.03, 16, 100]} />
                <meshStandardMaterial
                    color="#3b82f6"
                    emissive="#3b82f6"
                    emissiveIntensity={10}
                    toneMapped={false}
                />
            </mesh>

            {/* Portal Floor Glow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <circleGeometry args={[2.5, 32]} />
                <meshStandardMaterial
                    color="#a855f7"
                    emissive="#a855f7"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.2}
                />
            </mesh>

            {/* Destination Label */}
            <Text
                position={[0, 2.5, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {`PORTAL TO: ${destination}`}
                <meshStandardMaterial emissive="white" emissiveIntensity={2} />
            </Text>

            {/* Light Source */}
            <pointLight position={[0, 1, 0]} intensity={5} color="#a855f7" distance={10} />
        </group>
    );
};

export default Portal;
