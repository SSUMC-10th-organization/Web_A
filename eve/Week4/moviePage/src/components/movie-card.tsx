import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }: any) {
    const navigate = useNavigate();
    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image"; 

    return (
        <div 
            onClick={() => navigate(`/movies/${movie.id}`)} 
            className="flex flex-col cursor-pointer transition-transform duration-200 hover:scale-105"
        >
            <img src={posterUrl} alt={movie.title} className="w-full h-auto aspect-[2/3] object-cover rounded-2xl shadow-sm" />
            <h3 className="text-black text-sm font-bold mt-2 truncate px-1">{movie.title}</h3>
        </div>
    );
}