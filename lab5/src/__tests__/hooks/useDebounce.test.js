import { renderHook, act } from '@testing-library/react';
import useDebounce from '../../hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce hook', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    test('returns initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('hello', 400));
        expect(result.current).toBe('hello');
    });

    test('does not update value before delay', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            { initialProps: { value: 'initial' } },
        );

        rerender({ value: 'updated' });
        expect(result.current).toBe('initial');
    });

    test('updates value after delay', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            { initialProps: { value: 'initial' } },
        );

        rerender({ value: 'updated' });

        act(() => { jest.advanceTimersByTime(400); });

        expect(result.current).toBe('updated');
    });

    test('uses default delay of 400ms', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value),
            { initialProps: { value: 'first' } },
        );

        rerender({ value: 'second' });
        act(() => { jest.advanceTimersByTime(399); });
        expect(result.current).toBe('first');

        act(() => { jest.advanceTimersByTime(1); });
        expect(result.current).toBe('second');
    });

    test('resets timer on rapid value changes', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            { initialProps: { value: 'a' } },
        );

        rerender({ value: 'ab' });
        act(() => { jest.advanceTimersByTime(200); });

        rerender({ value: 'abc' });
        act(() => { jest.advanceTimersByTime(200); });

        expect(result.current).toBe('a');

        act(() => { jest.advanceTimersByTime(200); });
        expect(result.current).toBe('abc');
    });
});
