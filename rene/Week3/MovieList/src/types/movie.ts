export type Movie = {
	id: number;
	title: string;
	overview: string;
	poster_path: string;
	release_date: string;
	vote_average: number;
};

export type MovieResponse = {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
};

// 영화 상세 정보 타입
export type Genre = {
	id: number;
	name: string;
};

type ProductionCompany = {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
};

type ProductionCountry = {
	iso_3166_1: string;
	name: string;
};

type SpokenLanguage = {
	english_name: string;
	iso_639_1: string;
	name: string;
};

type BelongsToCollection = {
	id: number;
	name: string;
	poster_path: string;
	backdrop_path: string;
} | null;

export type MovieDetail = {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: BelongsToCollection;
	budget: number;
	genres: Genre[];
	homepage: string;
	id: number;
	imdb_id: string;
	origin_country: string[];
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

export type CastMember = {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
};

export type CrewMember = {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path: string | null;
};

export type MovieCredits = {
	id: number;
	cast: CastMember[];
	crew: CrewMember[];
};
