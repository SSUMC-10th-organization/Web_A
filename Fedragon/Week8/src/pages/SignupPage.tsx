const SignupPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>
      <div className="flex flex-col gap-3 w-80">
        <input
          type="text"
          placeholder="이름"
          className="p-3 border border-gray-300 rounded bg-white text-black"
        />
        <input
          type="email"
          placeholder="이메일"
          className="p-3 border border-gray-300 rounded bg-white text-black"
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="p-3 border border-gray-300 rounded bg-white text-black"
        />
        <button className="p-3 bg-blue-600 text-white font-bold rounded mt-2">
          가입하기
        </button>
      </div>
    </div>
  );
};

export default SignupPage;