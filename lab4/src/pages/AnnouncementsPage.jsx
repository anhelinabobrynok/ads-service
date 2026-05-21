import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import announcementsApi from '../api/announcementsApi';
import { useAuth } from '../hooks/useAuth';
import { useNotifyContext } from '../hooks/useNotifyContext';
import useDebounce from '../hooks/useDebounce';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';

const FILTER_LABELS = {
    all: 'All Announcements',
    public: '🌐 Public Announcements',
    local: '📍 Local Announcements',
    my: 'My Announcements',
};

const CATEGORIES = [
    { value: '', label: 'All categories' },
    { value: 'housing', label: '🏠 Housing' },
    { value: 'electronics', label: '💻 Electronics' },
    { value: 'jobs', label: '💼 Jobs' },
    { value: 'events', label: '🎉 Events' },
    { value: 'pets', label: '🐾 Pets' },
    { value: 'other', label: '📦 Other' },
];

const applyLocalFilters = (announcements, search, category) => {
    const q = search.toLowerCase();
    return announcements.filter((a) => {
        const matchesSearch = !q
            || a.title.toLowerCase().includes(q)
            || a.body.toLowerCase().includes(q)
            || a.authorName.toLowerCase().includes(q);
        const matchesCategory = !category || a.category === category;
        return matchesSearch && matchesCategory;
    });
};

function AnnouncementsPage({ filter = 'all' }) {
    const { user } = useAuth();
    const notify = useNotifyContext();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [toDelete, setToDelete] = useState(null);
    const debouncedSearch = useDebounce(search, 350);

    const fetchAnnouncements = useCallback(() => {
        setLoading(true);
        const params = { _sort: 'createdAt', _order: 'desc' };
        if (filter === 'public') params.visibility = 'public';
        if (filter === 'local') {
            params.visibility = 'local';
            if (user) params.location = user.location;
        }
        if (filter === 'my' && user) params.authorId = user.id;

        announcementsApi.getAll(params)
            .then(setAnnouncements)
            .catch(() => notify.error('Failed to load announcements.'))
            .finally(() => setLoading(false));
    }, [filter, user, notify]);

    useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

    const handleDeleteConfirm = () => {
        announcementsApi.remove(toDelete.id)
            .then(() => {
                setAnnouncements((prev) => prev.filter((a) => a.id !== toDelete.id));
                notify.success('Announcement deleted.');
                setToDelete(null);
            })
            .catch(() => { notify.error('Failed to delete.'); setToDelete(null); });
    };

    const filtered = applyLocalFilters(announcements, debouncedSearch, category);

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-header__title">{FILTER_LABELS[filter]}</h1>
                    <p className="page-header__subtitle">
                        {`${filtered.length} of ${announcements.length} announcement${announcements.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <div className="page-header__actions">
                    <Link to="/create" className="btn--primary">+ New Announcement</Link>
                </div>
            </header>

            <div className="filter-bar" role="search">
                <input
                    className="filter-bar__search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search announcements..."
                    aria-label="Search announcements"
                />
                <select
                    className="filter-bar__select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Filter by category"
                >
                    {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>

            {filter !== 'my' && (
                <nav className="tabs" aria-label="Announcement filters">
                    <Link to="/" className={filter === 'all' ? 'tab--active' : 'tab'}>All</Link>
                    <Link to="/public" className={filter === 'public' ? 'tab--active' : 'tab'}>
                        🌐 Public
                    </Link>
                    <Link to="/local" className={filter === 'local' ? 'tab--active' : 'tab'}>
                        📍 Local
                    </Link>
                </nav>
            )}

            {loading && <Loader />}

            {!loading && filtered.length === 0 && (
                <EmptyState
                    icon="📋"
                    title={debouncedSearch ? 'No results found' : 'No announcements yet'}
                    description={debouncedSearch ? `Nothing matches "${debouncedSearch}"` : 'Be the first!'}
                    actionLabel="+ New Announcement"
                    actionTo="/create"
                />
            )}

            {!loading && filtered.length > 0 && (
                <section aria-label="Announcements list">
                    <div className="announcement-grid">
                        {filtered.map((ann) => (
                            <AnnouncementCard key={ann.id} announcement={ann} onDelete={setToDelete} />
                        ))}
                    </div>
                </section>
            )}

            <ConfirmDialog
                isOpen={toDelete !== null}
                title="Delete Announcement?"
                message={`Delete "${toDelete?.title}"? This cannot be undone.`}
                confirmLabel="Yes, Delete"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setToDelete(null)}
                danger
            />
        </>
    );
}

export default AnnouncementsPage;
