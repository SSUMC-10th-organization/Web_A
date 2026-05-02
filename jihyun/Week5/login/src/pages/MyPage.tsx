import { useEffect, useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { getMyInfo } from "../apis/auth"; // 본인 api 함수명 확인

const MyPage = () => {
  const { logout } = useAuth();
  interface UserInfo {
  id: number;
  name: string;
  email: string;
}
const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getMyInfo();
      setUser(response.data);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <h1>마이페이지</h1>
      {user && (
        <>
          <p>{user.email}</p>
        </>
      )}
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default MyPage;