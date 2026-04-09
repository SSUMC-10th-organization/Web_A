import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateLoginValues } from "../utils/validate";
import type { LoginFormValues } from "../utils/validate";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.14 29.5 1 24 1 14.82 1 7.07 6.48 3.58 14.23l7.1 5.52C12.44 13.64 17.77 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.7c-.55 2.98-2.2 5.5-4.68 7.2l7.18 5.58C43.46 37.1 46.52 31.26 46.52 24.5z" />
    <path fill="#FBBC05" d="M10.68 28.25A14.56 14.56 0 0 1 9.5 24c0-1.48.26-2.91.68-4.25l-7.1-5.52A23.9 23.9 0 0 0 0 24c0 3.85.92 7.49 2.58 10.77l8.1-6.52z" />
    <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.95l-7.18-5.58c-1.9 1.28-4.33 2.03-6.32 2.03-6.23 0-11.56-4.14-13.32-9.75l-8.1 6.52C7.07 41.52 14.82 47 24 47z" />
  </svg>
);

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } = useForm({
    initialValues,
    validate: validateLoginValues,
  });

  // 폼이 유효한지 여부 (에러가 없으면 유효) (버튼 활성화 여부 결정)
  const isFormValid = !errors?.email && !errors?.password;

  const handleSubmit = () => {
    if (!isFormValid) return;

    // TODO: 로그인 API 호출
    console.log("로그인 시도:", values);
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center mb-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800 transition-colors text-xl absolute left-0"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold text-gray-900 mx-auto">로그인</h1>
        </div>

        {/* 구글 로그인 */}
        <button className="w-full flex items-center justify-center gap-3 cursor-pointer border border-gray-300 rounded-md py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors mb-4">
          <GoogleIcon />
          구글 로그인
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* 이메일 입력 */}
        <div className="mb-3">
          <input
            type="email"
            placeholder="이메일을 입력해주세요!"
            {...getInputProps("email")}
            className={`w-full border rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors ${
              touched?.email && errors?.email
                ? "border-red-400 focus:border-red-400"
                : "border-gray-300 focus:border-pink-400"
            }`}
          />
          {touched?.email && errors?.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요!"
            {...getInputProps("password")}
            className={`w-full border rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors ${
              touched?.password && errors?.password
                ? "border-red-400 focus:border-red-400"
                : "border-gray-300 focus:border-pink-400"
            }`}
          />
          {touched?.password && errors?.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full bg-gray-800 text-white py-3 rounded-md text-sm font-medium transition-colors
            enabled:cursor-pointer enabled:hover:bg-pink-600
            disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          로그인
        </button>
      </div>
    </main>
  );
};

export default LoginPage;
