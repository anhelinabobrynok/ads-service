import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifyContext } from '../../hooks/useNotifyContext';
import FormField from '../common/FormField';
import validate from '../../utils/validate';

const INITIAL_ERRORS = { username: '', password: '' };

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(INITIAL_ERRORS);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const notify = useNotifyContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const validateForm = () => {
        const usernameErr = validate.runRules(username, [validate.required]);
        const passwordErr = validate.runRules(password, [validate.required]);
        setErrors({ username: usernameErr || '', password: passwordErr || '' });
        return !usernameErr && !passwordErr;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        login(username, password)
            .then(() => navigate(from, { replace: true }))
            .catch((err) => {
                notify.error(err.message || 'Login failed. Check your credentials.');
                setLoading(false);
            });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__logo">
                    <h1 className="auth-card__title">
                        Ad
                        <span>Board</span>
                    </h1>
                    <p className="auth-card__subtitle">Announcements for your community</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <FormField id="login-username" label="Username" error={errors.username}>
                        <input
                            className={`form-input${errors.username ? ' form-input--error-state' : ''}`}
                            type="text"
                            id="login-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                    </FormField>

                    <FormField id="login-password" label="Password" error={errors.password}>
                        <input
                            className={`form-input${errors.password ? ' form-input--error-state' : ''}`}
                            type="password"
                            id="login-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </FormField>

                    <button
                        type="submit"
                        className="btn--primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-card__footer">
                    Try:
                    {' '}
                    <strong>admin</strong>
                    {' / '}
                    <strong>admin123</strong>
                    {' or '}
                    <strong>john_doe</strong>
                    {' / '}
                    <strong>pass1234</strong>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;
