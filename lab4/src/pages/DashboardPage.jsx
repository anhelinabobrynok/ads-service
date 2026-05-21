import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import announcementsApi from '../api/announcementsApi';
import { useAuth } from '../hooks/useAuth';
import { useNotifyContext } from '../hooks/useNotifyContext';
import Loader from '../components/common/Loader';

const CATEGORY_EMOJI = {
    housing: '🏠',
    electronics: '💻',
    jobs: '💼',
    events: '🎉',
    pets: '🐾',
    other: '📦',
};

const buildStats = (announcements, user) => {
    const total = announcements.length;
    const publicCount = announcements.filter((a) => a.visibility === 'public').length;
    const localCount = announcements.filter(
        (a) => a.visibility === 'local' && a.location === user?.location,
    ).length;
    const myCount = announcements.filter((a) => a.authorId === user?.id).length;

    const byCategory = announcements.reduce((acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + 1;
        return acc;
    }, {});

    const topCategory = Object.entries(byCategory)
        .sort((x, y) => y[1] - x[1])[0];

    return {
        total,
        publicCount,
        localCount,
        myCount,
        topCategory: topCategory ? topCategory[0] : null,
        topCategoryCount: topCategory ? topCategory[1] : 0,
        byCategory,
    };
};

function StatCard({ icon, label, value, to }) {
    const content = (
        <div className="stat-card">
            <p className="stat-card__icon" aria-hidden="true">{icon}</p>
            <p className="stat-card__label">{label}</p>
            <p className="stat-card__value">{value}</p>
        </div>
    );

    return to ? <Link to={to} style={{ textDecoration: 'none' }}>{content}</Link> : content;
}

function DashboardPage() {
    const { user } = useAuth();
    const notify = useNotifyContext();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        announcementsApi.getAll()
            .then(setAnnouncements)
            .catch(() => notify.error('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, [notify]);

    if (loading) return <Loader />;

    const stats = buildStats(announcements, user);
    const recent = [...announcements]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-header__title">
                        Welcome,
                        {' '}
                        <span>{user?.username}</span>
                    </h1>
                    <p className="page-header__subtitle">
                        {`📍 ${user?.location || 'Unknown location'}`}
                    </p>
                </div>
                <div className="page-header__actions">
                    <Link to="/create" className="btn--primary">+ New Announcement</Link>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard icon="📋" label="Total" value={stats.total} to="/" />
                <StatCard icon="🌐" label="Public" value={stats.publicCount} to="/public" />
                <StatCard
                    icon="📍"
                    label={`Local (${user?.location})`}
                    value={stats.localCount}
                    to="/local"
                />
                <StatCard icon="✏️" label="My Posts" value={stats.myCount} to="/my" />
            </div>

            {stats.topCategory && (
                <div className="location-picker" style={{ marginBottom: '32px' }}>
                    <p className="location-picker__title">Top category</p>
                    <div className="location-picker__row">
                        <span style={{ fontSize: '1.4rem' }}>
                            {CATEGORY_EMOJI[stats.topCategory]}
                        </span>
                        <span style={{ color: '#eef0f8', fontWeight: 600 }}>
                            {stats.topCategory}
                        </span>
                        <span style={{ color: '#565e80', fontSize: '0.85rem' }}>
                            {`${stats.topCategoryCount} announcement${stats.topCategoryCount !== 1 ? 's' : ''}`}
                        </span>
                    </div>
                </div>
            )}

            <section aria-labelledby="recent-heading">
                <h2
                    id="recent-heading"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.2rem',
                        marginBottom: '16px',
                        color: '#eef0f8',
                    }}
                >
                    Recent Announcements
                </h2>
                <div className="my-list">
                    {recent.map((ann) => (
                        <div key={ann.id} className="my-list__item">
                            <div className="my-list__info">
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                    {ann.visibility === 'public'
                                        ? <span className="badge-public">Public</span>
                                        : <span className="badge-local">{`Local · ${ann.location}`}</span>}
                                </div>
                                <p className="my-list__title">{ann.title}</p>
                                <p className="my-list__meta">{ann.authorName}</p>
                            </div>
                            <Link
                                to={`/announcements/${ann.id}`}
                                className="btn--secondary"
                                style={{ flexShrink: 0 }}
                            >
                                View
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default DashboardPage;
