// src/pages/LoginPage.tsx
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateLogin } from "../utils/validate";

const LoginPage = () => {
	const navigate = useNavigate();

	const { values, errors, handleChange } = useForm(
		{ email: "", password: "" },
		validateLogin,
	);

	// 이메일/비밀번호가 모두 입력되고, 에러가 하나도 없을 때만 true
	const isFormValid =
		values.email.length > 0 &&
		values.password.length > 0 &&
		Object.keys(errors).length === 0;

	return (
		<div className="bg-black min-h-screen flex flex-col items-center pt-20 text-white">
			{/* 뒤로 가기 및 타이틀 (미션 1) */}
			<div className="w-full max-w-sm flex items-center mb-10 relative">
				<button
					onClick={() => navigate(-1)}
					className="absolute left-0 text-2xl font-bold"
				>
					{"<"}
				</button>
				<h1 className="text-2xl font-bold mx-auto">로그인</h1>
			</div>

			<form className="w-full max-w-sm flex flex-col gap-6">
				{/* 이메일 입력칸 */}
				<div className="flex flex-col">
					<input
						type="email"
						name="email"
						placeholder="이메일을 입력해주세요!"
						value={values.email}
						onChange={handleChange}
						className={`w-full p-4 rounded-full bg-white text-black outline-none border-2 transition-colors ${
							errors.email && values.email.length > 0
								? "border-red-500"
								: "border-transparent"
						}`}
					/>
					{/* 에러 메시지 (미션 2) */}
					{errors.email && values.email.length > 0 && (
						<p className="text-red-500 text-sm mt-2 ml-2">{errors.email}</p>
					)}
				</div>

				{/* 비밀번호 입력칸 */}
				<div className="flex flex-col">
					<input
						type="password"
						name="password"
						placeholder="비밀번호를 입력해주세요!"
						value={values.password}
						onChange={handleChange}
						className={`w-full p-4 rounded-full bg-white text-black outline-none border-2 transition-colors ${
							errors.password && values.password.length > 0
								? "border-red-500"
								: "border-transparent"
						}`}
					/>
					{/* 에러 메시지 (미션 2) */}
					{errors.password && values.password.length > 0 && (
						<p className="text-red-500 text-sm mt-2 ml-2">{errors.password}</p>
					)}
				</div>

				{/* 로그인 버튼 (미션 3) */}
				<button
					type="button"
					disabled={!isFormValid}
					className={`w-full p-4 mt-4 rounded-full font-bold text-lg transition-colors ${
						isFormValid
							? "bg-[#FF0066] text-white cursor-pointer"
							: "bg-gray-400 text-gray-700 cursor-not-allowed"
					}`}
				>
					로그인
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
