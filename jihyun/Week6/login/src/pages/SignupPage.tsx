import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { postSignUp } from '../apis/auth';

const signUpSchema = z
  .object({
    email: z
      .string()
      .email('올바른 이메일 형식을 입력해주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .max(20, '비밀번호는 20자 이하여야 합니다.'),
    passwordCheck: z.string(),
    name: z
      .string()
      .min(1, '닉네임을 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignupPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      passwordCheck: '',
      name: '',
    },
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');
  const passwordCheckValue = watch('passwordCheck');

  const isEmailNextDisabled = useMemo(() => {
    return !emailValue || !!errors.email;
  }, [emailValue, errors.email]);

  const isPasswordNextDisabled = useMemo(() => {
    return (
      !passwordValue ||
      !passwordCheckValue ||
      !!errors.password ||
      !!errors.passwordCheck
    );
  }, [passwordValue, passwordCheckValue, errors.password, errors.passwordCheck]);

  const handleEmailNext = async () => {
    const isValid = await trigger('email');
    if (isValid) {
      setStep(2);
    }
  };

  const handlePasswordNext = async () => {
    const isValid = await trigger(['password', 'passwordCheck']);
    if (isValid) {
      setStep(3);
    }
  };

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setSubmitError('');

      const { passwordCheck, ...rest } = data;
      void passwordCheck;

      await postSignUp(rest);

      alert('회원가입이 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.error(error);
      setSubmitError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => {
            if (step === 1) {
              navigate(-1);
              return;
            }
            setStep((prev) => prev - 1);
          }}
          className="mb-6 text-2xl text-white transition hover:text-pink-500"
        >
          &lt;
        </button>

        <div className="rounded-2xl bg-black p-6">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            회원가입
          </h1>

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-gray-500 bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-[#111]"
              >
                구글 로그인
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-600" />
                <span className="text-sm text-gray-400">OR</span>
                <div className="h-px flex-1 bg-gray-600" />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  {...register('email')}
                  className={`w-full rounded-md border bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-500 ${
                    errors.email
                      ? 'border-red-500 bg-red-200/20'
                      : 'border-gray-500 focus:border-pink-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleEmailNext}
                disabled={isEmailNextDisabled}
                className={`w-full rounded-md px-4 py-3 text-sm font-semibold transition ${
                  isEmailNextDisabled
                    ? 'bg-[#1f1f1f] text-gray-400'
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
              >
                다음
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="mb-1 text-sm text-gray-300">
                ✉️ {emailValue}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요!"
                  {...register('password')}
                  className={`w-full rounded-md border bg-black px-4 py-3 pr-14 text-white outline-none transition placeholder:text-gray-500 ${
                    errors.password
                      ? 'border-red-500 bg-red-200/20'
                      : 'border-gray-500 focus:border-pink-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                >
                  {showPassword ? '숨김' : '보기'}
                </button>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPasswordCheck ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  {...register('passwordCheck')}
                  className={`w-full rounded-md border bg-black px-4 py-3 pr-14 text-white outline-none transition placeholder:text-gray-500 ${
                    errors.passwordCheck
                      ? 'border-red-500 bg-red-200/20'
                      : 'border-gray-500 focus:border-pink-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordCheck((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                >
                  {showPasswordCheck ? '숨김' : '보기'}
                </button>
                {errors.passwordCheck && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.passwordCheck.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handlePasswordNext}
                disabled={isPasswordNextDisabled}
                className={`w-full rounded-md px-4 py-3 text-sm font-semibold transition ${
                  isPasswordNextDisabled
                    ? 'bg-[#1f1f1f] text-gray-400'
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
              >
                다음
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="mx-auto h-32 w-32 rounded-full bg-gray-200" />

              <div>
                <input
                  type="text"
                  placeholder="닉네임을 입력해주세요!"
                  {...register('name')}
                  className={`w-full rounded-md border bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-500 ${
                    errors.name
                      ? 'border-red-500 bg-red-200/20'
                      : 'border-gray-500 focus:border-pink-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-md px-4 py-3 text-sm font-semibold transition ${
                  isSubmitting
                    ? 'bg-[#1f1f1f] text-gray-400'
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
              >
                {isSubmitting ? '회원가입 처리 중...' : '회원가입 완료'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}