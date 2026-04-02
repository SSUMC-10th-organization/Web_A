import defaultProfile from "../assets/default_profile.svg";

const PROFILE_BASE_URL = "https://image.tmdb.org/t/p/w185";

interface Props {
	name: string;
	sub: string;
	profile_path: string | null;
}

const CastCard = ({ name, sub, profile_path }: Props) => (
	<div className="flex flex-col items-center gap-2 w-24 shrink-0">
		<div className="w-20 h-20 rounded-full overflow-hidden bg-black">
			<img
				src={
					profile_path ? `${PROFILE_BASE_URL}${profile_path}` : defaultProfile
				}
				alt={name}
				className="w-full h-full object-cover"
			/>
		</div>
		<p className="text-sm font-medium text-center leading-tight">{name}</p>
		<p className="text-xs text-gray-400 text-center leading-tight line-clamp-2">
			{sub}
		</p>
	</div>
);

export default CastCard;
