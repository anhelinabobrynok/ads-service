import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/format';

const CATEGORY_EMOJI = {
    housing: '🏠',
    electronics: '💻',
    jobs: '💼',
    events: '🎉',
    pets: '🐾',
    other: '📦',
};

function AnnouncementCard({ announcement, onDelete }) {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    const isOwner = user && user.id === announcement.authorId;
    const canEdit = isOwner || isAdmin;
    const isPublic = announcement.visibility === 'public';
    const cardClass = isPublic ? 'announcement-card--public' : 'announcement-card--local';
    const emoji = CATEGORY_EMOJI[announcement.category] || '📦';

    return (
        <article className={cardClass}>
            <header className="announcement-card__header">
                <div className="announcement-card__badges">
                    {isPublic
                        ? <span className="badge-public">Public</span>
                        : <span className="badge-local">{`Local · ${announcement.location}`}</span>}
                    <span className="badge-user">
                        {`${emoji} ${announcement.category}`}
                    </span>
                </div>
                {canEdit && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                            type="button"
                            className="btn--icon"
                            title="Edit"
                            onClick={() => navigate(`/edit/${announcement.id}`)}
                        >
                            ✏️
                        </button>
                        <button
                            type="button"
                            className="btn--icon"
                            title="Delete"
                            onClick={() => onDelete(announcement)}
                        >
                            🗑
                        </button>
                    </div>
                )}
            </header>

            <Link
                to={`/announcements/${announcement.id}`}
                className="announcement-card__title-link"
            >
                <h2 className="announcement-card__title">{announcement.title}</h2>
            </Link>

            <p className="announcement-card__body">{announcement.body}</p>

            <footer className="announcement-card__footer">
                <div className="announcement-card__author">
                    <div className="announcement-card__author-avatar" aria-hidden="true">
                        {announcement.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{announcement.authorName}</span>
                </div>
                <time className="announcement-card__meta" dateTime={announcement.createdAt}>
                    {formatDate(announcement.createdAt)}
                </time>
            </footer>
        </article>
    );
}

export default AnnouncementCard;
