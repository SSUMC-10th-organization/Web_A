import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, { error: "이름을 입력해주세요." })
      .max(20, { error: "이름은 20자 이하로 입력해주세요." }),
    email: z
      .string()
      .min(1, { error: "이메일을 입력해주세요." })
      .email({ error: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { error: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { error: "비밀번호는 20자 이하로 입력해주세요." }),
    passwordCheck: z.string().min(1, { error: "비밀번호 확인을 입력해주세요." }),
    nickname: z
      .string()
      .min(1, { error: "닉네임을 입력해주세요." })
      .max(20, { error: "닉네임은 20자 이하로 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
