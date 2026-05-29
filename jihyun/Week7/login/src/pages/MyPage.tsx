import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUpdateMyInfo } from '../hooks/mutations/useUpdateMyInfo';
import { useDeleteMyAccount } from '../hooks/mutations/useDeleteMyAccount';
import { getMyInfo } from '../apis/auth';
import { useQuery } from '@tanstack/react-query';
import { uploadImage } from '../apis/lp';
import { useGetMyLPList } from '../hooks/queries/useGetMyLPList';
import { useGetMyLikedLPList } from '../hooks/queries/useGetMyLikedLPList';

const MyPage = () => {
  const navigate = useNavigate();
  const { logout, accessToken } = useAuth();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: myData } = useQuery({
    queryKey: ['me'],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  const { mutate: updateMyInfo, isPending: isUpdating } = useUpdateMyInfo();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteMyAccount();

  // 내가 작성한 LP
  const {
    data: myLPData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMyLPList();
  const myLPs = myLPData?.pages.flatMap((page) => page.data.data) ?? [];

  // 내가 좋아요한 LP
  const {
    data: myLikedLPData,
    fetchNextPage: fetchNextLikedPage,
    hasNextPage: hasNextLikedPage,
    isFetchingNextPage: isFetchingNextLikedPage,
  } = useGetMyLikedLPList();
  const myLikedLPs = myLikedLPData?.pages.flatMap((page) => page.data.data) ?? [];

  const me = myData?.data;

  const handleOpenEdit = () => {
    setEditName(me?.name ?? '');
    setEditBio(me?.bio ?? '');
    setEditAvatar(me?.avatar ?? '');
    setIsEditOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setEditAvatar(imageUrl);
    } catch (e) {
      console.error('이미지 업로드 실패', e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditSubmit = () => {
    updateMyInfo(
      {
        name: editName || undefined,
        bio: editBio || undefined,
        avatar: editAvatar || undefined,
      },
      { onSuccess: () => setIsEditOpen(false) }
    );
  };

  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: () => navigate('/login'),
    });
  };

  if (!me) return <div className="p-6 text-center text-white">불러오는 중...</div>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {/* 프로필 카드 */}
      <div className="rounded-2xl bg-gray-900 p-6">
        <div className="flex flex-col items-center gap-4">
          {me.avatar ? (
            <img src={me.avatar} alt="avatar" className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-700 text-2xl text-white">
              {me.name?.[0] ?? '?'}
            </div>
          )}
          <h1 className="text-2xl font-bold text-white">{me.name}</h1>
          <p className="text-gray-400">{me.bio ?? '소개가 없습니다.'}</p>
          <p className="text-sm text-gray-500">{me.email}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleOpenEdit}
            className="w-full rounded-md bg-pink-500 py-2 font-semibold text-white hover:bg-pink-600"
          >
            ⚙ 설정
          </button>
          <button
            onClick={logout}
            className="w-full rounded-md border border-gray-600 py-2 text-white hover:bg-gray-800"
          >
            로그아웃
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full rounded-md border border-red-700 py-2 text-red-400 hover:bg-red-900/20"
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {/* 내가 작성한 LP */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-white">내가 작성한 LP</h2>
        {myLPs.length === 0 ? (
          <p className="text-center text-gray-500">작성한 LP가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {myLPs.map((lp) => (
              <Link
                key={lp.id}
                to={`/lps/${lp.id}`}
                className="overflow-hidden rounded-xl bg-gray-900 transition hover:opacity-80"
              >
                {lp.thumbnail ? (
                  <img src={lp.thumbnail} alt={lp.title} className="h-36 w-full object-cover" />
                ) : (
                  <div className="flex h-36 w-full items-center justify-center bg-gray-700 text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-white">{lp.title}</p>
                  <p className="mt-1 text-xs text-gray-400">❤️ {lp.likes.length}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-4 w-full rounded-md border border-gray-600 py-2 text-sm text-gray-400 hover:bg-gray-800 disabled:opacity-50"
          >
            {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
          </button>
        )}
      </div>

      {/* 내가 좋아요한 LP */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-white">내가 좋아요한 LP</h2>
        {myLikedLPs.length === 0 ? (
          <p className="text-center text-gray-500">좋아요한 LP가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {myLikedLPs.map((lp) => (
              <Link
                key={lp.id}
                to={`/lps/${lp.id}`}
                className="overflow-hidden rounded-xl bg-gray-900 transition hover:opacity-80"
              >
                {lp.thumbnail ? (
                  <img src={lp.thumbnail} alt={lp.title} className="h-36 w-full object-cover" />
                ) : (
                  <div className="flex h-36 w-full items-center justify-center bg-gray-700 text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-white">{lp.title}</p>
                  <p className="mt-1 text-xs text-gray-400">❤️ {lp.likes.length}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {hasNextLikedPage && (
          <button
            onClick={() => fetchNextLikedPage()}
            disabled={isFetchingNextLikedPage}
            className="mt-4 w-full rounded-md border border-gray-600 py-2 text-sm text-gray-400 hover:bg-gray-800 disabled:opacity-50"
          >
            {isFetchingNextLikedPage ? '불러오는 중...' : '더 보기'}
          </button>
        )}
      </div>

      {/* 프로필 수정 모달 */}
      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) setIsEditOpen(false); }}
        >
          <div className="w-full max-w-md rounded-2xl bg-gray-900 p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-white">프로필 수정</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">이름</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Bio (선택)</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-md border border-gray-700 bg-black px-4 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  프로필 사진 (선택)
                  {isUploading && <span className="ml-2 text-pink-400">업로드 중...</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-white hover:file:bg-pink-600"
                />
                {editAvatar && (
                  <img src={editAvatar} alt="preview" className="mt-2 h-20 w-20 rounded-full object-cover" />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditSubmit}
                  disabled={isUpdating || isUploading}
                  className="flex-1 rounded-md bg-pink-500 py-2 font-semibold text-white hover:bg-pink-600 disabled:bg-gray-600"
                >
                  {isUpdating ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-md border border-gray-600 py-2 text-white hover:bg-gray-800"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 탈퇴 확인 모달 */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) setIsDeleteModalOpen(false); }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-gray-900 p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-white">정말 탈퇴하시겠어요?</h2>
            <p className="mb-6 text-sm text-gray-400">탈퇴 후에는 계정을 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 rounded-md bg-red-600 py-2 font-semibold text-white hover:bg-red-700 disabled:bg-gray-600"
              >
                {isDeleting ? '처리 중...' : '예'}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-md border border-gray-600 py-2 text-white hover:bg-gray-800"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MyPage;