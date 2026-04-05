import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import MovieCard from "../components/movie-card";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MoviesPage({ category, title }: { category: string, title: string }) {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setPage(1); 
    }, [category]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=ko-KR&page=${page}`
                );
                setMovies(response.data.results);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, [category, page]);

    return (
        <Container>
            <PageTitle>{title}</PageTitle>
            {isLoading ? (
                <Status>로딩 중... 🍿</Status>
            ) : (
                <>
                    <MovieGrid>
                        {movies.map((movie: any) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </MovieGrid>
                    <Pagination>
                        <Btn onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>이전</Btn>
                        <PageNum>{page} 페이지</PageNum>
                        <Btn onClick={() => setPage(p => p + 1)}>다음</Btn>
                    </Pagination>
                </>
            )}
        </Container>
    );
}

const Container = styled.div` display: flex; flex-direction: column; align-items: center; `;
const PageTitle = styled.h2` color: white; align-self: flex-start; margin-bottom: 20px; `;
const MovieGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; width: 100%; `;
const Pagination = styled.div` display: flex; gap: 20px; margin: 40px 0; align-items: center; `;
const Btn = styled.button` padding: 10px 20px; cursor: pointer; background: #ff4757; color: white; border: none; border-radius: 5px; &:disabled { background: #555; } `;
const PageNum = styled.span` color: white; font-weight: bold; `;
const Status = styled.div` color: white; text-align: center; margin-top: 100px; font-size: 20px; `;