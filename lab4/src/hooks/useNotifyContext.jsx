import {
    createContext,
    useContext,
    useMemo,
} from 'react';
import useNotify from '../hooks/useNotify';

const NotifyContext = createContext(null);

export function NotifyProvider({ children }) {
    const notify = useNotify();

    const value = useMemo(() => notify, [notify]);

    return (
        <NotifyContext.Provider value={value}>
            {children}
        </NotifyContext.Provider>
    );
}

export const useNotifyContext = () => useContext(NotifyContext);
