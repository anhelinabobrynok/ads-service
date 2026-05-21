import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import usersApi from '../api/usersApi';
import { useNotifyContext } from '../hooks/useNotifyContext';
import UserTableRow from '../components/users/UserTableRow';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';

function UsersListPage() {
    const notify = useNotifyContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [toDelete, setToDelete] = useState(null);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        usersApi.getAll()
            .then(setUsers)
            .catch(() => notify.error('Failed to load users.'))
            .finally(() => setLoading(false));
    }, [notify]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteConfirm = () => {
        usersApi.remove(toDelete.id)
            .then(() => {
                setUsers((prev) => prev.filter((u) => u.id !== toDelete.id));
                notify.success(`User "${toDelete.username}" deleted.`);
                setToDelete(null);
            })
            .catch(() => {
                notify.error('Failed to delete user.');
                setToDelete(null);
            });
    };

    const filtered = users.filter((u) => {
        const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase())
            || (u.email || '').toLowerCase().includes(search.toLowerCase());
        const matchesRole = !roleFilter || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-header__title">
                        Manage
                        {' '}
                        <span>Users</span>
                    </h1>
                    <p className="page-header__subtitle">
                        {`${users.length} registered user${users.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <div className="page-header__actions">
                    <Link to="/users/create" className="btn--primary">+ Create User</Link>
                </div>
            </header>

            <div className="filter-bar">
                <input
                    className="filter-bar__search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users…"
                    aria-label="Search users"
                />
                <select
                    className="filter-bar__select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    aria-label="Filter by role"
                >
                    <option value="">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="regular">Regular</option>
                </select>
            </div>

            {loading && <Loader />}

            {!loading && filtered.length === 0 && (
                <EmptyState
                    icon="👥"
                    title="No users found"
                    actionLabel="+ Create User"
                    actionTo="/users/create"
                />
            )}

            {!loading && filtered.length > 0 && (
                <div className="users-table-wrapper">
                    <table className="users-table" aria-label="User list">
                        <thead>
                            <tr>
                                <th scope="col">User</th>
                                <th scope="col">Role</th>
                                <th scope="col">Location</th>
                                <th scope="col">Joined</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <UserTableRow
                                    key={u.id}
                                    user={u}
                                    onDelete={setToDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                isOpen={toDelete !== null}
                title="Delete User?"
                message={`Delete user "${toDelete?.username}"? This cannot be undone.`}
                confirmLabel="Yes, Delete"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setToDelete(null)}
                danger
            />
        </>
    );
}

export default UsersListPage;
