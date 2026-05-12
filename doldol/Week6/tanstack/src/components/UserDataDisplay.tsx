import { useState } from 'react';
import { useCustomFetch } from '../hooks/useCustomFetch';

// ✅ 인터페이스 이름을 WelcomeData → UserData로 변경
interface UserData {
  id: number;
  name: string;
  email: string;
}

export const WelcomeData = () => {
  const [userId, setUserId] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleChangeUser = () => {
    setUserId(Math.floor(Math.random() * 10) + 1);
  };

  const handleTestRetry = () => {
    setUserId(999999);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* ✅ fixed 제거하고 일반 레이아웃으로 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={handleChangeUser}>다른 사용자 불러오기</button>
        <button onClick={() => setIsVisible(!isVisible)}>
          컴포넌트 토글 (언마운트 테스트)
        </button>
        <button onClick={handleTestRetry} style={{ background: '#ff9800', color: 'white' }}>
          재시도 테스트 (404 에러)
        </button>
      </div>

      {isVisible && <UserDataDisplay userId={userId} />}
    </div>
  );
};

const UserDataDisplay = ({ userId }: { userId: number }) => {
  // ✅ 제네릭 타입도 UserData로 수정
  const { data, isPending, isError } = useCustomFetch<UserData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) return <div>Loading... (User ID: {userId})</div>;
  if (isError) return <div>Error Occurred</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.email}</p>
      <p style={{ fontSize: '12px', color: '#666' }}>User ID: {data?.id}</p>
    </div>
  );
};