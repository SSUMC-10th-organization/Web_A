export type UserSignInInformation = {
  email: string;
  password: string;
};

export function validateSignIn(
  values: UserSignInInformation
): Record<keyof UserSignInInformation, string> {
  const errors: Record<keyof UserSignInInformation, string> = {
    email: '',
    password: '',
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(values.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.';
  }

  if (values.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.';
  } else if (values.password.length > 20) {
    errors.password = '비밀번호는 20자 이하여야 합니다.';
  }

  return errors;
}