import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movie";
import axios from "axios";
import MovieGrid from "../components/MovieGrid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Popular = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => { 
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get<MovieResponse>(
          `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`, 
          {
            headers: {
              Authorization: `Bearer ${TMDB_API_KEY}`,
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Failed to fetch popular movies:", error);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div className="px-8 py-5 bg-black">
      <h1 className="text-2xl text-left font-bold mb-6 text-white">Popular Movies</h1>
      <MovieGrid movies={movies} />
    </div>
  );
};  

export default Popular;