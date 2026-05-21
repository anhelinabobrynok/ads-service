import validate from '../../utils/validate';

describe('validate utility', () => {
    describe('required', () => {
        test('returns error for empty string', () => {
            expect(validate.required('')).toBe('This field is required');
        });

        test('returns error for null', () => {
            expect(validate.required(null)).toBe('This field is required');
        });

        test('returns error for whitespace only', () => {
            expect(validate.required('   ')).toBe('This field is required');
        });

        test('returns null for valid value', () => {
            expect(validate.required('hello')).toBeNull();
        });
    });

    describe('minLength', () => {
        test('returns error when value is too short', () => {
            expect(validate.minLength(8)('abc')).toBe('Must be at least 8 characters');
        });

        test('returns null when value meets minimum', () => {
            expect(validate.minLength(8)('password')).toBeNull();
        });

        test('returns null when value exceeds minimum', () => {
            expect(validate.minLength(3)('hello world')).toBeNull();
        });

        test('returns error for empty string', () => {
            expect(validate.minLength(5)('')).toBe('Must be at least 5 characters');
        });
    });

    describe('noSpaces', () => {
        test('returns error when value contains space', () => {
            expect(validate.noSpaces('john doe')).toBe('Must not contain spaces');
        });

        test('returns error when value contains tab', () => {
            expect(validate.noSpaces('john\tdoe')).toBe('Must not contain spaces');
        });

        test('returns null when value has no spaces', () => {
            expect(validate.noSpaces('johndoe')).toBeNull();
        });
    });

    describe('passwordMatch', () => {
        test('returns error when passwords do not match', () => {
            expect(validate.passwordMatch('secret')('different')).toBe('Passwords do not match');
        });

        test('returns null when passwords match', () => {
            expect(validate.passwordMatch('secret')('secret')).toBeNull();
        });
    });

    describe('runRules', () => {
        test('returns first error when multiple rules fail', () => {
            const result = validate.runRules('', [validate.required, validate.minLength(8)]);
            expect(result).toBe('This field is required');
        });

        test('returns second error when first rule passes', () => {
            const result = validate.runRules('hi', [validate.required, validate.minLength(8)]);
            expect(result).toBe('Must be at least 8 characters');
        });

        test('returns null when all rules pass', () => {
            const result = validate.runRules('validpass', [validate.required, validate.minLength(8)]);
            expect(result).toBeNull();
        });

        test('returns null for empty rules array', () => {
            const result = validate.runRules('anything', []);
            expect(result).toBeNull();
        });
    });
});
