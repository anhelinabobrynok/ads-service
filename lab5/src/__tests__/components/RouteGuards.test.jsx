import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from '../../components/layout/RequireAuth';
import RequireAdmin from '../../components/layout/RequireAdmin';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

const Protected = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;
const HomePage = () => <div>Home Page</div>;

describe('RequireAuth guard', () => {
    test('renders children when user is logged in', () => {
        useAuth.mockReturnValue({ user: { id: 1, username: 'admin' } });
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/protected"
                        element={<RequireAuth><Protected /></RequireAuth>}
                    />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    test('redirects to /login when user is not logged in', () => {
        useAuth.mockReturnValue({ user: null });
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/protected"
                        element={<RequireAuth><Protected /></RequireAuth>}
                    />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).toBeNull();
    });
});

describe('RequireAdmin guard', () => {
    test('renders children when user is admin', () => {
        useAuth.mockReturnValue({
            user: { id: 1, username: 'admin', role: 'admin' },
            isAdmin: true,
        });
        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/admin"
                        element={<RequireAdmin><Protected /></RequireAdmin>}
                    />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    test('redirects to / when user is not admin', () => {
        useAuth.mockReturnValue({
            user: { id: 2, username: 'john', role: 'regular' },
            isAdmin: false,
        });
        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/admin"
                        element={<RequireAdmin><Protected /></RequireAdmin>}
                    />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByText('Home Page')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).toBeNull();
    });

    test('redirects to /login when user is not logged in', () => {
        useAuth.mockReturnValue({ user: null, isAdmin: false });
        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/admin"
                        element={<RequireAdmin><Protected /></RequireAdmin>}
                    />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
});
