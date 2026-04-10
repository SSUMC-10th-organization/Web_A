import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninFormValues } from "../schemas/signinSchema";
import { postSignin } from "../apis/auth";
import { useLocalStorage } from "./useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

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
      const response = await postSignin(data);
      setItem(response.data.accessToken);
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return { register, handleSubmit: handleSubmit(onSubmit), errors, isSubmitting };
};
