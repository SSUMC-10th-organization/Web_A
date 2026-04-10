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

const PageContainer = styled.div` display: flex; justify-content: center; align-items: center; min-height: 80vh; background-color: #000; color: #fff; padding: 20px; `;
const SignupForm = styled.form` width: 100%; max-width: 400px; display: flex; flex-direction: column; align-items: center; gap: 15px; `;
const Header = styled.div` width: 100%; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; .back-btn { cursor: pointer; font-size: 1.5rem; } .title { font-size: 1.2rem; font-weight: bold; } `;
const ProfileCircle = styled.div` width: 120px; height: 120px; border-radius: 50%; background-color: #ccc; background-image: url('https://cdn-icons-png.flaticon.com/512/149/149071.png'); background-size: cover; margin-bottom: 10px; `;
const InputWrapper = styled.div` position: relative; width: 100%; margin-bottom: 10px; `;
const DarkInput = styled.input` width: 100%; height: 50px; padding: 0 45px 0 15px; background-color: #222; border: 1px solid #333; border-radius: 8px; color: #fff; box-sizing: border-box; &:focus { outline: none; border-color: #FF007F; } `;
const ToggleButton = styled.button` position: absolute; right: 15px; top: 25px; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #555; font-size: 1.2rem; `;
const ErrorMessage = styled.p` color: #FF007F; font-size: 0.8rem; margin-top: 5px; width: 100%; `;
const ActionButton = styled.button<{ isactive: string }>` width: 100%; height: 50px; border: none; border-radius: 8px; font-weight: bold; margin-top: 10px; background-color: ${props => props.isactive === "true" ? "#FF007F" : "#333"}; color: ${props => props.isactive === "true" ? "#fff" : "#555"}; cursor: ${props => props.isactive === "true" ? "pointer" : "not-allowed"}; `;

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
  alert(`${data.nickname}님, 환영합니다!`);
  navigate('/'); 
};

  return (
    <PageContainer>
      <SignupForm onSubmit={handleSubmit(onSubmit)}>
        <Header>
          <span className="back-btn" onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}>&lt;</span>
          <span className="title">회원가입</span>
          <span style={{ width: '20px' }}></span>
        </Header>

        {step === 1 && (
          <>
            <InputWrapper>
              <DarkInput {...register("email")} placeholder="이메일을 입력해주세요!" />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </InputWrapper>
            <ActionButton type="button" isactive={isEmailValid ? "true" : "false"} onClick={() => nextStep("email")}>다음</ActionButton>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ alignSelf: 'flex-start', color: '#ccc' }}>✉️ {emailValue}</p>
            <InputWrapper>
              <DarkInput type={showPw ? "text" : "password"} {...register("password")} placeholder="비밀번호를 입력해주세요!" />
              <ToggleButton type="button" onClick={() => setShowPw(!showPw)}>{showPw ? "👁️" : "🙈"}</ToggleButton>
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </InputWrapper>
            <InputWrapper>
              <DarkInput type={showConfirmPw ? "text" : "password"} {...register("confirmPassword")} placeholder="비밀번호를 다시 한 번 입력해주세요!" />
              <ToggleButton type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}>{showConfirmPw ? "👁️" : "🙈"}</ToggleButton>
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
            </InputWrapper>
            <ActionButton type="button" isactive={isPwValid ? "true" : "false"} onClick={() => nextStep(["password", "confirmPassword"])}>다음</ActionButton>
          </>
        )}

        {step === 3 && (
          <>
            <ProfileCircle />
            <InputWrapper>
              <DarkInput {...register("nickname")} placeholder="닉네임을 입력해주세요!" />
              {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
            </InputWrapper>
            <ActionButton type="submit" isactive={isValid ? "true" : "false"} disabled={!isValid}>회원가입 완료</ActionButton>
          </>
        )}
      </SignupForm>
    </PageContainer>
  );
};

export default SignupPage;