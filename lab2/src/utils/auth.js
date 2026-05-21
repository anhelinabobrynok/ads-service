const AUTH_KEY = 'adboard_user';

const auth = {
    login(user) {
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
    },

    logout() {
        sessionStorage.removeItem(AUTH_KEY);
    },

    getUser() {
        const raw = sessionStorage.getItem(AUTH_KEY);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },

    isLoggedIn() {
        return this.getUser() !== null;
    },

    isAdmin() {
        const user = this.getUser();
        return user !== null && user.role === 'admin';
    },
};

export default auth;
