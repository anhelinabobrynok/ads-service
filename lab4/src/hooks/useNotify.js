import {
    useState,
    useCallback,
    useRef,
} from 'react';

let idCounter = 0;

const useNotify = () => {
    const [notifications, setNotifications] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const show = useCallback((message, type = 'success') => {
        idCounter += 1;
        const id = idCounter;
        setNotifications((prev) => [...prev, { id, message, type }]);
        timers.current[id] = setTimeout(() => dismiss(id), 4000);
    }, [dismiss]);

    const success = useCallback((msg) => show(msg, 'success'), [show]);
    const error = useCallback((msg) => show(msg, 'error'), [show]);
    const warning = useCallback((msg) => show(msg, 'warning'), [show]);

    return {
        notifications,
        success,
        error,
        warning,
        dismiss,
    };
};

export default useNotify;
