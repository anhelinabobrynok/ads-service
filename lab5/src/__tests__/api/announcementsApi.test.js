import announcementsApi from '../../api/announcementsApi';
import apiClient from '../../api/client';

jest.mock('../../api/client');

describe('announcementsApi', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        test('calls /announcements with no params', async () => {
            apiClient.get.mockResolvedValue([]);
            await announcementsApi.getAll();
            expect(apiClient.get).toHaveBeenCalledWith('/announcements');
        });

        test('calls /announcements with visibility param', async () => {
            apiClient.get.mockResolvedValue([]);
            await announcementsApi.getAll({ visibility: 'public' });
            expect(apiClient.get).toHaveBeenCalledWith('/announcements?visibility=public');
        });

        test('calls /announcements with multiple params', async () => {
            apiClient.get.mockResolvedValue([]);
            await announcementsApi.getAll({ visibility: 'local', location: 'Lviv' });
            const url = apiClient.get.mock.calls[0][0];
            expect(url).toContain('visibility=local');
            expect(url).toContain('location=Lviv');
        });

        test('skips empty params', async () => {
            apiClient.get.mockResolvedValue([]);
            await announcementsApi.getAll({ visibility: '', location: 'Lviv' });
            const url = apiClient.get.mock.calls[0][0];
            expect(url).not.toContain('visibility');
            expect(url).toContain('location=Lviv');
        });
    });

    describe('getById', () => {
        test('calls correct endpoint', async () => {
            apiClient.get.mockResolvedValue({ id: 1 });
            await announcementsApi.getById(1);
            expect(apiClient.get).toHaveBeenCalledWith('/announcements/1');
        });
    });

    describe('create', () => {
        test('calls POST with createdAt timestamp', async () => {
            apiClient.post.mockResolvedValue({ id: 10 });
            await announcementsApi.create({ title: 'Test', visibility: 'public' });

            const postCall = apiClient.post.mock.calls[0];
            expect(postCall[0]).toBe('/announcements');
            expect(postCall[1]).toHaveProperty('title', 'Test');
            expect(postCall[1]).toHaveProperty('createdAt');
        });
    });

    describe('update', () => {
        test('calls PUT on correct endpoint', async () => {
            apiClient.put.mockResolvedValue({ id: 3 });
            await announcementsApi.update(3, { title: 'Updated' });
            expect(apiClient.put).toHaveBeenCalledWith('/announcements/3', { title: 'Updated' });
        });
    });

    describe('remove', () => {
        test('calls DELETE on correct endpoint', async () => {
            apiClient.delete.mockResolvedValue(null);
            await announcementsApi.remove(5);
            expect(apiClient.delete).toHaveBeenCalledWith('/announcements/5');
        });
    });
});
