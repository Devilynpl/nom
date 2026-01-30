import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Profile from './Profile';

describe('Profile Component', () => {
    const mockUser = {
        name: 'Alex Vibe',
        vibePoints: 850,
        vinylThreshold: 1000,
        tracks: [{ id: 1, title: 'Deep Bass', rating: 4.8 }]
    };

    it('renders user name and vibe points', () => {
        render(<Profile user={mockUser} />);
        expect(screen.getByText(/Alex Vibe/i)).toBeInTheDocument();
        expect(screen.getAllByText(/850/i).length).toBeGreaterThan(0);
    });

    it('shows progress towards vinyl release', () => {
        render(<Profile user={mockUser} />);
        expect(screen.getByText(/Vinyl Goal/i)).toBeInTheDocument();
        const progressBar = screen.getByTestId('vinyl-progress');
        expect(progressBar).toBeInTheDocument();
    });
});
