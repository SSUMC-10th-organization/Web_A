import { useState, useEffect } from "react";
import type { AxiosRequestConfig } from "axios";
import axiosClient from "../api/axiosClient";

function useFetch<T>(url: string, options?: AxiosRequestConfig) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get<T>(url, { ...options });
        setData(response.data);
      } catch {
        setError("데이터를 가져오는데 에러가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // options를 직렬화한 string을 의존성으로 사용 (useMemo와 함께 사용할 것)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(options)]);

  return { data, error, isLoading };
}

export default useFetch;