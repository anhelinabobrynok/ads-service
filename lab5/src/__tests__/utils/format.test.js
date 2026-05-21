import { formatDate, formatDatetime, getInitials } from '../../utils/format';

describe('format utility', () => {
    describe('formatDate', () => {
        test('formats ISO date string to readable date', () => {
            const result = formatDate('2024-05-10T10:00:00Z');
            expect(result).toMatch(/10/);
            expect(result).toMatch(/2024/);
        });

        test('returns string', () => {
            const result = formatDate('2024-01-01T00:00:00Z');
            expect(typeof result).toBe('string');
        });
    });

    describe('formatDatetime', () => {
        test('formats ISO string to datetime with time', () => {
            const result = formatDatetime('2024-05-10T10:30:00Z');
            expect(result).toMatch(/2024/);
            expect(typeof result).toBe('string');
        });
    });

    describe('getInitials', () => {
        test('returns first two characters uppercased', () => {
            expect(getInitials('john_doe')).toBe('JO');
        });

        test('handles short username', () => {
            expect(getInitials('ab')).toBe('AB');
        });

        test('returns empty string for empty input', () => {
            expect(getInitials('')).toBe('');
        });

        test('handles single character', () => {
            expect(getInitials('a')).toBe('A');
        });

        test('uses default empty string when no arg given', () => {
            expect(getInitials()).toBe('');
        });
    });
});
