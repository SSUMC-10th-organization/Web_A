import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninFormValues } from "../schemas/signinSchema";
import { postSignin } from "../apis/auth";
import type { ResponseSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

// 컴포넌트
import FormInput from "../components/FormInput";
import Button from "../components/Button";

import googleLogo from "../assets/google_logo.png"; // 구글 로고 이미지

const LoginPage = () => {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SigninFormValues> = async (data) => {
    try {
      const response: ResponseSigninDto = await postSignin(data);
      setItem(response.data.accessToken);
      // 로그인 직후에 뒤로가기로 다시 로그인 페이지에 오는 걸 방지
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center mb-8 relative">
          <button
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
            className="text-gray-500 hover:text-gray-800 transition-colors text-xl absolute left-0"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold text-gray-900 mx-auto">로그인</h1>
        </div>

        {/* 구글 로그인 */}
        <button className="w-full flex items-center justify-center gap-3 cursor-pointer border border-gray-300 rounded-md py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors mb-4">
          <img src={googleLogo} alt="Google" width={20} height={20} />
          구글 로그인
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormInput type="email" placeholder="이메일" {...register("email")} error={errors.email} />
          <FormInput type="password" placeholder="비밀번호" {...register("password")} error={errors.password} />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
