import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
      <h1 className="mb-4 text-5xl font-bold text-pink-500">404</h1>
      <p className="mb-6 text-lg text-gray-300">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        to="/"
        className="rounded bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
      >
        홈으로 이동
      </Link>
    </div>
  );
}