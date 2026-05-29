import { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  // ✅ 미션3: ESC 키로 닫기 (접근성 개선)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // cleanup: 메모리 누수 방지
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // ✅ 미션3: 사이드바가 열렸을 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    // 오버레이 (뒷배경) - 클릭 시 닫기
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      {/* 사이드바 본체 - 클릭 이벤트 버블링 방지 */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* 사이드바 헤더 */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">🎵 LP 사이트</h2>
          </div>

          {/* 메뉴 목록 */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>🔍</span>
                  <span className="ml-3 font-medium">찾기</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/mypage"
                  onClick={onClose}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>👤</span>
                  <span className="ml-3 font-medium">마이페이지</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/throttle"
                  onClick={onClose}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>⚡</span>
                  <span className="ml-3 font-medium">Throttle 데모</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
};