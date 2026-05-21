import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('Header component', () => {
    const mockLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderHeader = (user = null) => {
        useAuth.mockReturnValue({ user, logout: mockLogout });
        return render(<MemoryRouter><Header /></MemoryRouter>);
    };

    test('renders AdBoard logo', () => {
        renderHeader();
        expect(screen.getByLabelText(/adboard home/i)).toBeInTheDocument();
    });

    test('shows Login link when user is not logged in', () => {
        renderHeader(null);
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    test('does not show Logout button when not logged in', () => {
        renderHeader(null);
        expect(screen.queryByRole('button', { name: /logout/i })).toBeNull();
    });

    test('shows username when user is logged in', () => {
        renderHeader({ id: 1, username: 'john_doe', role: 'regular', location: 'Lviv' });
        expect(screen.getByText('john_doe')).toBeInTheDocument();
    });

    test('shows Logout button when user is logged in', () => {
        renderHeader({ id: 1, username: 'john_doe', role: 'regular', location: 'Lviv' });
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('shows Admin badge for admin user', () => {
        renderHeader({ id: 1, username: 'admin', role: 'admin', location: 'Lviv' });
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    test('does not show Admin badge for regular user', () => {
        renderHeader({ id: 2, username: 'john_doe', role: 'regular', location: 'Lviv' });
        expect(screen.queryByText('Admin')).toBeNull();
    });

    test('calls logout when Logout button clicked', () => {
        renderHeader({ id: 1, username: 'john_doe', role: 'regular', location: 'Lviv' });
        fireEvent.click(screen.getByRole('button', { name: /logout/i }));
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    test('shows user location', () => {
        renderHeader({ id: 1, username: 'john_doe', role: 'regular', location: 'Lviv' });
        expect(screen.getByText(/Lviv/)).toBeInTheDocument();
    });

    test('shows user initials in avatar', () => {
        renderHeader({ id: 1, username: 'john_doe', role: 'regular', location: 'Lviv' });
        expect(screen.getByText('JO')).toBeInTheDocument();
    });
});
