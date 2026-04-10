import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";

const MyProfilePage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { email, password } = (location.state || {}) as {
		email: string;
		password: string;
	};

	const [name, setName] = useState("");

	const handleSubmit = async () => {
		try {
			await postSignup({ email, password, name });
			navigate("/");
		} catch (error) {
			alert((error as Error)?.message);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-full gap-4">
			<div className="flex flex-col items-center gap-3">
				<div className="flex items-center gap-2 self-start">
					<span className="text-lg font-semibold">회원가입</span>
				</div>

				<div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-12 h-12 text-gray-500"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<title>프로필 이미지</title>
						<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
					</svg>
				</div>

				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm border-gray-300"
					type="text"
					placeholder="이름"
				/>

				<button
					type="button"
					onClick={handleSubmit}
					disabled={!name}
					className="w-full bg-pink-500 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-600 transition-colors cursor-pointer disabled:bg-gray-300"
				>
					회원가입 완료
				</button>
			</div>
		</div>
	);
};

export default MyProfilePage;
