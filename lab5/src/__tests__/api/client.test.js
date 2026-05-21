import apiClient from '../../api/client';

describe('API client', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockResponse = (data, status = 200) => {
        global.fetch.mockResolvedValue({
            ok: status >= 200 && status < 300,
            status,
            json: jest.fn().mockResolvedValue(data),
        });
    };

    test('GET request calls fetch with correct URL', async () => {
        mockResponse([{ id: 1 }]);
        await apiClient.get('/users');
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3001/users',
            expect.objectContaining({ method: 'GET' }),
        );
    });

    test('GET request returns parsed JSON data', async () => {
        const data = [{ id: 1, username: 'admin' }];
        mockResponse(data);
        const result = await apiClient.get('/users');
        expect(result).toEqual(data);
    });

    test('POST request sends JSON body', async () => {
        mockResponse({ id: 1 }, 201);
        const payload = { username: 'newuser', role: 'regular' };
        await apiClient.post('/users', payload);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3001/users',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
            }),
        );
    });

    test('PUT request sends updated data', async () => {
        mockResponse({ id: 5, username: 'updated' });
        const payload = { username: 'updated' };
        await apiClient.put('/users/5', payload);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3001/users/5',
            expect.objectContaining({ method: 'PUT' }),
        );
    });

    test('DELETE request calls correct endpoint', async () => {
        global.fetch.mockResolvedValue({ ok: true, status: 204, json: jest.fn() });
        await apiClient.delete('/users/5');

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3001/users/5',
            expect.objectContaining({ method: 'DELETE' }),
        );
    });

    test('throws error on non-ok response', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 404,
            json: jest.fn().mockResolvedValue({ message: 'Not found' }),
        });

        await expect(apiClient.get('/users/999')).rejects.toThrow('Not found');
    });

    test('returns null for 204 No Content response', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            status: 204,
            json: jest.fn(),
        });

        const result = await apiClient.delete('/users/1');
        expect(result).toBeNull();
    });
});
