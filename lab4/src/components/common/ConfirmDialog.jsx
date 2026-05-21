function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    danger = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="modal">
                <header className="modal__header">
                    <h2 className="modal__title" id="confirm-title">{title}</h2>
                </header>
                <div className="modal__body">
                    <p style={{ color: 'var(--text-secondary, #8890b0)' }}>{message}</p>
                </div>
                <footer className="modal__footer">
                    <button
                        type="button"
                        className="btn--secondary"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={danger ? 'btn--danger' : 'btn--primary'}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </footer>
            </div>
        </div>
    );
}

export default ConfirmDialog;
