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

const announcementsApi = {
    getAll: (params = {}) => apiClient.get(`/announcements${buildQuery(params)}`),

    getById: (id) => apiClient.get(`/announcements/${id}`),

    create: (data) => apiClient.post('/announcements', {
        ...data,
        createdAt: new Date().toISOString(),
    }),

    update: (id, data) => apiClient.put(`/announcements/${id}`, data),

    remove: (id) => apiClient.delete(`/announcements/${id}`),
};

export default announcementsApi;
