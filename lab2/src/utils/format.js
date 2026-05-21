const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const formatDatetime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export { formatDate, formatDatetime };
