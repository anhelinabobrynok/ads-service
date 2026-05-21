import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserForm from '../../components/users/UserForm';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

const renderForm = (props = {}) => render(
    <MemoryRouter>
        <UserForm onSubmit={jest.fn()} loading={false} {...props} />
    </MemoryRouter>,
);

describe('UserForm component', () => {
    test('renders all required fields', () => {
        renderForm();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    });

    test('renders Create User button in create mode', () => {
        renderForm();
        expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
    });

    test('renders Save Changes button in edit mode', () => {
        const existing = {
            id: 1,
            username: 'john',
            password: 'pass1234',
            role: 'regular',
            location: 'Lviv',
            email: 'john@example.com',
        };
        renderForm({ existing });
        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    test('pre-fills fields with existing user data', () => {
        const existing = {
            id: 1,
            username: 'john_doe',
            password: 'pass1234',
            role: 'admin',
            location: 'Kyiv',
            email: 'john@example.com',
        };
        renderForm({ existing });
        expect(screen.getByLabelText(/username/i)).toHaveValue('john_doe');
        expect(screen.getByLabelText(/location/i)).toHaveValue('Kyiv');
    });

    test('shows error when username is empty on submit', async () => {
        const onSubmit = jest.fn();
        renderForm({ onSubmit });
        fireEvent.click(screen.getByRole('button', { name: /create user/i }));
        await waitFor(() => {
            const errorMessages = screen.getAllByText('This field is required');
            expect(errorMessages[0]).toBeInTheDocument();
        });
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('shows error when passwords do not match', async () => {
        renderForm();
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'newuser' },
        });
        fireEvent.change(screen.getByLabelText(/^password/i), {
            target: { value: 'password1' },
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'password2' },
        });
        fireEvent.change(screen.getByLabelText(/role/i), {
            target: { value: 'regular' },
        });
        fireEvent.click(screen.getByRole('button', { name: /create user/i }));
        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });

    test('calls onSubmit with correct data when form is valid', async () => {
        const onSubmit = jest.fn();
        renderForm({ onSubmit });

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'newuser' },
        });
        fireEvent.change(screen.getByLabelText(/^password/i), {
            target: { value: 'password1' },
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'password1' },
        });
        fireEvent.change(screen.getByLabelText(/role/i), {
            target: { value: 'regular' },
        });

        fireEvent.click(screen.getByRole('button', { name: /create user/i }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: 'newuser',
                    role: 'regular',
                    password: 'password1',
                }),
            );
        });
    });

    test('disables submit button when loading', () => {
        renderForm({ loading: true });
        expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    });

    test('shows error when password is too short', async () => {
        renderForm();
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'user' },
        });
        fireEvent.change(screen.getByLabelText(/^password/i), {
            target: { value: 'short' },
        });
        fireEvent.change(screen.getByLabelText(/role/i), {
            target: { value: 'regular' },
        });
        fireEvent.click(screen.getByRole('button', { name: /create user/i }));
        await waitFor(() => {
            expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
        });
    });
});
