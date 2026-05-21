import { renderHook, act } from '@testing-library/react';
import useNotify from '../../hooks/useNotify';

jest.useFakeTimers();

describe('useNotify hook', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    test('starts with empty notifications', () => {
        const { result } = renderHook(() => useNotify());
        expect(result.current.notifications).toHaveLength(0);
    });

    test('adds notification on success()', () => {
        const { result } = renderHook(() => useNotify());

        act(() => { result.current.success('All good!'); });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0].message).toBe('All good!');
        expect(result.current.notifications[0].type).toBe('success');
    });

    test('adds notification on error()', () => {
        const { result } = renderHook(() => useNotify());

        act(() => { result.current.error('Something failed'); });

        expect(result.current.notifications[0].type).toBe('error');
    });

    test('adds notification on warning()', () => {
        const { result } = renderHook(() => useNotify());

        act(() => { result.current.warning('Watch out'); });

        expect(result.current.notifications[0].type).toBe('warning');
    });

    test('dismisses notification by id', () => {
        const { result } = renderHook(() => useNotify());

        act(() => { result.current.success('Hello'); });
        const { id } = result.current.notifications[0];

        act(() => { result.current.dismiss(id); });

        expect(result.current.notifications).toHaveLength(0);
    });

    test('auto-dismisses notification after 4 seconds', () => {
        const { result } = renderHook(() => useNotify());

        act(() => { result.current.success('Auto dismiss'); });
        expect(result.current.notifications).toHaveLength(1);

        act(() => { jest.advanceTimersByTime(4000); });
        expect(result.current.notifications).toHaveLength(0);
    });

    test('can add multiple notifications', () => {
        const { result } = renderHook(() => useNotify());

        act(() => {
            result.current.success('First');
            result.current.error('Second');
        });

        expect(result.current.notifications).toHaveLength(2);
    });

    test('notifications have unique ids', () => {
        const { result } = renderHook(() => useNotify());

        act(() => {
            result.current.success('A');
            result.current.success('B');
        });

        const ids = result.current.notifications.map((n) => n.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
