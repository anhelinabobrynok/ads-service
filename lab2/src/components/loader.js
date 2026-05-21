import { dom } from '../utils/dom.js';

const showLoader = () => {
    const main = dom.el('#app-main');
    main.innerHTML = `
        <div class="loader" role="status" aria-label="Loading content">
            <div class="loader__spinner" aria-hidden="true"></div>
            <p class="loader__text">Loading…</p>
        </div>
    `;
};

const showError = (message) => {
    const main = dom.el('#app-main');
    main.innerHTML = `
        <div class="empty-state">
            <p class="empty-state__icon" aria-hidden="true">⚠</p>
            <h2 class="empty-state__title">Something went wrong</h2>
            <p class="empty-state__desc">${message}</p>
            <a href="#/" class="btn--primary" style="margin-top:16px;">Go to Home</a>
        </div>
    `;
};

export { showLoader, showError };
