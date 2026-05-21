import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotificationContainer from '../../components/common/NotificationContainer';
import AppLayout from '../../components/layout/AppLayout';
import Sidebar from '../../components/layout/Sidebar';
import UserTableRow from '../../components/users/UserTableRow';
import { useAuth } from '../../hooks/useAuth';
import { useNotifyContext } from '../../hooks/useNotifyContext';

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useNotifyContext');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Outlet: () => <div>Outlet content</div>,
    useNavigate: () => jest.fn(),
}));

// ── NotificationContainer ──────────────────────────────────────────
describe('NotificationContainer', () => {
    test('renders container div', () => {
        useNotifyContext.mockReturnValue({ notifications: [], dismiss: jest.fn() });
        const { container } = render(<NotificationContainer />);
        expect(container.querySelector('#notifications')).toBeInTheDocument();
    });

    test('renders notifications from context', () => {
        const notifications = [
            { id: 1, message: 'Hello notification', type: 'success' },
        ];
        useNotifyContext.mockReturnValue({ notifications, dismiss: jest.fn() });
        render(<NotificationContainer />);
        expect(screen.getByText('Hello notification')).toBeInTheDocument();
    });

    test('renders multiple notifications', () => {
        const notifications = [
            { id: 1, message: 'First', type: 'success' },
            { id: 2, message: 'Second', type: 'error' },
        ];
        useNotifyContext.mockReturnValue({ notifications, dismiss: jest.fn() });
        render(<NotificationContainer />);
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
    });

    test('passes dismiss to Alert', () => {
        const dismiss = jest.fn();
        const notifications = [{ id: 1, message: 'Test', type: 'success' }];
        useNotifyContext.mockReturnValue({ notifications, dismiss });
        render(<NotificationContainer />);
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(dismiss).toHaveBeenCalledWith(1);
    });

    test('has aria-live attribute', () => {
        useNotifyContext.mockReturnValue({ notifications: [], dismiss: jest.fn() });
        const { container } = render(<NotificationContainer />);
        expect(container.querySelector('#notifications')).toHaveAttribute('aria-live', 'polite');
    });
});

// ── AppLayout ──────────────────────────────────────────────────────
describe('AppLayout', () => {
    test('renders header', () => {
        useAuth.mockReturnValue({ user: null, logout: jest.fn() });
        useNotifyContext.mockReturnValue({ notifications: [], dismiss: jest.fn() });
        render(<MemoryRouter><AppLayout /></MemoryRouter>);
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    test('renders main content area', () => {
        useAuth.mockReturnValue({ user: null, logout: jest.fn() });
        useNotifyContext.mockReturnValue({ notifications: [], dismiss: jest.fn() });
        render(<MemoryRouter><AppLayout /></MemoryRouter>);
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('applies no-sidebar class when no user', () => {
        useAuth.mockReturnValue({ user: null, logout: jest.fn() });
        useNotifyContext.mockReturnValue({ notifications: [], dismiss: jest.fn() });
        const { container } = render(<MemoryRouter><AppLayout /></MemoryRouter>);
        expect(container.firstChild).toHaveClass('app-shell--no-sidebar');
    });

    test('renders sidebar when user is logged in', () => {
        useAuth.mockReturnValue({
            user: { id: 1, username: 'admin', role: 'admin', location: 'Lviv' },
            isAdmin: true,
            logout: jest.fn(),
        });
        useNotifyContext.mockReturnValue({ notifications: [], dismiss: jest.fn() });
        render(<MemoryRouter><AppLayout /></MemoryRouter>);
        expect(screen.getByRole('complementary')).toBeInTheDocument();
    });

    test('does not render sidebar when user is null', () => {
        useAuth.mockReturnValue({ user: null, logout: jest.fn() });
        useNotifyContext.mockReturnValue({ notifications: [], dismiss: jest.fn() });
        render(<MemoryRouter><AppLayout /></MemoryRouter>);
        expect(screen.queryByRole('complementary')).toBeNull();
    });
});

// ── Sidebar ────────────────────────────────────────────────────────
describe('Sidebar', () => {
    test('returns null when no user', () => {
        useAuth.mockReturnValue({ user: null, isAdmin: false });
        const { container } = render(<MemoryRouter><Sidebar /></MemoryRouter>);
        expect(container.firstChild).toBeNull();
    });

    test('renders nav links for regular user', () => {
        useAuth.mockReturnValue({
            user: { id: 1, username: 'john', role: 'regular', location: 'Lviv' },
            isAdmin: false,
        });
        render(<MemoryRouter><Sidebar /></MemoryRouter>);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('All Announcements')).toBeInTheDocument();
    });

    test('renders admin section for admin user', () => {
        useAuth.mockReturnValue({
            user: { id: 1, username: 'admin', role: 'admin', location: 'Lviv' },
            isAdmin: true,
        });
        render(<MemoryRouter><Sidebar /></MemoryRouter>);
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    test('does not render admin section for regular user', () => {
        useAuth.mockReturnValue({
            user: { id: 2, username: 'john', role: 'regular', location: 'Kyiv' },
            isAdmin: false,
        });
        render(<MemoryRouter><Sidebar /></MemoryRouter>);
        expect(screen.queryByText('Manage Users')).toBeNull();
    });

    test('renders user location in local link', () => {
        useAuth.mockReturnValue({
            user: { id: 2, username: 'john', role: 'regular', location: 'Odesa' },
            isAdmin: false,
        });
        render(<MemoryRouter><Sidebar /></MemoryRouter>);
        expect(screen.getByText(/Odesa/)).toBeInTheDocument();
    });
});

// ── UserTableRow ───────────────────────────────────────────────────
describe('UserTableRow', () => {
    const mockUser = {
        id: 2,
        username: 'john_doe',
        email: 'john@example.com',
        role: 'regular',
        location: 'Lviv',
        createdAt: '2024-02-14T10:00:00Z',
    };

    const renderRow = (onDelete = jest.fn()) => render(
        <MemoryRouter>
            <table>
                <tbody>
                    <UserTableRow user={mockUser} onDelete={onDelete} />
                </tbody>
            </table>
        </MemoryRouter>,
    );

    test('renders username', () => {
        renderRow();
        expect(screen.getByText('john_doe')).toBeInTheDocument();
    });

    test('renders email', () => {
        renderRow();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    test('renders role badge', () => {
        renderRow();
        expect(screen.getByText('Regular')).toBeInTheDocument();
    });

    test('renders location', () => {
        renderRow();
        expect(screen.getByText('Lviv')).toBeInTheDocument();
    });

    test('calls onDelete with user when delete clicked', () => {
        const onDelete = jest.fn();
        renderRow(onDelete);
        fireEvent.click(screen.getByTitle('Delete user'));
        expect(onDelete).toHaveBeenCalledWith(mockUser);
    });

    test('renders view, edit, delete buttons', () => {
        renderRow();
        expect(screen.getByTitle('View user')).toBeInTheDocument();
        expect(screen.getByTitle('Edit user')).toBeInTheDocument();
        expect(screen.getByTitle('Delete user')).toBeInTheDocument();
    });
});
