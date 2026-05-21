import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import NotFoundPage from '../../pages/NotFoundPage';
import AnnouncementsPage from '../../pages/AnnouncementsPage';
import UsersListPage from '../../pages/UsersListPage';
import { useAuth } from '../../hooks/useAuth';
import { useNotifyContext } from '../../hooks/useNotifyContext';
import announcementsApi from '../../api/announcementsApi';
import usersApi from '../../api/usersApi';

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useNotifyContext');
jest.mock('../../api/announcementsApi');
jest.mock('../../api/usersApi');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ state: null }),
}));

const mockUser = { id: 1, username: 'john_doe', role: 'regular', location: 'Lviv' };
const mockNotify = { error: jest.fn(), success: jest.fn(), warning: jest.fn() };
const mockAnnouncements = [
    {
        id: 1,
        title: 'First Announcement',
        body: 'Body of first announcement here.',
        visibility: 'public',
        category: 'housing',
        authorId: 1,
        authorName: 'john_doe',
        location: 'Lviv',
        createdAt: '2024-05-10T10:00:00Z',
    },
];
const mockUsers = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@adboard.io',
        role: 'admin',
        location: 'Lviv',
        createdAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        username: 'john_doe',
        email: 'john@example.com',
        role: 'regular',
        location: 'Lviv',
        createdAt: '2024-02-14T10:00:00Z',
    },
];

beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser, isAdmin: false, login: jest.fn() });
    useNotifyContext.mockReturnValue(mockNotify);
    announcementsApi.getAll.mockResolvedValue(mockAnnouncements);
    announcementsApi.remove.mockResolvedValue(null);
    usersApi.getAll.mockResolvedValue(mockUsers);
    usersApi.remove.mockResolvedValue(null);
});

// ── LoginPage ──────────────────────────────────────────────────────
describe('LoginPage', () => {
    test('renders sign in button', () => {
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('renders username and password fields', () => {
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('renders AdBoard branding', () => {
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        expect(screen.getByRole('heading', { name: /adboard/i })).toBeInTheDocument();
    });
});

// ── NotFoundPage ───────────────────────────────────────────────────
describe('NotFoundPage', () => {
    test('renders 404 message', () => {
        render(<MemoryRouter><NotFoundPage /></MemoryRouter>);
        expect(screen.getByText('Page not found')).toBeInTheDocument();
    });

    test('renders Go to Home link', () => {
        render(<MemoryRouter><NotFoundPage /></MemoryRouter>);
        expect(screen.getByRole('link', { name: /go to home/i })).toBeInTheDocument();
    });

    test('renders search icon', () => {
        render(<MemoryRouter><NotFoundPage /></MemoryRouter>);
        expect(screen.getByText('🔍')).toBeInTheDocument();
    });
});

// ── AnnouncementsPage ──────────────────────────────────────────────
describe('AnnouncementsPage', () => {
    const renderPage = (filter = 'all') => render(
        <MemoryRouter><AnnouncementsPage filter={filter} /></MemoryRouter>,
    );

    test('shows loader initially', () => {
        announcementsApi.getAll.mockReturnValue(new Promise(() => {}));
        renderPage();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('renders announcements after loading', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('First Announcement')).toBeInTheDocument();
        });
    });

    test('renders All Announcements title for all filter', async () => {
        renderPage('all');
        await waitFor(() => {
            expect(screen.getByText('All Announcements')).toBeInTheDocument();
        });
    });

    test('renders Public Announcements title for public filter', async () => {
        renderPage('public');
        await waitFor(() => {
            expect(screen.getByText(/Public Announcements/)).toBeInTheDocument();
        });
    });

    test('renders My Announcements title for my filter', async () => {
        renderPage('my');
        await waitFor(() => {
            expect(screen.getByText('My Announcements')).toBeInTheDocument();
        });
    });

    test('renders search input', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/search announcements/i)).toBeInTheDocument();
        });
    });

    test('renders category filter select', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
        });
    });

    test('shows empty state when no announcements', async () => {
        announcementsApi.getAll.mockResolvedValue([]);
        renderPage();
        await waitFor(() => {
            expect(screen.getByText(/no announcements yet/i)).toBeInTheDocument();
        });
    });

    test('shows error notification on fetch failure', async () => {
        announcementsApi.getAll.mockRejectedValue(new Error('Network error'));
        renderPage();
        await waitFor(() => {
            expect(mockNotify.error).toHaveBeenCalledWith('Failed to load announcements.');
        });
    });

    test('renders New Announcement link', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByRole('link', { name: /new announcement/i })).toBeInTheDocument();
        });
    });

    test('does not render tabs for my filter', async () => {
        renderPage('my');
        await waitFor(() => {
            expect(screen.queryByRole('navigation', { name: /announcement filters/i })).toBeNull();
        });
    });

    test('calls getAll with public visibility for public filter', async () => {
        renderPage('public');
        await waitFor(() => {
            expect(announcementsApi.getAll).toHaveBeenCalledWith(
                expect.objectContaining({ visibility: 'public' }),
            );
        });
    });

    test('calls getAll with authorId for my filter', async () => {
        renderPage('my');
        await waitFor(() => {
            expect(announcementsApi.getAll).toHaveBeenCalledWith(
                expect.objectContaining({ authorId: mockUser.id }),
            );
        });
    });
});

// ── UsersListPage ──────────────────────────────────────────────────
describe('UsersListPage', () => {
    const renderPage = () => render(
        <MemoryRouter><UsersListPage /></MemoryRouter>,
    );

    test('shows loader initially', () => {
        usersApi.getAll.mockReturnValue(new Promise(() => {}));
        renderPage();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('renders users table after loading', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });
    });

    test('renders user rows', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('admin')).toBeInTheDocument();
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });
    });

    test('renders page title', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByText(/manage/i)).toBeInTheDocument();
        });
    });

    test('renders Create User link', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByRole('link', { name: /create user/i })).toBeInTheDocument();
        });
    });

    test('renders search input', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByLabelText(/search users/i)).toBeInTheDocument();
        });
    });

    test('renders role filter', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByLabelText(/filter by role/i)).toBeInTheDocument();
        });
    });

    test('shows empty state when no users match filter', async () => {
        usersApi.getAll.mockResolvedValue([]);
        renderPage();
        await waitFor(() => {
            expect(screen.getByText(/no users found/i)).toBeInTheDocument();
        });
    });

    test('shows error notification on fetch failure', async () => {
        usersApi.getAll.mockRejectedValue(new Error('Server error'));
        renderPage();
        await waitFor(() => {
            expect(mockNotify.error).toHaveBeenCalledWith('Failed to load users.');
        });
    });

    test('filters users by search query', async () => {
        renderPage();
        await waitFor(() => expect(screen.getByText('admin')).toBeInTheDocument());

        fireEvent.change(screen.getByLabelText(/search users/i), {
            target: { value: 'admin' },
        });

        await waitFor(() => {
            expect(screen.getByText('admin')).toBeInTheDocument();
        });
    });
});
