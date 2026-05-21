import apiClient from './client';

const buildQuery = (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            query.set(key, value);
        }
    });
    const qs = query.toString();
    return qs ? `?${qs}` : '';
};

const usersApi = {
    getAll: (params = {}) => apiClient.get(`/users${buildQuery(params)}`),

    getById: (id) => apiClient.get(`/users/${id}`),

    create: (data) => apiClient.post('/users', {
        ...data,
        createdAt: new Date().toISOString(),
    }),

    update: (id, data) => apiClient.put(`/users/${id}`, data),

    remove: (id) => apiClient.delete(`/users/${id}`),

    authenticate: (username, password) => apiClient
        .get(`/users?username=${encodeURIComponent(username)}`)
        .then((users) => {
            if (!users || users.length === 0) {
                throw new Error('User not found');
            }
            const user = users[0];
            if (user.password !== password) {
                throw new Error('Invalid password');
            }
            return user;
        }),
};

export default usersApi;
