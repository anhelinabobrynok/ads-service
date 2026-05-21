function FormField({
    id,
    label,
    error,
    hint,
    children,
}) {
    return (
        <div className="form-group">
            <label className="form-label" htmlFor={id}>
                {label}
            </label>
            {children}
            {error && (
                <span className="form-error" role="alert">
                    {error}
                </span>
            )}
            {hint && !error && (
                <span className="form-hint">{hint}</span>
            )}
        </div>
    );
}

export default FormField;
