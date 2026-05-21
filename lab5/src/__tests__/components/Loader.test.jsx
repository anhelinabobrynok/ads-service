import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Loader from '../../components/common/Loader';

describe('Loader component', () => {
    test('renders with correct role', () => {
        render(<Loader />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('renders loading text', () => {
        render(<Loader />);
        expect(screen.getByText('Loading…')).toBeInTheDocument();
    });

    test('has aria-label on status element', () => {
        render(<Loader />);
        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading content');
    });

    test('spinner element has aria-hidden', () => {
        const { container } = render(<Loader />);
        const spinner = container.querySelector('.loader__spinner');
        expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
});
