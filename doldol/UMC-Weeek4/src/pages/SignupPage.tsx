import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z
	.object({
		email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
		password: z
			.string()
			.min(8, { message: "8자 이상이어야 합니다." })
			.max(20, { message: "20자 이하여야 합니다." }),
		passwordCheck: z
			.string()
			.min(8, { message: "8자 이상이어야 합니다." })
			.max(20, { message: "20자 이하여야 합니다." }),
	})
	.refine((data) => data.password === data.passwordCheck, {
		message: "비밀번호가 일치하지 않습니다.",
		path: ["passwordCheck"],
	});

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
	const [step, setStep] = useState<1 | 2>(1);
	const navigate = useNavigate();

	const {
		register,
		trigger,
		watch,
		getValues,
		formState: { errors },
	} = useForm<FormFields>({
		defaultValues: { email: "", password: "", passwordCheck: "" },
		resolver: zodResolver(schema),
		mode: "onChange",
	});

	const emailValue = watch("email");
	const passwordValue = watch("password");
	const passwordCheckValue = watch("passwordCheck");

	const isEmailValid = !errors.email && emailValue.length > 0;
	const isPasswordValid =
		!errors.password &&
		!errors.passwordCheck &&
		passwordValue.length > 0 &&
		passwordCheckValue.length > 0;

	const handleEmailNext = async () => {
		const valid = await trigger("email");
		if (valid) setStep(2);
	};

	const handlePasswordNext = async () => {
		const valid = await trigger(["password", "passwordCheck"]);
		if (valid) {
			const { email, password } = getValues();
			navigate("/signup/profile", { state: { email, password } });
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-full gap-4">
			<div className="flex flex-col gap-3">
				<input
					{...register("email")}
					className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
					type="email"
					placeholder="이메일"
				/>
				{errors.email && (
					<div className="text-red-500 text-sm">{errors.email.message}</div>
				)}

				{step === 2 && (
					<>
						<input
							{...register("password")}
							className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                                ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
							type="password"
							placeholder="비밀번호"
						/>
						{errors.password && (
							<div className="text-red-500 text-sm">
								{errors.password.message}
							</div>
						)}
						<input
							{...register("passwordCheck")}
							className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                                ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}
							type="password"
							placeholder="비밀번호 확인"
						/>
						{errors.passwordCheck && (
							<div className="text-red-500 text-sm">
								{errors.passwordCheck.message}
							</div>
						)}
					</>
				)}

				{step === 1 && (
					<button
						type="button"
						onClick={handleEmailNext}
						disabled={!isEmailValid}
						className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
					>
						다음
					</button>
				)}

				{step === 2 && (
					<button
						type="button"
						onClick={handlePasswordNext}
						disabled={!isPasswordValid}
						className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
					>
						다음
					</button>
				)}
			</div>
		</div>
	);
};

export default SignupPage;
