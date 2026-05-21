import { formatDate } from '../utils/format.js';
import auth from '../utils/auth.js';

const categoryEmoji = {
    housing: '🏠',
    electronics: '💻',
    jobs: '💼',
    events: '🎉',
    pets: '🐾',
    other: '📦',
};

const renderAnnouncementCard = (announcement) => {
    const user = auth.getUser();
    const isOwner = user && user.id === announcement.authorId;
    const isAdmin = user && user.role === 'admin';
    const canEdit = isOwner || isAdmin;
    const cat = categoryEmoji[announcement.category] || '📦';
    const visibilityClass = announcement.visibility === 'public'
        ? 'announcement-card--public'
        : 'announcement-card--local';
    const badge = announcement.visibility === 'public'
        ? '<span class="badge-public">Public</span>'
        : `<span class="badge-local">Local · ${announcement.location}</span>`;

    return `
        <article class="${visibilityClass}" data-id="${announcement.id}">
            <header class="announcement-card__header">
                <div class="announcement-card__badges">
                    ${badge}
                    <span class="badge-user">${cat} ${announcement.category}</span>
                </div>
                ${canEdit ? `
                    <div class="dropdown">
                        <button
                            class="btn--icon js-card-menu"
                            data-id="${announcement.id}"
                            aria-label="Options"
                            type="button"
                        >⋯</button>
                        <div class="dropdown__menu" role="menu" hidden>
                            <button
                                class="dropdown__item js-edit-ann"
                                data-id="${announcement.id}"
                                role="menuitem"
                                type="button"
                            >✏️ Edit</button>
                            <div class="dropdown__divider" role="separator"></div>
                            <button
                                class="dropdown__item--danger js-delete-ann"
                                data-id="${announcement.id}"
                                role="menuitem"
                                type="button"
                            >🗑 Delete</button>
                        </div>
                    </div>
                ` : ''}
            </header>

            <a href="#/announcements/${announcement.id}" class="announcement-card__title-link">
                <h2 class="announcement-card__title">${announcement.title}</h2>
            </a>
            <p class="announcement-card__body">${announcement.body}</p>

            <footer class="announcement-card__footer">
                <div class="announcement-card__author">
                    <div class="announcement-card__author-avatar" aria-hidden="true">
                        ${announcement.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <span>${announcement.authorName}</span>
                </div>
                <time class="announcement-card__meta" datetime="${announcement.createdAt}">
                    ${formatDate(announcement.createdAt)}
                </time>
            </footer>
        </article>
    `;
};

const renderEmptyState = (message = 'No announcements found') => `
    <div class="empty-state">
        <p class="empty-state__icon" aria-hidden="true">📋</p>
        <h2 class="empty-state__title">${message}</h2>
        <p class="empty-state__desc">Be the first to post an announcement!</p>
        <a href="#/create" class="btn--primary" style="margin-top:16px;">+ New Announcement</a>
    </div>
`;

export { renderAnnouncementCard, renderEmptyState };
