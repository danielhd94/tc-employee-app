import { useState, useEffect } from 'react';

export const useFetchData = (apiFunction, storageKey, shouldFetch = true) => {
    const [data, setData] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const cachedData = localStorage.getItem(storageKey);
                if (cachedData && shouldFetch === false) {
                    setData(JSON.parse(cachedData));
                } else {
                    const response = await apiFunction();
                    if (response.success) {
                        setData(response.data);
                        localStorage.setItem(storageKey, JSON.stringify(response.data));
                    } else {
                        console.error(`Failed to fetch data: ${response.message}`);
                    }
                }
            } catch (error) {
                console.error(`An error occurred while fetching data: ${error}`);
            } finally {
                setIsLoadingData(false);
            }
        };

        if (shouldFetch) {
            fetchData();
        }
    }, [apiFunction, storageKey, shouldFetch]);

    return { data, isLoadingData, setData };
};
