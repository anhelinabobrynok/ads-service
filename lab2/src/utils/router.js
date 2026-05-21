const routes = [];
let notFoundHandler = null;

const router = {
    on(pattern, handler) {
        routes.push({ pattern, handler });
        return this;
    },

    notFound(handler) {
        notFoundHandler = handler;
        return this;
    },

    resolve() {
        const hash = window.location.hash.replace('#', '') || '/';
        const [rawPath, queryString] = hash.split('?');

        const queryParams = {};
        if (queryString) {
            queryString.split('&').forEach((pair) => {
                const [key, val] = pair.split('=');
                queryParams[decodeURIComponent(key)] = decodeURIComponent(val || '');
            });
        }

        const segments = rawPath.split('/').filter(Boolean);

        for (let i = 0; i < routes.length; i += 1) {
            const { pattern, handler } = routes[i];
            const patternSegs = pattern.split('/').filter(Boolean);

            if (pattern === '/' && segments.length === 0) {
                handler({});
                return;
            }

            if (patternSegs.length !== segments.length) {
                continue;
            }

            const params = { ...queryParams };
            let matched = true;

            for (let j = 0; j < patternSegs.length; j += 1) {
                if (patternSegs[j].startsWith(':')) {
                    params[patternSegs[j].slice(1)] = segments[j];
                } else if (patternSegs[j] !== segments[j]) {
                    matched = false;
                    break;
                }
            }

            if (matched) {
                handler(params);
                return;
            }
        }

        if (notFoundHandler) {
            notFoundHandler();
        }
    },

    navigate(path) {
        window.location.hash = path;
    },

    init() {
        window.addEventListener('hashchange', () => this.resolve());
        this.resolve();
    },
};

export default router;
