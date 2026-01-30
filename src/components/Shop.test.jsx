import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Shop from './Shop';

describe('Shop Component', () => {
    it('renders point packages', () => {
        render(<Shop />);
        expect(screen.getByText(/Vibe Shop/i)).toBeInTheDocument();
        expect(screen.getByText(/50,000/i)).toBeInTheDocument();
    });

    it('shows the vinyl express package', () => {
        render(<Shop />);
        expect(screen.getByText(/Vinyl Express/i)).toBeInTheDocument();
    });
});
