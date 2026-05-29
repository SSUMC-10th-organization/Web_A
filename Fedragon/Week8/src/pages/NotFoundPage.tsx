import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-32 text-center">
      <h1 className="text-6xl font-black text-red-500 mb-4">404</h1>
      <p className="text-xl mb-8">찾을 수 없는 페이지입니다.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFoundPage;