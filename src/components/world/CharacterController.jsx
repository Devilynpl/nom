import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import Avatar from './Avatar';
import { useWorldStore } from '../../stores/useWorldStore';

const SPEED = 5;
const JUMP_FORCE = 5;

const CharacterController = (props) => {
    const rigidBody = useRef();
    const [, getKeys] = useKeyboardControls();
    const { controls } = useThree();
    const sendUpdate = useWorldStore(state => state.sendUpdate);
    const lastUpdate = useRef(0);

    useFrame((state) => {
        if (!rigidBody.current) return;

        const { forward, backward, left, right, jump } = getKeys();

        const linvel = rigidBody.current.linvel();
        const translation = rigidBody.current.translation();

        const direction = new THREE.Vector3();
        if (forward) direction.z -= 1;
        if (backward) direction.z += 1;
        if (left) direction.x -= 1;
        if (right) direction.x += 1;

        if (direction.length() > 0) {
            direction.normalize().multiplyScalar(SPEED);
        }

        // Apply velocity (preserve Y for gravity)
        rigidBody.current.setLinvel({
            x: direction.x,
            y: linvel.y,
            z: direction.z
        }, true);

        // Jump (Simple ground check via velocity)
        if (jump && Math.abs(linvel.y) < 0.1) {
            rigidBody.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
        }

        // Camera Follow
        if (controls) {
            controls.target.lerp(new THREE.Vector3(translation.x, translation.y, translation.z), 0.1);
            controls.update();
        }

        // Network Sync (20Hz)
        const now = state.clock.getElapsedTime();
        if (now - lastUpdate.current > 0.05) {
            sendUpdate({
                x: translation.x,
                y: translation.y,
                z: translation.z
            });
            lastUpdate.current = now;
        }
    });

    return (
        <RigidBody
            ref={rigidBody}
            colliders="cuboid"
            lockRotations
            position={[0, 5, 0]}
            friction={0}
        >
            <Avatar type={props.avatarType} />
        </RigidBody>
    );
};

export default CharacterController;
