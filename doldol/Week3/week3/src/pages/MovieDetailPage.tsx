// pages/MovieDetailPage.tsx

import { useNavigate, useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";
import type { Credits, MovieDetail } from "../types/movie";

const BASE = "https://api.themoviedb.org/3/movie";

const MovieDetailPage = () => {
	const { movieId } = useParams<{ movieId: string }>();
	const navigate = useNavigate();

	const {
		data: movie,
		isPending: isMoviePending,
		isError: isMovieError,
	} = useCustomFetch<MovieDetail>(`${BASE}/${movieId}?language=ko-KR`);

	const {
		data: credits,
		isPending: isCreditsPending,
		isError: isCreditsError,
	} = useCustomFetch<Credits>(`${BASE}/${movieId}/credits?language=ko-KR`);

	const isPending = isMoviePending || isCreditsPending;
	const isError = isMovieError || isCreditsError;

	if (isPending)
		return (
			<div className="flex justify-center items-center h-dvh">
				<div className="size-12 animate-spin rounded-full border-4 border-t-transparent border-[#b2dab1]" />
			</div>
		);

	if (isError || !movie)
		return (
			<div className="flex justify-center items-center mt-20">
				<div className="text-red-500 text-center text-2xl">
					😥 영화 정보를 불러오는 데 실패했어요. 잠시 후 다시 시도해주세요.
				</div>
			</div>
		);

	return (
		<div className="text-white">
			{/* 배경 + 기본 정보 */}
			<div
				className="relative p-8 flex gap-6"
				style={{
					backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="absolute inset-0 bg-black/60" />
				<div className="relative z-10 flex gap-6">
					<img
						src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
						alt={movie.title}
						className="w-40 rounded-xl shadow-lg shrink-0"
					/>
					<div className="flex flex-col justify-center gap-2">
						<h1 className="text-3xl font-bold">{movie.title}</h1>
						<p className="text-gray-300">평균 {movie.vote_average.toFixed(1)}</p>
						<p className="text-gray-300">{movie.release_date.slice(0, 4)}</p>
						<p className="text-gray-300">{movie.runtime}분</p>
						<div className="flex gap-2">
							{movie.genres.map((g) => (
								<span
									key={g.id}
									className="text-xs bg-white/20 px-2 py-1 rounded-full"
								>
									{g.name}
								</span>
							))}
						</div>
						{movie.tagline && (
							<p className="text-[#b2dab1] italic">"{movie.tagline}"</p>
						)}
						<p className="text-sm text-gray-200 max-w-xl mt-2 leading-relaxed">
							{movie.overview}
						</p>
					</div>
				</div>
			</div>

			{/* 감독 + 배우 */}
			<div className="p-8 bg-gray-900">
				<h2 className="text-xl font-bold mb-4">감독/출연</h2>
				<div className="flex gap-4 flex-wrap">
					{credits?.cast.slice(0, 12).map((person) => (
						<div
							key={person.id}
							className="flex flex-col items-center w-20 text-center"
						>
							<img
								src={
									person.profile_path
										? `https://image.tmdb.org/t/p/w185${person.profile_path}`
										: "https://placehold.co/80x80/333/fff?text=?"
								}
								alt={person.name}
								className="w-16 h-16 rounded-full object-cover mb-1"
							/>
							<p className="text-xs font-semibold">{person.name}</p>
							<p className="text-xs text-gray-400">{person.character}</p>
						</div>
					))}
				</div>
			</div>

			{/* 뒤로가기 */}
			<div className="p-8 bg-gray-900 flex justify-start">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                    hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
				>
					← 뒤로가기
				</button>
			</div>
		</div>
	);
};

export default MovieDetailPage;
