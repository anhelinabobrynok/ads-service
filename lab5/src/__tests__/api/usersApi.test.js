import usersApi from '../../api/usersApi';
import apiClient from '../../api/client';

jest.mock('../../api/client');

describe('usersApi', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        test('calls /users with no params', async () => {
            apiClient.get.mockResolvedValue([]);
            await usersApi.getAll();
            expect(apiClient.get).toHaveBeenCalledWith('/users');
        });

        test('calls /users with role filter', async () => {
            apiClient.get.mockResolvedValue([]);
            await usersApi.getAll({ role: 'admin' });
            expect(apiClient.get).toHaveBeenCalledWith('/users?role=admin');
        });
    });

    describe('getById', () => {
        test('calls correct endpoint', async () => {
            apiClient.get.mockResolvedValue({ id: 2 });
            await usersApi.getById(2);
            expect(apiClient.get).toHaveBeenCalledWith('/users/2');
        });
    });

    describe('create', () => {
        test('adds createdAt to payload', async () => {
            apiClient.post.mockResolvedValue({ id: 99 });
            await usersApi.create({ username: 'newuser', role: 'regular' });

            const payload = apiClient.post.mock.calls[0][1];
            expect(payload).toHaveProperty('createdAt');
            expect(payload).toHaveProperty('username', 'newuser');
        });
    });

    describe('update', () => {
        test('calls PUT with correct id and data', async () => {
            apiClient.put.mockResolvedValue({ id: 3 });
            await usersApi.update(3, { username: 'updated' });
            expect(apiClient.put).toHaveBeenCalledWith('/users/3', { username: 'updated' });
        });
    });

    describe('remove', () => {
        test('calls DELETE on correct endpoint', async () => {
            apiClient.delete.mockResolvedValue(null);
            await usersApi.remove(4);
            expect(apiClient.delete).toHaveBeenCalledWith('/users/4');
        });
    });

    describe('authenticate', () => {
        test('resolves with user when credentials match', async () => {
            const mockUser = { id: 1, username: 'admin', password: 'admin123' };
            apiClient.get.mockResolvedValue([mockUser]);
            const result = await usersApi.authenticate('admin', 'admin123');
            expect(result).toEqual(mockUser);
        });

        test('rejects when user not found', async () => {
            apiClient.get.mockResolvedValue([]);
            await expect(usersApi.authenticate('nobody', 'pass')).rejects.toThrow('User not found');
        });

        test('rejects when password is wrong', async () => {
            apiClient.get.mockResolvedValue([{ username: 'admin', password: 'correct' }]);
            await expect(usersApi.authenticate('admin', 'wrong')).rejects.toThrow('Invalid password');
        });
    });
});
