import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import defaultProfile from "../assets/default_profile.svg";

type MyInfo = ResponseMyInfoDto["data"];

const MyPage = () => {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyInfo()
      .then((res) => setMyInfo(res.data))
      .catch((err) => {
        console.error(err);
        setError("내 정보를 불러오는데 실패했습니다.");
      });
  }, []);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-400 text-sm">
        {error}
      </main>
    );
  }

  if (!myInfo) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        불러오는 중...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 gap-4">
      <img
        src={myInfo.avatar ?? defaultProfile}
        alt="프로필"
        className="w-50 h-50 rounded-full object-cover"
      />
      <h2 className="text-xl font-semibold text-gray-900">{myInfo.name}</h2>
      <p className="text-sm text-gray-500">{myInfo.email}</p>
      {myInfo.bio && <p className="text-sm text-gray-600 text-center">{myInfo.bio}</p>}
    </main>
  );
};

export default MyPage;
