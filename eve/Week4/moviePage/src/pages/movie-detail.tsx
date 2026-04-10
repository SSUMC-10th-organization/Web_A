import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
    const { movieId } = useParams();
    const { data: movie, isLoading: isMovieLoading } = useCustomFetch(`/movie/${movieId}`);
    const { data: credits, isLoading: isCreditsLoading } = useCustomFetch(`/movie/${movieId}/credits`);

    if (isMovieLoading || isCreditsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black">
                <div className="w-14 h-14 border-4 border-gray-800 border-t-white rounded-full animate-spin mb-6"></div>
                <p className="text-white text-lg font-medium animate-pulse">상세 정보를 로드하고 있습니다...</p>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="relative h-[500px] w-full">
                <img src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} className="w-full h-full object-cover opacity-40" alt="background" />
                <div className="absolute inset-0 p-10 md:p-20 flex flex-col justify-center bg-gradient-to-r from-black via-black/70 to-transparent">
                    <h1 className="text-5xl font-extrabold mb-4">{movie?.title}</h1>
                    <div className="flex gap-4 text-sm mb-4 font-semibold text-gray-300">
                        <span>평균 {movie?.vote_average?.toFixed(1)}</span>
                        <span>{movie?.release_date?.split('-')[0]}</span>
                        <span>{movie?.runtime}분</span>
                    </div>
                    <p className="italic text-lg mb-4 text-gray-300">"{movie?.tagline}"</p>
                    <p className="max-w-3xl text-gray-200 leading-relaxed line-clamp-5">{movie?.overview}</p>
                </div>
            </div>

            <div className="p-10 md:px-20">
                <h2 className="text-2xl font-bold mb-10">감독/출연</h2>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-6">
                    {credits?.cast?.slice(0, 20).map((person: any) => (
                        <div key={person.id} className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-800 mb-2 hover:border-gray-400 transition">
                                <img src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : "https://via.placeholder.com/200"} className="w-full h-full object-cover" alt={person.name} />
                            </div>
                            <span className="text-[12px] font-bold text-center truncate w-full">{person.name}</span>
                            <span className="text-[10px] text-gray-500 text-center truncate w-full">{person.character}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}