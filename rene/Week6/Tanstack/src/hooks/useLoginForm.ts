import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninFormValues } from "../schemas/signinSchema";
import { useAuth } from "../context/AuthContext";

export const useLoginForm = () => {
  const { login } = useAuth();

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
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return { register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting };
};