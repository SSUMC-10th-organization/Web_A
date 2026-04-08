import axios from "axios";
import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movie";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const useMovies = (baseUrl: string) => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		const fetchMovies = async () => {
			setIsPending(true);
			setIsError(false);
			try {
				const { data } = await axios.get<MovieResponse>(
					`${baseUrl}&page=${page}`,
					{
						headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
					},
				);
				setMovies(data.results);
				setTotalPages(Math.min(data.total_pages, 100)); // TMDB 최대 100페이지
			} catch (error) {
				console.error(error);
				setIsError(true);
			} finally {
				setIsPending(false);
			}
		};

		fetchMovies();
	}, [baseUrl, page]);

	return { movies, isPending, isError, page, setPage, totalPages };
};

export default useMovies;
