import { memo } from "react";

const Footer = memo(() => {
  return (
    <footer className="w-full bg-black text-gray-400 py-10 px-8 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="text-pink-500 font-bold text-lg mb-2">RENE LP</p>
          <p className="text-sm">UMC 10기 WEB RENE LP 세상의 모든 LP </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <p className="text-white font-semibold mb-1">서비스</p>
            <span className="hover:text-white cursor-pointer transition-colors">LP 탐색</span>
            <span className="hover:text-white cursor-pointer transition-colors">랭킹</span>
            <span className="hover:text-white cursor-pointer transition-colors">상세</span>
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
        © 2026 RENE LP. All rights reserved.
      </div>
    </footer>
  );
});

export default Footer;