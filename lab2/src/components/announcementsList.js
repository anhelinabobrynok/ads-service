import announcementsApi from '../api/announcements.js';
import auth from '../utils/auth.js';
import router from '../utils/router.js';
import { dom, notify } from '../utils/dom.js';
import { showLoader, showError } from '../components/loader.js';
import { renderAnnouncementCard, renderEmptyState } from '../components/announcementCard.js';
import { renderSidebar } from '../components/shell.js';

const TABS = [
    { label: 'All', href: '#/', path: '/' },
    { label: '🌐 Public', href: '#/public', path: '/public' },
    { label: '📍 Local', href: '#/local', path: '/local' },
];

const renderTabs = (activeTab) => TABS.map((t) => {
    const cls = t.path === activeTab ? 'tab--active' : 'tab';
    return `<a href="${t.href}" class="${cls}">${t.label}</a>`;
}).join('');

const bindCardActions = (container) => {
    container.querySelectorAll('.js-card-menu').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = btn.nextElementSibling;
            const isHidden = menu.hasAttribute('hidden');
            document.querySelectorAll('.dropdown__menu').forEach((m) => m.setAttribute('hidden', ''));
            if (isHidden) {
                menu.removeAttribute('hidden');
            }
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown__menu').forEach((m) => m.setAttribute('hidden', ''));
    });

    container.querySelectorAll('.js-edit-ann').forEach((btn) => {
        btn.addEventListener('click', () => {
            router.navigate(`/edit/${btn.dataset.id}`);
        });
    });

    container.querySelectorAll('.js-delete-ann').forEach((btn) => {
        btn.addEventListener('click', () => {
            const { id } = btn.dataset;
            if (!window.confirm('Delete this announcement? This cannot be undone.')) {
                return;
            }
            announcementsApi.remove(id)
                .then(() => {
                    notify.success('Announcement deleted.');
                    btn.closest('article').remove();
                })
                .catch(() => notify.error('Failed to delete. Please try again.'));
        });
    });
};

const renderAnnouncementsList = (filter = 'all') => {
    dom.show(dom.el('#sidebar'));
    renderSidebar();
    showLoader();

    const user = auth.getUser();
    const params = { _sort: 'createdAt', _order: 'desc' };

    if (filter === 'public') {
        params.visibility = 'public';
    } else if (filter === 'local') {
        params.visibility = 'local';
        if (user) {
            params.location = user.location;
        }
    } else if (filter === 'my') {
        if (user) {
            params.authorId = user.id;
        }
    }

    const activeTab = filter === 'my' ? null : `/${filter === 'all' ? '' : filter}`.replace('//', '/');

    announcementsApi.getAll(params)
        .then((announcements) => {
            const main = dom.el('#app-main');

            const titles = {
                all: 'All <span>Announcements</span>',
                public: '🌐 <span>Public</span> Announcements',
                local: '📍 Local <span>Announcements</span>',
                my: 'My <span>Announcements</span>',
            };

            main.innerHTML = `
                <header class="page-header">
                    <div>
                        <h1 class="page-header__title">${titles[filter]}</h1>
                        <p class="page-header__subtitle">${announcements.length} announcement${announcements.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div class="page-header__actions">
                        <a href="#/create" class="btn--primary">+ New Announcement</a>
                    </div>
                </header>

                <div class="filter-bar" role="search">
                    <input
                        class="filter-bar__search"
                        type="search"
                        id="search-input"
                        placeholder="Search announcements…"
                        aria-label="Search announcements"
                    >
                </div>

                ${filter !== 'my' ? `
                    <nav class="tabs" aria-label="Announcement filters">
                        ${renderTabs(activeTab)}
                    </nav>
                ` : ''}

                <section aria-label="Announcements list" id="announcements-grid">
                    ${announcements.length === 0
                        ? renderEmptyState()
                        : `<div class="announcement-grid">
                            ${announcements.map(renderAnnouncementCard).join('')}
                        </div>`
                    }
                </section>
            `;

            bindCardActions(main);

            const searchInput = dom.el('#search-input');
            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    const query = searchInput.value.toLowerCase();
                    const grid = dom.el('#announcements-grid');
                    const filtered = announcements.filter(
                        (a) => a.title.toLowerCase().includes(query)
                            || a.body.toLowerCase().includes(query),
                    );
                    grid.innerHTML = filtered.length === 0
                        ? renderEmptyState('No results found')
                        : `<div class="announcement-grid">
                            ${filtered.map(renderAnnouncementCard).join('')}
                        </div>`;
                    bindCardActions(grid);
                });
            }
        })
        .catch((err) => showError(err.message));
};

export default renderAnnouncementsList;
