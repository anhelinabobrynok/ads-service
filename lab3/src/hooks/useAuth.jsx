import {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
} from 'react';
import usersApi from '../api/usersApi';

const AUTH_KEY = 'adboard_user';

const loadStoredUser = () => {
    try {
        const raw = sessionStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadStoredUser);

    const login = useCallback((username, password) => usersApi
        .authenticate(username, password)
        .then((authenticated) => {
            sessionStorage.setItem(AUTH_KEY, JSON.stringify(authenticated));
            setUser(authenticated);
            return authenticated;
        }), []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(AUTH_KEY);
        setUser(null);
    }, []);

    const isAdmin = user?.role === 'admin';

    const value = useMemo(() => ({
        user,
        isAdmin,
        login,
        logout,
    }), [user, isAdmin, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
