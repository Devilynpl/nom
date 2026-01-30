import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Community from './Community';

describe('Community Component', () => {
    it('renders community leaderboard', () => {
        render(<Community />);
        expect(screen.getByText(/Top Vibes/i)).toBeInTheDocument();
    });

    it('lists trending artists', () => {
        render(<Community />);
        const trendingList = screen.getByTestId('trending-artists');
        expect(trendingList).toBeInTheDocument();
    });
});
