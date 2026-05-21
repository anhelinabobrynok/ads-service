import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('EmptyState component', () => {
    test('renders title', () => {
        renderWithRouter(<EmptyState title="Nothing here yet" />);
        expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    });

    test('renders icon', () => {
        renderWithRouter(<EmptyState icon="🔍" title="Not found" />);
        expect(screen.getByText('🔍')).toBeInTheDocument();
    });

    test('renders description when provided', () => {
        renderWithRouter(
            <EmptyState title="Empty" description="Try adding something" />,
        );
        expect(screen.getByText('Try adding something')).toBeInTheDocument();
    });

    test('does not render description when not provided', () => {
        const { container } = renderWithRouter(<EmptyState title="Empty" />);
        expect(container.querySelector('.empty-state__desc')).toBeNull();
    });

    test('renders action link when actionLabel and actionTo are provided', () => {
        renderWithRouter(
            <EmptyState title="Empty" actionLabel="Go home" actionTo="/" />,
        );
        const link = screen.getByRole('link', { name: 'Go home' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
    });

    test('does not render action link when props missing', () => {
        renderWithRouter(<EmptyState title="Empty" />);
        expect(screen.queryByRole('link')).toBeNull();
    });

    test('uses default icon when not provided', () => {
        renderWithRouter(<EmptyState title="Empty" />);
        expect(screen.getByText('📋')).toBeInTheDocument();
    });
});
