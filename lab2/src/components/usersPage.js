import usersApi from '../api/users.js';
import auth from '../utils/auth.js';
import router from '../utils/router.js';
import { dom, notify } from '../utils/dom.js';
import { showLoader, showError } from '../components/loader.js';
import { renderSidebar } from '../components/shell.js';
import { formatDate } from '../utils/format.js';

const renderUsersPage = () => {
    if (!auth.isAdmin()) {
        showError('Access denied. Administrator account required.');
        return;
    }

    dom.show(dom.el('#sidebar'));
    renderSidebar();
    showLoader();

    usersApi.getAll()
        .then((users) => {
            const main = dom.el('#app-main');

            main.innerHTML = `
                <header class="page-header">
                    <div>
                        <h1 class="page-header__title">Manage <span>Users</span></h1>
                        <p class="page-header__subtitle">${users.length} registered users</p>
                    </div>
                    <div class="page-header__actions">
                        <a href="#/users/create" class="btn--primary">+ Create User</a>
                    </div>
                </header>

                <div class="filter-bar">
                    <input
                        class="filter-bar__search"
                        type="search"
                        id="user-search"
                        placeholder="Search users…"
                        aria-label="Search users"
                    >
                    <select class="filter-bar__select" id="role-filter" aria-label="Filter by role">
                        <option value="">All roles</option>
                        <option value="admin">Admin</option>
                        <option value="regular">Regular</option>
                    </select>
                </div>

                <div class="users-table-wrapper">
                    <table class="users-table" id="users-table" aria-label="User list">
                        <thead>
                            <tr>
                                <th scope="col">User</th>
                                <th scope="col">Role</th>
                                <th scope="col">Location</th>
                                <th scope="col">Joined</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-tbody">
                            ${renderUserRows(users)}
                        </tbody>
                    </table>
                </div>
            `;

            bindUserActions(users);
            bindUserFilters(users);
        })
        .catch((err) => showError(err.message));
};

const renderUserRows = (users) => users.map((u) => `
    <tr data-user-id="${u.id}">
        <td>
            <div class="user-cell">
                <div class="user-cell__avatar" aria-hidden="true">
                    ${u.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                    <p class="user-cell__name">${u.username}</p>
                    <p class="user-cell__email">${u.email || '—'}</p>
                </div>
            </div>
        </td>
        <td>
            ${u.role === 'admin'
                ? '<span class="badge-admin">Admin</span>'
                : '<span class="badge-user">Regular</span>'}
        </td>
        <td>${u.location || '—'}</td>
        <td><time datetime="${u.createdAt}">${formatDate(u.createdAt)}</time></td>
        <td>
            <div class="table-actions">
                <button class="btn--icon js-view-user" data-id="${u.id}" title="View user" type="button">👁</button>
                <button class="btn--icon js-edit-user" data-id="${u.id}" title="Edit user" type="button">✏️</button>
                <button class="btn--icon js-delete-user" data-id="${u.id}" title="Delete user" type="button">🗑</button>
            </div>
        </td>
    </tr>
`).join('');

const bindUserActions = (users) => {
    const tbody = dom.el('#users-tbody');
    if (!tbody) return;

    tbody.querySelectorAll('.js-view-user').forEach((btn) => {
        btn.addEventListener('click', () => router.navigate(`/users/${btn.dataset.id}`));
    });

    tbody.querySelectorAll('.js-edit-user').forEach((btn) => {
        btn.addEventListener('click', () => router.navigate(`/users/${btn.dataset.id}/edit`));
    });

    tbody.querySelectorAll('.js-delete-user').forEach((btn) => {
        btn.addEventListener('click', () => {
            const { id } = btn.dataset;
            const user = users.find((u) => String(u.id) === String(id));
            if (!user) return;
            if (!window.confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
            usersApi.remove(id)
                .then(() => {
                    notify.success(`User "${user.username}" deleted.`);
                    btn.closest('tr').remove();
                })
                .catch(() => notify.error('Failed to delete user.'));
        });
    });
};

const bindUserFilters = (users) => {
    const searchInput = dom.el('#user-search');
    const roleFilter = dom.el('#role-filter');

    const applyFilters = () => {
        const query = searchInput.value.toLowerCase();
        const role = roleFilter.value;
        const filtered = users.filter((u) => {
            const matchesSearch = u.username.toLowerCase().includes(query)
                || (u.email || '').toLowerCase().includes(query);
            const matchesRole = !role || u.role === role;
            return matchesSearch && matchesRole;
        });
        const tbody = dom.el('#users-tbody');
        tbody.innerHTML = renderUserRows(filtered);
        bindUserActions(filtered);
    };

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (roleFilter) roleFilter.addEventListener('change', applyFilters);
};

export default renderUsersPage;
