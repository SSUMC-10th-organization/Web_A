import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function NotFoundPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white text-center">
      <h1 className="mb-4 text-6xl font-black text-pink-500">404</h1>
      <p className="mb-2 text-xl font-bold">페이지를 찾을 수 없습니다.</p>
      <p className="mb-8 text-gray-500 text-sm">
        {isRouteErrorResponse(error) ? error.statusText : "알 수 없는 에러가 발생했습니다."}
      </p>
      <Link
        to="/"
        className="rounded-full bg-pink-500 px-8 py-3 font-bold text-white transition hover:bg-pink-600"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}