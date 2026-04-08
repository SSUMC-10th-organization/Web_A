import { useState } from "react";
import useCustomFetch from "../hooks/useCustomFetch";
import MovieCard from "../components/movie-card";

interface MoviesPageProps {
    category: string;
    title: string;
    showPagination?: boolean; 
}

export default function MoviesPage({ category, title, showPagination = true }: MoviesPageProps) {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useCustomFetch(`/movie/${category}?page=${page}`);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] w-full bg-white">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#a855f7] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-bold animate-pulse">영화 목록을 불러오는 중입니다...</p>
            </div>
        );
    }

    if (isError) return <div className="text-center py-20 text-red-500 font-bold">데이터를 가져오지 못했습니다. 다시 시도해주세요.</div>;

    return (
        <div className="bg-white px-6 py-8">
            <div className="flex flex-col items-center mb-10">
                <h2 className="text-2xl font-bold text-black mb-6">{title}</h2>
                {showPagination && (
                    <div className="flex items-center gap-6">
                        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg disabled:opacity-30 text-xl font-bold">&lt;</button>
                        <span className="text-lg font-bold text-gray-700">{page} 페이지</span>
                        <button onClick={() => setPage(p => p + 1)} className="w-12 h-12 flex items-center justify-center bg-[#e9d5ff] text-[#a855f7] rounded-lg text-xl font-bold">&gt;</button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {data?.results?.map((movie: any) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}