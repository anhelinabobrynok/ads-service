import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { useNotifyContext } from '../../hooks/useNotifyContext';

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useNotifyContext');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ state: null }),
}));

describe('LoginForm component', () => {
    const mockLogin = jest.fn();
    const mockError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({ login: mockLogin });
        useNotifyContext.mockReturnValue({ error: mockError, success: jest.fn() });
    });

    const renderForm = () => render(
        <MemoryRouter>
            <LoginForm />
        </MemoryRouter>,
    );

    test('renders username input', () => {
        renderForm();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    test('renders password input', () => {
        renderForm();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('renders sign in button', () => {
        renderForm();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('renders AdBoard branding', () => {
        renderForm();
        expect(screen.getByText(/adboard/i)).toBeInTheDocument();
    });

    test('shows validation error when username is empty', async () => {
        renderForm();
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        await waitFor(() => {
            const errorMessages = screen.getAllByText('This field is required');
            expect(errorMessages[0]).toBeInTheDocument();
        });
    });

    test('shows validation error when password is empty', async () => {
        renderForm();
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'admin' },
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        await waitFor(() => {
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });
    });

    test('calls login with username and password on submit', async () => {
        mockLogin.mockResolvedValue({ id: 1, username: 'admin' });
        renderForm();

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'admin' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'admin123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('admin', 'admin123');
        });
    });

    test('shows error notification when login fails', async () => {
        mockLogin.mockRejectedValue(new Error('Invalid password'));
        renderForm();

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'admin' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrong' },
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockError).toHaveBeenCalledWith('Invalid password');
        });
    });

    test('disables button while loading', async () => {
        mockLogin.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 1000)),
        );
        renderForm();

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'admin' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'admin123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
        });
    });

    test('does not call login when validation fails', () => {
        renderForm();
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        expect(mockLogin).not.toHaveBeenCalled();
    });
});
