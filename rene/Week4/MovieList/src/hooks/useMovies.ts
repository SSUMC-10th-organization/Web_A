import { useState } from "react";
import type { MovieResponse } from "../types/movie";
import useCustomFetch from "./useCustomFetch";

const useMovies = (baseUrl: string) => {
	const [page, setPage] = useState(1);

	const { data, isPending, isError } = useCustomFetch<MovieResponse>(
		`${baseUrl}&page=${page}`,
	);

	const movies = data?.results ?? [];
	const totalPages = Math.min(data?.total_pages ?? 1, 100);

	return { movies, isPending, isError, page, setPage, totalPages };
};

export default useMovies;
