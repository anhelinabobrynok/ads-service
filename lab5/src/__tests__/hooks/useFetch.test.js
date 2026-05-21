import { renderHook, waitFor } from '@testing-library/react';
import useFetch from '../../hooks/useFetch';

describe('useFetch hook', () => {
    test('starts in loading state', () => {
        const fetcher = jest.fn(() => new Promise(() => {}));
        const { result } = renderHook(() => useFetch(fetcher));
        expect(result.current.loading).toBe(true);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();
    });

    test('sets data on successful fetch', async () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        const fetcher = jest.fn().mockResolvedValue(mockData);

        const { result } = renderHook(() => useFetch(fetcher));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBeNull();
    });

    test('sets error on failed fetch', async () => {
        const fetcher = jest.fn().mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useFetch(fetcher));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Network error');
        expect(result.current.data).toBeNull();
    });

    test('calls fetcher once on mount', async () => {
        const fetcher = jest.fn().mockResolvedValue([]);

        const { result } = renderHook(() => useFetch(fetcher));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(fetcher).toHaveBeenCalledTimes(1);
    });

    test('exposes refetch function that re-runs fetcher', async () => {
        const fetcher = jest.fn().mockResolvedValue([]);

        const { result } = renderHook(() => useFetch(fetcher));
        await waitFor(() => expect(result.current.loading).toBe(false));

        fetcher.mockResolvedValue([{ id: 1 }]);
        result.current.refetch();

        await waitFor(() => {
            expect(result.current.data).toEqual([{ id: 1 }]);
        });
    });

    test('handles error with no message gracefully', async () => {
        const fetcher = jest.fn().mockRejectedValue({});

        const { result } = renderHook(() => useFetch(fetcher));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Unknown error');
    });
});
