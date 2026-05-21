const dom = {
    el: (selector) => document.querySelector(selector),

    els: (selector) => [...document.querySelectorAll(selector)],

    create: (tag, attrs = {}, text = '') => {
        const element = document.createElement(tag);
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dKey, dVal]) => {
                    element.dataset[dKey] = dVal;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        if (text) {
            element.textContent = text;
        }
        return element;
    },

    empty: (element) => {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    show: (element) => {
        element.removeAttribute('hidden');
    },

    hide: (element) => {
        element.setAttribute('hidden', '');
    },
};

const notify = {
    container: null,

    init() {
        this.container = dom.el('#notifications');
    },

    show(message, type = 'success', duration = 4000) {
        if (!this.container) {
            return;
        }

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
        };

        const alert = dom.create('div', { className: `alert--${type}`, role: 'alert' });
        alert.innerHTML = `
            <span class="alert__icon" aria-hidden="true">${icons[type] || '!'}</span>
            <div class="alert__content">
                <p class="alert__message">${message}</p>
            </div>
            <button class="alert__close" aria-label="Close notification" type="button">✕</button>
        `;

        const closeBtn = alert.querySelector('.alert__close');
        closeBtn.addEventListener('click', () => alert.remove());

        this.container.appendChild(alert);

        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, duration);
    },

    success: (msg) => notify.show(msg, 'success'),
    error: (msg) => notify.show(msg, 'error'),
    warning: (msg) => notify.show(msg, 'warning'),
};

export { dom, notify };
