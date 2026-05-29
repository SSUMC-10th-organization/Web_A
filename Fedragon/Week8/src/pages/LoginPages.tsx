const LoginPages = () => {
  return (
    // 네비게이션 바 아래 중앙에 예쁘게 배치하기 위한 전체 컨테이너
    <div className="flex flex-col items-center justify-center mt-32">
      
      {/* 폼 요소들을 담는 박스 (너비 고정, 세로 정렬) */}
      <div className="flex flex-col gap-3 w-80">
        
        <input
          type="email"
          placeholder="이메일"
          className="p-3 border border-gray-300 rounded bg-white text-black focus:outline-none focus:border-blue-500"
        />
        
        <input
          type="password"
          placeholder="비밀번호"
          className="p-3 border border-gray-300 rounded bg-white text-black focus:outline-none focus:border-blue-500"
        />
        
        {/* 일반 로그인 버튼 */}
        <button className="p-3 bg-gray-300 text-white font-bold rounded mt-2 hover:bg-gray-400 transition">
          로그인
        </button>
        
        {/* 구글 로그인 버튼 */}
        <button className="p-3 bg-blue-600 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition">
          {/* 구글 G 로고 흉내내기 */}
          <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">
            G
          </span>
          구글 로그인
        </button>

      </div>
    </div>
  );
};

export default LoginPages;