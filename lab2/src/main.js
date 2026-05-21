import router from './utils/router.js';
import auth from './utils/auth.js';
import { notify } from './utils/dom.js';
import { renderShell } from './components/shell.js';
import { showError } from './components/loader.js';
import renderLoginPage from './components/loginPage.js';
import renderAnnouncementsList from './components/announcementsList.js';
import renderAnnouncementDetail from './components/announcementDetail.js';
import renderAnnouncementForm from './components/announcementForm.js';
import renderUsersPage from './components/usersPage.js';
import { renderUserInfo, renderUserForm } from './components/userPages.js';

const requireAuth = (handler) => (params) => {
    if (!auth.isLoggedIn()) {
        router.navigate('/login');
        return;
    }
    handler(params);
};

const requireAdmin = (handler) => (params) => {
    if (!auth.isLoggedIn()) {
        router.navigate('/login');
        return;
    }
    if (!auth.isAdmin()) {
        showError('Access denied. Administrator account required.');
        return;
    }
    handler(params);
};

document.addEventListener('DOMContentLoaded', () => {
    notify.init();
    renderShell();

    router
        .on('/login', () => {
            if (auth.isLoggedIn()) {
                router.navigate('/');
                return;
            }
            renderLoginPage();
        })

        .on('/', requireAuth(() => renderAnnouncementsList('all')))

        .on('/public', requireAuth(() => renderAnnouncementsList('public')))

        .on('/local', requireAuth(() => renderAnnouncementsList('local')))

        .on('/my', requireAuth(() => renderAnnouncementsList('my')))

        .on('/create', requireAuth(() => renderAnnouncementForm(null)))

        .on('/announcements/:id', requireAuth((params) => {
            renderAnnouncementDetail(params.id);
        }))

        .on('/edit/:id', requireAuth((params) => {
            renderAnnouncementForm(params.id);
        }))

        .on('/users', requireAdmin(() => renderUsersPage()))

        .on('/users/create', requireAdmin(() => renderUserForm(null)))

        .on('/users/:id', requireAdmin((params) => {
            renderUserInfo(params.id);
        }))

        .on('/users/:id/edit', requireAdmin((params) => {
            renderUserForm(params.id);
        }))

        .notFound(() => {
            const main = document.querySelector('#app-main');
            if (main) {
                main.innerHTML = `
                    <div class="empty-state">
                        <p class="empty-state__icon" aria-hidden="true">🔍</p>
                        <h2 class="empty-state__title">Page not found</h2>
                        <p class="empty-state__desc">
                            The page you are looking for does not exist.
                        </p>
                        <a href="#/" class="btn--primary" style="margin-top:16px;">Go to Home</a>
                    </div>
                `;
            }
        })

        .init();
});
