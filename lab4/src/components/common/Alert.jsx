const ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
};

function Alert({ notification, onDismiss }) {
    const { id, message, type } = notification;

    return (
        <div className={`alert--${type}`} role="alert">
            <span className="alert__icon" aria-hidden="true">
                {ICONS[type] || '!'}
            </span>
            <div className="alert__content">
                <p className="alert__message">{message}</p>
            </div>
            <button
                className="alert__close"
                type="button"
                aria-label="Close notification"
                onClick={() => onDismiss(id)}
            >
                ✕
            </button>
        </div>
    );
}

export default Alert;
