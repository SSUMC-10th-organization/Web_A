import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { useLogin } from '../hooks/mutations/useLogin';
import { type UserSignInInformation, validateSignIn } from '../utils/validate';

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const { values, errors, touched, getInputProps } =
    useForm<UserSignInInformation>({
      initialValue: { email: '', password: '' },
      validate: validateSignIn,
    });

  const isDisabled = useMemo(() => {
    const hasError = Object.values(errors).some((e) => e !== '');
    const hasEmpty = Object.values(values).some((v) => v.trim() === '');
    return hasError || hasEmpty || isPending;
  }, [errors, values, isPending]);

  const handleSubmit = () => {
    if (isDisabled) return;
    login(values, {
      onSuccess: () => navigate('/my', { replace: true }),
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-2xl text-white transition hover:text-pink-500"
        >
          &lt;
        </button>

        <div className="rounded-2xl bg-black p-6">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">로그인</h1>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-md border border-gray-500 bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-[#111]"
          >
            구글 로그인
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-600" />
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-600" />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <input
                type="email"
                placeholder="이메일을 입력해주세요!"
                {...getInputProps('email')}
                className={`w-full rounded-md border bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-500 ${
                  errors.email && touched.email
                    ? 'border-red-500 bg-red-200/20'
                    : 'border-gray-500 focus:border-pink-500'
                }`}
              />
              {errors.email && touched.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요!"
                {...getInputProps('password')}
                className={`w-full rounded-md border bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-500 ${
                  errors.password && touched.password
                    ? 'border-red-500 bg-red-200/20'
                    : 'border-gray-500 focus:border-pink-500'
                }`}
              />
              {errors.password && touched.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500">
                로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isDisabled}
              className={`w-full rounded-md px-4 py-3 text-sm font-semibold transition ${
                isDisabled
                  ? 'bg-[#1f1f1f] text-gray-400'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              {isPending ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}