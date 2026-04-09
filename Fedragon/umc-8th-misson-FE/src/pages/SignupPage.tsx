import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { type SignupFormValues, signupSchema } from "../schemas/signupSchema";

const SignupPage = () => {
	const [step, setStep] = useState(1);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		mode: "onChange",
	});

	const emailValue = watch("email");
	const passwordValue = watch("password");

	const onSubmit = (data: SignupFormValues) => {
		console.log("회원가입 성공:", data);
		alert("회원가입이 완료되었습니다!");
		navigate("/"); // 가입 완료 후 로그인 페이지로 이동
	};

	return (
		<div className="bg-black min-h-screen text-white p-6 flex flex-col items-center">
			<div className="w-full max-w-sm flex items-center mb-10 relative">
				{/* ⭐️ 여기 type="button"을 추가해서 Biome 에러를 해결했어! */}
				<button
					type="button"
					onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
					className="absolute left-0 text-2xl font-bold"
				>
					{"<"}
				</button>
				<h1 className="text-2xl font-bold mx-auto">회원가입</h1>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full max-w-sm flex flex-col gap-6"
			>
				{step === 1 && (
					<div className="flex flex-col gap-4">
						<input
							{...register("email")}
							placeholder="이메일을 입력해주세요"
							className="p-4 rounded-md bg-gray-800 border border-gray-700 outline-none"
						/>
						{errors.email && (
							<p className="text-red-500 text-sm">{errors.email.message}</p>
						)}
						<button
							type="button"
							disabled={!!errors.email || !emailValue}
							onClick={() => setStep(2)}
							className="bg-[#FF0066] p-4 rounded-md disabled:bg-gray-600 font-bold"
						>
							다음
						</button>
					</div>
				)}

				{step === 2 && (
					<div className="flex flex-col gap-4">
						<p className="text-gray-400 text-center">아이디: {emailValue}</p>
						<div className="relative">
							<input
								{...register("password")}
								type={showPassword ? "text" : "password"}
								placeholder="비밀번호 (6자 이상)"
								className="w-full p-4 rounded-md bg-gray-800 border border-gray-700 outline-none"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-4 top-4"
							>
								{showPassword ? "👁️" : "🙈"}
							</button>
						</div>
						{errors.password && (
							<p className="text-red-500 text-sm">{errors.password.message}</p>
						)}
						<input
							{...register("passwordCheck")}
							type="password"
							placeholder="비밀번호 재확인"
							className="p-4 rounded-md bg-gray-800 border border-gray-700 outline-none"
						/>
						{errors.passwordCheck && (
							<p className="text-red-500 text-sm">
								{errors.passwordCheck.message}
							</p>
						)}
						<button
							type="button"
							disabled={
								!!errors.password || !!errors.passwordCheck || !passwordValue
							}
							onClick={() => setStep(3)}
							className="bg-[#FF0066] p-4 rounded-md disabled:bg-gray-600 font-bold"
						>
							다음
						</button>
					</div>
				)}

				{step === 3 && (
					<div className="flex flex-col gap-4 items-center text-center">
						<div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-3xl mb-4">
							👤
						</div>
						<input
							{...register("nickname")}
							placeholder="닉네임을 입력해주세요"
							className="w-full p-4 rounded-md bg-gray-800 border border-gray-700 outline-none"
						/>
						{errors.nickname && (
							<p className="text-red-500 text-sm">{errors.nickname.message}</p>
						)}
						<button
							type="submit"
							disabled={!isValid}
							className="w-full bg-[#FF0066] p-4 rounded-md disabled:bg-gray-600 font-bold"
						>
							회원가입 완료
						</button>
					</div>
				)}
			</form>
		</div>
	);
};

export default SignupPage;
