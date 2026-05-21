const validate = {
    required: (value) => {
        if (!value || value.trim() === '') {
            return 'This field is required';
        }
        return null;
    },

    minLength: (min) => (value) => {
        if (!value || value.trim().length < min) {
            return `Must be at least ${min} characters`;
        }
        return null;
    },

    passwordMatch: (password) => (value) => {
        if (value !== password) {
            return 'Passwords do not match';
        }
        return null;
    },

    noSpaces: (value) => {
        if (/\s/.test(value)) {
            return 'Must not contain spaces';
        }
        return null;
    },

    runRules: (value, rules) => {
        for (let i = 0; i < rules.length; i += 1) {
            const error = rules[i](value);
            if (error) {
                return error;
            }
        }
        return null;
    },

    showFieldError: (input, message) => {
        input.classList.add('form-input--error-state');
        const existing = input.parentNode.querySelector('.form-error');
        if (!existing) {
            const errorEl = document.createElement('span');
            errorEl.className = 'form-error';
            errorEl.textContent = message;
            input.parentNode.appendChild(errorEl);
        } else {
            existing.textContent = message;
        }
    },

    clearFieldError: (input) => {
        input.classList.remove('form-input--error-state');
        const errorEl = input.parentNode.querySelector('.form-error');
        if (errorEl) {
            errorEl.remove();
        }
    },

    clearAllErrors: (form) => {
        form.querySelectorAll('.form-input--error-state').forEach((el) => {
            el.classList.remove('form-input--error-state');
        });
        form.querySelectorAll('.form-error').forEach((el) => el.remove());
    },
};

export default validate;
