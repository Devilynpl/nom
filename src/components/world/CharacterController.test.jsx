import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CharacterController from './CharacterController';
import React from 'react';

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
    useFrame: vi.fn(),
    useThree: () => ({ controls: { target: { lerp: vi.fn() }, update: vi.fn() } }),
}));

// Mock @react-three/rapier
vi.mock('@react-three/rapier', () => ({
    RigidBody: ({ children }) => <div data-testid="rigid-body-mock">{children}</div>,
}));

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
    useKeyboardControls: () => [null, () => ({ forward: false, backward: false, left: false, right: false, jump: false })],
}));

// Mock the store
vi.mock('../../stores/useWorldStore', () => ({
    useWorldStore: (selector) => selector({ sendUpdate: vi.fn() }),
}));

// Mock Avatar
vi.mock('./Avatar', () => ({
    default: () => <div data-testid="avatar-mock" />,
}));

describe('CharacterController', () => {
    it('renders the character with a rigid body and avatar', () => {
        render(<CharacterController />);
        expect(screen.getByTestId('rigid-body-mock')).toBeDefined();
        expect(screen.getByTestId('avatar-mock')).toBeDefined();
    });
});
