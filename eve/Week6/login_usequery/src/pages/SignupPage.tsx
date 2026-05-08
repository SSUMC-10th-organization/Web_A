import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import styled from 'styled-components';

const SignupSchema = z.object({
  email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식을 입력해주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  confirmPassword: z.string().min(1, "비밀번호 재확인은 필수입니다."),
  nickname: z.string().min(1, "닉네임은 필수입니다."),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "비밀번호가 일치하지 않습니다.",
});

type SignupFormData = z.infer<typeof SignupSchema>;

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, trigger, formState: { errors, isValid } } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    mode: 'onChange',
  });

  const emailValue = watch("email");
  const pwValue = watch("password");
  const confirmPwValue = watch("confirmPassword");

  const isEmailValid = emailValue && !errors.email;
  const isPwValid = pwValue?.length >= 8 && pwValue === confirmPwValue && !errors.confirmPassword;

  const nextStep = async (field: any) => {
    const isStepValid = await trigger(field);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const onSubmit = (data: SignupFormData) => {
    localStorage.setItem('user_info', JSON.stringify(data));
    localStorage.setItem('isLoggedIn', 'true');
    alert(`${data.nickname}님, 환영합니다!`);
    navigate('/home'); 
  };

  return (
    <PageContainer>
      <SignupForm onSubmit={handleSubmit(onSubmit)}>
        <Header>
          <span className="back-btn" onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}>&lt;</span>
          <span className="title">회원가입</span>
          <div style={{ width: '20px' }} />
        </Header>

        {step === 1 && (
          <>
            <InputWrapper>
              <DarkInput {...register("email")} placeholder="이메일을 입력해주세요!" />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </InputWrapper>
            <ActionButton type="button" $isactive={isEmailValid} onClick={() => nextStep("email")}>다음</ActionButton>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ alignSelf: 'flex-start', color: '#ccc' }}>✉️ {emailValue}</p>
            <InputWrapper>
              <DarkInput type={showPw ? "text" : "password"} {...register("password")} placeholder="비밀번호 입력" />
              <ToggleButton type="button" onClick={() => setShowPw(!showPw)}>{showPw ? "👁️" : "🙈"}</ToggleButton>
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </InputWrapper>
            <InputWrapper>
              <DarkInput type={showConfirmPw ? "text" : "password"} {...register("confirmPassword")} placeholder="비밀번호 재입력" />
              <ToggleButton type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}>{showConfirmPw ? "👁️" : "🙈"}</ToggleButton>
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
            </InputWrapper>
            <ActionButton type="button" $isactive={isPwValid} onClick={() => nextStep(["password", "confirmPassword"])}>다음</ActionButton>
          </>
        )}

        {step === 3 && (
          <>
            <ProfileCircle />
            <InputWrapper>
              <DarkInput {...register("nickname")} placeholder="닉네임 입력" />
              {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
            </InputWrapper>
            <ActionButton type="submit" $isactive={isValid} disabled={!isValid}>회원가입 완료</ActionButton>
          </>
        )}
      </SignupForm>
    </PageContainer>
  );
};

export default SignupPage;

const PageContainer = styled.div` display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; color: #fff; `;
const SignupForm = styled.form` width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 15px; padding: 20px; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; .title { font-size: 20px; font-weight: bold; } .back-btn { cursor: pointer; font-size: 24px; } `;
const ProfileCircle = styled.div` width: 100px; height: 100px; border-radius: 50%; background: #333; align-self: center; `;
const InputWrapper = styled.div` position: relative; width: 100%; `;
const DarkInput = styled.input` width: 100%; height: 50px; background: #222; border: 1px solid #333; border-radius: 8px; color: #fff; padding: 0 15px; `;
const ToggleButton = styled.button` position: absolute; right: 15px; top: 15px; background: none; border: none; cursor: pointer; `;
const ErrorMessage = styled.p` color: #FF007F; font-size: 12px; margin-top: 5px; `;
const ActionButton = styled.button<{ $isactive: boolean }>` width: 100%; height: 50px; background: ${p => p.$isactive ? '#FF007F' : '#333'}; color: ${p => p.$isactive ? '#fff' : '#888'}; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; `;