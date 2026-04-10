import axios from "axios";
import { useEffect, useState } from "react";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const useCustomFetch = <T>(url: string) => {
	const [data, setData] = useState<T | null>(null);
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (!url) return;

		const fetchData = async () => {
			setIsPending(true);
			setIsError(false);
			try {
				const { data: responseData } = await axios.get<T>(url, {
					headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
				});
				setData(responseData);
			} catch (error) {
				console.error(error);
				setIsError(true);
			} finally {
				setIsPending(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, isPending, isError };
};

export default useCustomFetch;
