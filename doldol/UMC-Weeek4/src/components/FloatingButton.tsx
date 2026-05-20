import { useNavigate } from "react-router-dom";

const FloatingButton = () => {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			aria-label="LP 추가"
			onClick={() => navigate("/lp/new")}
			className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl font-light text-white shadow-lg hover:bg-pink-600 transition-colors cursor-pointer"
		>
			+
		</button>
	);
};

export default FloatingButton;
