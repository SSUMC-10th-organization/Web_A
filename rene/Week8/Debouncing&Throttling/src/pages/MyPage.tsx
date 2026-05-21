import { useCallback, useEffect, useRef, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { defaultProfile } from "../assets";
import EditProfileModal from "../components/modals/EditProfileModal";

type MyInfo = ResponseMyInfoDto["data"];

const MyPage = () => {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const myInfoSnapshot = useRef<MyInfo | null>(null);

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

  if (error) {
    return (
      <main className="min-h-full flex items-center justify-center text-red-400 text-sm">
        {error}
      </main>
    );
  }

  if (isPending && !myInfo) {
    return (
      <main className="min-h-full flex items-center justify-center text-zinc-500 text-sm">
        정보를 가져오는 중입니다...
      </main>
    );
  }

  if (!myInfo) {
    return (
      <main className="min-h-full flex items-center justify-center text-zinc-500 text-sm">
        사용자 정보가 존재하지 않습니다.
      </main>
    );
  }

  return (
    <main className="min-h-full flex flex-col items-center justify-center px-4 gap-4">
      <img
        src={myInfo.avatar ?? defaultProfile}
        alt="프로필"
        className="w-48 h-48 rounded-full object-cover"
      />

      {/* 이름 + 수정 버튼 */}
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-white">{myInfo.name}</h2>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-zinc-400 hover:text-white transition-colors"
          aria-label="프로필 수정"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-zinc-400">{myInfo.email}</p>
      {myInfo.bio && <p className="text-sm text-zinc-400 text-center">{myInfo.bio}</p>}

      {isEditModalOpen && (
        <EditProfileModal
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={(updated) => setMyInfo(updated)}
          onOptimistic={(body) => {
            myInfoSnapshot.current = myInfo;
            setMyInfo((prev) =>
              prev
                ? {
                    ...prev,
                    name: body.name ?? prev.name,
                    bio: body.bio !== undefined ? body.bio : prev.bio,
                    avatar: body.avatar !== undefined ? body.avatar : prev.avatar,
                  }
                : prev
            );
          }}
          onRollback={() => {
            if (myInfoSnapshot.current) setMyInfo(myInfoSnapshot.current);
          }}
          initialName={myInfo.name}
          initialBio={myInfo.bio}
          initialAvatar={myInfo.avatar}
        />
      )}
    </main>
  );
};

export default MyPage;
