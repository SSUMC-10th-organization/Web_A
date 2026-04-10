const Footer = () => {
  return (
    <footer className="w-full bg-black text-gray-400 py-10 px-8 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="text-pink-500 font-bold text-lg mb-2">돌려돌려LP판</p>
          <p className="text-sm">UMC 10기 WEB RENE 음악을 더 가까이, 바이닐의 감성으로.</p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <p className="text-white font-semibold mb-1">서비스</p>
            <span className="hover:text-white cursor-pointer transition-colors">LP 탐색</span>
            <span className="hover:text-white cursor-pointer transition-colors">차트</span>
            <span className="hover:text-white cursor-pointer transition-colors">아티스트</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-white font-semibold mb-1">고객지원</p>
            <span className="hover:text-white cursor-pointer transition-colors">공지사항</span>
            <span className="hover:text-white cursor-pointer transition-colors">FAQ</span>
            <span className="hover:text-white cursor-pointer transition-colors">문의하기</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-white font-semibold mb-1">약관</p>
            <span className="hover:text-white cursor-pointer transition-colors">이용약관</span>
            <span className="hover:text-white cursor-pointer transition-colors">개인정보처리방침</span>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 border-t border-gray-700 pt-4 text-xs text-center">
        © 2026 돌려돌려LP판. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
