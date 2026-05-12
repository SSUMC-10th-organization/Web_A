import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { signinSchema, type SigninFormValues } from "../schemas/signinSchema";
import { useAuth } from "../context/AuthContext";

export const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SigninFormValues> = async (data) => {
    try {
      await login(data);
      alert("로그인에 성공했습니다!");
      const from = (location.state as { from?: string })?.from ?? "/";
      navigate(from, { replace: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return { register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting };
};