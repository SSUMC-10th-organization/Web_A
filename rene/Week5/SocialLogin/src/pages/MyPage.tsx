import { useCallback, useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import defaultProfile from "../assets/default_profile.svg";

type MyInfo = ResponseMyInfoDto["data"];

const MyPage = () => {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyInfo = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);
      const res = await getMyInfo();
      setMyInfo(res.data);
    } catch (err) {
      console.error(err);
      setError("내 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    fetchMyInfo();
  }, [fetchMyInfo]);

  // 1. 에러가 발생한 경우
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-400 text-sm">
        {error}
      </main>
    );
  }

  // 2. 데이터를 불러오는 중인 경우
  if (isPending && !myInfo) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        정보를 가져오는 중입니다...
      </main>
    );
  }

  // 3. 데이터 로딩이 끝났지만, 데이터가 없는 경우
  if (!myInfo) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        사용자 정보가 존재하지 않습니다.
      </main>
    );
  }

  // 4. 정상적으로 데이터를 불러온 경우
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 gap-4">
      <img
        src={myInfo.avatar ?? defaultProfile}
        alt="프로필"
        className="w-48 h-48 rounded-full object-cover"
      />
      <h2 className="text-xl font-semibold text-gray-900">{myInfo.name}</h2>
      <p className="text-sm text-gray-500">{myInfo.email}</p>
      {myInfo.bio && <p className="text-sm text-gray-600 text-center">{myInfo.bio}</p>}
    </main>
  );
};

export default MyPage;
