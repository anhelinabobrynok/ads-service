import Alert from './Alert';
import { useNotifyContext } from '../../hooks/useNotifyContext';

function NotificationContainer() {
    const { notifications, dismiss } = useNotifyContext();

    return (
        <div id="notifications" aria-live="polite" aria-atomic="false">
            {notifications.map((n) => (
                <Alert key={n.id} notification={n} onDismiss={dismiss} />
            ))}
        </div>
    );
}

export default NotificationContainer;
