import { useEffect, useState } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

export default function useFetch<T>(
  url: string,
  options?: RequestInit
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsPending(true);
        setIsError(false);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('요청 실패');
        }

        const result: T = await response.json();
        setData(result);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, isPending, isError };
}