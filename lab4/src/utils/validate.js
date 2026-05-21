const required = (value) => {
    if (!value || String(value).trim() === '') {
        return 'This field is required';
    }
    return null;
};

const minLength = (min) => (value) => {
    if (!value || String(value).trim().length < min) {
        return `Must be at least ${min} characters`;
    }
    return null;
};

const noSpaces = (value) => {
    if (/\s/.test(value)) {
        return 'Must not contain spaces';
    }
    return null;
};

const passwordMatch = (other) => (value) => {
    if (value !== other) {
        return 'Passwords do not match';
    }
    return null;
};

const runRules = (value, rules) => {
    for (let i = 0; i < rules.length; i += 1) {
        const error = rules[i](value);
        if (error) return error;
    }
    return null;
};

const validate = {
    required,
    minLength,
    noSpaces,
    passwordMatch,
    runRules,
};

export default validate;
