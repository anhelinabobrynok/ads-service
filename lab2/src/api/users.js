import api from './client.js';

const usersApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams();

        if (params.role) {
            query.set('role', params.role);
        }
        if (params.location) {
            query.set('location', params.location);
        }

        const qs = query.toString();
        return api.get(`/users${qs ? `?${qs}` : ''}`);
    },

    getById: (id) => api.get(`/users/${id}`),

    create: (data) => api.post('/users', {
        ...data,
        createdAt: new Date().toISOString(),
    }),

    update: (id, data) => api.put(`/users/${id}`, data),

    remove: (id) => api.delete(`/users/${id}`),

    authenticate: (username, password) => api.get(`/users?username=${username}`)
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
