import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninFormValues } from "../../schemas/signinSchema";
import { useLogin } from "../mutations/useLogin";

export const useLoginForm = () => {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SigninFormValues> = (data) => {
    login(data);
  };

  return { register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting: isPending };
};
