const BASE_URL = 'http://localhost:3001';

const request = (method, path, body = null) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    return window.fetch(`${BASE_URL}${path}`, options)
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => {
                    throw new Error(err.message || `HTTP ${response.status}`);
                });
            }
            if (response.status === 204) {
                return null;
            }
            return response.json();
        });
};

const apiClient = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    delete: (path) => request('DELETE', path),
};

export default apiClient;
