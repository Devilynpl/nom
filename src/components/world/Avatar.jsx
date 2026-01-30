import React, { useMemo } from 'react';
import { useFBX } from '@react-three/drei';

const Avatar = ({
    type = 'male', // 'male' or 'female'
    ...props
}) => {
    // Load models
    // Note: ensure these files exist in public/models/
    const maleModel = useFBX('/models/male.fbx');
    const femaleModel = useFBX('/models/female.fbx');

    const model = useMemo(() => {
        if (!type) return null;
        const m = type === 'female' ? femaleModel : maleModel;
        return m.clone();
    }, [type, maleModel, femaleModel]);

    return (
        <group dispose={null} {...props}>
            {/* Fallback Character - simpler and correctly scaled */}
            {!model && (
                <mesh position={[0, 0.9, 0]}>
                    <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
                    <meshStandardMaterial color={type === 'female' ? "#d946ef" : "#06b6d4"} />
                </mesh>
            )}

            {model && (
                <primitive
                    object={model}
                    scale={0.001} // Scale for MM to Meters (Mixamo standard)
                    position={[0, 0, 0]}
                />
            )}
        </group>
    );
};

export default Avatar;
