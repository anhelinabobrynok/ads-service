import announcementsApi from '../api/announcements.js';
import auth from '../utils/auth.js';
import router from '../utils/router.js';
import { dom, notify } from '../utils/dom.js';
import { showLoader, showError } from '../components/loader.js';
import { renderSidebar } from '../components/shell.js';
import { formatDatetime } from '../utils/format.js';

const categoryEmoji = {
    housing: '🏠',
    electronics: '💻',
    jobs: '💼',
    events: '🎉',
    pets: '🐾',
    other: '📦',
};

const renderAnnouncementDetail = (id) => {
    dom.show(dom.el('#sidebar'));
    renderSidebar();
    showLoader();

    announcementsApi.getById(id)
        .then((announcement) => {
            if (!announcement) {
                showError('Announcement not found.');
                return;
            }

            const user = auth.getUser();
            const isOwner = user && user.id === announcement.authorId;
            const isAdmin = user && user.role === 'admin';
            const canEdit = isOwner || isAdmin;
            const cat = categoryEmoji[announcement.category] || '📦';

            const badge = announcement.visibility === 'public'
                ? '<span class="badge-public">Public</span>'
                : `<span class="badge-local">Local · ${announcement.location}</span>`;

            const levelText = announcement.visibility === 'public'
                ? 'Visible to everyone — including unregistered visitors.'
                : `Visible only to registered users in <strong>${announcement.location}</strong>.`;

            const main = dom.el('#app-main');
            main.innerHTML = `
                <a href="#/" class="announcement-detail__back">← Back to Announcements</a>

                <article class="announcement-detail">
                    <div class="announcement-detail__badges">
                        ${badge}
                        <span class="badge-user">${cat} ${announcement.category}</span>
                    </div>

                    <h1 class="announcement-detail__title">${announcement.title}</h1>

                    <div class="announcement-detail__meta-row">
                        <div class="announcement-detail__meta-item">
                            <span class="announcement-detail__meta-label">Author</span>
                            <span class="announcement-detail__meta-value">${announcement.authorName}</span>
                        </div>
                        <div class="announcement-detail__meta-item">
                            <span class="announcement-detail__meta-label">Published</span>
                            <span class="announcement-detail__meta-value">
                                <time datetime="${announcement.createdAt}">
                                    ${formatDatetime(announcement.createdAt)}
                                </time>
                            </span>
                        </div>
                        <div class="announcement-detail__meta-item">
                            <span class="announcement-detail__meta-label">Location</span>
                            <span class="announcement-detail__meta-value">${announcement.location}</span>
                        </div>
                        ${announcement.contact ? `
                            <div class="announcement-detail__meta-item">
                                <span class="announcement-detail__meta-label">Contact</span>
                                <span class="announcement-detail__meta-value">${announcement.contact}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="announcement-detail__level-section">
                        <span class="announcement-detail__level-icon" aria-hidden="true">
                            ${announcement.visibility === 'public' ? '🌐' : '📍'}
                        </span>
                        <div class="announcement-detail__level-text">
                            <strong>${announcement.visibility === 'public' ? 'Public' : 'Local'} announcement</strong>
                            ${levelText}
                        </div>
                    </div>

                    <div class="announcement-detail__body">
                        <p>${announcement.body}</p>
                    </div>

                    ${canEdit ? `
                        <div class="announcement-detail__actions">
                            <button class="btn--primary" id="edit-btn" type="button">✏️ Edit</button>
                            <button class="btn--danger" id="delete-btn" type="button">🗑 Delete</button>
                        </div>
                    ` : ''}
                </article>
            `;

            if (canEdit) {
                dom.el('#edit-btn').addEventListener('click', () => {
                    router.navigate(`/edit/${announcement.id}`);
                });

                dom.el('#delete-btn').addEventListener('click', () => {
                    if (!window.confirm('Delete this announcement? This cannot be undone.')) {
                        return;
                    }
                    announcementsApi.remove(announcement.id)
                        .then(() => {
                            notify.success('Announcement deleted.');
                            router.navigate('/my');
                        })
                        .catch(() => notify.error('Failed to delete.'));
                });
            }
        })
        .catch((err) => showError(err.message));
};

export default renderAnnouncementDetail;
