import { Link } from 'react-router-dom';

function EmptyState({
    icon = '📋',
    title = 'Nothing here yet',
    description = '',
    actionLabel = null,
    actionTo = null,
}) {
    return (
        <div className="empty-state">
            <p className="empty-state__icon" aria-hidden="true">{icon}</p>
            <h2 className="empty-state__title">{title}</h2>
            {description && (
                <p className="empty-state__desc">{description}</p>
            )}
            {actionLabel && actionTo && (
                <Link
                    to={actionTo}
                    className="btn--primary"
                    style={{ marginTop: '16px' }}
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}

export default EmptyState;
