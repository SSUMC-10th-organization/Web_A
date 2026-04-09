import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .max(20, "비밀번호는 20자 이하로 입력해주세요."),
});

export type SigninFormValues = z.infer<typeof signinSchema>;
