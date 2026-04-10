import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "../schemas/signupSchema";
import { postSignup, postSignin } from "../apis/auth";
import { useLocalStorage } from "./useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const useSignupForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: { name: "", email: "", password: "", passwordCheck: "", nickname: "" },
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const [watchedName, watchedEmail] = watch(["name", "email"]);
  const isStep1Valid = !!watchedName && !!watchedEmail && !errors.name && !errors.email;

  const watchedPassword = watch("password");
  const watchedPasswordCheck = watch("passwordCheck");
  const isStep2Valid = !!watchedPassword && !!watchedPasswordCheck && !errors.password && !errors.passwordCheck;

  const watchedNickname = watch("nickname");
  const isStep3Valid = !!watchedNickname && !errors.nickname;

  const handleNext = async (fields: (keyof SignupFormValues)[], nextStep: 1 | 2 | 3) => {
    const isStepValid = await trigger(fields);
    if (isStepValid) setStep(nextStep);
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
    else navigate(-1);
  };

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    const { passwordCheck, ...rest } = data;
    try {
      await postSignup(rest);
      const signinResponse = await postSignin({ email: data.email, password: data.password });
      setItem(signinResponse.data.accessToken);
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return {
    step,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    getValues,
    handleNext,
    handleBack,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
  };
};
