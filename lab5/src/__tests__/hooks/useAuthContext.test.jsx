import { render, screen, act } from '@testing-library/react';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../hooks/useAuth';
import { NotifyProvider, useNotifyContext } from '../../hooks/useNotifyContext';
import usersApi from '../../api/usersApi';

jest.mock('../../api/usersApi');

// ── useAuth / AuthProvider ─────────────────────────────────────────
describe('useAuth / AuthProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    const wrapper = ({ children }) => (
        <AuthProvider>{children}</AuthProvider>
    );

    test('starts with null user when sessionStorage is empty', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.user).toBeNull();
    });

    test('isAdmin is false when no user', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.isAdmin).toBe(false);
    });

    test('login sets user in state and sessionStorage', async () => {
        const mockUser = { id: 1, username: 'admin', role: 'admin', password: 'admin123' };
        usersApi.authenticate.mockResolvedValue(mockUser);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.login('admin', 'admin123');
        });

        expect(result.current.user).toEqual(mockUser);
        expect(sessionStorage.getItem('adboard_user')).toBeTruthy();
    });

    test('isAdmin is true for admin user', async () => {
        const mockUser = { id: 1, username: 'admin', role: 'admin' };
        usersApi.authenticate.mockResolvedValue(mockUser);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.login('admin', 'admin123');
        });

        expect(result.current.isAdmin).toBe(true);
    });

    test('logout clears user from state and sessionStorage', async () => {
        const mockUser = { id: 1, username: 'admin', role: 'admin' };
        usersApi.authenticate.mockResolvedValue(mockUser);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.login('admin', 'admin123');
        });

        act(() => {
            result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(sessionStorage.getItem('adboard_user')).toBeNull();
    });

    test('login rejects when credentials are wrong', async () => {
        usersApi.authenticate.mockRejectedValue(new Error('Invalid password'));

        const { result } = renderHook(() => useAuth(), { wrapper });

        await expect(
            act(async () => {
                await result.current.login('admin', 'wrongpass');
            }),
        ).rejects.toThrow('Invalid password');

        expect(result.current.user).toBeNull();
    });

    test('loads user from sessionStorage on init', () => {
        const stored = { id: 2, username: 'john', role: 'regular' };
        sessionStorage.setItem('adboard_user', JSON.stringify(stored));

        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.user).toEqual(stored);
    });

    test('handles invalid sessionStorage data gracefully', () => {
        sessionStorage.setItem('adboard_user', 'not-valid-json{{');
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.user).toBeNull();
    });
});

// ── useNotifyContext / NotifyProvider ─────────────────────────────
describe('useNotifyContext / NotifyProvider', () => {
    const wrapper = ({ children }) => (
        <NotifyProvider>{children}</NotifyProvider>
    );

    test('provides notifications array', () => {
        const { result } = renderHook(() => useNotifyContext(), { wrapper });
        expect(Array.isArray(result.current.notifications)).toBe(true);
    });

    test('provides success, error, warning functions', () => {
        const { result } = renderHook(() => useNotifyContext(), { wrapper });
        expect(typeof result.current.success).toBe('function');
        expect(typeof result.current.error).toBe('function');
        expect(typeof result.current.warning).toBe('function');
    });

    test('provides dismiss function', () => {
        const { result } = renderHook(() => useNotifyContext(), { wrapper });
        expect(typeof result.current.dismiss).toBe('function');
    });

    test('adds notification when success called', async () => {
        const { result } = renderHook(() => useNotifyContext(), { wrapper });

        act(() => {
            result.current.success('Test message');
        });

        expect(result.current.notifications.length).toBe(1);
        expect(result.current.notifications[0].message).toBe('Test message');
        expect(result.current.notifications[0].type).toBe('success');
    });

    test('renders children correctly', () => {
        render(
            <NotifyProvider>
                <div>Child content</div>
            </NotifyProvider>,
        );
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });
});
