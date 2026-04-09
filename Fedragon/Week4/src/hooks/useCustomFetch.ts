import { useEffect, useState } from 'react';
import axios from 'axios';

const useCustomFetch = (url: string) => {
   
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); 
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
                    }
                });
                setData(response.data); 
            } catch (error) {
                console.error("API 호출 에러:", error);
                setIsError(true); 
            } finally {
                setIsLoading(false); 
            }
        };

        fetchData();
    }, [url]); 

    
    return { data, isLoading, isError };
};

export default useCustomFetch;