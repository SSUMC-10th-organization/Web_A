import { useState, useEffect } from 'react';
import useThrottle from '../hooks/useThrottle';

const ThrottlePage = () => {
  const [scrollY, setScrollY] = useState<number>(0);

  const throttledScrollY = useThrottle(scrollY, 2000);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-[300vh] flex flex-col items-center pt-24 px-4">
      <div className="fixed top-20 left-0 right-0 z-30 bg-white shadow-md p-4">
        <div className="max-w-2xl mx-auto flex gap-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">실제 scrollY (즉시)</p>
            <p className="text-2xl font-bold text-red-500">{scrollY}px</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">
              Throttle 적용 scrollY (2초마다)
            </p>
            <p className="text-2xl font-bold text-blue-500">
              {throttledScrollY}px
            </p>
          </div>
        </div>
      </div>

      <div className="mt-32 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          ⚡ Throttle 데모
        </h1>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-blue-800 mb-2">📌 동작 설명</h2>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• 빨간 숫자: 스크롤할 때마다 즉시 업데이트 (리렌더링 폭발)</li>
            <li>• 파란 숫자: useThrottle 적용 → 2초마다 한 번만 업데이트</li>
            <li>• 스크롤을 빠르게 내려보세요!</li>
          </ul>
        </div>

        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800">섹션 {i + 1}</h3>
            <p className="text-gray-500 mt-1 text-sm">
              이 콘텐츠를 스크롤하면서 Throttle 효과를 확인해 보세요. 위의 파란
              숫자는 2초 간격으로만 업데이트됩니다.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThrottlePage;