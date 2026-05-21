import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import usersApi from '../api/usersApi';
import { useNotifyContext } from '../hooks/useNotifyContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import UserAvatar from '../components/users/UserAvatar';
import UserRoleBadge from '../components/users/UserRoleBadge';
import { formatDate } from '../utils/format';

function UserDetailPage() {
    const { id } = useParams();
    const notify = useNotifyContext();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setLoading(true);
        usersApi.getById(id)
            .then(setUser)
            .catch(() => notify.error('Failed to load user.'))
            .finally(() => setLoading(false));
    }, [id, notify]);

    const handleDelete = () => {
        usersApi.remove(id)
            .then(() => {
                notify.success(`User "${user.username}" deleted.`);
                navigate('/users');
            })
            .catch(() => notify.error('Failed to delete user.'));
    };

    if (loading) return <Loader />;
    if (!user) {
        return (
            <EmptyState
                icon="🔍"
                title="User not found"
                actionLabel="Back to Users"
                actionTo="/users"
            />
        );
    }

    return (
        <>
            <Link to="/users" className="announcement-detail__back">← Back to Users</Link>

            <div className="announcement-detail">
                <div className="announcement-detail__badges">
                    <UserRoleBadge role={user.role} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <UserAvatar username={user.username} size={56} />
                    <h1 className="announcement-detail__title" style={{ marginBottom: 0 }}>
                        {user.username}
                    </h1>
                </div>

                <div className="announcement-detail__meta-row">
                    <div className="announcement-detail__meta-item">
                        <span className="announcement-detail__meta-label">Email</span>
                        <span className="announcement-detail__meta-value">{user.email || '—'}</span>
                    </div>
                    <div className="announcement-detail__meta-item">
                        <span className="announcement-detail__meta-label">Location</span>
                        <span className="announcement-detail__meta-value">{user.location || '—'}</span>
                    </div>
                    <div className="announcement-detail__meta-item">
                        <span className="announcement-detail__meta-label">Role</span>
                        <span className="announcement-detail__meta-value">{user.role}</span>
                    </div>
                    <div className="announcement-detail__meta-item">
                        <span className="announcement-detail__meta-label">Joined</span>
                        <span className="announcement-detail__meta-value">
                            <time dateTime={user.createdAt}>{formatDate(user.createdAt)}</time>
                        </span>
                    </div>
                </div>

                <div className="announcement-detail__actions">
                    <button
                        type="button"
                        className="btn--primary"
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                    >
                        ✏️ Edit User
                    </button>
                    <button
                        type="button"
                        className="btn--danger"
                        onClick={() => setShowConfirm(true)}
                    >
                        🗑 Delete User
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete User?"
                message={`Delete user "${user.username}"? This cannot be undone.`}
                confirmLabel="Yes, Delete"
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
                danger
            />
        </>
    );
}

export default UserDetailPage;
