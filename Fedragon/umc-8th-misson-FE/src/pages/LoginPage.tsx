import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateLogin } from "../utils/validate";

const LoginPage = () => {
	const navigate = useNavigate();

	const { values, errors, handleChange } = useForm(
		{ email: "", password: "" },
		validateLogin,
	);

	const isFormValid =
		values.email.length > 0 &&
		values.password.length > 0 &&
		Object.keys(errors).length === 0;

	return (
		<div className="bg-black min-h-screen flex flex-col items-center pt-20 text-white p-6">
			<h1 className="text-2xl font-bold mb-10">로그인</h1>

			<form className="w-full max-w-sm flex flex-col gap-6">
				<input
					name="email"
					placeholder="이메일을 입력해주세요!"
					value={values.email}
					onChange={handleChange}
					className="w-full p-4 rounded-full bg-white text-black outline-none"
				/>
				<input
					type="password"
					name="password"
					placeholder="비밀번호를 입력해주세요!"
					value={values.password}
					onChange={handleChange}
					className="w-full p-4 rounded-full bg-white text-black outline-none"
				/>

				<button
					type="button"
					disabled={!isFormValid}
					className={`w-full p-4 rounded-full font-bold ${isFormValid ? "bg-[#FF0066]" : "bg-gray-500"}`}
				>
					로그인
				</button>

				{/* ⭐️ 회원가입 이동 버튼 추가 */}
				<button
					type="button"
					onClick={() => navigate("/signup")}
					className="mt-4 text-gray-400 underline hover:text-white transition-colors"
				>
					아직 계정이 없으신가요? 회원가입하러 가기
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
