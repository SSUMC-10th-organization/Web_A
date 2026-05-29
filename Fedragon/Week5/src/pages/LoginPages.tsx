import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleMockLogin = () => {
    localStorage.setItem('accessToken', 'fake-token-123456');
    
    alert('로그인 성공! 토큰이 발급되었습니다. 🔓');
    
    navigate('/'); 
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>여기는 로그인 페이지입니다 🔑</h2>
      <p>보호된 페이지에서 튕겨져 나왔다면 이곳으로 오게 됩니다.</p>
      
      <button 
        onClick={handleMockLogin}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}
      >
        임시 로그인 버튼 (가짜 토큰 발급)
      </button>
    </div>
  );
};

export default LoginPage;