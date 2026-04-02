interface Props {
	name: string;
}

const GenreChip = ({ name }: Props) => (
	<span className="px-3 py-1 bg-white/15 rounded-full text-xs text-gray-300">
		{name}
	</span>
);

export default GenreChip;
