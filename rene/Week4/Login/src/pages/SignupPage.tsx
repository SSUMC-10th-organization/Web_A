import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/signupSchema";
import type { SignupFormValues } from "../schemas/signupSchema";
import { postSignup } from "../apis/auth";
import type { ResponseSignupDto } from "../types/auth";

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const handleNext = async () => {
    const isStepValid = await trigger(["name", "email"]);
    if (isStepValid) setStep(2);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    const { passwordCheck, ...rest } = data;

    const response: ResponseSignupDto = await postSignup(rest);

    console.log(response);
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center mb-8 relative">
          <button
            type="button"
            onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
            className="text-gray-500 hover:text-gray-800 transition-colors text-xl absolute left-0"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold text-gray-900 mx-auto">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* STEP 1: 이름 + 이메일 */}
          {step === 1 && (
            <>
              <div>
                <input
                  type="text"
                  placeholder="이름"
                  {...register("name")}
                  className={`w-full border rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors ${
                    errors.name
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-300 focus:border-pink-400"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="이메일"
                  {...register("email")}
                  className={`w-full border rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors ${
                    errors.email
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-300 focus:border-pink-400"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isValid}
                className="w-full mt-1 bg-gray-800 text-white py-3 rounded-md text-sm font-medium transition-colors
                  enabled:cursor-pointer enabled:hover:bg-pink-600
                  disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </>
          )}

          {/* STEP 2: 이메일 표시 + 비밀번호 */}
          {step === 2 && (
            <>
              {/* 입력된 이메일 표시 */}
              <div className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-400 bg-gray-50">
                {getValues("email")}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="비밀번호"
                  {...register("password")}
                  className={`w-full border rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors ${
                    errors.password
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-300 focus:border-pink-400"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  {...register("passwordCheck")}
                  className={`w-full border rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors ${
                    errors.passwordCheck
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-300 focus:border-pink-400"
                  }`}
                />
                {errors.passwordCheck && (
                  <p className="mt-1 text-xs text-red-500">{errors.passwordCheck.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full mt-1 bg-gray-800 text-white py-3 rounded-md text-sm font-medium transition-colors
                  enabled:cursor-pointer enabled:hover:bg-pink-600
                  disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "가입 중..." : "회원가입"}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
};

export default SignupPage;
