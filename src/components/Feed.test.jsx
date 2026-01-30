import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Feed from './Feed';

describe('Feed Component', () => {
    it('renders a welcome message', () => {
        render(<Feed />);
        expect(screen.getByText(/Feed/i)).toBeInTheDocument();
    });

    it('renders a list of track cards', () => {
        render(<Feed />);
        const trackCards = screen.getAllByTestId('track-card');
        expect(trackCards.length).toBeGreaterThan(0);
    });
});
