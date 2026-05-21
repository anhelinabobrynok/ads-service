import usersApi from '../api/users.js';
import auth from '../utils/auth.js';
import router from '../utils/router.js';
import { dom, notify } from '../utils/dom.js';
import { showLoader, showError } from '../components/loader.js';
import { renderSidebar } from '../components/shell.js';
import validate from '../utils/validate.js';
import { formatDate } from '../utils/format.js';

const renderUserInfo = (id) => {
    if (!auth.isAdmin()) {
        showError('Access denied.');
        return;
    }

    dom.show(dom.el('#sidebar'));
    renderSidebar();
    showLoader();

    usersApi.getById(id)
        .then((user) => {
            if (!user) {
                showError('User not found.');
                return;
            }

            const main = dom.el('#app-main');
            main.innerHTML = `
                <a href="#/users" class="announcement-detail__back">← Back to Users</a>

                <div class="announcement-detail">
                    <div class="announcement-detail__badges">
                        ${user.role === 'admin'
                            ? '<span class="badge-admin">Admin</span>'
                            : '<span class="badge-user">Regular User</span>'}
                    </div>

                    <h1 class="announcement-detail__title">${user.username}</h1>

                    <div class="announcement-detail__meta-row">
                        <div class="announcement-detail__meta-item">
                            <span class="announcement-detail__meta-label">Email</span>
                            <span class="announcement-detail__meta-value">${user.email || '—'}</span>
                        </div>
                        <div class="announcement-detail__meta-item">
                            <span class="announcement-detail__meta-label">Location</span>
                            <span class="announcement-detail__meta-value">${user.location || '—'}</span>
                        </div>
                        <div class="announcement-detail__meta-item">
                            <span class="announcement-detail__meta-label">Joined</span>
                            <span class="announcement-detail__meta-value">
                                <time datetime="${user.createdAt}">${formatDate(user.createdAt)}</time>
                            </span>
                        </div>
                        <div class="announcement-detail__meta-item">
                            <span class="announcement-detail__meta-label">Role</span>
                            <span class="announcement-detail__meta-value">${user.role}</span>
                        </div>
                    </div>

                    <div class="announcement-detail__actions">
                        <button class="btn--primary" id="edit-user-btn" type="button">✏️ Edit User</button>
                        <button class="btn--danger" id="delete-user-btn" type="button">🗑 Delete User</button>
                    </div>
                </div>
            `;

            dom.el('#edit-user-btn').addEventListener('click', () => {
                router.navigate(`/users/${user.id}/edit`);
            });

            dom.el('#delete-user-btn').addEventListener('click', () => {
                if (!window.confirm(`Delete user "${user.username}"?`)) return;
                usersApi.remove(user.id)
                    .then(() => {
                        notify.success(`User "${user.username}" deleted.`);
                        router.navigate('/users');
                    })
                    .catch(() => notify.error('Failed to delete user.'));
            });
        })
        .catch((err) => showError(err.message));
};

const renderUserForm = (editId = null) => {
    if (!auth.isAdmin()) {
        showError('Access denied.');
        return;
    }

    dom.show(dom.el('#sidebar'));
    renderSidebar();

    const isEdit = editId !== null;
    const loadData = isEdit ? usersApi.getById(editId) : Promise.resolve(null);

    if (isEdit) showLoader();

    loadData.then((existing) => {
        const main = dom.el('#app-main');

        main.innerHTML = `
            <a href="${isEdit ? `#/users/${editId}` : '#/users'}" class="announcement-detail__back">
                ← ${isEdit ? 'Back to User' : 'Back to Users'}
            </a>

            <header class="page-header">
                <div>
                    <h1 class="page-header__title">
                        ${isEdit ? 'Edit <span>User</span>' : 'Create <span>User</span>'}
                    </h1>
                    ${isEdit && existing ? `<p class="page-header__subtitle">Editing: ${existing.username}</p>` : ''}
                </div>
            </header>

            <div class="announcement-detail" style="max-width:520px;">
                <form id="user-form" novalidate>

                    <div class="form-group">
                        <label class="form-label" for="u-username">Username</label>
                        <input
                            class="form-input"
                            type="text"
                            id="u-username"
                            name="username"
                            placeholder="e.g. jane_doe"
                            autocomplete="off"
                            value="${existing ? existing.username : ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="u-password">
                            ${isEdit ? 'New Password (leave blank to keep)' : 'Password'}
                        </label>
                        <input
                            class="form-input"
                            type="password"
                            id="u-password"
                            name="password"
                            placeholder="${isEdit ? 'Leave blank to keep current' : 'Min 8 characters'}"
                            autocomplete="new-password"
                        >
                        <span class="form-hint">Must be at least 8 characters.</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="u-confirm">Confirm Password</label>
                        <input
                            class="form-input"
                            type="password"
                            id="u-confirm"
                            name="confirm"
                            placeholder="Repeat password"
                            autocomplete="new-password"
                        >
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="u-role">Role</label>
                        <select class="form-select" id="u-role" name="role">
                            <option value="">Select role…</option>
                            <option value="regular" ${existing && existing.role === 'regular' ? 'selected' : ''}>Regular User</option>
                            <option value="admin" ${existing && existing.role === 'admin' ? 'selected' : ''}>Administrator</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="u-location">Location (city)</label>
                        <input
                            class="form-input"
                            type="text"
                            id="u-location"
                            name="location"
                            placeholder="e.g. Lviv"
                            value="${existing ? existing.location || '' : ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="u-email">Email (optional)</label>
                        <input
                            class="form-input"
                            type="email"
                            id="u-email"
                            name="email"
                            placeholder="user@example.com"
                            value="${existing ? existing.email || '' : ''}"
                        >
                    </div>

                    <div style="display:flex;gap:12px;margin-top:8px;">
                        <a href="${isEdit ? `#/users/${editId}` : '#/users'}" class="btn--secondary">Cancel</a>
                        <button class="btn--primary" type="submit" id="user-submit">
                            ${isEdit ? 'Save Changes' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        const form = dom.el('#user-form');
        const submitBtn = dom.el('#user-submit');
        const usernameInput = dom.el('#u-username');
        const passwordInput = dom.el('#u-password');
        const confirmInput = dom.el('#u-confirm');
        const roleSelect = dom.el('#u-role');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            validate.clearAllErrors(form);

            const username = usernameInput.value;
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            const role = roleSelect.value;

            let hasError = false;

            const usernameErr = validate.runRules(username, [validate.required, validate.noSpaces]);
            if (usernameErr) { validate.showFieldError(usernameInput, usernameErr); hasError = true; }

            if (!isEdit || password) {
                const passRules = [validate.minLength(8)];
                if (!isEdit) passRules.unshift(validate.required);
                const passErr = validate.runRules(password, passRules);
                if (passErr) { validate.showFieldError(passwordInput, passErr); hasError = true; }

                if (password) {
                    const confirmErr = validate.runRules(confirm, [validate.passwordMatch(password)]);
                    if (confirmErr) { validate.showFieldError(confirmInput, confirmErr); hasError = true; }
                }
            }

            const roleErr = validate.runRules(role, [validate.required]);
            if (roleErr) { validate.showFieldError(roleSelect, roleErr); hasError = true; }

            if (hasError) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving…';

            const payload = {
                username: username.trim(),
                role,
                location: dom.el('#u-location').value.trim(),
                email: dom.el('#u-email').value.trim(),
            };

            if (password) {
                payload.password = password;
            } else if (isEdit && existing) {
                payload.password = existing.password;
            }

            const action = isEdit
                ? usersApi.update(editId, { ...existing, ...payload })
                : usersApi.create(payload);

            action
                .then((saved) => {
                    notify.success(isEdit ? 'User updated!' : 'User created!');
                    router.navigate(`/users/${saved.id}`);
                })
                .catch(() => {
                    notify.error('Failed to save. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = isEdit ? 'Save Changes' : 'Create User';
                });
        });
    });
};

export { renderUserInfo, renderUserForm };
