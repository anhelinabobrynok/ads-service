import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

const renderForm = (props = {}) => render(
    <MemoryRouter>
        <AnnouncementForm onSubmit={jest.fn()} loading={false} {...props} />
    </MemoryRouter>,
);

describe('AnnouncementForm component', () => {
    test('renders all form fields', () => {
        renderForm();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/visibility/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    test('renders Publish button in create mode', () => {
        renderForm();
        expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument();
    });

    test('renders Save Changes button in edit mode', () => {
        const existing = {
            id: 1,
            title: 'Test',
            body: 'Body text here',
            visibility: 'public',
            category: 'housing',
            contact: '',
        };
        renderForm({ existing });
        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    test('pre-fills form with existing announcement data', () => {
        const existing = {
            id: 1,
            title: 'Existing Title',
            body: 'Existing body text',
            visibility: 'public',
            category: 'jobs',
            contact: '',
        };
        renderForm({ existing });
        expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Title');
        expect(screen.getByLabelText(/description/i)).toHaveValue('Existing body text');
    });

    test('shows validation error when title is empty', async () => {
        const onSubmit = jest.fn();
        renderForm({ onSubmit });
        fireEvent.click(screen.getByRole('button', { name: /publish/i }));
        await waitFor(() => {
            expect(screen.getAllByText('This field is required').length).toBeGreaterThan(0);
        });
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('shows error when title is too short', async () => {
        renderForm();
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Short' },
        });
        fireEvent.click(screen.getByRole('button', { name: /publish/i }));
        await waitFor(() => {
            expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
        });
    });

    test('calls onSubmit with correct data when form is valid', async () => {
        const onSubmit = jest.fn();
        renderForm({ onSubmit });

        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Valid announcement title here' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'This is a valid body text with enough characters.' },
        });
        fireEvent.change(screen.getByLabelText(/visibility/i), {
            target: { value: 'public' },
        });
        fireEvent.change(screen.getByLabelText(/category/i), {
            target: { value: 'housing' },
        });

        fireEvent.click(screen.getByRole('button', { name: /publish/i }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Valid announcement title here',
                    visibility: 'public',
                    category: 'housing',
                }),
            );
        });
    });

    test('disables submit button when loading', () => {
        renderForm({ loading: true });
        expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    });

    test('renders all category options', () => {
        renderForm();
        const select = screen.getByLabelText(/category/i);
        const options = select.querySelectorAll('option');
        expect(options.length).toBeGreaterThan(5);
    });

    test('renders visibility options', () => {
        renderForm();
        const select = screen.getByLabelText(/visibility/i);
        const options = select.querySelectorAll('option');
        expect(options.length).toBeGreaterThanOrEqual(3);
    });
});
