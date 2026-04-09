// src/utils/validate.ts
export const validateLogin = (values: Record<string, string>) => {
	const errors: Record<string, string> = {};

	// 이메일 정규식: @와 .이 포함되어야 함
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!values.email) {
		errors.email = "이메일을 반드시 입력해주세요.";
	} else if (!emailRegex.test(values.email)) {
		errors.email = "올바른 이메일 형식이 아닙니다.";
	}

	if (!values.password) {
		errors.password = "비밀번호는 필수 입력입니다.";
	} else if (values.password.length < 8) {
		errors.password = "비밀번호는 8자 이상이어야 합니다.";
	}

	return errors;
};
