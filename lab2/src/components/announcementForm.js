import announcementsApi from '../api/announcements.js';
import auth from '../utils/auth.js';
import router from '../utils/router.js';
import { dom, notify } from '../utils/dom.js';
import { showLoader } from '../components/loader.js';
import { renderSidebar } from '../components/shell.js';
import validate from '../utils/validate.js';

const renderAnnouncementForm = (editId = null) => {
    dom.show(dom.el('#sidebar'));
    renderSidebar();

    const isEdit = editId !== null;

    const loadData = isEdit
        ? announcementsApi.getById(editId)
        : Promise.resolve(null);

    if (isEdit) {
        showLoader();
    }

    loadData.then((existing) => {
        const user = auth.getUser();
        const main = dom.el('#app-main');

        main.innerHTML = `
            <a href="${isEdit ? `#/announcements/${editId}` : '#/'}" class="announcement-detail__back">
                ← ${isEdit ? 'Back to Announcement' : 'Back to Announcements'}
            </a>

            <header class="page-header">
                <div>
                    <h1 class="page-header__title">
                        ${isEdit ? 'Edit <span>Announcement</span>' : 'New <span>Announcement</span>'}
                    </h1>
                </div>
            </header>

            <div class="announcement-detail" style="max-width:700px;">
                <form id="ann-form" novalidate>

                    <div class="form-group">
                        <label class="form-label" for="ann-title">Title</label>
                        <input
                            class="form-input"
                            type="text"
                            id="ann-title"
                            name="title"
                            placeholder="Brief and descriptive title"
                            maxlength="200"
                            value="${existing ? existing.title : ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ann-body">Description</label>
                        <textarea
                            class="form-textarea"
                            id="ann-body"
                            name="body"
                            placeholder="Describe your announcement in detail…"
                            rows="6"
                        >${existing ? existing.body : ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ann-visibility">Visibility</label>
                        <select class="form-select" id="ann-visibility" name="visibility">
                            <option value="">Choose visibility…</option>
                            <option value="public" ${existing && existing.visibility === 'public' ? 'selected' : ''}>
                                🌐 Public — visible to everyone
                            </option>
                            <option value="local" ${existing && existing.visibility === 'local' ? 'selected' : ''}>
                                📍 Local — visible only to users in my city
                            </option>
                        </select>
                        <span class="form-hint">Local announcements are for registered users in the same city only.</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ann-category">Category</label>
                        <select class="form-select" id="ann-category" name="category">
                            <option value="">Select category…</option>
                            <option value="housing" ${existing && existing.category === 'housing' ? 'selected' : ''}>🏠 Housing</option>
                            <option value="electronics" ${existing && existing.category === 'electronics' ? 'selected' : ''}>💻 Electronics</option>
                            <option value="jobs" ${existing && existing.category === 'jobs' ? 'selected' : ''}>💼 Jobs</option>
                            <option value="events" ${existing && existing.category === 'events' ? 'selected' : ''}>🎉 Events</option>
                            <option value="pets" ${existing && existing.category === 'pets' ? 'selected' : ''}>🐾 Pets</option>
                            <option value="other" ${existing && existing.category === 'other' ? 'selected' : ''}>📦 Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ann-contact">Contact Info (optional)</label>
                        <input
                            class="form-input"
                            type="text"
                            id="ann-contact"
                            name="contact"
                            placeholder="Phone, email, or Telegram"
                            value="${existing ? existing.contact || '' : ''}"
                        >
                    </div>

                    <div style="display:flex;gap:12px;margin-top:8px;">
                        <a href="${isEdit ? `#/announcements/${editId}` : '#/'}" class="btn--secondary">Cancel</a>
                        <button class="btn--primary" type="submit" id="ann-submit">
                            ${isEdit ? 'Save Changes' : 'Publish Announcement'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        const form = dom.el('#ann-form');
        const submitBtn = dom.el('#ann-submit');
        const titleInput = dom.el('#ann-title');
        const bodyInput = dom.el('#ann-body');
        const visibilitySelect = dom.el('#ann-visibility');
        const categorySelect = dom.el('#ann-category');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            validate.clearAllErrors(form);

            const title = titleInput.value;
            const body = bodyInput.value;
            const visibility = visibilitySelect.value;
            const category = categorySelect.value;

            const titleErr = validate.runRules(title, [validate.required, validate.minLength(10)]);
            const bodyErr = validate.runRules(body, [validate.required, validate.minLength(20)]);
            const visErr = validate.runRules(visibility, [validate.required]);
            const catErr = validate.runRules(category, [validate.required]);

            if (titleErr) validate.showFieldError(titleInput, titleErr);
            if (bodyErr) validate.showFieldError(bodyInput, bodyErr);
            if (visErr) validate.showFieldError(visibilitySelect, visErr);
            if (catErr) validate.showFieldError(categorySelect, catErr);

            if (titleErr || bodyErr || visErr || catErr) {
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving…';

            const payload = {
                title: title.trim(),
                body: body.trim(),
                visibility,
                category,
                contact: dom.el('#ann-contact').value.trim(),
                authorId: user.id,
                authorName: user.username,
                location: user.location,
            };

            const action = isEdit
                ? announcementsApi.update(editId, { ...existing, ...payload })
                : announcementsApi.create({ ...payload, createdAt: new Date().toISOString() });

            action
                .then((saved) => {
                    notify.success(isEdit ? 'Announcement updated!' : 'Announcement published!');
                    router.navigate(`/announcements/${saved.id}`);
                })
                .catch(() => {
                    notify.error('Failed to save. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = isEdit ? 'Save Changes' : 'Publish Announcement';
                });
        });
    });
};

export default renderAnnouncementForm;
