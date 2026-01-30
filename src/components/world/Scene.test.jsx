import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Scene from './Scene';
import React from 'react';

// Mock @react-three/rapier
vi.mock('@react-three/rapier', () => ({
    RigidBody: ({ children, colliders }) => <div data-testid={`rigid-body-${colliders || 'fixed'}`}>{children}</div>,
}));

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
    useFrame: vi.fn(),
    useThree: () => ({ controls: { target: { lerp: vi.fn() }, update: vi.fn() } }),
}));

// Mock the store
vi.mock('../../stores/useWorldStore', () => ({
    useWorldStore: (selector) => selector({
        connect: vi.fn(),
        players: { '123': { x: 1, y: 1, z: 1 } },
        sendUpdate: vi.fn()
    }),
}));

// Mock CharacterController
vi.mock('./CharacterController', () => ({
    default: () => <div data-testid="character-controller-mock" />,
}));

// Mock Avatar
vi.mock('./Avatar', () => ({
    default: () => <div data-testid="avatar-mock" />,
}));

// Mock VibeStation
vi.mock('./VibeStation', () => ({
    default: () => <div data-testid="vibe-station-mock">VIBE STATION</div>,
}));

// Mock Portal
vi.mock('./Portal', () => ({
    default: ({ destination }) => <div data-testid="portal-mock">{`PORTAL TO: ${destination}`}</div>,
}));

const originalConsoleError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (typeof args[0] === 'string' && /incorrect casing|unrecognized/.test(args[0])) return;
        originalConsoleError(...args);
    };
});
afterAll(() => console.error = originalConsoleError);

describe('Scene', () => {
    it('renders ground, character, other players and Vibe Station', () => {
        render(<Scene />);

        // Ground
        expect(screen.getByTestId('rigid-body-cuboid')).toBeDefined();

        // Player
        expect(screen.getByTestId('character-controller-mock')).toBeDefined();

        // Other Players (Avatar)
        expect(screen.getAllByTestId('avatar-mock')).toBeDefined();

        // Vibe Station Central Hub
        expect(screen.getByTestId('vibe-station-mock')).toBeDefined();
        expect(screen.getByText('VIBE STATION')).toBeDefined();

        // Portal
        expect(screen.getByTestId('portal-mock')).toBeDefined();
        expect(screen.getByText('PORTAL TO: VIBE CITY')).toBeDefined();
    });
});
