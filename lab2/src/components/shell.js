import auth from '../utils/auth.js';
import router from '../utils/router.js';
import { dom } from '../utils/dom.js';

const renderShell = () => {
    const user = auth.getUser();
    const header = dom.el('#site-header');

    header.innerHTML = `
        <a href="#/" class="site-header__logo" aria-label="AdBoard home">
            Ad<span>Board</span>
        </a>
        <div class="site-header__actions">
            ${user ? `
                <div class="site-header__location" aria-label="Your location">
                    📍 ${user.location || 'Unknown'}
                </div>
                <div class="site-header__user">
                    <div class="site-header__avatar" aria-hidden="true">
                        ${user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span>${user.username}</span>
                    ${user.role === 'admin' ? '<span class="badge-admin">Admin</span>' : ''}
                </div>
                <button class="btn--secondary" id="logout-btn" type="button">Logout</button>
            ` : `
                <a href="#/login" class="btn--primary">Login</a>
            `}
        </div>
    `;

    const logoutBtn = dom.el('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.logout();
            router.navigate('/login');
        });
    }
};

const renderSidebar = () => {
    const user = auth.getUser();
    const sidebar = dom.el('#sidebar');

    if (!user || !sidebar) {
        return;
    }

    sidebar.innerHTML = `
        <nav role="navigation" aria-label="Main navigation">
            <p class="sidebar__section-label">Browse</p>
            <a href="#/" class="sidebar__nav-link">
                <span class="sidebar__nav-icon" aria-hidden="true">📋</span>
                All Announcements
            </a>
            <a href="#/public" class="sidebar__nav-link">
                <span class="sidebar__nav-icon" aria-hidden="true">🌐</span>
                Public
            </a>
            <a href="#/local" class="sidebar__nav-link">
                <span class="sidebar__nav-icon" aria-hidden="true">📍</span>
                Local (${user.location})
            </a>

            <p class="sidebar__section-label">My Content</p>
            <a href="#/my" class="sidebar__nav-link">
                <span class="sidebar__nav-icon" aria-hidden="true">✏️</span>
                My Announcements
            </a>

            ${user.role === 'admin' ? `
                <p class="sidebar__section-label">Administration</p>
                <a href="#/users" class="sidebar__nav-link">
                    <span class="sidebar__nav-icon" aria-hidden="true">👥</span>
                    Manage Users
                </a>
            ` : ''}
        </nav>
    `;

    const currentHash = window.location.hash.replace('#', '') || '/';
    sidebar.querySelectorAll('.sidebar__nav-link').forEach((link) => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentHash || (href !== '/' && currentHash.startsWith(href))) {
            link.classList.remove('sidebar__nav-link');
            link.classList.add('sidebar__nav-link--active');
            link.setAttribute('aria-current', 'page');
        }
    });
};

export { renderShell, renderSidebar };
