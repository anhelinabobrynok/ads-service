import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

const mockAnnouncement = {
    id: 1,
    title: 'Test Announcement',
    body: 'This is the body of the test announcement for display.',
    visibility: 'public',
    category: 'housing',
    authorId: 2,
    authorName: 'john_doe',
    location: 'Lviv',
    createdAt: '2024-05-10T10:00:00Z',
};

const renderCard = (props = {}, authValue = { user: null, isAdmin: false }) => {
    useAuth.mockReturnValue(authValue);
    return render(
        <MemoryRouter>
            <AnnouncementCard
                announcement={mockAnnouncement}
                onDelete={jest.fn()}
                {...props}
            />
        </MemoryRouter>,
    );
};

describe('AnnouncementCard component', () => {
    test('renders announcement title', () => {
        renderCard();
        expect(screen.getByText('Test Announcement')).toBeInTheDocument();
    });

    test('renders announcement body', () => {
        renderCard();
        expect(screen.getByText(/This is the body/)).toBeInTheDocument();
    });

    test('renders author name', () => {
        renderCard();
        expect(screen.getByText('john_doe')).toBeInTheDocument();
    });

    test('renders Public badge for public visibility', () => {
        renderCard();
        expect(screen.getByText('Public')).toBeInTheDocument();
    });

    test('renders Local badge for local visibility', () => {
        const localAnn = { ...mockAnnouncement, visibility: 'local' };
        renderCard({ announcement: localAnn });
        expect(screen.getByText(/Local/)).toBeInTheDocument();
    });

    test('does not show edit/delete buttons for non-owner', () => {
        renderCard({}, { user: { id: 99, role: 'regular' }, isAdmin: false });
        expect(screen.queryByTitle('Edit')).toBeNull();
        expect(screen.queryByTitle('Delete')).toBeNull();
    });

    test('shows edit/delete buttons for owner', () => {
        renderCard({}, { user: { id: 2, role: 'regular' }, isAdmin: false });
        expect(screen.getByTitle('Edit')).toBeInTheDocument();
        expect(screen.getByTitle('Delete')).toBeInTheDocument();
    });

    test('shows edit/delete buttons for admin', () => {
        renderCard({}, { user: { id: 99, role: 'admin' }, isAdmin: true });
        expect(screen.getByTitle('Edit')).toBeInTheDocument();
        expect(screen.getByTitle('Delete')).toBeInTheDocument();
    });

    test('calls onDelete when delete button clicked', () => {
        const onDelete = jest.fn();
        renderCard({ onDelete }, { user: { id: 2, role: 'regular' }, isAdmin: false });
        fireEvent.click(screen.getByTitle('Delete'));
        expect(onDelete).toHaveBeenCalledWith(mockAnnouncement);
    });

    test('title is a link to announcement detail', () => {
        renderCard();
        const link = screen.getByRole('link', { name: /Test Announcement/ });
        expect(link).toHaveAttribute('href', '/announcements/1');
    });

    test('applies public card CSS class', () => {
        const { container } = renderCard();
        expect(container.firstChild).toHaveClass('announcement-card--public');
    });

    test('applies local card CSS class for local announcement', () => {
        const localAnn = { ...mockAnnouncement, visibility: 'local' };
        const { container } = renderCard({ announcement: localAnn });
        expect(container.firstChild).toHaveClass('announcement-card--local');
    });
});
