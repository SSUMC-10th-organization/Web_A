import { useSignupForm } from "../hooks/useSignupForm";
import defaultProfile from "../assets/default_profile.svg";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

const SignupPage = () => {
  const {
    step,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    getValues,
    handleNext,
    handleBack,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
  } = useSignupForm();

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center mb-8 relative">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-800 transition-colors text-xl absolute left-0"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold text-gray-900 mx-auto">회원가입</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => { if (e.key === "Enter" && step !== 3) e.preventDefault(); }}
          className="flex flex-col gap-3"
        >
          {/* STEP 1: 이름 + 이메일 */}
          {step === 1 && (
            <>
              <FormInput type="text" placeholder="이름" {...register("name")} error={errors.name} />
              <FormInput type="email" placeholder="이메일" {...register("email")} error={errors.email} />
              <Button type="button" onClick={() => handleNext(["name", "email"], 2)} disabled={!isStep1Valid}>
                다음
              </Button>
            </>
          )}

          {/* STEP 2: 이메일 표시 + 비밀번호 */}
          {step === 2 && (
            <>
              <div className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-400 bg-gray-50">
                {getValues("email")}
              </div>
              <FormInput type="password" placeholder="비밀번호" {...register("password")} error={errors.password} />
              <FormInput type="password" placeholder="비밀번호 확인" {...register("passwordCheck")} error={errors.passwordCheck} />
              <Button type="button" onClick={() => handleNext(["password", "passwordCheck"], 3)} disabled={!isStep2Valid}>
                다음
              </Button>
            </>
          )}

          {/* STEP 3: 프로필 + 닉네임 */}
          {step === 3 && (
            <>
              <div className="flex justify-center mb-2">
                <img src={defaultProfile} alt="기본 프로필" className="w-50 h-50" />
              </div>
              <FormInput type="text" placeholder="닉네임을 입력해주세요!" {...register("nickname")} error={errors.nickname} />
              <Button type="submit" disabled={!isStep3Valid || isSubmitting}>
                {isSubmitting ? "가입 중..." : "회원가입 완료"}
              </Button>
            </>
          )}
        </form>
      </div>
    </main>
  );
};

export default SignupPage;
