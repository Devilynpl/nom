import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SpatialPanel from './SpatialPanel';
import React from 'react';

// Mock @react-three/drei Html since it requires a Canvas context
vi.mock('@react-three/drei', () => ({
    Html: ({ children }) => <div data-testid="html-mock">{children}</div>,
}));

describe('SpatialPanel', () => {
    it('renders title and children', () => {
        render(
            <SpatialPanel title="Test Panel">
                <button>Click Me</button>
            </SpatialPanel>
        );

        expect(screen.getByText('Test Panel')).toBeInTheDocument();
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
});
