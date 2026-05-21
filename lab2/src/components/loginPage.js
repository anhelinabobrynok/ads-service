import usersApi from '../api/users.js';
import auth from '../utils/auth.js';
import router from '../utils/router.js';
import { dom, notify } from '../utils/dom.js';
import validate from '../utils/validate.js';
import { renderShell } from '../components/shell.js';

const renderLoginPage = () => {
    dom.hide(dom.el('#sidebar'));

    const main = dom.el('#app-main');
    main.className = '';

    main.innerHTML = `
        <div class="auth-page">
            <div class="auth-card">
                <div class="auth-card__logo">
                    <h1 class="auth-card__title">Ad<span>Board</span></h1>
                    <p class="auth-card__subtitle">Announcements for your community</p>
                </div>

                <form id="login-form" novalidate>
                    <div class="form-group">
                        <label class="form-label" for="login-username">Username</label>
                        <input
                            class="form-input"
                            type="text"
                            id="login-username"
                            name="username"
                            placeholder="Enter your username"
                            autocomplete="username"
                        >
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="login-password">Password</label>
                        <input
                            class="form-input"
                            type="password"
                            id="login-password"
                            name="password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                        >
                    </div>
                    <button class="btn--primary" type="submit" id="login-submit"
                        style="width:100%;justify-content:center;margin-top:8px;">
                        Sign In
                    </button>
                </form>

                <p class="auth-card__footer">
                    Try: <strong>admin</strong> / <strong>admin123</strong>
                    or <strong>john_doe</strong> / <strong>pass1234</strong>
                </p>
            </div>
        </div>
    `;

    const form = dom.el('#login-form');
    const usernameInput = dom.el('#login-username');
    const passwordInput = dom.el('#login-password');
    const submitBtn = dom.el('#login-submit');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        validate.clearAllErrors(form);

        const username = usernameInput.value;
        const password = passwordInput.value;

        const usernameError = validate.runRules(username, [validate.required]);
        const passwordError = validate.runRules(password, [validate.required]);

        if (usernameError) {
            validate.showFieldError(usernameInput, usernameError);
        }
        if (passwordError) {
            validate.showFieldError(passwordInput, passwordError);
        }
        if (usernameError || passwordError) {
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in…';

        usersApi.authenticate(username, password)
            .then((user) => {
                auth.login(user);
                renderShell();
                router.navigate('/');
            })
            .catch((err) => {
                notify.error(err.message || 'Login failed. Check your credentials.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            });
    });
};

export default renderLoginPage;
