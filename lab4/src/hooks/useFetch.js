import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetcher, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(() => {
        setLoading(true);
        setError(null);
        fetcher()
            .then(setData)
            .catch((err) => setError(err.message || 'Unknown error'))
            .finally(() => setLoading(false));
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, loading, error, refetch };
};

export default useFetch;
