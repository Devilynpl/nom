import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Player from './Player';

describe('Player Component', () => {
    it('renders the current track info', () => {
        render(<Player currentTrack={{ title: 'Test Track', artist: 'Test Artist' }} />);
        expect(screen.getByText(/Now Playing/i)).toBeInTheDocument();
        expect(screen.getByText(/Test Track/i)).toBeInTheDocument();
    });

    it('contains play and skip controls', () => {
        render(<Player currentTrack={{ title: 'Test Track', artist: 'Test Artist' }} />);
        expect(screen.getByLabelText(/play/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/next/i)).toBeInTheDocument();
    });
});
