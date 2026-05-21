import api from './client.js';

const announcementsApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams();

        if (params.visibility) {
            query.set('visibility', params.visibility);
        }
        if (params.location) {
            query.set('location', params.location);
        }
        if (params.authorId) {
            query.set('authorId', params.authorId);
        }
        if (params._sort) {
            query.set('_sort', params._sort);
            query.set('_order', params._order || 'desc');
        }

        const qs = query.toString();
        return api.get(`/announcements${qs ? `?${qs}` : ''}`);
    },

    getById: (id) => api.get(`/announcements/${id}`),

    create: (data) => api.post('/announcements', data),

    update: (id, data) => api.put(`/announcements/${id}`, data),

    remove: (id) => api.delete(`/announcements/${id}`),
};

export default announcementsApi;
