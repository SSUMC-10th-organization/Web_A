export type LoginFormValues = {
  email: string;
  password: string;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email) return "이메일을 입력해주세요.";
  const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  if (!emailRegex.test(email)) return "올바른 이메일 형식이 아닙니다.";
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return "비밀번호를 입력해주세요.";
  if (password.length < 8 || password.length > 20) return "비밀번호는 8~20자 사이로 입력해주세요.";
  if (!/[A-Za-z]/.test(password)) return "영문자를 포함해야 합니다.";
  if (!/[0-9]/.test(password)) return "숫자를 포함해야 합니다.";
};

// useForm 훅의 validate prop 시그니처(Record<keyof T, string>)에 맞는 함수
export const validateLoginValues = (
  values: LoginFormValues
): Record<keyof LoginFormValues, string> => {
  return {
    email: validateEmail(values.email) ?? "",
    password: validatePassword(values.password) ?? "",
  };
};
