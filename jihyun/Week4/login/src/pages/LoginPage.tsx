import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import {
  type UserSignInInformation,
  validateSignIn,
} from '../utils/validate';

export default function LoginPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(validateSignIn, []);

  const { values, errors, touched, getInputProps } =
    useForm<UserSignInInformation>({
      initialValue: {
        email: '',
        password: '',
      },
      validate,
    });

  const isDisabled = useMemo(() => {
    const hasError = Object.values(errors).some((error) => error !== '');
    const hasEmptyValue = Object.values(values).some((value) => value.trim() === '');
    return hasError || hasEmptyValue || isSubmitting;
  }, [errors, values, isSubmitting]);

  const handleSubmit = async () => {
    if (isDisabled) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');

      const response = await fetch('http://localhost:8000/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      const data = await response.json();

      console.log('로그인 성공:', data);

      localStorage.setItem('accessToken', data.data.accessToken ?? '');
localStorage.setItem('refreshToken', data.data.refreshToken ?? '');

      alert('로그인 성공!');
      navigate('/');
    } catch (error) {
      console.error(error);
      setSubmitError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            로그인
          </h1>

          <button
            type="button"
            className="mb-5 flex w-full items-center justify-center rounded-md border border-gray-500 bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-[#111]"
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

            {submitError && (
              <p className="text-sm text-red-500">{submitError}</p>
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
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}