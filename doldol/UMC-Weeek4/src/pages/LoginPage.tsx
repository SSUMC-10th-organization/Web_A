import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";

const LoginPage = () => {
	const { login, accessToken } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	// 로그인 전 가려던 경로 (없으면 홈)
	const from =
		(location.state as { from?: { pathname: string } } | null)?.from
			?.pathname || "/";

	useEffect(() => {
		if (accessToken) {
			navigate(from, { replace: true });
		}
	}, [accessToken, navigate, from]);

	const { values, errors, touched, getInputProps } =
		useForm<UserSigninInformation>({
			initialValue: { email: "", password: "" },
			validate: validateSignin,
		});

	const handleSubmit = async () => {
		const success = await login(values);
		if (success) {
			navigate(from, { replace: true });
		}
	};

	const handleGoogleLogin = () => {
		window.location.href =
			import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
	};

	const isDisabled: boolean =
		Object.values(errors || {}).some((error) => error.length > 0) ||
		Object.values(values).some((value) => value === "");

	return (
		<div className="flex flex-col items-center justify-center h-full gap-4 py-20">
			<div className="flex flex-col gap-3">
				<input
					{...getInputProps("email")}
					className={`border w-[300px] p-[10px] rounded-sm bg-gray-900 text-white focus:border-pink-500
						${errors?.email && touched?.email ? "border-red-500 bg-red-900/30" : "border-gray-700"}`}
					type="email"
					placeholder="이메일"
				/>
				{errors?.email && touched?.email && (
					<div className="text-red-500 text-sm">{errors.email}</div>
				)}
				<input
					{...getInputProps("password")}
					className={`border w-[300px] p-[10px] rounded-sm bg-gray-900 text-white focus:border-pink-500
						${errors?.password && touched?.password ? "border-red-500 bg-red-900/30" : "border-gray-700"}`}
					type="password"
					placeholder="비밀번호"
				/>
				{errors?.password && touched?.password && (
					<div className="text-red-500 text-sm">
						{errors.password}
					</div>
				)}
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isDisabled}
					className="w-full bg-pink-500 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-600 transition-colors cursor-pointer disabled:bg-gray-700"
				>
					로그인
				</button>

				<button
					type="button"
					onClick={handleGoogleLogin}
					className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer"
				>
					<div className="flex items-center justify-center gap-2">
						<img
							src="/images/google.png"
							alt="Google Logo"
							className="w-6 h-6"
						/>
						<span>구글 로그인</span>
					</div>
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
