import { useState, useEffect } from 'react';

import { API_URL } from '../config';

export const useExpansion = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/expansion`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load expansion pack", err);
                setLoading(false);
            });
    }, []);

    return { data, loading };
};
