import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import announcementsApi from '../api/announcementsApi';
import { useAuth } from '../hooks/useAuth';
import { useNotifyContext } from '../hooks/useNotifyContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatDatetime } from '../utils/format';

const CATEGORY_EMOJI = {
    housing: '🏠',
    electronics: '💻',
    jobs: '💼',
    events: '🎉',
    pets: '🐾',
    other: '📦',
};

function AnnouncementDetailPage() {
    const { id } = useParams();
    const { user, isAdmin } = useAuth();
    const notify = useNotifyContext();
    const navigate = useNavigate();

    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setLoading(true);
        announcementsApi.getById(id)
            .then(setAnnouncement)
            .catch(() => notify.error('Failed to load announcement.'))
            .finally(() => setLoading(false));
    }, [id, notify]);

    const handleDelete = () => {
        announcementsApi.remove(id)
            .then(() => {
                notify.success('Announcement deleted.');
                navigate('/my');
            })
            .catch(() => notify.error('Failed to delete.'));
    };

    if (loading) return <Loader />;
    if (!announcement) {
        return (
            <EmptyState
                icon="🔍"
                title="Announcement not found"
                description="It may have been deleted."
                actionLabel="Go to Home"
                actionTo="/"
            />
        );
    }

    const isOwner = user && user.id === announcement.authorId;
    const canEdit = isOwner || isAdmin;
    const isPublic = announcement.visibility === 'public';
    const emoji = CATEGORY_EMOJI[announcement.category] || '📦';

    return (
        <>
            <Link to="/" className="announcement-detail__back">← Back to Announcements</Link>

            <article className="announcement-detail">
                <div className="announcement-detail__badges">
                    {isPublic
                        ? <span className="badge-public">Public</span>
                        : <span className="badge-local">{`Local · ${announcement.location}`}</span>}
                    <span className="badge-user">{`${emoji} ${announcement.category}`}</span>
                </div>

                <h1 className="announcement-detail__title">{announcement.title}</h1>

                <div className="announcement-detail__meta-row">
                    <div className="announcement-detail__meta-item">
                        <span className="announcement-detail__meta-label">Author</span>
                        <span className="announcement-detail__meta-value">{announcement.authorName}</span>
                    </div>
                    <div className="announcement-detail__meta-item">
                        <span className="announcement-detail__meta-label">Published</span>
                        <span className="announcement-detail__meta-value">
                            <time dateTime={announcement.createdAt}>
                                {formatDatetime(announcement.createdAt)}
                            </time>
                        </span>
                    </div>
                    <div className="announcement-detail__meta-item">
                        <span className="announcement-detail__meta-label">Location</span>
                        <span className="announcement-detail__meta-value">{announcement.location}</span>
                    </div>
                    {announcement.contact && (
                        <div className="announcement-detail__meta-item">
                            <span className="announcement-detail__meta-label">Contact</span>
                            <span className="announcement-detail__meta-value">{announcement.contact}</span>
                        </div>
                    )}
                </div>

                <div className="announcement-detail__level-section">
                    <span className="announcement-detail__level-icon" aria-hidden="true">
                        {isPublic ? '🌐' : '📍'}
                    </span>
                    <div className="announcement-detail__level-text">
                        <strong>{isPublic ? 'Public announcement' : 'Local announcement'}</strong>
                        {isPublic
                            ? 'Visible to everyone — including unregistered visitors.'
                            : `Visible only to registered users in ${announcement.location}.`}
                    </div>
                </div>

                <div className="announcement-detail__body">
                    <p>{announcement.body}</p>
                </div>

                {canEdit && (
                    <div className="announcement-detail__actions">
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={() => navigate(`/edit/${announcement.id}`)}
                        >
                            ✏️ Edit
                        </button>
                        <button
                            type="button"
                            className="btn--danger"
                            onClick={() => setShowConfirm(true)}
                        >
                            🗑 Delete
                        </button>
                    </div>
                )}
            </article>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Announcement?"
                message={`Delete "${announcement.title}"? This cannot be undone.`}
                confirmLabel="Yes, Delete"
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
                danger
            />
        </>
    );
}

export default AnnouncementDetailPage;
