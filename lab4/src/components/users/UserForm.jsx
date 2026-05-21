import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../common/FormField';
import validate from '../../utils/validate';

const ROLES = [
    { value: 'regular', label: 'Regular User' },
    { value: 'admin', label: 'Administrator' },
];

const buildInitialState = (user) => ({
    username: user?.username || '',
    password: '',
    confirm: '',
    role: user?.role || 'regular',
    location: user?.location || '',
    email: user?.email || '',
});

const buildInitialErrors = () => ({
    username: '',
    password: '',
    confirm: '',
    role: '',
    location: '',
});

function UserForm({ existing = null, onSubmit, loading }) {
    const [fields, setFields] = useState(() => buildInitialState(existing));
    const [errors, setErrors] = useState(buildInitialErrors);
    const navigate = useNavigate();
    const isEdit = existing !== null;

    const setField = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

    const validateAll = () => {
        const usernameErr = validate.runRules(fields.username, [
            validate.required,
            validate.noSpaces,
        ]);
        const passwordRules = isEdit
            ? (fields.password ? [validate.minLength(8)] : [])
            : [validate.required, validate.minLength(8)];
        const passwordErr = validate.runRules(fields.password, passwordRules);
        const confirmErr = fields.password
            ? validate.runRules(fields.confirm, [validate.passwordMatch(fields.password)])
            : null;
        const roleErr = validate.runRules(fields.role, [validate.required]);

        const next = {
            username: usernameErr || '',
            password: passwordErr || '',
            confirm: confirmErr || '',
            role: roleErr || '',
            location: '',
        };
        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateAll()) return;

        const payload = {
            username: fields.username.trim(),
            role: fields.role,
            location: fields.location.trim(),
            email: fields.email.trim(),
        };

        if (fields.password) {
            payload.password = fields.password;
        } else if (isEdit && existing) {
            payload.password = existing.password;
        }

        onSubmit(payload);
    };

    const cancelPath = isEdit ? `/users/${existing.id}` : '/users';

    return (
        <form onSubmit={handleSubmit} noValidate>
            <FormField id="u-username" label="Username" error={errors.username}>
                <input
                    className={`form-input${errors.username ? ' form-input--error-state' : ''}`}
                    type="text"
                    id="u-username"
                    value={fields.username}
                    onChange={setField('username')}
                    placeholder="e.g. jane_doe"
                    autoComplete="off"
                />
            </FormField>

            <FormField
                id="u-password"
                label={isEdit ? 'New Password (leave blank to keep)' : 'Password'}
                error={errors.password}
                hint="Must be at least 8 characters"
            >
                <input
                    className={`form-input${errors.password ? ' form-input--error-state' : ''}`}
                    type="password"
                    id="u-password"
                    value={fields.password}
                    onChange={setField('password')}
                    placeholder={isEdit ? 'Leave blank to keep current' : 'Min 8 characters'}
                    autoComplete="new-password"
                />
            </FormField>

            <FormField id="u-confirm" label="Confirm Password" error={errors.confirm}>
                <input
                    className={`form-input${errors.confirm ? ' form-input--error-state' : ''}`}
                    type="password"
                    id="u-confirm"
                    value={fields.confirm}
                    onChange={setField('confirm')}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                />
            </FormField>

            <FormField id="u-role" label="Role" error={errors.role}>
                <select
                    className={`form-select${errors.role ? ' form-input--error-state' : ''}`}
                    id="u-role"
                    value={fields.role}
                    onChange={setField('role')}
                >
                    <option value="">Select role…</option>
                    {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
            </FormField>

            <FormField
                id="u-location"
                label="Location (city)"
                hint="Determines which local announcements the user can see"
            >
                <input
                    className="form-input"
                    type="text"
                    id="u-location"
                    value={fields.location}
                    onChange={setField('location')}
                    placeholder="e.g. Lviv"
                />
            </FormField>

            <FormField id="u-email" label="Email (optional)">
                <input
                    className="form-input"
                    type="email"
                    id="u-email"
                    value={fields.email}
                    onChange={setField('email')}
                    placeholder="user@example.com"
                />
            </FormField>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                    type="button"
                    className="btn--secondary"
                    onClick={() => navigate(cancelPath)}
                >
                    Cancel
                </button>
                <button type="submit" className="btn--primary" disabled={loading}>
                    {loading ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create User')}
                </button>
            </div>
        </form>
    );
}

export default UserForm;
